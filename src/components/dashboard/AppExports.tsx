"use client";

import { useState } from "react";
import { APP_EXPORTS, WEEKLY_SHEET, type AppExportCard } from "@/lib/appExports";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Bot,
  Check,
  ChevronDown,
  Copy,
  Dumbbell,
  Download,
  ExternalLink,
  FileJson,
  FileText,
  Globe,
  PersonStanding,
  Smartphone,
} from "lucide-react";
import { faNum } from "@/lib/fa";
import { toast } from "sonner";

const APP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  hevy: Dumbbell,
  lyfta: Activity,
  fitbod: Bot,
  opengym: Globe,
  gymmane: PersonStanding,
};

async function copyToClipboard(
  text: string,
  okMsg: string
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(okMsg);
    return true;
  } catch {
    toast.error("کپی نشد — فایل را دانلود کن یا دستی باز کن");
    return false;
  }
}

function AppCard({ app }: { app: AppExportCard }) {
  const [copied, setCopied] = useState(false);
  const Icon = APP_ICONS[app.id] ?? Smartphone;

  const onCopy = async () => {
    const ok = await copyToClipboard(
      app.copyText,
      `برگهٔ ساخت ${app.name} کپی شد`
    );
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <Card className="flex flex-col transition-colors hover:border-primary/40">
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        {/* هدر کارت */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/15">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-base font-black">{app.name}</h3>
              <p className="text-[11px] leading-4 text-muted-foreground">
                {app.faName}
              </p>
            </div>
          </div>
          <Badge
            variant={
              app.badge === "unknown"
                ? "outline"
                : app.badge === "auto"
                  ? "default"
                  : "secondary"
            }
            className="shrink-0 text-[10px]"
          >
            {app.badge === "auto" && (
              <FileJson className="ml-1 h-3 w-3" aria-hidden="true" />
            )}
            {app.badgeText}
          </Badge>
        </div>

        <p className="text-xs leading-6 text-muted-foreground">{app.summary}</p>

        {/* مراحل */}
        <ol className="space-y-1.5" aria-label={`مراحل ساخت برنامه در ${app.name}`}>
          {app.steps.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-xs leading-6">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-[10px] font-extrabold text-primary">
                {faNum(i + 1)}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>

        {/* نوت‌ها */}
        {app.notes.length > 0 && (
          <ul className="space-y-1 rounded-lg border border-border/60 bg-secondary/40 p-2.5">
            {app.notes.map((n, i) => (
              <li key={i} className="text-[11px] leading-5 text-muted-foreground">
                • {n}
              </li>
            ))}
          </ul>
        )}

        {/* اکشن‌ها */}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onCopy}
            className="min-h-9 gap-1.5 text-xs font-bold"
            aria-label={`کپی برگهٔ ساخت برنامه برای ${app.name}`}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {copied ? "کپی شد!" : "کپی برگهٔ ساخت"}
          </Button>
          <a
            href={app.file}
            download
            className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-bold transition-colors hover:bg-secondary"
            aria-label={`دانلود فایل ساخت برای ${app.name}`}
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            دانلود
          </a>
          <a
            href={app.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center gap-1 px-1 text-xs font-bold text-primary underline-offset-4 hover:underline"
            aria-label={`باز کردن وب‌سایت ${app.name}`}
          >
            سایت
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AppExports() {
  const [openSheet, setOpenSheet] = useState(false);
  const [copiedSheet, setCopiedSheet] = useState(false);

  const onCopySheet = async () => {
    const ok = await copyToClipboard(
      WEEKLY_SHEET.copyText,
      "برگهٔ جامع روتین هفتگی کپی شد — در هر اپ یا نتی‌لاگ کار می‌کند"
    );
    if (ok) {
      setCopiedSheet(true);
      setTimeout(() => setCopiedSheet(false), 2500);
    }
  };

  return (
    <div className="space-y-5">
      {/* هدر بخش */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/15">
          <Smartphone className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold">برنامه در اپ‌های دیگر — برگهٔ ساخت دقیق</h2>
          <p className="text-xs text-muted-foreground">
            کل روتین هفتگی (باشگاه + گرم‌کردن + کششی + دوچرخه + نوت‌ها) آمادهٔ هر اپ
          </p>
        </div>
      </div>

      {/* برگهٔ جامع */}
      <Card className="border-primary/40 bg-primary/5">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start gap-2.5">
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-black">
                برگهٔ جامع روتین هفتگی — مرجع واحد برای هر اپ
              </h3>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                تقویم هفته، پروتکل دقیق جلسه، هر ۱۹ حرکت با دوز/نکات فرم/خطاهای رایج/نسخه‌های
                یک فایل، همه‌چیز.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={onCopySheet}
              className="min-h-9 gap-1.5 text-xs font-bold"
              aria-label="کپی برگهٔ جامع روتین هفتگی"
            >
              {copiedSheet ? (
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {copiedSheet ? "کپی شد!" : "کپی برگهٔ کامل"}
            </Button>
            <a
              href={WEEKLY_SHEET.file}
              download="fst7-weekly-routine.md"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-bold transition-colors hover:bg-secondary"
              aria-label="دانلود برگهٔ جامع روتین هفتگی"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              دانلود
            </a>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setOpenSheet((v) => !v)}
              className="min-h-9 gap-1.5 text-xs font-bold"
              aria-expanded={openSheet}
              aria-controls="weekly-sheet-view"
            >
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${openSheet ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
              {openSheet ? "بستن" : "دیدن برگه"}
            </Button>
          </div>
          {openSheet && (
            <pre
              id="weekly-sheet-view"
              dir="rtl"
              className="max-h-96 overflow-y-auto rounded-xl border border-border bg-background/60 p-4 text-right font-mono text-[11px] leading-5 whitespace-pre-wrap"
              tabIndex={0}
              aria-label="متن کامل برگهٔ جامع روتین هفتگی"
            >
              {WEEKLY_SHEET.copyText}
            </pre>
          )}
        </CardContent>
      </Card>

      {/* کارت اپ‌ها */}
      <div className="grid gap-4 sm:grid-cols-2">
        {APP_EXPORTS.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>

      {/* نکته پایانی */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4">
          <p className="text-xs leading-6 text-muted-foreground">
            <span className="font-bold text-foreground">واقعیت صادقانه:</span> دو اپ برنامه را
            خودکار می‌فهمند — Liftosaur (متن Liftoscript) و openGym (فایل JSON رسمی‌اش، تقویم هفته +
            استراحت‌ها + پیشرفت دوگانه). GymMane ایمپورت برنامه ندارد ولی رابط فارسی کامل دارد؛
            Hevy/Lyfta/Fitbod هم فقط دستی (بررسی رسمی مستنداتشان). برگه‌ها طوری چیده شده‌اند که ساخت
            هر روال دستی زیر ۲ دقیقه طول بکشد: نام حرکت انگلیسی + دوز + استراحت به ثانیه + نوت آماده.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
