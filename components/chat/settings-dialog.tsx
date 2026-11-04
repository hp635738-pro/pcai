"use client";

import * as React from "react";

import { models } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/** Settings sheet — frontend preferences only, nothing is persisted. */
export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [model, setModel] = React.useState(models[0]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Frontend preferences only — nothing is saved or sent anywhere.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Model
          </p>
          <div className="space-y-1">
            {models.map((entry) => (
              <Button
                key={entry}
                variant={model === entry ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setModel(entry)}
                className={cn("w-full justify-start font-mono text-xs")}
              >
                {entry}
              </Button>
            ))}
          </div>
        </div>

        <Separator />
        <p className="text-muted-foreground text-xs">
          Model discovery and generation arrive with the backend.
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
