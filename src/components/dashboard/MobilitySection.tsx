"use client";

import {
  STRETCH_ROUTINE,
  STRETCH_WHEN,
  STRETCH_RULES,
  STRETCH_SOURCES,
  type StretchWhen,
} from "@/lib/mobility";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PersonStanding,
  Clock,
  Dumbbell,
  Moon,
  Timer,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

const WHEN_ICONS: Record<StretchWhen["icon"], typeof Dumbbell> = {
  dumbbell: Dumbbell,
  moon: Moon,
  timer: Timer,
};

const faNum = (n: number) => n.toLocaleString("fa-IR");

export default function MobilitySection() {
  return (
    <Card className="overflow-hidden border-primary/30 h-full">
      {/* ---------- تصویر ---------- */}
      <div className="relative h-40 sm:h-48">
        <img
          src="/stretch.png"
          alt="کشش روزانه روی مت در خانه"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        <div className="absolute bottom-3 right-4 left-4 flex items-end justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg drop-shadow">
            <PersonStanding className="w-5 h-5 text-primary shrink-0" />
            کشش روزانه — کمر و انعطاف
          </CardTitle>
          <Badge className="gap-1 shrink-0">
            <Clock className="w-3.5 h-3.5" />
            ~۱۰ دقیقه / هر روز
          </Badge>
        </div>
      </div>

      <CardContent className="pt-5 space-y-5">
        {/* ---------- کِی؟ ---------- */}
        <div className="grid sm:grid-cols-3 gap-2">
          {STRETCH_WHEN.map((w) => {
            const Icon = WHEN_ICONS[w.icon];
            return (
              <div
                key={w.title}
                className="rounded-xl border border-border/70 bg-secondary/30 p-3"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {w.title}
                </div>
                <p className="text-[11px] leading-5 text-muted-foreground">
                  {w.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* ---------- روتین ۸ حرکته ---------- */}
        <div className="space-y-2">
          {STRETCH_ROUTINE.map((m, i) => (
            <div
              key={m.id}
              className="rounded-xl border border-border/60 bg-card p-3.5 flex gap-3"
            >
              <div className="shrink-0 w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-extrabold text-primary">
                {faNum(i + 1)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-bold text-sm">{m.faName}</span>
                  <span
                    className="text-[10px] text-muted-foreground"
                    dir="ltr"
                  >
                    {m.enName}
                  </span>
                  <Badge
                    variant="secondary"
                    className="h-5 text-[10px] px-2 rounded-md"
                  >
                    {m.duration}
                  </Badge>
                  {m.optional && (
                    <Badge
                      variant="outline"
                      className="h-5 text-[10px] px-2 rounded-md"
                    >
                      اختیاری
                    </Badge>
                  )}
                </div>
                <p className="text-xs leading-6 text-foreground/90 mt-1.5">
                  {m.howTo}
                </p>
                <p className="text-[11px] leading-5 text-primary/85 mt-1">
                  {m.why}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- قوانین ---------- */}
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 space-y-2">
          <div className="text-xs font-extrabold text-primary">
            قوانین کشش (پشتوانه علمی)
          </div>
          {STRETCH_RULES.map((r) => (
            <div
              key={r}
              className="flex items-start gap-2 text-xs leading-6"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-1 shrink-0" />
              <span>{r}</span>
            </div>
          ))}
        </div>

        {/* ---------- منابع ---------- */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-border/60">
          {STRETCH_SOURCES.map((s) => (
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
