import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ResearchTree } from "@/components/ResearchTree";
import { Button } from "@/components/ui/button";
import { TECHNOLOGIES } from "@/data/research";

export default function TechTreePage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
      <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
        <Link href="/wiki">
          <ArrowLeft className="size-4" />
          wiki
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold tracking-tight">
        テクノロジーツリー
      </h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        科学で進む研究ツリー（文明の興亡基準）。ユーレカ条件を満たすと必要科学が半減します。
        バビロンはユーレカ達成で技術が即解禁されるため、各ユーレカが攻略の鍵になります。
      </p>
      <ResearchTree nodes={TECHNOLOGIES} />
    </main>
  );
}
