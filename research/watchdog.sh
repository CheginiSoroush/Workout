#!/bin/bash
# ============================================================
# Task 6 media watchdog — probes z-ai quota; auto-resumes the
# full pipeline (poll pending -> variant photos -> videos -> frames)
# when the API recovers. Fully resume-safe (scripts skip existing).
# ============================================================
cd /home/z/my-project
LOG=research/watchdog.log
log() { echo "[$(date +%H:%M:%S)] $*" >> "$LOG"; }

log "watchdog started (probe every 480s)"

while true; do
  # --- cheap probe ---
  if timeout 90 z-ai chat -p "ping" > /tmp/wd_probe.out 2>&1; then
    log "API RECOVERED — starting resume pipeline"
    echo "===== RECOVERY $(date) =====" >> "$LOG"

    # 1) variant photos (12)
    python3 research/gen_variant_photos.py 560 >> "$LOG" 2>&1 || log "variant-photos script exited nonzero"

    # 2) video chunks: keep running until remaining is empty or this session times out
    for round in 1 2 3 4 5 6 7 8; do
      OUT=$(python3 research/gen_media_v4.py 560 100 2>&1 | tail -6)
      echo "$OUT" >> "$LOG"
      if echo "$OUT" | grep -q "remaining=\[\]"; then
        log "video queue EMPTY after round $round"
        break
      fi
      log "video round $round done, queue not empty yet"
    done

    # 3) frames
    python3 research/extract_frames.py >> "$LOG" 2>&1 || log "extract_frames exited nonzero"
    log "PIPELINE COMPLETE — exercises: $(ls public/exercises/videos/*.mp4 2>/dev/null | wc -l)/31 videos, stretch: $(ls public/stretches/videos/*.mp4 2>/dev/null | wc -l)/14"

    # stay alive but probe again much later (in case new work is added)
    sleep 3600
  else
    log "still 429 ($(head -c 120 /tmp/wd_probe.out | tr '\n' ' '))"
    sleep 480
  fi
done
