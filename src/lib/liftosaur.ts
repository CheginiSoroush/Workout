// ============================================================
// برنامه FST-7 به فرمت Liftoscript (اپ Liftosaur)
// این متن در Planner رسمی liftosaur.com end-to-end تست شده:
// همه ۱۹ حرکت با نام‌های مرجع کتابخانه Liftosaur، بدون خطای parse.
// اعتبار: ۲۰۲۶-۱۰-۲۴
// ============================================================

export const LIFTOSAUR_PROGRAM = "/// FST-7 Swimmer — 3 days/week (Sat / Mon / Wed)\n/// Goal: V-taper + fat loss, based on FST-7 principles.\n/// Double progression: hit the top of the rep range on all sets -> weight goes up automatically.\n\n# Week 1\n\n## Day 1 — Push (Saturday)\n\n// هالتر را تا وسط سینه پایین بیاور — کتف‌ها جمع، آرنج‌ها ۴۵ درجه\nBench Press, Barbell / 4x5-8 / 180s / progress: dp(2.5kg, 5, 8)\n\n// زاویه نیمکت ۳۰ درجه — دمبل‌ها تا کنار سینه پایین بیایند\nIncline Bench Press, Dumbbell / 3x8-12 / 120s / progress: dp(2.5kg, 8, 12)\n\n// پرس سرشانه دمبل نشسته — کمر چسبیده به پشتی نیمکت\nShoulder Press, Dumbbell / 3x8-12 / 120s / progress: dp(2.5kg, 8, 12)\n\n// کراس اور سیم‌کش — انقباض کامل دست‌ها جلوی سینه\nCable Crossover, Cable / 3x10-15 @9 / 90s\n\n// پشت‌بازو سیم‌کش با طناب — آرنج ثابت، طناب را پایین باز کن\nTriceps Pushdown, Cable / 3x10-15 @9 / 75s\n\n// FST-7 — ۷ ست پیاپی با استراحت کوتاه، هدف: پامپ\nLateral Raise, Dumbbell / 7x10-15 @9 / 45s\n\n## Day 2 — Pull (Monday)\n\n// بارفیکس — چانه بالای میله، پایین آمدن کامل و کنترل‌شده\nPull Up, Bodyweight / 4x5-10 / 180s / progress: dp(2.5kg, 5, 10)\n\n// زیربغل هالتر خم — کمر صاف، هالتر به سمت پایین سینه\nBent Over Row, Barbell / 3x6-10 / 180s / progress: dp(2.5kg, 6, 10)\n\n// زیربغل سیم‌کش — سینه بالا، میله تا بالای سینه\nLat Pulldown, Cable / 3x10-12 / 120s / progress: dp(2.5kg, 10, 12)\n\n// فیس پول سیم‌کش با طناب — آرنج‌ها بالا و باز، برای سلامت شانه\nStanding Row Rear Delt With Rope, Cable / 3x12-15 @9 / 90s\n\n// جلوبازو هالتر خمیده — آرنج‌ها ثابت کنار بدن\nBicep Curl, EZ Bar / 3x8-12 / 90s / progress: dp(2.5kg, 8, 12)\n\n// FST-7 پول‌اور دست صاف — ۷ ست پیاپی، پامپ زیربغل\nPullover, Dumbbell / 7x10-15 / 45s\n\n## Day 3 — Legs + Abs (Wednesday)\n\n// پرس پا دستگاه — زانو ۹۰ درجه، پاها عرض شانه\nLeg Press, Leverage Machine / 4x8-12 / 180s / progress: dp(5kg, 8, 12)\n\n// ددلیفت رومانیایی — لولا از مفصل ران، کمر کاملاً صاف\nRomanian Deadlift, Barbell / 3x8-10 / 180s / progress: dp(2.5kg, 8, 10)\n\n// اسکات بلغاری — ۸ تا ۱۲ تکرار برای هر پا جداگانه\nBulgarian Split Squat, Dumbbell / 3x8-12 / 90s\n\n// پشت پا خوابیده — پاشنه را به سمت باسن بکش\nLying Leg Curl, Leverage Machine / 3x10-15 @9 / 75s\n\n// ساق ایستاده — دامنه کامل، مکث یک ثانیه‌ای در بالا\nStanding Calf Raise, Leverage Machine / 4x10-15 @9 / 60s\n\n// بالانش آویزان — زانوها به سمت سینه، بدون تاب خوردن\nHanging Leg Raise, Bodyweight / 3x8-15 / 90s\n\n// FST-7 شکم سیم‌کش — ۷ ست پیاپی، پامپ شکم\nCable Crunch, Cable / 7x12-15 @9 / 45s";

export const LIFTOSAUR_GUIDE = {
  title: "برنامه در Liftosaur — ایمپورت با یک کپی",
  subtitle: "همان برنامه ۳ روزه FST-7 با پیشرفت خودکار — ۲ دقیقه راه‌اندازی",
  steps: [
    {
      title: "۱ — Planner وب را باز کن",
      text: "به liftosaur.com/planner برو (یا در اپ: Programs → برنامه جدید). دکمه «Full Program» را بزن تا حالت متن کامل فعال شود.",
    },
    {
      title: "۲ — کد را جای‌گذاری کن",
      text: "دکمه «کپی کد» پایین همین کارت را بزن، بعد داخل ویرایشگر Liftosaur جای‌گذاری کن. بدون هیچ خطایی parse می‌شود.",
    },
    {
      title: "۳ — وارد حسابت شو",
      text: "Sign In کن تا برنامه در اپ گوشی‌ات سینک شود — همان اکانت، همان برنامه، همه‌جا.",
    },
    {
      title: "۴ — پیشرفت خودکار روشن است",
      text: "حرکات اصلی پیشرفت دوگانه (dp) دارند: هر بار سقف تکرار را در همه ست‌ها زدی، وزنه خودکار بالا می‌رود — دقیقاً همان قاعده پیشرفت این سایت.",
    },
  ],
  notes: [
    "Face Pull در کتابخانه Liftosaur با نام «Standing Row Rear Delt With Rope, Cable» ثبت شده — همان حرکت با طناب است.",
    "پول‌اور دست صاف با نام «Pullover, Dumbbell» — نزدیک‌ترین معادل کتابخانه.",
    "کامنت‌های فارسی بالای هر حرکت، هنگام تمرین همان‌جا به‌عنوان راهنما نمایش داده می‌شوند.",
  ],
};
