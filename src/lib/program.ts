// ============================================================
// داده‌های برنامه تمرینی «شناگر» — اصول FST-7 (هانی رامبد)
// ۳ روز در هفته + هدف کاهش وزن و فرم V-Taper
// ============================================================

export interface ExerciseVariant {
  faName: string;
  hevyName: string;
  note: string;
}

export type ExerciseMode = "machine" | "free";

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
  note?: string; // یادداشت برنامه (مثل راهنمای سوپرست)
  fst7?: boolean; // حرکت FST-7 (۷ ست پیاپی)

  // ---- نسخه‌های جایگزین: دستگاه ↔ وزنه آزاد ----
  // حرکت پایه کدام نسخه است؟ (پیش‌فرض: machine یعنی دستگاه/کابل)
  baseMode?: ExerciseMode;
  // نسخه دستگاهی جایگزین — وقتی حرکت اصلی وزنه آزاد است
  machineAlt?: ExerciseVariant;
  // نسخه وزنه آزاد جایگزین — وقتی حرکت اصلی دستگاه است
  freeAlt?: ExerciseVariant;
  // نسخه پیشنهادی برای شروع تازه‌کار (پیش‌فرض: baseMode)
  startMode?: ExerciseMode;
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
      image: "/exercises/bench-press.webp",
      videoQuery: "barbell bench press proper form tutorial",
      tips: [
        "تیغه‌های شانه رو عقب و پایین قفل کن و قفسه سینه رو باد کن",
        "هالتر رو روی خط نوک سینه پایین بیار؛ آرنج‌ها حدود ۴۵ تا ۷۰ درجه نسبت به بدن",
        "پاها محکم رو زمین — اولین فشار از پاها میاد، بعد پرس",
      ],
      mistakes: ["لگد زدن هالتر از سینه (bounce)", "بالا اومدن باسن از نیمکت"],
      baseMode: "free",
      startMode: "machine",
      machineAlt: {
        faName: "پرس سینه دستگاه",
        hevyName: "Chest Press (Machine)",
        note: "مسیر ثابت و بدون ریسک گیر کردن زیر وزنه — تمرکزت می‌مونه روی سینه. از هفته ۳–۴ پرس هالتر رو با میله خالی اضافه کن.",
      },
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
      image: "/exercises/incline-db-press.webp",
      videoQuery: "incline dumbbell press proper form tutorial",
      tips: [
        "شیب نیمکت ۳۰ درجه — بیشتر بشه سرشانه فعال‌تر می‌شه، کمتر بشه سینه پایین",
        "دمبل‌ها رو با مسیر کمی مورب به هم نزدیک کن و بالای سینه اسکوییز کن",
        "در پایین حرکت کشش رو حس کن، شونه‌ها رو نکش روون",
      ],
      mistakes: ["قوس شدید کمر", "برخورد دمبل‌ها به هم بالای سر (فقط نزدیک کن)"],
      baseMode: "free",
      startMode: "machine",
      machineAlt: {
        faName: "پرس بالاسینه دستگاه",
        hevyName: "Incline Chest Press (Machine)",
        note: "همون الگوی حرکتی، بدون دغدغه کنترل دو دمبل جدا — عالی برای هفته‌های یادگیری.",
      },
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
      image: "/exercises/db-shoulder-press.webp",
      videoQuery: "seated dumbbell shoulder press form tutorial",
      tips: [
        "پشتت کامل به پشتی نیمکت بچسبه؛ قوس کمر طبیعی و کم",
        "دمبل‌ها تا امتداد گوش پایین بیار و بدون قفل کامل آرنج بالا برو",
        "مچ‌ها صاف و در امتداد ساعد باشن",
      ],
      mistakes: ["قوس زیاد کمر برای بلند کردن وزنه سنگین‌تر", "باز کردن بیش از حد دمبل‌ها به پهلو"],
      baseMode: "free",
      startMode: "machine",
      machineAlt: {
        faName: "پرس سرشانه دستگاه",
        hevyName: "Shoulder Press (Machine)",
        note: "پشتی دستگاه قوس کمر رو کنترل می‌کنه — ریسک کمتر، تمرکز بیشتر روی دلتوئید.",
      },
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
      image: "/exercises/cable-fly.webp",
      videoQuery: "cable chest fly form tutorial",
      tips: [
        "قوس دست‌ها در کل حرکت ثابت بمونه — مثل در آغوش گرفتن یه درخت",
        "در انتهای حرکت ۱ ثانیه سینه رو اسکوییز کن",
        "یک پا جلو بذار و تنه رو کمی مایل کن برای ثبات",
      ],
      mistakes: ["تبدیل‌شدن به پرس با خم کردن آرنج‌ها", "کشیدن وزنه با کمر و سوئینگ بدن"],
      freeAlt: {
        faName: "قفسه سینه دمبل",
        hevyName: "Dumbbell Fly",
        note: "وقتی دستگاه شلوغه — کشش عمیق‌تر ولی کنترلش سخت‌تره؛ وزنه سبک انتخاب کن.",
      },
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
      image: "/exercises/rope-pushdown.webp",
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
      image: "/exercises/lateral-raise.webp",
      videoQuery: "dumbbell lateral raise form tutorial",
      tips: [
        "شونه‌ها پایین و عقب — ترپس رو درگیر نکن",
        "آرنج کمی خم و همیشه بالاتر از مچ حرکت کنه",
        "فقط تا خط شانه بالا بیا؛ پایین‌اومدن کنترل‌شده (۲–۳ ثانیه)",
      ],
      mistakes: ["سوئینگ و پرتاب دمبل با کمر", "بالاتر از شانه بردن با ترپس"],
      fst7: true,
      baseMode: "free",
      startMode: "machine",
      machineAlt: {
        faName: "نشر جانب سیم‌کش",
        hevyName: "Cable Lateral Raise",
        note: "تغییر وزنه بین ست‌ها با یک پیچ — برای ست‌های ۷گانه FST-7 ایده‌آله؛ خود رامبد هم برای FST-7 اغلب کابل/دستگاه استفاده می‌کنه.",
      },
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
      image: "/exercises/pull-up.webp",
      videoQuery: "pull up proper form tutorial",
      tips: [
        "دست‌ها کمی بازتر از عرض شانه، سینه به سمت میله",
        "قبل از کشیدن، شونه‌ها رو پایین و عقب بکش (depress)",
        "اگه کمتر از ۵ تا می‌زنی: Lat Pulldown با وزنه کم یا Assisted Pull-Up — افتادن از تکرار نداریم!",
      ],
      mistakes: ["کیک زدن با پا", "نصفه دامنه (چانه فقط تا میله بدون اسکوییز لت)"],
      baseMode: "free",
      startMode: "machine",
      machineAlt: {
        faName: "بارفیکس کمکی دستگاه",
        hevyName: "Assisted Pull-Up",
        note: "فنر/وزنه متعادل‌کننده تا وقتی ۵ تکرار تمیز بدون کمک بزنی — هر هفته کمک رو کم کن.",
      },
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
      image: "/exercises/barbell-row.webp",
      videoQuery: "barbell bent over row form tutorial",
      tips: [
        "تنه حدود ۴۵ درجه، کمر صاف و هسته سفت",
        "هالتر رو به سمت ناف یا پایین سینه بکش — نه سینه بالا",
        "تیغه‌های شانه رو در انتهای حرکت به هم نزدیک کن",
      ],
      mistakes: ["دم کردن با کمر (بالا اومدن تنه هر ست)", "کشش با بازو به جای پشت"],
      baseMode: "free",
      startMode: "machine",
      machineAlt: {
        faName: "زیربغل سیم‌کش نشسته",
        hevyName: "Seated Cable Row",
        note: "ستون فقرات اتکا داره و فشار می‌مونه روی پشت. اگه دستگاه زیربغل سینه‌اتکایی (مثل هامر استرنث که دوریان ییتس می‌زد) بود، همون بهترینه.",
      },
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
      image: "/exercises/lat-pulldown.webp",
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
      image: "/exercises/face-pull.webp",
      videoQuery: "cable face pull form tutorial",
      tips: [
        "طناب در ارتفاع صورت؛ به سمت پیشونی بکش نه سینه",
        "در انتها دست‌ها رو بیرون بچرخون (external rotation)",
        "این حرکت صندوقچه‌ی سلامت شانه‌ست — سنگینی برات مهم نیست",
      ],
      mistakes: ["وزنه سنگین → تبدیل به زیربغل", "کشیدن با کمر به جای شانه خلفی"],
    },
    {
      id: "reverse-pec-deck",
      hevyName: "Reverse Pec Deck (Machine)",
      faName: "پک‌دک معکوس",
      muscles: "ذوزنقه میانی (تراپز میانی)، سرشانه خلفی",
      sets: 3,
      reps: "۱۲ تا ۱۵",
      rest: "۶۰–۹۰ ثانیه",
      rpe: "۹",
      image: "/exercises/reverse-pec-deck.webp",
      videoQuery: "reverse pec deck rear delt fly machine tutorial",
      tips: [
        "سینه چسبیده به پد، تنه ثابت — حرکت فقط از شانه‌ها",
        "بازوها کمی خم و قفل؛ عقب بردن با جمع کردن تیغه‌های شانه، نه با دست",
        "انتهای حرکت ۱ ثانیه تراپز میانی رو اسکوییز کن",
        "شونه‌ها پایین نگه‌دار — اگر بالا اومد یعنی تراپز بالا دزدیده",
      ],
      mistakes: ["وزنه سنگین → سوئینگ و کمک گرفتن از کمر", "بالا انداختن شانه‌ها به سمت گوش", "باز کردن قفل آرنج وسط حرکت"],
      baseMode: "machine",
      freeAlt: {
        faName: "نشر خم دمبل",
        hevyName: "Dumbbell Reverse Fly",
        note: "وقتی دستگاه شلوغه — تنه موازی زمین، دمبل سبک، همون جمع کردن تیغه‌ها در انتها.",
      },
      note: "حرکت مستقیم تراپز میانی — هم‌حجم با فیس‌پول پشت تیغه‌های شانه رو کامل می‌کنه. اگه جلسه طولانی شد، سوپرست با جلوبازو بزن.",
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
      image: "/exercises/ez-curl.webp",
      videoQuery: "EZ bar bicep curl form tutorial",
      tips: [
        "آرنج‌ها ثابت کنار بدن — فقط ساعد حرکت می‌کنه",
        "پایین‌اومدن کنترل‌شده ۲ تا ۳ ثانیه‌ای",
        "دستگيره رو کمی بچرخون (supinate) بالای حرکت برای اسکوییز بیشتر",
      ],
      mistakes: ["سوئینگ کمر و پرتاب هالتر", "جلو آوردن آرنج‌ها هنگام بالا بردن"],
      baseMode: "free",
      startMode: "machine",
      machineAlt: {
        faName: "جلوبازو سیم‌کش",
        hevyName: "Cable Curl",
        note: "کشش بیسپس در کل دامنه + سوئینگ کمر عملاً غیرممکن — فرم تمیز از روز اول.",
      },
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
      image: "/exercises/straight-arm-pulldown.webp",
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
      image: "/exercises/leg-press.webp",
      videoQuery: "leg press machine form tutorial",
      tips: [
        "پاها عرض شانه وسط صفحه — کف پا کامل روی صفحه",
        "تا ۹۰ درجه یا کمی کمتر پایین بیا؛ باسن از صندلی جدا نشه",
        "بالا ارنج رو کامل قفل نکن — فشار همیشه روی عضله بمونه",
      ],
      mistakes: ["نصفه دامنه با وزنه خیلی سنگین", "بالا اومدن باسن و گردن‌انداختن کمر"],
      freeAlt: {
        faName: "اسکات گلابی دمبل",
        hevyName: "Goblet Squat",
        note: "برای تنوع یا تمرین در خانه/سفر — دمبل رو کنار سینه بگیر و عمیق پایین برو.",
      },
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
      image: "/exercises/rdl.webp",
      videoQuery: "romanian deadlift form tutorial",
      tips: [
        "لگن رو به عقب هل بده (hip hinge) — اسکات نیست!",
        "هالتر تمام مدت چسبیده به پا پایین میاد",
        "در پایین کشش همسترینگ رو حس کن، کمر صاف و سینه باز",
      ],
      mistakes: ["خم شدن کمر و گردنی شدن هالتر جلو", "زانوی زیاد خم → تبدیل به اسکات"],
      baseMode: "free",
      startMode: "machine",
      machineAlt: {
        faName: "بک اکستنشن دستگاه (۴۵ درجه)",
        hevyName: "Back Extension",
        note: "همون زنجیره پشتی (همسترینگ/باسن/فیله) با محافظت کامل کمر — RDL رو بعد هفته ۲–۳ با دمبل سبک برگردون.",
      },
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
      image: "/exercises/bulgarian-split-squat.webp",
      videoQuery: "bulgarian split squat form tutorial",
      tips: [
        "پنجه پای عقب روی نیمکت، پای جلو حدود ۶۰ سانت جلوتر",
        "تنه رو کمی مایل به جلو بیار تا باسن بیشتر درگیر بشه",
        "زانوی جلو در امتداد پنجه پا حرکت کنه، نه داخل‌تر",
      ],
      mistakes: ["گام خیلی کوتاه → فشار روی زانو", "اتکا و پرش با پای عقبی"],
      baseMode: "free",
      startMode: "machine",
      machineAlt: {
        faName: "پرس پا تک‌پا",
        hevyName: "Single Leg Press",
        note: "همون کار یک‌پا بدون دغدغه تعادل — هر پا جداگانه ثبت کن.",
      },
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
      image: "/exercises/leg-curl.webp",
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
      image: "/exercises/calf-raise.webp",
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
      image: "/exercises/hanging-leg-raise.webp",
      videoQuery: "hanging leg raise form tutorial",
      tips: [
        "کلید حرکت چرخش لگنه (posterior pelvic tilt) — نه فقط بالا بردن پا",
        "بدون تاب خوردن؛ پایین‌اومدن کنترل‌شده",
        "اگه سخته: زانوها خم (knee raise) — افتادن از فرم نداریم",
      ],
      mistakes: ["تاب خوردن از شانه‌ها", "پا رفت بالا ولی لگن ثابت موند → شکم کار نکرد"],
      baseMode: "free",
      startMode: "machine",
      machineAlt: {
        faName: "بالانش با صندلی کاپیتان",
        hevyName: "Captain's Chair Leg Raise",
        note: "پشتی از کمر حمایت می‌کنه و تاب خوردن حذف می‌شه — تمرکز روی چرخش لگن.",
      },
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
      image: "/exercises/cable-crunch.webp",
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
  { day: "یکشنبه", type: "rest", label: "پیاده‌روی ۸–۱۰ هزار قدم + کشش" },
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

// ---------- چرایی شروع دستگاه‌محور (سوییچ هر حرکت) ----------
export const MACHINE_FIRST_NOTE = {
  title: "چرا هفته‌های اول دستگاه‌محور؟",
  text: "هر دو نسخه عضله می‌سازن — متاآنالیز ۲۰۲۳ هیچ تفاوت معناداری در رشد عضله بین دستگاه و وزنه آزاد پیدا نکرد. دستگاه برای تازه‌کار یعنی: یادگیری سریع‌تر الگو، امنیت بدون اسپاتر و تمرکز کامل روی عضله. از هفته سوم، نسخه وزنه آزاد رو کم‌کم وارد کن (سوییچ داخل هر کارت). خود دوریان ییتس هم زیربغلش رو با دستگاه می‌زد!",
  linkLabel: "متاآنالیز Haugen ۲۰۲۳ (PMC)",
  linkUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10426227",
};

// ---------- ریشه هر اصل (Traceability) ----------
export interface SourceItem {
  principle: string;
  origin: string; // مربی / مکتب / منبع اصلی
  science: string; // پشتوانه علمی
  links: { label: string; url: string }[];
}

export const SOURCES: SourceItem[] = [
  {
    principle: "۷ ست پایانی هر عضله با استراحت ۳۰–۴۵ ثانیه (FST-7)",
    origin: "هانی رامبد — مربی ۱۹+ قهرمان المپیا (فیث هیت، کریس بامستید، جی کاتلر)",
    science: "استرس متابولیک و پامپ به‌عنوان یکی از مکانیسم‌های رشد عضله (Schoenfeld، ۲۰۱۰)",
    links: [
      { label: "سایت رسمی رامبد — FST-7", url: "https://www.hanyrambod.com/fst7" },
      { label: "Schoenfeld 2010 (PMID 20802478)", url: "https://pubmed.ncbi.nlm.nih.gov/20802478/" },
    ],
  },
  {
    principle: "شدت کنترل‌شده: RPE ۷–۹ بدون رسیدن به ناتوانی مطلق",
    origin: "دوریان ییتس — ۶ بار مستر المپیا؛ مکتب Blood & Guts",
    science: "ست‌های نزدیک ناتوانی مؤثرن، اما نگه‌داشتن ۱–۳ تکرار در مخزن رشد مشابهی با خستگی و ریسک آسیب کمتر می‌ده",
    links: [],
  },
  {
    principle: "حجم معقول + دیلود منظم — ریکاوری مقدس است",
    origin: "مایک منزر — بنیان‌گذار Heavy Duty؛ مربی خودِ دوریان ییتس در سال‌های اول",
    science: "عضله در زمان ریکاوری ساخته می‌شه؛ تمرینِ بیش از ظرفیت بازیابی = رکود و آسیب",
    links: [{ label: "Mike Mentzer (Wikipedia)", url: "https://en.wikipedia.org/wiki/Mike_Mentzer" }],
  },
  {
    principle: "شروع دستگاه‌محور برای تازه‌کار + سوییچ تدریجی به وزنه آزاد",
    origin: "سفارشی‌سازی برای تو: تازه‌کار، تمرین بدون اسپاتر، سابقه اضطراب",
    science: "متاآنالیز ۲۰۲۳ و RCT ۲۰۲۰: رشد عضله برابر است — دستگاه یادگیری سریع‌تر و امنیت بیشتری داره",
    links: [
      { label: "Haugen 2023 (PMC10426227)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10426227" },
      { label: "Schwanbeck 2020 (PMID 32358310)", url: "https://pubmed.ncbi.nlm.nih.gov/32358310/" },
    ],
  },
  {
    principle: "کراتین ۳–۵ گرم روزانه از روز اول",
    origin: "ISSN — انجمن بین‌المللی تغذیه ورزشی (Position Stand 2017)",
    science: "۳ گرم × ۲۸ روز ذخایر را ۲۰–۴۰٪ بالا می‌بره؛ در متاآنالیز ۲۰۲۵ تازه‌کارها هم پاسخ دادن (+۱.۲۳ کیلو FFM)",
    links: [
      { label: "ISSN 2017 (PMC5469049)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5469049" },
      { label: "متاآنالیز ۲۰۲۵ (PMC12777911)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12777911" },
    ],
  },
  {
    principle: "پروتئین ۱۶۰–۱۸۰ گرم در روز (۲ گرم × وزن هدف)",
    origin: "استاندارد علم تغذیه ورزشی",
    science: "متاآنالیز Morton 2018: نقطه اشباع رشد عضله حدود ۱.۶ گرم/کیلو — در کسری کالری تا ۲.۲ توصیه می‌شه",
    links: [{ label: "Morton 2018 (PMID 28675001)", url: "https://pubmed.ncbi.nlm.nih.gov/28675001/" }],
  },
  {
    principle: "جلسه زیر ۷۵ دقیقه + LISS به‌جای HIIT روزانه",
    science: "کنترل استرس تمرینی و حفظ بازیابی در کسری کالری — پیشرفت پایدار > سرعت لنگ",
    links: [],
  },
  {
    origin: "توصیه‌های رسمی اطلاعات دارویی (NHS)",
  },
];

// ---------- خلاصه تحقیق کراتین ----------
export const CREATINE_RESEARCH = {
  title: "تحقیق کراتین: تازه‌کار از روز اول؟ یا بعد از ۶ ماه؟",
  subtitle: "خلاصه پژوهش‌های معتبر بین‌المللی — و جواب نهایی برای شرایط تو",
  cards: [
    {
      title: "تازه‌کار vs تمرین‌دیده — متاآنالیز ۲۰۲۵ (۶۱ کارآزمایی)",
      text: "تمرین‌دیده‌ها به‌طور میانگین ۱.۸۲ کیلو توده بدون چربی گرفتن، تازه‌کارها ۱.۲۳ کیلو؛ سریع‌تر هم: ۶.۱ هفته vs ۱۳.۳ هفته. ولی تفاوت آماری معنادار نبود — یعنی کراتین برای هر دو کار می‌کنه؛ برای تازه‌کار شاید کمی کندتر و کمتر.",
      linkLabel: "PMC12777911",
      linkUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12777911",
    },
    {
      title: "دوز و ایمنی — ISSN Position Stand 2017",
      text: "۳ گرم در روز × ۲۸ روز ذخایر رو ۲۰ تا ۴۰٪ بالا می‌بره؛ دوز نگهدارنده ۳–۵ گرم؛ تا ۳۰ گرم در روز × ۵ سال بدون اثر مضر ثبت شده. نیازی به دوره لودینگ نیست.",
      linkLabel: "PMC5469049",
      linkUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5469049",
    },
    {
      title: "پاسخ‌دهنده‌ها و رژیم غذایی",
      text: "۲۰ تا ۳۰٪ افراد «پاسخ‌دهنده کم» هستن. گیاه‌خوارها ذخیره پایه پایین‌تری دارن و معمولاً بزرگ‌ترین جهش رو می‌گیرن. اگه بعد ۴ هفته فرقی حس نکردی، معنیش بی‌اثربودن کراتین نیست — اول تمرین و تغذیه رو چک کن.",
      linkLabel: "PMC7455984",
      linkUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7455984",
    },
    {
      title: "نتیجه برای تو — شروع از امروز",
      text: "۳ گرم هر روز، حتی روزهای استراحت، با آب زیاد. وزن آبیِ اول ماه (+۱ تا ۱.۵ کیلو) طبیعیه و چربی نیست. در کسری کالری، کراتین قدرت و عضله رو حفظ می‌کنه — دقیقاً هدف فعلی تو.",
    },
  ],
};

export const CLA_RESEARCH = {
  subtitle:
  cards: [
    {
      title: "CLA چیست و این محصول چیست؟",
    },
    {
      title: "چقدر واقعاً چربی کم می‌کند؟ — متاآنالیزها",
      text: "برآورد متاآنالیز Whigham ۲۰۰۷: با ~۳.۲ گرم در روز، حدود ۰.۰۹ کیلو چربی در هفته (~۱ کیلو در ۳ ماه). مرور Onakpoya ۲۰۱۲ محافظه‌کارانه‌تر: ~۰.۷ کیلو در ۶ ماه. یعنی اثر واقعی ولی به‌چشم‌نیامدنی در آینه — در حالی که کسری ۵۰۰ کالری تو هفته‌ای ~۰.۵ کیلو می‌دهد؛ تقریباً ۱۰ برابر بیشتر، بدون هزینه.",
      linkLabel: "Whigham 2007 — متاآنالیز AJCN (PubMed)",
      linkUrl:
        "https://pubmed.ncbi.nlm.nih.gov/?term=Whigham+conjugated+linoleic+acid+reducing+body+fat+meta-analysis",
    },
    {
      title: "عضله و قدرت چه؟",
      text: "در پژوهش‌های آموزش مقاومتی، CLA نسبت به پلاسیبو تفاوت معنادار در قدرت و عضله‌سازی نشان نداد؛ چند مطالعهٔ کوچک کاهش جزئی چربی در ورزشکاران دیدند ولی اثر ناچیز بود. جایگزین پروتئین و کراتین نیست و هیچ‌وقت نمی‌تواند باشد.",
      linkLabel: "Onakpoya — مرور نظام‌مند (PubMed)",
      linkUrl:
        "https://pubmed.ncbi.nlm.nih.gov/?term=Onakpoya+conjugated+linoleic+acid+body+fat+systematic+review",
    },
    {
      title: "عوارض و احتیاط‌ها — این بخش مهم است",
      text: "رایج: ناراحتی گوارشی (تهوع، اسهال، مزهٔ بد). مهم‌تر: در چند کارآزمایی، CLA حساسیت به انسولین را کمی بدتر و قند ناشتا را بالاتر برد — اگر پیش‌دیابت یا سابقهٔ خانوادگی داری، اول با پزشک چک کن. دوزهای بالا و طولانی‌مدت در مطالعات حیوانی بار کبدی نشان داده‌اند.",
    },
    {
      text: "روی جعبه ببین: میلی‌گرم CLA در هر کپسول (۱۰۰۰)، تعداد کپسول، و درصد ایزومر فعال (~۷۵–۸۰٪). فقط از داروخانهٔ معتبر بخر — بازار مکمل ایران جنس باز و تقلبی زیاد دارد. قیمت هر گرم CLA را با برند معتبر Tonalin مقایسه کن تا کلاه سرت نرود.",
    },
    {
      title: "نتیجه برای تو — اولویت‌بندی پول",
      text: "ترتیب هزینه‌به‌نتیجه در فاز فعلی: ۱) پروتئین ~۱۷۰ گرم ۲) کراتین ۳ گرم ۳) خواب و پیوستن به برنامه ۴) CLA — اختیاری، ۱ تا ۲ درصد بازی اضافه. اگر باز هم خواستی: ۱ کپسول با ناهار و ۱ با شام، حداقل ۸–۱۲ هفته قبل از قضاوت؛ اگر گوارش اذیت شد قطع کن — و هیچ‌وقت جای کسری کالری و گام‌های روزانه را نگیرد.",
    },
  ],
};

// ---------- راهنمای Hevy ----------
export const HEVY_GUIDE = {
  title: "ثبت برنامه در Hevy — قدم به قدم",
  subtitle: "یک‌بار ۵ دقیقه وقت می‌بره؛ بعدش فقط ثبت و پیشرفت",
  steps: [
    { title: "۳ Routine بساز", text: "با اسم‌های «FST-7 D1 Push»، «FST-7 D2 Pull» و «FST-7 D3 Legs»." },
    { title: "حرکات رو با اسم انگلیسی سرچ کن", text: "اسم دقیق Hevy هر حرکت روی کارتش نوشته شده — با سوییچ دستگاه/وزنه آزاد، اسم هم عوض می‌شه." },
    { title: "ست، تکرار و استراحت رو ست کن", text: "اعداد روی هر کارت نوشته شده؛ Rest Timer رو فعال کن تا بین ست‌ها هشدار بده." },
    { title: "RPE رو در Notes بنویس", text: "مثلاً «RPE 8 — ۱–۳ تکرار در مخزن». بعداً متوجه می‌شی چقدر نزدیک ناتوانی رفتی." },
    { title: "ست‌های FST-7: استراحت ۴۵ ثانیه", text: "هفت ست پیاپی با تایمر — پامپ مهم‌تر از سنگینی‌ست، وزنه متوسط نگه دار." },
    { title: "یادآور بذار", text: "شنبه، دوشنبه، چهارشنبه — اعلان Hevy رو روشن کن تا هیچ جلسه‌ای جا نمونه." },
    { title: "بعد هر جلسه اینجا تیک بزن", text: "چک‌لیست هفتگی داشبورد رو پر کن تا روندت رو با هم ببینیم و برنامه رو در مسیر تنظیم کنیم." },
  ],
};
