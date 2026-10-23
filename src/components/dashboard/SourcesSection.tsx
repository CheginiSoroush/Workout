import { SOURCES } from "@/lib/program";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Landmark,
  ExternalLink,
  GraduationCap,
  FlaskConical,
} from "lucide-react";

export default function SourcesSection() {
  return (
    <div className="space-y-5">
      {/* هدر بخش */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Landmark className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold">ریشه هر اصل — شفافیت کامل</h2>
            <p className="text-xs text-muted-foreground">
              هر قانون این برنامه از کجا اومده؟ مربی + شواهد علمی، قابل راستی‌آزمایی
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-7">
          تو پرسیدی «چطور مطمئن باشم؟» — این جواب ماست: هیچ چیز مخفی نیست. هر اصل
          برنامه به یک مربی افسانه‌ای یا یک مقاله علمی وصل شده. لینک‌ها رو خودت چک
          کن و هر جا سؤال داشتی بپرس تا با هم بحث کنیم و بعد تغییری بدیم.
        </p>
      </div>

      {/* کارت‌های منبع */}
      <div className="grid md:grid-cols-2 gap-4">
        {SOURCES.map((s, i) => (
          <Card key={i} className="hover:border-primary/40 transition-colors">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-primary mt-1 shrink-0" />
                <div className="font-bold text-sm leading-6">{s.principle}</div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 shrink-0 text-[10px] font-bold">
                    <GraduationCap className="w-3 h-3" />
                    منشأ
                  </span>
                  <span className="leading-6">{s.origin}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 shrink-0 text-[10px] font-bold">
                    <FlaskConical className="w-3 h-3" />
                    علم
                  </span>
                  <span className="leading-6 text-muted-foreground">{s.science}</span>
                </div>
              </div>

              {s.links.length > 0 && (
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 border-t border-border/60">
                  {s.links.map((l, j) => (
                    <a
                      key={j}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* یادآوری صداقت */}
      <Card className="border-amber-500/40 bg-amber-500/5">
        <CardContent className="p-4 text-sm leading-7">
          <span className="font-bold text-amber-400">صداقت کامل: </span>
          <span className="text-muted-foreground">
            ساختار ۳ روزه، کسری کالری و محدودیت ۷۵ دقیقه از هیچ مربی افسانه‌ای کپی
            نشده — ترکیبی از اصول این مربی‌ها و شواهد علمی مدرن، تنظیم‌شده دقیقاً
            من هوش مصنوعی‌ام نه مربی دارای مدرک — قبل از شروع، با پزشکت هماهنگ کن.
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
