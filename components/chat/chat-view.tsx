"use client";

import * as React from "react";
import { ChevronDown, Menu } from "lucide-react";

import { initialChats, models } from "@/lib/data";
import type { Chat, Message } from "@/lib/types";
import type { PromptComposerSubmitPayload } from "@/components/prompt-composer";
import { ComposerHint, PromptComposer } from "@/components/prompt-composer";
import { Sidebar } from "@/components/chat/sidebar";
import { MessageBubble } from "@/components/chat/message-bubble";
import { WelcomeScreen } from "@/components/chat/welcome-screen";
import {
  SettingsDialog,
  type ThemePreference,
} from "@/components/chat/settings-dialog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

function titleFromPrompt(prompt: string) {
  const clean = prompt.replace(/\s+/g, " ").trim();
  return clean.length > 42 ? `${clean.slice(0, 42)}…` : clean || "New chat";
}

export function ChatView() {
  const [chats, setChats] = React.useState<Chat[]>(initialChats);
  const [activeChatId, setActiveChatId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const [isSettingsOpen, setSettingsOpen] = React.useState(false);
  const [model, setModel] = React.useState<string>(models[0].id);
  const [theme, setTheme] = React.useState<ThemePreference>("dark");

  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? null;
  const messages = activeChat?.messages ?? [];
  const isEmpty = messages.length === 0;

  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Keep the newest message in view.
  React.useEffect(() => {
    const node = scrollRef.current?.querySelector<HTMLElement>(
      "[data-scroll-anchor]",
    );
    node?.scrollIntoView({ block: "end" });
  }, [messages.length, activeChatId]);

  // Theme preference -> <html class="dark">
  React.useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const isDark = theme === "dark" || (theme === "system" && prefersDark.matches);
      root.classList.toggle("dark", isDark);
    };
    apply();
    if (theme !== "system") return;
    prefersDark.addEventListener("change", apply);
    return () => prefersDark.removeEventListener("change", apply);
  }, [theme]);

  const startNewChat = React.useCallback(() => {
    setActiveChatId(null);
    setDraft("");
    setSidebarOpen(false);
  }, []);

  const selectChat = React.useCallback((id: string) => {
    setActiveChatId(id);
    setSidebarOpen(false);
  }, []);

  const deleteChat = React.useCallback((id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    setActiveChatId((current) => (current === id ? null : current));
  }, []);

  const handleSubmit = ({ text }: PromptComposerSubmitPayload) => {
    const message: Message = {
      id: createId(),
      role: "user",
      content: text,
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

    // First message in a fresh chat creates the conversation.
    const chat: Chat = {
      id: createId(),
      title: titleFromPrompt(text),
      messages: [message],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
  };

  const handleSuggestion = (prompt: string) => {
    setDraft(prompt);
  };

  return (
    <TooltipProvider>
      <div className="flex h-dvh w-full overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden w-64 shrink-0 md:block lg:w-72">
          <Sidebar
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={selectChat}
            onNewChat={startNewChat}
            onDeleteChat={deleteChat}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </div>

        {/* Mobile sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-72 p-0" showCloseButton={false}>
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Sidebar
              chats={chats}
              activeChatId={activeChatId}
              onSelectChat={selectChat}
              onNewChat={startNewChat}
              onDeleteChat={deleteChat}
              onOpenSettings={() => {
                setSidebarOpen(false);
                setSettingsOpen(true);
              }}
            />
          </SheetContent>
        </Sheet>

        {/* Main area */}
        <main className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="md:hidden"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open navigation"
                >
                  <Menu className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Navigation</TooltipContent>
            </Tooltip>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {activeChat?.title ?? "New chat"}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground h-8 gap-1.5 font-normal"
                >
                  <span className="max-w-24 truncate font-mono text-xs">
                    {model}
                  </span>
                  <ChevronDown className="size-3.5 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {models.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onSelect={() => setModel(item.id)}
                    className="font-mono text-xs"
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <div className="flex min-h-0 flex-1 flex-col">
            {isEmpty ? (
              <div className="scrollbar-subtle flex min-h-0 flex-1 flex-col overflow-y-auto">
                <WelcomeScreen onSuggestionSelect={handleSuggestion} />
              </div>
            ) : (
              <ScrollArea
                className="min-h-0 flex-1"
                viewportClassName="scrollbar-subtle"
              >
                <div
                  ref={scrollRef}
                  className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6"
                >
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  <div data-scroll-anchor />
                </div>
              </ScrollArea>
            )}

            <div className="shrink-0 px-3 pb-3 sm:px-6 sm:pb-5">
              <div className="mx-auto w-full max-w-3xl">
                <PromptComposer
                  value={draft}
                  onValueChange={setDraft}
                  onSubmit={handleSubmit}
                  autoFocus
                />
                <ComposerHint />
              </div>
            </div>
          </div>
        </main>
      </div>

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setSettingsOpen}
        model={model}
        onModelChange={setModel}
        theme={theme}
        onThemeChange={setTheme}
      />
    </TooltipProvider>
  );
}
