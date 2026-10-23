#!/usr/bin/env python3
"""Extract flipbook frames from every exercise/stretch MP4 with ffmpeg.
Idempotent: skips ids whose frames already exist.
Exercises (10s): 4 frames at 8%, 38%, 63%, 88% -> <id>_f1..4.jpg
Stretches (5s):  3 frames at 8%, 50%, 88%       -> <id>_f1..3.jpg
Usage: python3 extract_frames.py
"""
import glob, os, subprocess

ROOT = "/home/z/my-project"
PLAN = {
    "exercises": (4, [0.08, 0.38, 0.63, 0.88]),
    "stretches": (3, [0.08, 0.50, 0.88]),
}

def duration(path):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", path],
        capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return 0.0

def main():
    for group, (n, fracs) in PLAN.items():
        frames_dir = f"{ROOT}/public/{group}/frames"
        os.makedirs(frames_dir, exist_ok=True)
        for mp4 in sorted(glob.glob(f"{ROOT}/public/{group}/videos/*.mp4")):
            iid = os.path.basename(mp4)[:-4]
            done = all(os.path.exists(f"{frames_dir}/{iid}_f{i}.jpg") for i in range(1, n + 1))
            if done:
                continue
            dur = duration(mp4)
            if dur <= 0:
                print(f"[skip-bad] {group}/{iid}")
                continue
            for i, frac in enumerate(fracs, start=1):
                at = min(max(dur * frac, 0.1), dur - 0.1)
                subprocess.run(
                    ["ffmpeg", "-y", "-ss", f"{at:.2f}", "-i", mp4,
                     "-frames:v", "1", "-q:v", "4",
                     f"{frames_dir}/{iid}_f{i}.jpg"],
                    capture_output=True)
            got = sum(1 for i in range(1, n + 1) if os.path.exists(f"{frames_dir}/{iid}_f{i}.jpg"))
            print(f"[frames] {group}/{iid}: {got}/{n}", flush=True)
    print("EXTRACT_DONE", flush=True)

if __name__ == "__main__":
    main()
