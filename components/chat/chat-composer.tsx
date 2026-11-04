"use client";

import * as React from "react";

import PromptComposer from "@/components/ui/prompt-composer";
import type { ComposerSubmit } from "@/components/ui/prompt-composer";
import { models, suggestions } from "@/lib/data";

/**
 * Adapter around the 21st.dev PromptComposer.
 *
 * The composer itself is the original component copied verbatim to
 * components/ui/prompt-composer.tsx (see README for the source link).
 * This file only supplies PCAI copy and forwards onSubmit upward.
 */
export function ChatComposer({
  onSubmit,
  initialValue,
}: {
  onSubmit: (submission: ComposerSubmit) => void;
  initialValue?: string;
}) {
  return (
    <PromptComposer
      onSubmit={onSubmit}
      initialValue={initialValue}
      /* a chat clears the box after sending instead of playing the demo build */
      simulate={false}
      prompts={suggestions}
      placeholder="Ask PCAI anything…"
      platforms={[
        { label: "Chat", icon: "chat" },
        { label: "Code", icon: "code" },
        { label: "Research", icon: "eye" },
        { label: "Plan", icon: "bars" },
      ]}
      models={models}
      modelNotes={["Lighter, quicker", "Balanced", "Slow, thorough"]}
    />
  );
}
