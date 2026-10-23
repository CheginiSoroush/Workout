"use client";

import { useState } from "react";
import { PROGRAM, FST7_NOTES, MACHINE_FIRST_NOTE } from "@/lib/program";
import ExerciseCard from "./ExerciseCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Flame, Clock, Wind, Info, Cog, ExternalLink } from "lucide-react";

export default function ProgramTabs() {
  const [tab, setTab] = useState("day1");

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      {/* بنر چرایی شروع دستگاه‌محور */}
      <Card className="mb-6 border-primary/30 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
              <Cog className="w-4.5 h-4.5 text-primary" />
            </div>
            <div className="text-sm leading-7">
              <span className="font-bold">{MACHINE_FIRST_NOTE.title} — </span>
              <span className="text-muted-foreground">{MACHINE_FIRST_NOTE.text}</span>{" "}
              <a
                href={MACHINE_FIRST_NOTE.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                {MACHINE_FIRST_NOTE.linkLabel}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <TabsList className="grid grid-cols-3 w-full max-w-xl mx-auto h-auto p-1">
        {PROGRAM.map((day) => (
          <TabsTrigger
            key={day.id}
            value={day.id}
            className="flex flex-col gap-0.5 py-2 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <span className="text-sm font-bold">{day.weekDay}</span>
            <span className="text-[11px] opacity-80">
              {day.subtitle.split("—")[0].trim()}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {PROGRAM.map((day) => (
        <TabsContent key={day.id} value={day.id} className="mt-6 space-y-5">
          {/* هدر روز */}
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-[300px_1fr]">
              <div className="relative h-40 md:h-auto bg-muted">
                <img
                  src={day.image}
                  alt={day.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent md:bg-gradient-to-l" />
              </div>
              <CardContent className="p-5 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-extrabold">{day.title}</h2>
                  <Badge>{day.weekDay}</Badge>
                  <Badge variant="outline" className="gap-1">
                    <Clock className="w-3 h-3" />
                    {day.duration}
                  </Badge>
                </div>
                <p className="text-sm leading-7 text-foreground/90">
                  <Info className="inline w-4 h-4 text-primary ml-1 -mt-0.5" />
                  {day.why}
                </p>
                <p className="text-sm leading-7 text-muted-foreground flex items-start gap-1.5">
                  <Wind className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <span>کاردیو بعد جلسه: {day.cardio}</span>
                </p>
              </CardContent>
            </div>
          </Card>

          {/* حرکات */}
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pl-1 pr-0.5">
            {day.exercises.map((ex, i) => (
              <ExerciseCard key={ex.id} exercise={ex} index={i} />
            ))}
          </div>
        </TabsContent>
      ))}

      {/* توضیح FST-7 */}
      <Card className="mt-8 border-amber-500/40 glow-emerald">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-lg text-amber-400">
              {FST7_NOTES.title}
            </h3>
          </div>
          <p className="text-sm leading-7 text-muted-foreground">
            {FST7_NOTES.description}
          </p>
          <ul className="grid sm:grid-cols-2 gap-2">
            {FST7_NOTES.rules.map((r, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2"
              >
                <Flame className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-6">{r}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </Tabs>
  );
}
