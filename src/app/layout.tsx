import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Civ6 勝利タスク",
  description: "Civ6 の勝利条件別タスクリストを生成・管理するローカルツール",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header className="site-header">
          <div className="inner">
            <Link href="/" className="brand">
              Civ6 勝利タスク
            </Link>
            <Link href="/">ゲーム</Link>
            <Link href="/wiki">wiki</Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
