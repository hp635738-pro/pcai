"use client";

import * as React from "react";
import { CopyIcon, RefreshCwIcon, ThumbsUpIcon } from "lucide-react";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
  MessageToolbar,
} from "@/components/ai-elements/message";
import { SparklesIcon } from "lucide-react";
import type { Message as ChatMessage } from "@/lib/types";

/**
 * Thread renderer.
 *
 * Both wrappers are copied unmodified from Vercel's ai-elements
 * (packages/elements/src/conversation.tsx and message.tsx). This file only
 * maps PCAI's message array onto them.
 */
export function ChatThread({
  messages,
  emptyState,
}: {
  messages: ChatMessage[];
  emptyState?: React.ReactNode;
}) {
  return (
    <Conversation className="relative w-full">
      <ConversationContent className="mx-auto w-full max-w-2xl gap-6 px-4 py-6">
        {messages.length === 0 ? (
          emptyState ?? (
            <ConversationEmptyState
              icon={<SparklesIcon className="size-6" />}
              title="No messages yet"
              description="Type below to start a conversation."
            />
          )
        ) : (
          messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                <MessageResponse>{message.content}</MessageResponse>
              </MessageContent>
              {message.role === "assistant" && (
                <MessageToolbar>
                  <MessageActions>
                    <CopyAction content={message.content} />
                    <MessageAction tooltip="Not wired up yet">
                      <ThumbsUpIcon />
                    </MessageAction>
                    <MessageAction tooltip="Not wired up yet">
                      <RefreshCwIcon />
                    </MessageAction>
                  </MessageActions>
                </MessageToolbar>
              )}
            </Message>
          ))
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}

function CopyAction({ content }: { content: string }) {
  const [copied, setCopied] = React.useState(false);

  return (
    <MessageAction
      tooltip={copied ? "Copied" : "Copy"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(content);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        } catch {
          /* clipboard blocked */
        }
      }}
    >
      <CopyIcon />
    </MessageAction>
  );
}
