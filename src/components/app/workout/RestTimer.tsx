"use client";

// ============================================================
// تایمر استراحت — کاملاً اختیاری و dismissible
// هیچ صدای اجباری، هیچ شمارش معکوس گناه‌آلود؛ توقف همیشه در دسترس
// ============================================================

import { useEffect, useRef, useState } from "react";
import { Timer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { faClock, faDigits } from "./types";

interface RestTimerProps {
  /** ثانیه پیش‌فرض استراحت حرکت */
  seconds: number;
  /** بستن/توقف تایمر */
  onClose: () => void;
  /** بازخورد برای aria-live پلیر */
  announce: (text: string) => void;
}

const MIN_SEC = 15;
const MAX_SEC = 600;

export default function RestTimer({ seconds, onClose, announce }: RestTimerProps) {
  const { toast } = useToast();
  const [total, setTotal] = useState(seconds);
  const [remaining, setRemaining] = useState(seconds);
  const finished = remaining === 0;

  const startedRef = useRef(false);
  const endedRef = useRef(false);

  // اعلام شروع — فقط یک بار
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    announce(`تایمر استراحت شروع شد — ${faDigits(seconds)} ثانیه`);
  }, [announce, seconds]);

  // شمارش معکوس — هر ثانیه
  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [finished]);

  // پایان ملایم — بدون صدا و بدون فشار (فقط فراخوانی سیستم‌های بیرونی)
  useEffect(() => {
    if (!finished || endedRef.current) return;
    endedRef.current = true;
    announce("استراحت تمام شد");
    toast({
      title: "استراحت تمام",
      description: "هر وقت آماده بودی ادامه بده.",
    });
  }, [finished, announce, toast]);

  const adjust = (delta: number) => {
    if (finished) return;
    setTotal((t) => Math.min(MAX_SEC, Math.max(MIN_SEC, t + delta)));
    setRemaining((r) => Math.min(MAX_SEC, Math.max(1, r + delta)));
  };

  const pct = total > 0 ? Math.round(((total - remaining) / total) * 100) : 0;

  return (
    <Card className="border-primary/40 bg-primary/5" data-testid="rest-timer">
      <CardContent className="space-y-3 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-extrabold">
            <Timer className="h-4 w-4 text-primary" aria-hidden="true" />
            تایمر استراحت
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 min-h-9 px-3"
            onClick={onClose}
            aria-label="بستن تایمر استراحت"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            بستن
          </Button>
        </div>

        {/* ساعت بزرگ — فقط نمایشی؛ وضعیت برای صفحه‌خوان در span پایین است */}
        <p
          aria-hidden="true"
          className={`text-center font-black tabular-nums ${
            finished ? "text-2xl text-primary" : "text-6xl text-foreground"
          }`}
          style={{ minWidth: "8rem" }}
        >
          {finished ? "استراحت تمام شد" : faClock(remaining)}
        </p>
        <p role="status" aria-live="polite" className="sr-only">
          {finished
            ? "استراحت تمام شد — هر وقت آماده بودی ادامه بده"
            : "تایمر استراحت در جریان است"}
        </p>

        {!finished && (
          <Progress
            value={pct}
            aria-label="پیشرفت تایمر استراحت"
            className="h-2"
          />
        )}

        <div className="grid grid-cols-3 gap-2" dir="ltr">
          <Button
            variant="outline"
            className="h-12 min-h-12 font-black"
            onClick={() => adjust(-15)}
            disabled={finished}
            aria-label="۱۵ ثانیه کمتر"
          >
            −۱۵
          </Button>
          <Button
            variant="outline"
            className="h-12 min-h-12 font-black"
            onClick={() => adjust(15)}
            disabled={finished}
            aria-label="۱۵ ثانیه بیشتر"
          >
            +۱۵
          </Button>
          <Button
            variant={finished ? "default" : "secondary"}
            className="h-12 min-h-12 font-bold"
            onClick={onClose}
          >
            {finished ? "ادامه می‌دهم" : "توقف"}
          </Button>
        </div>

        <p className="text-center text-xs leading-5 text-muted-foreground">
          استراحت اختیاری است — هر وقت خواستی توقفش کن.
        </p>
      </CardContent>
    </Card>
  );
}
