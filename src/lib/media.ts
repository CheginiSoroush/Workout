// ============================================================
// نقشه رسانه آفلاین — نسخه ۲
// ویدیوها و فریم‌های فلیپ‌بوک توسط خط تولید جداگانه (ffmpeg) ساخته
// می‌شوند؛ ممکن است هنگام رندر هنوز موجود نباشند.
// MotionMedia با onError هر مسیر غایب را بی‌صدا فال‌بک می‌کند —
// این فایل فقط «مسیر مورد انتظار» را نگه می‌دارد.
//
// نسخه ۲: رسانه مستقل برای نسخه‌های دستگاه ↔ وزنه آزاد
// هر حرکت با mode متفاوت، ویدیو/فریم مخصوص خودش را می‌گیرد
// (الگوی نام: {id}__machine یا {id}__free) — عکس اختصاصی نسخه هم
// در public/exercises/{id}__{mode}.webp.
// ============================================================

import { PROGRAM, type ExerciseMode } from "@/lib/program";
import manifest from "./generated/media-manifest.json";

// پایهٔ مسیر دارایی‌های public — در بیلد استاتیک (GitHub Pages) "‎/Workout"
// است و در توسعه/سندباکس رشتهٔ خالی؛ در زمان build اینلاین می‌شود.
const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE ?? "";

// ---- دسترس‌پذیری واقعی رسانه (از مانیفست build-time) ----
// مانیفست از محتوای واقعی public/ ساخته می‌شود (scripts/gen-media-manifest.mjs)
// تا به‌جای پروب‌های ۴۰۴ و نشان «آماده‌سازی» ابدی، UI از همان اول بداند
// چه رسانه‌ای وجود دارد و برای نسخه‌های خالی به رسانهٔ پایه فال‌بک کند.
const EXERCISE_VIDEOS = new Set<string>(manifest.exerciseVideos);
const EXERCISE_FRAME_COUNTS: Record<string, number> = manifest.exerciseFrameCounts;
const EXERCISE_STEP_COUNTS: Record<string, number> = manifest.exerciseStepCounts;
const EXERCISE_PHOTOS = new Set<string>(manifest.exercisePhotos);
const STRETCH_VIDEOS = new Set<string>(manifest.stretchVideos);
const STRETCH_FRAME_COUNTS: Record<string, number> = manifest.stretchFrameCounts;
const STRETCH_STEP_COUNTS: Record<string, number> = manifest.stretchStepCounts;

export interface MotionMediaData {
  /** مسیر ویدیوی لوکال mp4 */
  video: string;
  /** فریم‌های مرحله‌به‌مرحله به ترتیب اجرا — استخراج‌شده از ویدیو */
  frames: string[];
  /** عکس‌های مرحله‌به‌مرحله آموزشی — ۳ فاز کلیدی تولیدشده با AI
   *  وقتی فریم ویدیویی غایب است، فلیپ‌بوک با این عکس‌ها فعال می‌شود */
  steps: string[];
  /** برچسب فارسی هر فاز — هم‌طول با چرخه حرکت */
  phases: string[];
  /** برچسب فارسی عکس‌های مرحله — همیشه ۳ فاز */
  stepPhases: string[];
}

const EXERCISE_IDS = [
  "bench-press",
  "incline-db-press",
  "db-shoulder-press",
  "cable-fly",
  "rope-pushdown",
  "lateral-raise",
  "pull-up",
  "barbell-row",
  "lat-pulldown",
  "face-pull",
  "ez-curl",
  "straight-arm-pulldown",
  "leg-press",
  "rdl",
  "bulgarian-split-squat",
  "leg-curl",
  "calf-raise",
  "hanging-leg-raise",
  "cable-crunch",
] as const;

/** نسخه‌های جایگزین — هر کدام رسانه مستقل خود را دارند */
const VARIANT_IDS = [
  "bench-press__machine",
  "incline-db-press__machine",
  "db-shoulder-press__machine",
  "lateral-raise__machine",
  "pull-up__machine",
  "barbell-row__machine",
  "ez-curl__machine",
  "rdl__machine",
  "bulgarian-split-squat__machine",
  "hanging-leg-raise__machine",
  "cable-fly__free",
  "leg-press__free",
] as const;

const STRETCH_IDS = [
  "neck",
  "shoulder-cross",
  "doorway-pec",
  "cat-cow",
  "openbook",
  "childs-pose",
  "hip-flexor",
  "figure4",
  "hamstring",
  "quad",
  "calf",
  "mckenzie",
  "wall-lat",
  "deadhang",
] as const;

/** فازهای حرکات باشگاه: ۴ فریم */
const EXERCISE_PHASES = ["شروع", "میانه", "انقباض", "پایان"];

/** فازهای کشش: ۳ فریم */
const STRETCH_PHASES = ["شروع", "عمیق‌شدن", "پایان"];

/** برچسب عکس‌های مرحله‌ای آموزشی — برای همه حرکات و کشش‌ها ۳ فاز */
const STEP_LABELS = ["شروع", "اجرا", "انقباض"];
const STEP_LABELS_STRETCH = ["شروع", "عمیق‌شدن", "پایان"];

function buildMedia(
  base: string,
  id: string,
  frameCount: number,
  phases: string[],
  stepLabels: string[],
  stepCount = 0
): MotionMediaData {
  return {
    video: `${base}/videos/${id}.mp4`,
    frames: Array.from(
      { length: frameCount },
      (_, i) => `${base}/frames/${id}_f${i + 1}.jpg`
    ),
    // مسیرهای مرحله فقط وقتی که واقعاً تولید شده‌اند — وگرنه آرایهٔ خالی
    // تا MotionMedia بیخودی HEAD های ۴۰۴ نزند
    steps:
      stepCount >= stepLabels.length
        ? stepLabels.map((_, i) => `${base}/steps/${id}/step${i + 1}.jpg`)
        : [],
    phases,
    stepPhases: stepLabels,
  };
}

/** رسانه ۱۹ حرکت باشگاه + ۱۲ نسخه جایگزین — ویدیو: /exercises/videos ، فریم: /exercises/frames ، مرحله: /exercises/steps */
export const EXERCISE_MEDIA: Record<string, MotionMediaData> =
  Object.fromEntries(
    [...EXERCISE_IDS, ...VARIANT_IDS].map((id) => [
      id,
      buildMedia(
        `${ASSET_BASE}/exercises`,
        id,
        EXERCISE_PHASES.length,
        EXERCISE_PHASES,
        STEP_LABELS,
        EXERCISE_STEP_COUNTS[id] ?? 0
      ),
    ])
  );

/** رسانه ۱۴ کشش — ویدیو: /stretches/videos ، فریم: /stretches/frames ، مرحله: /stretches/steps */
export const STRETCH_MEDIA: Record<string, MotionMediaData> =
  Object.fromEntries(
    STRETCH_IDS.map((id) => [
      id,
      buildMedia(
        `${ASSET_BASE}/stretches`,
        id,
        STRETCH_PHASES.length,
        STRETCH_PHASES,
        STEP_LABELS_STRETCH,
        STRETCH_STEP_COUNTS[id] ?? 0
      ),
    ])
  );

// ---- حالت پایه هر حرکت — منبع واحد حقیقت از داده‌های برنامه ----

const BASE_MODE: Record<string, ExerciseMode> = {};
for (const day of PROGRAM) {
  for (const ex of day.exercises) {
    BASE_MODE[ex.id] = ex.baseMode ?? "machine";
  }
}

/** آیا برای این شناسه رسانهٔ قابل‌نمایشی هست؟ (ویدیو یا فلیپ‌بوک کامل) */
function exerciseMediaAvailable(id: string): boolean {
  return (
    EXERCISE_VIDEOS.has(id) ||
    (EXERCISE_FRAME_COUNTS[id] ?? 0) >= EXERCISE_PHASES.length
  );
}

function stretchMediaAvailable(id: string): boolean {
  return (
    STRETCH_VIDEOS.has(id) ||
    (STRETCH_FRAME_COUNTS[id] ?? 0) >= STRETCH_PHASES.length
  );
}

/**
 * رسانه حرکت باشگاه — نسخه‌آگاه و صادق.
 * نسخهٔ جایگزین فقط وقتی رسانه دارد که ویدیو/فریم مخصوص خودش واقعاً وجود داشته
 * باشد — فال‌بک به رسانهٔ نسخهٔ پایه گمراه‌کننده است (پرس سینه هالتر ≠ پرس دستگاه؛
 * کاربر درست‌بود — «ویدیوی هر دو یکی است»). undefined یعنی این نسخه فعلاً
 * ویدیو/فلیپ‌بوک ندارد → UI عکس اختصاصی نسخه را نشان می‌دهد.
 */
export function getExerciseMedia(
  id: string,
  mode?: ExerciseMode
): MotionMediaData | undefined {
  if (mode) {
    const base = BASE_MODE[id];
    if (base && mode !== base) {
      const variantId = `${id}__${mode}`;
      if (exerciseMediaAvailable(variantId)) {
        return EXERCISE_MEDIA[variantId];
      }
      // نسخهٔ جایگزین رسانهٔ اختصاصی ندارد → هیچ (نه فال‌بک گمراه‌کننده)
      return undefined;
    }
  }
  return exerciseMediaAvailable(id) ? EXERCISE_MEDIA[id] : undefined;
}

/** عکس اختصاصی نسخه جایگزین — null یعنی از عکس اصلی حرکت استفاده شود */
export function getVariantPhoto(id: string, mode?: ExerciseMode): string | null {
  if (!mode) return null;
  const base = BASE_MODE[id];
  if (!base || mode === base) return null;
  // فقط اگر عکس نسخه واقعاً موجود است (وگرنه ۴۰۴ و فلاش عکس شکسته)
  if (!EXERCISE_PHOTOS.has(`${id}__${mode}.webp`)) return null;
  return `${ASSET_BASE}/exercises/${id}__${mode}.webp`;
}

/** رسانه کشش — undefined اگر شناسه ناشناخته یا بدون رسانه باشد */
export function getStretchMedia(id: string): MotionMediaData | undefined {
  return stretchMediaAvailable(id) ? STRETCH_MEDIA[id] : undefined;
}

// ------------------------------------------------------------
// گارد فایل مفقود — پروب بی‌صدا با HEAD
// fetch با ۴۰۴ نویز کنسول ندارد (برخلاف <img> شکسته)؛ نتیجه در طول
// سشن کش می‌شود تا هر URL فقط یک بار بررسی شود. onError خود کامپوننت‌ها
// به‌عنوان لایه دوم دفاع باقی می‌ماند.
// ------------------------------------------------------------

const probeCache = new Map<string, Promise<boolean>>();

export function probeMedia(url: string): Promise<boolean> {
  const cached = probeCache.get(url);
  if (cached) return cached;
  const p = fetch(url, { method: "HEAD" })
    .then((res) => res.ok)
    .catch(() => false);
  probeCache.set(url, p);
  return p;
}
