"use client";

import * as React from "react";
import { Check, Cpu, Monitor, Palette } from "lucide-react";

import { models } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ThemePreference = "dark" | "light" | "system";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: string;
  onModelChange: (model: string) => void;
  theme: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
}

const themeOptions: { id: ThemePreference; label: string; icon: typeof Monitor }[] =
  [
    { id: "dark", label: "Dark", icon: Palette },
    { id: "light", label: "Light", icon: Monitor },
    { id: "system", label: "System", icon: Monitor },
  ];

export function SettingsDialog({
  open,
  onOpenChange,
  model,
  onModelChange,
  theme,
  onThemeChange,
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Frontend preferences only — nothing is saved to a server.
          </DialogDescription>
        </DialogHeader>

        <section className="space-y-2">
          <h3 className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
            <Cpu className="size-3.5" />
            Model
          </h3>
          <div className="space-y-1">
            {models.map((item) => (
              <button
                key={item.id}
                onClick={() => onModelChange(item.id)}
                className={cn(
                  "focus-visible:ring-ring/50 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors outline-none focus-visible:ring-2",
                  model === item.id
                    ? "border-primary/40 bg-primary/10"
                    : "hover:bg-accent/60 border-transparent",
                )}
              >
                <span className="font-mono text-[13px]">{item.label}</span>
                {model === item.id ? (
                  <Check className="text-primary size-4" />
                ) : null}
              </button>
            ))}
          </div>
          <p className="text-muted-foreground/70 text-[11px]">
            Placeholder list — model discovery is wired up with the backend later.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Appearance
          </h3>
          <div className="grid grid-cols-3 gap-1.5">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.id}
                  variant={theme === option.id ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onThemeChange(option.id)}
                  className="justify-center gap-1.5 font-normal"
                >
                  <Icon className="size-3.5" />
                  {option.label}
                </Button>
              );
            })}
          </div>
        </section>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
