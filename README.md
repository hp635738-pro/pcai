# PCAI

A local AI chat workspace — **frontend only**. Dark, minimal, built with
Next.js (App Router), TypeScript, Tailwind CSS v4 and shadcn/ui.

No backend, no model calls, no Ollama integration: messages stay in memory
and nothing is generated.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npx next start   # serve the production build
```

Checks: `npx tsc --noEmit` · `npx eslint .` · `npm run build`.

## Where the code came from

The UI is **not hand-written**. Components are copied from these public
sources (links point at the exact files):

### 1. Prompt Composer (the input box) — 21st.dev

| | |
|---|---|
| Registry page | https://21st.dev/@kedhareswer/components/prompt-composer |
| Install command | `npx shadcn@latest add "https://21st.dev/r/kedhareswer/prompt-composer"` |
| Author's source repo | https://github.com/Kedhareswer/21stdev-my-components |
| File copied | [`components/prompt-composer/prompt-composer.tsx`](https://github.com/Kedhareswer/21stdev-my-components/blob/main/components/prompt-composer/prompt-composer.tsx) |
| Component README | [`components/prompt-composer/README.md`](https://github.com/Kedhareswer/21stdev-my-components/blob/main/components/prompt-composer/README.md) |
| Landed in project | `components/ui/prompt-composer.tsx` (663 lines) |

21st.dev's own "Code" tab only publishes the *demo* file; the component source
needs an account. The author's repository is the same source, so the file was
taken from there — visually and functionally identical.

Two changes, both mechanical:

1. `initialValue?: string` prop added (3 lines) so a suggestion card can seed
   the textarea.
2. Used with `simulate={false}` from `components/chat/chat-composer.tsx`, so a
   send clears the box instead of playing the demo "build log / preview card".

Everything else — the typing placeholder, platform chips, model menu, file
attachments, breathing send button, the `PPC_CSS` block, gsap animations — is
untouched. `gsap` is installed because the component requires it.

### 2. shadcn/ui primitives

| | |
|---|---|
| Repo | https://github.com/shadcn-ui/ui |
| Path | `apps/v4/registry/new-york-v4/ui/` (new-york-v4, zinc dark) |
| Files copied | `button`, `dialog`, `sheet`, `scroll-area`, `tooltip`, `dropdown-menu`, `textarea`, `input`, `separator`, `avatar`, `badge` |
| Landed in project | `components/ui/*.tsx` |

Only the import alias was adjusted (`from "cn"` → `from "@/lib/utils"`), which
is what the shadcn CLI does on install. Design tokens in `app/globals.css` are
the stock shadcn v4 token set, dark-first.

## What's in the app

- **Sidebar** (`components/chat/sidebar.tsx`) — PCAI wordmark, New chat, chat
  history with delete, Settings. Collapses into a `Sheet` drawer on mobile.
- **Messages** (`components/chat/message-list.tsx`) — welcome screen with
  suggestion cards, user bubbles right / assistant bubbles left, copy button.
- **Composer** (`components/chat/chat-composer.tsx`) — the 21st.dev block,
  wired to submit into the thread.
- **Settings** (`components/chat/settings-dialog.tsx`) — model list, placeholder.
- **Shell** (`components/chat/pcai-app.tsx`) — owns chat state, no persistence.

## Structure

```
app/
  layout.tsx                 metadata + dark root
  page.tsx                   renders <PcaiApp />
  globals.css                shadcn v4 design tokens
components/
  chat/
    pcai-app.tsx             state + layout composition
    sidebar.tsx              branding, new chat, history, settings + mobile drawer
    message-list.tsx         welcome screen and message bubbles
    chat-composer.tsx        adapter around the 21st.dev composer
    settings-dialog.tsx      preferences dialog
  ui/
    prompt-composer.tsx      ← 21st.dev (kedhareswer)
    *.tsx                    ← shadcn/ui
lib/
  types.ts                   Chat / Message
  data.ts                    suggestion prompts, model names
  utils.ts                   cn()
```

## Scope

Frontend only. No API routes, no model management, no system configuration.
Everything lives inside this project directory.
