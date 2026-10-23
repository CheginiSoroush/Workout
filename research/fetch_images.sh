#!/bin/bash
# Sequential image search with retry — avoids 429 rate limits
cd /home/z/my-project/research
mkdir -p imgsearch

IDS=(
  bench-press incline-db-press db-shoulder-press cable-fly rope-pushdown
  lateral-raise pull-up barbell-row lat-pulldown face-pull ez-curl
  straight-arm-pulldown leg-press rdl bulgarian-split-squat leg-curl
  calf-raise hanging-leg-raise cable-crunch
)

declare -A Q=(
  [bench-press]="barbell bench press exercise demonstration in gym"
  [incline-db-press]="incline dumbbell bench press exercise demonstration"
  [db-shoulder-press]="seated dumbbell shoulder press exercise demonstration"
  [cable-fly]="standing cable chest fly exercise demonstration"
  [rope-pushdown]="cable rope triceps pushdown exercise demonstration"
  [lateral-raise]="dumbbell lateral raise side shoulder exercise demonstration"
  [pull-up]="pull up bar exercise demonstration lat muscles"
  [barbell-row]="barbell bent over row back exercise demonstration"
  [lat-pulldown]="wide grip lat pulldown machine exercise demonstration"
  [face-pull]="cable face pull rear delt exercise demonstration"
  [ez-curl]="EZ bar biceps curl exercise demonstration"
  [straight-arm-pulldown]="straight arm cable pulldown lats exercise demonstration"
  [leg-press]="leg press machine exercise demonstration"
  [rdl]="romanian deadlift barbell hamstring exercise demonstration"
  [bulgarian-split-squat]="bulgarian split squat dumbbell exercise demonstration"
  [leg-curl]="lying leg curl machine hamstring exercise demonstration"
  [calf-raise]="standing calf raise machine exercise demonstration"
  [hanging-leg-raise]="hanging leg raise abs exercise demonstration"
  [cable-crunch]="kneeling cable crunch abdominal exercise demonstration"
)

for id in "${IDS[@]}"; do
  if [ -s "imgsearch/${id}.json" ]; then
    echo "[skip] $id"
    continue
  fi
  for attempt in 1 2 3; do
    z-ai image-search -q "${Q[$id]}" --count 3 --gl us --no-rank -o "imgsearch/${id}.json" > "imgsearch/${id}.log" 2>&1
    if [ -s "imgsearch/${id}.json" ]; then
      echo "[done] $id (attempt $attempt)"
      break
    else
      echo "[retry] $id attempt $attempt failed"
      sleep $((12 * attempt))
    fi
  done
  sleep 4
done

echo "ALL SEARCHES DONE"

mkdir -p /home/z/my-project/public/exercises
python3 << 'EOF'
import json, os, subprocess

ids = ["bench-press","incline-db-press","db-shoulder-press","cable-fly","rope-pushdown",
       "lateral-raise","pull-up","barbell-row","lat-pulldown","face-pull","ez-curl",
       "straight-arm-pulldown","leg-press","rdl","bulgarian-split-squat","leg-curl",
       "calf-raise","hanging-leg-raise","cable-crunch"]

outdir = "/home/z/my-project/public/exercises"
ok, fail = [], []
for i in ids:
    path = f"imgsearch/{i}.json"
    if not os.path.exists(path) or os.path.getsize(path) == 0:
        print(f"[missing] {i}"); fail.append(i); continue
    try:
        data = json.load(open(path))
    except Exception as e:
        print(f"[badjson] {i}: {e}"); fail.append(i); continue
    if not data.get("success") or not data.get("results"):
        print(f"[noresult] {i}"); fail.append(i); continue
    results = sorted(data["results"], key=lambda r: -int(str(r.get("original_width","0")).replace("px","") or 0))
    downloaded = False
    for r in results[:3]:
        url = r.get("original_url")
        if not url: continue
        ext = os.path.splitext(url)[1].lower().split("?")[0] or ".jpg"
        if ext not in (".jpg",".jpeg",".png",".webp",".gif"): ext = ".jpg"
        dest = f"{outdir}/{i}{ext}"
        try:
            rc = subprocess.run(["curl","-sL","--max-time","40","-o",dest,url]).returncode
            size = os.path.getsize(dest) if os.path.exists(dest) else 0
            if rc == 0 and size > 8000:
                print(f"[ok] {i} ({size//1024}KB)")
                ok.append(i); downloaded = True
                break
        except Exception as e:
            print(f"[err] {i}: {e}")
    if not downloaded:
        print(f"[fail] {i}"); fail.append(i)

print(f"SUMMARY ok={len(ok)} fail={len(fail)} failed_ids={fail}")
EOF
echo "DOWNLOADS DONE"
