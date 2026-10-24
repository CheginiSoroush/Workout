#!/usr/bin/env python3
"""Generate 12 variant photos (machine/free alternates) with z-ai image CLI.
Style-matched to the existing AI exercise photos (dark gym, black tank top).
Serial + resume-safe: skips variants whose photo already exists.
Usage: python3 gen_variant_photos.py [deadline_seconds]
"""
import os, subprocess, sys, time

ROOT = "/home/z/my-project"
OUT_DIR = f"{ROOT}/public/exercises"
os.makedirs(OUT_DIR, exist_ok=True)

STYLE = ("Photorealistic professional gym photo, muscular athletic man in a black "
         "tank top and black shorts, {desc}, modern dark gym with equipment in the "
         "background, realistic lighting, instructional fitness photography, correct "
         "exercise form, full body visible, high quality, no text, no watermark")

VARIANTS = {
    "bench-press__machine":
        "sitting upright performing a seated machine chest press, hands gripping the two side handles at chest height pushing them forward, chest press weight stack machine",
    "incline-db-press__machine":
        "sitting on the angled seat of an incline chest press machine, pressing the handles up and forward from upper chest height",
    "db-shoulder-press__machine":
        "sitting upright in a seated shoulder press machine, pressing the two handles overhead above the shoulders",
    "lateral-raise__machine":
        "standing upright performing a cable lateral raise, one arm raised straight out to the side at shoulder height holding the low pulley handle",
    "pull-up__machine":
        "performing an assisted pull-up on an assisted pull-up machine, kneeling on the knee pad platform and gripping the overhead handles, body pulled up",
    "barbell-row__machine":
        "seated at a seated cable row machine with chest up and straight back, pulling the V-handle attachment toward his torso",
    "ez-curl__machine":
        "standing facing a cable machine, curling a straight bar attachment from a low pulley up toward his shoulders, elbows pinned at his sides",
    "rdl__machine":
        "lying face down on a 45-degree hyperextension bench performing a back extension, torso lowered forward with a flat back, ankles hooked under the pads",
    "bulgarian-split-squat__machine":
        "performing a single-leg press on a leg press machine, one foot flat on the large platform pressing it away, leg extended",
    "hanging-leg-raise__machine":
        "supported in a captain's chair vertical leg raise station, forearms on the arm pads, back against the back pad, knees lifted up toward the chest",
    "cable-fly__free":
        "lying on his back on a flat bench performing a dumbbell fly, both arms open wide to the sides holding two dumbbells with soft elbows",
    "leg-press__free":
        "standing with feet shoulder width performing a goblet squat, holding a single dumbbell vertically against his chest, thighs near parallel to the floor",
}

def main():
    deadline = time.time() + int(sys.argv[1] if len(sys.argv) > 1 else 540)
    pending = [k for k in VARIANTS
               if not any(os.path.exists(f"{OUT_DIR}/{k}{e}") for e in (".jpg", ".png", ".jpeg"))]
    print(f"[plan] pending={pending}", flush=True)
    for key in pending:
        if time.time() > deadline:
            print(f"[deadline] remaining={pending[pending.index(key):]}", flush=True)
            return
        out = f"{OUT_DIR}/{key}.png"
        prompt = STYLE.format(desc=VARIANTS[key])
        try:
            r = subprocess.run(
                ["z-ai", "image", "-p", prompt, "-o", out, "-s", "1152x864"],
                capture_output=True, text=True, timeout=240)
            ok = os.path.exists(out) and os.path.getsize(out) > 30000
            print(f"[{'ok' if ok else 'FAIL'}] {key} ({os.path.getsize(out)//1024 if os.path.exists(out) else 0}KB)", flush=True)
            if not ok:
                print(f"  stderr: {r.stderr[-300:]}", flush=True)
        except Exception as e:
            print(f"[err] {key}: {e}", flush=True)
        time.sleep(25)
    print("[done] all variant photos generated", flush=True)

if __name__ == "__main__":
    main()
