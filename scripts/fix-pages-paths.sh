#!/usr/bin/env bash
# ============================================================
# بازنویسی مسیرهای مطلق دارایی‌های public برای GitHub Pages
# سایت روی https://<user>.github.io/Workout/ سرو می‌شود؛ پس هر
# مسیر مطلق داخل HTML/CSS/JS باید پیشوند /Workout بگیرد.
# (next خودش مسیرهای _next را با basePath می‌سازد — این اسکریپت
#  فقط مسیرهای دستی /public مثل فونت، عکس‌ها و فایل‌های export را
#  اصلاح می‌کند. idempotent است — اجرای دوباره بی‌ضرر.)
# ============================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/out"

# تشخیص پوشهٔ خروجی export — Next 16 با distDir سفارشی (.next-static)
# خروجی را داخل خود distDir می‌نویسد؛ با distDir پیش‌فرض به out/ می‌رود.
# در هر دو حالت خروجی نهایی در out/ نرمالایز می‌شود تا downstream
# (artifact upload و گاردها) همیشه یک مسیر ثابت داشته باشند.
EXP_DIR=""
if [ -f "$OUT_DIR/index.html" ]; then
  EXP_DIR="$OUT_DIR"
elif [ -f "$ROOT/.next-static/index.html" ]; then
  EXP_DIR="$ROOT/.next-static"
  rm -rf "$OUT_DIR"
  cp -a "$EXP_DIR" "$OUT_DIR"
fi

if [ -z "$EXP_DIR" ]; then
  echo "خطا: خروجی export پیدا نشد (out/ یا .next-static/) — اول بیلد استاتیک را اجرا کن." >&2
  exit 1
fi

cd "$OUT_DIR"

# پیشوندهای public که در کد با مسیر مطلق استفاده شده‌اند
# (بدون اسلش انتهایی — تا رشته‌های تکی مثل "/exercises" که با ترکیب
#  ساخته می‌شوند هم گرفته شوند، نه فقط مسیرهای کامل)
PREFIXES=(
  "fonts"
  "exercises"
  "stretches"
  "exports"
  "liftosaur-"
  "day-"
  "bike.png"
  "stretch.png"
  "hero.png"
  "logo.svg"
)

# فایل‌های متنی خروجی (html/css/js + payloadهای RSC و manifestها)
for prefix in "${PREFIXES[@]}"; do
  # نقل‌قول‌دارها (رشته‌های JS/HTML — با اسلش یا تکی)، بک‌تیک (template literal)
  # و بدون نقل‌قول (url() فشرده‌شده در CSS)
  find . -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" \
    -o -name "*.txt" -o -name "*.json" -o -name "*.xml" \
    -o -name "*.webmanifest" \) -exec sed -i \
    -e "s|\"/$prefix|\"/Workout/$prefix|g" \
    -e "s|'/$prefix|'/Workout/$prefix|g" \
    -e "s|\`/$prefix|\`/Workout/$prefix|g" \
    -e "s|url(/$prefix|url(/Workout/$prefix|g" \
    {} +
done

# GitHub Pages بدون Jekyll — ولی برای اطمینان از سرو شدن فایل‌های
# underscore دار (مثل _next) این فایل هم باشد
touch .nojekyll

echo "✅ مسیرهای دارایی‌ها برای /Workout/ بازنویسی شد + .nojekyll"
