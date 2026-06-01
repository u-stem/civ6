import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type GameState,
  isBranchActive,
  LANE_LABELS,
  type Route,
} from "@/lib/route";
import { cn } from "@/lib/utils";

export function BranchSection({
  route,
  state,
}: {
  route: Route;
  state: GameState;
}) {
  if (route.branches.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        状況に応じた分岐
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {route.branches.map((b) => {
          const active = isBranchActive(b, state);
          return (
            <Card
              key={b.id}
              className={cn("h-full", active ? "border-primary" : "opacity-60")}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm">{b.label}</CardTitle>
                  {active && <Badge>現在の状況</Badge>}
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {b.detail}
                </p>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {b.nodes.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-md border border-dashed p-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{n.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {LANE_LABELS[n.lane]}
                      </span>
                    </div>
                    {n.type === "conditional" && (
                      <p className="text-xs text-primary">条件: {n.trigger}</p>
                    )}
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {n.type === "principle" ? n.body : n.detail}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
