// ============================================================
// خروجی برنامه برای اپ‌های دیگر — تولید خودکار توسط research/gen_app_exports.ts
// دستی ویرایش نکن! منبع: src/lib/program.ts + src/lib/mobility.ts
// اعتبار: 2026-10-24
// ============================================================

export interface AppExportCard {
  id: string;
  name: string;
  faName: string;
  website: string;
  badge: "manual" | "unknown";
  badgeText: string;
  summary: string;
  steps: string[];
  notes: string[];
  file: string;
  copyText: string;
}

export const WEEKLY_SHEET = {
  file: "/exports/weekly-routine-full.md",
};

export const APP_EXPORTS: AppExportCard[] = [
  {
    "id": "hevy",
    "name": "Hevy",
    "faName": "محبوب‌ترین لاگر — نام‌های کتابخانه‌اش را از قبل داریم",
    "website": "https://hevy.com",
    "badge": "manual",
    "badgeText": "ساخت دستی دقیق — ~۵ دقیقه",
    "summary": "Hevy ایمپورتِ روال ندارد (فقط تاریخچهٔ ورزش CSV) — ولی نام ۱۹ حرکت برنامه دقیقاً با کتابخانه‌اش تطبیق داده شده؛ برگه را باز کن و هر روال را در ۲ دقیقه بساز.",
    "steps": [
      "اپ Hevy → تب Workout → New Routine (۳ روال بساز: Push / Pull / پا+شکم)",
      "حرکت را با نام انگلیسی برگه سرچ کن — همان را انتخاب کن (نام‌ها دقیق‌اند)",
      "ست‌ها، تکرار، Rest (ثانیه) و RPE را از برگه بزن؛ نوت هر حرکت را کپی کن",
      "گرم‌کردن هر حرکت اول را با تیک Warmup روی ست‌های سبک علامت بزن"
    ],
    "notes": [
      "فولدر بساز به نام FST-7 و هر ۳ روال را داخلش بگذار",
      "ست‌های FST-7 را Superset نزن — فقط استراحت ۴۵ ثانیه"
    ],
    "file": "/exports/build-hevy.txt",
  },
  {
    "id": "lyfta",
    "name": "Lyfta",
    "faName": "لاگر نروژی — کتابخانه ۵۰۰۰+ حرکت با ویدیو",
    "website": "https://lyfta.app",
    "badge": "manual",
    "badgeText": "ساخت دستی دقیق — ~۵ دقیقه",
    "summary": "Lyfta فقط تاریخچهٔ ورزش را از اپ‌های دیگر import می‌کند، نه برنامه. ساخت روال دستی است و برگهٔ ما دقیقاً برای همین کار چیده شده.",
    "steps": [
      "اپ یا my.lyfta.app → Routines → New Routine",
      "۱۹ حرکت را با نام‌های انگلیسی برگه پیدا کن (کتابخانه‌اش بزرگ و کامل است)",
      "دوز و استراحت و نوت‌ها را از برگه وارد کن؛ برای هر روز یک روال"
    ],
    "notes": [
      "اگر از Hevy لاگ داشتی، History Import آن جدا انجام می‌شود",
      "Rest Timer هر حرکت را روی ثانیه‌های برگه تنظیم کن — مخصوصاً FST-7 (۴۵ ثانیه)"
    ],
    "file": "/exports/build-lyfta.txt",
  },
  {
    "id": "fitbod",
    "name": "Fitbod",
    "faName": "تولید برنامه با الگوریتم — import برنامه ندارد",
    "website": "https://fitbod.me",
    "badge": "manual",
    "badgeText": "ساخت دستی — متفاوت",
    "summary": "Fitbod برخلاف بقیه برنامه را خودش با الگوریتم می‌سازد و اجازهٔ import برنامهٔ آماده ندارد. راه درست: برای هر روز یک Custom Workout بساز و برگه را به‌عنوان مرجع ساختار و دوزها نگه دار.",
    "steps": [
      "Workouts → دکمه + → Create Custom Workout (برای هر روز یکی)",
      "حرکات برگه را اضافه کن — Fitbod وزنهٔ پیشنهادی خودش را می‌دهد",
      "ست‌ها را مطابق برگه تنظیم کن (۴×۵-۸ پرس سینه و...) و نوت‌ها را کپی کن"
    ],
    "notes": [
      "Fitbod پیشرفت را خودش محاسبه می‌کند — قاعدهٔ دوگانهٔ ما آنجا خودکار نیست، پس برگه را مرجع نگه دار",
      "روتین کششی/دوچرخه در Fitbod جایی ندارد — فقط باشگاه"
    ],
    "file": "/exports/build-generic.txt",
  },
  {
    "id": "opengym",
    "name": "openGym",
    "faName": "چند اپ هم‌نام هست — معتبرترین: «OpenGym: Cross-platform Gym»",
    "website": "https://play.google.com/store/apps/details?id=pro.filonov.npng",
    "badge": "unknown",
    "badgeText": "برگهٔ همگانی",
    "summary": "چند اپ با نام openGym وجود دارد (پلتفرم باشگاهی، ردیاب تمرین و...) — برگهٔ همگانی ما برای هرکدامشان کار می‌کند؛ ساخت دستی با همان مراحل استاندارد.",
    "steps": [
      "در اپ، بخش Routine/Program/Plan را پیدا کن",
      "حرکات را با نام انگلیسی برگه اضافه کن و دوزها را وارد کن"
    ],
    "notes": [
      "اگر اپِ خاصی که نصب کردی import خودکار داشت، اسم دقیقش را بگو تا خروجی مخصوصش را بسازم"
    ],
    "file": "/exports/build-generic.txt",
  },
  {
    "id": "gymmane",
    "name": "GymMane",
    "faName": "اپی با این نام دقیق پیدا نکردم — احتمالاً اسمش کمی فرق دارد",
    "website": "https://play.google.com/store/search?q=gym%20workout%20tracker&c=apps",
    "badge": "unknown",
    "badgeText": "در انتظار نام دقیق",
    "summary": "در Google Play و وب اپی به نام GymMane ثبت نشده (نزدیک‌ترین‌ها: Gymmate، Gymie، Gymmie). برگهٔ همگانی را در هر اپی که مقصودت است بریز؛ اگر لینک استورش را فرستادی، خروجی اختصاصی‌اش را سریع می‌سازم.",
    "steps": [
      "لینک اپ را برایم بفرست تا فرمت import یا ساخت دستی دقیقش را چک کنم",
      "تا آن موقع: برگهٔ همگانی را در اپ دستی وارد کن"
    ],
    "notes": [
      "برگهٔ همگانی برای همهٔ لاگرها کار می‌کند — نام حرکات انگلیسی استاندارد است"
    ],
    "file": "/exports/build-generic.txt",
  }
];
