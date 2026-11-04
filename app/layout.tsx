import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PCAI — Local AI Workspace",
  description:
    "PCAI is a minimal, local-first AI chat workspace. Frontend preview build.",
  applicationName: "PCAI",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark h-full" suppressHydrationWarning>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
