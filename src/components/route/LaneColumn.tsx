import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  conditionalNodes,
  type GameState,
  isDone,
  LANE_LABELS,
  type Lane,
  type Route,
  sequenceNodes,
} from "@/lib/route";
import { cn } from "@/lib/utils";

const LANE_DOT: Record<Lane, string> = {
  production: "bg-phase-late",
  tech: "bg-phase-early",
  civic: "bg-phase-mid",
  military: "bg-destructive",
};

export function LaneColumn({
  route,
  lane,
  state,
}: {
  route: Route;
  lane: Lane;
  state: GameState;
}) {
  const seq = sequenceNodes(route, lane);
  const cnd = conditionalNodes(route, lane);
  const nextIndex = seq.findIndex((n) => !isDone(n, state));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <span className={cn("size-2.5 rounded-full", LANE_DOT[lane])} />
          {LANE_LABELS[lane]}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {seq.length > 0 && (
          <ol className="space-y-1.5">
            {seq.map((n, i) => {
              const done = isDone(n, state);
              const isNext = i === nextIndex;
              return (
                <li
                  key={n.id}
                  className={cn(
                    "rounded-md border p-2",
                    done && "opacity-50",
                    isNext && "border-primary bg-primary/5",
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {done ? "✓" : isNext ? "▶" : "・"}
                    </span>
                    <div className="min-w-0">
                      <div
                        className={cn(
                          "text-sm font-medium",
                          done && "line-through",
                        )}
                      >
                        {n.label}
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {n.detail}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {cnd.length > 0 && (
          <ul className="space-y-1.5">
            {cnd.map((n) => (
              <li key={n.id} className="rounded-md border border-dashed p-2">
                <div className="text-sm font-medium">{n.label}</div>
                <p className="text-xs text-primary">条件: {n.trigger}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {n.detail}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
