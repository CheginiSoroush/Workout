"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Scale,
  Plus,
  Trash2,
  TrendingDown,
  Target,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { PROFILE } from "@/lib/program";

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  note?: string | null;
}

export default function WeightTracker() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const { toast } = useToast();

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/weights");
      const data = await res.json();
      setEntries(data.entries ?? []);
    } catch {
      toast({ title: "خطا", description: "دریافت داده‌ها ناموفق بود", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    if (!w || w < 30 || w > 300) {
      toast({
        title: "وزن نامعتبر",
        description: "عدد بین ۳۰ تا ۳۰۰ وارد کن",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/weights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: w,
          note: note.trim() || null,
        }),
      });
      if (!res.ok) throw new Error();
      setWeight("");
      setNote("");
      await load();
      toast({ title: "ثبت شد ✅", description: `${w} کیلوگرم برای امروز ذخیره شد` });
    } catch {
      toast({ title: "خطا", description: "ثبت وزن ناموفق بود", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await fetch(`/api/weights?id=${id}`, { method: "DELETE" });
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast({ title: "حذف شد" });
    } catch {
      toast({ title: "خطا", description: "حذف ناموفق بود", variant: "destructive" });
    }
  };

  // آمار
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const current = entries[0]?.weight ?? PROFILE.startWeight;
  const firstLogged = sorted[0]?.weight;
  const changeFromStart = PROFILE.startWeight - current;
  const changeSinceFirst =
    firstLogged !== undefined ? firstLogged - current : null;
  const progressPct = Math.max(
    0,
    Math.min(
      100,
      ((PROFILE.startWeight - current) /
        (PROFILE.startWeight - PROFILE.targetWeight)) *
        100
    )
  );

  const chartData = sorted.map((e) => ({
    date: e.date.slice(5).replace("-", "/"),
    weight: e.weight,
  }));

  const fa = (n: number) => n.toLocaleString("fa-IR", { maximumFractionDigits: 1 });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-primary" />
          پیگیری وزن
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* آمار */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-secondary/60 p-3 text-center">
            <div className="text-xs text-muted-foreground">وزن فعلی</div>
            <div className="text-xl font-extrabold text-primary mt-1">
              {fa(current)} <span className="text-xs font-normal">کیلو</span>
            </div>
          </div>
          <div className="rounded-xl bg-secondary/60 p-3 text-center">
            <div className="text-xs text-muted-foreground">از شروع کم شده</div>
            <div className="text-xl font-extrabold text-amber-400 mt-1">
              {changeFromStart > 0 ? `${fa(changeFromStart)}-` : fa(0)}
              <span className="text-xs font-normal"> کیلو</span>
            </div>
          </div>
          <div className="rounded-xl bg-secondary/60 p-3 text-center">
            <div className="text-xs text-muted-foreground">وزن هدف</div>
            <div className="text-xl font-extrabold mt-1">
              {fa(PROFILE.targetWeight)}{" "}
              <span className="text-xs font-normal">کیلو</span>
            </div>
          </div>
          <div className="rounded-xl bg-secondary/60 p-3 text-center">
            <div className="text-xs text-muted-foreground">پیشرفت تا هدف</div>
            <div className="text-xl font-extrabold text-primary mt-1">
              {fa(Math.round(progressPct))}٪
            </div>
          </div>
        </div>

        {/* نوار پیشرفت */}
        <div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-l from-primary to-emerald-300 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5">
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" /> هدف: {fa(PROFILE.targetWeight)} کیلو
            </span>
            <span>شروع: {fa(PROFILE.startWeight)} کیلو</span>
          </div>
        </div>

        {/* نمودار */}
        <div className="h-56 rounded-xl bg-secondary/30 p-2">
          {loading ? (
            <Skeleton className="w-full h-full" />
          ) : chartData.length < 2 ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground text-center px-4">
              بعد از دو ثبت وزن، نمودار روند کاهش اینجا نمایش داده می‌شه 📉
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, bottom: 0, left: -20, right: 8 }}>
                <defs>
                  <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={["dataMin - 2", "dataMax + 1"]}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0f1a14",
                    border: "1px solid #2a3d33",
                    borderRadius: 12,
                    fontFamily: "Vazirmatn",
                    fontSize: 13,
                  }}
                  formatter={(v: number) => [`${fa(v)} کیلو`, "وزن"]}
                />
                <ReferenceLine
                  y={PROFILE.targetWeight}
                  stroke="#f59e0b"
                  strokeDasharray="6 4"
                  label={{
                    value: "هدف",
                    fill: "#f59e0b",
                    fontSize: 11,
                    fontFamily: "Vazirmatn",
                    position: "insideTopRight",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#wGrad)"
                  dot={{ r: 3, fill: "#10b981" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* فرم ثبت */}
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Scale className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="number"
              step="0.1"
              inputMode="decimal"
              placeholder="وزن امروز (کیلوگرم)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="pr-10"
            />
          </div>
          <Input
            placeholder="یادداشت (اختیاری)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={saving} className="sm:w-32">
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4 ml-1" />
                ثبت وزن
              </>
            )}
          </Button>
        </form>

        {/* لیست رکوردها */}
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : entries.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            هنوز وزنی ثبت نشده — اولین وزن‌کشی رو امروز انجام بده! 💪
          </p>
        ) : (
          <div className="max-h-48 overflow-y-auto space-y-2 pl-1">
            {entries.map((e) => (
              <div
                key={e.id}
                className="flex items-center gap-3 rounded-lg bg-secondary/40 px-3 py-2"
              >
                <TrendingDown className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-sm">{fa(e.weight)} کیلو</span>
                  <span className="text-xs text-muted-foreground mr-2" dir="ltr">
                    {e.date}
                  </span>
                  {e.note && (
                    <span className="text-xs text-muted-foreground mr-2 truncate">
                      — {e.note}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => remove(e.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  aria-label="حذف رکورد"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
