// ============================================================
// نقشه رسانه آفلاین — نسخه ۲
// ویدیوها و فریم‌های فلیپ‌بوک توسط خط تولید جداگانه (ffmpeg) ساخته
// می‌شوند؛ ممکن است هنگام رندر هنوز موجود نباشند.
// MotionMedia با onError هر مسیر غایب را بی‌صدا فال‌بک می‌کند —
// این فایل فقط «مسیر مورد انتظار» را نگه می‌دارد.
// ============================================================

export interface MotionMediaData {
  /** مسیر ویدیوی لوکال mp4 */
  video: string;
  /** فریم‌های مرحله‌به‌مرحله به ترتیب اجرا */
  frames: string[];
  /** برچسب فارسی هر فاز — هم‌طول با چرخه حرکت */
  phases: string[];
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

function buildMedia(
  base: string,
  id: string,
  frameCount: number,
  phases: string[]
): MotionMediaData {
  return {
    video: `${base}/videos/${id}.mp4`,
    frames: Array.from(
      { length: frameCount },
      (_, i) => `${base}/frames/${id}_f${i + 1}.jpg`
    ),
    phases,
  };
}

/** رسانه ۱۹ حرکت باشگاه — ویدیو: /exercises/videos ، فریم: /exercises/frames */
export const EXERCISE_MEDIA: Record<string, MotionMediaData> =
  Object.fromEntries(
    EXERCISE_IDS.map((id) => [
      id,
      buildMedia("/exercises", id, EXERCISE_PHASES.length, EXERCISE_PHASES),
    ])
  );

/** رسانه ۱۴ کشش — ویدیو: /stretches/videos ، فریم: /stretches/frames */
export const STRETCH_MEDIA: Record<string, MotionMediaData> =
  Object.fromEntries(
    STRETCH_IDS.map((id) => [
      id,
      buildMedia("/stretches", id, STRETCH_PHASES.length, STRETCH_PHASES),
    ])
  );

/** رسانه حرکت باشگاه — undefined اگر id ناشناخته باشد */
export function getExerciseMedia(id: string): MotionMediaData | undefined {
  return EXERCISE_MEDIA[id];
}

/** رسانه کشش — undefined اگر id ناشناخته باشد */
export function getStretchMedia(id: string): MotionMediaData | undefined {
  return STRETCH_MEDIA[id];
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
