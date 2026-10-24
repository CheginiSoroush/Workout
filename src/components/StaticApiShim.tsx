"use client";

import { useEffect } from "react";
import { installStaticApi } from "@/lib/staticApi";

// در بیلد استاتیک (GitHub Pages) fetch مسیرهای /api را همان‌جا که
// ماژول ارزیابی می‌شود نصب می‌کنیم — یعنی «قبل از» اجرای اثرهای
// هر کامپوننتی که درخواست می‌زند. در محیط توسعه این فراخوانی
// بدون اثر است (installStaticApi خودش گارد env دارد).
if (typeof window !== "undefined") {
  installStaticApi();
}

/**
 * فقط یک نقطهٔ اتصال برای نصب شیم API استاتیک — چیزی رندر نمی‌کند.
 * در بیلد استاتیکِ GitHub Pages، درخواست‌های /api/* را با localStorage
 * پاسخ می‌دهد تا کل اپ بدون سرور کار کند.
 */
export default function StaticApiShim() {
  useEffect(() => {
    // لایهٔ دفاعی دوم — نصب idempotent است
    installStaticApi();
  }, []);
  return null;
}
