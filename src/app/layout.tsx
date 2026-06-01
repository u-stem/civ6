import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Civ6 勝利タスク",
  description: "Civ6 の勝利条件別タスクリストを生成・管理するローカルツール",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning className={cn(geist.variable)}>
      <body className="min-h-dvh font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider delayDuration={200}>
            <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-sm">
              <div className="mx-auto flex max-w-5xl items-center gap-6 px-5 py-3">
                <Link href="/" className="font-semibold tracking-tight">
                  Civ6 勝利タスク
                </Link>
                <nav className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Link
                    href="/"
                    className="transition-colors hover:text-foreground"
                  >
                    ルート
                  </Link>
                  <Link
                    href="/wiki"
                    className="transition-colors hover:text-foreground"
                  >
                    wiki
                  </Link>
                </nav>
                <div className="ml-auto">
                  <ThemeToggle />
                </div>
              </div>
            </header>
            {children}
            <Toaster richColors position="top-center" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
