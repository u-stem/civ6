import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ERA_LABELS } from "@/data/labels";
import { getNode, groupByEra } from "@/data/research";
import type { ResearchNode } from "@/lib/schema";

function ResearchNodeCard({ node }: { node: ResearchNode }) {
  const prereqs = node.prerequisites.map((p) => getNode(p)?.nameJa ?? p);
  const boostLabel = node.kind === "tech" ? "ひらめき" : "天啓";
  const costLabel = node.kind === "tech" ? "科学" : "文化";

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-baseline justify-between gap-2">
          <CardTitle className="text-base">{node.nameJa}</CardTitle>
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {node.cost} {costLabel}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{node.nameEn}</p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {prereqs.length > 0 && (
          <p className="text-xs text-muted-foreground">
            前提: {prereqs.join("、")}
          </p>
        )}
        {node.boost && (
          <p className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
            {boostLabel}: {node.boost.conditionJa}
          </p>
        )}
        {node.unlocks.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {node.unlocks.map((u) => (
              <Badge
                key={u.nameEn}
                variant="secondary"
                className="text-xs font-normal"
                title={u.nameEn}
              >
                {u.nameJa}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ResearchTree({ nodes }: { nodes: ResearchNode[] }) {
  const groups = groupByEra(nodes);

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.era}>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {ERA_LABELS[group.era]}（{group.nodes.length}）
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.nodes.map((node) => (
              <ResearchNodeCard key={node.id} node={node} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
