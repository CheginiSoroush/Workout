"use client";

import { Exercise } from "@/lib/program";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  Play,
  Repeat,
  Timer,
  Dumbbell,
  Gauge,
  Flame,
  Target,
} from "lucide-react";

export default function ExerciseCard({
  exercise,
  index,
}: {
  exercise: Exercise;
  index: number;
}) {
  const videoUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    exercise.videoQuery
  )}`;

  return (
    <Card
      className={`overflow-hidden transition-all hover:border-primary/40 ${
        exercise.fst7 ? "border-amber-500/40" : ""
      }`}
    >
      <div className="grid md:grid-cols-[240px_1fr]">
        {/* تصویر */}
        <div className="relative h-44 md:h-full min-h-44 bg-muted">
          <img
            src={exercise.image}
            alt={`نحوه اجرای ${exercise.faName}`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
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
              <h3 className="text-lg font-bold">{exercise.faName}</h3>
              <Badge variant="secondary" className="text-[11px] font-mono">
                {exercise.hevyName}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-primary" />
              {exercise.muscles}
            </p>
          </div>

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

          {/* ویدیو */}
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => window.open(videoUrl, "_blank", "noopener")}
          >
            <Play className="w-4 h-4 ml-1" />
            ویدیو آموزش اجرای صحیح
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
