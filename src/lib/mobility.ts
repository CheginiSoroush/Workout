// ============================================================
// ماژول انعطاف نسخه ۲ — کشش کل بدن (۱۴ حرکت) + دوچرخه ثابت خانه
// همه‌رسانه لوکال و آفلاین: عکس در /stretches، ویدیو در /stretches/videos
// پشتوانه علمی:
//   ACSM / Page 2012 (PMC3273886) — ۱۵–۳۰ ثانیه × ۲–۴ تکرار
//   Warneke 2025 — ۲–۳ ست روزانه × ۳۰–۱۲۰ ثانیه
//   Behm 2016 (PMID 26642915) — کشش <۶۰ث فقط ۱.۱٪− افت قدرت
//   Olsen 2012 (PMC3588693) — گرم‌کردن هوازی قبل وزنه
// ============================================================

export type StretchRegion = "گردن و شانه" | "سینه و پشت" | "کمر و ستون" | "لگن و باسن" | "پا";

export const STRETCH_REGIONS: StretchRegion[] = [
  "گردن و شانه",
  "سینه و پشت",
  "کمر و ستون",
  "لگن و باسن",
  "پا",
];

export interface StretchMove {
  id: string;
  faName: string;
  enName: string;
  region: StretchRegion;
  duration: string;
  howTo: string;
  why: string;
  photo?: string; // مسیر عکس لوکال
  video?: string; // مسیر ویدیوی لوکال (۵ ثانیه‌ای)
  optional?: boolean;
  key?: boolean; // کلیدی برای کمر
}

export const STRETCH_ROUTINE: StretchMove[] = [
  // ---------- گردن و شانه ----------
  {
    id: "neck",
    faName: "گردن (خم جانبی)",
    enName: "Side Neck Stretch",
    region: "گردن و شانه",
    duration: "۲ × ۲۰ ثانیه هر طرف",
    howTo:
      "نشسته یا ایستاده، تنه صاف؛ دست را روی سر بگذار و آرام به سمت کنار بکش — شانه مقابل پایین و شل. هرگز به عقب نکش.",
    why: "سفتی گردن از موبایل و نشستن، تا کمر و شانه کشیده می‌شود — شروع آرام روتین.",
    photo: "/stretches/neck.jpg",
    video: "/stretches/videos/neck.mp4",
  },
  {
    id: "shoulder-cross",
    faName: "کراس‌بادی شانه",
    enName: "Cross-Body Shoulder Stretch",
    region: "گردن و شانه",
    duration: "۳۰ ثانیه هر طرف",
    howTo:
      "دست را افقی روی سینه بیاور؛ با دست دیگر آرنج را به سمت سینه قفل کن. شانه پایین، تنه ثابت.",
    why: "پشت شانه و دلتوئید — برای سلامت شانه در پرس و نشر.",
    photo: "/stretches/shoulder-cross.jpg",
    video: "/stretches/videos/shoulder-cross.mp4",
  },
  // ---------- سینه و پشت ----------
  {
    id: "doorway-pec",
    faName: "سینه در چارچوب در",
    enName: "Doorway Pec Stretch",
    region: "سینه و پشت",
    duration: "۲۰–۳۰ ثانیه هر طرف",
    howTo:
      "ساعد روی چارچوب در، آرنج هم‌سطح شانه؛ یک قدم جلو و تنه را بچرخان تا جلوی شانه کشیده شود.",
    why: "پادزهر خم‌بودن روزانه — سینه باز = شانه عقب = قامت بلندتر + پرس بهتر.",
    photo: "/stretches/doorway-pec.jpg",
    video: "/stretches/videos/doorway-pec.mp4",
  },
  {
    id: "wall-lat",
    faName: "کشش لت روی دیوار",
    enName: "Wall Lat Stretch",
    region: "سینه و پشت",
    duration: "۳۰ ثانیه هر طرف",
    howTo:
      "دست‌ها بالای دیوار/چارچوب، لگن را عقب بده و سینه را پایین بین بازوها — کشش از زیربغل تا پهلو.",
    why: "عرض پشت (V-Taper) + شانه سالم — بعد از جلسه Pull طلاست.",
    photo: "/stretches/wall-lat.png",
    video: "/stretches/videos/wall-lat.mp4",
  },
  // ---------- کمر و ستون ----------
  {
    id: "cat-cow",
    faName: "گربه–گاو",
    enName: "Cat-Cow",
    region: "کمر و ستون",
    duration: "۸ تکرار آهسته",
    howTo:
      "چهار دست‌وپا؛ با دم کمر را گوهی خم کن، با بازدم قوس بده و نگاه بالا. مهره‌به‌مهره، بدون عجله.",
    why: "موبیلیتی کل ستون فقرات — گرم‌کننده همه کشش‌های بعدی.",
    photo: "/stretches/cat-cow.png",
    video: "/stretches/videos/cat-cow.mp4",
  },
  {
    id: "openbook",
    faName: "چرخش پشتی (کتاب باز)",
    enName: "Open Book Thoracic Rotation",
    region: "کمر و ستون",
    duration: "۳۰ ثانیه هر طرف",
    howTo:
      "به پشت خوابیده، زانوها خم و روی هم؛ هر دو زانو را آرام به یک طرف رها کن و دستِ مقابل را باز کن رو زمین و نگاه را دنبالش ببر.",
    why: "موبیلیتی سینه‌پشت — پرس بهتر، پشت صاف‌تر، کمر راحت‌تر.",
    photo: "/stretches/openbook.jpeg",
    video: "/stretches/videos/openbook.mp4",
  },
  {
    id: "mckenzie",
    faName: "کبرا (مک‌کنزی)",
    enName: "Cobra / McKenzie Extension",
    region: "کمر و ستون",
    duration: "۲ × ۲۰–۳۰ ثانیه",
    howTo:
      "رو شکم، کف دست‌ها کنار سینه؛ تنه را بالا بیار — اول با عضله کمر، بعد اگر راحت بود با کمک دست. لگن چسبیده به زمین.",
    why: "اکستنشن کمر طبق پروتکل مک‌کنزی — جبران خم‌شدنِ تمام‌روز.",
    photo: "/stretches/mckenzie.jpg",
    key: true,
  },
  {
    id: "childs-pose",
    faName: "کودک",
    enName: "Child's Pose",
    region: "کمر و ستون",
    duration: "۴۵ ثانیه",
    howTo:
      "زانوها کمی باز، باسن روی پاشنه، دست‌ها جلو و پیشونی روی زمین. با هر بازدم ۱–۲ سانت عمیق‌تر.",
    photo: "/stretches/childs-pose.jpg",
    video: "/stretches/videos/childs-pose.mp4",
  },
  // ---------- لگن و باسن ----------
  {
    id: "hip-flexor",
    faName: "لانژ پایین (فلکسور ران)",
    enName: "Low Lunge Hip Flexor Stretch",
    region: "لگن و باسن",
    duration: "۲ × ۳۰ ثانیه هر پا",
    howTo:
      "یک زانو زمین، پای جلو ۹۰ درجه؛ تنه صاف، باسن را جمع کن و لگن را آرام به جلو هل بده تا جلوی ران کشیده شود.",
    why: "⭐ مهم‌ترین کشش برای کمردردِ نشستن — فلکسور سفت، کمر را دائم قوس می‌دهد.",
    photo: "/stretches/hip-flexor.jpg",
    key: true,
  },
  {
    id: "figure4",
    faName: "شکل ۴ (باسن)",
    enName: "Figure-4 Glute Stretch",
    region: "لگن و باسن",
    duration: "۲ × ۳۰ ثانیه هر طرف",
    howTo:
      "پشت خوابیده، مچ پای جلو روی ران پای مقابل؛ پای مقابل را به سمت سینه بکش. کشش را در باسن حس کن.",
    why: "باسنِ سفت (پیریفورمیس) شایع‌ترین علت کشیده‌شدن کمر و باسن است.",
    photo: "/stretches/figure4.jpg",
    video: "/stretches/videos/figure4.mp4",
    key: true,
  },
  // ---------- پا ----------
  {
    id: "hamstring",
    faName: "همسترینگ (با بند)",
    enName: "Supine Hamstring Stretch",
    region: "پا",
    duration: "۲ × ۳۰ ثانیه هر پا",
    howTo:
      "پشت دراز بکش، پا را با حوله یا بند بالا بکش تا کشش ملایم پشت ران؛ زانو تقریباً صاف ولی قفل نه.",
    why: "همسترینگ سفت لگن را به عقب می‌چرخاند و فشار را روی کمر می‌اندازد.",
    photo: "/stretches/hamstring.jpg",
    video: "/stretches/videos/hamstring.mp4",
    key: true,
  },
  {
    id: "quad",
    faName: "چهارسر ایستاده",
    enName: "Standing Quad Stretch",
    region: "پا",
    duration: "۳۰ ثانیه هر پا",
    howTo:
      "ایستاده (یا با دست روی دیوار)، مچ پا را بگیر و پاشنه را به باسن نزدیک کن — زانوها کنار هم، لگن جمع.",
    why: "جلوی ران — بعد از اسکوات/لانژ/پرس پا لازمه.",
    photo: "/stretches/quad.jpg",
  },
  {
    id: "calf",
    faName: "ساق روی دیوار",
    enName: "Wall Calf Stretch",
    region: "پا",
    duration: "۳۰ ثانیه هر پا",
    howTo:
      "دست‌ها روی دیوار، پای عقب صاف با پاشنه چسبیده به زمین؛ به جلو خم شو تا ساق کشیده شود. زانوی پای عقب صاف.",
    why: "ساق سفت روی قوس کمر و مچ پا اثر می‌گذارد — برای سلامت اسکوات هم مهم.",
    photo: "/stretches/calf.png",
    video: "/stretches/videos/calf.mp4",
  },
  {
    id: "deadhang",
    faName: "آویزان‌شدن از بارفیکس",
    enName: "Dead Hang",
    region: "سینه و پشت",
    duration: "۲۰–۳۰ ثانیه",
    howTo: "از میله آویزان شو، شانه‌ها فعال و کمی پایین، نفس آرام. بگذار ستون فقرات باز شود.",
    why: "اختیاری — دکامپرشن کمر + قدرت گریپ برای بارفیکس جلسه Pull.",
    photo: "/stretches/deadhang.png",
    video: "/stretches/videos/deadhang.mp4",
    optional: true,
  },
];

export interface StretchWhen {
  icon: "dumbbell" | "moon" | "timer";
  title: string;
  text: string;
}

export const STRETCH_WHEN: StretchWhen[] = [
  {
    icon: "dumbbell",
    title: "روزهای وزنه",
    text: "بعد از وزنه و کاردیو — نه قبل از تمرین! کششِ طولانیِ قبل وزنه افت قدرت می‌دهد (Behm 2016).",
  },
  {
    icon: "moon",
    title: "روزهای استراحت",
    text: "هر ساعتی — ترجیحاً شب، بعد از پیاده‌روی یا ۵ دقیقه دوچرخه سبک تا بدن گرم باشد.",
  },
  {
    icon: "timer",
    title: "قانون طلایی",
    text: "هر روز ~۱۰ دقیقه کل بدن. ثباتِ روزانه از ۱۵ دقیقهِ گاه‌به‌گاه قوی‌تر است — ACSM: هر عضله مجموع ~۶۰ ثانیه در روز.",
  },
];

export const STRETCH_RULES: string[] = [
  "شدت کشش ۴–۵ از ۱۰ — احساس کشش بده، نه درد؛ هرگز فشار تند نکن",
  "نفس آرام و عمیق در کل نگه‌داشتن — بازدم طولانی تنش عصبی را کم می‌کند",
  "بدن سرد = کشش ممنوع — حداقل ۵ دقیقه حرکت سبک قبلش (دوچرخه‌ت عالیه!)",
  "انتظار واقعی: تفاوت محسوس ۴–۸ هفته — بعدش دامنهٔ اسکوات و ددلیفت هم تمیزتر می‌شود",
];

export const STRETCH_SOURCES = [
  {
    label: "ACSM / Page 2012 — کشش ۱۵–۳۰ث × ۲–۴ تکرار (PMC)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3273886",
  },
  {
    label: "Warneke 2025 — ۲–۳ ست روزانه × ۳۰–۱۲۰ ثانیه",
    url: "https://www.sciencedirect.com/science/article/pii/S2095254625000468",
  },
  {
    label: "Behm 2016 — کشش زیر ۶۰ث فقط ۱.۱٪− افت قدرت (PubMed)",
    url: "https://pubmed.ncbi.nlm.nih.gov/26642915/",
  },
];

// ---------------- دوچرخه ثابت ----------------

export interface BikeSlot {
  id: string;
  title: string;
  when: string;
  dose: string;
  howTo: string;
  why: string;
  highlight?: boolean;
}

export const BIKE_PLAN: BikeSlot[] = [
  {
    id: "warmup",
    title: "گرم‌کردن قبل از وزنه",
    when: "شنبه، دوشنبه، چهارشنبه — قبل از ست اول",
    dose: "۵ دقیقه خیلی آسان (مقاومت کم)",
    howTo:
      "ریتم پدال راحت — جوری که راحت حرف بزنی. بعدش برای حرکت اول جلسه، یک ست سبک اضافه بزن.",
    why: "دما و جریان خون عضله بالا می‌رود؛ گرم‌کردن هوازی قبل تمرین مقاومتی کوفتگی بعد تمرین را کم می‌کند (Olsen 2012).",
  },
  {
    id: "liss",
    title: "کاردیوی LISS بعد از وزنه",
    when: "همان روزهای وزنه — بعد از ست آخر",
    dose: "۱۵–۲۰ دقیقه • ضربان ۱۱۵–۱۳۵",
    howTo:
      "جایگزین تردمیل شیب‌دار در برنامه: مقاومت متوسط، ضربان را با ساعت هوشمند یا شمارنده دوچرخه چک کن.",
    why: "چربی‌سوزی با ضربان کنترل‌شده، بدون فشار زانو و بدون گرمای بیرون.",
    highlight: true,
  },
  {
    id: "recovery",
    title: "ریکاوری فعال روز استراحت",
    when: "یکشنبه، سه‌شنبه، پنجشنبه، جمعه — اختیاری",
    dose: "۲۰–۳۰ دقیقه خیلی آسان • ضربان زیر ~۱۱۵",
    howTo:
      "جایگزین یا مکمل پیاده‌روی ۸–۱۰ هزار قدم. ریلکس پدال بزن — نه جوری که عرق شدید کنی.",
    why: "جریان خون = ریکاوری سریع‌تر و کوفتگی کمتر، بدون فشار اضافه به بدن.",
  },
];

export const BIKE_WHY: string[] = [
  "کم‌ضربه‌ترین کاردیو — زانو و لگن هیچ ضربه‌ای تحویل نمی‌گیرند",
  "کنترل دقیق شدت با ضربان — LISS واقعی، نه HIIT تصادفی",
  "بارون و سرما بهانه نمی‌شود — ثبات قهرمان می‌سازد (اصل رامبد)",
];

export const BIKE_WARNING =

export const BIKE_SETUP =
  "تنظیم زین: ایستاده کنار دوچرخه، زین هم‌سطح استخوان لگن؛ در پایین‌ترین نقطهٔ پدال، زانو ۲۵–۳۰ درجه خم بماند.";

export const BIKE_SOURCES = [
  {
    label: "Olsen 2012 — گرم‌کردن هوازی قبل وزنه و کوفتگی (PMC)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3588693",
  },
  {
    label: "ACSM — Physical Activity Guidelines",
    url: "https://acsm.org/education-resources/trending-topics-resources/physical-activity-guidelines",
  },
];
