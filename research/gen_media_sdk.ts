/**
 * v3 SDK orchestrator: serial video generation from LOCAL images (base64).
 * 19 gym exercises + 3 stretches — 10s, speed mode, no audio.
 * Resume-safe: skips ids whose MP4 exists; task ids cached in research/videotasks/<id>.json.
 * Usage: bun research/gen_media_sdk.ts [deadline_seconds=560] [fire_spacing=150]
 */
import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const ROOT = "/home/z/my-project";
const TASK_DIR = `${ROOT}/research/videotasks`;
fs.mkdirSync(TASK_DIR, { recursive: true });

const BASE = "Realistic gym fitness tutorial video, single continuous shot: ";
const TAIL = ". Perfect exercise form, steady controlled tempo. No text, no watermark.";

const EXERCISES: Record<string, string> = {
  "bench-press": "the person performs a controlled barbell bench press, lowering the bar to the chest and pressing back up",
  "incline-db-press": "the person performs dumbbell presses on an incline bench, lowering the dumbbells to chest level and pressing up",
  "db-shoulder-press": "the person performs a seated dumbbell shoulder press, pressing the dumbbells overhead and lowering them",
  "cable-fly": "the person performs standing cable chest flys, bringing the handles together in front of the chest and opening back",
  "rope-pushdown": "the person performs a cable rope triceps pushdown, extending the arms down and controlling back up",
  "lateral-raise": "the person performs dumbbell lateral raises, raising the arms out to the sides to shoulder height and lowering",
  "pull-up": "the person performs pull ups on a straight pull-up bar, pulling the body up until the chin is above the bar and lowering slowly",
  "barbell-row": "the person performs a bent over barbell row, pulling the bar toward the lower chest and lowering with control",
  "lat-pulldown": "the person performs a lat pulldown, pulling the bar down to the upper chest and releasing up with control",
  "face-pull": "the person performs a cable face pull, pulling the rope toward the face with elbows high and returning",
  "ez-curl": "the person performs barbell curls, curling the bar toward the shoulders and lowering slowly",
  "straight-arm-pulldown": "the person performs a straight arm cable pulldown, sweeping the bar down to the thighs and returning",
  "leg-press": "the person performs machine leg presses, extending the legs and lowering the platform with control",
  "rdl": "the person performs romanian deadlifts, hinging at the hips, lowering the bar along the legs and standing back up",
  "bulgarian-split-squat": "the person performs bulgarian split squats, lowering the rear knee toward the floor and driving back up",
  "leg-curl": "the person performs lying leg curls, curling the heels toward the glutes and lowering slowly",
  "calf-raise": "the person performs standing calf raises, rising onto the toes and lowering the heels",
  "hanging-leg-raise": "the person performs hanging leg raises, lifting the knees toward the chest and lowering with control",
  "cable-crunch": "the person performs kneeling cable crunches, curling the torso down toward the floor and returning up",
};
const STRETCH_EXTRA: Record<string, string> = {
  "hip-flexor": "the person in a half kneeling position gently pushes the hips forward, deepening the hip flexor stretch and holds it",
  "mckenzie": "the person lying prone presses the upper body up with straight arms into a gentle back extension and lowers back down",
  "quad": "the person standing pulls one heel toward the glutes holding the quad stretch with an upright torso",
};

type Item = { group: "exercises" | "stretches"; id: string; img: string; prompt: string };
const ITEMS: Item[] = [];
for (const [id, motion] of Object.entries(EXERCISES)) {
  const m = fs.globSync(`${ROOT}/public/exercises/${id}.*`)[0];
  if (m) ITEMS.push({ group: "exercises", id, img: m, prompt: BASE + motion + TAIL });
}
for (const [id, motion] of Object.entries(STRETCH_EXTRA)) {
  const m = fs.globSync(`${ROOT}/public/stretches/${id}.*`)[0];
  if (m) ITEMS.push({ group: "stretches", id, img: m, prompt: BASE + motion + TAIL });
}
const BY_ID = new Map(ITEMS.map((i) => [i.id, i]));
const ORDER = ITEMS.map((i) => i.id);

const mime = (p: string) => (p.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg");
const vidPath = (it: Item) => `${ROOT}/public/${it.group}/videos/${it.id}.mp4`;
const hasMp4 = (it: Item) => fs.existsSync(vidPath(it)) && fs.statSync(vidPath(it)).size > 20000;
const taskFile = (id: string) => `${TASK_DIR}/${id}.json`;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function findVideoUrl(o: unknown): string | null {
  if (typeof o === "string") return o.startsWith("http") && (o.includes(".mp4") || o.includes(".webm")) ? o : null;
  if (Array.isArray(o)) {
    for (const v of o) { const r = findVideoUrl(v); if (r) return r; }
    return null;
  }
  if (o && typeof o === "object") {
    for (const v of Object.values(o as Record<string, unknown>)) { const r = findVideoUrl(v); if (r) return r; }
  }
  return null;
}

async function download(it: Item, url: string): Promise<boolean> {
  const res = await fetch(url);
  if (!res.ok) { console.log(`[dl-http-${res.status}] ${it.id}`); return false; }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 20000) { console.log(`[dl-small] ${it.id} ${buf.length}B`); return false; }
  fs.mkdirSync(path.dirname(vidPath(it)), { recursive: true });
  fs.writeFileSync(vidPath(it), buf);
  console.log(`[video-ok] ${it.id} (${Math.round(buf.length / 1024)}KB)`);
  return true;
}

async function main() {
  const deadline = Date.now() + Number(process.argv[2] ?? 560) * 1000;
  const spacing = Number(process.argv[3] ?? 150) * 1000;
  let lastFire = 0;
  const lastPolled = new Map<string, number>();
  let coolUntil = 0; // global 429 cooldown
  const zai = await ZAI.create();

  while (Date.now() < deadline) {
    // 1) poll pending tasks — max once per 90s per task, skip during global cooldown
    for (const it of ITEMS) {
      const tf = taskFile(it.id);
      if (!fs.existsSync(tf) || fs.statSync(tf).size < 10) continue;
      if (hasMp4(it)) continue;
      if (Date.now() < coolUntil) break;
      if ((lastPolled.get(it.id) ?? 0) > Date.now() - 90000) continue;
      lastPolled.set(it.id, Date.now());
      try {
        const { taskId } = JSON.parse(fs.readFileSync(tf, "utf8"));
        const r: any = await zai.async.result.query(taskId);
        const status = String(r?.task_status ?? "").toUpperCase();
        if (status === "SUCCESS") {
          const url = findVideoUrl(r);
          if (url && (await download(it, url))) fs.rmSync(tf);
          else console.log(`[no-url] ${it.id} — keep task for re-poll`);
        } else if (status === "FAIL" || status === "FAILED") {
          console.log(`[gen-failed] ${it.id} — will refire`);
          fs.rmSync(tf);
        }
      } catch (e: any) {
        const msg = String(e?.message ?? "");
        if (msg.includes("429")) coolUntil = Date.now() + 120000;
        console.log(`[poll-err] ${it.id}: ${msg.slice(0, 80)}`);
      }
    }
    // 2) fire next pending (paced)
    const now = Date.now();
    if (now - lastFire > spacing) {
      const next = ITEMS.find((it) => !hasMp4(it) && !(fs.existsSync(taskFile(it.id)) && fs.statSync(taskFile(it.id)).size > 10));
      if (!next) break; // everything fired & downloaded
      try {
        const dataURI = `data:${mime(next.img)};base64,${fs.readFileSync(next.img).toString("base64")}`;
        const task: any = await zai.video.generations.create({
          image_url: dataURI,
          prompt: next.prompt,
          quality: "speed",
          duration: 10,
          fps: 30,
          with_audio: false,
        });
        const tid = task?.id ?? task?.taskId;
        if (tid) {
          fs.writeFileSync(taskFile(next.id), JSON.stringify({ taskId: String(tid) }));
          lastFire = now;
          console.log(`[fired] ${next.id} taskId=${tid}`);
        } else {
          lastFire = now - spacing + 60000;
          console.log(`[fire-fail] ${next.id}: no task id`);
        }
      } catch (e: any) {
        const msg = String(e?.message ?? "");
        if (msg.includes("429")) {
          coolUntil = Date.now() + 120000;
          lastFire = now - spacing + 150000; // retry in 150s
        } else {
          lastFire = now - spacing + 60000;
        }
        console.log(`[fire-fail] ${next.id}: ${msg.slice(0, 120)}`);
      }
    }
    await sleep(20000);
  }
  const remaining = ORDER.filter((id) => !hasMp4(BY_ID.get(id)!));
  console.log(`CALL_END remaining=${remaining.length}:${remaining.join(",")}`);
}

main().catch((e) => { console.error("FATAL", e?.message); process.exit(1); });
