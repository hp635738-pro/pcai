"use client";

import * as React from "react";
import { Copy, Check, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";

/**
 * Message bubbles — layout shell. User messages sit right, assistant
 * messages left, distinguished by fill and avatar.
 */
export function MessageList({
  messages,
  onSuggestion,
  suggestions,
}: {
  messages: Message[];
  suggestions: string[];
  onSuggestion: (prompt: string) => void;
}) {
  if (messages.length === 0) {
    return <Welcome suggestions={suggestions} onSuggestion={onSuggestion} />;
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = React.useState(false);

  return (
    <div className={cn("flex flex-col gap-1.5", isUser ? "items-end" : "items-start")}>
      <span className="text-muted-foreground px-1 text-[10px] font-medium tracking-wider uppercase">
        {isUser ? "You" : "PCAI"}
      </span>

      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted rounded-bl-sm",
        )}
      >
        {message.content}
      </div>

      {!isUser && (
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground size-6"
          aria-label="Copy reply"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(message.content);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {
              /* clipboard unavailable */
            }
          }}
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
        </Button>
      )}
    </div>
  );
}

function Welcome({
  suggestions,
  onSuggestion,
}: {
  suggestions: string[];
  onSuggestion: (prompt: string) => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-4 py-10 text-center">
      <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-xl">
        <Sparkles className="size-5" />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight">
          How can I help you today?
        </h1>
        <p className="text-muted-foreground text-sm">
          PCAI runs on your machine. Pick a starting point or type below.
        </p>
      </div>
      <div className="grid w-full gap-2 sm:grid-cols-2">
        {suggestions.map((prompt) => (
          <Button
            key={prompt}
            variant="outline"
            onClick={() => onSuggestion(prompt)}
            className="h-auto justify-start px-3 py-2.5 text-left text-xs font-normal whitespace-normal"
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
}
