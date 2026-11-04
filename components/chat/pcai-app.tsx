"use client";

import * as React from "react";

import { ChatComposer } from "@/components/chat/chat-composer";
import { MessageList } from "@/components/chat/message-list";
import { MobileSidebar, Sidebar } from "@/components/chat/sidebar";
import { SettingsDialog } from "@/components/chat/settings-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ComposerSubmit } from "@/components/ui/prompt-composer";
import { suggestions } from "@/lib/data";
import type { Chat, Message } from "@/lib/types";

/**
 * Application shell: owns chat state and composes the sidebar, the message
 * list and the 21st.dev Prompt Composer. No backend — messages are kept in
 * memory and nothing is generated.
 */
export function PcaiApp() {
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = React.useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<string | null>(null);
  const [composerKey, setComposerKey] = React.useState(0);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;
  const messages = activeChat?.messages ?? [];

  const scrollRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length, activeChatId]);

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
      title: prompt.length > 38 ? `${prompt.slice(0, 38)}…` : prompt,
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

  const sidebarProps = {
    chats,
    activeChatId,
    onSelectChat: setActiveChatId,
    onNewChat: newChat,
    onDeleteChat: (id: string) => {
      setChats((prev) => prev.filter((chat) => chat.id !== id));
      setActiveChatId((current) => (current === id ? null : current));
    },
    onOpenSettings: () => setSettingsOpen(true),
  };

  return (
    <>
      <div className="flex h-dvh w-full overflow-hidden">
        <Sidebar {...sidebarProps} />

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
            <MobileSidebar {...sidebarProps} />
            <p className="truncate text-sm font-medium">
              {activeChat?.title ?? "New chat"}
            </p>
          </header>

          <ScrollArea
            className="min-h-0 flex-1"
            ref={scrollRef as React.Ref<HTMLDivElement>}
          >
            <MessageList
              messages={messages}
              suggestions={suggestions}
              onSuggestion={pickSuggestion}
            />
          </ScrollArea>

          <div className="shrink-0 px-4 pb-4">
            <div className="mx-auto w-full max-w-2xl">
              <ChatComposer
                key={composerKey}
                onSubmit={handleSubmit}
                initialValue={draft ?? undefined}
              />
            </div>
          </div>
        </main>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
