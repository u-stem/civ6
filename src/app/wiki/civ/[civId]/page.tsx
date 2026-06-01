import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCivilization } from "@/data";

export default async function CivPage({
  params,
}: {
  params: Promise<{ civId: string }>;
}) {
  const { civId } = await params;
  const civ = getCivilization(civId);

  if (!civ) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-8">
        <p className="text-muted-foreground">
          文明が見つかりません。
          <Link href="/wiki" className="ml-1 underline">
            wiki へ戻る
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
      <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
        <Link href="/wiki">
          <ArrowLeft className="size-4" />
          wiki
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold tracking-tight">{civ.name}</h1>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">
            文明特性 ・ {civ.ability.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {civ.ability.description}
          </p>
        </CardContent>
      </Card>

      <h2 className="mt-6 mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        指導者
      </h2>
      <div className="space-y-3">
        {civ.leaders.map((l) => (
          <Card key={l.id}>
            <CardHeader>
              <CardTitle className="text-base">{l.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <Badge variant="secondary" className="mb-1.5">
                  能力
                </Badge>
                <p className="font-medium">{l.ability.name}</p>
                <p className="leading-relaxed text-muted-foreground">
                  {l.ability.description}
                </p>
              </div>
              {l.agenda && (
                <div>
                  <Badge variant="secondary" className="mb-1.5">
                    アジェンダ
                  </Badge>
                  <p className="font-medium">{l.agenda.name}</p>
                  <p className="leading-relaxed text-muted-foreground">
                    {l.agenda.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mt-6 mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        固有ユニット・施設
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {civ.uniqueUnits.map((u) => (
          <Card key={u.name}>
            <CardHeader>
              <CardTitle className="text-base">{u.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {u.description}
              </p>
            </CardContent>
          </Card>
        ))}
        {civ.uniqueInfrastructure.map((u) => (
          <Card key={u.name}>
            <CardHeader>
              <CardTitle className="text-base">
                {u.name}
                {u.replaces && (
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    （{u.replaces}を置換）
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {u.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
