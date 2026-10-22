#!/bin/bash
cd /home/z/my-project/public
mkdir -p /home/z/my-project/public

z-ai image -p "Dramatic dark gym interior, muscular athletic male with swimmer physique wide shoulders and V-taper back training on cable machine, moody cinematic lighting, emerald green accent rim light, professional fitness photography, high quality" -o hero.png -s 1440x720 > gen_hero.log 2>&1 &
z-ai image -p "Powerful chest and shoulder workout scene, athlete doing incline dumbbell press on bench in dark gym, dramatic side lighting, professional fitness photography, dark moody tones, high quality" -o day-push.png -s 1152x864 > gen_push.log 2>&1 &
z-ai image -p "Athletic man with defined V-taper back doing wide grip lat pulldown in dark gym, back muscles visible, dramatic rim lighting, professional fitness photography, dark moody tones, high quality" -o day-pull.png -s 1152x864 > gen_pull.log 2>&1 &
z-ai image -p "Strong athlete performing leg press machine exercise in dark modern gym, dramatic lighting with emerald green accents, professional fitness photography, dark moody tones, high quality" -o day-legs.png -s 1152x864 > gen_legs.log 2>&1 &
wait
echo "AI IMAGES DONE"
