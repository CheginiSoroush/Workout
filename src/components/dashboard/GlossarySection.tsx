"use client";

// ============================================================
// GlossarySection — راهنمای بدنسازی و سایت
// بخش ۱: نقشهٔ سایت (هر بخش کجاست و چه‌کار می‌کند)
// بخش ۲: ۳۱ اصطلاح به زبان ساده + مثال از برنامهٔ خود کاربر
// جستجوی زنده + فیلتر دسته‌بندی؛ بدون سرزنش، بدون اصطلاح سنگین
// ============================================================

import { useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Home,
  Info,
  Navigation,
  Play,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import EmptyState from "@/components/app/EmptyState";
import { faNum } from "@/lib/fa";
import { cn } from "@/lib/utils";
import {
  GLOSSARY,
  GLOSSARY_CATS,
  SITE_GUIDE,
  SITE_SHORTCUTS,
  type GlossaryCat,
  type GlossaryTerm,
} from "@/lib/glossary";

// آیکون‌های راهنمای سایت — از روی رشتهٔ دیتا
const SITE_ICONS: Record<string, LucideIcon> = {
  Navigation,
  Home,
  CalendarDays,
  Play,
  TrendingUp,
  BookOpen,
};

function goHash(hash: string) {
  window.location.hash = hash;
}

function openProgramTab(hash: string) {
  // هش تاگل تب را تنظیم می‌کند؛ ProgramView خودش هش را به تب درست می‌برد
  goHash(hash);
}

// ---------- ردیف یک اصطلاح (نسخهٔ همیشه-باز برای حالت جستجو) ----------
function TermOpen({ t }: { t: GlossaryTerm }) {
  return (
    <Card className="hover:border-primary/40 transition-colors">
      <CardContent className="space-y-2.5 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-bold">{t.fa}</h3>
          <Badge
            variant="outline"
            dir="ltr"
            className="border-border/70 bg-muted/50 font-mono text-[10px]"
          >
            {t.en}
          </Badge>
          <Badge className="bg-primary/15 text-[10px] text-primary hover:bg-primary/15">
            {GLOSSARY_CATS[t.cat].short}
          </Badge>
        </div>
        <p className="text-sm leading-7 text-muted-foreground">{t.simple}</p>
        <div className="flex gap-2 rounded-xl border border-primary/30 bg-primary/10 p-3">
          <Target
            className="mt-0.5 h-4 w-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p className="text-xs leading-6">
            <span className="font-extrabold">مثال از برنامهٔ خودت: </span>
            {t.example}
          </p>
        </div>
        {t.tip && (
          <div className="flex gap-2 rounded-xl border border-border bg-muted/40 p-3">
            <Sparkles
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p className="text-xs leading-6 text-muted-foreground">
              <span className="font-bold text-foreground">نکته: </span>
              {t.tip}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------- ردیف یک اصطلاح (آکاردئون) ----------
function TermAccordion({ t }: { t: GlossaryTerm }) {
  return (
    <AccordionItem
      value={t.id}
      className="rounded-xl border border-border bg-card/60 px-4 transition-colors data-[state=open]:border-primary/40"
    >
      <AccordionTrigger className="gap-2 py-3.5 hover:no-underline">
        <span className="flex flex-wrap items-center gap-2 text-start">
          <span className="text-sm font-bold">{t.fa}</span>
          <Badge
            variant="outline"
            dir="ltr"
            className="border-border/70 bg-muted/50 font-mono text-[10px]"
          >
            {t.en}
          </Badge>
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-2.5 pb-4">
        <p className="text-sm leading-7 text-muted-foreground">{t.simple}</p>
        <div className="flex gap-2 rounded-xl border border-primary/30 bg-primary/10 p-3">
          <Target
            className="mt-0.5 h-4 w-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p className="text-xs leading-6">
            <span className="font-extrabold">مثال از برنامهٔ خودت: </span>
            {t.example}
          </p>
        </div>
        {t.tip && (
          <div className="flex gap-2 rounded-xl border border-border bg-muted/40 p-3">
            <Sparkles
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p className="text-xs leading-6 text-muted-foreground">
              <span className="font-bold text-foreground">نکته: </span>
              {t.tip}
            </p>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

export default function GlossarySection() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<GlossaryCat | "all">("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: GLOSSARY.length };
    for (const t of GLOSSARY) c[t.cat] = (c[t.cat] ?? 0) + 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return GLOSSARY.filter(
      (t) =>
        (cat === "all" || t.cat === cat) &&
        (!query ||
          t.fa.toLowerCase().includes(query) ||
          t.en.toLowerCase().includes(query) ||
          t.simple.toLowerCase().includes(query) ||
          t.example.toLowerCase().includes(query))
    );
  }, [q, cat]);

  const searching = q.trim().length > 0;

  return (
    <div className="space-y-5">
      {/* ---------- هدر ---------- */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/15">
          <GraduationCap className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold">راهنمای بدنسازی و سایت</h2>
          <p className="text-xs text-muted-foreground">
            اصطلاحات به زبان ساده — هر کدام با مثال از برنامهٔ خودت
          </p>
        </div>
      </div>

      {/* ---------- بخش ۱: نقشهٔ سایت ---------- */}
      <section aria-label="راهنمای بخش‌های سایت" className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-extrabold">
          <Navigation className="h-4 w-4 text-primary" aria-hidden="true" />
          کجا چی هست؟ — نقشهٔ سایت
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SITE_GUIDE.map((item) => {
            const Icon = SITE_ICONS[item.icon] ?? Info;
            return (
              <Card
                key={item.title}
                className="hover:border-primary/40 transition-colors"
              >
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">
                      <Icon
                        className="h-4 w-4 text-primary"
                        aria-hidden="true"
                      />
                    </span>
                    <h4 className="text-sm font-bold leading-5">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs leading-6 text-muted-foreground">
                    {item.text}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* میان‌برهای سریع */}
        <Card>
          <CardContent className="space-y-2.5 p-4">
            <p className="text-xs font-bold">
              میان‌برهای سریع — برو مستقیم به بخش:
            </p>
            <div className="flex flex-wrap gap-2">
              {SITE_SHORTCUTS.map((s) => (
                <button
                  key={s.hash}
                  type="button"
                  onClick={() => openProgramTab(s.hash)}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-[11px] font-bold transition hover:border-primary/50 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                  aria-label={`برو به ${s.label}`}
                >
                  <span dir="ltr" className="font-mono text-primary">
                    {s.hash}
                  </span>
                  {s.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] leading-5 text-muted-foreground">
              نکته: همهٔ عکس‌ها و ویدیوهای آموزش روی خود سایت ذخیره‌اند — بدون
              اینترنت هم کار می‌کنند و سریع لود می‌شوند.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ---------- بخش ۲: اصطلاحات ---------- */}
      <section aria-label="اصطلاحات بدنسازی" className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="flex items-center gap-2 text-sm font-extrabold">
            <GraduationCap className="h-4 w-4 text-primary" aria-hidden="true" />
            اصطلاحات باشگاه — به زبان ساده
          </h3>
          <Badge
            variant="outline"
            className="w-fit border-border/70 bg-muted/40 text-[11px]"
          >
            {faNum(GLOSSARY.length)} اصطلاح
          </Badge>
        </div>

        {/* جستجو */}
        <div className="relative">
          <Search
            className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="search"
            inputMode="search"
            placeholder="جستجو… مثلاً: ست، RPE، کراتین، rep"
            aria-label="جستجو در اصطلاحات"
            className="h-11 rounded-xl pe-10"
          />
        </div>

        {/* چیپ‌های دسته‌بندی */}
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="فیلتر دسته‌بندی اصطلاحات"
        >
          {(["all", ...(Object.keys(GLOSSARY_CATS) as GlossaryCat[])] as const).map(
            (c) => {
              const active = cat === c;
              const label =
                c === "all" ? "همه" : GLOSSARY_CATS[c as GlossaryCat].label;
              return (
                <Button
                  key={c}
                  type="button"
                  variant={active ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setCat(c)}
                  aria-pressed={active}
                  className={cn(
                    "h-9 min-h-9 rounded-full px-3.5 text-xs font-bold",
                    !active && "bg-muted/50 text-foreground hover:bg-muted"
                  )}
                >
                  {label}
                  <span
                    className={cn(
                      "ms-1 rounded-full px-1.5 text-[10px]",
                      active
                        ? "bg-primary-foreground/20"
                        : "bg-muted-foreground/15"
                    )}
                  >
                    {faNum(counts[c] ?? 0)}
                  </span>
                </Button>
              );
            }
          )}
        </div>

        {/* لیست اصطلاحات — جستجو: باز؛ عادی: آکاردئون */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="چیزی پیدا نشد"
            description="با کلمهٔ دیگری جستجو کن یا دسته‌بندی را روی «همه» بگذار."
          >
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full"
              onClick={() => {
                setQ("");
                setCat("all");
              }}
            >
              پاک کردن جستجو
            </Button>
          </EmptyState>
        ) : searching ? (
          <div className="space-y-3" aria-live="polite">
            {filtered.map((t) => (
              <TermOpen key={t.id} t={t} />
            ))}
          </div>
        ) : (
          <Accordion
            type="single"
            collapsible
            defaultValue="rep"
            className="space-y-2.5"
          >
            {filtered.map((t) => (
              <TermAccordion key={t.id} t={t} />
            ))}
          </Accordion>
        )}
      </section>
    </div>
  );
}
