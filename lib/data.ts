import type { Chat } from "@/lib/types";

const now = Date.now();

export const models = [
  { id: "llama3.2", label: "llama3.2" },
  { id: "qwen2.5", label: "qwen2.5" },
  { id: "mistral", label: "mistral" },
] as const;

export const suggestions = [
  {
    title: "Explain a concept",
    description: "Break down a tricky idea in simple terms",
    prompt: "Explain how vector databases work, in simple terms.",
  },
  {
    title: "Write something",
    description: "Draft a message, post or email",
    prompt: "Write a short, friendly email asking for a project update.",
  },
  {
    title: "Debug my code",
    description: "Paste an error and get a fix",
    prompt: "Help me debug a React component that re-renders infinitely.",
  },
  {
    title: "Plan my day",
    description: "Turn a messy list into a schedule",
    prompt: "Turn my task list into a focused plan for the day.",
  },
] as const;

/**
 * Placeholder conversations so the layout can be reviewed without a backend.
 * Nothing here talks to a model — it is static frontend data.
 */
export const initialChats: Chat[] = [
  {
    id: "welcome",
    title: "Welcome to PCAI",
    createdAt: now - 1000 * 60 * 60 * 26,
    updatedAt: now - 1000 * 60 * 60 * 26,
    messages: [
      {
        id: "welcome-1",
        role: "user",
        content: "Hey PCAI, what can you help me with?",
        createdAt: now - 1000 * 60 * 60 * 26,
      },
      {
        id: "welcome-2",
        role: "assistant",
        content:
          "Hi! I'm PCAI — a local-first AI workspace.\n\nYou can ask me to explain ideas, draft writing, review code, or think through a plan. This screen is a preview: once the backend is connected, replies will stream in right here.",
        createdAt: now - 1000 * 60 * 60 * 26 + 1000 * 6,
      },
    ],
  },
];
