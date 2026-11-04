import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Groups chat timestamps into human friendly buckets for the sidebar. */
export function formatRelativeDay(timestamp: number) {
  const date = new Date(timestamp);
  const now = new Date();

  const startOfDay = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();

  const diffInDays = Math.round(
    (startOfDay(now) - startOfDay(date)) / 86_400_000,
  );

  if (diffInDays <= 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return "Previous 7 days";
  if (diffInDays < 30) return "Previous 30 days";
  return "Older";
}
