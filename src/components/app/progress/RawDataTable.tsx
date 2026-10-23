"use client";

// ============================================================
// جدول «داده خام» هفتگی — پشت دکمه toggle هر چارت
// ============================================================

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { faNum } from "@/lib/fa";
import { formatWeight, type Units } from "@/lib/units";

interface RawDataTableProps {
  rows: { weekKey: string; completedCount: number; volume: number }[];
  units: Units;
}

export default function RawDataTable({ rows, units }: RawDataTableProps) {
  return (
    <div
      role="region"
      aria-label="جدول داده خام هفتگی"
      tabIndex={0}
      className="max-h-56 overflow-y-auto rounded-xl border border-border/70 bg-card/40"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">هفته</TableHead>
            <TableHead className="text-right">جلسه‌های کامل‌شده</TableHead>
            <TableHead className="text-right">حجم تمرین</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.weekKey}>
              <TableCell dir="ltr" className="text-right text-xs tabular-nums">
                {r.weekKey}
              </TableCell>
              <TableCell className="text-sm">{faNum(r.completedCount)}</TableCell>
              <TableCell className="text-sm">
                {formatWeight(r.volume, units, 0)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
