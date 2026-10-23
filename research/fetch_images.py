#!/usr/bin/env python3
"""Fetch exercise demo images: search via z-ai image-search (stdout), parse, download."""
import json, os, re, subprocess, sys

IDS = {
  "bench-press": "barbell bench press exercise demonstration in gym",
  "incline-db-press": "incline dumbbell bench press exercise demonstration",
  "db-shoulder-press": "seated dumbbell shoulder press exercise demonstration",
  "cable-fly": "standing cable chest fly exercise demonstration",
  "rope-pushdown": "cable rope triceps pushdown exercise demonstration",
  "lateral-raise": "dumbbell lateral raise side shoulder exercise demonstration",
  "pull-up": "pull up bar exercise demonstration lat muscles",
  "barbell-row": "barbell bent over row back exercise demonstration",
  "lat-pulldown": "wide grip lat pulldown machine exercise demonstration",
  "face-pull": "cable face pull rear delt exercise demonstration",
  "ez-curl": "EZ bar biceps curl exercise demonstration",
  "straight-arm-pulldown": "straight arm cable pulldown lats exercise demonstration",
  "leg-press": "leg press machine exercise demonstration",
  "rdl": "romanian deadlift barbell hamstring exercise demonstration",
  "bulgarian-split-squat": "bulgarian split squat dumbbell exercise demonstration",
  "leg-curl": "lying leg curl machine hamstring exercise demonstration",
  "calf-raise": "standing calf raise machine exercise demonstration",
  "hanging-leg-raise": "hanging leg raise abs exercise demonstration",
  "cable-crunch": "kneeling cable crunch abdominal exercise demonstration",
}

OUTDIR = "/home/z/my-project/public/exercises"
os.makedirs(OUTDIR, exist_ok=True)

only = set(sys.argv[1:]) or set(IDS.keys())

ok, fail = [], []
for i, q in IDS.items():
    if i not in only:
        continue
    dest = None
    # skip if already downloaded
    for ext in (".jpg", ".jpeg", ".png", ".webp", ".gif"):
        if os.path.exists(f"{OUTDIR}/{i}{ext}") and os.path.getsize(f"{OUTDIR}/{i}{ext}") > 8000:
            dest = "cached"; break
    if dest == "cached":
        print(f"[cached] {i}"); ok.append(i); continue

    try:
        r = subprocess.run(
            ["z-ai", "image-search", "-q", q, "--count", "3", "--gl", "us", "--no-rank"],
            capture_output=True, text=True, timeout=150
        )
        out = r.stdout
        m = re.search(r'\{.*\}', out, re.S)
        if not m:
            print(f"[nojson] {i} :: {out[:120]}"); fail.append(i); continue
        data = json.loads(m.group(0))
        if not data.get("success") or not data.get("results"):
            print(f"[noresult] {i}"); fail.append(i); continue
        results = sorted(data["results"], key=lambda x: -int(str(x.get("original_width", "0")).replace("px", "") or 0))
        done = False
        for res in results[:3]:
            url = res.get("original_url")
            if not url:
                continue
            ext = os.path.splitext(url)[1].lower().split("?")[0] or ".jpg"
            if ext not in (".jpg", ".jpeg", ".png", ".webp", ".gif"):
                ext = ".jpg"
            path = f"{OUTDIR}/{i}{ext}"
            rc = subprocess.run(["curl", "-sL", "--max-time", "40", "-o", path, url]).returncode
            size = os.path.getsize(path) if os.path.exists(path) else 0
            if rc == 0 and size > 8000:
                print(f"[ok] {i} ({size//1024}KB)")
                ok.append(i); done = True
                break
        if not done:
            print(f"[dlfail] {i}"); fail.append(i)
    except Exception as e:
        print(f"[err] {i}: {e}"); fail.append(i)
    import time; time.sleep(4)

print(f"SUMMARY ok={len(ok)} fail={len(fail)} failed={fail}")
