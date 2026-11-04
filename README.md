# PCAI

A local AI chat workspace — **frontend only**. Built by copying components
from public registries and open-source repos. No backend, no model calls, no
Ollama, nothing persisted.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npx next start
```

Checks: `npx tsc --noEmit` · `npx eslint .` · `npm run build`.

---

## Provenance — exactly where every piece came from

### 1. Prompt composer (the input box) — 21st.dev

| | |
|---|---|
| Registry page | https://21st.dev/@kedhareswer/components/prompt-composer |
| Install command | `npx shadcn@latest add "https://21st.dev/r/kedhareswer/prompt-composer"` |
| Source file | https://github.com/Kedhareswer/21stdev-my-components/blob/main/components/prompt-composer/prompt-composer.tsx |
| Component docs | https://github.com/Kedhareswer/21stdev-my-components/blob/main/components/prompt-composer/README.md |
| Copied to | `components/ui/prompt-composer.tsx` (663 lines, verbatim) |
| Required dep | `gsap` |

21st.dev's "Code" tab publishes only the demo file (component source needs an
account), so the file came from the author's own repo — same code.

Changes: added an `initialValue?: string` prop (3 lines) so a suggestion card
can seed the textarea, and it's used with `simulate={false}` so a send clears
the box instead of playing the demo build log. Everything else — typing
placeholder, platform chips, model menu, attachments, breathing send button,
`PPC_CSS`, gsap timelines — untouched.

### 2. Sidebar — shadcn/ui `sidebar-07` block

| | |
|---|---|
| Repo | https://github.com/shadcn-ui/ui |
| Block | https://github.com/shadcn-ui/ui/tree/main/apps/v4/registry/new-york-v4/blocks/sidebar-07 |
| Files copied | `components/app-sidebar.tsx`, `components/nav-main.tsx`, `components/nav-projects.tsx`, `components/nav-user.tsx`, `components/team-switcher.tsx` |
| Copied to | `components/chat/app-sidebar.tsx`, `components/blocks/*.tsx` |
| Primitive | `apps/v4/registry/new-york-v4/ui/sidebar.tsx` (726 lines) → `components/ui/sidebar.tsx` |
| Hook | `hooks/use-mobile.ts` → `hooks/use-mobile.ts` |

The block's structure is kept as-is: `Sidebar collapsible="icon"` with
`SidebarHeader` / `SidebarContent` / `SidebarFooter` / `SidebarRail`, the
`Collapsible` + `SidebarMenuSub` tree, and `NavUser` for the footer. Only the
data is swapped — chats replace the sample nav items, and a New chat /
Settings entry was added to the header and footer.

`NavUser` still does its avatar / dropdown behaviour (Account, Billing,
Notifications, Log out). Those menu entries are inert — there is no backend.

### 3. Message list, conversation, streaming view — Vercel ai-elements

| | |
|---|---|
| Repo | https://github.com/vercel/ai-elements |
| Files copied | [`packages/elements/src/conversation.tsx`](https://github.com/vercel/ai-elements/blob/main/packages/elements/src/conversation.tsx), [`packages/elements/src/message.tsx`](https://github.com/vercel/ai-elements/blob/main/packages/elements/src/message.tsx) |
| Copied to | `components/ai-elements/conversation.tsx`, `components/ai-elements/message.tsx` |
| Used by | `components/chat/chat-thread.tsx` |

Unmodified apart from the import alias (`@repo/shadcn-ui/*` → `@/*`). This
supplies `Conversation` (stick-to-bottom scroll), `ConversationEmptyState`,
`ConversationScrollButton`, `Message`, `MessageContent`, `MessageResponse`
(markdown via Streamdown), `MessageActions`, `MessageToolbar`, and the branch
navigation parts. Dependencies installed: `ai`, `streamdown`,
`@streamdown/{cjk,code,math,mermaid}`, `use-stick-to-bottom`, `nanoid`.

### 4. shadcn/ui primitives

| | |
|---|---|
| Repo | https://github.com/shadcn-ui/ui |
| Path | `apps/v4/registry/new-york-v4/ui/` (new-york-v4, zinc base) |
| Files | `button`, `card`, `dialog`, `sheet`, `scroll-area`, `tooltip`, `dropdown-menu`, `textarea`, `input`, `separator`, `avatar`, `badge`, `skeleton`, `spinner`, `button-group`, `empty`, `collapsible`, `sidebar` |
| Also | `apps/v4/registry/new-york-v4/blocks/sidebar-07/*` (see above) |

Import aliases adjusted only (`"cn"` → `@/lib/utils`, `@/registry/new-york-v4/...` →
`@/components/ui/...`), which is what the shadcn CLI does on install.

### 5. Design tokens

`app/globals.css` is the stock shadcn v4 token set (`.dark` + `:root`), with
Tailwind v4 `@theme inline` mapping. Dark is the default.

---

## Hand-written glue

Only wiring, no visual design:

| File | Role |
|---|---|
| `components/chat/pcai-app.tsx` | chat state, composition of the three copied pieces |
| `components/chat/chat-composer.tsx` | passes PCAI copy (suggestions, model names, chips) to the 21st.dev composer |
| `components/chat/chat-thread.tsx` | maps `Message[]` onto ai-elements and adds a copy action |
| `components/chat/settings-dialog.tsx` | model list placeholder inside the shadcn Dialog |
| `lib/types.ts`, `lib/data.ts`, `lib/utils.ts` | types, copy, `cn()` |
| `app/page.tsx`, `app/layout.tsx` | entry |

## Scope

Frontend only. No API routes, no model management, no system configuration.
Nothing outside this directory is touched.
