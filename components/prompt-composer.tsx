"use client";

import * as React from "react";
import { ArrowUp, Paperclip, Sparkles, Square, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface PromptComposerSubmitPayload {
  text: string;
  attachments: string[];
}

export interface PromptComposerProps {
  value?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (payload: PromptComposerSubmitPayload) => void;
  placeholder?: string;
  disabled?: boolean;
  isGenerating?: boolean;
  onStop?: () => void;
  /** Slot rendered on the left of the composer footer (e.g. a model picker). */
  leading?: React.ReactNode;
  /** Slot rendered next to the send button. */
  trailing?: React.ReactNode;
  /** Lets the parent inject text (e.g. from a suggestion card). */
  autoFocus?: boolean;
  maxRows?: number;
  className?: string;
}

/**
 * Prompt Composer
 * A self-contained, controlled prompt input: auto-growing textarea,
 * attachment chips, keyboard shortcuts and a send/stop button.
 */
export function PromptComposer({
  value,
  onValueChange,
  onSubmit,
  placeholder = "Ask PCAI anything…",
  disabled = false,
  isGenerating = false,
  onStop,
  leading,
  trailing,
  autoFocus = false,
  maxRows = 8,
  className,
}: PromptComposerProps) {
  const [internalValue, setInternalValue] = React.useState("");
  const [attachments, setAttachments] = React.useState<string[]>([]);
  const [isComposing, setIsComposing] = React.useState(false);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const text = isControlled ? value : internalValue;

  const setText = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  // Auto-grow the textarea up to `maxRows`.
  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    const styles = window.getComputedStyle(el);
    const lineHeight = parseFloat(styles.lineHeight) || 24;
    const maxHeight = lineHeight * maxRows;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [text, maxRows]);

  React.useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const canSubmit = text.trim().length > 0 && !disabled;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit?.({ text: text.trim(), attachments: [...attachments] });
    setText("");
    setAttachments([]);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !isComposing) {
      event.preventDefault();
      submit();
    }
  };

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length) {
      setAttachments((prev) => [...prev, ...files.map((file) => file.name)]);
    }
    event.target.value = "";
  };

  const removeAttachment = (name: string) => {
    setAttachments((prev) => prev.filter((item) => item !== name));
  };

  return (
    <div
      data-slot="prompt-composer"
      className={cn(
        "bg-card/80 supports-[backdrop-filter]:bg-card/60 group/composer relative w-full rounded-2xl border border-border shadow-lg shadow-black/20 backdrop-blur transition-colors",
        "focus-within:border-ring/60 focus-within:ring-2 focus-within:ring-ring/15",
        disabled && "opacity-70",
        className,
      )}
    >
      {attachments.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 px-3 pt-3">
          {attachments.map((name) => (
            <span
              key={name}
              className="bg-secondary text-secondary-foreground inline-flex max-w-[14rem] items-center gap-1.5 rounded-md px-2 py-1 text-xs"
            >
              <Paperclip className="size-3 shrink-0 opacity-70" />
              <span className="truncate">{name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(name)}
                className="hover:bg-foreground/10 rounded-sm p-0.5 transition-colors"
                aria-label={`Remove ${name}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <textarea
        ref={textareaRef}
        value={text}
        rows={1}
        disabled={disabled}
        placeholder={placeholder}
        aria-label="Prompt"
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        className="placeholder:text-muted-foreground/70 block w-full resize-none scrollbar-subtle bg-transparent px-4 pt-3.5 pb-1 text-[0.9375rem] leading-6 outline-none disabled:cursor-not-allowed"
      />

      <div className="flex items-center gap-1 px-2 pt-1 pb-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={handleFiles}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          aria-label="Attach files"
          className="text-muted-foreground hover:text-foreground"
        >
          <Paperclip className="size-4" />
        </Button>

        {leading}

        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-muted-foreground/60 hidden text-[11px] sm:inline">
            {isGenerating ? "Generating…" : "Enter to send · Shift+Enter for a new line"}
          </span>

          {trailing}

          {isGenerating ? (
            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              onClick={onStop}
              aria-label="Stop generating"
              className="rounded-lg"
            >
              <Square className="size-3.5 fill-current" />
            </Button>
          ) : (
            <Button
              type="button"
              size="icon-sm"
              onClick={submit}
              disabled={!canSubmit}
              aria-label="Send prompt"
              className="rounded-lg transition-transform active:scale-95"
            >
              <ArrowUp className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ComposerHint() {
  return (
    <p className="text-muted-foreground/70 mt-2 flex items-center justify-center gap-1.5 text-center text-[11px]">
      <Sparkles className="size-3" />
      PCAI can make mistakes. Verify important information.
    </p>
  );
}
