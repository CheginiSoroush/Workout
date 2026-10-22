"use client";

import { WEEK_SCHEDULE } from "@/lib/program";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Footprints, CalendarDays } from "lucide-react";

const JS_DAY_MAP: Record<string, number> = {
  شنبه: 6,
  یکشنبه: 0,
  دوشنبه: 1,
  "سه‌شنبه": 2,
  چهارشنبه: 3,
  پنجشنبه: 4,
  جمعه: 5,
};

export default function ScheduleStrip() {
  const today = new Date().getDay();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          تقویم هفتگی
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {WEEK_SCHEDULE.map((d) => {
            const isToday = JS_DAY_MAP[d.day] === today;
            return (
              <div
                key={d.day}
                className={`rounded-xl border p-3 transition-all ${
                  isToday
                    ? "border-primary bg-primary/10 glow-emerald"
                    : d.type === "workout"
                    ? "border-border bg-secondary/40"
                    : "border-border/60 bg-secondary/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{d.day}</span>
                  {d.type === "workout" ? (
                    <Dumbbell
                      className={`w-4 h-4 ${
                        isToday ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  ) : (
                    <Footprints className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div
                  className={`text-xs mt-1.5 leading-5 ${
                    d.type === "workout"
                      ? "text-primary font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  {d.label}
                </div>
                {isToday && (
                  <div className="text-[10px] text-primary font-bold mt-1">
                    ← امروز
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
