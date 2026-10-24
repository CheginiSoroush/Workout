"use client";

import { useState } from "react";
import {
  LIFTOSAUR_GUIDE,
  LIFTOSAUR_VERSIONS,
  type LiftosaurVersionId,
} from "@/lib/liftosaur";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronDown,
  Copy,
  Cog,
  Dumbbell,
  Download,
  ExternalLink,
  ListChecks,
} from "lucide-react";
import { faNum } from "@/lib/fa";
import { toast } from "sonner";

export default function LiftosaurGuide() {
  const [versionId, setVersionId] = useState<LiftosaurVersionId>("machine");
  const [copiedId, setCopiedId] = useState<LiftosaurVersionId | null>(null);
  const [openCode, setOpenCode] = useState(false);

  const version =
    LIFTOSAUR_VERSIONS.find((v) => v.id === versionId) ?? LIFTOSAUR_VERSIONS[0];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(version.program);
      setCopiedId(versionId);
      toast.success(`کد نسخهٔ «${version.label}» کپی شد — در Planner جای‌گذاری کن`);
      setTimeout(() => setCopiedId(null), 2500);
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

      {/* سوییچ نسخه — همان منطق دستگاه ↔ وزنهٔ آزاد سایت */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="space-y-3 p-4">
          <div
            role="group"
            aria-label="انتخاب نسخهٔ برنامه — دستگاه یا وزنهٔ آزاد"
            className="grid grid-cols-1 gap-2 sm:grid-cols-2"
          >
            {LIFTOSAUR_VERSIONS.map((v) => {
              const active = v.id === versionId;
              const Icon = v.id === "machine" ? Cog : Dumbbell;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVersionId(v.id)}
                  aria-pressed={active}
                  className={`flex min-h-11 items-center gap-2.5 rounded-xl border px-3.5 py-2 text-right transition-colors ${
                    active
                      ? "border-primary bg-primary/15"
                      : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`}
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-sm font-bold">{v.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {v.badge}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            هر دو را ایمپورت کن — در اپ از <b>Programs</b> بین نسخهٔ دستگاهی
            (هفتهٔ ۱–۲) و وزنهٔ آزاد (هفتهٔ ۳+) سوییچ می‌کنی. حجم هر دو یکسان
            است؛ فقط ابزار عوض می‌شود.
          </p>
        </CardContent>
      </Card>

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
          aria-label={`کپی کد نسخهٔ ${version.label} برای ایمپورت در Liftosaur`}
        >
          {copiedId === versionId ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
          {copiedId === versionId ? "کپی شد!" : `کپی کد — ${version.label}`}
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
          href={version.file}
          download={version.downloadName}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-secondary/60 px-4 text-sm font-bold transition-colors hover:bg-secondary"
          aria-label={`دانلود فایل نسخهٔ ${version.label}`}
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
          key={versionId}
          id="liftosaur-code"
          dir="ltr"
          className="max-h-96 overflow-y-auto rounded-xl border border-border bg-secondary/50 p-4 text-left font-mono text-[11px] leading-5 whitespace-pre"
          tabIndex={0}
          aria-label={`کد کامل نسخهٔ ${version.label} در فرمت Liftoscript`}
        >
          {version.program}
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
