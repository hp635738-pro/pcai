# PCAI

A minimal, dark-themed **local AI chat workspace** — frontend only.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4 and shadcn/ui
primitives. No backend, no model calls: the UI is fully interactive but
replies are not generated yet.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build
npm run lint       # eslint
npx tsc --noEmit   # type check
```

## What's included

- **Sidebar** — PCAI branding, New chat, chat history grouped by day
  (with per-chat delete), Settings button.
- **Chat area** — welcome screen with prompt suggestions, user/AI message
  bubbles (distinct styles), copy button on AI messages, auto-scrolling thread.
- **Prompt Composer** — auto-growing input, attachment chips, Enter to send,
  Shift+Enter for a newline, send button.
- **Settings dialog** — model picker (placeholder list) and appearance
  (dark / light / system).
- **Responsive** — sidebar collapses into a slide-over sheet under `md`.

## Structure

```
app/
  layout.tsx                 app shell, dark theme, metadata
  page.tsx                   renders <ChatView />
  globals.css                design tokens + Tailwind theme
components/
  brand.tsx                  PCAI logo / wordmark
  prompt-composer.tsx        Prompt Composer (+ hint)
  chat/
    chat-view.tsx            state + layout composition
    sidebar.tsx              branding, new chat, history, settings
    message-bubble.tsx       user / AI bubbles
    welcome-screen.tsx       empty state + suggestion cards
    settings-dialog.tsx      model + appearance preferences
  ui/                        shadcn/ui primitives
lib/
  types.ts                   Chat / Message types
  data.ts                    placeholder chats, models, suggestions
  utils.ts                   cn() + helpers
```

All conversation state lives in `ChatView` (in-memory). Swapping in a real
API later only requires replacing `handleSubmit` and adding a streaming
assistant message.

## Prompt Composer (21st.dev)

The composer here is a local, dependency-light implementation of the
21st.dev "Prompt Composer" block, so the project builds without network
access. If you want the upstream block, run this in the project root and
replace the import in `components/chat/chat-view.tsx`:

```bash
npx shadcn@latest add "https://21st.dev/r/kedhareswer/prompt-composer"
```

`components.json` already registers the `@21st` registry
(`"@21st": "https://21st.dev/r/{name}"`), so `npx shadcn@latest add @21st/prompt-composer`
works as well.

## Scope

Frontend only — no API routes, no Ollama connection, no model management.
Nothing outside this project directory is touched.
