#!/usr/bin/env python3
"""v3: Serial video generation from LOCAL images via base64 input.
Targets: 19 gym exercises (10s) + 3 stretches that lacked videos (10s).
Resume-safe: skips ids whose MP4 exists; task files in research/videotasks.
Usage: python3 gen_media_v3.py [deadline_seconds] [fire_spacing_seconds]
"""
import base64, glob, json, os, re, subprocess, sys, time

ROOT = "/home/z/my-project"
TASK_DIR = f"{ROOT}/research/videotasks"
os.makedirs(TASK_DIR, exist_ok=True)

BASE = "Realistic gym fitness tutorial video, single continuous shot: "
TAIL = ". Perfect exercise form, steady controlled tempo. No text, no watermark."

EXERCISES = {
  "bench-press": "the person performs a controlled barbell bench press, lowering the bar to the chest and pressing back up",
  "incline-db-press": "the person performs dumbbell presses on an incline bench, lowering the dumbbells to chest level and pressing up",
  "db-shoulder-press": "the person performs a seated dumbbell shoulder press, pressing the dumbbells overhead and lowering them",
  "cable-fly": "the person performs standing cable chest flys, bringing the handles together in front of the chest and opening back",
  "rope-pushdown": "the person performs a cable rope triceps pushdown, extending the arms down and controlling back up",
  "lateral-raise": "the person performs dumbbell lateral raises, raising the arms out to the sides to shoulder height and lowering",
  "pull-up": "the person performs machine assisted pull ups, pulling the body up until the chin is above the handles and lowering slowly",
  "barbell-row": "the person performs a bent over barbell row, pulling the bar toward the lower chest and lowering with control",
  "lat-pulldown": "the person performs a lat pulldown, pulling the bar down to the upper chest and releasing up with control",
  "face-pull": "the person performs a cable face pull, pulling the rope toward the face with elbows high and returning",
  "ez-curl": "the person performs barbell curls, curling the bar toward the shoulders and lowering slowly",
  "straight-arm-pulldown": "the person performs a straight arm cable pulldown, sweeping the bar down to the thighs and returning",
  "leg-press": "the person performs machine leg presses, extending the legs and lowering the platform with control",
  "rdl": "the person performs romanian deadlifts, hinging at the hips, lowering the bar along the legs and standing back up",
  "bulgarian-split-squat": "the person performs bulgarian split squats, lowering the rear knee toward the floor and driving back up",
  "leg-curl": "the person performs lying leg curls, curling the heels toward the glutes and lowering slowly",
  "calf-raise": "the person performs standing calf raises, rising onto the toes and lowering the heels",
  "hanging-leg-raise": "the person performs hanging leg raises, lifting the knees toward the chest and lowering with control",
  "cable-crunch": "the person performs kneeling cable crunches, curling the torso down toward the floor and returning up",
}
STRETCH_EXTRA = {
  "hip-flexor": "the person in a half kneeling position gently pushes the hips forward, deepening the hip flexor stretch and holds it",
  "mckenzie": "the person lying prone presses the upper body up with straight arms into a gentle back extension and lowers back down",
  "quad": "the person standing pulls one heel toward the glutes holding the quad stretch with an upright torso",
}

IMG_EXT = (".jpg", ".jpeg", ".png", ".webp")

def pick_photo(group, iid):
    for ext in IMG_EXT:
        p = f"{ROOT}/public/{group}/{iid}{ext}"
        if os.path.exists(p):
            return p
    return None

def items():
    out = []
    for eid, motion in EXERCISES.items():
        p = pick_photo("exercises", eid)
        if p:
            out.append(("exercises", eid, p, BASE + motion + TAIL))
    for sid, motion in STRETCH_EXTRA.items():
        p = pick_photo("stretches", sid)
        if p:
            out.append(("stretches", sid, p, BASE + motion + TAIL))
    return out

ITEMS = items()
BY_ID = {iid: (grp, img, prompt) for grp, iid, img, prompt in ITEMS}
ORDER = [iid for _, iid, _, _ in ITEMS]

def vid_dir(group): return f"{ROOT}/public/{group}/videos"

def has_mp4(group, iid):
    p = f"{vid_dir(group)}/{iid}.mp4"
    return os.path.exists(p) and os.path.getsize(p) > 20000

def parse_json(txt):
    m = re.search(r"\{.*\}", txt, re.S)
    return json.loads(m.group(0)) if m else None

def get_task_id(path):
    d = json.load(open(path))
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

def fire(group, iid, img_path, prompt):
    mime = "image/png" if img_path.lower().endswith(".png") else "image/jpeg"
    b64 = base64.b64encode(open(img_path, "rb").read()).decode()
    data_uri = f"data:{mime};base64,{b64}"
    out = f"{TASK_DIR}/{iid}.json"
    r = subprocess.run(
        ["z-ai", "video", "-i", data_uri, "-p", prompt, "-d", "10", "-q", "speed", "-o", out],
        capture_output=True, text=True, timeout=180)
    d = parse_json(r.stdout)
    return d if d and (d.get("id") or d.get("taskId") or (isinstance(d.get("data"), dict) and d["data"].get("id"))) else None

def download(group, iid, result):
    vurl = find_video_url(result)
    if not vurl:
        print(f"[no-url] {iid}", flush=True)
        return False
    dest = f"{vid_dir(group)}/{iid}.mp4"
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    subprocess.run(["curl", "-sL", "--max-time", "180", "-o", dest, vurl])
    sz = os.path.getsize(dest) if os.path.exists(dest) else 0
    if sz > 20000:
        print(f"[video-ok] {iid} ({sz//1024}KB)", flush=True)
        return True
    print(f"[dl-fail] {iid}", flush=True)
    return False

def main():
    deadline = time.time() + int(sys.argv[1] if len(sys.argv) > 1 else 560)
    spacing = int(sys.argv[2] if len(sys.argv) > 2 else 230)
    last_fire = 0
    while time.time() < deadline:
        # 1) poll pending tasks
        for iid in ORDER:
            tf = f"{TASK_DIR}/{iid}.json"
            if not (os.path.exists(tf) and os.path.getsize(tf) > 50):
                continue
            grp, _, _ = BY_ID[iid]
            if has_mp4(grp, iid):
                continue
            r = subprocess.run(["z-ai", "async-result", "-i", get_task_id(tf)],
                               capture_output=True, text=True, timeout=60)
            d = parse_json(r.stdout)
            status = str(d.get("task_status", d.get("status", ""))).lower() if d else ""
            if status in ("success", "succeed", "completed", "succeeded"):
                if download(grp, iid, d):
                    os.remove(tf)
            elif status in ("failed", "fail", "error"):
                print(f"[gen-failed] {iid} — will refire", flush=True)
                os.remove(tf)
        # 2) fire next pending (paced)
        now = time.time()
        if now - last_fire > spacing:
            for iid in ORDER:
                grp, img, prompt = BY_ID[iid]
                if has_mp4(grp, iid):
                    continue
                tf = f"{TASK_DIR}/{iid}.json"
                if os.path.exists(tf) and os.path.getsize(tf) > 50:
                    continue
                d = fire(grp, iid, img, prompt)
                if d:
                    last_fire = now
                    print(f"[fired] {iid} @t={int(now % 100000)}", flush=True)
                else:
                    last_fire = now - (spacing - 40)
                    print(f"[fire-fail] {iid} (short cooldown)", flush=True)
                break
        time.sleep(15)
    remaining = [i for i in ORDER if not has_mp4(BY_ID[i][0], i)]
    print(f"CALL_END remaining={remaining}", flush=True)

if __name__ == "__main__":
    main()
