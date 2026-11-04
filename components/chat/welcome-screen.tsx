"use client";

import { ArrowUpRight } from "lucide-react";

import { suggestions } from "@/lib/data";
import { PcaiLogo } from "@/components/brand";

interface WelcomeScreenProps {
  onSuggestionSelect: (prompt: string) => void;
}

export function WelcomeScreen({ onSuggestionSelect }: WelcomeScreenProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-10 text-center">
      <PcaiLogo className="mb-5 size-11 rounded-2xl text-base" />

      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        How can I help you today?
      </h1>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        PCAI is your local AI workspace. Ask a question, draft something, or
        paste code to get started.
      </p>

      <div className="mt-8 grid w-full gap-2.5 sm:grid-cols-2">
        {suggestions.map((item) => (
          <button
            key={item.title}
            onClick={() => onSuggestionSelect(item.prompt)}
            className="group bg-card/50 hover:bg-card focus-visible:ring-ring/50 flex items-start gap-3 rounded-xl border p-3.5 text-left transition-colors outline-none focus-visible:ring-2"
          >
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[13px] font-medium">{item.title}</span>
              <span className="text-muted-foreground mt-0.5 text-xs">
                {item.description}
              </span>
            </span>
            <ArrowUpRight className="text-muted-foreground/50 group-hover:text-foreground mt-0.5 size-3.5 shrink-0 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
