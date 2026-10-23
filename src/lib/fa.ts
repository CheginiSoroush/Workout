// ============================================================
// ابزارهای فارسی‌سازی اعداد و تاریخ — مشترک بین همه نماها
// ============================================================

/** تبدیل عدد به رقم فارسی (مثل ۱۲۳ یا ۱۲٫۵) */
export function faNum(n: number | string, digits = 0): string {
  const value = typeof n === "string" ? Number(n) : n;
  if (Number.isNaN(value)) return String(n);
  return new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: digits,
  }).format(value);
}

/** تاریخ شمسی خوانا — «سه‌شنبه ۱۵ آبان ۱۴۰۳» */
export function faDate(input: string | Date): string {
  let d: Date;
  if (typeof input === "string") {
    // رشته YYYY-MM-DD → تاریخ لوکال بدون جابه‌جایی منطقه زمانی
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);
    if (m) {
      d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    } else {
      d = new Date(input);
    }
  } else {
    d = input;
  }
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/** تاریخ امروز به میلادی با فرمت YYYY-MM-DD (بر اساس تقویم لوکال) */
export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
