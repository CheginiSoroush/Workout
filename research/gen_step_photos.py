#!/usr/bin/env python3
"""Step-by-step photo generator — 3 key phases per movement (شروع/اجرا/انقباض).

Outputs: public/exercises/steps/{id}/step{1..3}.jpg and
         public/stretches/steps/{id}/step{1..3}.jpg
Skips ids whose video-frames already exist (their flipbook already works),
skips step files that already exist (resume-safe). Serial + paced.

Usage: python3 gen_step_photos.py [deadline_seconds] [spacing_seconds]
"""
import os, subprocess, sys, time

ROOT = "/home/z/my-project"
IMG_DIR = f"{ROOT}/public/exercises/steps"
STR_DIR = f"{ROOT}/public/stretches/steps"
os.makedirs(IMG_DIR, exist_ok=True)
os.makedirs(STR_DIR, exist_ok=True)

STYLE = ("Photorealistic professional gym photo, muscular athletic man in a black "
         "tank top and black shorts, {desc}, modern dark gym with equipment in the "
         "background, realistic lighting, instructional fitness photography, correct "
         "exercise form, full body visible, high quality, no text, no watermark")

STRETCH_STYLE = ("Photorealistic photo of an athletic man performing a stretching "
                 "exercise, {desc}, bright home environment with an exercise mat, "
                 "realistic lighting, instructional fitness photography, correct "
                 "form, high quality, no text, no watermark")

# id -> (group, [step1_desc, step2_desc, step3_desc])
# step1 = شروع (setup/starting position), step2 = اجرا (execution),
# step3 = انقباض (peak contraction/end position)
MOVES = {
  # ---------- پایه — حرکاتی که هنوز ویدیو/فریم ندارند ----------
  "rope-pushdown": ("exercises", [
    "standing at a cable station gripping the rope attachment with bent elbows at upper chest height, triceps pushdown starting position",
    "pushing the rope attachment down toward the thighs, elbows extending through the middle of the movement",
    "arms fully extended down at the sides with the rope ends spread apart, triceps fully contracted"]),
  "lateral-raise": ("exercises", [
    "standing upright holding a dumbbell in each hand hanging at the sides of the body, feet shoulder width",
    "raising both dumbbells out to the sides to shoulder height with slightly bent elbows, mid movement",
    "both arms parallel to the floor at shoulder height holding the dumbbells, pausing at the top with deltoids contracted"]),
  "pull-up": ("exercises", [
    "kneeling on the pad of an assisted pull-up machine gripping the overhead handles with arms fully extended, hanging start position",
    "pulling the body upward with bent elbows, halfway through the pull",
    "chin above the handles, body pulled to the top of the pull-up, back muscles fully contracted"]),
  "barbell-row": ("exercises", [
    "hinged forward at the hips about 45 degrees with a flat back, holding a barbell with arms extended down",
    "pulling the barbell up toward the lower chest, elbows driving back past the torso",
    "barbell touching the lower ribcage, shoulder blades squeezed together, flat strong back"]),
  "lat-pulldown": ("exercises", [
    "seated at a lat pulldown machine gripping the wide bar overhead with arms fully extended, chest up",
    "pulling the wide bar down toward the upper chest, elbows driving down and back",
    "wide bar at the upper chest, lats fully contracted, chest tall and proud"]),
  "face-pull": ("exercises", [
    "standing facing a cable machine holding the two rope ends with arms extended forward at face height",
    "pulling the rope toward the face, elbows high and wide, halfway through",
    "rope at the face with hands beside the ears, elbows high, rear shoulder muscles fully contracted"]),
  "ez-curl": ("exercises", [
    "standing upright holding an EZ curl bar with arms extended down at thigh height, elbows pinned at the sides",
    "curling the EZ bar upward toward the shoulders, elbows staying at the sides, mid rep",
    "EZ bar at shoulder height, biceps fully contracted at the top of the curl"]),
  "straight-arm-pulldown": ("exercises", [
    "standing facing a high cable pulley holding a straight bar with arms extended forward at shoulder height",
    "sweeping the bar down in a wide arc toward the thighs with straight arms, mid movement",
    "bar pressed against the thighs, arms extended down, lats fully contracted"]),
  "leg-press": ("exercises", [
    "seated in a leg press machine with both feet flat on the large platform, knees bent at 90 degrees",
    "extending the legs to push the platform away, knees almost straight, mid rep",
    "legs fully extended pushing the platform, quadriceps fully contracted, hands on the side handles"]),
  "rdl": ("exercises", [
    "standing upright holding a barbell in front of the thighs with straight arms, feet hip width",
    "hinging at the hips lowering the barbell along the front of the legs with a flat back and soft knees",
    "torso bent forward about 45 degrees with the barbell at shin level, hamstrings stretched, back perfectly flat"]),
  "bulgarian-split-squat": ("exercises", [
    "standing in a split stance with the rear foot elevated on a bench behind, holding a dumbbell in each hand at the sides",
    "lowering the body straight down until the rear knee is close to the floor, front shin vertical",
    "driving back up to the full standing split stance, front thigh fully contracted"]),
  "leg-curl": ("exercises", [
    "lying face down on a leg curl machine with legs fully extended and heels under the roller pad",
    "curling the heels up toward the glutes, knees bending through the middle of the movement",
    "heels pulled close to the glutes, hamstrings fully contracted at the top"]),
  "calf-raise": ("exercises", [
    "standing with the balls of the feet on a raised platform, heels lowered below the edge, deep calf stretch",
    "rising onto the toes, heels lifting up past the level of the platform, mid movement",
    "standing on the very tops of the toes, heels as high as possible, calf muscles fully contracted"]),
  "hanging-leg-raise": ("exercises", [
    "hanging from a pull-up bar with straight arms and legs together, body still",
    "lifting the knees up toward the chest with the hips curling upward, mid raise",
    "knees raised to chest height with abs fully contracted, hanging with control"]),
  "cable-crunch": ("exercises", [
    "kneeling on the floor below a high cable pulley holding the rope attachment behind the head, torso upright",
    "crunching the torso down toward the floor rounding the spine, mid movement",
    "torso curled down with elbows approaching the knees, abdominal muscles fully contracted"]),
  # ---------- نسخه‌های جایگزین ----------
  "bench-press__machine": ("exercises", [
    "seated upright at a chest press machine gripping the two side handles at chest height with bent elbows",
    "pushing the handles forward away from the chest, elbows extending through the middle of the press",
    "arms fully extended forward holding the handles, chest muscles fully contracted"]),
  "incline-db-press__machine": ("exercises", [
    "seated on an incline chest press machine with the back against the angled pad, gripping the handles at upper chest height",
    "pressing the handles up and forward on the incline path, elbows extending, mid rep",
    "arms fully extended at the top of the incline press, upper chest fully contracted"]),
  "db-shoulder-press__machine": ("exercises", [
    "seated in a shoulder press machine gripping the two handles at shoulder height, elbows bent out to the sides",
    "pressing the handles overhead, elbows extending through the middle of the movement",
    "arms fully extended overhead holding the handles, shoulder muscles fully contracted"]),
  "lateral-raise__machine": ("exercises", [
    "standing beside a low cable pulley holding the single handle with one arm hanging down at the side",
    "raising the arm out to the side up to shoulder height with a slight elbow bend, mid movement",
    "arm parallel to the floor at shoulder height, shoulder muscle fully contracted, standing tall"]),
  "pull-up__machine": ("exercises", [
    "kneeling on the knee pad of an assisted pull-up machine gripping the overhead handles with arms extended",
    "pulling the body upward with bent elbows, halfway to the top",
    "chin above the handles at the top of the assisted pull-up, back fully contracted"]),
  "barbell-row__machine": ("exercises", [
    "seated at a seated cable row machine with chest up and arms extended forward holding the V-handle",
    "pulling the V-handle toward the torso, elbows driving back past the sides, mid rep",
    "handle pulled to the abdomen, shoulder blades squeezed together, spine tall and neutral"]),
  "ez-curl__machine": ("exercises", [
    "standing facing a cable machine gripping a straight bar attachment on the low pulley with arms extended down",
    "curling the bar up toward the shoulders keeping elbows pinned at the sides, mid rep",
    "bar at shoulder height with biceps fully contracted at the top of the cable curl"]),
  "rdl__machine": ("exercises", [
    "lying face down on a 45 degree back extension bench with ankles hooked under the pads, torso hinged forward",
    "raising the torso up until the body forms a straight line, mid movement",
    "torso fully raised in line with the legs, glutes and lower back fully contracted, flat strong back"]),
  "bulgarian-split-squat__machine": ("exercises", [
    "seated in a leg press machine with one foot flat on the large platform and the other foot on the floor, knee bent",
    "extending the working leg to push the platform away, mid rep with control",
    "working leg fully extended pressing the platform, thigh muscle fully contracted"]),
  "hanging-leg-raise__machine": ("exercises", [
    "supported in a captain's chair station with forearms on the pads and back against the back pad, legs hanging straight down",
    "lifting the knees up toward the chest, hips curling up, mid raise",
    "knees raised to chest height, abdominal muscles fully contracted, stable supported posture"]),
  "cable-fly__free": ("exercises", [
    "lying on his back on a flat bench holding two dumbbells with arms extended above the chest, starting position",
    "opening both arms wide out to the sides with soft elbows lowering the dumbbells, mid stretch",
    "bringing the dumbbells together above the chest with arms extended, pecs fully contracted"]),
  "leg-press__free": ("exercises", [
    "standing with feet shoulder width holding a single dumbbell vertically against the chest, goblet squat start",
    "squatting down between the feet with an upright torso until thighs are near parallel to the floor",
    "standing back up at the top of the goblet squat, legs extended, quadriceps fully contracted"]),
  # ---------- کشش‌های بدون ویدیو ----------
  "hip-flexor": ("stretches", [
    "in a half kneeling position with one knee on an exercise mat and the other foot flat on the floor in front, torso upright, hands on the front knee",
    "gently pushing the hips forward to deepen the stretch across the front of the hip of the kneeling leg, torso staying tall",
    "holding the deepened hip flexor stretch with an upright tall torso and squared hips, calm breathing posture"]),
  "mckenzie": ("stretches", [
    "lying face down on an exercise mat with hands placed under the shoulders, elbows bent",
    "pressing the upper body up with straight arms keeping the hips on the mat, gentle back extension, mid movement",
    "holding the gentle back extension position with straight arms, hips relaxed on the mat, looking forward"]),
  "quad": ("stretches", [
    "standing upright next to a wall with one hand on the wall for balance, tall posture",
    "bending one knee and reaching back with the same side hand to grab the foot, mid movement",
    "pulling the heel toward the glutes holding the quadriceps stretch with an upright torso and both knees together"]),
}

def has_frames(group, iid):
    return os.path.exists(f"{ROOT}/public/{group}/frames/{iid}_f1.jpg")

def pending_items():
    out = []
    for iid, (group, descs) in MOVES.items():
        if has_frames(group, iid):
            continue  # فلیپ‌بوک ویدیویی از قبل فعال است
        d = f"{IMG_DIR if group == 'exercises' else STR_DIR}/{iid}"
        missing = [i for i in range(1, 4)
                   if not os.path.exists(f"{d}/step{i}.jpg")]
        if missing:
            out.append((group, iid, d, descs, missing))
    return out

def main():
    deadline = time.time() + int(sys.argv[1] if len(sys.argv) > 1 else 560)
    spacing = int(sys.argv[2] if len(sys.argv) > 2 else 20)
    items = pending_items()
    total = sum(len(m) for *_, m in items)
    print(f"[plan] {len(items)} ids, {total} photos pending", flush=True)
    done = 0
    for group, iid, d, descs, missing in items:
        if time.time() > deadline:
            print(f"[deadline] done={done} remaining_photos={total - done}", flush=True)
            return
        os.makedirs(d, exist_ok=True)
        style = STRETCH_STYLE if group == "stretches" else STYLE
        for i in missing:
            out = f"{d}/step{i}.jpg"
            prompt = style.format(desc=descs[i - 1])
            try:
                r = subprocess.run(
                    ["z-ai", "image", "-p", prompt, "-o", out, "-s", "1152x864"],
                    capture_output=True, text=True, timeout=240)
                ok = os.path.exists(out) and os.path.getsize(out) > 30000
                done += 1 if ok else 0
                print(f"[{'ok' if ok else 'FAIL'}] {iid}/step{i} "
                      f"({os.path.getsize(out)//1024 if os.path.exists(out) else 0}KB)", flush=True)
                if not ok:
                    print(f"  stderr: {r.stderr[-200:]}", flush=True)
            except Exception as e:
                print(f"[err] {iid}/step{i}: {e}", flush=True)
            time.sleep(spacing)
    print(f"[done] all step photos generated ({done}/{total})", flush=True)

if __name__ == "__main__":
    main()
