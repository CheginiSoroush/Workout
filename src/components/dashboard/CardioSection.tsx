"use client";

import {
  BIKE_PLAN,
  BIKE_WHY,
  BIKE_WARNING,
  BIKE_SETUP,
  BIKE_SOURCES,
} from "@/lib/mobility";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bike,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  ExternalLink,
} from "lucide-react";

export default function CardioSection() {
  return (
    <Card className="overflow-hidden border-primary/30 h-full">
      {/* ---------- تصویر ---------- */}
      <div className="relative h-40 sm:h-48">
        <img
          src="/bike.png"
          alt="دوچرخه ثابت در خانه"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        <div className="absolute bottom-3 right-4 left-4 flex items-end justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg drop-shadow">
            <Bike className="w-5 h-5 text-primary shrink-0" />
            دوچرخه ثابت — ۳ جای دقیق در برنامه
          </CardTitle>
          <Badge className="gap-1 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
            لازمه — اضافه شد
          </Badge>
        </div>
      </div>

      <CardContent className="pt-5 space-y-5">
        {/* ---------- ۳ جایگاه ---------- */}
        <div className="space-y-2">
          {BIKE_PLAN.map((slot) => (
            <div
              key={slot.id}
              className={`rounded-xl border p-3.5 ${
                slot.highlight
                  ? "border-primary/50 bg-primary/5"
                  : "border-border/60 bg-card"
              }`}
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-bold text-sm">{slot.title}</span>
                {slot.highlight && (
                  <Badge className="h-5 text-[10px] px-2 rounded-md">
                    جایگزین تردمیل
                  </Badge>
                )}
              </div>
              <div className="text-[11px] text-primary font-bold mt-1.5">
                {slot.when}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {slot.dose}
              </div>
              <p className="text-xs leading-6 text-foreground/90 mt-1.5">
                {slot.howTo}
              </p>
              <p className="text-[11px] leading-5 text-primary/85 mt-1">
                {slot.why}
              </p>
            </div>
          ))}
        </div>

        {/* ---------- چرا دوچرخه؟ ---------- */}
        <div className="rounded-xl border border-border/60 bg-secondary/20 p-4 space-y-2">
          <div className="text-xs font-extrabold text-primary">
            چرا دوچرخه‌ت ارزشمنده؟
          </div>
          {BIKE_WHY.map((r) => (
            <div
              key={r}
              className="flex items-start gap-2 text-xs leading-6"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-1 shrink-0" />
              <span>{r}</span>
            </div>
          ))}
        </div>

        {/* ---------- تنظیم زین ---------- */}
        <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-card p-3.5">
          <Wrench className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs leading-6">{BIKE_SETUP}</p>
        </div>

        {/* ---------- هشدار ---------- */}
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs leading-6 text-amber-600 dark:text-amber-400">
            {BIKE_WARNING}
          </p>
        </div>

        {/* ---------- منابع ---------- */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-border/60">
          {BIKE_SOURCES.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-secondary/30 px-2.5 py-1.5 text-[10px] leading-4 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              {s.label}
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
