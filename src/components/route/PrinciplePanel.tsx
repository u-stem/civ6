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
      <CardContent className="space-y-3">
        {principles.map((p) => (
          <div key={p.id}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{p.label}</span>
              <span className="text-xs text-muted-foreground">
                {LANE_LABELS[p.lane]}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {p.body}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
