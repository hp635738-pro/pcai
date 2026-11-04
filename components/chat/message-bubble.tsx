"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";
import { PcaiLogo } from "@/components/brand";
import { Button } from "@/components/ui/button";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <article
      className={cn(
        "group/message flex w-full gap-3",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
      aria-label={`${isUser ? "Your" : "PCAI"} message`}
    >
      {isUser ? (
        <div className="bg-secondary text-secondary-foreground mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-medium">
          You
        </div>
      ) : (
        <PcaiLogo className="mt-0.5 size-8" />
      )}

      <div
        className={cn(
          "flex min-w-0 max-w-[85%] flex-col gap-1.5 sm:max-w-[75%]",
          isUser ? "items-end" : "items-start",
        )}
      >
        <span className="text-muted-foreground/70 px-1 text-[10px] font-medium tracking-wider uppercase">
          {isUser ? "You" : "PCAI"}
        </span>

        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-[0.9375rem] leading-relaxed break-words whitespace-pre-wrap",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-md"
              : "bg-card text-card-foreground rounded-tl-md border shadow-sm",
          )}
        >
          {message.content}
        </div>

        {!isUser ? <CopyButton content={message.content} /> : null}
      </div>
    </article>
  );
}

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard is unavailable (insecure context) — fail silently.
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy message"}
      className="text-muted-foreground hover:text-foreground size-7 opacity-0 transition-opacity group-hover/message:opacity-100 focus-visible:opacity-100"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </Button>
  );
}
