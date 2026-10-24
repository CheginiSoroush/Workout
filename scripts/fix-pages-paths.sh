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

OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/out"

if [ ! -d "$OUT_DIR" ]; then
  echo "خطا: پوشه out/ پیدا نشد — اول بیلد استاتیک را اجرا کن." >&2
  exit 1
fi

cd "$OUT_DIR"

# پیشوندهای public که در کد با مسیر مطلق استفاده شده‌اند
PREFIXES=(
  "fonts/"
  "exercises/"
  "stretches/"
  "exports/"
  "liftosaur-"
  "day-"
  "bike.png"
  "stretch.png"
  "hero.png"
  "logo.svg"
)

# فایل‌های متنی خروجی (html/css/js + payloadهای RSC و manifestها)
for prefix in "${PREFIXES[@]}"; do
  # نقل‌قول‌دارها (رشته‌های JS/HTML) و بدون نقل‌قول (url() فشرده‌شده در CSS)
  find . -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" \
    -o -name "*.txt" -o -name "*.json" -o -name "*.xml" \
    -o -name "*.webmanifest" \) -exec sed -i \
    -e "s|\"/$prefix|\"/Workout/$prefix|g" \
    -e "s|'/$prefix|'/Workout/$prefix|g" \
    -e "s|url(/$prefix|url(/Workout/$prefix|g" \
    {} +
done

# GitHub Pages بدون Jekyll — ولی برای اطمینان از سرو شدن فایل‌های
# underscore دار (مثل _next) این فایل هم باشد
touch .nojekyll

echo "✅ مسیرهای دارایی‌ها برای /Workout/ بازنویسی شد + .nojekyll"
