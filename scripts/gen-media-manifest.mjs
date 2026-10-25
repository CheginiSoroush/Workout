// ============================================================
// مانیفست دسترس‌پذیری رسانه — از محتوای واقعی public/ ساخته می‌شود
// تا UI فقط رسانه‌ای را پروب کند که واقعاً وجود دارد (بدون ۴۰۴ بی‌صدا
// و بدون نشان «در حال آماده‌سازی» ابدی برای نسخه‌های تولیدنشده).
//
// اجرا: node scripts/gen-media-manifest.mjs
// در build:static خودکار صدا زده می‌شود؛ بعد از افزودن مدیای جدید
// (ویدیو/فریم/عکس جدید در public) یک بار دیگر هم اجرا شود.
// ============================================================
import { readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUB = join(ROOT, "public");

const list = (dir, re) => {
  try {
    return readdirSync(join(PUB, dir)).filter((f) => re.test(f));
  } catch {
    return [];
  }
};
const stripVideo = (f) => f.replace(/\.mp4$/, "");
const stripFrame = (f) => f.replace(/_f\d+\.jpg$/, "");

const frameCounts = (dir) => {
  const m = {};
  for (const f of list(dir, /_f\d+\.jpg$/)) {
    const id = stripFrame(f);
    m[id] = (m[id] ?? 0) + 1;
  }
  return m;
};

// عکس‌های مرحله‌ای: public/<group>/steps/<id>/stepN.jpg
const stepCounts = (dir) => {
  const m = {};
  let ids = [];
  try {
    ids = readdirSync(join(PUB, dir));
  } catch {
    return m;
  }
  for (const id of ids) {
    const n = list(`${dir}/${id}`, /^step\d+\.(jpg|jpeg|png)$/).length;
    if (n > 0) m[id] = n;
  }
  return m;
};

const manifest = {
  generatedAt: new Date().toISOString(),
  exerciseVideos: list("exercises/videos", /\.mp4$/).map(stripVideo),
  exerciseFrameCounts: frameCounts("exercises/frames"),
  exerciseStepCounts: stepCounts("exercises/steps"),
  exercisePhotos: list("exercises", /\.(jpg|jpeg|png)$/).sort(),
  stretchVideos: list("stretches/videos", /\.mp4$/).map(stripVideo),
  stretchFrameCounts: frameCounts("stretches/frames"),
  stretchStepCounts: stepCounts("stretches/steps"),
  stretchPhotos: list("stretches", /\.(jpg|jpeg|png)$/).sort(),
};

const OUT = join(ROOT, "src/lib/generated/media-manifest.json");
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `media manifest → ${manifest.exerciseVideos.length} exercise videos, ` +
    `${Object.keys(manifest.exerciseFrameCounts).length} exercise flipbooks, ` +
    `${manifest.stretchVideos.length} stretch videos, ` +
    `${Object.keys(manifest.stretchFrameCounts).length} stretch flipbooks, ` +
    `${Object.keys(manifest.exerciseStepCounts).length}+${Object.keys(manifest.stretchStepCounts).length} step sets`
);
