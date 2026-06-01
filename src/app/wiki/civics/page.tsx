import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ResearchTree } from "@/components/ResearchTree";
import { Button } from "@/components/ui/button";
import { CIVICS } from "@/data/research";

export default function CivicsTreePage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
      <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
        <Link href="/wiki">
          <ArrowLeft className="size-4" />
          wiki
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold tracking-tight">社会制度ツリー</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        文化で進む研究ツリー（文明の興亡基準）。ひらめき条件を満たすと必要文化が半減します。
        政府・政策カード・劇場広場などの解禁元で、文化勝利の土台になります。
      </p>
      <ResearchTree nodes={CIVICS} />
    </main>
  );
}
