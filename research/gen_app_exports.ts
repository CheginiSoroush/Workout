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
  type Exercise,
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
  "reverse-pec-deck": 75,
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
// mode = "base" (وزنهٔ آزاد/پایه) | "machine" (نسخهٔ دستگاهی — همان منطق سوییچ کارت‌های سایت)
function daySheet(dayId: string, appName: string, mode: "base" | "machine" = "base"): string {
  const day = PROGRAM.find((d) => d.id === dayId)!;
  const cd = COOLDOWN[dayId];
  const lines: string[] = [];
  lines.push(`--- ${day.title} (${day.weekDay}) — ${day.duration} ---`);
  lines.push(`هدف روز: ${day.why}`);
  lines.push("");
  lines.push(`[${WARMUP_LINE}]`);
  lines.push("");
  day.exercises.forEach((ex, i) => {
    const mach = mode === "machine" ? ex.machineAlt : null;
    // نام اصلی هر اسلات در هر دو حالت — حرکات پایه‌دستگاهی در برگهٔ آزاد باید نسخهٔ freeAlt را بگیرند
    const name =
      mode === "machine"
        ? ex.machineAlt?.hevyName ?? ex.hevyName
        : ex.freeAlt?.hevyName ?? ex.hevyName;
    const faName = mach ? mach.faName : ex.faName;
    const warm = WARMUP_FIRST[ex.id] ? `\n  ★ گرم‌کردن این حرکت: ${WARMUP_FIRST[ex.id]}` : "";
    const fst = ex.fst7 ? " — ★ FST-7 FINISHER (۷ ست پیاپی، پامپ)" : "";
    const perLeg =
      ex.id === "bulgarian-split-squat" && !mach ? " (هر پا جدا)" : "";
    lines.push(
      `${i + 1}. ${name} — ${mach ? faName + " — " : ""}${ex.sets} × ${repsEn(ex.reps)}${perLeg} — rest ${REST_SEC[ex.id]}s — RPE ${fa2en(ex.rpe).replace("پامپ", "9 (pump)")}${fst}`
    );
    const altNote = mode === "machine" ? ex.machineAlt?.note : ex.freeAlt?.note;
    lines.push(`  Notes: ${ex.tips[0] || faName}${altNote ? ` — ${altNote}` : ""}${warm}`);
    // نسخهٔ جایگزین — در هر حالت، جایگزین = نسخهٔ دیگر است
    // حالت دستگاهی: جایگزین = freeAlt (یا نام پایه وقتی پایه وزنهٔ آزاد است)
    // حالت آزاد: جایگزین = machineAlt (یا نام پایه وقتی پایه دستگاهی است)
    const alt =
      mode === "machine"
        ? ex.freeAlt?.hevyName ??
          ((ex.baseMode ?? "machine") === "free" ? ex.hevyName : null)
        : ex.machineAlt?.hevyName ??
          ((ex.baseMode ?? "machine") === "machine" ? ex.hevyName : null);
    // اگر جایگزین همان نام اصلی بود (حرکت تک‌نسخه‌ای مثل فیس پول)، خط اضافه نگذار
    if (alt && alt !== name) {
      const altLabel =
        mode === "machine" ? "نسخهٔ وزنهٔ آزاد (هفتهٔ ۳+)" : "نسخهٔ دستگاهی (هفتهٔ ۱–۲)";
      lines.push(`  ${altLabel}: ${alt}`);
    }
  });
  lines.push("");
  lines.push(`[${LISS_LINE}]`);
  lines.push(`[سرد کردن — روتین کششی سایت: ${cd.label}]`);
  return lines.join("\n");
}

// ---------- برگهٔ ساخت کامل برای یک اپ ----------
const MODE_LABEL: Record<"base" | "machine", string> = {
  base: "وزنهٔ آزاد — از هفتهٔ ۳",
  machine: "دستگاهی — هفتهٔ ۱ تا ۲ (شروع)",
};

function buildSheet(appName: string, accent: string, mode: "base" | "machine" = "base"): string {
  const parts: string[] = [];
  parts.push("=====================================================");
  parts.push(`FST-7 SWIMMER — ${appName} — برگهٔ ساخت کامل`);
  parts.push(`نسخه: ${MODE_LABEL[mode]}`);
  parts.push(`تولید: ${TODAY} | منبع: داشبورد شناگر FST-7`);
  parts.push("=====================================================");
  parts.push("");
  parts.push("هفته: شنبه Push | دوشنبه Pull | چهارشنبه پا+شکم | بقیه روزها استراحت/کششی/دوچرخه");
  parts.push(`پروفایل: ${PROFILE.age} ساله، ${faNum(PROFILE.height)} سانتی‌متر، هدف ${PROFILE.targetWeight} کیلو — ${PROFILE.goal}`);
  parts.push(`حجم دو نسخه یکسان است — فقط ابزار عوض می‌شود، نه ساختار. ${MACHINE_FIRST_NOTE.text}`);
  parts.push("");
  PROGRAM.forEach((d) => {
    parts.push(daySheet(d.id, appName, mode));
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
  // جدول دو نسخه — سوییچ دستگاه ↔ وزنهٔ آزاد برای هر اسلات
  p.push("## 🔀 دو نسخهٔ برنامه — دستگاه (هفتهٔ ۱–۲) ↔ وزنهٔ آزاد (هفتهٔ ۳+)");
  p.push("");
  p.push("| روز | حرکت (اسلات) | نسخهٔ دستگاهی | نسخهٔ وزنهٔ آزاد |");
  p.push("|---|---|---|---|");
  PROGRAM.forEach((day) => {
    day.exercises.forEach((ex) => {
      const baseIsFree = (ex.baseMode ?? "machine") === "free";
      const machName = baseIsFree ? ex.machineAlt?.faName ?? ex.faName : ex.faName;
      const freeName = baseIsFree ? ex.faName : ex.freeAlt?.faName ?? ex.faName;
      const same = machName === freeName ? " (هر دو نسخه یکسان)" : "";
      p.push(`| ${day.weekDay} | ${ex.faName} | ${machName}${same} | ${freeName} |`);
    });
  });
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

// ---------- فایل برنامهٔ openGym (ایمپورت خودکار — فرمت رسمی) ----------
// فرمت: frontend/src/lib/plan-share.js در github.com/DuarteSantos8/openGym (v1.4.x)
// { opengym_plan: 1, exported, name, unit, week, routines, customEx }
// id حرکات = کاتالوگ رسمی openGym (catalogue/exercises/<id>.json) — همه وریفای‌شده
// week keys = getDay(): شنبه=6، دوشنبه=1، چهارشنبه=3
// prog 'double' = پیشرفت دوگانه سایت (repsMin→repsMax، بعدش وزنه +inc)
// warmupSets = رمپ خودکار ۵۰٪/۷۵٪/۸۷.۵٪ (حداکثر ۵)
interface OgEx {
  id: string;
  sets: number;
  reps: number;
  repsMin?: number;
  restSec?: number;
  prog?: "double";
  inc?: number;
  warmupSets?: number;
  side?: boolean;
  note?: string;
}
interface OgRoutine {
  id: string;
  name: string;
  emoji: string;
  ex: OgEx[];
}

const FST7_FA =
  "★ FST-7: ۷ ست پیاپی با ۳۰–۴۵ ثانیه استراحت — وزنهٔ سبک ثابت، پامپ کامل، تا ناتوانی فنی در ست‌های آخر";
const LISS_FA = "بعد از ست آخر: LISS دوچرخه ۱۵–۲۰ دقیقه (ضربان ۱۱۵–۱۳۵) + کشش‌های سرد کردن";

const OG_DAY3_LISS = `${LISS_FA} (همسترینگ، چهارسر، فلکسور ران، ساق)`;

function ogEx(cfg: OgEx & { tips: string }): OgEx {
  const { tips, ...rest } = cfg;
  return { ...rest, note: tips }; // فرمت رسمی: فیلد نوت = note
}

const OG_PUSH: OgRoutine = {
  id: "r-push",
  name: "Push — شنبه",
  emoji: "🏋️",
  ex: [
    ogEx({
      id: "0025", // barbell bench press
      sets: 4,
      reps: 8,
      repsMin: 5,
      restSec: 180,
      prog: "double",
      inc: 2.5,
      warmupSets: 3,
      tips:
        "گرم‌کردن خودکار ۳ ست رمپ فعال است. RPE ۸ (۱–۳ تکرار در مخزن). جایگزین: پرس سینه دستگاه. " + LISS_FA + " (سینه/شانه)",
    }),
    ogEx({
      id: "0314", // dumbbell incline bench press
      sets: 3,
      reps: 12,
      repsMin: 8,
      restSec: 120,
      prog: "double",
      inc: 2,
      tips: "RPE ۸. تیغه‌ها جمع و پایین کامل کشش. جایگزین: پرس بالاسینه دستگاه",
    }),
    ogEx({
      id: "0405", // dumbbell seated shoulder press
      sets: 3,
      reps: 12,
      repsMin: 8,
      restSec: 120,
      prog: "double",
      inc: 2,
      tips: "RPE ۸. کمر به پشتی چسبیده، آرنج کمی جلوتر از تنه. جایگزین: پرس سرشانه دستگاه",
    }),
    ogEx({
      id: "8141", // cable standing crossover
      sets: 3,
      reps: 15,
      repsMin: 10,
      restSec: 90,
      prog: "double",
      inc: 2.5,
      tips: "RPE ۹. اسکوییز ۱ ثانیه در انتها، برگشت کنترل‌شده. جایگزین: قفسه سینه دمبل",
    }),
    ogEx({
      id: "0200", // cable pushdown (with rope attachment)
      sets: 3,
      reps: 15,
      repsMin: 10,
      restSec: 75,
      prog: "double",
      inc: 2.5,
      tips: "RPE ۹. آرنج چسبیده به بدن، فقط ساعد حرکت کند؛ انتها طناب کمی باز",
    }),
    ogEx({
      id: "0334", // dumbbell lateral raise
      sets: 7,
      reps: 15,
      repsMin: 10,
      restSec: 45,
      prog: "double",
      inc: 1,
      tips: FST7_FA + ". جایگزین: نشر جانب سیم‌کش. " + LISS_FA,
    }),
  ],
};

const OG_PULL: OgRoutine = {
  id: "r-pull",
  name: "Pull — دوشنبه",
  emoji: "🧲",
  ex: [
    ogEx({
      id: "0652", // pull-up (body weight)
      sets: 4,
      reps: 10,
      repsMin: 5,
      restSec: 180,
      prog: "double",
      inc: 2.5,
      tips:
        "گرم‌کردن: اسکاپولار پول + ۵ تکرار سبک با کش کمکی. وقتی ۳×۱۰ شد وزنهٔ آویز +۲.۵ کیلو. جایگزین: بارفیکس کمکی دستگاه",
    }),
    ogEx({
      id: "0027", // barbell bent over row
      sets: 3,
      reps: 10,
      repsMin: 6,
      restSec: 180,
      prog: "double",
      inc: 2.5,
      tips: "کمر صاف، هالتر چسبیده به پا، کشیدن به سمت شکم. جایگزین: زیربغل سیم‌کش نشسته",
    }),
    ogEx({
      id: "2291", // cable wide grip lat pulldown
      sets: 3,
      reps: 12,
      repsMin: 10,
      restSec: 120,
      prog: "double",
      inc: 2.5,
      tips: "سینه باز، بار را با آرنج به پایین بکش نه با دست؛ ۱ ثانیه نگه‌داشتن پایین",
    }),
    ogEx({
      id: "5656", // cable standing face pull (with rope)
      sets: 3,
      reps: 15,
      repsMin: 12,
      restSec: 90,
      prog: "double",
      inc: 2.5,
      tips: "طناب به سمت پیشانی، انگشتان به بیرون باز شود — سلامت شانه و پوست سر شانه",
    }),
    ogEx({
      id: "0447", // ez barbell curl
      sets: 3,
      reps: 12,
      repsMin: 8,
      restSec: 90,
      prog: "double",
      inc: 1.25,
      tips: "آرنج ثابت کنار بدن، برگشت کنترل‌شده ۲ ثانیه. جایگزین: جلوبازو سیم‌کش",
    }),
    ogEx({
      id: "0238", // cable straight arm pulldown
      sets: 7,
      reps: 15,
      repsMin: 10,
      restSec: 45,
      prog: "double",
      inc: 2.5,
      tips: FST7_FA + ". " + LISS_FA + " (کشش لت روی دیوار، آویزان‌شدن، گربه–گاو)",
    }),
  ],
};

const OG_LEGS: OgRoutine = {
  id: "r-legs",
  name: "Legs + Abs — چهارشنبه",
  emoji: "🦵",
  ex: [
    ogEx({
      id: "8375", // lever angled leg press
      sets: 4,
      reps: 12,
      repsMin: 8,
      restSec: 180,
      prog: "double",
      inc: 5,
      warmupSets: 3,
      tips:
        "گرم‌کردن خودکار ۳ ست رمپ فعال است. پاها عرض شانه؛ تا ۹۰ درجه پایین، زانو در بالا قفل نشود. جایگزین: اسکات گلابی دمبل",
    }),
    ogEx({
      id: "0085", // barbell romanian deadlift
      sets: 3,
      reps: 10,
      repsMin: 8,
      restSec: 180,
      prog: "double",
      inc: 2.5,
      tips:
        "هینج لگن — اسکات نیست؛ هالتر چسبیده به پا. هفتهٔ ۱–۲: بک اکستنشن دستگاه، بعد RDL دمبل سبک",
    }),
    ogEx({
      id: "2290", // dumbbell bulgarian split squat
      sets: 3,
      reps: 12,
      repsMin: 8,
      restSec: 90,
      prog: "double",
      inc: 2,
      side: true,
      tips: "هر پا جدا ثبت می‌شود. پنجهٔ پای عقب روی نیمکت، تنه کمی مایل به جلو. جایگزین: پرس پا تک‌پا",
    }),
    ogEx({
      id: "0586", // lever lying leg curl
      sets: 3,
      reps: 15,
      repsMin: 10,
      restSec: 75,
      prog: "double",
      inc: 2.5,
      tips: "لگن تمام مدت چسبیده به دستگاه، پنجه به سمت ساق؛ برگشت ۲–۳ ثانیه",
    }),
    ogEx({
      id: "0605", // lever standing calf raise
      sets: 4,
      reps: 15,
      repsMin: 10,
      restSec: 60,
      prog: "double",
      inc: 2.5,
      tips: "دامنهٔ کامل: پایین کشش ۲ ثانیه، بالا اسکوییز ۱ ثانیه؛ زانو صاف و ثابت",
    }),
    ogEx({
      id: "0472", // hanging leg raise
      sets: 3,
      reps: 15,
      restSec: 90,
      tips:
        "کلید حرکت چرخش لگن به عقب (pelvic tilt) — نه فقط بالا بردن پا. ساده‌تر: زانوها خم. جایگزین: صندلی کاپیتان",
    }),
    ogEx({
      id: "0175", // cable kneeling crunch
      sets: 7,
      reps: 15,
      repsMin: 12,
      restSec: 45,
      prog: "double",
      inc: 2.5,
      tips: FST7_FA + ". دسته کنار گردن، ستون فقرات جمع شود — نه خم از لگن. " + OG_DAY3_LISS,
    }),
  ],
};

const OPENGYM_PLAN = {
  opengym_plan: 1,
  exported: TODAY,
  name: "FST-7 Swimmer — PPL",
  unit: "kg",
  week: { "6": ["r-push"], "1": ["r-pull"], "3": ["r-legs"] },
  routines: [OG_PUSH, OG_PULL, OG_LEGS],
};

// ---------- نسخهٔ دستگاهی openGym (هفتهٔ ۱–۲) ----------
// idها از کاتالوگ رسمی: 0576 lever chest press | 1299 lever incline chest press |
// 0603 lever shoulder press | 0178 cable lateral raise | 0017 assisted pull-up |
// 0861 cable seated row | 0868 cable curl | 0573 lever back extension |
// 9387 lever angled single leg press | 5107 captains chair leg raise
const W3_LINE = "از هفتهٔ ۳ نسخهٔ وزنهٔ آزاد را وارد کن (برنامهٔ دستگاهی و آزاد در سایت)";

const OG_PUSH_M: OgRoutine = {
  id: "r-push-m",
  name: "Push Machines — شنبه",
  emoji: "🏋️",
  ex: [
    ogEx({
      id: "0576", // lever chest press
      sets: 4,
      reps: 8,
      repsMin: 5,
      restSec: 180,
      prog: "double",
      inc: 2.5,
      warmupSets: 3,
      tips:
        "گرم‌کردن خودکار ۳ ست رمپ فعال است. RPE ۸ (۱–۳ تکرار در مخزن). مسیر ثابت — تمرکز کامل روی سینه. " +
        W3_LINE +
        ". " +
        LISS_FA +
        " (سینه/شانه)",
    }),
    ogEx({
      id: "1299", // lever incline chest press
      sets: 3,
      reps: 12,
      repsMin: 8,
      restSec: 120,
      prog: "double",
      inc: 2,
      tips: "RPE ۸. زاویهٔ نیمکت ۳۰ درجه، آرنج زیر مچ. " + W3_LINE,
    }),
    ogEx({
      id: "0603", // lever shoulder press
      sets: 3,
      reps: 12,
      repsMin: 8,
      restSec: 120,
      prog: "double",
      inc: 2,
      tips: "RPE ۸. پشتی دستگاه قوس کمر را کنترل می‌کند — تمرکز روی دلتوئید. " + W3_LINE,
    }),
    ogEx({
      id: "8141", // cable standing crossover
      sets: 3,
      reps: 15,
      repsMin: 10,
      restSec: 90,
      prog: "double",
      inc: 2.5,
      tips: "RPE ۹. اسکوییز ۱ ثانیه در انتها، برگشت کنترل‌شده. جایگزین: قفسه سینه دمبل",
    }),
    ogEx({
      id: "0200", // cable pushdown (with rope attachment)
      sets: 3,
      reps: 15,
      repsMin: 10,
      restSec: 75,
      prog: "double",
      inc: 2.5,
      tips: "RPE ۹. آرنج چسبیده به بدن، فقط ساعد حرکت کند؛ انتها طناب کمی باز",
    }),
    ogEx({
      id: "0178", // cable lateral raise — FST-7
      sets: 7,
      reps: 15,
      repsMin: 10,
      restSec: 45,
      prog: "double",
      inc: 1,
      tips: FST7_FA + ". تغییر وزنه با یک پیچ — خود رامبد هم برای FST-7 کابل می‌زند. " + LISS_FA,
    }),
  ],
};

const OG_PULL_M: OgRoutine = {
  id: "r-pull-m",
  name: "Pull Machines — دوشنبه",
  emoji: "🧲",
  ex: [
    ogEx({
      id: "0017", // assisted pull-up
      sets: 4,
      reps: 10,
      repsMin: 5,
      restSec: 180,
      tips:
        "گرم‌کردن: اسکاپولار پول + ۵ تکرار سبک با کش. پیشرفت دستی: هر هفته وزنهٔ کمک را کم کن (کمتر = سخت‌تر). چانه بالای میله",
    }),
    ogEx({
      id: "0861", // cable seated row ⭐
      sets: 3,
      reps: 10,
      repsMin: 6,
      restSec: 180,
      prog: "double",
      inc: 2.5,
      tips:
        "⭐ حرکت اصلی روز Pull — ستون فقرات اتکا دارد و فشار می‌ماند روی پشت. سینه بالا، دستهٔ V تا بالای سینه، تیغه‌ها جمع در انتها. " +
        W3_LINE,
    }),
    ogEx({
      id: "2291", // cable wide grip lat pulldown
      sets: 3,
      reps: 12,
      repsMin: 10,
      restSec: 120,
      prog: "double",
      inc: 2.5,
      tips: "سینه باز، بار را با آرنج به پایین بکش نه با دست؛ ۱ ثانیه نگه‌داشتن پایین",
    }),
    ogEx({
      id: "5656", // cable standing face pull (with rope)
      sets: 3,
      reps: 15,
      repsMin: 12,
      restSec: 90,
      prog: "double",
      inc: 2.5,
      tips: "طناب به سمت پیشانی، انگشتان به بیرون باز شود — سلامت شانه و پوست سر شانه",
    }),
    ogEx({
      id: "0868", // cable curl
      sets: 3,
      reps: 12,
      repsMin: 8,
      restSec: 90,
      prog: "double",
      inc: 1.25,
      tips: "آرنج ثابت کنار بدن؛ سوئینگ کمر عملاً غیرممکن — فرم تمیز از روز اول. " + W3_LINE,
    }),
    ogEx({
      id: "0238", // cable straight arm pulldown — FST-7
      sets: 7,
      reps: 15,
      repsMin: 10,
      restSec: 45,
      prog: "double",
      inc: 2.5,
      tips: FST7_FA + ". " + LISS_FA + " (کشش لت روی دیوار، آویزان‌شدن، گربه–گاو)",
    }),
  ],
};

const OG_LEGS_M: OgRoutine = {
  id: "r-legs-m",
  name: "Legs + Abs Machines — چهارشنبه",
  emoji: "🦵",
  ex: [
    ogEx({
      id: "8375", // lever angled leg press
      sets: 4,
      reps: 12,
      repsMin: 8,
      restSec: 180,
      prog: "double",
      inc: 5,
      warmupSets: 3,
      tips:
        "گرم‌کردن خودکار ۳ ست رمپ فعال است. پاها عرض شانه؛ تا ۹۰ درجه پایین، زانو در بالا قفل نشود. جایگزین: اسکات گلابی دمبل",
    }),
    ogEx({
      id: "0573", // lever back extension
      sets: 3,
      reps: 10,
      repsMin: 8,
      restSec: 180,
      prog: "double",
      inc: 2.5,
      tips:
        "همان زنجیرهٔ پشتی RDL با محافظت کامل کمر — لولا از ران، کمر صاف. " + W3_LINE,
    }),
    ogEx({
      id: "9387", // lever angled single leg press
      sets: 3,
      reps: 12,
      repsMin: 8,
      restSec: 90,
      prog: "double",
      inc: 2,
      side: true,
      tips:
        "هر پا جدا ثبت می‌شود — همان کار اسکات بلغاری بدون دغدغهٔ تعادل. " + W3_LINE,
    }),
    ogEx({
      id: "0586", // lever lying leg curl
      sets: 3,
      reps: 15,
      repsMin: 10,
      restSec: 75,
      prog: "double",
      inc: 2.5,
      tips: "لگن تمام مدت چسبیده به دستگاه، پنجه به سمت ساق؛ برگشت ۲–۳ ثانیه",
    }),
    ogEx({
      id: "0605", // lever standing calf raise
      sets: 4,
      reps: 15,
      repsMin: 10,
      restSec: 60,
      prog: "double",
      inc: 2.5,
      tips: "دامنهٔ کامل: پایین کشش ۲ ثانیه، بالا اسکوییز ۱ ثانیه؛ زانو صاف و ثابت",
    }),
    ogEx({
      id: "5107", // captains chair leg raise
      sets: 3,
      reps: 15,
      restSec: 90,
      tips:
        "کلید حرکت چرخش لگن به عقب (pelvic tilt) — پشتی از کمر حمایت می‌کند و تاب حذف می‌شود. ساده‌تر: زانوها خم",
    }),
    ogEx({
      id: "0175", // cable kneeling crunch — FST-7
      sets: 7,
      reps: 15,
      repsMin: 12,
      restSec: 45,
      prog: "double",
      inc: 2.5,
      tips: FST7_FA + ". دسته کنار گردن، ستون فقرات جمع شود — نه خم از لگن. " + OG_DAY3_LISS,
    }),
  ],
};

const OPENGYM_PLAN_MACHINE = {
  opengym_plan: 1,
  exported: TODAY,
  name: "FST-7 Swimmer — PPL (Machines, W1-2)",
  unit: "kg",
  week: { "6": ["r-push-m"], "1": ["r-pull-m"], "3": ["r-legs-m"] },
  routines: [OG_PUSH_M, OG_PULL_M, OG_LEGS_M],
};

// ---------- برگهٔ ساخت openGym (راهنمای ایمپورت + جدول احتیاطی) ----------
function openGymSheet(variant: "machine" | "free" = "free"): string {
  const mach = variant === "machine";
  const fileName = mach ? "opengym-plan-machine.json" : "opengym-plan.json";
  const routineNames = mach
    ? "Push Machines / Pull Machines / Legs + Abs Machines"
    : "Push/Pull/Legs";
  const p: string[] = [];
  p.push("=====================================================");
  p.push(`FST-7 SWIMMER — OPENGYM (opengym.ch) — ایمپورت خودکار`);
  p.push(`نسخه: ${MODE_LABEL[mach ? "machine" : "base"]}`);
  p.push(`تولید: ${TODAY} | فرمت رسمی: opengym_plan 1 (plan-share.js)`);
  p.push("=====================================================");
  p.push("");
  p.push("مهم‌ترین نکته: openGym برنامه را به‌صورت فایل JSON می‌فهمد — برخلاف Hevy/Lyfta/Fitbod.");
  p.push(`فایل ${fileName} (همین پوشهٔ exports) را ایمپورت کن، نه دستی بساز:`);
  p.push("");
  p.push("مراحل ایمپورت (زیر ۱ دقیقه):");
  p.push(`  1. فایل ${fileName} را دانلود کن (کارت openGym در سایت → سوییچ نسخه → دکمهٔ دانلود)`);
  p.push("  2. اپ openGym → تب Plan → منوی سه‌نقطه → «Import a plan file»");
  p.push(`  3. فایل را انتخاب کن — ۳ روال جدید (${routineNames}) به روال‌هایت اضافه می‌شود؛ چیزی خراب نمی‌شود (merge)`);
  p.push("  4. در همان صفحه سوییچ «Use this weekly schedule» را روشن کن:");
  p.push("     شنبه Push | دوشنبه Pull | چهارشنبه پا+شکم — بقیه روزها استراحت");
  p.push("  5. Import را بزن. در هر حرکت وزنهٔ شروع را اولین جلسه بزن — پیشرفت دوگانه (double)");
  p.push("     از همان لحظه فعال است: به سقف تکرار که رسیدی، وزنه به‌اندازهٔ inc خودش بالا می‌رود");
  p.push("");
  p.push("داخل فایل چه هست:");
  p.push("  • ۱۹ حرکت با id کاتالوگ رسمی (نام، انیمیشن و عضله درست)");
  p.push("  • استراحت‌ها به ثانیه (FST-7 = ۴۵ ثانیه، پایه = ۱۸۰/۱۲۰/۹۰/۷۵/۶۰)");
  p.push("  • بازهٔ تکرار هر حرکت (۵–۸، ۸–۱۲، ۱۰–۱۵، ۱۲–۱۵) با قاعدهٔ پیشرفت دوگانه");
  p.push("  • گرم‌کردن خودکار ۳ ست رمپ روی حرکت اول Push و پرس پا (۵۰٪/۷۵٪/۸۷.۵٪)");
  p.push(mach
    ? "  • بارفیکس کمکی بدون پیشرفت خودکار — هر هفته وزنهٔ کمک را کم کن"
    : "  • اسکات بلغاری per-side (هر پا جدا ثبت می‌شود)");
  p.push("  • نوت فارسی هر حرکت: RPE، سوییچ نسخهٔ بعدی، FST-7، یادآور LISS و کشش");
  p.push("");
  p.push("محدودیت‌ها (صادقانه):");
  p.push("  • رابط کاربری openGym فارسی ندارد (۱۹ زبان دارد؛ عربی RTL هست، فارسی نه) — نام‌های حرکت انگلیسی‌اند؛ نوت‌ها فارسی‌اند");
  p.push("  • LISS دوچرخه و کشش‌ها داخل فایل نیستند (حرکت قابل‌ردیابی نیستند) — در نوت حرکت آخر هر روز آمده‌اند؛ روتین کامل در برگهٔ جامع سایت");
  p.push("  • نسخهٔ وب: opengym.ch/demo بدون نصب باز می‌شود — همان ایمپورت آنجا هم کار می‌کند");
  p.push("");
  p.push("هر دو نسخه (دستگاهی و آزاد) را می‌توانی کنار هم ایمپورت کنی — نام روال‌ها فرق دارند و merge خراب نمی‌شود.");
  p.push("");
  p.push("لینک‌ها: سایت opengym.ch | کد github.com/DuarteSantos8/openGym (AGPL-3.0) | Android APK + iOS App Store + self-host Docker");
  return p.join("\n");
}

// ---------- برگهٔ ساخت GymMane (رابط فارسی کامل) ----------
function gymmaneSheet(mode: "base" | "machine" = "base"): string {
  const mach = mode === "machine";
  const parts: string[] = [];
  parts.push("=====================================================");
  parts.push("FST-7 SWIMMER — GYMMANE (رابط فارسی) — برگهٔ ساخت کامل");
  parts.push(`نسخه: ${MODE_LABEL[mode]}`);
  parts.push(`تولید: ${TODAY} | منبع: داشبورد شناگر FST-7`);
  parts.push("=====================================================");
  parts.push("");
  parts.push("GymMane چیست: لاگر آفلاین اندروید (GPLv3، F-Droid) — بدون حساب/تبلیغات/اینترنت.");
  parts.push("⭐ از ۱۷ زبان، فارسی کامل دارد: Settings → زبان → فارسی");
  parts.push("ایمپورت برنامهٔ آماده ندارد (فقط تاریخچهٔ ورزش از openGym/Hevy/Strong/Lyfta/FitNotes)");
  parts.push("پس روال‌ها را دستی می‌سازیم — با این برگه هر روال ~۲ دقیقه:");
  parts.push("");
  parts.push("راه‌اندازی:");
  parts.push("  1. نصب از F-Droid: f-droid.org/packages/com.gymmane.app (APK: arm64-v8a)");
  parts.push("  2. فارسی‌سازی: Settings → Language → فارسی");
  parts.push("  3. واحد: کیلوگرم؛ هفته از شنبه شروع شود (تنظیمات تقویم)");
  parts.push("");
  parts.push("ساخت ۳ روال: تب Routines → + → نام و ایموجی:");
  parts.push(mach
    ? "  «Push دستگاهی — شنبه» 🏋️ | «Pull دستگاهی — دوشنبه» 🧲 | «پا+شکم دستگاهی — چهارشنبه» 🦵"
    : "  «Push — شنبه» 🏋️ | «Pull — دوشنبه» 🧲 | «Legs + Abs — چهارشنبه» 🦵");
  parts.push("");
  PROGRAM.forEach((d) => {
    parts.push(daySheet(d.id, "GYMMANE", mode));
    parts.push("");
  });
  parts.push("--- تنظیم Progression هر حرکت (بعد از اولین جلسهٔ لاگ‌شده) ---");
  parts.push("هر حرکت را باز کن → Progression: بازهٔ تکرار برگه + پلهٔ وزن:");
  if (mach) {
    parts.push("  پرس سینه دستگاه ۵–۸ (+۲.۵) | پرس بالاسینه/سرشانهٔ دستگاه ۸–۱۲ (+۲) | کراس اور/پوش‌داون ۱۰–۱۵ (+۲.۵)");
    parts.push("  نشر جانب سیم‌کش ۱۰–۱۵ (+۱) | بارفیکس کمکی ۵–۱۰ (پیشرفت دستی: کم کردن وزنهٔ کمک) | زیربغل سیم‌کش نشسته ۶–۱۰ (+۲.۵)");
    parts.push("  پول‌داون ۱۰–۱۲ (+۲.۵) | فیس پول ۱۲–۱۵ (+۲.۵) | جلوبازو سیم‌کش ۸–۱۲ (+۱.۲۵) | پرس پا ۸–۱۲ (+۵)");
    parts.push("  بک اکستنشن ۸–۱۰ (+۲.۵) | پرس پا تک‌پا ۸–۱۲ هر پا (+۲) | پشت‌پا ۱۰–۱۵ (+۲.۵) | ساق ۱۰–۱۵ (+۲.۵) | صندلی کاپیتان ۸–۱۵ | شکم سیم‌کش ۱۲–۱۵ (+۲.۵)");
  } else {
    parts.push("  پرس سینه ۵–۸ (+۲.۵) | پرس بالاسینه/سرشانه ۸–۱۲ (+۲) | کراس اور/پوش‌داون ۱۰–۱۵ (+۲.۵)");
    parts.push("  بارفیکس ۵–۱۰ (+۲.۵ وزنهٔ آویز) | زیربغل ۶–۱۰ (+۲.۵) | پول‌داون ۱۰–۱۲ (+۲.۵)");
    parts.push("  فیس پول ۱۲–۱۵ (+۲.۵) | جلوبازو ۸–۱۲ (+۱.۲۵) | پرس پا ۸–۱۲ (+۵) | RDL ۸–۱۰ (+۲.۵)");
    parts.push("  بلغاری ۸–۱۲ هر پا (+۲) | پشت‌پا ۱۰–۱۵ (+۲.۵) | ساق ۱۰–۱۵ (+۲.۵) | شکم سیم‌کش ۱۲–۱۵ (+۲.۵)");
  }
  parts.push("");
  parts.push("--- نکات خاص GymMane ---");
  parts.push("• ست‌های FST-7 را Superset نزن — ۷ ست عادی با Rest Timer ۴۵ ثانیه");
  parts.push("• Body Map: عضلهٔ درد گرفته فردا را روی نقشه ببین — هفتهٔ بعد حجم را همان‌جا تنظیم کن");
  parts.push("• گرم‌کردن: روی ست‌های سبک تیک Warm-up بزن (از حجم هفتگی حساب نمی‌شوند)");
  parts.push("• اگر بعداً openGym یا Hevy را امتحان کردی، تاریخچه از آن‌ها به GymMane import می‌شود — لاگ‌ها هدر نمی‌روند");
  parts.push("");
  parts.push("--- برنامهٔ دوچرخه ثابت (خانه) ---");
  BIKE_PLAN.forEach((b) => {
    parts.push(`• ${b.title} — ${b.when} — ${b.dose}`);
  });
  parts.push("");
  parts.push("--- قواعد پیشرفت / FST-7 / تغذیه / پزشکی ---");
  PROGRESSION_RULES.forEach((r) => parts.push(`• ${r.title}: ${r.text}`));
  parts.push(`• ${FST7_NOTES.description}`);
  MEDICAL_NOTES.forEach((m) => parts.push(`• ${m.title}: ${m.text}`));
  return parts.join("\n");
}

// ---------- پرامپت ChatGPT + Hevy — ساخت خودکار ۳ روال با پلاگین ----------
// نام‌ها با همان منطق برگه‌های build-hevy حل می‌شوند (۳۳ اسم قبلاً با دو منبع واقعی کتابخانهٔ Hevy وریفای شده)
function exName(ex: Exercise, mode: "base" | "machine"): string {
  return mode === "machine"
    ? ex.machineAlt?.hevyName ?? ex.hevyName
    : ex.freeAlt?.hevyName ?? ex.hevyName;
}

const PROMPT_ROUTINE: Record<string, { name: string }> = {
  day1: { name: "FST-7 Push (Sat)" },
  day2: { name: "FST-7 Pull (Mon)" },
  day3: { name: "FST-7 Legs + Abs (Wed)" },
};

function hevyPromptSheet(mode: "base" | "machine"): string {
  const L: string[] = [];
  L.push("You are connected to my Hevy account via the Hevy tool/plugin.");
  L.push(
    "Use it to CREATE the 3 workout routines below in my Hevy account - exactly as specified."
  );
  L.push("");
  L.push("ABOUT ME");
  L.push(
    "- Male, 25 y/o, 180 cm. Goal: body recomposition (fat loss + muscle) - swimmer's V-taper."
  );
  L.push(
    "- Split: Push / Pull / Legs+Abs - 3 sessions per week (Sat = Push, Mon = Pull, Wed = Legs+Abs)."
  );
  L.push(
    mode === "machine"
      ? "- Equipment version: MACHINE (weeks 1-2) - machine-first on purpose: fixed path, safe without a spotter while learning the patterns. The free-weight version starts week 3."
      : "- Equipment version: FREE WEIGHTS (weeks 3+) - same volume and structure as the machine version; only the tools change."
  );
  L.push("");
  PROGRAM.forEach((day) => {
    L.push(`ROUTINE - name: "${PROMPT_ROUTINE[day.id].name}"`);
    day.exercises.forEach((ex, i) => {
      const perLeg = ex.reps.includes("هر پا");
      const repsTxt =
        repsEn(ex.reps).replace(/\s*هر پا/g, "") + (perLeg ? " each leg" : "");
      const note = [
        ex.tips[0] || ex.faName,
        mode === "machine" ? ex.machineAlt?.note : ex.freeAlt?.note,
      ]
        .filter(Boolean)
        .join(" - ");
      L.push(
        `${i + 1}. ${exName(ex, mode)} - ${ex.sets} sets x ${repsTxt} - rest ${REST_SEC[ex.id]}s - RPE ${fa2en(ex.rpe).replace("پامپ", "9 (pump)")}${ex.fst7 ? " - FST-7 FINISHER" : ""} - note: ${JSON.stringify(note)}`
      );
    });
    L.push("");
  });
  L.push(
    "SESSION NOTES (put each text into the notes field of its routine, unchanged - it is in Persian):"
  );
  PROGRAM.forEach((day) => {
    L.push(
      `- ${PROMPT_ROUTINE[day.id].name}: [${WARMUP_LINE}] + [${LISS_LINE}] + [سرد کردن — روتین کششی سایت: ${COOLDOWN[day.id].label}]`
    );
  });
  L.push("");
  L.push("HARD RULES");
  L.push(
    "1. Exercise names above are verified against Hevy's own exercise library. Search each EXACT name and pick exactly that exercise. If a name is not found, STOP and tell me - never silently substitute a similar exercise."
  );
  L.push(
    "2. Set the rest timer of every set exactly as written (seconds). Put rep ranges in the rep-range fields (start / end)."
  );
  L.push(
    "3. Copy each exercise's note text into its notes field unchanged (Persian - keep as-is). Hevy has no RPE field - so APPEND this exercise's RPE target to the END of its note in the form \" | RPE هدف: N\" (N is the RPE written on the exercise line)."
  );
  L.push(
    '4. Exercises marked "FST-7 FINISHER": exactly 7 sets, ~45s rest, constant light weight, last sets to technical failure. Do NOT mark them as a superset.'
  );
  L.push(
    "5. Add 3 warm-up sets (type = warmup) before the FIRST exercise of each routine. Push/Legs: 8 reps at ~40%, 4 reps at ~60%, 2 reps at ~75% of the first working set. Pull: scapular pulls + 5 light band-assisted reps."
  );
  L.push(
    "6. Leave all working weights EMPTY - I will log my first session to find my starting weights."
  );
  L.push(
    `7. Create exactly 3 routines with the exact names above (${Object.values(PROMPT_ROUTINE)
      .map((r) => `"${r.name}"`)
      .join(", ")}).`
  );
  L.push(
    "8. When done, list every routine with its exercises (sets x reps, rest) so I can verify. If the Hevy tool is unavailable, do NOT pretend it worked - output the 3 routines as plain text instead."
  );
  L.push("");
  L.push(
    "PROGRESSION (my own rule - Hevy has no auto-progression; reference only):"
  );
  L.push(
    "- Double progression: when I hit the top of the rep range on all sets with good form (RPE 8), next session I add ~2.5 kg (upper body) / ~5 kg (lower body) and drop back to the bottom of the range."
  );
  return L.join("\n");
}

// ---------- ساخت فایل‌ها ----------
const outDir = path.join(ROOT, "public", "exports");
fs.mkdirSync(outDir, { recursive: true });

const weekly = weeklySheet();
fs.writeFileSync(path.join(outDir, "weekly-routine-full.md"), weekly, "utf8");

// نسخهٔ وزنهٔ آزاد (پایه) — نام فایل‌های قبلی حفظ شد
const hevySheet = buildSheet("HEVY", "hevy", "base");
fs.writeFileSync(path.join(outDir, "build-hevy.txt"), hevySheet, "utf8");

const lyftaSheet = buildSheet("LYFTA", "lyfta", "base");
fs.writeFileSync(path.join(outDir, "build-lyfta.txt"), lyftaSheet, "utf8");

const genericSheet = buildSheet("GENERIC APP", "generic", "base");
fs.writeFileSync(path.join(outDir, "build-generic.txt"), genericSheet, "utf8");

// نسخهٔ دستگاهی — هفتهٔ ۱ تا ۲ (همان ساختار، حرکات دستگاهی)
const hevyMachine = buildSheet("HEVY", "hevy", "machine");
fs.writeFileSync(path.join(outDir, "build-hevy-machine.txt"), hevyMachine, "utf8");

const lyftaMachine = buildSheet("LYFTA", "lyfta", "machine");
fs.writeFileSync(path.join(outDir, "build-lyfta-machine.txt"), lyftaMachine, "utf8");

const genericMachine = buildSheet("GENERIC APP", "generic", "machine");
fs.writeFileSync(path.join(outDir, "build-generic-machine.txt"), genericMachine, "utf8");

const openGymSheetText = openGymSheet("free");
fs.writeFileSync(path.join(outDir, "build-opengym.txt"), openGymSheetText, "utf8");
fs.writeFileSync(
  path.join(outDir, "opengym-plan.json"),
  JSON.stringify(OPENGYM_PLAN, null, 2),
  "utf8"
);

const openGymMachineSheetText = openGymSheet("machine");
fs.writeFileSync(
  path.join(outDir, "build-opengym-machine.txt"),
  openGymMachineSheetText,
  "utf8"
);
fs.writeFileSync(
  path.join(outDir, "opengym-plan-machine.json"),
  JSON.stringify(OPENGYM_PLAN_MACHINE, null, 2),
  "utf8"
);

const gymmaneSheetText = gymmaneSheet("base");
fs.writeFileSync(path.join(outDir, "build-gymmane.txt"), gymmaneSheetText, "utf8");

const gymmaneMachineText = gymmaneSheet("machine");

// پرامپت‌های ChatGPT + Hevy — دو نسخه (دستگاهی / آزاد)
const chatGptPromptMachine = hevyPromptSheet("machine");
fs.writeFileSync(
  path.join(outDir, "chatgpt-hevy-prompt-machine.txt"),
  chatGptPromptMachine,
  "utf8"
);
const chatGptPromptFree = hevyPromptSheet("base");
fs.writeFileSync(
  path.join(outDir, "chatgpt-hevy-prompt-free.txt"),
  chatGptPromptFree,
  "utf8"
);

// ---------- دو نسخهٔ هر کارت (سوییچ دستگاهی/آزاد) ----------
const VARIANT_LABELS = {
  machine: "دستگاهی — هفتهٔ ۱ تا ۲",
  free: "وزنهٔ آزاد — از هفتهٔ ۳",
};

const hevyVariants = [
  { id: "machine" as const, label: VARIANT_LABELS.machine, file: "/exports/build-hevy-machine.txt", copyText: hevyMachine },
  { id: "free" as const, label: VARIANT_LABELS.free, file: "/exports/build-hevy.txt", copyText: hevySheet },
];
const lyftaVariants = [
  { id: "machine" as const, label: VARIANT_LABELS.machine, file: "/exports/build-lyfta-machine.txt", copyText: lyftaMachine },
  { id: "free" as const, label: VARIANT_LABELS.free, file: "/exports/build-lyfta.txt", copyText: lyftaSheet },
];
const genericVariants = [
  { id: "machine" as const, label: VARIANT_LABELS.machine, file: "/exports/build-generic-machine.txt", copyText: genericMachine },
  { id: "free" as const, label: VARIANT_LABELS.free, file: "/exports/build-generic.txt", copyText: genericSheet },
];
const openGymVariants = [
  { id: "machine" as const, label: VARIANT_LABELS.machine, file: "/exports/opengym-plan-machine.json", copyText: openGymMachineSheetText },
  { id: "free" as const, label: VARIANT_LABELS.free, file: "/exports/opengym-plan.json", copyText: openGymSheetText },
];
const gymmaneVariants = [
  { id: "machine" as const, label: VARIANT_LABELS.machine, file: "/exports/build-gymmane-machine.txt", copyText: gymmaneMachineText },
  { id: "free" as const, label: VARIANT_LABELS.free, file: "/exports/build-gymmane.txt", copyText: gymmaneSheetText },
];
fs.writeFileSync(
  path.join(outDir, "build-gymmane-machine.txt"),
  gymmaneMachineText,
  "utf8"
);

// ---------- تولید ماژول TS برای UI ----------
const mod = `// ============================================================
// خروجی برنامه برای اپ‌های دیگر — تولید خودکار توسط research/gen_app_exports.ts
// دستی ویرایش نکن! منبع: src/lib/program.ts + src/lib/mobility.ts
// اعتبار: ${TODAY} — openGym: فرمت رسمی plan-share.js v1.4
// ============================================================

export interface AppExportVariant {
  id: "machine" | "free";
  label: string;
  file: string;
  copyText: string;
}

export interface AppExportCard {
  id: string;
  name: string;
  faName: string;
  website: string;
  badge: "auto" | "manual" | "unknown";
  badgeText: string;
  summary: string;
  steps: string[];
  notes: string[];
  file: string;
  copyText: string;
  // دو نسخه: دستگاهی (هفتهٔ ۱–۲) و وزنهٔ آزاد (هفتهٔ ۳+) — پیش‌فرض: دستگاهی
  variants: AppExportVariant[];
}

export const WEEKLY_SHEET = {
  file: "/exports/weekly-routine-full.md",
  copyText: ${JSON.stringify(weekly)},
};

// پرامپت ChatGPT + Hevy — دو نسخه: دستگاهی (هفتهٔ ۱–۲) و وزنهٔ آزاد (هفتهٔ ۳+)
export interface HevyPromptVariant {
  id: "machine" | "free";
  label: string;
  file: string;
  copyText: string;
}

export const HEVY_CHATGPT_PROMPT: {
  file: string;
  copyText: string;
  variants: HevyPromptVariant[];
} = ${JSON.stringify(
    {
      file: "/exports/chatgpt-hevy-prompt-machine.txt",
      copyText: chatGptPromptMachine,
      variants: [
        {
          id: "machine",
          label: VARIANT_LABELS.machine,
          file: "/exports/chatgpt-hevy-prompt-machine.txt",
          copyText: chatGptPromptMachine,
        },
        {
          id: "free",
          label: VARIANT_LABELS.free,
          file: "/exports/chatgpt-hevy-prompt-free.txt",
          copyText: chatGptPromptFree,
        },
      ],
    },
    null,
    2,
  )};

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
          "Hevy ایمپورتِ روال ندارد (فقط تاریخچهٔ ورزش CSV) — ولی نام حرکات برنامه دقیقاً با کتابخانه‌اش تطبیق داده شده؛ برگه را باز کن و هر روال را در ۲ دقیقه بساز. سوییچ بالای کارت: نسخهٔ دستگاهی (هفتهٔ ۱–۲) یا وزنهٔ آزاد (هفتهٔ ۳+).",
        steps: [
          "اپ Hevy → تب Workout → New Routine (۳ روال بساز: Push / Pull / پا+شکم)",
          "حرکت را با نام انگلیسی برگه سرچ کن — همان را انتخاب کن (نام‌ها دقیق‌اند)",
          "ست‌ها، تکرار، Rest (ثانیه) و RPE را از برگه بزن؛ نوت هر حرکت را کپی کن",
          "گرم‌کردن هر حرکت اول را با تیک Warmup روی ست‌های سبک علامت بزن",
        ],
        notes: [
          "میان‌بر خودکار: پرامپت آمادهٔ ChatGPT بالای همین صفحه — با پلاگین Hevy هر ۳ روال را خودش می‌سازد",
          "فولدر بساز به نام FST-7 و هر ۳ روال را داخلش بگذار",
          "ست‌های FST-7 را Superset نزن — فقط استراحت ۴۵ ثانیه",
        ],
        file: "/exports/build-hevy-machine.txt",
        copyText: hevyMachine,
        variants: hevyVariants,
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
          "۲۰ حرکت را با نام‌های انگلیسی برگه پیدا کن (کتابخانه‌اش بزرگ و کامل است)",
          "دوز و استراحت و نوت‌ها را از برگه وارد کن؛ برای هر روز یک روال",
        ],
        notes: [
          "اگر از Hevy لاگ داشتی، History Import آن جدا انجام می‌شود",
          "Rest Timer هر حرکت را روی ثانیه‌های برگه تنظیم کن — مخصوصاً FST-7 (۴۵ ثانیه)",
        ],
        file: "/exports/build-lyfta-machine.txt",
        copyText: lyftaMachine,
        variants: lyftaVariants,
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
        file: "/exports/build-generic-machine.txt",
        copyText: genericMachine,
        variants: genericVariants,
      },
      {
        id: "opengym",
        name: "openGym",
        faName: "لاگر متن‌باز سوئیسی — فایل برنامهٔ ما را مستقیم می‌خواند ⭐",
        website: "https://opengym.ch",
        badge: "auto",
        badgeText: "ایمپورت خودکار JSON — زیر ۱ دقیقه",
        summary:
          "تنها اپ بعد از Liftosaur که برنامهٔ ما را فایل می‌فهمد: فایل JSON نسخهٔ انتخابی (سوییچ بالای کارت) را دانلود کن و در Plan → Import a plan file بده — ۳ روال + تقویم هفته + استراحت‌ها + پیشرفت دوگانه یک‌جا می‌نشیند. هر دو نسخه را کنار هم می‌شود ایمپورت کرد. AGPL، بدون تبلیغ و اشتراک؛ Android/iOS/self-host.",
        steps: [
          "نسخه را از سوییچ بالای کارت انتخاب کن (دستگاهی هفتهٔ ۱–۲ / آزاد هفتهٔ ۳+) و فایل JSON را از دکمهٔ دانلود بگیر",
          "اپ → تب Plan → منوی سه‌نقطه → Import a plan file → فایل را بده",
          "۳ روال Push/Pull/Legs اضافه می‌شود (merge — چیزی خراب نمی‌شود)",
          "سوییچ «Use this weekly schedule» را روشن کن: شنبه Push، دوشنبه Pull، چهارشنبه پا+شکم",
          "اولین جلسه وزنهٔ شروع هر حرکت را بزن — پیشرفت دوگانه خودش فعال است",
        ],
        notes: [
          "گرم‌کردن خودکار ۳ ست رمپ روی پرس سینه و پرس پا داخل برنامه ست شده",
          "رابط کاربری فارسی ندارد (عربی RTL دارد) — نام حرکات انگلیسی، نوت‌های هر حرکت فارسی‌اند",
          "LISS و کشش‌ها در نوت حرکت آخر هر روز؛ بدون نصب: opengym.ch/demo",
        ],
        file: "/exports/opengym-plan-machine.json",
        copyText: openGymMachineSheetText,
        variants: openGymVariants,
      },
      {
        id: "gymmane",
        name: "GymMane",
        faName: "لاگر آفلاین اندروید — رابط کامل فارسی ⭐",
        website: "https://github.com/InlitX/GymMane",
        badge: "manual",
        badgeText: "ساخت دستی — رابط فارسی",
        summary:
          "لاگر GPLv3 از F-Droid: کامل آفلاین، بدون حساب و تبلیغات، نقشهٔ عضلانی بدن، ۵۰۰+ حرکت با انیمیشن — و مهم‌ترین: رابط کاربری فارسی کامل. ایمپورت برنامه ندارد (فقط تاریخچه)، پس روال‌ها را با برگهٔ اختصاصی‌اش در ~۲ دقیقه برای هر روز می‌سازی.",
        steps: [
          "نصب از F-Droid: f-droid.org/packages/com.gymmane.app (APK arm64-v8a)",
          "فارسی‌سازی: Settings → Language → فارسی؛ واحد کیلوگرم",
          "تب Routines → + → سه روال: Push شنبه / Pull دوشنبه / Legs+Abs چهارشنبه",
          "حرکات را سرچ کن (نام‌های انگلیسی برگه) — ست/تکرار/استراحت/نوت را از برگه بزن",
          "بعد از اولین جلسه، برای هر حرکت Progression بگذار تا وزنهٔ بعدی را خودش بگوید",
        ],
        notes: [
          "کامل آفلاین و خصوصی: بدون مجوز اینترنت — داده هیچ‌وقت از گوشی بیرون نمی‌رود",
          "ست‌های FST-7 را Superset نزن — ۷ ست عادی با استراحت ۴۵ ثانیه",
          "تاریخچهٔ ورزش را بعداً از openGym/Hevy/Strong/Lyfta/FitNotes هم import می‌کند",
        ],
        file: "/exports/build-gymmane-machine.txt",
        copyText: gymmaneMachineText,
        variants: gymmaneVariants,
      },
    ],
    null,
    2,
  )};
`;

fs.writeFileSync(path.join(ROOT, "src", "lib", "appExports.ts"), mod, "utf8");

console.log("generated:");
console.log(" - public/exports/weekly-routine-full.md", weekly.length, "chars (با جدول دو نسخه)");
console.log(" - public/exports/build-hevy.txt", hevySheet.length, "+ build-hevy-machine.txt", hevyMachine.length);
console.log(" - public/exports/build-lyfta.txt", lyftaSheet.length, "+ build-lyfta-machine.txt", lyftaMachine.length);
console.log(" - public/exports/build-generic.txt", genericSheet.length, "+ build-generic-machine.txt", genericMachine.length);
console.log(" - public/exports/opengym-plan.json", JSON.stringify(OPENGYM_PLAN).length, "+ opengym-plan-machine.json", JSON.stringify(OPENGYM_PLAN_MACHINE).length, "bytes (auto-import)");
console.log(" - public/exports/build-opengym.txt", openGymSheetText.length, "+ build-opengym-machine.txt", openGymMachineSheetText.length);
console.log(" - public/exports/build-gymmane.txt", gymmaneSheetText.length, "+ build-gymmane-machine.txt", gymmaneMachineText.length);
console.log(" - public/exports/chatgpt-hevy-prompt-machine.txt", chatGptPromptMachine.length, "+ chatgpt-hevy-prompt-free.txt", chatGptPromptFree.length);
console.log(" - src/lib/appExports.ts");
