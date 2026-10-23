// ============================================================
// داده‌های برنامه تمرینی «شناگر» — اصول FST-7 (هانی رامبد)
// ۳ روز در هفته + هدف کاهش وزن و فرم V-Taper
// ============================================================

export interface Exercise {
  id: string;
  hevyName: string; // نام دقیق در کتابخانه Hevy
  faName: string; // نام فارسی
  muscles: string; // عضلات هدف
  sets: number;
  reps: string;
  rest: string;
  rpe: string;
  image: string; // مسیر عکس
  videoQuery: string; // کوئری یوتیوب برای ویدیو آموزش
  tips: string[]; // نکات فرم صحیح
  mistakes: string[]; // خطاهای رایج
  fst7?: boolean; // حرکت FST-7 (۷ ست پیاپی)
}

export interface WorkoutDay {
  id: string; // day1 | day2 | day3
  weekDay: string; // شنبه / دوشنبه / چهارشنبه
  title: string;
  subtitle: string;
  image: string;
  duration: string;
  why: string; // چرا این روز برای فرم شناگری مهمه
  cardio: string;
  exercises: Exercise[];
}

export const PROFILE = {
  age: 25,
  height: 180,
  startWeight: 96,
  targetWeight: 85,
  goal: "فرم شناگری (V-Taper) + کاهش چربی",
  proteinPerTargetKg: 2.0, // گرم به ازای هر کیلو وزن هدف
  calorieDeficit: 500,
  activityFactor: 1.45,
  creatine: "۳ تا ۵ گرم روزانه، هر ساعت از روز",
};

// ---------- جلسه ۱: PUSH ----------
export const DAY1: WorkoutDay = {
  id: "day1",
  weekDay: "شنبه",
  title: "جلسه ۱ — Push",
  subtitle: "سینه، سرشانه، پشت‌بازو",
  image: "/day-push.png",
  duration: "۶۰ تا ۷۵ دقیقه",
  why: "سینه‌ی کامل و سرشانه‌ی گرد و پهن، خط اول فرم شناگریه. بالاسینه قوی باعث می‌شه لباس رو تن بهتر بشینه و شونه‌ها پهن‌تر دیده بشن.",
  cardio: "۱۵ تا ۲۰ دقیقه تردمیل شیب‌دار (سرعت ۵–۶ / شیب ۵–۸٪ / ضربان ۱۱۰–۱۳۵)",
  exercises: [
    {
      id: "bench-press",
      hevyName: "Bench Press (Barbell)",
      faName: "پرس سینه هالتر",
      muscles: "سینه، سرشانه جلویی، پشت‌بازو",
      sets: 4,
      reps: "۵ تا ۸",
      rest: "۲–۳ دقیقه",
      rpe: "۸",
      image: "/exercises/bench-press.jpg",
      videoQuery: "barbell bench press proper form tutorial",
      tips: [
        "تیغه‌های شانه رو عقب و پایین قفل کن و قفسه سینه رو باد کن",
        "هالتر رو روی خط نوک سینه پایین بیار؛ آرنج‌ها حدود ۴۵ تا ۷۰ درجه نسبت به بدن",
        "پاها محکم رو زمین — اولین فشار از پاها میاد، بعد پرس",
      ],
      mistakes: ["لگد زدن هالتر از سینه (bounce)", "بالا اومدن باسن از نیمکت"],
    },
    {
      id: "incline-db-press",
      hevyName: "Incline Dumbbell Press",
      faName: "پرس بالاسینه دمبل",
      muscles: "بالاسینه، سرشانه جلویی",
      sets: 3,
      reps: "۸ تا ۱۲",
      rest: "۲ دقیقه",
      rpe: "۸",
      image: "/exercises/incline-db-press.jpg",
      videoQuery: "incline dumbbell press proper form tutorial",
      tips: [
        "شیب نیمکت ۳۰ درجه — بیشتر بشه سرشانه فعال‌تر می‌شه، کمتر بشه سینه پایین",
        "دمبل‌ها رو با مسیر کمی مورب به هم نزدیک کن و بالای سینه اسکوییز کن",
        "در پایین حرکت کشش رو حس کن، شونه‌ها رو نکش روون",
      ],
      mistakes: ["قوس شدید کمر", "برخورد دمبل‌ها به هم بالای سر (فقط نزدیک کن)"],
    },
    {
      id: "db-shoulder-press",
      hevyName: "Seated Dumbbell Shoulder Press",
      faName: "پرس سرشانه دمبل نشسته",
      muscles: "سرشانه (دلتوئید قدامی و جانبی)، پشت‌بازو",
      sets: 3,
      reps: "۸ تا ۱۲",
      rest: "۲ دقیقه",
      rpe: "۸",
      image: "/exercises/db-shoulder-press.jpg",
      videoQuery: "seated dumbbell shoulder press form tutorial",
      tips: [
        "پشتت کامل به پشتی نیمکت بچسبه؛ قوس کمر طبیعی و کم",
        "دمبل‌ها تا امتداد گوش پایین بیار و بدون قفل کامل آرنج بالا برو",
        "مچ‌ها صاف و در امتداد ساعد باشن",
      ],
      mistakes: ["قوس زیاد کمر برای بلند کردن وزنه سنگین‌تر", "باز کردن بیش از حد دمبل‌ها به پهلو"],
    },
    {
      id: "cable-fly",
      hevyName: "Cable Chest Fly",
      faName: "کراس اور سیم‌کش سینه",
      muscles: "سینه (به‌خصوص داخلی)",
      sets: 3,
      reps: "۱۰ تا ۱۵",
      rest: "۷۵–۹۰ ثانیه",
      rpe: "۹",
      image: "/exercises/cable-fly.jpg",
      videoQuery: "cable chest fly form tutorial",
      tips: [
        "قوس دست‌ها در کل حرکت ثابت بمونه — مثل در آغوش گرفتن یه درخت",
        "در انتهای حرکت ۱ ثانیه سینه رو اسکوییز کن",
        "یک پا جلو بذار و تنه رو کمی مایل کن برای ثبات",
      ],
      mistakes: ["تبدیل‌شدن به پرس با خم کردن آرنج‌ها", "کشیدن وزنه با کمر و سوئینگ بدن"],
    },
    {
      id: "rope-pushdown",
      hevyName: "Triceps Rope Pushdown",
      faName: "پشت‌بازو سیم‌کش با طناب",
      muscles: "پشت‌بازو",
      sets: 3,
      reps: "۱۰ تا ۱۵",
      rest: "۶۰–۹۰ ثانیه",
      rpe: "۹",
      image: "/exercises/rope-pushdown.jpg",
      videoQuery: "cable rope triceps pushdown form tutorial",
      tips: [
        "آرنج‌ها چسبیده به بدن و ثابت — فقط ساعد حرکت می‌کنه",
        "پایین حرکت طناب رو کمی از هم باز کن و پشت‌بازو رو اسکوییز کن",
        "بالا رفتن رو آهسته و کنترل‌شده انجام بده",
      ],
      mistakes: ["خم شدن به جلو و فشار با وزن بدن", "دور شدن آرنج‌ها از بدن"],
    },
    {
      id: "lateral-raise",
      hevyName: "Lateral Raise (Dumbbell)",
      faName: "نشر جانب دمبل",
      muscles: "سرشانه جانبی — کلید فرم V",
      sets: 7,
      reps: "۱۰ تا ۱۵",
      rest: "۳۰–۴۵ ثانیه",
      rpe: "پامپ",
      image: "/exercises/lateral-raise.jpg",
      videoQuery: "dumbbell lateral raise form tutorial",
      tips: [
        "شونه‌ها پایین و عقب — ترپس رو درگیر نکن",
        "آرنج کمی خم و همیشه بالاتر از مچ حرکت کنه",
        "فقط تا خط شانه بالا بیا؛ پایین‌اومدن کنترل‌شده (۲–۳ ثانیه)",
      ],
      mistakes: ["سوئینگ و پرتاب دمبل با کمر", "بالاتر از شانه بردن با ترپس"],
      fst7: true,
    },
  ],
};

// ---------- جلسه ۲: PULL ----------
export const DAY2: WorkoutDay = {
  id: "day2",
  weekDay: "دوشنبه",
  title: "جلسه ۲ — Pull",
  subtitle: "پشت، جلوبازو — روز طلایی V-Taper",
  image: "/day-pull.png",
  duration: "۶۰ تا ۷۵ دقیقه",
  why: "عرض پشت (لت‌ها) مهم‌ترین بخش فرم شناگریه. هر چه پهنت‌تر از کمرت، فرم V واضح‌تر. امروز روز طلایی توئه!",
  cardio: "استراحت فعال — پیاده‌روی ۸ تا ۱۰ هزار قدم (یا شنای سبک ۳۰ دقیقه)",
  exercises: [
    {
      id: "pull-up",
      hevyName: "Pull-Up",
      faName: "بارفیکس",
      muscles: "لت‌ها (عرض پشت)، بالاپشت",
      sets: 4,
      reps: "۵ تا ۱۰",
      rest: "۲–۳ دقیقه",
      rpe: "۸",
      image: "/exercises/pull-up.jpg",
      videoQuery: "pull up proper form tutorial",
      tips: [
        "دست‌ها کمی بازتر از عرض شانه، سینه به سمت میله",
        "قبل از کشیدن، شونه‌ها رو پایین و عقب بکش (depress)",
        "اگه کمتر از ۵ تا می‌زنی: Lat Pulldown با وزنه کم یا Assisted Pull-Up — افتادن از تکرار نداریم!",
      ],
      mistakes: ["کیک زدن با پا", "نصفه دامنه (چانه فقط تا میله بدون اسکوییز لت)"],
    },
    {
      id: "barbell-row",
      hevyName: "Barbell Row",
      faName: "زیربغل هالتر خم",
      muscles: "پشت میانی، لت‌ها، ذوزنقه",
      sets: 3,
      reps: "۶ تا ۱۰",
      rest: "۲–۳ دقیقه",
      rpe: "۸",
      image: "/exercises/barbell-row.png",
      videoQuery: "barbell bent over row form tutorial",
      tips: [
        "تنه حدود ۴۵ درجه، کمر صاف و هسته سفت",
        "هالتر رو به سمت ناف یا پایین سینه بکش — نه سینه بالا",
        "تیغه‌های شانه رو در انتهای حرکت به هم نزدیک کن",
      ],
      mistakes: ["دم کردن با کمر (بالا اومدن تنه هر ست)", "کشش با بازو به جای پشت"],
    },
    {
      id: "lat-pulldown",
      hevyName: "Lat Pulldown (Cable)",
      faName: "زیربغل سیم‌کش دست‌باز",
      muscles: "لت‌ها — عرض پشت",
      sets: 3,
      reps: "۱۰ تا ۱۲",
      rest: "۲ دقیقه",
      rpe: "۸",
      image: "/exercises/lat-pulldown.jpg",
      videoQuery: "wide grip lat pulldown form tutorial",
      tips: [
        "دست کمی بازتر از شانه؛ دسته رو تا بالای سینه بکش",
        "در پایین حرکت لت‌ها رو اسکوییز کن و ۱ ثانیه نگه دار",
        "بازگشت کنترل‌شده تا کشش کامل در بالای پشت",
      ],
      mistakes: ["کشیدن دسته پشت گردن (خطرناک برای شانه)", "عقب رفتن زیاد بدن مثل قایق‌سواری"],
    },
    {
      id: "face-pull",
      hevyName: "Face Pull (Cable)",
      faName: "فیس پول سیم‌کش",
      muscles: "سرشانه خلفی، سلامت شانه",
      sets: 3,
      reps: "۱۲ تا ۱۵",
      rest: "۷۵–۹۰ ثانیه",
      rpe: "۹",
      image: "/exercises/face-pull.jpg",
      videoQuery: "cable face pull form tutorial",
      tips: [
        "طناب در ارتفاع صورت؛ به سمت پیشونی بکش نه سینه",
        "در انتها دست‌ها رو بیرون بچرخون (external rotation)",
        "این حرکت صندوقچه‌ی سلامت شانه‌ست — سنگینی برات مهم نیست",
      ],
      mistakes: ["وزنه سنگین → تبدیل به زیربغل", "کشیدن با کمر به جای شانه خلفی"],
    },
    {
      id: "ez-curl",
      hevyName: "EZ Bar Curl",
      faName: "جلوبازو هالتر خمیده",
      muscles: "جلوبازو",
      sets: 3,
      reps: "۸ تا ۱۲",
      rest: "۹۰ ثانیه",
      rpe: "۹",
      image: "/exercises/ez-curl.jpg",
      videoQuery: "EZ bar bicep curl form tutorial",
      tips: [
        "آرنج‌ها ثابت کنار بدن — فقط ساعد حرکت می‌کنه",
        "پایین‌اومدن کنترل‌شده ۲ تا ۳ ثانیه‌ای",
        "دستگيره رو کمی بچرخون (supinate) بالای حرکت برای اسکوییز بیشتر",
      ],
      mistakes: ["سوئینگ کمر و پرتاب هالتر", "جلو آوردن آرنج‌ها هنگام بالا بردن"],
    },
    {
      id: "straight-arm-pulldown",
      hevyName: "Straight Arm Pulldown (Cable)",
      faName: "پول‌اور سیم‌کش دست صاف",
      muscles: "لت‌ها — پامپ و کشش فاسیا",
      sets: 7,
      reps: "۱۰ تا ۱۵",
      rest: "۳۰–۴۵ ثانیه",
      rpe: "پامپ",
      image: "/exercises/straight-arm-pulldown.jpg",
      videoQuery: "straight arm cable pulldown lat form tutorial",
      tips: [
        "آرنج ثابت و کمی خم — زاویه دست در کل حرکت ثابت",
        "با لت‌ها دسته رو تا ران بکش و انتهای حرکت اسکوییز کن",
        "فاصله مناسب از دستگاه تا کشش کامل بالای پشت حفظ بشه",
      ],
      mistakes: ["خم کردن آرنج → تبدیل به پوش‌داون", "استفاده از شانه و ترپس به جای لت"],
      fst7: true,
    },
  ],
};

// ---------- جلسه ۳: LEGS + CORE ----------
export const DAY3: WorkoutDay = {
  id: "day3",
  weekDay: "چهارشنبه",
  title: "جلسه ۳ — پا + شکم",
  subtitle: "پا، ساق، شکم — موتور سوخت‌سوز بدن",
  image: "/day-legs.png",
  duration: "۷۰ تا ۸۵ دقیقه",
  why: "عضلات پا بزرگ‌ترین مصرف‌کننده کالری بدنن و رشدشون متابولیسمت رو بالا می‌بره. پا قوی = کاهش وزن سریع‌تر و بدن متقارن. بدون پا، فرم شناگری ناقصه!",
  cardio: "۱۵ تا ۲۰ دقیقه پیاده‌روی تند یا دوچرخه ثابت + کشش کامل پا",
  exercises: [
    {
      id: "leg-press",
      hevyName: "Leg Press",
      faName: "پرس پا دستگاه",
      muscles: "چهارسر، باسن",
      sets: 4,
      reps: "۸ تا ۱۲",
      rest: "۲–۳ دقیقه",
      rpe: "۸",
      image: "/exercises/leg-press.jpg",
      videoQuery: "leg press machine form tutorial",
      tips: [
        "پاها عرض شانه وسط صفحه — کف پا کامل روی صفحه",
        "تا ۹۰ درجه یا کمی کمتر پایین بیا؛ باسن از صندلی جدا نشه",
        "بالا ارنج رو کامل قفل نکن — فشار همیشه روی عضله بمونه",
      ],
      mistakes: ["نصفه دامنه با وزنه خیلی سنگین", "بالا اومدن باسن و گردن‌انداختن کمر"],
    },
    {
      id: "rdl",
      hevyName: "Romanian Deadlift (Barbell)",
      faName: "ددلیفت رومانیایی",
      muscles: "همسترینگ، باسن، فیله کمر",
      sets: 3,
      reps: "۸ تا ۱۰",
      rest: "۲–۳ دقیقه",
      rpe: "۸",
      image: "/exercises/rdl.jpg",
      videoQuery: "romanian deadlift form tutorial",
      tips: [
        "لگن رو به عقب هل بده (hip hinge) — اسکات نیست!",
        "هالتر تمام مدت چسبیده به پا پایین میاد",
        "در پایین کشش همسترینگ رو حس کن، کمر صاف و سینه باز",
      ],
      mistakes: ["خم شدن کمر و گردنی شدن هالتر جلو", "زانوی زیاد خم → تبدیل به اسکات"],
    },
    {
      id: "bulgarian-split-squat",
      hevyName: "Bulgarian Split Squat (Dumbbell)",
      faName: "اسکات بلغاری",
      muscles: "چهارسر، باسن، تعادل",
      sets: 3,
      reps: "۸ تا ۱۲ هر پا",
      rest: "۹۰ ثانیه",
      rpe: "۸",
      image: "/exercises/bulgarian-split-squat.jpg",
      videoQuery: "bulgarian split squat form tutorial",
      tips: [
        "پنجه پای عقب روی نیمکت، پای جلو حدود ۶۰ سانت جلوتر",
        "تنه رو کمی مایل به جلو بیار تا باسن بیشتر درگیر بشه",
        "زانوی جلو در امتداد پنجه پا حرکت کنه، نه داخل‌تر",
      ],
      mistakes: ["گام خیلی کوتاه → فشار روی زانو", "اتکا و پرش با پای عقبی"],
    },
    {
      id: "leg-curl",
      hevyName: "Leg Curl (Lying)",
      faName: "پشت‌پا خوابیده",
      muscles: "همسترینگ",
      sets: 3,
      reps: "۱۰ تا ۱۵",
      rest: "۷۵ ثانیه",
      rpe: "۹",
      image: "/exercises/leg-curl.jpg",
      videoQuery: "lying leg curl machine form tutorial",
      tips: [
        "لگن تمام مدت چسبیده به دستگاه — باسن بالا نیاد",
        "پنجه پا رو به سمت ساق جمع کن تا ساق کمتر وارد بشه",
        "برگشت کنترل‌شده ۲ تا ۳ ثانیه",
      ],
      mistakes: ["بالا کشیدن لگن با کمک کمر", "دامنه ناقص"],
    },
    {
      id: "calf-raise",
      hevyName: "Standing Calf Raise",
      faName: "ساق پا ایستاده",
      muscles: "ساق",
      sets: 4,
      reps: "۱۰ تا ۱۵",
      rest: "۶۰ ثانیه",
      rpe: "۹",
      image: "/exercises/calf-raise.jpg",
      videoQuery: "standing calf raise form tutorial",
      tips: [
        "دامنه کامل: پایین کشش ۲ ثانیه، بالا اسکوییز ۱ ثانیه",
        "پنجه‌ها رو روی یک صفحه/دمبل بذار تا دامنه بیشتر بشه",
        "زانو صاف و ثابت در کل حرکت",
      ],
      mistakes: ["ریتم سریع باکونس", "نصفه دامنه بدون کشش پایین"],
    },
    {
      id: "hanging-leg-raise",
      hevyName: "Hanging Leg Raise",
      faName: "بالانش آویزان",
      muscles: "شکم پایینی، هسته",
      sets: 3,
      reps: "۸ تا ۱۵",
      rest: "۹۰ ثانیه",
      rpe: "۹",
      image: "/exercises/hanging-leg-raise.jpg",
      videoQuery: "hanging leg raise form tutorial",
      tips: [
        "کلید حرکت چرخش لگنه (posterior pelvic tilt) — نه فقط بالا بردن پا",
        "بدون تاب خوردن؛ پایین‌اومدن کنترل‌شده",
        "اگه سخته: زانوها خم (knee raise) — افتادن از فرم نداریم",
      ],
      mistakes: ["تاب خوردن از شانه‌ها", "پا رفت بالا ولی لگن ثابت موند → شکم کار نکرد"],
    },
    {
      id: "cable-crunch",
      hevyName: "Cable Crunch",
      faName: "شکم سیم‌کش زانوزده",
      muscles: "شکم (رکتوس آبدومینیس)",
      sets: 7,
      reps: "۱۲ تا ۱۵",
      rest: "۳۰–۴۵ ثانیه",
      rpe: "پامپ",
      image: "/exercises/cable-crunch.jpg",
      videoQuery: "kneeling cable crunch form tutorial",
      tips: [
        "دسته رو کنار گردن بگیر (نه پشت سر) و زانوها روی زمین",
        "ستون فقرات رو جمع کن — حس کن شکم داره فشرده می‌شه",
        "چند قدم از دستگاه فاصله بگیر تا کشش کامل حفظ بشه",
      ],
      mistakes: ["کشیدن با بازو", "خم شدن از لگن به جای جمع کردن ستون فقرات"],
      fst7: true,
    },
  ],
};

export const PROGRAM: WorkoutDay[] = [DAY1, DAY2, DAY3];

// ---------- نکات کلیدی FST-7 ----------
export const FST7_NOTES = {
  title: "چیست FST-7؟ (امضای هانی رامبد)",
  description:
    "سیستم ستاره‌ساز هانی رامبد — مربی ۱۹ بار مستر المپیا (فیث هیت، کریس بامستید، جی کاتلر). در پایان هر جلسه، حرکت ایزوله‌ی انتخابی را ۷ ست با استراحت فقط ۳۰–۴۵ ثانیه اجرا می‌کنی تا خون به بیشینه وارد عضله بشه، فاسیا (پوشش عضله) کشیده و باز بشه و فضای رشد عضله بیشتر بشه.",
  rules: [
    "۷ ست × ۱۰–۱۵ تکرار با استراحت فقط ۳۰–۴۵ ثانیه",
    "وزنه متوسط — پامپ مهم‌تر از سنگینی است",
    "بین ست‌ها عضله رو کشش بده و آب بنوش",
    "سنگینی‌ها اول جلسه (حرکات چندمفصلی)، پامپ آخر جلسه",
  ],
};

// ---------- قواعد پیشرفت ----------
export const PROGRESSION_RULES = [
  {
    title: "پیشروی دوگانه",
    text: "وقتی در همه ست‌ها به سقف تکرار رسیدی با فرم تمیز → وزنه رو +۲.۵ کیلو (بالاتنه) یا +۵ کیلو (پا) ببر و دوباره از کف تکرار شروع کن.",
    icon: "trending",
  },
  {
    title: "قانون RPE ۷–۹",
    icon: "gauge",
  },
  {
    title: "دیلود هر ۶–۸ هفته",
    text: "یک هفته با نصف وزنه‌ها تمرین کن. بدنت بازسازی می‌شه و بعدش قوی‌تر برمی‌گردی.",
    icon: "calendar",
  },
  {
    title: "قانون جلسه ۷۵ دقیقه‌ای",
    text: "جلسه‌ها رو زیر ۷۵ دقیقه نگه دار — کورتیزول بعد از این مدت اوج می‌گیره و مضر می‌شه.",
    icon: "timer",
  },
];

// ---------- تغذیه ----------
export const NUTRITION_NOTES = [
  {
    title: "کسری کالری",
    text: "حدود ۵۰۰ کالری زیر نیاز روزانه → هدف: کاهش ۰.۵ تا ۰.۷ کیلو در هفته. سریع‌تر از این یعنی عضله هم داری می‌سوزونی.",
  },
  {
    title: "پروتئین",
    text: "حدود ۱۶۰ تا ۱۸۰ گرم در روز (۲ گرم × وزن هدف). هر وعده ۳۰–۴۰ گرم: مرغ، تخم‌مرغ، ماهی، لبنیات کم‌چرب.",
  },
  {
    title: "کراتین",
    text: "۳ تا ۵ گرم هر روز — در کسری کالری کمک می‌کنه قدرت و عضله حفظ بشه. نیازی به لودینگ نیست.",
  },
  {
    title: "خواب",
    text: "۷ تا ۹ ساعت شبانه — بهترین داروی طبیعی کورتیزول. قبل از نیمه‌شب بخواب.",
  },
  {
    title: "آب",
  },
  {
    title: "کاردیو",
    text: "LISS (پیاده‌روی/شنا) پایه‌ست؛ HIIT حداکثر ۱ جلسه کوتاه در هفته. روزانه ۸–۱۰ هزار قدم.",
  },
];

export const MEDICAL_NOTES = [
  {
    text: "این دارو تحمل گرمای بدن رو کم می‌کنه. سالن خنک انتخاب کن، آب زیاد بخور و سرگیجه/تهوع/تعریق زیاد رو جدی بگیر.",
    level: "important" as const,
  },
  {
    level: "important" as const,
  },
  {
    text: "اگه تپش قلب یا خستگی غیرعادی دیدی، حجم کاردیو رو کم کن و با پزشکت در میون بگذار.",
    level: "info" as const,
  },
  {
    title: "تمرین و خلق‌وخو",
    level: "good" as const,
  },
  {
    title: "چک‌آپ پزشکی",
    level: "info" as const,
  },
];

// ---------- تقویم هفتگی ----------
export const WEEK_SCHEDULE = [
  { day: "شنبه", type: "workout", label: "جلسه ۱ — Push", dayId: "day1" },
  { day: "یکشنبه", type: "rest", label: "پیاده‌روی ۸–۱۰ قدم" },
  { day: "دوشنبه", type: "workout", label: "جلسه ۲ — Pull", dayId: "day2" },
  { day: "سه‌شنبه", type: "rest", label: "پیاده‌روی / شنا" },
  { day: "چهارشنبه", type: "workout", label: "جلسه ۳ — پا + شکم", dayId: "day3" },
  { day: "پنجشنبه", type: "rest", label: "استراحت کامل" },
  { day: "جمعه", type: "rest", label: "پیاده‌روی سبک" },
];

// ---------- ابزارها ----------
export function getExerciseById(id: string): Exercise | undefined {
  for (const day of PROGRAM) {
    const ex = day.exercises.find((e) => e.id === id);
    if (ex) return ex;
  }
  return undefined;
}

export function totalExercises(): number {
  return PROGRAM.reduce((acc, d) => acc + d.exercises.length, 0);
}
