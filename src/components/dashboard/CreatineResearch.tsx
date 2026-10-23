import { CREATINE_RESEARCH } from "@/lib/program";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, ExternalLink, CheckCircle2, Microscope } from "lucide-react";

export default function CreatineResearch() {
  return (
    <div className="space-y-5">
      {/* هدر بخش */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Pill className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold">{CREATINE_RESEARCH.title}</h2>
            <p className="text-xs text-muted-foreground">{CREATINE_RESEARCH.subtitle}</p>
          </div>
        </div>
      </div>

      {/* کارت‌های یافته‌ها */}
      <div className="grid md:grid-cols-2 gap-4">
        {CREATINE_RESEARCH.cards.map((c, i) => (
          <Card
            key={i}
            className={`hover:border-primary/40 transition-colors ${
              i === CREATINE_RESEARCH.cards.length - 1
                ? "md:col-span-2 border-primary/40 glow-emerald"
                : ""
            }`}
          >
            <CardContent className="p-4 space-y-2.5">
              <div className="flex items-start gap-2">
                {i === CREATINE_RESEARCH.cards.length - 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                ) : (
                  <Microscope className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                )}
                <h3 className="font-bold text-sm leading-6">{c.title}</h3>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">{c.text}</p>
              {c.linkUrl && (
                <a
                  href={c.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  منبع: {c.linkLabel}
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
