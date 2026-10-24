#!/usr/bin/env bash
# Generate clean photorealistic exercise photos via z-ai image CLI
set -u
OUT=/home/z/my-project/public/exercises
declare -A P=(
  [pull-up]="Photorealistic fitness photograph: fit man performing pull ups on a pull-up bar in a modern bright gym, chin over bar, back muscles engaged, hands gripping the bar overhead, full body view, clean minimal gym background, natural daylight, professional sports photography, no text, no watermark, no logo"
  [cable-fly]="Photorealistic fitness photograph: athletic man performing standing cable chest fly on a dual cable crossover machine, both handles pulled together in front of his chest, one step forward stance, modern bright gym, professional sports photography, no text, no watermark, no logo"
  [rope-pushdown]="Photorealistic fitness photograph: fit man performing cable rope triceps pushdown, elbows locked at sides, rope attachment pushed down toward thighs, side view, modern bright gym, professional sports photography, no text, no watermark, no logo"
  [leg-press]="Photorealistic fitness photograph: man performing leg press on a 45 degree leg press machine, feet shoulder width on the platform, knees bent at ninety degrees, seated in the machine, modern bright gym, professional sports photography, no text, no watermark, no logo"
  [calf-raise]="Photorealistic fitness photograph: man performing standing calf raises on a calf raise machine, balls of the feet on the platform, heels lowered below the step, shoulders under the pads, modern bright gym, professional sports photography, no text, no watermark, no logo"
  [hanging-leg-raise]="Photorealistic fitness photograph: athletic man hanging from a pull-up bar performing hanging knee raise, knees lifted toward chest, core engaged, side view, modern bright gym, professional sports photography, no text, no watermark, no logo"
)
declare -A FAILED_IDS=( [pull-up]=1 [cable-fly]=1 [rope-pushdown]=1 [leg-press]=1 [calf-raise]=1 [hanging-leg-raise]=1 )
for id in pull-up cable-fly rope-pushdown leg-press calf-raise hanging-leg-raise; do
  # delete previous bad attempt
  rm -f "$OUT/$id.jpg" "$OUT/$id.jpeg" "$OUT/$id.png" "$OUT/$id.webp"
  echo "[gen] $id ..."
  z-ai image -p "${P[$id]}" -o "$OUT/$id.png" -s 1344x768 >/dev/null 2>&1
  if [ -s "$OUT/$id.png" ]; then
    echo "[ok] $id ($(stat -c%s "$OUT/$id.png" 2>/dev/null || echo 0) bytes)"
  else
    echo "[fail] $id"
  fi
  sleep 3
done
echo DONE
