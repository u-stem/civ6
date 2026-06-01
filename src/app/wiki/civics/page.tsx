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
        文化で進む研究ツリー（文明の興亡基準）。天啓条件を満たすと、その社会制度に必要な文化力が軽減されます。政府・政策カードもここで解禁されます。
      </p>
      <ResearchTree nodes={CIVICS} />
    </main>
  );
}
