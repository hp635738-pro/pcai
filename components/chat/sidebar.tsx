"use client";

import * as React from "react";
import { Menu, Plus, Settings, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Chat } from "@/lib/types";

/* ------------------------------------------------------------------ *
 * Shell only: PCAI branding + New chat + history + Settings.
 * Every visible primitive (Button, ScrollArea, Separator, Sheet) is the
 * unmodified shadcn/ui component.
 * ------------------------------------------------------------------ */

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onOpenSettings: () => void;
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-3 py-3.5">
      <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md text-[12px] font-semibold">
        P
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-tight">PCAI</span>
        <span className="text-muted-foreground mt-1 text-[10px]">
          local ai workspace
        </span>
      </div>
    </div>
  );
}

function SidebarBody({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onOpenSettings,
}: SidebarProps) {
  return (
    <div className="bg-sidebar text-sidebar-foreground flex h-full w-full flex-col">
      <Brand />
      <div className="px-3 pb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onNewChat}
          className="w-full justify-start gap-2 font-normal"
        >
          <Plus className="size-4" />
          New chat
        </Button>
      </div>

      <Separator className="my-1" />

      <ScrollArea className="min-h-0 flex-1">
        <div className="scrollbar-subtle px-2 py-2">
          {chats.length === 0 ? (
            <p className="text-muted-foreground px-2 py-6 text-center text-xs">
              No chats yet
            </p>
          ) : (
            <ul className="space-y-0.5">
              {chats.map((chat) => (
                <li key={chat.id}>
                  <div
                    className={cn(
                      "group flex items-center rounded-md",
                      chat.id === activeChatId
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/60",
                    )}
                  >
                    <button
                      onClick={() => onSelectChat(chat.id)}
                      className="min-w-0 flex-1 truncate px-2 py-1.5 text-left text-[13px]"
                      title={chat.title}
                    >
                      {chat.title}
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 shrink-0 opacity-0 group-hover:opacity-100"
                      onClick={() => onDeleteChat(chat.id)}
                      aria-label={`Delete ${chat.title}`}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </ScrollArea>

      <Separator />
      <div className="p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenSettings}
          className="text-muted-foreground hover:text-foreground w-full justify-start gap-2 font-normal"
        >
          <Settings className="size-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}

export function Sidebar(props: SidebarProps) {
  return (
    <aside className="hidden w-60 shrink-0 border-r md:block lg:w-64">
      <SidebarBody {...props} />
    </aside>
  );
}

/** Mobile drawer wrapper around the same sidebar body. */
export function MobileSidebar(props: SidebarProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation">
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SidebarBody
          {...props}
          onSelectChat={(id) => {
            props.onSelectChat(id);
            setOpen(false);
          }}
          onNewChat={() => {
            props.onNewChat();
            setOpen(false);
          }}
          onOpenSettings={() => {
            props.onOpenSettings();
            setOpen(false);
          }}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        >
          <X className="size-4" />
        </Button>
      </SheetContent>
    </Sheet>
  );
}
