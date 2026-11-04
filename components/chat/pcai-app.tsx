"use client";

import * as React from "react";
import { SparklesIcon } from "lucide-react";

import { AppSidebar } from "@/components/chat/app-sidebar";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatThread } from "@/components/chat/chat-thread";
import { SettingsDialog } from "@/components/chat/settings-dialog";
import {
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import type { ComposerSubmit } from "@/components/ui/prompt-composer";
import { suggestions } from "@/lib/data";
import type { Chat, Message } from "@/lib/types";

/**
 * Shell: owns chat state and composes
 *   - shadcn/ui sidebar-07 sidebar  (components/chat/app-sidebar.tsx)
 *   - Vercel ai-elements thread     (components/chat/chat-thread.tsx)
 *   - 21st.dev prompt composer      (components/chat/chat-composer.tsx)
 * No backend: messages live in memory.
 */
export function PcaiApp() {
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = React.useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<string | null>(null);
  const [composerKey, setComposerKey] = React.useState(0);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;
  const messages = activeChat?.messages ?? [];

  const handleSubmit = ({ prompt }: ComposerSubmit) => {
    const message: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
      createdAt: Date.now(),
    };

    if (activeChat) {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat.id
            ? {
                ...chat,
                messages: [...chat.messages, message],
                updatedAt: Date.now(),
              }
            : chat,
        ),
      );
      return;
    }

    const chat: Chat = {
      id: crypto.randomUUID(),
      title: prompt.length > 34 ? `${prompt.slice(0, 34)}…` : prompt,
      messages: [message],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
  };

  const newChat = () => {
    setActiveChatId(null);
    setDraft(null);
    setComposerKey((k) => k + 1);
  };

  const pickSuggestion = (prompt: string) => {
    setDraft(prompt);
    setComposerKey((k) => k + 1);
  };

  return (
    <>
      <SidebarProvider>
        <AppSidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={setActiveChatId}
          onNewChat={newChat}
          onDeleteChat={(id) => {
            setChats((prev) => prev.filter((chat) => chat.id !== id));
            setActiveChatId((current) => (current === id ? null : current));
          }}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        <SidebarInset className="flex h-dvh flex-col overflow-hidden">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-1 data-[orientation=vertical]:h-4"
            />
            <p className="truncate text-sm font-medium">
              {activeChat?.title ?? "New chat"}
            </p>
          </header>

          <div className="flex min-h-0 flex-1 flex-col">
            {messages.length === 0 ? (
              <div className="flex min-h-0 flex-1 items-center justify-center px-4">
                <div className="w-full max-w-2xl">
                  <ConversationEmptyState>
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-muted-foreground">
                        <SparklesIcon className="size-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium">
                          How can I help you today?
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          PCAI runs locally. Pick a suggestion or type below.
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 grid w-full gap-2 sm:grid-cols-2">
                      {suggestions.map((prompt) => (
                        <Button
                          key={prompt}
                          variant="outline"
                          onClick={() => pickSuggestion(prompt)}
                          className="h-auto justify-start px-3 py-2.5 text-left text-xs font-normal whitespace-normal"
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </ConversationEmptyState>
                </div>
              </div>
            ) : (
              <div className="min-h-0 flex-1">
                <ChatThread messages={messages} />
              </div>
            )}

            <div className="shrink-0 border-t px-4 py-3">
              <div className="mx-auto w-full max-w-2xl">
                <ChatComposer
                  key={composerKey}
                  onSubmit={handleSubmit}
                  initialValue={draft ?? undefined}
                />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
