"use client";

import * as React from "react";
import { MessageSquare, MoreHorizontal, Plus, Settings, Trash2 } from "lucide-react";

import { cn, formatRelativeDay } from "@/lib/utils";
import type { Chat } from "@/lib/types";
import { PcaiWordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onOpenSettings: () => void;
  className?: string;
}

const dayOrder = [
  "Today",
  "Yesterday",
  "Previous 7 days",
  "Previous 30 days",
  "Older",
];

export function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onOpenSettings,
  className,
}: SidebarProps) {
  const grouped = React.useMemo(() => {
    const map = new Map<string, Chat[]>();
    for (const chat of [...chats].sort((a, b) => b.updatedAt - a.updatedAt)) {
      const key = formatRelativeDay(chat.updatedAt);
      map.set(key, [...(map.get(key) ?? []), chat]);
    }
    return dayOrder
      .filter((day) => map.has(day))
      .map((day) => ({ day, items: map.get(day)! }));
  }, [chats]);

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground border-sidebar-border flex h-full w-full flex-col border-r",
        className,
      )}
      aria-label="Chat navigation"
    >
      <div className="flex h-14 shrink-0 items-center justify-between px-4">
        <PcaiWordmark />
      </div>

      <div className="px-3 pb-3">
        <Button
          onClick={onNewChat}
          variant="outline"
          className="border-sidebar-border bg-sidebar-accent/40 hover:bg-sidebar-accent h-9 w-full justify-start gap-2 font-normal"
        >
          <Plus className="size-4" />
          New chat
        </Button>
      </div>

      <ScrollArea className="min-h-0 flex-1" viewportClassName="scrollbar-subtle">
        <nav className="px-2 pb-4">
          {grouped.length === 0 ? (
            <p className="text-muted-foreground px-2 py-6 text-center text-xs">
              No conversations yet.
            </p>
          ) : (
            grouped.map(({ day, items }) => (
              <div key={day} className="mb-3">
                <p className="text-muted-foreground/80 px-2 pt-2 pb-1.5 text-[10px] font-medium tracking-wider uppercase">
                  {day}
                </p>
                <ul className="space-y-0.5">
                  {items.map((chat) => {
                    const isActive = chat.id === activeChatId;
                    return (
                      <li key={chat.id}>
                        <div
                          className={cn(
                            "group/item relative flex items-center rounded-lg transition-colors",
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "hover:bg-sidebar-accent/60",
                          )}
                        >
                          <button
                            onClick={() => onSelectChat(chat.id)}
                            aria-current={isActive ? "page" : undefined}
                            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-2 text-left text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                          >
                            <MessageSquare className="text-muted-foreground size-3.5 shrink-0" />
                            <span className="truncate">{chat.title}</span>
                          </button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="mr-1 size-7 shrink-0 opacity-0 transition-opacity group-hover/item:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
                                aria-label={`Options for ${chat.title}`}
                              >
                                <MoreHorizontal className="size-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => onDeleteChat(chat.id)}
                              >
                                <Trash2 className="size-4" />
                                Delete chat
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </nav>
      </ScrollArea>

      <div className="border-sidebar-border shrink-0 border-t p-2">
        <Button
          variant="ghost"
          onClick={onOpenSettings}
          className="text-muted-foreground hover:text-foreground h-9 w-full justify-start gap-2.5 font-normal"
        >
          <Settings className="size-4" />
          Settings
        </Button>
      </div>
    </aside>
  );
}
