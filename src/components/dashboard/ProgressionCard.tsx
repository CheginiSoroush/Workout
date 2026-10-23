"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROGRESSION_RULES } from "@/lib/program";
import { TrendingUp, Gauge, CalendarClock, Timer, Sparkles } from "lucide-react";

const ICONS: Record<string, React.ReactNode> = {
  trending: <TrendingUp className="w-5 h-5 text-primary" />,
  gauge: <Gauge className="w-5 h-5 text-primary" />,
  calendar: <CalendarClock className="w-5 h-5 text-primary" />,
  timer: <Timer className="w-5 h-5 text-primary" />,
};

export default function ProgressionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          قواعد پیشرفت — چطور قوی‌تر شیم؟
        </CardTitle>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-3">
        {PROGRESSION_RULES.map((r, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-secondary/40 p-4 space-y-1.5"
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {ICONS[r.icon]}
              {r.title}
            </div>
            <p className="text-sm leading-7 text-muted-foreground">{r.text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
