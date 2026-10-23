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
