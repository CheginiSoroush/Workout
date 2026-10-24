#!/bin/bash
# ============================================================
# Resume Task 6 media generation — run when z-ai API quota recovers
# Usage:  bash research/RESUME_TASK6.sh photos   # 12 variant photos
#         bash research/RESUME_TASK6.sh videos   # one 9-min video chunk (repeat until empty)
#         bash research/RESUME_TASK6.sh frames   # extract flipbook frames from all videos
# All steps are resume-safe: existing files are skipped automatically.
# ============================================================
set -e
cd /home/z/my-project

case "${1:-videos}" in
  photos)
    echo "== Step 1: 12 variant photos (serial, resume-safe) =="
    python3 research/gen_variant_photos.py 560
    echo "-- still missing: --"
    for k in bench-press__machine incline-db-press__machine db-shoulder-press__machine \
             lateral-raise__machine pull-up__machine barbell-row__machine ez-curl__machine \
             rdl__machine bulgarian-split-squat__machine hanging-leg-raise__machine \
             cable-fly__free leg-press__free; do
      ls public/exercises/$k.* 2>/dev/null || echo "MISSING $k"
    done
    ;;
  videos)
    echo "== One video chunk (9 min) — repeat until CALL_END remaining=[] =="
    python3 research/gen_media_v4.py 540 100 | tail -3
    ;;
  frames)
    echo "== Extract flipbook frames from every video =="
    python3 research/extract_frames.py
    echo "-- video counts: --"
    echo "exercises: $(ls public/exercises/videos/*.mp4 2>/dev/null | wc -l)/31 (19 base + 12 variants)"
    echo "stretches: $(ls public/stretches/videos/*.mp4 2>/dev/null | wc -l)/14"
    ;;
  *)
    echo "usage: $0 photos|videos|frames"
    exit 1
    ;;
esac
