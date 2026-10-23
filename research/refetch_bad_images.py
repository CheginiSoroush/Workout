#!/usr/bin/env python3
"""Re-fetch problematic exercise images with more specific queries."""
import json, os, re, subprocess, sys, time

IDS = {
  "bench-press": "man doing flat barbell bench press on bench side view gym fitness",
  "rope-pushdown": "standing triceps rope pushdown cable machine straight body gym",
  "face-pull": "face pull exercise rope cable station athlete rear deltoids",
  "straight-arm-pulldown": "standing straight arm pulldown cable bar lats gym exercise",
  "calf-raise": "standing calf raise on machine toes gym exercise demonstration",
  "ez-curl": "standing EZ bar curl biceps exercise gym demonstration",
}

OUTDIR = "/home/z/my-project/public/exercises"

ok, fail = [], []
for i, q in IDS.items():
    try:
        r = subprocess.run(
            ["z-ai", "image-search", "-q", q, "--count", "4", "--gl", "us", "--no-rank"],
            capture_output=True, text=True, timeout=150
        )
        m = re.search(r'\{.*\}', r.stdout, re.S)
        if not m:
            print(f"[nojson] {i}"); fail.append(i); continue
        data = json.loads(m.group(0))
        if not data.get("success") or not data.get("results"):
            print(f"[noresult] {i}"); fail.append(i); continue
        results = sorted(data["results"], key=lambda x: -int(str(x.get("original_width", "0")).replace("px", "") or 0))
        done = False
        for n, res in enumerate(results[:4]):
            url = res.get("original_url")
            if not url:
                continue
            ext = os.path.splitext(url)[1].lower().split("?")[0] or ".jpg"
            if ext not in (".jpg", ".jpeg", ".png", ".webp"):
                ext = ".jpg"
            path = f"{OUTDIR}/{i}{ext}"
            rc = subprocess.run(["curl", "-sL", "--max-time", "40", "-o", path, url]).returncode
            size = os.path.getsize(path) if os.path.exists(path) else 0
            if rc == 0 and size > 8000:
                print(f"[ok{n}] {i} ({size//1024}KB) <- {url[:70]}")
                ok.append(i); done = True
                break
        if not done:
            print(f"[dlfail] {i}"); fail.append(i)
    except Exception as e:
        print(f"[err] {i}: {e}"); fail.append(i)
    time.sleep(4)

print(f"SUMMARY ok={len(ok)} fail={len(fail)} failed={fail}")
