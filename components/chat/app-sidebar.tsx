"use client";

import * as React from "react";
import { ChevronRight, MessageSquare, Plus, Settings2, Trash2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { NavUser } from "@/components/blocks/nav-user";
import type { Chat } from "@/lib/types";

/**
 * PCAI sidebar.
 *
 * Layout and primitives are copied from the shadcn/ui "sidebar-07" block
 * (apps/v4/registry/new-york-v4/blocks/sidebar-07) — the same Sidebar* parts,
 * Collapsible sub-menu and NavUser footer. Only the data differs: chats
 * replace the sample nav items.
 */
export function AppSidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onOpenSettings,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onOpenSettings: () => void;
}) {
  const { isMobile, setOpenMobile } = useSidebar();

  const pick = (id: string) => {
    onSelectChat(id);
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="PCAI">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg text-sm font-semibold">
                P
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">PCAI</span>
                <span className="truncate text-xs">local ai workspace</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="New chat" onClick={onNewChat}>
              <Plus />
              <span>New chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarMenu>
            {chats.length === 0 ? (
              <SidebarMenuItem>
                <SidebarMenuButton disabled>
                  <MessageSquare />
                  <span>No chats yet</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              chats.map((chat) => (
                <Collapsible
                  key={chat.id}
                  asChild
                  defaultOpen={chat.id === activeChatId}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={chat.title}
                        isActive={chat.id === activeChatId}
                        onClick={() => pick(chat.id)}
                      >
                        <MessageSquare />
                        <span>{chat.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <SidebarMenuAction
                      showOnHover
                      aria-label={`Delete ${chat.title}`}
                      onClick={() => onDeleteChat(chat.id)}
                    >
                      <Trash2 />
                    </SidebarMenuAction>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {chat.messages.length === 0 ? (
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton>
                              <span>Empty</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ) : (
                          chat.messages.slice(0, 4).map((message) => (
                            <SidebarMenuSubItem key={message.id}>
                              <SidebarMenuSubButton>
                                <span>
                                  {message.role === "user" ? "You: " : "PCAI: "}
                                  {message.content.slice(0, 28)}
                                </span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings" onClick={onOpenSettings}>
              <Settings2 />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser
          user={{
            name: "Local user",
            email: "on this machine",
            avatar: "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export { Button as SidebarButton };
