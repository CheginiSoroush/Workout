"use client";

// ============================================================
// برنامهٔ روزهای استراحت — روزبه‌روز و متصل به تمرین روز قبل
// («چون دیروز پرس زدی، امروز سینه کشش می‌خوان»)
// امروز هایلایت می‌شود؛ آکاردئون روزِ امروز خودکار باز است.
// ============================================================

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BedDouble,
  Bike,
  CheckCircle2,
  Dumbbell,
  Footprints,
  MoonStar,
  PersonStanding,
} from "lucide-react";
import { STRETCH_ROUTINE, type StretchMove } from "@/lib/mobility";
import { REST_DAY_PLANS, type RestDayPlan } from "@/lib/restDays";
import { getStretchMedia } from "@/lib/media";
import { faNum } from "@/lib/fa";
import { useToday } from "@/components/app/home/useTodaySession";
import MotionMedia from "@/components/app/media/MotionMedia";

/** حرکت کشش از روتین اصلی — با گارد اگر شناسه نبود */
function stretchById(id: string): StretchMove | undefined {
  return STRETCH_ROUTINE.find((m) => m.id === id);
}

function StretchRow({ move, reason }: { move: StretchMove; reason: string }) {
  return (
    <div className="flex gap-2.5 rounded-xl border border-border/60 bg-card p-2.5">
      {move.photo && (
        <MotionMedia
          compact
          photo={move.photo}
          alt={`فرم صحیح ${move.faName}`}
          media={getStretchMedia(move.id)}
          className="h-16 w-16 shrink-0 rounded-lg"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-xs font-bold">{move.faName}</span>
          <Badge
            variant="secondary"
            className="h-5 rounded-md px-2 text-[10px]"
          >
            {move.duration}
          </Badge>
        </div>
        <p className="mt-0.5 text-[11px] font-bold leading-5 text-primary/90">
          {reason}
        </p>
        <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
          {move.howTo}
        </p>
      </div>
    </div>
  );
}

function RestDayCard({ plan, isToday }: { plan: RestDayPlan; isToday: boolean }) {
  const Icon = plan.icon;
  const validStretches = plan.stretches
    .map((s) => ({ rec: s, move: stretchById(s.id) }))
    .filter((x): x is { rec: (typeof plan.stretches)[number]; move: StretchMove } =>
      Boolean(x.move)
    );

  return (
    <AccordionItem
      value={plan.id}
      className={`rounded-2xl border px-4 transition-all ${
        isToday
          ? "border-primary/40 bg-primary/10 glow-emerald"
          : "border-border/70 bg-secondary/20"
      }`}
    >
      <AccordionTrigger className="py-4 hover:no-underline">
        <span className="flex min-w-0 flex-1 items-center gap-2.5">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
              isToday
                ? "border-primary/30 bg-primary/15"
                : "border-border bg-background/60"
            }`}
          >
            <Icon
              className={`h-4 w-4 ${isToday ? "text-primary" : "text-muted-foreground"}`}
              aria-hidden="true"
            />
          </span>
          <span className="min-w-0 text-right">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-sm font-extrabold">{plan.weekDay}</span>
              <span
                className={`text-[11px] font-bold ${
                  isToday ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {plan.typeLabel}
              </span>
              {isToday && (
                <Badge className="h-5 rounded-md px-2 text-[10px]">امروز</Badge>
              )}
            </span>
            <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
              {plan.activity}
            </span>
          </span>
        </span>
      </AccordionTrigger>

      <AccordionContent className="space-y-3 pb-4">
        {/* چرا امروز؟ — اتصال به تمرین روز قبل */}
        {plan.prevWorkout ? (
          <div className="rounded-xl border border-border/60 bg-card p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-primary">
              <Dumbbell className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              دیروز: {plan.prevWorkout}
            </p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              {plan.why}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card p-3">
            <p className="mt-0.5 text-xs leading-6 text-muted-foreground">
              {plan.why}
            </p>
          </div>
        )}

        {/* فعالیت اصلی */}
        <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-card p-3">
          <Footprints
            className="mt-0.5 h-4 w-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-xs font-extrabold">{plan.activity}</p>
            <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
              {plan.activityHint}
            </p>
          </div>
        </div>

        {/* دوچرخهٔ اختیاری */}
        {plan.bike && (
          <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-card p-3">
            <Bike className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <p className="min-w-0 text-[11px] leading-6 text-muted-foreground">
              {plan.bike}
            </p>
          </div>
        )}

        {/* کشش‌های پیشنهادی — متصل به تمرین دیروز */}
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs font-extrabold">
            <PersonStanding
              className="h-4 w-4 text-primary"
              aria-hidden="true"
            />
            کشش‌های پیشنهادی امروز ({faNum(validStretches.length)} حرکت)
          </p>
          {validStretches.map(({ rec, move }) => (
            <StretchRow key={rec.id} move={move} reason={rec.reason} />
          ))}
        </div>

        {/* وظایف ویژهٔ روز */}
        {plan.prepTasks.length > 0 && (
          <div className="rounded-xl border border-primary/25 bg-primary/5 p-3 space-y-1.5">
            <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-primary">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              تکالیف {plan.type === "full-rest" ? "امروز" : "آماده‌سازی"}
            </p>
            {plan.prepTasks.map((t) => (
              <p key={t} className="text-[11px] leading-6 text-muted-foreground">
                • {t}
              </p>
            ))}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

export default function RestDaySection() {
  const { jsDay, hydrated } = useToday();
  const todayPlan = hydrated
    ? REST_DAY_PLANS.find((p) => p.jsDay === jsDay)
    : undefined;

  return (
    <section aria-label="برنامهٔ روزهای استراحت">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-base font-black">
          <MoonStar className="h-5 w-5 text-primary" aria-hidden="true" />
          روزهای استراحت — برنامهٔ روزبه‌روز
        </h3>
        <Badge variant="secondary" className="shrink-0 rounded-lg">
          <BedDouble className="h-3 w-3" aria-hidden="true" />
          ۴ روز
        </Badge>
      </div>
      <p className="mb-3 text-xs leading-6 text-muted-foreground">
        استراحت هم برنامه دارد: کشش هر روز از تمرینِ روز قبل می‌آید — «چون دیروز
        پرس زدی، امروز سینه کشش می‌خوان». عضله همین روزها ساخته می‌شود.
      </p>

      {/* تا hydrate: اسکلت — روزِ امروز خودکار باز می‌شود (الگو مشابه HomeView) */}
      {!hydrated ? (
        <div className="space-y-2.5">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      ) : (
        <Accordion
          type="single"
          collapsible
          defaultValue={todayPlan?.id ?? "sun"}
          className="space-y-2.5"
        >
          {REST_DAY_PLANS.map((plan) => (
            <RestDayCard
              key={plan.id}
              plan={plan}
              isToday={plan.id === todayPlan?.id}
            />
          ))}
        </Accordion>
      )}
    </section>
  );
}
