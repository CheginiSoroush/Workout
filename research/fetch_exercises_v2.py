#!/usr/bin/env python3
"""v2: Re-fetch clean exercise photos for the 11 failed audit ids.
Only image extensions are accepted (no .url pollution).
Usage: python3 fetch_exercises_v2.py [id ...]"""
import json, os, re, subprocess, sys, time

IDS = {
  "pull-up": "man doing pull ups on bar gym back view photograph",
  "barbell-row": "man barbell bent over row back exercise gym photograph",
  "lat-pulldown": "man lat pulldown machine front gym exercise photograph",
  "face-pull": "man cable face pull rope attachment gym exercise photograph",
  "db-shoulder-press": "seated dumbbell shoulder press man gym photograph",
  "cable-fly": "standing cable chest fly machine gym man photograph",
  "rope-pushdown": "man triceps rope pushdown cable machine gym photograph",
  "lateral-raise": "man dumbbell lateral raise standing gym photograph",
  "leg-press": "man using leg press machine gym exercise photograph",
  "calf-raise": "man standing calf raise exercise gym machine photograph",
  "hanging-leg-raise": "man hanging leg raise abs exercise gym photograph",
}

OUTDIR = "/home/z/my-project/public/exercises"
IMG_EXT = (".jpg", ".jpeg", ".png", ".webp")

only = set(sys.argv[1:]) or set(IDS.keys())

def have(i):
    for ext in IMG_EXT:
        p = f"{OUTDIR}/{i}{ext}"
        if os.path.exists(p) and os.path.getsize(p) > 8000:
            return p
    return None

ok, fail = [], []
for i, q in IDS.items():
    if i not in only:
        continue
    if have(i):
        print(f"[cached] {i}", flush=True); ok.append(i); continue
    try:
        r = subprocess.run(
            ["z-ai", "image-search", "-q", q, "--count", "6", "--gl", "us", "--no-rank"],
            capture_output=True, text=True, timeout=150)
        m = re.search(r"\{.*\}", r.stdout, re.S)
        if not m:
            print(f"[nojson] {i}", flush=True); fail.append(i); continue
        data = json.loads(m.group(0))
        if not data.get("success") or not data.get("results"):
            print(f"[noresult] {i}", flush=True); fail.append(i); continue
        results = sorted(
            data["results"],
            key=lambda x: -int(str(x.get("original_width", "0")).replace("px", "") or 0))
        done = False
        for res in results[:6]:
            url = res.get("original_url")
            if not url:
                continue
            ext = os.path.splitext(url)[1].lower().split("?")[0]
            if ext not in IMG_EXT:
                ext = ".jpg"
            path = f"{OUTDIR}/{i}{ext}"
            rc = subprocess.run(["curl", "-sL", "--max-time", "40", "-o", path, url]).returncode
            size = os.path.getsize(path) if os.path.exists(path) else 0
            if rc == 0 and size > 8000:
                print(f"[ok] {i} ({size//1024}KB) {url[:80]}", flush=True)
                ok.append(i); done = True
                break
            if os.path.exists(path):
                os.remove(path)
        if not done:
            print(f"[dlfail] {i}", flush=True); fail.append(i)
    except Exception as e:
        print(f"[err] {i}: {e}", flush=True); fail.append(i)
    time.sleep(4)

print(f"SUMMARY ok={len(ok)} fail={len(fail)} failed={fail}", flush=True)
