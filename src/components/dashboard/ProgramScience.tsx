"use client";

// ============================================================
// علم برنامه و انتظارات واقع‌بینانه — سه لایهٔ علم، تایم‌لاین ماه‌به‌ماه،
// و جدول پوشش عضلات هفتگی (PPL سه‌روزه — نه فول‌بادیِ هر جلسه)
// ============================================================

import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Flame,
  ListOrdered,
  Microscope,
  Repeat,
  Scale,
  Sparkles,
  Timer,
  TrendingUp,
  XCircle,
  type LucideIcon,
} from "lucide-react";

interface SourceLink {
  label: string;
  url: string;
}

const PROVEN_CORE: { title: string; text: string; sources: SourceLink[] }[] = [
  {
    title: "حجم ۱۰–۲۰ ست در هفته برای هر عضله",
    text: "بیشترین رشد عضلانی در این بازه دیده می‌شود؛ برنامهٔ تو هر عضله را ۶–۱۷ ست مستقیم می‌گیرد — دقیقاً ناحیهٔ مؤثر برای تازه‌کار.",
    sources: [
      {
        label: "Schoenfeld — متاآنالیز حجم (PMC)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6950543",
      },
    ],
  },
  {
    title: "چندمفصلی اول با RPE ۷–۸",
    text: "تنش مکانیکی، موتور اصلی رشد است؛ پرس و بارفیکس اول جلسه با ۱–۳ تکرار در مخزن.",
    sources: [
      {
        label: "Schoenfeld 2010 — مکانیسم‌های رشد (PMID)",
        url: "https://pubmed.ncbi.nlm.nih.gov/20802478/",
      },
    ],
  },
  {
    title: "پیشروی دوگانه + بار افزایشی",
    text: "تا سقف تکرار با فرم تمیز → +۲.۵ کیلو (بالاتنه) یا +۵ کیلو (پا) → برگشت به کف تکرار. بدون پیشروی، هیچ برنامه‌ای جواب نمی‌دهد.",
    sources: [],
  },
  {
    title: "پروتئین ۲ گرم × وزن هدف (~۱۷۰ گرم)",
    text: "در کسری کالری تا ۲.۲ گرم/کیلو توصیه می‌شود؛ اشباع رشد حدود ۱.۶.",
    sources: [
      {
        label: "Morton 2018 — متاآنالیز پروتئین (PMID)",
        url: "https://pubmed.ncbi.nlm.nih.gov/28675001/",
      },
    ],
  },
  {
    title: "کسری ۵۰۰ کالری + تمرین مقاومتی",
    text: "چربی‌سوزی با حفظ عضله — برای تازه‌کار حتی امکان ساخت هم‌زمان عضله و سوزاندن چربی (recomposition).",
    sources: [
      {
        label: "Barakat 2020 — بازترکیب بدن (PMID)",
        url: "https://pubmed.ncbi.nlm.nih.gov/32383122/",
      },
    ],
  },
  {
    title: "کراتین ۳–۵ گرم روزانه",
    text: "قدرت و تودهٔ بدون چربی بیشتر؛ تازه‌کارها در متاآنالیز ۲۰۲۵ هم پاسخ دادند.",
    sources: [],
  },
  {
    title: "شروع دستگاه‌محور برای تازه‌کار",
    text: "رشد دستگاه = وزنهٔ آزاد؛ یادگیری سریع‌تر و امنیت بدون اسپاتر.",
    sources: [
      {
        label: "Haugen 2023 — متاآنالیز دستگاه/آزاد (PMC)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10426227",
      },
    ],
  },
];

const TIMELINE: { when: string; what: string }[] = [
  {
    when: "هفته ۱–۲",
    what: "قدرت بالا می‌رود بدون رشد عضله (سازگاری عصبی)؛ +۱ تا ۱.۵ کیلو وزن از آب کراتین — چربی نیست.",
  },
  {
    when: "هفته ۴–۸",
    what: "اولین تفاوت دیدنی: شانه گردتر، بالاسینه سفت‌تر؛ جهش محسوس وزنه‌ها — سریع‌ترین دورهٔ زندگی یک تازه‌کار.",
  },
  {
    when: "هفته ۸–۱۲",
    what: "لباس‌ها فرق می‌کنند؛ بارفیکس احتمالاً از ۰–۲ به ۵–۸ تکرار تمیز می‌رسد.",
  },
  {
    when: "ماه ۴–۶",
    what: "بدن جاافتاده‌تر می‌شود؛ وزنه‌ها به‌جای جهش، رشد پیوسته دارند — وقت آشنایی با RPE و Rest-Pause برای شکستن فلات‌هاست.",
  },
  {
    when: "ماه ۶+",
    what: "شروع فاز شکل‌دهی: سوییچ کامل وزنهٔ آزاد و احتمالاً PPL چرخشی ۴ روزه (هر عضله ~۱.۳ بار در هفته).",
  },
];

interface CoverageRow {
  muscle: string;
  sets: string;
  how: "direct" | "enough" | "indirect";
  note: string;
}

const COVERAGE: CoverageRow[] = [
  {
    muscle: "سینه (تأکید بالاسینه)",
    sets: "۱۰",
    how: "direct",
    note: "پرس سینه ۴ + بالاسینه ۳ + کراس‌اور ۳",
  },
  {
    muscle: "سرشانه جانبی — کلید V",
    sets: "۱۰",
    how: "direct",
    note: "پرس سرشانه ۳ + نشر جانب FST-7 ۷",
  },
  {
    muscle: "سرشانه خلفی",
    sets: "۶",
    how: "direct",
    note: "فیس‌پول ۳ + پک‌دک معکوس ۳",
  },
  {
    muscle: "پشت‌بازو",
    sets: "~۱۳",
    how: "direct",
    note: "پوش‌داون ۳ + سهم پرس‌های سینه و سرشانه",
  },
  {
    muscle: "لت (عرض پشت)",
    sets: "۱۴+",
    how: "direct",
    note: "بارفیکس ۴ + لت ۳ + پول‌اور FST-7 ۷",
  },
  {
    muscle: "تراپز میانی و پشت میانی",
    sets: "۹",
    how: "direct",
    note: "زیربغل خم ۳ + فیس‌پول ۳ + پک‌دک معکوس ۳ — حالا مستقیم",
  },
  {
    muscle: "جلوبازو",
    sets: "۳+",
    how: "enough",
    note: "مستقیم ۳ + غیرمستقیم از همهٔ پول‌ها — برای تازه‌کار کافی",
  },
  {
    muscle: "چهارسر",
    sets: "۷",
    how: "direct",
    note: "پرس پا ۴ + اسکات بلغاری ۳",
  },
  {
    muscle: "همسترینگ",
    sets: "۶",
    how: "direct",
    note: "ددلیفت رومانیایی ۳ + پشت‌پا خوابیده ۳",
  },
  {
    muscle: "باسن",
    sets: "غیرمستقیم",
    how: "enough",
    note: "از RDL، اسکات بلغاری و پرس پا — در کسری کالری کافی؛ اگر خواستی Hip Thrust اضافه می‌شود",
  },
  { muscle: "ساق", sets: "۴", how: "direct", note: "ساق ایستاده" },
  {
    muscle: "شکم (بالا و پایین)",
    sets: "۱۰",
    how: "direct",
    note: "بالانش آویزان ۳ + کرانچ FST-7 ۷",
  },
  {
    muscle: "ساعد / مورب‌ها / گردن",
    sets: "غیرمستقیم",
    how: "indirect",
    note: "گریپ از بارفیکس و پول‌ها؛ مورب‌ها در بالانش؛ اگر خواستی آچارگرد مچ آخر جلسهٔ Pull اضافه می‌شود",
  },
];

const HOW_LABEL: Record<
  CoverageRow["how"],
  { label: string; className: string; icon: LucideIcon }
> = {
  direct: {
    label: "مستقیم",
    className: "bg-primary/15 text-primary border-primary/30",
    icon: CheckCircle2,
  },
  enough: {
    label: "کافی",
    className: "bg-secondary/60 text-foreground border-border",
    icon: Sparkles,
  },
  indirect: {
    label: "غیرمستقیم",
    className: "bg-secondary/40 text-muted-foreground border-border",
    icon: Timer,
  },
};

export default function ProgramScience() {
  return (
    <section aria-label="علم برنامه و انتظارات واقع‌بینانه" className="space-y-5">
      {/* ---------- سرتیتر ---------- */}
      <div className="rounded-2xl border border-border bg-card/60 p-4">
        <h3 className="flex items-center gap-2 text-base font-black">
          <Microscope className="h-5 w-5 text-primary" aria-hidden="true" />
          علم برنامه و انتظارات واقع‌بینانه
        </h3>
        <p className="mt-1 text-xs leading-6 text-muted-foreground">
          سه لایهٔ علم پشت برنامه + انتظار ماه‌به‌ماه اگر وفادار بمانی + پوشش
          عضلات هفته. اعداد واقع‌بینانه‌اند، نه تبلیغاتی.
        </p>
      </div>

      {/* ---------- لایهٔ ۱: هستهٔ اثبات‌شده ---------- */}
      <div className="rounded-2xl border border-border/70 bg-card/60 p-4 space-y-2.5">
        <h4 className="flex items-center gap-2 text-sm font-extrabold">
          <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
          لایهٔ ۱ — هستهٔ اثبات‌شده (۹۰٪ نتیجه از این می‌آید)
        </h4>
        {PROVEN_CORE.map((c) => (
          <div
            key={c.title}
            className="rounded-xl border border-border/60 bg-secondary/25 p-3"
          >
            <p className="text-xs font-extrabold">{c.title}</p>
            <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
              {c.text}
            </p>
            {c.sources.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {c.sources.map((s) => (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-border/60 bg-background/50 px-2 py-1 text-[10px] text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ---------- لایهٔ ۲ و ۳ ---------- */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <h4 className="flex items-center gap-2 text-sm font-extrabold">
            <Flame className="h-4 w-4 text-amber-500" aria-hidden="true" />
            لایهٔ ۲ — خودِ FST-7، صادقانه
          </h4>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            ایدهٔ هانی رامبد: ۷ ست پایانی با استراحت ۳۰–۴۵ ثانیه → پامپ حداکثری →
            کشیده‌شدن فاسیا (پوشش عضله) → فضای رشد بیشتر.{" "}
            <span className="font-bold text-foreground">
              آنچه اثبات‌شده: استرس متابولیک (پامپ) یکی از سه مکانیسم رشد است.
            </span>{" "}
            آنچه هنوز فرضیه است: مکانیسم «کشیدن فاسیا». یعنی FST-7 گیلاسِ روی
            کیک است — خود کیک، لایهٔ ۱ است.
          </p>
        </div>
        <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4">
          <h4 className="flex items-center gap-2 text-sm font-extrabold">
            <Scale className="h-4 w-4 text-primary" aria-hidden="true" />
            لایهٔ ۳ — شخصی‌سازی برای بدن تو
          </h4>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            جلسه زیر ۷۵ دقیقه + RPE سقف ۹ + دیلود هر ۶–۸ هفته → مدیریت استرس
            تمرینی. آب ۳–۳.۵ لیتر → ایمنی در سالن گرم. شنا و
            پیاده‌روی به‌جای HIIT روزانه.
          </p>
        </div>
      </div>

      {/* ---------- ترتیب ست‌ها: مستقیم یا چرخشی؟ ---------- */}
      <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
        <h4 className="flex items-center gap-2 text-sm font-extrabold">
          <ListOrdered className="h-4 w-4 text-primary" aria-hidden="true" />
          ست‌ها را چطور برویم؟ هر حرکت تا آخر، یا چرخشی؟
        </h4>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          <span className="font-bold text-foreground">
            هر حرکت را تا ست آخر برو (Straight Sets)
          </span>{" "}
          — فقط فینیشرهای FST-7 استثنا هستند که خودشان چرخش درون یک حرکت‌اند.
        </p>
        <div className="mt-3 space-y-2">
          <div className="rounded-xl border border-primary/25 bg-primary/5 p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-primary">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              مستقیم — انتخاب برنامه
            </p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              حرکات اصلی (پرس، بارفیکس، زیربغل خم) بعد از هر ست به ۲–۳ دقیقه
              استراحت کامل نیاز دارند تا ATP و سیستم عصبی بازیابی شود؛ نتیجه:
              تکرارهای بیشتر با وزنهٔ سنگین‌تر و فرم تمیزتر = تنش مکانیکی بیشتر =
              رشد بیشتر. پژوهش نشان داد استراحت ۲–۳ دقیقه در برابر ۱ دقیقه، هم
              قدرت و هم هیپرتروفی را بیشتر می‌کند.
            </p>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-500">
              <Repeat className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              چرخشی (یک ست از هر حرکت پشت‌سرهم) — نه برای هدف تو
            </p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              کالری بیشتری می‌سوزاند و زمان را کم می‌کند، ولی استراحت ناکافی یعنی
              افت بار و تکرار در ست‌های بعدی — برای چربی‌سوزی و استقامت خوب است،
              برای عضله‌سازی در کسری کالری بهینه نیست. اگر روزی مجبور شدی (باشگاه
              شلوغ یا وقت کم)، فقط دو حرکت ایزولهٔ آخر جلسه را جفت کن — نوت
              «سوپرست با جلوبازو» روی پک‌دک معکوس دقیقاً برای همین است.
            </p>
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <a
            href="https://pubmed.ncbi.nlm.nih.gov/?term=Schoenfeld+longer+inter-set+rest+periods+muscle+strength+hypertrophy"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border/60 bg-background/50 px-2 py-1 text-[10px] text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          >
            Schoenfeld 2016 — طول استراحت بین ست‌ها
          </a>
          <a
            href="https://pubmed.ncbi.nlm.nih.gov/?term=Iversen+No+time+to+lift+time-efficient+resistance+training"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border/60 bg-background/50 px-2 py-1 text-[10px] text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          >
            Iversen 2021 — برنامه‌های کم‌زمان
          </a>
        </div>
      </div>

      {/* ---------- تایم‌لاین انتظارات ---------- */}
      <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
        <h4 className="flex items-center gap-2 text-sm font-extrabold">
          <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
          اگر وفادار بمانی، چه انتظاری داشته باشی؟
        </h4>
        <div className="mt-3 space-y-2">
          {TIMELINE.map((t) => (
            <div
              key={t.when}
              className="flex flex-col gap-1 rounded-xl border border-border/60 bg-secondary/25 p-3 sm:flex-row sm:items-start sm:gap-3"
            >
              <Badge className="h-6 shrink-0 rounded-lg px-2.5 text-[11px]">
                {t.when}
              </Badge>
              <p className="text-xs leading-6 text-muted-foreground">{t.what}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-destructive">
            <XCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            چیزی که نباید انتظار داشته باشی
          </p>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">
            فیزیک استیج‌آماده یا تغییر شب‌به‌شب — FST-7 سیستم قهرمان‌های پرو
            است؛ برای تو ۹۰٪ نتیجه از وفاداری + پیشروی + پروتئین + خواب می‌آید.
            نیمی از برنامه‌ها در ۳ ماه اول رها می‌شوند — کسی که می‌ماند، برندهٔ
            کل بازی است.
          </p>
        </div>
      </div>

      {/* ---------- پوشش عضلات هفتگی ---------- */}
      <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
        <h4 className="flex items-center gap-2 text-sm font-extrabold">
          <Microscope className="h-4 w-4 text-primary" aria-hidden="true" />
          پوشش عضلات در هفته — فول‌بادی نیست، Split است
        </h4>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          این برنامه <span className="font-bold text-foreground">Push/Pull/Legs</span>{" "}
          سه‌روزه است: هر جلسه نیمی از بدن و پوشش کامل بدن در طول هفته. پژوهش
          فرکانس می‌گوید تقسیم همین حجم در ۲ بار هفته کمی بهتر است — ولی برای
          سال اول، وفاداری مهم‌تر از فرکانس است؛ از ماه ۳–۴ می‌توانیم ارتقا
          دهیم.
        </p>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[420px] border-separate border-spacing-y-1.5 text-right">
            <thead>
              <tr className="text-[10px] text-muted-foreground">
                <th className="px-2 font-bold">عضله</th>
                <th className="px-2 font-bold">ست مستقیم/هفته</th>
                <th className="px-2 font-bold">وضعیت</th>
                <th className="px-2 font-bold">از کجا؟</th>
              </tr>
            </thead>
            <tbody>
              {COVERAGE.map((row) => {
                const how = HOW_LABEL[row.how];
                const Icon = how.icon;
                return (
                  <tr key={row.muscle} className="bg-secondary/25">
                    <td className="rounded-r-xl px-2 py-2.5 text-xs font-bold first:rounded-r-xl last:rounded-l-xl">
                      {row.muscle}
                    </td>
                    <td className="px-2 py-2.5 text-xs font-extrabold text-primary">
                      {row.sets}
                    </td>
                    <td className="px-2 py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${how.className}`}
                      >
                        <Icon className="h-3 w-3" aria-hidden="true" />
                        {how.label}
                      </span>
                    </td>
                    <td className="rounded-l-xl px-2 py-2.5 text-[11px] leading-5 text-muted-foreground">
                      {row.note}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-3 flex items-start gap-1.5 rounded-xl border border-primary/25 bg-primary/5 p-3 text-[11px] leading-6">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
          <span>
            تراپز میانی حالا <span className="font-bold text-foreground">۹ ست مستقیم</span> در
            هفته دارد (زیربغل خم + فیس‌پول + پک‌دک معکوس) — هم‌حجم‌بودنِ این سه،
            پشتِ قوس‌دار و قامت باز را می‌سازد.
          </span>
        </p>
      </div>
    </section>
  );
}
