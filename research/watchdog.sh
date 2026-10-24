#!/bin/bash
# ============================================================
# Task 6 media watchdog v2 — probes z-ai quota; auto-resumes the
# full pipeline when the API recovers. Priority order:
#   1) step-by-step photos (user's top request — 30 ids x 3 phases)
#   2) 12 variant photos
#   3) video queue (serial, paced)
#   4) flipbook frame extraction
# All steps resume-safe (scripts skip existing files).
# ============================================================
cd /home/z/my-project
LOG=research/watchdog.log
log() { echo "[$(date +%H:%M:%S)] $*" >> "$LOG"; }

log "watchdog v2 started (probe every 480s)"

while true; do
  if timeout 90 z-ai chat -p "ping" > /tmp/wd_probe.out 2>&1; then
    log "API RECOVERED — starting resume pipeline"
    echo "===== RECOVERY $(date) =====" >> "$LOG"

    # 1) step-by-step photos (top priority — 90 photos, ~40 min)
    for round in 1 2 3; do
      OUT=$(python3 research/gen_step_photos.py 560 20 2>&1 | tail -4)
      echo "$OUT" >> "$LOG"
      if echo "$OUT" | grep -q "\[done\]"; then
        log "step photos COMPLETE"
        break
      fi
      log "step-photos round $round not finished yet"
    done

    # 2) variant photos (12)
    python3 research/gen_variant_photos.py 560 >> "$LOG" 2>&1 || log "variant-photos exited nonzero"

    # 3) video chunks until queue empty (max 10 rounds)
    for round in 1 2 3 4 5 6 7 8 9 10; do
      OUT=$(python3 research/gen_media_v4.py 560 100 2>&1 | tail -6)
      echo "$OUT" >> "$LOG"
      if echo "$OUT" | grep -q "remaining=\[\]"; then
        log "video queue EMPTY after round $round"
        break
      fi
      log "video round $round done, queue not empty yet"
    done

    # 4) frames
    python3 research/extract_frames.py >> "$LOG" 2>&1 || log "extract_frames exited nonzero"
    log "PIPELINE COMPLETE — steps: $(find public/exercises/steps public/stretches/steps -name 'step*.jpg' 2>/dev/null | wc -l)/90, exercises: $(ls public/exercises/videos/*.mp4 2>/dev/null | wc -l)/31 videos, stretch: $(ls public/stretches/videos/*.mp4 2>/dev/null | wc -l)/14"

    sleep 3600
  else
    log "still 429 ($(head -c 100 /tmp/wd_probe.out | tail -c 60 | tr '\n' ' '))"
    sleep 480
  fi
done
