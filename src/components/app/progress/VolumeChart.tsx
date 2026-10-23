"use client";

// ============================================================
// روند حجم تمرین — چارت خطی weekly.volume + توضیح صادقانه روند
// + toggle «دیدن داده خام»
// ============================================================

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { LineChart as LineChartIcon, Table2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/app/EmptyState";
import { faNum } from "@/lib/fa";
import { formatWeight, type Units } from "@/lib/units";
import RawDataTable from "./RawDataTable";

const TOOLTIP_STYLE = {
  background: "#0f1a14",
  border: "1px solid #2a3d33",
  borderRadius: 12,
  fontFamily: "Vazirmatn",
  fontSize: 13,
  direction: "rtl" as const,
};

interface VolumeChartProps {
  weekly: { weekKey: string; completedCount: number; volume: number }[];
  units: Units;
}

export default function VolumeChart({ weekly, units }: VolumeChartProps) {
  const [showRaw, setShowRaw] = useState(false);

  const hasVolume = weekly.some((w) => w.volume > 0);

  const chartData = weekly.map((w) => {
    const weekNo = Number(/W(\d+)/.exec(w.weekKey)?.[1] ?? 0);
    return { label: faNum(weekNo), volume: w.volume };
  });

  // توضیح روند — مقایسه ساده میانگین ۳ هفته اول و ۳ هفته آخر بازه
  // بدون اغراق و بدون سرزنش
  let trendText: string;
  if (!hasVolume) {
    trendText = "";
  } else {
    const first3 = weekly.slice(0, 3);
    const last3 = weekly.slice(-3);
    const avg = (arr: typeof weekly) =>
      arr.length > 0
        ? arr.reduce((acc, w) => acc + w.volume, 0) / arr.length
        : 0;
    const firstAvg = avg(first3);
    const lastAvg = avg(last3);
    const diffPct =
      firstAvg > 0 ? ((lastAvg - firstAvg) / firstAvg) * 100 : 0;
    if (firstAvg === 0) {
      trendText = `حجم هفتگی‌ات الان حدود ${formatWeight(lastAvg, units, 0)} است — از همین‌جا روند شکل می‌گیره.`;
    } else if (diffPct > 10) {
      trendText = `حجم تمرین هفتگی‌ات نسبت به هفته‌های اول بالاتره (حدود ${formatWeight(lastAvg, units, 0)} در هفته) — روند صعودی.`;
    } else if (diffPct < -10) {
      trendText = `حجم هفتگی نسبت به هفته‌های اولِ بازه کمی پایین‌تره (حدود ${formatWeight(lastAvg, units, 0)} در هفته) — بعد از استراحت یا تغییر برنامه کاملاً طبیعیه.`;
    } else {
      trendText = `حجم تمرینت تقریباً ثابت مونده (حدود ${formatWeight(lastAvg, units, 0)} در هفته) — ثبات یعنی داری پایه می‌سازی.`;
    }
  }

  const ToggleIcon: LucideIcon = Table2;

  return (
    <div className="space-y-4">
      {hasVolume ? (
        <>
          <div
            role="img"
            aria-label="نمودار خطی حجم تمرین هفتگی در ۸ هفته اخیر"
            className="h-56 w-full rounded-xl bg-secondary/30 p-2"
            dir="ltr"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 14, bottom: 0, left: -16, right: 8 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="#9ca3af"
                  opacity={0.15}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "Vazirmatn" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "Vazirmatn" }}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(v) => [formatWeight(Number(v), units, 0), "حجم"]}
                  labelFormatter={(l) => `هفته ${l}`}
                />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#10b981" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p
            className="text-xs leading-6 text-muted-foreground"
            aria-live="polite"
          >
            {trendText}
          </p>
        </>
      ) : (
        <EmptyState
          icon={LineChartIcon}
          title="روند حجم با اولین ست‌ها رسم می‌شود"
          description="حجم یعنی مجموع وزنه × تکرار — هر ست که ثبت کنی، این خط پُرتر می‌شه."
        />
      )}

      {hasVolume && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="min-h-11 gap-2 px-4 text-xs"
            onClick={() => setShowRaw((v) => !v)}
            aria-expanded={showRaw}
            aria-controls="volume-raw"
          >
            <ToggleIcon className="h-4 w-4" aria-hidden="true" />
            {showRaw ? "بستن داده خام" : "دیدن داده خام"}
          </Button>
          {showRaw && (
            <div id="volume-raw">
              <RawDataTable rows={weekly} units={units} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
