"use client";

import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

/** حالت خالی خوش‌ساخت و شاد — برای نماهایی که در فازهای بعدی پر می‌شوند */
export default function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  children,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-border/70 bg-card/50 px-6 py-12 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/12 border border-primary/25">
        <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-extrabold">{title}</h3>
        {description && (
          <p className="mx-auto max-w-sm text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
