// ============================================================
// تولید خروجی برنامه FST-7 برای اپ‌های دیگر (Hevy, Lyfta, Fitbod, openGym, GymMane)
// منبع داده: src/lib/program.ts + src/lib/mobility.ts — تک‌منبع حقیقت
// اجرا: bun run research/gen_app_exports.ts
// ============================================================

import {
  PROGRAM,
  WEEK_SCHEDULE,
  PROGRESSION_RULES,
  NUTRITION_NOTES,
  MEDICAL_NOTES,
  FST7_NOTES,
  MACHINE_FIRST_NOTE,
  PROFILE,
} from "../src/lib/program";
import {
  STRETCH_ROUTINE,
  BIKE_PLAN,
  STRETCH_RULES,
  STRETCH_WHEN,
  BIKE_WARNING,
  BIKE_SETUP,
} from "../src/lib/mobility";
import { faNum } from "../src/lib/fa";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.join(__dirname, "..");
const TODAY = "2026-10-24";

// استراحت بر حسب ثانیه — دقیقاً هماهنگ با نسخهٔ Liftosaur v2 (کانونی)
const REST_SEC: Record<string, number> = {
  "bench-press": 180,
  "incline-db-press": 120,
  "db-shoulder-press": 120,
  "cable-fly": 90,
  "rope-pushdown": 75,
  "lateral-raise": 45,
  "pull-up": 180,
  "barbell-row": 180,
  "lat-pulldown": 120,
  "face-pull": 90,
  "ez-curl": 90,
  "straight-arm-pulldown": 45,
  "leg-press": 180,
  rdl: 180,
  "bulgarian-split-squat": 90,
  "leg-curl": 75,
  "calf-raise": 60,
  "hanging-leg-raise": 90,
  "cable-crunch": 45,
};

// کشش‌های سرد کردن مخصوص هر روز — هماهنگ با عضلات روز
const COOLDOWN: Record<string, { ids: string[]; label: string }> = {
  day1: {
    ids: ["doorway-pec", "shoulder-cross", "childs-pose"],
    label: "چارچوب در (سینه) — کراس‌بادی شانه — کودک",
  },
  day2: {
    ids: ["wall-lat", "deadhang", "cat-cow"],
    label: "کشش لت روی دیوار — آویزان‌شدن از بارفیکس — گربه–گاو",
  },
  day3: {
    ids: ["hamstring", "quad", "hip-flexor", "calf"],
    label: "همسترینگ با بند — چهارسر ایستاده — فلکسور ران — ساق روی دیوار",
  },
};

// گرم‌کردن ست اول هر روز — هماهنگ با Liftosaur v2
const WARMUP_FIRST: Record<string, string> = {
  "bench-press": "۱×۸ ۴۰٪ → ۱×۴ ۶۰٪ → ۱×۲ ۷۵٪ (درصد از وزنه ست اول)",
  "pull-up": "۱ ست اسکاپولار پول + ۵ تکرار سبک با کش کمکی",
  "leg-press": "۱×۱۰ ۴۰٪ → ۱×۵ ۶۰٪ → ۱×۳ ۷۵٪ (درصد از وزنه ست اول)",
};

const fa2en = (s: string) =>
  s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
const repsEn = (reps: string) =>
  fa2en(reps).replace(/ تا /g, "-").trim();

const WARMUP_LINE =
  "گرم‌کردن: دوچرخه ثابت ۵ دقیقه خیلی سبک (مقاومت کم — ریتمی که راحت حرف بزنی) + ست‌های سبکِ حرکت اول جلسه";
const LISS_LINE =
  "بعد از ست آخر: LISS دوچرخه ۱۵ تا ۲۰ دقیقه (ضربان ۱۱۵ تا ۱۳۵) — جایگزین تردمیل شیب‌دار";

// ---------- برگهٔ ساخت برای هر روز ----------
function daySheet(dayId: string, appName: string): string {
  const day = PROGRAM.find((d) => d.id === dayId)!;
  const cd = COOLDOWN[dayId];
  const lines: string[] = [];
  lines.push(`--- ${day.title} (${day.weekDay}) — ${day.duration} ---`);
  lines.push(`هدف روز: ${day.why}`);
  lines.push("");
  lines.push(`[${WARMUP_LINE}]`);
  lines.push("");
  day.exercises.forEach((ex, i) => {
    const warm = WARMUP_FIRST[ex.id] ? `\n  ★ گرم‌کردن این حرکت: ${WARMUP_FIRST[ex.id]}` : "";
    const fst = ex.fst7 ? " — ★ FST-7 FINISHER (۷ ست پیاپی، پامپ)" : "";
    const perLeg = ex.id === "bulgarian-split-squat" ? " (هر پا جدا)" : "";
    lines.push(
      `${i + 1}. ${ex.hevyName} — ${ex.sets} × ${repsEn(ex.reps)}${perLeg} — rest ${REST_SEC[ex.id]}s — RPE ${fa2en(ex.rpe).replace("پامپ", "9 (pump)")}${fst}`
    );
    lines.push(`  Notes: ${ex.tips[0] || ex.faName}${warm}`);
    const alt = ex.machineAlt?.hevyName || ex.freeAlt?.hevyName;
    if (alt) lines.push(`  نسخهٔ جایگزین (همان تمرین): ${alt}`);
  });
  lines.push("");
  lines.push(`[${LISS_LINE}]`);
  lines.push(`[سرد کردن — روتین کششی سایت: ${cd.label}]`);
  return lines.join("\n");
}

// ---------- برگهٔ ساخت کامل برای یک اپ ----------
function buildSheet(appName: string, accent: string): string {
  const parts: string[] = [];
  parts.push("=====================================================");
  parts.push(`FST-7 SWIMMER — ${appName} — برگهٔ ساخت کامل`);
  parts.push(`تولید: ${TODAY} | منبع: داشبورد شناگر FST-7`);
  parts.push("=====================================================");
  parts.push("");
  parts.push("هفته: شنبه Push | دوشنبه Pull | چهارشنبه پا+شکم | بقیه روزها استراحت/کششی/دوچرخه");
  parts.push(`پروفایل: ${PROFILE.age} ساله، ${faNum(PROFILE.height)} سانتی‌متر، هدف ${PROFILE.targetWeight} کیلو — ${PROFILE.goal}`);
  parts.push("");
  PROGRAM.forEach((d) => {
    parts.push(daySheet(d.id, appName));
    parts.push("");
  });
  parts.push("--- برنامهٔ دوچرخه ثابت (خانه) ---");
  BIKE_PLAN.forEach((b) => {
    parts.push(`• ${b.title} — ${b.when} — ${b.dose}`);
    parts.push(`  ${b.howTo}`);
  });
  parts.push("");
  parts.push("--- قواعد پیشرفت (داخل اپ دنبال کن) ---");
  PROGRESSION_RULES.forEach((r) => parts.push(`• ${r.title}: ${r.text}`));
  parts.push("");
  parts.push("--- قوانین FST-7 ---");
  parts.push(`• ${FST7_NOTES.description}`);
  FST7_NOTES.rules.forEach((r) => parts.push(`• ${r}`));
  parts.push("");
  MEDICAL_NOTES.forEach((m) => parts.push(`• ${m.title}: ${m.text}`));
  parts.push("");
  parts.push("قاعدهٔ طلایی: ثبت‌نکردن = تمرین‌نکردن — هر ست را در اپ لاگ کن تا پیشرفت دوگانه کار کند.");
  void accent;
  return parts.join("\n");
}

// ---------- برگهٔ جامع هفتگی (مارک‌داون) ----------
function weeklySheet(): string {
  const p: string[] = [];
  p.push("# 🏊 روتین کامل هفتگی ورزش — برنامهٔ شناگر FST-7");
  p.push("");
  p.push(`> تولید ${TODAY} — تک‌برگ مرجع برای ساخت برنامه در هر اپ یا روی کاغذ`);
  p.push(`> پروفایل: ${faNum(PROFILE.age)} ساله | ${faNum(PROFILE.height)} سانتی‌متر | ${faNum(PROFILE.startWeight)} → ${faNum(PROFILE.targetWeight)} کیلو | هدف: ${PROFILE.goal}`);
  p.push(`> پروتئین: ${faNum(PROFILE.proteinPerTargetKg)} گرم به ازای هر کیلو وزن هدف | کسری کالری: ${faNum(PROFILE.calorieDeficit)} | کراتین: ${PROFILE.creatine}`);
  p.push("");
  p.push("## 📅 تقویم هفته");
  p.push("");
  p.push("| روز | برنامه |");
  p.push("|---|---|");
  WEEK_SCHEDULE.forEach((w) => {
    p.push(`| ${w.day} | ${w.label} |`);
  });
  p.push("");
  p.push("## 🔥 پروتکل هر جلسه (ترتیب دقیق)");
  p.push("");
  p.push(`1. ${BIKE_PLAN[0].title}: ${BIKE_PLAN[0].dose} — ${BIKE_PLAN[0].howTo}`);
  p.push("2. ست‌های گرم‌کردنی حرکت اول: پرس سینه/پرس پا: ۱×۸ ۴۰٪ → ۱×۴ ۶۰٪ → ۱×۲ ۷۵٪ — بارفیکس: اسکاپولار پول + کش");
  p.push("3. حرکات اصلی به ترتیب (تا RPE ۸–۹ — همیشه ۱–۳ تکرار در مخزن)");
  p.push("4. فینیشر FST-7 (۷ ست ایزوله با ۳۰–۴۵ ثانیه استراحت)");
  p.push(`5. ${LISS_LINE}`);
  p.push("6. سرد کردن: کشش‌های همان روز (~۵ دقیقه) — جدول پایین");
  p.push("");
  p.push(`> ${MACHINE_FIRST_NOTE.title} ${MACHINE_FIRST_NOTE.text}`);
  p.push("");
  PROGRAM.forEach((day, di) => {
    p.push(`## ${day.title} — ${day.weekDay} (${day.duration})`);
    p.push("");
    p.push(`**چرا این روز:** ${day.why}`);
    p.push("");
    p.push(`**کاردیو روز:** ${day.cardio}`);
    p.push("");
    day.exercises.forEach((ex, i) => {
      const warm = WARMUP_FIRST[ex.id] ? `  \n> ★ گرم‌کردن این حرکت: ${WARMUP_FIRST[ex.id]}` : "";
      p.push(`### ${faNum(di + 1)}.${faNum(i + 1)} ${ex.faName} — \`${ex.hevyName}\``);
      p.push("");
      p.push(
        `- **عضله:** ${ex.muscles} | **دوز:** ${faNum(ex.sets)} ست × ${ex.reps} | **استراحت:** ${ex.rest} | **RPE:** ${ex.rpe}${ex.fst7 ? " | ★ **FST-7**" : ""}`
      );
      p.push(`- **نکات فرم:**`);
      ex.tips.forEach((t) => p.push(`  - ${t}`));
      p.push(`- **خطاهای رایج:**`);
      ex.mistakes.forEach((m) => p.push(`  - ${m}`));
      const altM = ex.machineAlt ? `دستگاه: ${ex.machineAlt.faName} (${ex.machineAlt.hevyName}) — ${ex.machineAlt.note}` : null;
      const altF = ex.freeAlt ? `وزنه آزاد: ${ex.freeAlt.faName} (${ex.freeAlt.hevyName}) — ${ex.freeAlt.note}` : null;
      if (altM || altF) {
        p.push(`- **نسخه‌های جایگزین:**`);
        if (altM) p.push(`  - ${altM}`);
        if (altF) p.push(`  - ${altF}`);
      }
      if (warm) p.push(warm.trim());
      p.push("");
    });
    p.push(`**پایان جلسه:** ${LISS_LINE}`);
    p.push(`**سرد کردن:** ${COOLDOWN[day.id].label}`);
    p.push("");
  });
  p.push("## 🚴 برنامهٔ دوچرخه ثابت (خانه)");
  p.push("");
  BIKE_PLAN.forEach((b) => {
    p.push(`### ${b.title}${b.highlight ? " ⭐" : ""}`);
    p.push(`- **کی:** ${b.when}`);
    p.push(`- **دوز:** ${b.dose}`);
    p.push(`- **چطور:** ${b.howTo}`);
    p.push(`- **چرا:** ${b.why}`);
    p.push("");
  });
  p.push(`**تنظیم زین:** ${BIKE_SETUP}`);
  p.push("");
  p.push(`> ⚠️ ${BIKE_WARNING}`);
  p.push("");
  p.push("## 🧘 روتین کششی روزانه (~۱۰ دقیقه — بعد از تمرین یا شب)");
  p.push("");
  p.push("| # | حرکت | ناحیه | دوز | چطور |");
  p.push("|---|---|---|---|---|");
  STRETCH_ROUTINE.forEach((s, i) => {
    const star = s.key ? " ⭐" : "";
    p.push(`| ${faNum(i + 1)} | ${s.faName}${star} — ${s.enName} | ${s.region} | ${s.duration} | ${s.howTo} |`);
  });
  p.push("");
  p.push("⭐ = کلیدی برای کمر. کشش اختیاری: آویزان‌شدن از بارفیکس (دکامپرشن کمر).");
  p.push("");
  STRETCH_WHEN.forEach((w) => p.push(`- **${w.title}:** ${w.text}`));
  p.push("");
  STRETCH_RULES.forEach((r, i) => p.push(`${faNum(i + 1)}. ${r}`));
  p.push("");
  p.push("## 📈 قواعد پیشرفت");
  p.push("");
  PROGRESSION_RULES.forEach((r) => p.push(`- **${r.title}:** ${r.text}`));
  p.push("");
  p.push(`## ⭐ FST-7 — ${FST7_NOTES.title}`);
  p.push("");
  p.push(FST7_NOTES.description);
  p.push("");
  FST7_NOTES.rules.forEach((r) => p.push(`- ${r}`));
  p.push("");
  p.push("## 🥗 تغذیه");
  p.push("");
  NUTRITION_NOTES.forEach((n) => p.push(`- **${n.title}:** ${n.text}`));
  p.push("");
  p.push("");
  MEDICAL_NOTES.forEach((m) => p.push(`- **${m.title}:** ${m.text}`));
  p.push("");
  p.push("---");
  p.push("");
  p.push("**قاعدهٔ طلایی: ثبت‌نکردن = تمرین‌نکردن.** هر ست را لاگ کن؛ هفته بعد را همان لاگ تصمیم می‌گیرد.");
  return p.join("\n");
}

// ---------- ساخت فایل‌ها ----------
const outDir = path.join(ROOT, "public", "exports");
fs.mkdirSync(outDir, { recursive: true });

const weekly = weeklySheet();
fs.writeFileSync(path.join(outDir, "weekly-routine-full.md"), weekly, "utf8");

const hevySheet = buildSheet("HEVY", "hevy");
fs.writeFileSync(path.join(outDir, "build-hevy.txt"), hevySheet, "utf8");

const lyftaSheet = buildSheet("LYFTA", "lyfta");
fs.writeFileSync(path.join(outDir, "build-lyfta.txt"), lyftaSheet, "utf8");

const genericSheet = buildSheet("GENERIC APP", "generic");
fs.writeFileSync(path.join(outDir, "build-generic.txt"), genericSheet, "utf8");

// ---------- تولید ماژول TS برای UI ----------
const mod = `// ============================================================
// خروجی برنامه برای اپ‌های دیگر — تولید خودکار توسط research/gen_app_exports.ts
// دستی ویرایش نکن! منبع: src/lib/program.ts + src/lib/mobility.ts
// اعتبار: ${TODAY}
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
  copyText: ${JSON.stringify(weekly)},
};

export const APP_EXPORTS: AppExportCard[] = ${JSON.stringify(
    [
      {
        id: "hevy",
        name: "Hevy",
        faName: "محبوب‌ترین لاگر — نام‌های کتابخانه‌اش را از قبل داریم",
        website: "https://hevy.com",
        badge: "manual",
        badgeText: "ساخت دستی دقیق — ~۵ دقیقه",
        summary:
          "Hevy ایمپورتِ روال ندارد (فقط تاریخچهٔ ورزش CSV) — ولی نام ۱۹ حرکت برنامه دقیقاً با کتابخانه‌اش تطبیق داده شده؛ برگه را باز کن و هر روال را در ۲ دقیقه بساز.",
        steps: [
          "اپ Hevy → تب Workout → New Routine (۳ روال بساز: Push / Pull / پا+شکم)",
          "حرکت را با نام انگلیسی برگه سرچ کن — همان را انتخاب کن (نام‌ها دقیق‌اند)",
          "ست‌ها، تکرار، Rest (ثانیه) و RPE را از برگه بزن؛ نوت هر حرکت را کپی کن",
          "گرم‌کردن هر حرکت اول را با تیک Warmup روی ست‌های سبک علامت بزن",
        ],
        notes: [
          "فولدر بساز به نام FST-7 و هر ۳ روال را داخلش بگذار",
          "ست‌های FST-7 را Superset نزن — فقط استراحت ۴۵ ثانیه",
        ],
        file: "/exports/build-hevy.txt",
        copyText: hevySheet,
      },
      {
        id: "lyfta",
        name: "Lyfta",
        faName: "لاگر نروژی — کتابخانه ۵۰۰۰+ حرکت با ویدیو",
        website: "https://lyfta.app",
        badge: "manual",
        badgeText: "ساخت دستی دقیق — ~۵ دقیقه",
        summary:
          "Lyfta فقط تاریخچهٔ ورزش را از اپ‌های دیگر import می‌کند، نه برنامه. ساخت روال دستی است و برگهٔ ما دقیقاً برای همین کار چیده شده.",
        steps: [
          "اپ یا my.lyfta.app → Routines → New Routine",
          "۱۹ حرکت را با نام‌های انگلیسی برگه پیدا کن (کتابخانه‌اش بزرگ و کامل است)",
          "دوز و استراحت و نوت‌ها را از برگه وارد کن؛ برای هر روز یک روال",
        ],
        notes: [
          "اگر از Hevy لاگ داشتی، History Import آن جدا انجام می‌شود",
          "Rest Timer هر حرکت را روی ثانیه‌های برگه تنظیم کن — مخصوصاً FST-7 (۴۵ ثانیه)",
        ],
        file: "/exports/build-lyfta.txt",
        copyText: lyftaSheet,
      },
      {
        id: "fitbod",
        name: "Fitbod",
        faName: "تولید برنامه با الگوریتم — import برنامه ندارد",
        website: "https://fitbod.me",
        badge: "manual",
        badgeText: "ساخت دستی — متفاوت",
        summary:
          "Fitbod برخلاف بقیه برنامه را خودش با الگوریتم می‌سازد و اجازهٔ import برنامهٔ آماده ندارد. راه درست: برای هر روز یک Custom Workout بساز و برگه را به‌عنوان مرجع ساختار و دوزها نگه دار.",
        steps: [
          "Workouts → دکمه + → Create Custom Workout (برای هر روز یکی)",
          "حرکات برگه را اضافه کن — Fitbod وزنهٔ پیشنهادی خودش را می‌دهد",
          "ست‌ها را مطابق برگه تنظیم کن (۴×۵-۸ پرس سینه و...) و نوت‌ها را کپی کن",
        ],
        notes: [
          "Fitbod پیشرفت را خودش محاسبه می‌کند — قاعدهٔ دوگانهٔ ما آنجا خودکار نیست، پس برگه را مرجع نگه دار",
          "روتین کششی/دوچرخه در Fitbod جایی ندارد — فقط باشگاه",
        ],
        file: "/exports/build-generic.txt",
        copyText: genericSheet,
      },
      {
        id: "opengym",
        name: "openGym",
        faName: "چند اپ هم‌نام هست — معتبرترین: «OpenGym: Cross-platform Gym»",
        website: "https://play.google.com/store/apps/details?id=pro.filonov.npng",
        badge: "unknown",
        badgeText: "برگهٔ همگانی",
        summary:
          "چند اپ با نام openGym وجود دارد (پلتفرم باشگاهی، ردیاب تمرین و...) — برگهٔ همگانی ما برای هرکدامشان کار می‌کند؛ ساخت دستی با همان مراحل استاندارد.",
        steps: [
          "در اپ، بخش Routine/Program/Plan را پیدا کن",
          "حرکات را با نام انگلیسی برگه اضافه کن و دوزها را وارد کن",
        ],
        notes: [
          "اگر اپِ خاصی که نصب کردی import خودکار داشت، اسم دقیقش را بگو تا خروجی مخصوصش را بسازم",
        ],
        file: "/exports/build-generic.txt",
        copyText: genericSheet,
      },
      {
        id: "gymmane",
        name: "GymMane",
        faName: "اپی با این نام دقیق پیدا نکردم — احتمالاً اسمش کمی فرق دارد",
        website: "https://play.google.com/store/search?q=gym%20workout%20tracker&c=apps",
        badge: "unknown",
        badgeText: "در انتظار نام دقیق",
        summary:
          "در Google Play و وب اپی به نام GymMane ثبت نشده (نزدیک‌ترین‌ها: Gymmate، Gymie، Gymmie). برگهٔ همگانی را در هر اپی که مقصودت است بریز؛ اگر لینک استورش را فرستادی، خروجی اختصاصی‌اش را سریع می‌سازم.",
        steps: [
          "لینک اپ را برایم بفرست تا فرمت import یا ساخت دستی دقیقش را چک کنم",
          "تا آن موقع: برگهٔ همگانی را در اپ دستی وارد کن",
        ],
        notes: ["برگهٔ همگانی برای همهٔ لاگرها کار می‌کند — نام حرکات انگلیسی استاندارد است"],
        file: "/exports/build-generic.txt",
        copyText: genericSheet,
      },
    ],
    null,
    2,
  )};
`;

fs.writeFileSync(path.join(ROOT, "src", "lib", "appExports.ts"), mod, "utf8");

console.log("generated:");
console.log(" - public/exports/weekly-routine-full.md", weekly.length, "chars");
console.log(" - public/exports/build-hevy.txt", hevySheet.length, "chars");
console.log(" - public/exports/build-lyfta.txt", lyftaSheet.length, "chars");
console.log(" - public/exports/build-generic.txt", genericSheet.length, "chars");
console.log(" - src/lib/appExports.ts");
