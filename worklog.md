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

---
Task ID: 4
Agent: main (Z.ai Code)
Task: درخواست کاربر — کشش «کل بدن» (نه فقط کمر) + عکس و ویدیوی واقعی برای هر کشش + حداکثر آفلاین‌سازی رسانه

Work Log:
- بازنویسی mobility.ts: روتین ۱۴ حرکته تمام‌بدن با فیلد ناحیه (گردن و شانه/سینه و پشت/کمر و ستون/لگن و باسن/پا) + کلید کمر + اختیاری
- دریافت ۱۴ عکس واقعی با image-search (fetch_stretches.py) + بازبینی بصری تک‌تک → ۸ عکس نامعتبر (واترمارک Alamy/Dreamstime، بنر متنی، پوز اشتباه) با کوئری جدید دوباره گرفته شدند
- ۳ عکس سرسخت (hip-flexor، mckenzie، quad) با z-ai image تولید شدند (پرامپت دقیق فرم + بازبینی) — قبول
- درس فنی: فرآیند nohup پس‌زمینه کشته می‌شود → اجرای پیش‌زمینه‌ای چانکی (درس تکراری از تسک ۱!)
- ویدیو: yt-dlp بلاک (YouTube bot-check)، Pexels 403، Commons بی‌نتیجه → z-ai video image-to-video (cogvideox-3): ۵ ثانیه‌ای از روی عکس واقعی هر کشش
- کشف: API نرخ محدود دارد (429/406 — یک شلیک هر ~۲–۴ دقیقه، همزمانی مجاز) → اورکستراتور resume-safe با شلیک پالس‌دار + پول مداوم؛ ۱۱ ویدیو در ~۵ دور ✓
- ۳ حرکت AI-عکس (بدون URL عمومی) ویدیو ندارند — عکس و متن کافی
- آفلاین فونت: داونلود ۷ وزن Vazirmatn (jsdelivr 33.0.3) → public/fonts + @font-face در globals.css + حذف Google Fonts از layout (هشدار ESLint قدیمی هم رفع شد)
- MobilitySection بازنویسی: عکس هر حرکت + دکمه ویدیو (player لوکال با poster و preload=metadata و onError fallback) + چیپ‌های فیلتر ناحیه با تعداد
- اصلاح متن openbook به سوپاین‌تویست (مطابق عکس نهایی)

Stage Summary:
- ۱۴ عکس + ۱۱ ویدیوی لوکال در public/stretches (ویدیوها ~۳۰MB مجموع)
- فونت کاملاً آفلاین؛ هیچ CDN خارجی برای فونت
- لینت پاک کامل؛ Agent Browser: فیلتر ناحیه، پخش ویدیوی گردن (VIDEO_OK)، رندر عکس‌ها، بدون خطای کنسول
- در انتظار تأیید کاربر: پیشنهاد بازطراحی UI (گزینه A: نظم+ناوبری / گزینه B: کامل با گیمیفیکیشن و روتین‌محور)

---
Task ID: 5-a
Agent: main (Z.ai Code)
Task: بسته طراحی پیش از کد داشبورد نسخه ۲ (تیم UX/PD/UI/روان‌شناسی رفتار/FE/QA) — تحلیل محصول، فرضیات، پرسونا، فلوها، sitemap، کامپوننت‌ها، توکن‌ها، تکنولوژی، ریسک‌ها

Work Log:
- تأیید بسته‌شدن تسک ۴: ویدیوها ۱۱/۱۱ لوکال (calf/cat-cow/childs-pose/deadhang/doorway-pec/figure4/hamstring/neck/openbook/shoulder-cross/wall-lat)، عکس ۱۴/۱۴، فونت آفلاین
- تحلیل محصول: مخاطب اصلی=کاربر خانه (خود کاربر)، ۶ مشکل اصلی→راه‌حل، ۶ شاخص موفقیت قابل اندازه‌گیری محلی
- ۱۰ فرضیه با placeholder (روزهای تمرین، باشگاه/خانه، بکاپ، PWA، داده بدنی اختیاری)
- ۳ پرسونا (اصلی+۲ ثانویه)، ۶ user flow (اولین ورود/روز تمرین/کشش/استراحت/بازگشت بعد غیبت/جلسه نیمه‌کاره)
- Sitemap: ۵ نمای SPA داخل «/» (محدودیت محیط) + آنبوردینگ و ادامه جلسه؛ wireframe متنی خانه و اجرای تمرین
- لیست کامپوننت‌ها با نگاشت shadcn (موجود: Button/Card/Dialog/Alert/Progress/Skeleton/sonner/Tabs) + سفارشی: BottomNavigation/SetLogger/RestTimer/SessionSummary/OnboardingWizard/EmptyState/StreakFlex
- توکن‌ها: ادامه تم تیره زمردی (گزینه کهربایی هم ارائه شد)، وزیرمتن آفلاین 16px، اعداد fa-IR، هدف لمس ≥44px، موشن 150-250ms با reduced-motion
- تکنولوژی: Next16+TS، Tailwind4+shadcn، Prisma/SQLite (تکامل WeightEntry/WorkoutLog با Profile/Exercise/PlanDay/Session/SetEntry/StretchLog/BikeLog)، Zustand+TanStack Query، next-themes، framer-motion، sonner، recharts
- مدل داده: PR از SetEntry محاسبه؛ حالت دمو با داده نمونه قابل پاک‌سازی
- نقشه ۵ فازی (فاز۲و۳ قابل موازی) + QA: RTL/WCAG 2.2 AA/responsive/perf با agent-browser
- ۶ سؤال تأیید (رنگ، تم پیش‌فرض، روزهای تمرین، باشگاه/خانه، داده بدنی اختیاری، تیک کشش روزانه)

Stage Summary:
- AWAITING USER APPROVAL — طبق قانون کاربر، کدنویسی (فاز ۱) فقط بعد از تأیید شروع می‌شود
- اصل مهاجرت: هیچ محتوای علمی فعلی حذف نمی‌شود؛ همه seed ساختار جدید می‌شوند

---
Task ID: 5-a-approval
Agent: main (Z.ai Code)
Task: تأیید کاربر برای نسخه ۲ + قفل تصمیم‌ها

Work Log:
- کاربر: «اعتماد دارم، هر تصمیمی بخوای بگیر ولی محتوا خیلی مهم‌تره» → سبز فاز ۱
- تصمیم‌ها: تم زمردی ادامه | پیش‌فرض تیره + تم روشن | روزها شنبه/دوشنبه/چهارشنبه (همان jsDay 6/1/3 موجود) | باشگاه دستگاه‌محور + سوییچ وزنه آزاد | داده بدنی اختیاری | تیک کشش روزانه
- قانون طلایی کاربر: محتوا > همه‌چیز — هیچ بخش علمی حذف/کم‌رنگ نمی‌شود
- اصلاحات من: کتابخانه دانش از خانه+برنامه در دسترس | فازبندی با حق توقف | آفلاین مطلق حفظ شود
- بکاپ page.tsx فعلی → research/backup-page-v1.tsx

Stage Summary:
- معماری: محتوای ثابت (program.ts/mobility.ts) منبع حقیقت می‌ماند؛ DB فقط دینامیک: Profile/Session/SetEntry/StretchLog/BikeLog (+ WeightEntry/WorkoutLog موجود)
- Session کامل → upsert خودکار WorkoutLog (سازگاری چک‌لیست هفتگی)

---
Task ID: 5-b
Agent: full-stack-developer
Task: فاز ۱ نسخه ۲ — پایه اپ تمرین: Prisma schema (Profile/Session/SetEntry/StretchLog/BikeLog)، ۹ API route با zod، استور Zustand+TanStack Query، پوسته SPA پنج‌نما + BottomNavigation + آنبوردینگ ۲ مرحله‌ای، تم روشن/تیره

Work Log:
- prisma/schema.prisma: ۵ مدل جدید طبق spec (WeightEntry/WorkoutLog دست‌نخورده)؛ db:push موفق (10ms، generate خودکار)
- درس محیطی: سرور dev قدیمی (قبل از schema) Prisma Client کهنه در memory داشت → db.profile undefined و 500؛ راه‌حل: kill سرور قدیمی + ری‌استارت با .zscripts/dev.sh (nohup مستقیم در این سندباکس کشته می‌شود — درس تکراری تسک ۱/۴)
- src/lib/fa.ts: faNum (Intl fa-IR)، faDate (شمسی خوانا با weekday)، todayISO (لوکال YYYY-MM-DD)؛ src/lib/week.ts: getWeekKey همان الگوریتم ISO هفتگی WorkoutChecklist (فرمت 2025-W23) برای استفاده سرور
- src/lib/store/app.ts: Zustand + persist (نام active-session-v1، partialize فقط activeSession) — view/session فعال
- ۹ API route با zod + try/catch + status درست: profile (GET get-or-create id=1 / PUT partial strict)، sessions (GET فیلتر status/dayId/limit + POST idempotent با created:false)، sessions/active، sessions/[id] (GET/PATCH/DELETE + endedAt + sync WorkoutLog)، sessions/[id]/sets (POST/GET)، sets/[id] (DELETE)، stretch-log (upsert بر date)، bike-log، progress (prs/weekly ۸ هفته/totals/lastSessions/stretchDays + lastWeight، محاسبه در JS)
- منطق همگام‌سازی WorkoutLog در PATCH: completed→upsert با weekKey از تاریخ جلسه؛ خروج از completed یا DELETE جلسه completed → حذف تیک چک‌لیست (تا Checklist فعلی نشکند)
- globals.css: .dark حالا همان مقادیر زمردی :root است (چون next-themes کلاس dark می‌گذارد و بلوک خنثی قبلی ظاهر را می‌شکست) + html.light (zinc-50/سفید/zinc-900/زمردی-۶۰۰/zinc-200) + اسکرول‌بار روشن + prefers-reduced-motion
- layout.tsx: ThemeProvider (attribute=class, defaultTheme=dark, enableSystem=false) — preload فونت‌ها و Toaster دست‌نخورده
- page.tsx بازنویسی کامل (بکاپ قبلی در research/backup-page-v1.tsx): QueryClientProvider + هدر باریک + سوییچ ۵ نما + pb-28 برای nav
- کامپوننت‌ها: EmptyState، BottomNavigation (۵ آیتم، Play دایره‌ای 64px وسط، aria-label فارسی، مخفی در workout، safe-area)، HomeView (سلام+تاریخ+بنر جلسه فعال از persist)، ProgramView (پیش‌نمایش ۳ روز FST-7 فقط‌خواندنی)، WorkoutView (پلیر فاز ۳ + بنر جلسه فعال)، ProgressView/ProfileView (placeholder)
- Onboarding.tsx دو مرحله‌ای: هدف/سطح/روزها ۱-۶/تجهیزات/محدودیت + وزن/قد با Popover «چرا می‌پرسیم؟» + پیش‌نمایش PROGRAM + همه قابل رد کردن + PUT با onboardingDone:true (پیش‌فرض وزن/قد از PROFILE: 96/180)
- تست API کامل با curl: idempotency جلسه، 400/404، cascade حذف sets، sync WorkoutLog در تغییر وضعیت، upsert کشش، progress صحیح (W43=1 جلسه، volume 480)
- Agent-browser verify (موبایل 390×844): آنبوردینگ ظاهر شد → مرحله ۱ انتخاب‌ها → مرحله ۲ Popover → «شروع می‌کنم» → توست + ذخیره (fatloss/intermediate/3/gym/96/180/onboardingDone=true)؛ سوییچ هر ۵ نما؛ nav مخفی در workout + دکمه بازگشت؛ persist بنر جلسه فعال؛ html class=dark؛ geometry: nav ثابت bottom، touch 56-64px، main pb-112px؛ بدون خطای کنسول
- اسکرین‌شات: research/p1_shell.png (+ step2/desktop/full)؛ پاک‌سازی دیتای تستی و ریست پروفایل برای تجربه آنبوردینگ تازه کاربر

Stage Summary:
- انحراف‌ها: (۱) دکمه «بازگشت به خانه» موقت در WorkoutView placeholder چون nav در workout مخفی است و پلیر فاز ۳ هنوز نیست — بدون آن، گره بن‌بست می‌شد؛ (۲) خروج از وضعیت completed و DELETE جلسه completed، تیک WorkoutLog را هم پاک می‌کند (صحت چک‌لیست)؛ (۳) totalSets/totalVolume در progress فقط از جلسات completed و ست‌های غیر-skipped؛ (۴) PUT profile شامل weekSessionsGoal/units/reducedMotion طبق schema
- فرمت weekKey بازتولیدشده: ISO week «YYYY-Www» (مثل 2025-W23) — دقیقاً همان getWeekKey کلاینت؛ تست زنده: PATCH completed ساخت log با weekKey=2026-W43 (همان که WorkoutChecklist امروز fetch می‌کرد)
- lint پاک کامل؛ dev.log بدون خطای runtime؛ همه قواعد سفت رعایت شد (فقط /، program.ts و dashboard دست‌نخورده، زمردی، RTL، faNum)

---
Task ID: 5-c
Agent: full-stack-developer
Task: فاز ۲ نسخه ۲ — نمای خانه (فهم در ۳ ثانیه) + نمای برنامه (۵ تب، قلب محتوا) با اتصال کامل API و استور

Work Log:
- NEW فایل مشترک src/components/app/home/useTodaySession.ts: useToday (سه useSyncExternalStore با الگوی SSR=-1 از backup-page-v1 برای jsDay/hour/dayOfMonth)، getTodayPlan (مپینگ شنبه6/دوشنبه1/چهارشنبه3)، DAY_SHORT، useActiveSession (queryKey ["sessions","active"])، useStartSession (POST → setActiveSession → invalidate → setView workout + توست خطا)، openProgramTab (hash + setView بدون دست زدن به استور)
- HomeView.tsx بازنویسی کامل — ۹ بخش به‌ترتیب: (۱) سلام بر اساس ساعت صبح/ظهر/شب + نام پروفایل از ["profile"] مشترک با page؛ (۲) چیپ امروز: «امروز تمرین پُش/پول/پا و شکم است» یا «امروز استراحت است» با skeleton تا hydrate؛ (۳) کارت تمرین: عنوان/زمان/تعداد حرکت + دکمه ۵۶px «شروع تمرین» + میکروکپی «نصفه هم حسابه»؛ بنر «جلسه نیمه‌کاره داری — ادامه می‌دی؟» وقتی GET /api/sessions/active برگردد (سرور منبع حقیقت، استور persist پشتیبان، سینک استور هنگام ادامه) — صفر پیام سرزنش؛ (۴) کارت استراحت آرام + «کشش امروز»/#stretch و «دوچرخه»/#bike؛ (۵) کشش روزانه: GET /api/stretch-log?date=today → تیک سبز «کشش امروز انجام شد — ۱۴ حرکت • ۱۰ دقیقه» یا دکمه «انجامش دادم» (POST itemsDone=STRETCH_ROUTINE.length, minutes=10 + invalidate stretch-log/progress + توست) + لینک متنی «دیدن حرکات کشش»؛ (۶) هدف هفته: weekly از /api/progress × getWeekKey سمت کلاینت vs weekSessionsGoal پروفایل + Progress زمردی + «امروز می‌تونی تمرین کنی یا استراحت — هر دو اوکیه» یا پیام هدف کامل؛ (۷) نکته روز: ۱۴ نکته از PROGRESSION_RULES+NUTRITION_NOTES+STRETCH_RULES، index=روز ماه mod طول (امروز=کاردیو)؛ (۸) جلسه‌های اخیر (۳ آیتم): faDate + عنوان روز + completed→Check زمردی «کامل شد»، partial→«نیمه‌تمام» خنثی، abandoned→«ذخیره شد» خنثی، خالی→EmptyState «اولین جلسه‌ات منتظره»؛ (۹) میان‌بُر دانش: ۳ کارت کشش/کراتین/منابع → openProgramTab
- ProgramView.tsx بازنویسی کامل — Tabs شاد ۵تایی (سفلی ۴۴px، آیکون+لیبل بلند در sm+ و کوتاه در موبایل): «برنامه هفتگی»= دکمه شروع/ادامه تمرین بالای بخش + ScheduleStrip + ProgramTabs + ProgressionCard (کارت یادآوری استراحت در روز غیرتمرینی) | «کشش»= MobilitySection با عکس/ویدیو/فیلتر | «دوچرخه»= CardioSection | «تغذیه و سلامت»= NutritionPanel + MedicalNotes | «دانش و منابع»= سرتیتر «کتابخانه دانش — همه‌چیز با منبع علمی» + CreatineResearch + HevyGuide + SourcesSection با لنگرهای #creatine/#hevy/#sources و اسکرول خودکار
- hash routing محلی داخل ProgramView: اعمال روی mount + hashchange listener؛ #stretch/#bike/#creatine/#hevy/#sources → تب مربوطه؛ سوییچ دستی تب هش را با replaceState پاک می‌کند (بدون رویداد)
- همه قواعد: فقط HomeView/ProgramView + NEW در home/؛ store/page/layout/globals/dashboard صرفاً import؛ RTL، faNum/faDate، فوکوس مرئی، aria-label فارسی، آبی/نیلی صفر، Skeleton برای loading، ErrorRetry+EmptyState، TanStack Query با invalidation
- Verify با agent-browser: خانه (سلام/چیپ/کارت‌ها/هدف ۰از۲/نکته/میان‌بُر)؛ تیک کشش → توست + «کشش امروز انجام شد» + ردیف DB (۱۴ حرکت/۱۰دقیقه)؛ روز جمعه=کارت استراحت صحیح؛ شبیه‌سازی شنبه با patch موقت getDay در مرورگر → کارت تمرین + «شروع تمرین» → POST 201 → نمای تمرین با «جلسه فعال: جلسه ۱ — Push» → بازگشت خانه → بنر نیمه‌کاره بدون سرزنش → تب ۱ برنامه → «ادامه جلسه» ✓؛ ۵ تب برنامه با محتوای کامل هر سکشن (عکس/ویدیو/سوییچ دستگاه-وزنه/منابع)؛ میان‌بُر کراتین → تب دانش + اسکرول به لنگر top=0؛ موبایل ۳۹۰px: صفر overflow افقی، تب‌ها ۵×۴۴px بدون سرریز، کارت‌های دانش ۳ستونه RTL درست، nav محتوا را نمی‌پوشاند؛ صفر خطای کنسول
- اسکرین‌شات‌ها: research/p2_home.png، research/p2_program_tabs.png (+p2_program_mobile.png اضافه)
- پاک‌سازی: جلسه تستی با DELETE /api/sessions/2 حذف؛ StretchLog امروز با اسکریپت یک‌باره Prisma حذف (API حذف ندارد و route جدید ممنوع)؛ حالا sessions=0/stretch=0/logs=0؛ پروفایل و onboardingDone دست‌نخورده؛ نمای خانه تازه تأیید شد (EmptyState + «انجامش دادم» برگشت)

Stage Summary:
- انحراف‌ها: (۱) NEW فایل هوک مشترک home/useTodaySession.ts طبق مجوز فایل‌های NEW — برای عدم تکثیر منطق شروع جلسه بین دو نما؛ (۲) hashهای #bike/#creatine/#hevy/#sources علاوه بر #stretch پشتیبانی شدند (دکمه‌های خانه به آن‌ها نیاز دارند)؛ (۳) مدت تقریبی کارت تمرین از PROGRAM (۶۰-۷۵ دقیقه) گرفته شد نه عدد ثابت — محتوای مقدس دقیق‌تر است؛ (۴) حذف StretchLog تستی با اسکریپت Prisma چون stretch-log API فقط GET/POST دارد
- نکته lint: خطاهای فعلی eslint فقط در WorkoutView.tsx و src/components/app/workout/* (فایل‌های عامل موازی فاز ۳ تمرین که وسط کار تغییر می‌کنند) — فایل‌های این تسک سه‌گانه صفر خطا/هشدار
- فاز ۲ کامل: خانه و برنامه زنده و متصل به ۹ API؛ آماده فاز ۳ (پلیر تمرین) و ۴ (پیشرفت/پروفایل)

---
Task ID: 5-d
Agent: full-stack-developer (بسته‌بندی توسط main — عامل اصلی قبل از worklog timeout خورد ولی کد کامل بود)
Task: فاز ۳ — پلیر تمرین (WorkoutView + SetLogger + RestTimer + SessionSummary)

Work Log:
- فایل‌ها: src/components/app/WorkoutView.tsx (بازنویسی کامل ۲۴KB) + src/components/app/workout/{SetLogger(19.6KB), RestTimer(5.3KB), SessionSummary(13.9KB), types(4.6KB)}
- عامل سناریوی طلایی را تا انتها اجرا کرد: جلسه day1 ساخت، ۲ ست ثبت (یکی با وزنه بالاتر)، یک ست رد، تایمر dismiss، «پایان تمرین» → خلاصه → feeling=4 → completed (جلسه ۴)؛ جلسه ۵ برای تست خروج وسط کار
- تایید مستقل main: lint پاک، tsc پاک برای src (خطاهای موجود فقط examples/skills قدیمی)، dev.log همه ۲۰۰
- Browser verify (main): خانه → بنر «جلسه نیمه‌کاره» → ورود پلیر → رندر کامل (روز pull: بارفیکس کمکی دستگاه + سوییچ دستگاه/آزاد + نکات فرم accordion + SetLogger با ±2.5kg/±1rep + ویرایش + ناوبری ۶ حرکتی + پایان تمرین) → ثبت ست → toast ظاهر شد → «خروج» (ذخیره می‌ماند) → بازگشت خانه با بنر — صفر خطای کنسول
- پاک‌سازی: جلسات ۴ و ۵ حذف (reverse-sync WorkoutLog فعال بود)

Stage Summary:
- پلیر تمرین کار می‌کند: ثبت/رد/ویرایش ست، بازخورد توست، خروج امن، پایان با خلاصه و حس، نیمه‌کاره با دلیل اختیاری
- فلسفه ضدفشار رعایت: رد کردن آزاد، بدون سرزنش، تایمر dismissible

---
Task ID: 5-e
Agent: full-stack-developer (verify و بسته‌بندی توسط main — عامل قبل از verify timeout خورد ولی همه فایل‌ها کامل و lint پاک بود)
Task: فاز ۴ — نمای پیشرفت + پروفایل/تنظیمات/حریم خصوصی

Work Log:
- ProgressView.tsx (9.2KB) + ۷ زیرکامپوننت progress/ (StatCards, ConsistencyChart, VolumeChart, PrsCards, RawDataTable, LastSessionsList, types) — ۸ بخش: جمع‌بندی، استمراری ۸ هفته با خط هدف، روند حجم، PRها، جلسات اخیر، چک‌لیست هفتگی (WorkoutChecklist موجود)، وزن بدن (WeightTracker موجود با برچسب خصوصی)
- ProfileView.tsx + ۸ زیرکامپوننت profile/ — پروفایل قابل ویرایش، تم (تیره/روشن/سیستم)، کاهش حرکت، واحد kg/lb (src/lib/units.ts)، هدف هفته، یادآوری‌ها با صداقت کامل (بدون اعلان سیستمی فعلاً)، حریم خصوصی (export JSON + پاک‌کردن دو حالته با تأیید)، کمک و درباره
- دو route جدید: /api/export (GET همه جدول‌ها)، /api/data (DELETE mode=logs|all)
- Browser verify (main): پیشرفت با حالت‌های خالی خوب + چک‌لیست W43 + WeightTracker رندر؛ پروفایل: تم روشن↔تیره سوییچ شد (html class تأیید)، export دوبار 200، موبایل ۳۹۰px بدون overflow افقی؛ صفر خطای کنسول
- اسکرین‌شات: p4_progress.png, p4_light.png, p4_profile_mobile.png

Stage Summary:
- هر ۵ نما کامل و مرورگرتأیید شد؛ همه محتوای علمی قبلی (برنامه/کشش/دوچرخه/تغذیه/کراتین/Hevy/منابع/چک‌لیست/وزن) در ساختار جدید زنده است
- گام باقی: QA نهایی تجمیعی + گزارش تست به کاربر

---
Task ID: 5-f
Agent: main (Z.ai Code)
Task: QA تجمیعی نهایی نسخه ۲ + گزارش تست

Work Log:
- lint پاک؛ tsc پاک برای src (خطاهای باقی فقط examples/skills قدیمی خارج از پروژه)
- پوشش تست مرورگر در طول فازها: آنبوردینگ ۲مرحله‌ای (ثبت در DB شد و بعد ریست برای کاربر تازه)، سوییچ ۵ نما، مسیر طلایی کامل (شروع جلسه→ثبت ست→توست بازخورد→رد ست→تایمر→خروج امن→بنر ادامه→پایان→خلاصه→completed)، تیک کشش، ۵ تب برنامه با همه محتوای علمی، تم روشن/تیره، export JSON (200)، موبایل ۳۹۰px بدون overflow، صفر خطای کنسول
- بررسی بصری اسکرین‌شات‌ها: p2_home، p3_player، p4_light تمیز و هماهنگ
- وضعیت تحویل: DB خالی + onboardingDone=false (کاربر آنبوردینگ تازه می‌بیند)، فونت/عکس/ویدیو همگی آفلاین

Stage Summary:
- نسخه ۲ کامل: خانه/برنامه/پلیر تمرین/پیشرفت/پروفایل + آنبوردینگ + ۱۱ API
- همه محتوای علمی حفظ شد (قانون طلایی)؛ الگوهای تاریک صفر
- باقی برای نسخه بعد: PWA، یادآوری واقعی، صدای تایمر، ویرایش برنامه
