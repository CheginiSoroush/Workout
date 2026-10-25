// ============================================================
// خروجی برنامه برای اپ‌های دیگر — تولید خودکار توسط research/gen_app_exports.ts
// دستی ویرایش نکن! منبع: src/lib/program.ts + src/lib/mobility.ts
// اعتبار: 2026-10-24 — openGym: فرمت رسمی plan-share.js v1.4
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
} = {
  "file": "/exports/chatgpt-hevy-prompt-machine.txt",
  "copyText": "You are connected to my Hevy account via the Hevy tool/plugin.\nUse it to CREATE the 3 workout routines below in my Hevy account - exactly as specified.\n\nABOUT ME\n- Male, 25 y/o, 180 cm. Goal: body recomposition (fat loss + muscle) - swimmer's V-taper.\n- Split: Push / Pull / Legs+Abs - 3 sessions per week (Sat = Push, Mon = Pull, Wed = Legs+Abs).\n- Equipment version: MACHINE (weeks 1-2) - machine-first on purpose: fixed path, safe without a spotter while learning the patterns. The free-weight version starts week 3.\n\nROUTINE - name: \"FST-7 Push (Sat)\"\n1. Chest Press (Machine) - 4 sets x 5-8 - rest 180s - RPE 8 - note: \"تیغه‌های شانه رو عقب و پایین قفل کن و قفسه سینه رو باد کن - مسیر ثابت و بدون ریسک گیر کردن زیر وزنه — تمرکزت می‌مونه روی سینه. از هفته ۳–۴ پرس هالتر رو با میله خالی اضافه کن.\"\n2. Incline Chest Press (Machine) - 3 sets x 8-12 - rest 120s - RPE 8 - note: \"شیب نیمکت ۳۰ درجه — بیشتر بشه سرشانه فعال‌تر می‌شه، کمتر بشه سینه پایین - همون الگوی حرکتی، بدون دغدغه کنترل دو دمبل جدا — عالی برای هفته‌های یادگیری.\"\n3. Seated Shoulder Press (Machine) - 3 sets x 8-12 - rest 120s - RPE 8 - note: \"پشتت کامل به پشتی نیمکت بچسبه؛ قوس کمر طبیعی و کم - پشتی دستگاه قوس کمر رو کنترل می‌کنه — ریسک کمتر، تمرکز بیشتر روی دلتوئید.\"\n4. Cable Fly Crossovers - 3 sets x 10-15 - rest 90s - RPE 9 - note: \"قوس دست‌ها در کل حرکت ثابت بمونه — مثل در آغوش گرفتن یه درخت\"\n5. Triceps Rope Pushdown - 3 sets x 10-15 - rest 75s - RPE 9 - note: \"آرنج‌ها چسبیده به بدن و ثابت — فقط ساعد حرکت می‌کنه\"\n6. Lateral Raise (Cable) - 7 sets x 10-15 - rest 45s - RPE 9 (pump) - FST-7 FINISHER - note: \"شونه‌ها پایین و عقب — ترپس رو درگیر نکن - تغییر وزنه بین ست‌ها با یک پیچ — برای ست‌های ۷گانه FST-7 ایده‌آله؛ خود رامبد هم برای FST-7 اغلب کابل/دستگاه استفاده می‌کنه.\"\n\nROUTINE - name: \"FST-7 Pull (Mon)\"\n1. Pull Up (Assisted) - 4 sets x 5-10 - rest 180s - RPE 8 - note: \"دست‌ها کمی بازتر از عرض شانه، سینه به سمت میله - فنر/وزنه متعادل‌کننده تا وقتی ۵ تکرار تمیز بدون کمک بزنی — هر هفته کمک رو کم کن.\"\n2. Seated Cable Row - V Grip (Cable) - 3 sets x 6-10 - rest 180s - RPE 8 - note: \"تنه حدود ۴۵ درجه، کمر صاف و هسته سفت - ستون فقرات اتکا داره و فشار می‌مونه روی پشت. اگه دستگاه زیربغل سینه‌اتکایی (مثل هامر استرنث که دوریان ییتس می‌زد) بود، همون بهترینه.\"\n3. Lat Pulldown (Cable) - 3 sets x 10-12 - rest 120s - RPE 8 - note: \"دست کمی بازتر از شانه؛ دسته رو تا بالای سینه بکش\"\n4. Face Pull - 3 sets x 12-15 - rest 90s - RPE 9 - note: \"طناب در ارتفاع صورت؛ به سمت پیشونی بکش نه سینه\"\n5. Rear Delt Reverse Fly (Machine) - 3 sets x 12-15 - rest 75s - RPE 9 - note: \"سینه چسبیده به پد، تنه ثابت — حرکت فقط از شانه‌ها\"\n6. Bicep Curl (Cable) - 3 sets x 8-12 - rest 90s - RPE 9 - note: \"آرنج‌ها ثابت کنار بدن — فقط ساعد حرکت می‌کنه - کشش بیسپس در کل دامنه + سوئینگ کمر عملاً غیرممکن — فرم تمیز از روز اول.\"\n7. Straight Arm Lat Pulldown (Cable) - 7 sets x 10-15 - rest 45s - RPE 9 (pump) - FST-7 FINISHER - note: \"آرنج ثابت و کمی خم — زاویه دست در کل حرکت ثابت\"\n\nROUTINE - name: \"FST-7 Legs + Abs (Wed)\"\n1. Leg Press (Machine) - 4 sets x 8-12 - rest 180s - RPE 8 - note: \"پاها عرض شانه وسط صفحه — کف پا کامل روی صفحه\"\n2. Back Extension (Machine) - 3 sets x 8-10 - rest 180s - RPE 8 - note: \"لگن رو به عقب هل بده (hip hinge) — اسکات نیست! - همون زنجیره پشتی (همسترینگ/باسن/فیله) با محافظت کامل کمر — RDL رو بعد هفته ۲–۳ با دمبل سبک برگردون.\"\n3. Single Leg Press (Machine) - 3 sets x 8-12 each leg - rest 90s - RPE 8 - note: \"پنجه پای عقب روی نیمکت، پای جلو حدود ۶۰ سانت جلوتر - همون کار یک‌پا بدون دغدغه تعادل — هر پا جداگانه ثبت کن.\"\n4. Lying Leg Curl (Machine) - 3 sets x 10-15 - rest 75s - RPE 9 - note: \"لگن تمام مدت چسبیده به دستگاه — باسن بالا نیاد\"\n5. Standing Calf Raise - 4 sets x 10-15 - rest 60s - RPE 9 - note: \"دامنه کامل: پایین کشش ۲ ثانیه، بالا اسکوییز ۱ ثانیه\"\n6. Leg Raise Parallel Bars - 3 sets x 8-15 - rest 90s - RPE 9 - note: \"کلید حرکت چرخش لگنه (posterior pelvic tilt) — نه فقط بالا بردن پا - پشتی از کمر حمایت می‌کنه و تاب خوردن حذف می‌شه — تمرکز روی چرخش لگن.\"\n7. Cable Crunch - 7 sets x 12-15 - rest 45s - RPE 9 (pump) - FST-7 FINISHER - note: \"دسته رو کنار گردن بگیر (نه پشت سر) و زانوها روی زمین\"\n\nSESSION NOTES (put each text into the notes field of its routine, unchanged - it is in Persian):\n- FST-7 Push (Sat): [گرم‌کردن: دوچرخه ثابت ۵ دقیقه خیلی سبک (مقاومت کم — ریتمی که راحت حرف بزنی) + ست‌های سبکِ حرکت اول جلسه] + [بعد از ست آخر: LISS دوچرخه ۱۵ تا ۲۰ دقیقه (ضربان ۱۱۵ تا ۱۳۵) — جایگزین تردمیل شیب‌دار] + [سرد کردن — روتین کششی سایت: چارچوب در (سینه) — کراس‌بادی شانه — کودک]\n- FST-7 Pull (Mon): [گرم‌کردن: دوچرخه ثابت ۵ دقیقه خیلی سبک (مقاومت کم — ریتمی که راحت حرف بزنی) + ست‌های سبکِ حرکت اول جلسه] + [بعد از ست آخر: LISS دوچرخه ۱۵ تا ۲۰ دقیقه (ضربان ۱۱۵ تا ۱۳۵) — جایگزین تردمیل شیب‌دار] + [سرد کردن — روتین کششی سایت: کشش لت روی دیوار — آویزان‌شدن از بارفیکس — گربه–گاو]\n- FST-7 Legs + Abs (Wed): [گرم‌کردن: دوچرخه ثابت ۵ دقیقه خیلی سبک (مقاومت کم — ریتمی که راحت حرف بزنی) + ست‌های سبکِ حرکت اول جلسه] + [بعد از ست آخر: LISS دوچرخه ۱۵ تا ۲۰ دقیقه (ضربان ۱۱۵ تا ۱۳۵) — جایگزین تردمیل شیب‌دار] + [سرد کردن — روتین کششی سایت: همسترینگ با بند — چهارسر ایستاده — فلکسور ران — ساق روی دیوار]\n\nHARD RULES\n1. Exercise names above are verified against Hevy's own exercise library. Search each EXACT name and pick exactly that exercise. If a name is not found, STOP and tell me - never silently substitute a similar exercise.\n2. Set the rest timer of every set exactly as written (seconds). Put rep ranges in the rep-range fields (start / end).\n3. Copy each exercise's note text into its notes field unchanged (Persian - keep as-is). Hevy has no RPE field - so APPEND this exercise's RPE target to the END of its note in the form \" | RPE هدف: N\" (N is the RPE written on the exercise line).\n4. Exercises marked \"FST-7 FINISHER\": exactly 7 sets, ~45s rest, constant light weight, last sets to technical failure. Do NOT mark them as a superset.\n5. Add 3 warm-up sets (type = warmup) before the FIRST exercise of each routine. Push/Legs: 8 reps at ~40%, 4 reps at ~60%, 2 reps at ~75% of the first working set. Pull: scapular pulls + 5 light band-assisted reps.\n6. Leave all working weights EMPTY - I will log my first session to find my starting weights.\n7. Create exactly 3 routines with the exact names above (\"FST-7 Push (Sat)\", \"FST-7 Pull (Mon)\", \"FST-7 Legs + Abs (Wed)\").\n8. When done, list every routine with its exercises (sets x reps, rest) so I can verify. If the Hevy tool is unavailable, do NOT pretend it worked - output the 3 routines as plain text instead.\n\nPROGRESSION (my own rule - Hevy has no auto-progression; reference only):\n- Double progression: when I hit the top of the rep range on all sets with good form (RPE 8), next session I add ~2.5 kg (upper body) / ~5 kg (lower body) and drop back to the bottom of the range.",
  "variants": [
    {
      "id": "machine",
      "label": "دستگاهی — هفتهٔ ۱ تا ۲",
      "file": "/exports/chatgpt-hevy-prompt-machine.txt",
      "copyText": "You are connected to my Hevy account via the Hevy tool/plugin.\nUse it to CREATE the 3 workout routines below in my Hevy account - exactly as specified.\n\nABOUT ME\n- Male, 25 y/o, 180 cm. Goal: body recomposition (fat loss + muscle) - swimmer's V-taper.\n- Split: Push / Pull / Legs+Abs - 3 sessions per week (Sat = Push, Mon = Pull, Wed = Legs+Abs).\n- Equipment version: MACHINE (weeks 1-2) - machine-first on purpose: fixed path, safe without a spotter while learning the patterns. The free-weight version starts week 3.\n\nROUTINE - name: \"FST-7 Push (Sat)\"\n1. Chest Press (Machine) - 4 sets x 5-8 - rest 180s - RPE 8 - note: \"تیغه‌های شانه رو عقب و پایین قفل کن و قفسه سینه رو باد کن - مسیر ثابت و بدون ریسک گیر کردن زیر وزنه — تمرکزت می‌مونه روی سینه. از هفته ۳–۴ پرس هالتر رو با میله خالی اضافه کن.\"\n2. Incline Chest Press (Machine) - 3 sets x 8-12 - rest 120s - RPE 8 - note: \"شیب نیمکت ۳۰ درجه — بیشتر بشه سرشانه فعال‌تر می‌شه، کمتر بشه سینه پایین - همون الگوی حرکتی، بدون دغدغه کنترل دو دمبل جدا — عالی برای هفته‌های یادگیری.\"\n3. Seated Shoulder Press (Machine) - 3 sets x 8-12 - rest 120s - RPE 8 - note: \"پشتت کامل به پشتی نیمکت بچسبه؛ قوس کمر طبیعی و کم - پشتی دستگاه قوس کمر رو کنترل می‌کنه — ریسک کمتر، تمرکز بیشتر روی دلتوئید.\"\n4. Cable Fly Crossovers - 3 sets x 10-15 - rest 90s - RPE 9 - note: \"قوس دست‌ها در کل حرکت ثابت بمونه — مثل در آغوش گرفتن یه درخت\"\n5. Triceps Rope Pushdown - 3 sets x 10-15 - rest 75s - RPE 9 - note: \"آرنج‌ها چسبیده به بدن و ثابت — فقط ساعد حرکت می‌کنه\"\n6. Lateral Raise (Cable) - 7 sets x 10-15 - rest 45s - RPE 9 (pump) - FST-7 FINISHER - note: \"شونه‌ها پایین و عقب — ترپس رو درگیر نکن - تغییر وزنه بین ست‌ها با یک پیچ — برای ست‌های ۷گانه FST-7 ایده‌آله؛ خود رامبد هم برای FST-7 اغلب کابل/دستگاه استفاده می‌کنه.\"\n\nROUTINE - name: \"FST-7 Pull (Mon)\"\n1. Pull Up (Assisted) - 4 sets x 5-10 - rest 180s - RPE 8 - note: \"دست‌ها کمی بازتر از عرض شانه، سینه به سمت میله - فنر/وزنه متعادل‌کننده تا وقتی ۵ تکرار تمیز بدون کمک بزنی — هر هفته کمک رو کم کن.\"\n2. Seated Cable Row - V Grip (Cable) - 3 sets x 6-10 - rest 180s - RPE 8 - note: \"تنه حدود ۴۵ درجه، کمر صاف و هسته سفت - ستون فقرات اتکا داره و فشار می‌مونه روی پشت. اگه دستگاه زیربغل سینه‌اتکایی (مثل هامر استرنث که دوریان ییتس می‌زد) بود، همون بهترینه.\"\n3. Lat Pulldown (Cable) - 3 sets x 10-12 - rest 120s - RPE 8 - note: \"دست کمی بازتر از شانه؛ دسته رو تا بالای سینه بکش\"\n4. Face Pull - 3 sets x 12-15 - rest 90s - RPE 9 - note: \"طناب در ارتفاع صورت؛ به سمت پیشونی بکش نه سینه\"\n5. Rear Delt Reverse Fly (Machine) - 3 sets x 12-15 - rest 75s - RPE 9 - note: \"سینه چسبیده به پد، تنه ثابت — حرکت فقط از شانه‌ها\"\n6. Bicep Curl (Cable) - 3 sets x 8-12 - rest 90s - RPE 9 - note: \"آرنج‌ها ثابت کنار بدن — فقط ساعد حرکت می‌کنه - کشش بیسپس در کل دامنه + سوئینگ کمر عملاً غیرممکن — فرم تمیز از روز اول.\"\n7. Straight Arm Lat Pulldown (Cable) - 7 sets x 10-15 - rest 45s - RPE 9 (pump) - FST-7 FINISHER - note: \"آرنج ثابت و کمی خم — زاویه دست در کل حرکت ثابت\"\n\nROUTINE - name: \"FST-7 Legs + Abs (Wed)\"\n1. Leg Press (Machine) - 4 sets x 8-12 - rest 180s - RPE 8 - note: \"پاها عرض شانه وسط صفحه — کف پا کامل روی صفحه\"\n2. Back Extension (Machine) - 3 sets x 8-10 - rest 180s - RPE 8 - note: \"لگن رو به عقب هل بده (hip hinge) — اسکات نیست! - همون زنجیره پشتی (همسترینگ/باسن/فیله) با محافظت کامل کمر — RDL رو بعد هفته ۲–۳ با دمبل سبک برگردون.\"\n3. Single Leg Press (Machine) - 3 sets x 8-12 each leg - rest 90s - RPE 8 - note: \"پنجه پای عقب روی نیمکت، پای جلو حدود ۶۰ سانت جلوتر - همون کار یک‌پا بدون دغدغه تعادل — هر پا جداگانه ثبت کن.\"\n4. Lying Leg Curl (Machine) - 3 sets x 10-15 - rest 75s - RPE 9 - note: \"لگن تمام مدت چسبیده به دستگاه — باسن بالا نیاد\"\n5. Standing Calf Raise - 4 sets x 10-15 - rest 60s - RPE 9 - note: \"دامنه کامل: پایین کشش ۲ ثانیه، بالا اسکوییز ۱ ثانیه\"\n6. Leg Raise Parallel Bars - 3 sets x 8-15 - rest 90s - RPE 9 - note: \"کلید حرکت چرخش لگنه (posterior pelvic tilt) — نه فقط بالا بردن پا - پشتی از کمر حمایت می‌کنه و تاب خوردن حذف می‌شه — تمرکز روی چرخش لگن.\"\n7. Cable Crunch - 7 sets x 12-15 - rest 45s - RPE 9 (pump) - FST-7 FINISHER - note: \"دسته رو کنار گردن بگیر (نه پشت سر) و زانوها روی زمین\"\n\nSESSION NOTES (put each text into the notes field of its routine, unchanged - it is in Persian):\n- FST-7 Push (Sat): [گرم‌کردن: دوچرخه ثابت ۵ دقیقه خیلی سبک (مقاومت کم — ریتمی که راحت حرف بزنی) + ست‌های سبکِ حرکت اول جلسه] + [بعد از ست آخر: LISS دوچرخه ۱۵ تا ۲۰ دقیقه (ضربان ۱۱۵ تا ۱۳۵) — جایگزین تردمیل شیب‌دار] + [سرد کردن — روتین کششی سایت: چارچوب در (سینه) — کراس‌بادی شانه — کودک]\n- FST-7 Pull (Mon): [گرم‌کردن: دوچرخه ثابت ۵ دقیقه خیلی سبک (مقاومت کم — ریتمی که راحت حرف بزنی) + ست‌های سبکِ حرکت اول جلسه] + [بعد از ست آخر: LISS دوچرخه ۱۵ تا ۲۰ دقیقه (ضربان ۱۱۵ تا ۱۳۵) — جایگزین تردمیل شیب‌دار] + [سرد کردن — روتین کششی سایت: کشش لت روی دیوار — آویزان‌شدن از بارفیکس — گربه–گاو]\n- FST-7 Legs + Abs (Wed): [گرم‌کردن: دوچرخه ثابت ۵ دقیقه خیلی سبک (مقاومت کم — ریتمی که راحت حرف بزنی) + ست‌های سبکِ حرکت اول جلسه] + [بعد از ست آخر: LISS دوچرخه ۱۵ تا ۲۰ دقیقه (ضربان ۱۱۵ تا ۱۳۵) — جایگزین تردمیل شیب‌دار] + [سرد کردن — روتین کششی سایت: همسترینگ با بند — چهارسر ایستاده — فلکسور ران — ساق روی دیوار]\n\nHARD RULES\n1. Exercise names above are verified against Hevy's own exercise library. Search each EXACT name and pick exactly that exercise. If a name is not found, STOP and tell me - never silently substitute a similar exercise.\n2. Set the rest timer of every set exactly as written (seconds). Put rep ranges in the rep-range fields (start / end).\n3. Copy each exercise's note text into its notes field unchanged (Persian - keep as-is). Hevy has no RPE field - so APPEND this exercise's RPE target to the END of its note in the form \" | RPE هدف: N\" (N is the RPE written on the exercise line).\n4. Exercises marked \"FST-7 FINISHER\": exactly 7 sets, ~45s rest, constant light weight, last sets to technical failure. Do NOT mark them as a superset.\n5. Add 3 warm-up sets (type = warmup) before the FIRST exercise of each routine. Push/Legs: 8 reps at ~40%, 4 reps at ~60%, 2 reps at ~75% of the first working set. Pull: scapular pulls + 5 light band-assisted reps.\n6. Leave all working weights EMPTY - I will log my first session to find my starting weights.\n7. Create exactly 3 routines with the exact names above (\"FST-7 Push (Sat)\", \"FST-7 Pull (Mon)\", \"FST-7 Legs + Abs (Wed)\").\n8. When done, list every routine with its exercises (sets x reps, rest) so I can verify. If the Hevy tool is unavailable, do NOT pretend it worked - output the 3 routines as plain text instead.\n\nPROGRESSION (my own rule - Hevy has no auto-progression; reference only):\n- Double progression: when I hit the top of the rep range on all sets with good form (RPE 8), next session I add ~2.5 kg (upper body) / ~5 kg (lower body) and drop back to the bottom of the range."
    },
    {
      "id": "free",
      "label": "وزنهٔ آزاد — از هفتهٔ ۳",
      "file": "/exports/chatgpt-hevy-prompt-free.txt",
      "copyText": "You are connected to my Hevy account via the Hevy tool/plugin.\nUse it to CREATE the 3 workout routines below in my Hevy account - exactly as specified.\n\nABOUT ME\n- Male, 25 y/o, 180 cm. Goal: body recomposition (fat loss + muscle) - swimmer's V-taper.\n- Split: Push / Pull / Legs+Abs - 3 sessions per week (Sat = Push, Mon = Pull, Wed = Legs+Abs).\n- Equipment version: FREE WEIGHTS (weeks 3+) - same volume and structure as the machine version; only the tools change.\n\nROUTINE - name: \"FST-7 Push (Sat)\"\n1. Bench Press (Barbell) - 4 sets x 5-8 - rest 180s - RPE 8 - note: \"تیغه‌های شانه رو عقب و پایین قفل کن و قفسه سینه رو باد کن\"\n2. Incline Bench Press (Dumbbell) - 3 sets x 8-12 - rest 120s - RPE 8 - note: \"شیب نیمکت ۳۰ درجه — بیشتر بشه سرشانه فعال‌تر می‌شه، کمتر بشه سینه پایین\"\n3. Shoulder Press (Dumbbell) - 3 sets x 8-12 - rest 120s - RPE 8 - note: \"پشتت کامل به پشتی نیمکت بچسبه؛ قوس کمر طبیعی و کم\"\n4. Chest Fly (Dumbbell) - 3 sets x 10-15 - rest 90s - RPE 9 - note: \"قوس دست‌ها در کل حرکت ثابت بمونه — مثل در آغوش گرفتن یه درخت - وقتی دستگاه شلوغه — کشش عمیق‌تر ولی کنترلش سخت‌تره؛ وزنه سبک انتخاب کن.\"\n5. Triceps Rope Pushdown - 3 sets x 10-15 - rest 75s - RPE 9 - note: \"آرنج‌ها چسبیده به بدن و ثابت — فقط ساعد حرکت می‌کنه\"\n6. Lateral Raise (Dumbbell) - 7 sets x 10-15 - rest 45s - RPE 9 (pump) - FST-7 FINISHER - note: \"شونه‌ها پایین و عقب — ترپس رو درگیر نکن\"\n\nROUTINE - name: \"FST-7 Pull (Mon)\"\n1. Pull Up - 4 sets x 5-10 - rest 180s - RPE 8 - note: \"دست‌ها کمی بازتر از عرض شانه، سینه به سمت میله\"\n2. Bent Over Row (Barbell) - 3 sets x 6-10 - rest 180s - RPE 8 - note: \"تنه حدود ۴۵ درجه، کمر صاف و هسته سفت\"\n3. Lat Pulldown (Cable) - 3 sets x 10-12 - rest 120s - RPE 8 - note: \"دست کمی بازتر از شانه؛ دسته رو تا بالای سینه بکش\"\n4. Face Pull - 3 sets x 12-15 - rest 90s - RPE 9 - note: \"طناب در ارتفاع صورت؛ به سمت پیشونی بکش نه سینه\"\n5. Rear Delt Reverse Fly (Dumbbell) - 3 sets x 12-15 - rest 75s - RPE 9 - note: \"سینه چسبیده به پد، تنه ثابت — حرکت فقط از شانه‌ها - وقتی دستگاه شلوغه — تنه موازی زمین، دمبل سبک، همون جمع کردن تیغه‌ها در انتها.\"\n6. EZ Bar Biceps Curl - 3 sets x 8-12 - rest 90s - RPE 9 - note: \"آرنج‌ها ثابت کنار بدن — فقط ساعد حرکت می‌کنه\"\n7. Straight Arm Lat Pulldown (Cable) - 7 sets x 10-15 - rest 45s - RPE 9 (pump) - FST-7 FINISHER - note: \"آرنج ثابت و کمی خم — زاویه دست در کل حرکت ثابت\"\n\nROUTINE - name: \"FST-7 Legs + Abs (Wed)\"\n1. Goblet Squat - 4 sets x 8-12 - rest 180s - RPE 8 - note: \"پاها عرض شانه وسط صفحه — کف پا کامل روی صفحه - برای تنوع یا تمرین در خانه/سفر — دمبل رو کنار سینه بگیر و عمیق پایین برو.\"\n2. Romanian Deadlift (Barbell) - 3 sets x 8-10 - rest 180s - RPE 8 - note: \"لگن رو به عقب هل بده (hip hinge) — اسکات نیست!\"\n3. Bulgarian Split Squat (Dumbbell) - 3 sets x 8-12 each leg - rest 90s - RPE 8 - note: \"پنجه پای عقب روی نیمکت، پای جلو حدود ۶۰ سانت جلوتر\"\n4. Lying Leg Curl (Machine) - 3 sets x 10-15 - rest 75s - RPE 9 - note: \"لگن تمام مدت چسبیده به دستگاه — باسن بالا نیاد\"\n5. Standing Calf Raise - 4 sets x 10-15 - rest 60s - RPE 9 - note: \"دامنه کامل: پایین کشش ۲ ثانیه، بالا اسکوییز ۱ ثانیه\"\n6. Hanging Leg Raise - 3 sets x 8-15 - rest 90s - RPE 9 - note: \"کلید حرکت چرخش لگنه (posterior pelvic tilt) — نه فقط بالا بردن پا\"\n7. Cable Crunch - 7 sets x 12-15 - rest 45s - RPE 9 (pump) - FST-7 FINISHER - note: \"دسته رو کنار گردن بگیر (نه پشت سر) و زانوها روی زمین\"\n\nSESSION NOTES (put each text into the notes field of its routine, unchanged - it is in Persian):\n- FST-7 Push (Sat): [گرم‌کردن: دوچرخه ثابت ۵ دقیقه خیلی سبک (مقاومت کم — ریتمی که راحت حرف بزنی) + ست‌های سبکِ حرکت اول جلسه] + [بعد از ست آخر: LISS دوچرخه ۱۵ تا ۲۰ دقیقه (ضربان ۱۱۵ تا ۱۳۵) — جایگزین تردمیل شیب‌دار] + [سرد کردن — روتین کششی سایت: چارچوب در (سینه) — کراس‌بادی شانه — کودک]\n- FST-7 Pull (Mon): [گرم‌کردن: دوچرخه ثابت ۵ دقیقه خیلی سبک (مقاومت کم — ریتمی که راحت حرف بزنی) + ست‌های سبکِ حرکت اول جلسه] + [بعد از ست آخر: LISS دوچرخه ۱۵ تا ۲۰ دقیقه (ضربان ۱۱۵ تا ۱۳۵) — جایگزین تردمیل شیب‌دار] + [سرد کردن — روتین کششی سایت: کشش لت روی دیوار — آویزان‌شدن از بارفیکس — گربه–گاو]\n- FST-7 Legs + Abs (Wed): [گرم‌کردن: دوچرخه ثابت ۵ دقیقه خیلی سبک (مقاومت کم — ریتمی که راحت حرف بزنی) + ست‌های سبکِ حرکت اول جلسه] + [بعد از ست آخر: LISS دوچرخه ۱۵ تا ۲۰ دقیقه (ضربان ۱۱۵ تا ۱۳۵) — جایگزین تردمیل شیب‌دار] + [سرد کردن — روتین کششی سایت: همسترینگ با بند — چهارسر ایستاده — فلکسور ران — ساق روی دیوار]\n\nHARD RULES\n1. Exercise names above are verified against Hevy's own exercise library. Search each EXACT name and pick exactly that exercise. If a name is not found, STOP and tell me - never silently substitute a similar exercise.\n2. Set the rest timer of every set exactly as written (seconds). Put rep ranges in the rep-range fields (start / end).\n3. Copy each exercise's note text into its notes field unchanged (Persian - keep as-is). Hevy has no RPE field - so APPEND this exercise's RPE target to the END of its note in the form \" | RPE هدف: N\" (N is the RPE written on the exercise line).\n4. Exercises marked \"FST-7 FINISHER\": exactly 7 sets, ~45s rest, constant light weight, last sets to technical failure. Do NOT mark them as a superset.\n5. Add 3 warm-up sets (type = warmup) before the FIRST exercise of each routine. Push/Legs: 8 reps at ~40%, 4 reps at ~60%, 2 reps at ~75% of the first working set. Pull: scapular pulls + 5 light band-assisted reps.\n6. Leave all working weights EMPTY - I will log my first session to find my starting weights.\n7. Create exactly 3 routines with the exact names above (\"FST-7 Push (Sat)\", \"FST-7 Pull (Mon)\", \"FST-7 Legs + Abs (Wed)\").\n8. When done, list every routine with its exercises (sets x reps, rest) so I can verify. If the Hevy tool is unavailable, do NOT pretend it worked - output the 3 routines as plain text instead.\n\nPROGRESSION (my own rule - Hevy has no auto-progression; reference only):\n- Double progression: when I hit the top of the rep range on all sets with good form (RPE 8), next session I add ~2.5 kg (upper body) / ~5 kg (lower body) and drop back to the bottom of the range."
    }
  ]
};

export const APP_EXPORTS: AppExportCard[] = [
  {
    "id": "hevy",
    "name": "Hevy",
    "faName": "محبوب‌ترین لاگر — نام‌های کتابخانه‌اش را از قبل داریم",
    "website": "https://hevy.com",
    "badge": "manual",
    "badgeText": "ساخت دستی دقیق — ~۵ دقیقه",
    "summary": "Hevy ایمپورتِ روال ندارد (فقط تاریخچهٔ ورزش CSV) — ولی نام حرکات برنامه دقیقاً با کتابخانه‌اش تطبیق داده شده؛ برگه را باز کن و هر روال را در ۲ دقیقه بساز. سوییچ بالای کارت: نسخهٔ دستگاهی (هفتهٔ ۱–۲) یا وزنهٔ آزاد (هفتهٔ ۳+).",
    "steps": [
      "اپ Hevy → تب Workout → New Routine (۳ روال بساز: Push / Pull / پا+شکم)",
      "حرکت را با نام انگلیسی برگه سرچ کن — همان را انتخاب کن (نام‌ها دقیق‌اند)",
      "ست‌ها، تکرار، Rest (ثانیه) و RPE را از برگه بزن؛ نوت هر حرکت را کپی کن",
      "گرم‌کردن هر حرکت اول را با تیک Warmup روی ست‌های سبک علامت بزن"
    ],
    "notes": [
      "میان‌بر خودکار: پرامپت آمادهٔ ChatGPT بالای همین صفحه — با پلاگین Hevy هر ۳ روال را خودش می‌سازد",
      "فولدر بساز به نام FST-7 و هر ۳ روال را داخلش بگذار",
      "ست‌های FST-7 را Superset نزن — فقط استراحت ۴۵ ثانیه"
    ],
    "file": "/exports/build-hevy-machine.txt",
    "variants": [
      {
        "id": "machine",
        "label": "دستگاهی — هفتهٔ ۱ تا ۲",
        "file": "/exports/build-hevy-machine.txt",
      },
      {
        "id": "free",
        "label": "وزنهٔ آزاد — از هفتهٔ ۳",
        "file": "/exports/build-hevy.txt",
      }
    ]
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
      "۲۰ حرکت را با نام‌های انگلیسی برگه پیدا کن (کتابخانه‌اش بزرگ و کامل است)",
      "دوز و استراحت و نوت‌ها را از برگه وارد کن؛ برای هر روز یک روال"
    ],
    "notes": [
      "اگر از Hevy لاگ داشتی، History Import آن جدا انجام می‌شود",
      "Rest Timer هر حرکت را روی ثانیه‌های برگه تنظیم کن — مخصوصاً FST-7 (۴۵ ثانیه)"
    ],
    "file": "/exports/build-lyfta-machine.txt",
    "variants": [
      {
        "id": "machine",
        "label": "دستگاهی — هفتهٔ ۱ تا ۲",
        "file": "/exports/build-lyfta-machine.txt",
      },
      {
        "id": "free",
        "label": "وزنهٔ آزاد — از هفتهٔ ۳",
        "file": "/exports/build-lyfta.txt",
      }
    ]
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
    "file": "/exports/build-generic-machine.txt",
    "variants": [
      {
        "id": "machine",
        "label": "دستگاهی — هفتهٔ ۱ تا ۲",
        "file": "/exports/build-generic-machine.txt",
      },
      {
        "id": "free",
        "label": "وزنهٔ آزاد — از هفتهٔ ۳",
        "file": "/exports/build-generic.txt",
      }
    ]
  },
  {
    "id": "opengym",
    "name": "openGym",
    "faName": "لاگر متن‌باز سوئیسی — فایل برنامهٔ ما را مستقیم می‌خواند ⭐",
    "website": "https://opengym.ch",
    "badge": "auto",
    "badgeText": "ایمپورت خودکار JSON — زیر ۱ دقیقه",
    "summary": "تنها اپ بعد از Liftosaur که برنامهٔ ما را فایل می‌فهمد: فایل JSON نسخهٔ انتخابی (سوییچ بالای کارت) را دانلود کن و در Plan → Import a plan file بده — ۳ روال + تقویم هفته + استراحت‌ها + پیشرفت دوگانه یک‌جا می‌نشیند. هر دو نسخه را کنار هم می‌شود ایمپورت کرد. AGPL، بدون تبلیغ و اشتراک؛ Android/iOS/self-host.",
    "steps": [
      "نسخه را از سوییچ بالای کارت انتخاب کن (دستگاهی هفتهٔ ۱–۲ / آزاد هفتهٔ ۳+) و فایل JSON را از دکمهٔ دانلود بگیر",
      "اپ → تب Plan → منوی سه‌نقطه → Import a plan file → فایل را بده",
      "۳ روال Push/Pull/Legs اضافه می‌شود (merge — چیزی خراب نمی‌شود)",
      "سوییچ «Use this weekly schedule» را روشن کن: شنبه Push، دوشنبه Pull، چهارشنبه پا+شکم",
      "اولین جلسه وزنهٔ شروع هر حرکت را بزن — پیشرفت دوگانه خودش فعال است"
    ],
    "notes": [
      "گرم‌کردن خودکار ۳ ست رمپ روی پرس سینه و پرس پا داخل برنامه ست شده",
      "رابط کاربری فارسی ندارد (عربی RTL دارد) — نام حرکات انگلیسی، نوت‌های هر حرکت فارسی‌اند",
      "LISS و کشش‌ها در نوت حرکت آخر هر روز؛ بدون نصب: opengym.ch/demo"
    ],
    "file": "/exports/opengym-plan-machine.json",
    "copyText": "=====================================================\nFST-7 SWIMMER — OPENGYM (opengym.ch) — ایمپورت خودکار\nنسخه: دستگاهی — هفتهٔ ۱ تا ۲ (شروع)\nتولید: 2026-10-24 | فرمت رسمی: opengym_plan 1 (plan-share.js)\n=====================================================\n\nمهم‌ترین نکته: openGym برنامه را به‌صورت فایل JSON می‌فهمد — برخلاف Hevy/Lyfta/Fitbod.\nفایل opengym-plan-machine.json (همین پوشهٔ exports) را ایمپورت کن، نه دستی بساز:\n\nمراحل ایمپورت (زیر ۱ دقیقه):\n  1. فایل opengym-plan-machine.json را دانلود کن (کارت openGym در سایت → سوییچ نسخه → دکمهٔ دانلود)\n  2. اپ openGym → تب Plan → منوی سه‌نقطه → «Import a plan file»\n  3. فایل را انتخاب کن — ۳ روال جدید (Push Machines / Pull Machines / Legs + Abs Machines) به روال‌هایت اضافه می‌شود؛ چیزی خراب نمی‌شود (merge)\n  4. در همان صفحه سوییچ «Use this weekly schedule» را روشن کن:\n     شنبه Push | دوشنبه Pull | چهارشنبه پا+شکم — بقیه روزها استراحت\n  5. Import را بزن. در هر حرکت وزنهٔ شروع را اولین جلسه بزن — پیشرفت دوگانه (double)\n     از همان لحظه فعال است: به سقف تکرار که رسیدی، وزنه به‌اندازهٔ inc خودش بالا می‌رود\n\nداخل فایل چه هست:\n  • ۱۹ حرکت با id کاتالوگ رسمی (نام، انیمیشن و عضله درست)\n  • استراحت‌ها به ثانیه (FST-7 = ۴۵ ثانیه، پایه = ۱۸۰/۱۲۰/۹۰/۷۵/۶۰)\n  • بازهٔ تکرار هر حرکت (۵–۸، ۸–۱۲، ۱۰–۱۵، ۱۲–۱۵) با قاعدهٔ پیشرفت دوگانه\n  • گرم‌کردن خودکار ۳ ست رمپ روی حرکت اول Push و پرس پا (۵۰٪/۷۵٪/۸۷.۵٪)\n  • بارفیکس کمکی بدون پیشرفت خودکار — هر هفته وزنهٔ کمک را کم کن\n  • نوت فارسی هر حرکت: RPE، سوییچ نسخهٔ بعدی، FST-7، یادآور LISS و کشش\n\nمحدودیت‌ها (صادقانه):\n  • رابط کاربری openGym فارسی ندارد (۱۹ زبان دارد؛ عربی RTL هست، فارسی نه) — نام‌های حرکت انگلیسی‌اند؛ نوت‌ها فارسی‌اند\n  • LISS دوچرخه و کشش‌ها داخل فایل نیستند (حرکت قابل‌ردیابی نیستند) — در نوت حرکت آخر هر روز آمده‌اند؛ روتین کامل در برگهٔ جامع سایت\n  • نسخهٔ وب: opengym.ch/demo بدون نصب باز می‌شود — همان ایمپورت آنجا هم کار می‌کند\n\nهر دو نسخه (دستگاهی و آزاد) را می‌توانی کنار هم ایمپورت کنی — نام روال‌ها فرق دارند و merge خراب نمی‌شود.\n\nلینک‌ها: سایت opengym.ch | کد github.com/DuarteSantos8/openGym (AGPL-3.0) | Android APK + iOS App Store + self-host Docker",
    "variants": [
      {
        "id": "machine",
        "label": "دستگاهی — هفتهٔ ۱ تا ۲",
        "file": "/exports/opengym-plan-machine.json",
        "copyText": "=====================================================\nFST-7 SWIMMER — OPENGYM (opengym.ch) — ایمپورت خودکار\nنسخه: دستگاهی — هفتهٔ ۱ تا ۲ (شروع)\nتولید: 2026-10-24 | فرمت رسمی: opengym_plan 1 (plan-share.js)\n=====================================================\n\nمهم‌ترین نکته: openGym برنامه را به‌صورت فایل JSON می‌فهمد — برخلاف Hevy/Lyfta/Fitbod.\nفایل opengym-plan-machine.json (همین پوشهٔ exports) را ایمپورت کن، نه دستی بساز:\n\nمراحل ایمپورت (زیر ۱ دقیقه):\n  1. فایل opengym-plan-machine.json را دانلود کن (کارت openGym در سایت → سوییچ نسخه → دکمهٔ دانلود)\n  2. اپ openGym → تب Plan → منوی سه‌نقطه → «Import a plan file»\n  3. فایل را انتخاب کن — ۳ روال جدید (Push Machines / Pull Machines / Legs + Abs Machines) به روال‌هایت اضافه می‌شود؛ چیزی خراب نمی‌شود (merge)\n  4. در همان صفحه سوییچ «Use this weekly schedule» را روشن کن:\n     شنبه Push | دوشنبه Pull | چهارشنبه پا+شکم — بقیه روزها استراحت\n  5. Import را بزن. در هر حرکت وزنهٔ شروع را اولین جلسه بزن — پیشرفت دوگانه (double)\n     از همان لحظه فعال است: به سقف تکرار که رسیدی، وزنه به‌اندازهٔ inc خودش بالا می‌رود\n\nداخل فایل چه هست:\n  • ۱۹ حرکت با id کاتالوگ رسمی (نام، انیمیشن و عضله درست)\n  • استراحت‌ها به ثانیه (FST-7 = ۴۵ ثانیه، پایه = ۱۸۰/۱۲۰/۹۰/۷۵/۶۰)\n  • بازهٔ تکرار هر حرکت (۵–۸، ۸–۱۲، ۱۰–۱۵، ۱۲–۱۵) با قاعدهٔ پیشرفت دوگانه\n  • گرم‌کردن خودکار ۳ ست رمپ روی حرکت اول Push و پرس پا (۵۰٪/۷۵٪/۸۷.۵٪)\n  • بارفیکس کمکی بدون پیشرفت خودکار — هر هفته وزنهٔ کمک را کم کن\n  • نوت فارسی هر حرکت: RPE، سوییچ نسخهٔ بعدی، FST-7، یادآور LISS و کشش\n\nمحدودیت‌ها (صادقانه):\n  • رابط کاربری openGym فارسی ندارد (۱۹ زبان دارد؛ عربی RTL هست، فارسی نه) — نام‌های حرکت انگلیسی‌اند؛ نوت‌ها فارسی‌اند\n  • LISS دوچرخه و کشش‌ها داخل فایل نیستند (حرکت قابل‌ردیابی نیستند) — در نوت حرکت آخر هر روز آمده‌اند؛ روتین کامل در برگهٔ جامع سایت\n  • نسخهٔ وب: opengym.ch/demo بدون نصب باز می‌شود — همان ایمپورت آنجا هم کار می‌کند\n\nهر دو نسخه (دستگاهی و آزاد) را می‌توانی کنار هم ایمپورت کنی — نام روال‌ها فرق دارند و merge خراب نمی‌شود.\n\nلینک‌ها: سایت opengym.ch | کد github.com/DuarteSantos8/openGym (AGPL-3.0) | Android APK + iOS App Store + self-host Docker"
      },
      {
        "id": "free",
        "label": "وزنهٔ آزاد — از هفتهٔ ۳",
        "file": "/exports/opengym-plan.json",
        "copyText": "=====================================================\nFST-7 SWIMMER — OPENGYM (opengym.ch) — ایمپورت خودکار\nنسخه: وزنهٔ آزاد — از هفتهٔ ۳\nتولید: 2026-10-24 | فرمت رسمی: opengym_plan 1 (plan-share.js)\n=====================================================\n\nمهم‌ترین نکته: openGym برنامه را به‌صورت فایل JSON می‌فهمد — برخلاف Hevy/Lyfta/Fitbod.\nفایل opengym-plan.json (همین پوشهٔ exports) را ایمپورت کن، نه دستی بساز:\n\nمراحل ایمپورت (زیر ۱ دقیقه):\n  1. فایل opengym-plan.json را دانلود کن (کارت openGym در سایت → سوییچ نسخه → دکمهٔ دانلود)\n  2. اپ openGym → تب Plan → منوی سه‌نقطه → «Import a plan file»\n  3. فایل را انتخاب کن — ۳ روال جدید (Push/Pull/Legs) به روال‌هایت اضافه می‌شود؛ چیزی خراب نمی‌شود (merge)\n  4. در همان صفحه سوییچ «Use this weekly schedule» را روشن کن:\n     شنبه Push | دوشنبه Pull | چهارشنبه پا+شکم — بقیه روزها استراحت\n  5. Import را بزن. در هر حرکت وزنهٔ شروع را اولین جلسه بزن — پیشرفت دوگانه (double)\n     از همان لحظه فعال است: به سقف تکرار که رسیدی، وزنه به‌اندازهٔ inc خودش بالا می‌رود\n\nداخل فایل چه هست:\n  • ۱۹ حرکت با id کاتالوگ رسمی (نام، انیمیشن و عضله درست)\n  • استراحت‌ها به ثانیه (FST-7 = ۴۵ ثانیه، پایه = ۱۸۰/۱۲۰/۹۰/۷۵/۶۰)\n  • بازهٔ تکرار هر حرکت (۵–۸، ۸–۱۲، ۱۰–۱۵، ۱۲–۱۵) با قاعدهٔ پیشرفت دوگانه\n  • گرم‌کردن خودکار ۳ ست رمپ روی حرکت اول Push و پرس پا (۵۰٪/۷۵٪/۸۷.۵٪)\n  • اسکات بلغاری per-side (هر پا جدا ثبت می‌شود)\n  • نوت فارسی هر حرکت: RPE، سوییچ نسخهٔ بعدی، FST-7، یادآور LISS و کشش\n\nمحدودیت‌ها (صادقانه):\n  • رابط کاربری openGym فارسی ندارد (۱۹ زبان دارد؛ عربی RTL هست، فارسی نه) — نام‌های حرکت انگلیسی‌اند؛ نوت‌ها فارسی‌اند\n  • LISS دوچرخه و کشش‌ها داخل فایل نیستند (حرکت قابل‌ردیابی نیستند) — در نوت حرکت آخر هر روز آمده‌اند؛ روتین کامل در برگهٔ جامع سایت\n  • نسخهٔ وب: opengym.ch/demo بدون نصب باز می‌شود — همان ایمپورت آنجا هم کار می‌کند\n\nهر دو نسخه (دستگاهی و آزاد) را می‌توانی کنار هم ایمپورت کنی — نام روال‌ها فرق دارند و merge خراب نمی‌شود.\n\nلینک‌ها: سایت opengym.ch | کد github.com/DuarteSantos8/openGym (AGPL-3.0) | Android APK + iOS App Store + self-host Docker"
      }
    ]
  },
  {
    "id": "gymmane",
    "name": "GymMane",
    "faName": "لاگر آفلاین اندروید — رابط کامل فارسی ⭐",
    "website": "https://github.com/InlitX/GymMane",
    "badge": "manual",
    "badgeText": "ساخت دستی — رابط فارسی",
    "summary": "لاگر GPLv3 از F-Droid: کامل آفلاین، بدون حساب و تبلیغات، نقشهٔ عضلانی بدن، ۵۰۰+ حرکت با انیمیشن — و مهم‌ترین: رابط کاربری فارسی کامل. ایمپورت برنامه ندارد (فقط تاریخچه)، پس روال‌ها را با برگهٔ اختصاصی‌اش در ~۲ دقیقه برای هر روز می‌سازی.",
    "steps": [
      "نصب از F-Droid: f-droid.org/packages/com.gymmane.app (APK arm64-v8a)",
      "فارسی‌سازی: Settings → Language → فارسی؛ واحد کیلوگرم",
      "تب Routines → + → سه روال: Push شنبه / Pull دوشنبه / Legs+Abs چهارشنبه",
      "حرکات را سرچ کن (نام‌های انگلیسی برگه) — ست/تکرار/استراحت/نوت را از برگه بزن",
      "بعد از اولین جلسه، برای هر حرکت Progression بگذار تا وزنهٔ بعدی را خودش بگوید"
    ],
    "notes": [
      "کامل آفلاین و خصوصی: بدون مجوز اینترنت — داده هیچ‌وقت از گوشی بیرون نمی‌رود",
      "ست‌های FST-7 را Superset نزن — ۷ ست عادی با استراحت ۴۵ ثانیه",
      "تاریخچهٔ ورزش را بعداً از openGym/Hevy/Strong/Lyfta/FitNotes هم import می‌کند"
    ],
    "file": "/exports/build-gymmane-machine.txt",
    "variants": [
      {
        "id": "machine",
        "label": "دستگاهی — هفتهٔ ۱ تا ۲",
        "file": "/exports/build-gymmane-machine.txt",
      },
      {
        "id": "free",
        "label": "وزنهٔ آزاد — از هفتهٔ ۳",
        "file": "/exports/build-gymmane.txt",
      }
    ]
  }
];
