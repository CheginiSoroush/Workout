#!/usr/bin/env python3
"""Serial stretch video generation (API allows ~1 concurrent task).
Resume-safe: skips stretches whose MP4 already exists.
Usage: python3 gen_stretch_videos.py [deadline_seconds]
"""
import json, os, re, subprocess, sys, time

STRETCH_DIR = "/home/z/my-project/public/stretches"
VID_DIR = f"{STRETCH_DIR}/videos"
TASK_DIR = "/home/z/my-project/research/videotasks"
os.makedirs(VID_DIR, exist_ok=True)
os.makedirs(TASK_DIR, exist_ok=True)

PROMPTS = {
  "neck": "the person slowly tilts the head to the side and gently holds the neck stretch with one hand, calm steady breathing",
  "shoulder-cross": "the person slowly pulls one arm across the chest and holds the shoulder stretch with the other hand",
  "doorway-pec": "the person leans the chest forward, opening the chest and holding the pec stretch",
  "cat-cow": "the person slowly alternates arching and rounding the spine, moving smoothly between cat and cow poses",
  "openbook": "the person lying on their back slowly drops both bent knees to one side while opening the opposite arm out to the floor",
  "childs-pose": "the person slowly settles deeper into the childs pose resting stretch, breathing calmly",
  "figure4": "the person lying on their back slowly pulls the knee toward the chest, deepening the glute stretch",
  "hamstring": "the person lying on their back slowly pulls one leg up with the strap, deepening the hamstring stretch",
  "calf": "the person leans forward pressing the rear heel down to stretch the calf and holds it",
  "wall-lat": "the person pushes the hips back reaching arms along the wall, stretching the lats and holds it",
  "deadhang": "the person hangs relaxed from the pull-up bar, shoulders stabilizing, slight decompression",
}
ORDER = ["shoulder-cross", "figure4", "hamstring", "cat-cow", "childs-pose", "doorway-pec", "calf", "wall-lat", "openbook", "deadhang"]
BASE = "Realistic fitness tutorial video, single continuous shot: "

def parse_json(txt):
    m = re.search(r'\{.*\}', txt, re.S)
    return json.loads(m.group(0)) if m else None

def get_task_id(sid):
    d = json.load(open(f"{TASK_DIR}/{sid}.json"))
    for k in ("id", "taskId", "task_id"):
        if k in d: return str(d[k])
    if isinstance(d.get("data"), dict):
        for k in ("id", "taskId", "task_id"):
            if k in d["data"]: return str(d["data"][k])
    return ""

def find_video_url(d):
    def _walk(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if isinstance(v, str) and v.startswith("http") and (".mp4" in v or ".webm" in v):
                    return v
                r = _walk(v)
                if r: return r
        elif isinstance(o, list):
            for v in o:
                r = _walk(v)
                if r: return r
        return None
    return _walk(d)

def fire(sid):
    url_file = f"{STRETCH_DIR}/{sid}.url"
    if not os.path.exists(url_file):
        return None
    url = open(url_file).read().strip()
    prompt = BASE + PROMPTS[sid] + " No text, no watermark."
    out = f"{TASK_DIR}/{sid}.json"
    r = subprocess.run(
        ["z-ai", "video", "-i", url, "-p", prompt, "-d", "5", "-q", "speed", "-o", out],
        capture_output=True, text=True, timeout=180
    )
    d = parse_json(r.stdout)
    if d and (d.get("id") or d.get("taskId")):
        return d
    return None

def download_video(sid, result):
    vurl = find_video_url(result)
    if not vurl:
        print(f"[no-url-in-result] {sid}", flush=True)
        return False
    dest = f"{VID_DIR}/{sid}.mp4"
    subprocess.run(["curl", "-sL", "--max-time", "120", "-o", dest, vurl])
    sz = os.path.getsize(dest) if os.path.exists(dest) else 0
    if sz > 20000:
        print(f"[video-ok] {sid} ({sz//1024}KB)", flush=True)
        return True
    print(f"[dl-fail] {sid}", flush=True)
    return False

def main():
    deadline = time.time() + int(sys.argv[1] if len(sys.argv) > 1 else 540)
    last_fire = 0
    while time.time() < deadline:
        progressed = False
        # 1) poll all existing tasks
        for sid in ORDER:
            tf = f"{TASK_DIR}/{sid}.json"
            if not (os.path.exists(tf) and os.path.getsize(tf) > 50):
                continue
            if os.path.exists(f"{VID_DIR}/{sid}.mp4") and os.path.getsize(f"{VID_DIR}/{sid}.mp4") > 20000:
                continue
            r = subprocess.run(["z-ai", "async-result", "-i", get_task_id(sid)],
                               capture_output=True, text=True, timeout=60)
            d = parse_json(r.stdout)
            status = str(d.get("task_status", d.get("status", ""))).lower() if d else ""
            if status in ("success", "succeed", "completed", "succeeded"):
                if download_video(sid, d):
                    os.remove(tf)
                    progressed = True
            elif status in ("failed", "fail", "error"):
                print(f"[gen-failed] {sid} — will refire", flush=True)
                os.remove(tf)
        # 2) fire next pending (paced)
        now = time.time()
        if now - last_fire > 230:
            for sid in ORDER:
                if os.path.exists(f"{VID_DIR}/{sid}.mp4") and os.path.getsize(f"{VID_DIR}/{sid}.mp4") > 20000:
                    continue
                if os.path.exists(f"{TASK_DIR}/{sid}.json") and os.path.getsize(f"{TASK_DIR}/{sid}.json") > 50:
                    continue
                if not os.path.exists(f"{STRETCH_DIR}/{sid}.url"):
                    continue
                d = fire(sid)
                if d:
                    last_fire = now
                    print(f"[fired] {sid} @t={int(now % 100000)}", flush=True)
                else:
                    last_fire = now - 200  # retry sooner on failure
                    print(f"[fire-fail] {sid} (cooldown shorter)", flush=True)
                break
        time.sleep(15)
    remaining = [s for s in ORDER if not os.path.exists(f"{VID_DIR}/{s}.mp4")]
    print(f"CALL_END remaining={remaining}", flush=True)

if __name__ == "__main__":
    main()
