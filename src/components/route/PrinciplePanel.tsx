import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LANE_LABELS, principleNodes, type Route } from "@/lib/route";

export function PrinciplePanel({ route }: { route: Route }) {
  const principles = principleNodes(route);
  if (principles.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">判断軸(常に意識する原則)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {principles.map((p) => (
            <div key={p.id} className="rounded-md border p-3">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium">{p.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {LANE_LABELS[p.lane]}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
