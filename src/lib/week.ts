// ============================================================
// کلید هفته ISO — دقیقاً همان الگوریتم getWeekKey در
// src/components/dashboard/WorkoutChecklist.tsx
// تا WorkoutChecklist فعلی بدون تغییر کار کند (فرمت 2025-W23)
// نسخه سمت سرور: ورودی رشته YYYY-MM-DD یا Date
// ============================================================

export function getWeekKey(input: string | Date = new Date()): string {
  let y: number, m: number, d: number;
  if (typeof input === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);
    if (!match) return getWeekKey(new Date(input));
    y = Number(match[1]);
    m = Number(match[2]);
    d = Number(match[3]);
  } else {
    y = input.getFullYear();
    m = input.getMonth();
    d = input.getDate();
  }
  // شماره هفته ISO
  const date = new Date(Date.UTC(y, m - 1, d));
  const dayNum = date.getUTCDay() || 7; // یکشنبه = 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}
