// ============================================================
// واحد نمایش وزن — کیلوگرم/پوند (فقط نمایشی)
// ذخیره‌سازی همیشه متریک است (weightKg در DB)؛ این فایل هیچ‌وقت
// داده‌ای را تبدیل و ذخیره نمی‌کند — فقط برای نمایش.
// WeightTracker (بخش وزن بدن) عمداً کیلوگرم می‌ماند.
// ============================================================

import { faNum } from "@/lib/fa";

export type Units = "metric" | "imperial";

/** ضریب تبدیل کیلوگرم به پوند */
export const LB_PER_KG = 2.2046226218;

/** مقدار کیلوگرم → مقدار نمایشی (در حالت imperial پوند) */
export function weightToDisplay(kg: number, units: Units): number {
  return units === "imperial" ? kg * LB_PER_KG : kg;
}

/** برچسب واحد نمایش */
export function weightUnitLabel(units: Units): string {
  return units === "imperial" ? "پوند" : "کیلوگرم";
}

/** برچسب کوتاه واحد (برای کنار اعداد) */
export function weightUnitShort(units: Units): string {
  return units === "imperial" ? "lb" : "kg";
}

/** رشته کامل وزن با رقم فارسی — مثلاً «۱۲٫۵ kg» */
export function formatWeight(kg: number, units: Units, digits = 1): string {
  const value = weightToDisplay(kg, units);
  return `${faNum(value, digits)} ${weightUnitShort(units)}`;
}

/** تبدیل ورودی نمایشی کاربر به کیلوگرم (اگر imperial باشد) */
export function displayToKg(value: number, units: Units): number {
  return units === "imperial" ? value / LB_PER_KG : value;
}
