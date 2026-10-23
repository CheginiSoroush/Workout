"use client";

// ============================================================
// بخش ۶ پروفایل — حریم خصوصی و داده:
// • خروجی JSON همه جدول‌ها → دانلود سمت کلاینت با Blob
// • پاک کردن: mode=logs (فقط تمرین‌ها و لاگ‌ها) یا mode=all (همه‌چیز)
// • یادداشت: داده‌ها فقط روی همین دستگاه ذخیره می‌شوند
// ============================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { todayISO } from "@/lib/fa";

export default function DataSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ---------- خروجی JSON ----------
  const exportMut = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/export");
      if (!res.ok) throw new Error("export-failed");
      return await res.json();
    },
    onSuccess: (json) => {
      const blob = new Blob([JSON.stringify(json, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fitness-backup-${todayISO()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast({
        title: "خروجی آماده شد ✅",
        description: "فایل JSON روی دستگاهت دانلود شد — جایش امن است.",
      });
    },
    onError: () => {
      toast({
        title: "خروجی نگرفت",
        description: "یک بار دیگر تلاش کن؛ اگر نشد صفحه را رفرش کن.",
        variant: "destructive",
      });
    },
  });

  // ---------- پاک کردن داده‌ها ----------
  const deleteMut = useMutation({
    mutationFn: async (mode: "logs" | "all") => {
      const res = await fetch(`/api/data?mode=${mode}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete-failed");
      return (await res.json()) as {
        ok: boolean;
        mode: string;
        deleted: Record<string, number>;
      };
    },
    onSuccess: (data) => {
      // همه کوئری‌ها بی‌اعتبار می‌شوند تا هر نما داده تازه بخواند
      queryClient.invalidateQueries();
      toast({
        title:
          data.mode === "all"
            ? "همه‌چیز پاک شد"
            : "تمرین‌ها و لاگ‌ها پاک شد",
        description:
          data.mode === "all"
            ? "اپ مثل اولین روز شد — دفعه بعد که وارد شوی، آنبوردینگ دوباره می‌آید."
            : "وزن بدن و پروفایلت سر جایش ماند.",
      });
    },
    onError: () => {
      toast({
        title: "پاک کردن انجام نشد",
        description: "هیچ چیزی حذف نشد — یک بار دیگر تلاش کن.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-3">
      {/* خروجی گرفتن */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-secondary/30 p-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">خروجی گرفتن از همه داده‌ها</p>
          <p className="mt-0.5 text-xs leading-6 text-muted-foreground">
            یک فایل JSON با همه‌چیز: پروفایل، جلسات و ست‌ها، وزن بدن،
            چک‌لیست، کشش و دوچرخه. داده مال توئه.
          </p>
        </div>
        <Button
          variant="outline"
          className="min-h-11 shrink-0 gap-2"
          onClick={() => exportMut.mutate()}
          disabled={exportMut.isPending}
          aria-label="خروجی گرفتن از همه داده‌ها به صورت فایل JSON"
        >
          {exportMut.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
          )}
          خروجی JSON
        </Button>
      </div>

      {/* پاک کردن */}
      <div className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">پاک کردن داده‌ها</p>
          <p className="mt-0.5 text-xs leading-6 text-muted-foreground">
            دو انتخاب داری: فقط تمرین‌ها و لاگ‌ها، یا همه‌چیز شامل پروفایل.
            این کار برگشت ندارد — اگر شک داری، اول خروجی بگیر.
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="min-h-11 shrink-0 gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label="پاک کردن داده‌ها — با تأیید"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              پاک کردن…
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>پاک کردن داده‌ها</AlertDialogTitle>
              <AlertDialogDescription className="leading-7">
                این کار برگشت ندارد. اگر هنوز خروجی نگرفتی، اول دکمه
                «خروجی JSON» بالای همین بخش را بزن. بعد دقیق بگو کدام را پاک
                کنم:
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
              <AlertDialogAction
                className="w-full sm:w-full"
                disabled={deleteMut.isPending}
                onClick={() => deleteMut.mutate("logs")}
              >
                فقط تمرین‌ها و لاگ‌ها
              </AlertDialogAction>
              <p className="-mt-1 text-center text-[11px] text-muted-foreground">
                جلسات، ست‌ها، چک‌لیست، کشش و دوچرخه — وزن بدن و پروفایل
                می‌ماند.
              </p>
              <AlertDialogAction
                className="w-full border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive sm:w-full"
                disabled={deleteMut.isPending}
                onClick={() => deleteMut.mutate("all")}
              >
                همه‌چیز شامل پروفایل
              </AlertDialogAction>
              <p className="-mt-1 text-center text-[11px] text-muted-foreground">
                همه جدول‌ها خالی می‌شوند و اپ مثل اولین روز می‌شود
                (آنبوردینگ دوباره می‌آید).
              </p>
              <AlertDialogCancel className="w-full sm:w-full">
                بی‌خیال — پاک نمی‌کنم
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* یادداشت حریم خصوصی */}
      <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-muted/40 p-3.5 text-xs leading-6 text-muted-foreground">
        <ShieldCheck
          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        <p>
          داده‌ها فقط روی همین دستگاه ذخیره می‌شوند — هیچ سرور، حساب کاربری یا
          همگام‌سازی ابری در کار نیست.
        </p>
      </div>
    </div>
  );
}
