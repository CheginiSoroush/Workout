---
Task ID: 1
Agent: main (Z.ai Code)
Task: ساخت وب اپلیکیشن داشبورد فیتنس شخصی (برنامه ۳ روزه FST-7 با عکس حرکات، نکات، پیگیری وزن و ثبت جلسات)

Work Log:
- طراحی برنامه ۳ روزه Push/Pull/Legs+Core با ۱۹ حرکت و FST-7 فینیشرها در src/lib/program.ts (نکات فرم، خطاها، عضلات، دوزها)
- آپدیت Prisma schema (مدل‌های WeightEntry و WorkoutLog) و db push
- ساخت API routes: /api/weights (GET/POST/DELETE با upsert روزانه) و /api/workout-logs (GET/POST/DELETE با unique dayId+weekKey)
- دریافت ۱۹ عکس واقعی حرکات با z-ai image-search (بازبینی بصری تک‌تک و اصلاح ۷ عکس نامرتبط) + ۴ تصویر اختصاصی AI (hero + ۳ دسته روز)
- تم تیره زمردی + فونت وزیرمتن + RTL در layout و globals.css (اسکرول‌بار سفارشی)
- کامپوننت‌ها: ScheduleStrip، ProgramTabs، ExerciseCard، WeightTracker (نمودار recharts + آمار)، WorkoutChecklist، NutritionPanel، MedicalNotes، ProgressionCard
- page.tsx: هیرو با آمار پویا (BMI، کالری هدف Mifflin-St Jeor، پروتئین)، تشخیص روز هفته با useSyncExternalStore، فوتر چسبان
- رفع باگ‌ها: rate-limit تصاویر (جستجوی ترتیبی)، پس‌زمینه‌های کشته‌شده سشن (اجرای پیش‌زمینه‌ای)، ابعاد نامعتبر image gen، stale CSS (ری‌استارت dev)، lint (useSyncExternalStore به‌جای setState در effect)
- تست کامل با agent-browser: رندر دسکتاپ/موبایل، سوییچ تاب‌ها، ثبت وزن (توست + نمودار)، تیک جلسه (persist در DB)، فوتر چسبان، بدون خطای کنسول
- پاک‌سازی دیتای تستی و تحویل تمیز

Stage Summary:
- داشبورد کامل روی / سرو می‌شود؛ دیتابیس SQLite با دو مدل جدید؛ ۲۳ تصویر لوکال در public
- همه تعاملات core با مرورگر تأیید شد: tabs، ثبت وزن+نمودار، چک‌لیست هفتگی، RTL موبایل/دسکتاپ
- lint پاک (فقط ۱ هشدار بی‌اثر فونت مخصوص pages router)

---
Task ID: 2
Agent: main (Z.ai Code)
Task: افزودن سه قابلیت تأییدشده توسط کاربر به داشبورد موجود: سوییچ دستگاه↔وزنه آزاد (شروع دستگاه‌محور برای تازه‌کار)، بخش «ریشه هر اصل» (Traceability)، بخش تحقیق کراتین و راهنمای Hevy

Work Log:
- بحث و تأیید کاربر: هر چیزی که علم + تجربه اسطوره‌ها تأیید کند؛ جستجوی جدید برای اثبات دستگاه vs وزنه آزاد (Haugen 2023 PMC10426227، Schwanbeck 2020 PMID 32358310)
- کشف خطر: MultiEdit ناتمام روی program.ts با RTL فارسی partial-apply شد و با patch پایتون تکرار درج ایجاد کرد → راه‌حل: بازنویسی کامل program.ts با Write (تک‌نسخه تمیز)
- program.ts: تایپ‌های ExerciseVariant/ExerciseMode + فیلدهای baseMode/machineAlt/freeAlt/startMode؛ ۱۲ حرکت نسخه جایگزین گرفتند (Chest Press Machine، Assisted Pull-Up، Seated Cable Row، Cable Curl، Cable Lateral Raise، Back Extension، Single Leg Press، Captain's Chair + freeAlt برای دستگاهی‌ها)؛ شروع پیشنهادی همه = دستگاه
- برنامه‌نویسی داده جدید: MACHINE_FIRST_NOTE (بنر علمی)، SOURCES (۸ اصل ← مربی/علم/لینک)، CREATINE_RESEARCH (متاآنالیز ۲۰۲۵ + ISSN 2017 + پاسخ‌دهنده‌ها + نتیجه شخصی)، HEVY_GUIDE (۷ قدم)
- ExerciseCard: سوییچ segmented «دستگاه/کابل ↔ وزنه آزاد» با نشان Sparkles روی شروع پیشنهادی + نمایش توضیح نسخه جایگزین
- ProgramTabs: بنر «چرا هفته‌های اول دستگاه‌محور؟» با لینک متاآنالیز
- کامپوننت‌های جدید: SourcesSection (کارت منشأ/علم/لینک + کارت صداقت کامل)، CreatineResearch (۴ کارت + لینک PMC)، HevyGuide (۷ قدم شماره‌دار)
- page.tsx: اتصال ۳ سکشن جدید (creatine/hevy/sources) + دکمه نویگیشن «منابع»
- Lint پاک (فقط هشدار قدیمی فونت)؛ TS پاک؛ سرور hot-reload موفق
- Agent Browser verify: رندر ۳ روز با پیش‌فرض دستگاهی، سوییچ هر دو جهت + توضیح، بنر، ۳ سکشن جدید با لینک‌ها، فوتر چسبان (footerAtBottom=true)، موبایل ۳۹۰px RTL، بدون خطای کنسول

Stage Summary:
- قاعده همکاری جدید: هیچ تغییر داشبوردی بدون بحث و تأیید کاربر
- ۱۲ حرکت با دو نسخه (دستگاه/وزنه آزاد) + شروع دستگاه‌محور برای تازه‌کار — پشتوانه: متاآنالیز ۲۰۲۳
- سه سکشن جدید روی صفحه: #creatine → #hevy → #sources
- درس فنی: برای ویرایش فایل‌های حاوی متن RTL سنگین، از لنگرهای ASCII یا بازنویسی کامل استفاده کن؛ MultiEdit روی متن فارسی ریسک partial-apply دارد

---
Task ID: 3
Agent: main (Z.ai Code)
Task: افزودن ماژول کشش روزانه (۱۰ دقیقه) + ماژول دوچرخه ثابت خانه به داشبورد — درخواست مستقیم کاربر (انعطاف کم + دوچرخه موجود در خانه)

Work Log:
- تحقیق معتبر: ACSM/Page 2012 (PMC3273886 — ۱۵–۳۰ث × ۲–۴ تکرار)، Warneke 2025 (۲–۳ ست روزانه)، Behm 2016 (PMID 26642915 — کشش <۶۰ث فقط −۱.۱٪ افت قدرت ⇒ بعد از وزنه)، Olsen 2012 (PMC3588693 — گرم‌کردن هوازی قبل وزنه) → ذخیره در research/s9,s10,s11
- فایل جدید src/lib/mobility.ts (بدون دست‌کاری program.ts — درس partial-apply RTL): STRETCH_ROUTINE (۸ حرکت: گربه‌گاو، کودک، فلکسور ران، همسترینگ، شکل ۴، مک‌کنزی، کتاب باز، ددهنگ اختیاری)، STRETCH_WHEN (زمان‌بندی: بعد وزنه/روز استراحت/قانون ثبات)، STRETCH_RULES، STRETCH_SOURCES، BIKE_PLAN (۳ جایگاه: گرم‌کردن ۵د، LISS ۱۵–۲۰د ضربان ۱۱۵–۱۳۵، ریکاوری فعال)، BIKE_WHY، BIKE_WARNING (HIIT≤۱/هفته + قانون منتزر)، BIKE_SETUP
- دو کامپوننت جدید: MobilitySection.tsx (تصویر + کِی + روتین شماره‌دار + قوانین علمی + لینک منابع) و CardioSection.tsx (تصویر + ۳ جایگاه + چرا دوچرخه + تنظیم زین + هشدار کهربایی)
- page.tsx: ۳ ویرایش با لنگر ASCII (import، سکشن #mobility با grid lg:grid-cols-2 قبل از #health، دکمه ناوبری «کشش»)
- ۲ تصویر AI تولید شد (stretch.png، bike.png) — بازبینی بصری: هماهنگ با تم زمردی تیره
- اصلاح تایپو WEEK_SCHEDULE با surgery خطی پایتون (خط ۶۳۰): «پیاده‌روی ۸–۱۰ قدم» → «پیاده‌روی ۸–۱۰ هزار قدم + کشش»
- Lint پاک (فقط هشدار قدیمی فونت)؛ dev.log بدون خطا؛ HTML رندرشده شامل همه نشانگرهای جدید

Stage Summary:
- Agent Browser verify: رندر دسکتاپ (۲ کارت کنار هم RTL)، موبایل ۳۹۰px (استک تمیز)، فوتر چسبان footerAtBottom=true، ۲۰ آیتم در سکشن کشش، صفر خطای کنسول
- تصمیم‌های علمی: کشش بعد از وزنه (نه قبل — Behm)، ۱۰ دقیقه نقطه شیرین (Warneke/ACSM)، فلکسور ران + همسترینگ = کلید کمردرد، دوچرخه = جایگزین تردمیل LISS + گرم‌کردن + ریکاوری فعال، HIIT حداکثر ۱ بار (کورتیزول)
- قاعده کاربر: این دو مورد درخواست/تفویض خودش بود؛ تغییرات بعدی فقط با بحث و تأیید
