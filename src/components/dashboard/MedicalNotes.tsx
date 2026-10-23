"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MEDICAL_NOTES } from "@/lib/program";
import { HeartPulse, AlertTriangle, Info, Smile, Stethoscope } from "lucide-react";

const LEVEL_STYLE = {
  important: {
    border: "border-amber-500/50",
    bg: "bg-amber-500/10",
    icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  },
  info: {
    border: "border-sky-500/40",
    bg: "bg-sky-500/10",
    icon: <Info className="w-5 h-5 text-sky-400" />,
  },
  good: {
    border: "border-primary/50",
    bg: "bg-primary/10",
    icon: <Smile className="w-5 h-5 text-primary" />,
  },
};

export default function MedicalNotes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-3">
        {MEDICAL_NOTES.map((n, i) => {
          const s = LEVEL_STYLE[n.level];
          return (
            <div
              key={i}
              className={`rounded-xl border ${s.border} ${s.bg} p-4 space-y-1.5`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {s.icon}
                {n.title}
              </div>
              <p className="text-sm leading-7 text-muted-foreground">{n.text}</p>
            </div>
          );
        })}
        <div className="rounded-xl border border-border bg-secondary/40 p-4 sm:col-span-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Stethoscope className="w-4 h-4 shrink-0" />
          این داشبورد جایگزین نظر پزشک نیست — هر تغییر مهم در برنامه رو با پزشکت هماهنگ کن.
        </div>
      </CardContent>
    </Card>
  );
}
