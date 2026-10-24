"use client";

import { useState } from "react";
import { Exercise, ExerciseMode, ExerciseVariant } from "@/lib/program";
import { getExerciseMedia, getVariantPhoto } from "@/lib/media";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import MotionMedia from "@/components/app/media/MotionMedia";
import {
  CheckCircle2,
  XCircle,
  Repeat,
  Timer,
  Dumbbell,
  Gauge,
  Flame,
  Target,
  Cog,
  Lightbulb,
  Sparkles,
} from "lucide-react";

export default function ExerciseCard({
  exercise,
  index,
}: {
  exercise: Exercise;
  index: number;
}) {
  const baseMode: ExerciseMode = exercise.baseMode ?? "machine";
  const startMode: ExerciseMode = exercise.startMode ?? baseMode;
  const [mode, setMode] = useState<ExerciseMode>(startMode);

  // نسخه‌های موجود برای نمایش
  const machineVersion: ExerciseVariant | null =
    baseMode === "machine"
      ? { faName: exercise.faName, hevyName: exercise.hevyName, note: "" }
      : exercise.machineAlt ?? null;
  const freeVersion: ExerciseVariant | null =
    baseMode === "free"
      ? { faName: exercise.faName, hevyName: exercise.hevyName, note: "" }
      : exercise.freeAlt ?? null;

  const hasToggle = !!(exercise.machineAlt || exercise.freeAlt);
  const current = mode === "machine" ? machineVersion : freeVersion;
  const isBase = mode === baseMode;
  const optionClass = (active: boolean) =>
    `inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-bold transition-all cursor-pointer ${
      active
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <Card
      className={`overflow-hidden transition-all hover:border-primary/40 ${
        exercise.fst7 ? "border-amber-500/40" : ""
      }`}
    >
      <div className="grid md:grid-cols-[240px_1fr]">
        {/* رسانه — فلیپ‌بوک مرحله‌به‌مرحله + ویدیوی لوکال (گارد فایل مفقود داخل MotionMedia) */}
        <div className="relative h-44 md:h-full min-h-44 bg-muted">
          <MotionMedia
            key={mode}
            photo={getVariantPhoto(exercise.id, mode) ?? exercise.image}
            fallbackPhoto={exercise.image}
            alt={`نحوه اجرای ${current?.faName ?? exercise.faName}`}
            media={getExerciseMedia(exercise.id, mode)}
            className="h-full rounded-none border-0"
          />
          {exercise.fst7 && (
            <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-amber-500 text-amber-950 text-xs font-bold px-2.5 py-1 shadow-lg">
              <Flame className="w-3.5 h-3.5" />
              FST-7
            </span>
          )}
          <span className="absolute bottom-2 right-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/60 text-white text-sm font-bold backdrop-blur-sm">
            {index + 1}
          </span>
        </div>

        <CardContent className="p-4 md:p-5 space-y-4">
          {/* عنوان و عضلات */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold">{current?.faName}</h3>
              <Badge variant="secondary" className="text-[11px] font-mono">
                {current?.hevyName}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-primary" />
              {exercise.muscles}
            </p>
          </div>

          {/* سوییچ دستگاه ↔ وزنه آزاد */}
          {hasToggle && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-xl border border-border bg-secondary/40 p-0.5">
                {machineVersion && (
                  <button
                    type="button"
                    onClick={() => setMode("machine")}
                    aria-pressed={mode === "machine"}
                    className={optionClass(mode === "machine")}
                  >
                    <Cog className="w-3.5 h-3.5" />
                    دستگاه / کابل
                    {startMode === "machine" && <Sparkles className="w-3 h-3 text-amber-400" />}
                  </button>
                )}
                {freeVersion && (
                  <button
                    type="button"
                    onClick={() => setMode("free")}
                    aria-pressed={mode === "free"}
                    className={optionClass(mode === "free")}
                  >
                    <Dumbbell className="w-3.5 h-3.5" />
                    وزنه آزاد
                    {startMode === "free" && <Sparkles className="w-3 h-3 text-amber-400" />}
                  </button>
                )}
              </div>
              <span className="text-[11px] text-muted-foreground">
                نسخه شروع پیشنهادی تو:{" "}
                <span className="font-bold text-foreground">
                  {startMode === "machine" ? "دستگاه" : "وزنه آزاد"}
                </span>
              </span>
            </div>
          )}

          {/* توضیح نسخه جایگزین */}
          {!isBase && current?.note && (
            <div className="rounded-lg bg-primary/10 border border-primary/25 px-3 py-2.5 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-sm leading-6">{current.note}</p>
            </div>
          )}

          {/* مشخصات ست‌ها */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="rounded-lg bg-secondary/60 px-3 py-2 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Dumbbell className="w-3 h-3" /> ست
              </div>
              <div className="font-bold text-sm mt-0.5">{exercise.sets}</div>
            </div>
            <div className="rounded-lg bg-secondary/60 px-3 py-2 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Repeat className="w-3 h-3" /> تکرار
              </div>
              <div className="font-bold text-sm mt-0.5">{exercise.reps}</div>
            </div>
            <div className="rounded-lg bg-secondary/60 px-3 py-2 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Timer className="w-3 h-3" /> استراحت
              </div>
              <div className="font-bold text-sm mt-0.5">{exercise.rest}</div>
            </div>
            <div className="rounded-lg bg-secondary/60 px-3 py-2 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Gauge className="w-3 h-3" /> RPE
              </div>
              <div className="font-bold text-sm mt-0.5">{exercise.rpe}</div>
            </div>
          </div>

          {/* نکات */}
          <div className="space-y-1.5">
            {exercise.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="leading-6">{tip}</span>
              </div>
            ))}
          </div>

          {/* خطاها */}
          <div className="space-y-1.5 border-t border-border/60 pt-3">
            {exercise.mistakes.map((m, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <span className="leading-6 text-muted-foreground">{m}</span>
              </div>
            ))}
          </div>

          {/* آموزش کاملاً لوکال است — فلیپ‌بوک مرحله‌به‌مرحله و ویدیوی آفلاین بالای کارت */}
        </CardContent>
      </div>
    </Card>
  );
}
