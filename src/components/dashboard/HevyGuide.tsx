import { HEVY_GUIDE } from "@/lib/program";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, ListChecks } from "lucide-react";

export default function HevyGuide() {
  return (
    <div className="space-y-5">
      {/* هدر بخش */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold">{HEVY_GUIDE.title}</h2>
          <p className="text-xs text-muted-foreground">{HEVY_GUIDE.subtitle}</p>
        </div>
      </div>

      {/* مراحل */}
      <div className="grid sm:grid-cols-2 gap-3">
        {HEVY_GUIDE.steps.map((s, i) => (
          <Card key={i} className="hover:border-primary/40 transition-colors">
            <CardContent className="p-4 flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-sm font-extrabold text-primary shrink-0">
                {i + 1}
              </span>
              <div>
                <div className="font-bold text-sm">{s.title}</div>
                <p className="text-sm text-muted-foreground leading-6 mt-1">
                  {s.text}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* نکته پایانی */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 flex items-start gap-2.5">
          <ListChecks className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm leading-7">
            قاعده طلایی: <span className="font-bold">ثبت نکردن = تمرین نکردن.</span>{" "}
            <span className="text-muted-foreground">
              هر ست که ثبت می‌شه، برای هفته بعدت تصمیم می‌سازه — چه وزنه‌ای، چند
              تکرار. دو تا سؤال ساده: «آیا به سقف تکرار رسیدم؟» و «آیا RPE در
              محدوده بود؟»
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
