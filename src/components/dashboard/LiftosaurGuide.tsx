"use client";

import { useState } from "react";
import { LIFTOSAUR_PROGRAM, LIFTOSAUR_GUIDE } from "@/lib/liftosaur";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronDown,
  Copy,
  Dumbbell,
  Download,
  ExternalLink,
  ListChecks,
} from "lucide-react";
import { faNum } from "@/lib/fa";
import { toast } from "sonner";

export default function LiftosaurGuide() {
  const [copied, setCopied] = useState(false);
  const [openCode, setOpenCode] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(LIFTOSAUR_PROGRAM);
      setCopied(true);
      toast.success("کد Liftosaur کپی شد — در Planner جای‌گذاری کن");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("کپی نشد — متن را دستی از بخش کد انتخاب کن");
    }
  };

  return (
    <div className="space-y-5">
      {/* هدر بخش */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/15">
          <Dumbbell className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold">{LIFTOSAUR_GUIDE.title}</h2>
          <p className="text-xs text-muted-foreground">
            {LIFTOSAUR_GUIDE.subtitle}
          </p>
        </div>
      </div>

      {/* مراحل */}
      <div className="grid gap-3 sm:grid-cols-2">
        {LIFTOSAUR_GUIDE.steps.map((s, i) => (
          <Card key={i} className="transition-colors hover:border-primary/40">
            <CardContent className="flex items-start gap-3 p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-sm font-extrabold text-primary">
                {faNum(i + 1)}
              </span>
              <div>
                <div className="text-sm font-bold">{s.title}</div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {s.text}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* اکشن‌ها */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          type="button"
          onClick={copy}
          className="min-h-11 gap-2 font-bold"
          aria-label="کپی کد Liftoscript برای ایمپورت در Liftosaur"
        >
          {copied ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
          {copied ? "کپی شد!" : "کپی کد Liftoscript"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="min-h-11 gap-2 font-bold"
          onClick={() => setOpenCode((v) => !v)}
          aria-expanded={openCode}
          aria-controls="liftosaur-code"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${openCode ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
          {openCode ? "بستن کد" : "دیدن کد"}
        </Button>
        <a
          href="/liftosaur-fst7.liftoscript"
          download="fst7-swimmer.liftoscript"
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-secondary/60 px-4 text-sm font-bold transition-colors hover:bg-secondary"
          aria-label="دانلود فایل برنامه Liftosaur"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          دانلود فایل
        </a>
        <a
          href="https://www.liftosaur.com/planner"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm font-bold text-primary underline-offset-4 hover:underline"
          aria-label="باز کردن Planner سایت Liftosaur در تب جدید"
        >
          باز کردن Planner
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      {/* کد — LTR و اسکرول‌دار */}
      {openCode && (
        <pre
          id="liftosaur-code"
          dir="ltr"
          className="max-h-96 overflow-y-auto rounded-xl border border-border bg-secondary/50 p-4 text-left font-mono text-[11px] leading-5 whitespace-pre"
          tabIndex={0}
          aria-label="کد کامل برنامه FST-7 در فرمت Liftoscript"
        >
          {LIFTOSAUR_PROGRAM}
        </pre>
      )}

      {/* نکته‌های تطبیق نام‌ها */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-start gap-2.5 p-4">
          <ListChecks className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <ul className="space-y-1.5">
            {LIFTOSAUR_GUIDE.notes.map((n, i) => (
              <li key={i} className="text-sm leading-6">
                {n}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
