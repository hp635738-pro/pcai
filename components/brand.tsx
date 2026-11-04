"use client";

import { cn } from "@/lib/utils";

export function PcaiLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "from-primary to-primary/60 text-primary-foreground inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[13px] font-bold tracking-tight shadow-sm",
        className,
      )}
      aria-hidden
    >
      P
    </span>
  );
}

export function PcaiWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <PcaiLogo />
      <span className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-tight">PCAI</span>
        <span className="text-muted-foreground mt-0.5 text-[10px] tracking-wide">
          local ai workspace
        </span>
      </span>
    </span>
  );
}
