#!/usr/bin/env python3
"""Fetch full-body stretch demo images: search via z-ai image-search, download locally."""
import json, os, re, subprocess, sys, time

IDS = {
  "neck": "side neck stretch exercise demonstration hand pulls head",
  "shoulder-cross": "cross body shoulder stretch arm across chest exercise demonstration",
  "doorway-pec": "doorway chest pec stretch exercise demonstration",
  "cat-cow": "cat cow yoga pose demonstration spine mobility",
  "openbook": "supine spinal twist stretch lying yoga photograph",
  "childs-pose": "childs pose yoga stretch demonstration resting",
  "hip-flexor": "low lunge kneel stretch front split warmup photograph",
  "figure4": "piriformis glute stretch lying photograph fitness",
  "hamstring": "supine hamstring stretch strap photograph fitness",
  "quad": "runner pulling foot heel to glutes standing stretch photograph",
  "calf": "standing calf stretch against wall photograph fitness",
  "mckenzie": "woman cobra stretch exercise mat photograph",
  "wall-lat": "lat stretch on wall with arms elevated demonstration",
  "deadhang": "dead hang from pull up bar shoulders demonstration",
}

OUTDIR = "/home/z/my-project/public/stretches"
os.makedirs(OUTDIR, exist_ok=True)

only = set(sys.argv[1:]) or set(IDS.keys())

ok, fail = [], []
for i, q in IDS.items():
    if i not in only:
        continue
    # skip if already downloaded
    cached = False
    for ext in (".jpg", ".jpeg", ".png", ".webp", ".gif"):
        if os.path.exists(f"{OUTDIR}/{i}{ext}") and os.path.getsize(f"{OUTDIR}/{i}{ext}") > 8000:
            cached = True; break
    if cached:
        print(f"[cached] {i}", flush=True); ok.append(i); continue

    try:
        r = subprocess.run(
            ["z-ai", "image-search", "-q", q, "--count", "4", "--gl", "us", "--no-rank"],
            capture_output=True, text=True, timeout=150
        )
        m = re.search(r'\{.*\}', r.stdout, re.S)
        if not m:
            print(f"[nojson] {i}", flush=True); fail.append(i); continue
        data = json.loads(m.group(0))
        if not data.get("success") or not data.get("results"):
            print(f"[noresult] {i}", flush=True); fail.append(i); continue
        results = sorted(data["results"], key=lambda x: -int(str(x.get("original_width", "0")).replace("px", "") or 0))
        done = False
        for res in results[:4]:
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
                # save public OSS url for image-to-video generation
                with open(f"{OUTDIR}/{i}.url", "w") as f:
                    f.write(url)
                print(f"[ok] {i} ({size//1024}KB)", flush=True)
                ok.append(i); done = True
                break
        if not done:
            print(f"[dlfail] {i}", flush=True); fail.append(i)
    except Exception as e:
        print(f"[err] {i}: {e}", flush=True); fail.append(i)
    time.sleep(4)

print(f"SUMMARY ok={len(ok)} fail={len(fail)} failed={fail}", flush=True)
