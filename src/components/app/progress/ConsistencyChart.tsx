"use client";

// ============================================================
// استمراری هفتگی — چارت ستونی ۸ هفته اخیر + خط هدف زمردی
// + جمله توصیفی مثبت و واقع‌بینانه + toggle «دیدن داده خام»
// ============================================================

import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { BarChart3, Table2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/app/EmptyState";
import { faNum } from "@/lib/fa";
import type { Units } from "@/lib/units";
import RawDataTable from "./RawDataTable";

const TOOLTIP_STYLE = {
  background: "#0f1a14",
  border: "1px solid #2a3d33",
  borderRadius: 12,
  fontFamily: "Vazirmatn",
  fontSize: 13,
  direction: "rtl" as const,
};

interface ConsistencyChartProps {
  weekly: { weekKey: string; completedCount: number; volume: number }[];
  goal: number;
  units: Units;
}

export default function ConsistencyChart({
  weekly,
  goal,
  units,
}: ConsistencyChartProps) {
  const [showRaw, setShowRaw] = useState(false);

  const hasData = weekly.some((w) => w.completedCount > 0);

  const chartData = weekly.map((w) => {
    const weekNo = Number(/W(\d+)/.exec(w.weekKey)?.[1] ?? 0);
    return { label: faNum(weekNo), completedCount: w.completedCount };
  });

  // جمله توصیفی — میانگین ۴ هفته اخیر (شامل هفته‌های خالی؛ صادقانه)
  const last4 = weekly.slice(-4);
  const avg4 =
    last4.length > 0
      ? last4.reduce((acc, w) => acc + w.completedCount, 0) / last4.length
      : 0;
  const hitGoal = goal > 0 && last4.some((w) => w.completedCount >= goal);

  const ToggleIcon: LucideIcon = Table2;

  return (
    <div className="space-y-4">
      {hasData ? (
        <>
          <div
            role="img"
            aria-label={`نمودار ستونی جلسه‌های کامل‌شده در ۸ هفته اخیر؛ خط چین زمردی هدف هفته است (${faNum(goal)} جلسه)`}
            className="h-56 w-full rounded-xl bg-secondary/30 p-2"
            dir="ltr"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 14, bottom: 0, left: -24, right: 4 }}
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
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "Vazirmatn" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  cursor={{ fill: "rgba(16,185,129,0.10)" }}
                  formatter={(v) => [
                    `${faNum(Number(v))} جلسه`,
                    "کامل‌شده",
                  ]}
                  labelFormatter={(l) => `هفته ${l}`}
                />
                <ReferenceLine
                  y={goal}
                  stroke="#6ee7b7"
                  strokeDasharray="6 4"
                  label={{
                    value: "هدف",
                    fill: "#6ee7b7",
                    fontSize: 11,
                    fontFamily: "Vazirmatn",
                    position: "insideTopRight",
                  }}
                />
                <Bar
                  dataKey="completedCount"
                  fill="#10b981"
                  fillOpacity={0.85}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p
            className="text-xs leading-6 text-muted-foreground"
            aria-live="polite"
          >
            در ۴ هفته اخیر، میانگین جلسه‌های تو{" "}
            <span className="font-bold text-foreground">
              {faNum(avg4, 1)}
            </span>{" "}
            در هفته بوده.{" "}
            {hitGoal
              ? "به خط زمردی رسیده‌ای — استمرار همون چیزیه که فرم می‌سازه."
              : "هر جلسه شمرده می‌شه؛ ادامه دادن از بی‌نقص بودن مهم‌تره."}
          </p>
        </>
      ) : (
        <EmptyState
          icon={BarChart3}
          title="داده اینجا با اولین جلسه‌ات پر می‌شود"
          description="هر جلسه کامل‌شده یک ستون اینجا می‌گیرد — خط زمردی هم هدف هفته‌ات است که از پروفایل قابل تغییره."
        />
      )}

      {hasData && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="min-h-11 gap-2 px-4 text-xs"
            onClick={() => setShowRaw((v) => !v)}
            aria-expanded={showRaw}
            aria-controls="consistency-raw"
          >
            <ToggleIcon className="h-4 w-4" aria-hidden="true" />
            {showRaw ? "بستن داده خام" : "دیدن داده خام"}
          </Button>
          {showRaw && (
            <div id="consistency-raw">
              <RawDataTable rows={weekly} units={units} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
