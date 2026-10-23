// ============================================================
// تایپ‌ها و ابزارهای مشترک پلیر تمرین (فاز ۳)
// فقط خواندنی — داده از API و program.ts می‌آید
// ============================================================

/** یک ست ثبت‌شده — خروجی API (SetEntry در Prisma) */
export interface SetEntryDTO {
  id: number;
  sessionId: number;
  exerciseId: string;
  exerciseOrder: number;
  weight: number | null; // کیلوگرم
  reps: number | null;
  skipped: boolean;
  createdAt: string;
}

/** جلسه همراه با ست‌ها — خروجی GET /api/sessions و /api/sessions/[id] */
export interface SessionWithSets {
  id: number;
  date: string; // YYYY-MM-DD
  dayId: string; // day1 | day2 | day3
  status: string; // active | completed | partial | abandoned
  startedAt: string;
  endedAt: string | null;
  feeling: number | null;
  note: string | null;
  reason: string | null;
  sets: SetEntryDTO[];
}

/** مرجع «جلسه قبل» برای یک حرکت — برای مقدار پیش‌فرض و پیام پیشرفت */
export interface PrevExerciseInfo {
  dateLabel: string; // «۲۴ آبان»
  lastSet: { weight: number | null; reps: number | null } | null;
  bestWeight: number | null; // سنگین‌ترین وزنه جلسه قبل
}

// ---------- اعداد فارسی (کمکی برای ساعت/پدینگ — اعداد عادی از @/lib/fa) ----------

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** تبدیل رقم‌های لاتین رشته به فارسی (برای رشته‌های فرمت‌شده مثل ۱:۳۰) */
export function faDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

/** Clock «۱:۳۰» با رقم فارسی و ثانیه دو رقمی */
export function faClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${faDigits(m)}:${faDigits(String(r).padStart(2, "0"))}`;
}

/** مدت خوانا: «۴۲ دقیقه و ۱۵ ثانیه» */
export function faDuration(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m <= 0) return `${faDigits(r)} ثانیه`;
  if (r === 0) return `${faDigits(m)} دقیقه`;
  return `${faDigits(m)} دقیقه و ${faDigits(r)} ثانیه`;
}

/** تاریخ کوتاه شمسی «۲۴ آبان» از رشته YYYY-MM-DD */
export function faShortDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  const d = m
    ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
    : new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("fa-IR", {
    day: "numeric",
    month: "long",
  }).format(d);
}

/** ساعت «۱۷:۰۵» با رقم فارسی */
export function faClockTime(isoDateTime: string): string {
  const d = new Date(isoDateTime);
  if (Number.isNaN(d.getTime())) return "";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return faDigits(`${hh}:${mm}`);
}

// ---------- پارس ورودی کاربر (رقم فارسی/لاتین، ممیز فارسی) ----------

/** رشته ورودی → عدد (یا null اگر خالی/نامعتبر). رقم فارسی و ٫ هم قبول است. */
export function parseNumericInput(raw: string): number | null {
  const en = raw
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[٫,]/g, ".")
    .trim();
  if (!en) return null;
  const n = Number(en);
  return Number.isFinite(n) ? n : null;
}

/**
 * استراحت برنامه («۲–۳ دقیقه» / «۷۵–۹۰ ثانیه») → ثانیه
 * بازه = نقطه میانی، گرد شده به مضرب ۵ — clamp بین ۳۰ تا ۲۴۰
 */
export function parseRestSec(rest: string): number {
  const en = rest.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
  const nums = (en.match(/\d+(?:\.\d+)?/g) ?? [])
    .map(Number)
    .filter((n) => n > 0);
  if (nums.length === 0) return 90;
  const mid = nums.length >= 2 ? (nums[0] + nums[1]) / 2 : nums[0];
  const sec = rest.includes("دقیقه") ? mid * 60 : mid;
  const rounded = Math.round(sec / 5) * 5;
  return Math.min(240, Math.max(30, rounded));
}
