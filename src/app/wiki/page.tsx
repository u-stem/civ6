import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CIVILIZATIONS, VICTORY_GUIDES } from "@/data";
import { VICTORY_LABELS } from "@/data/labels";
import { VICTORY_TYPES } from "@/lib/schema";

export default function WikiIndex() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">wiki</h1>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          文明
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {CIVILIZATIONS.map((c) => (
            <Link key={c.id} href={`/wiki/civ/${c.id}`} className="block">
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <CardTitle>{c.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {c.ability.name}
                  </p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          勝利条件
        </h2>
        <div className="space-y-3">
          {VICTORY_TYPES.map((v) => {
            const guide = VICTORY_GUIDES[v];
            return (
              <Card key={v}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">
                      {VICTORY_LABELS[v]}勝利
                    </CardTitle>
                    {!guide && <Badge variant="outline">準備中</Badge>}
                  </div>
                </CardHeader>
                {guide && (
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {guide}
                    </p>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
