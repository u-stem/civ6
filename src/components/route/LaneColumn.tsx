"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

// 畳めるセクションの見出し(完了済み / 条件付き)。
// 開閉は親 Collapsible の onOpenChange が担うため、ここは表示だけ。
function SectionToggle({ open, label }: { open: boolean; label: string }) {
  return (
    <CollapsibleTrigger className="flex w-full items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
      <ChevronDown
        className={cn("size-3.5 transition-transform", open && "rotate-180")}
      />
      {label}
    </CollapsibleTrigger>
  );
}

export function LaneColumn({
  route,
  lane,
  state,
  expandAll = false,
}: {
  route: Route;
  lane: Lane;
  state: GameState;
  expandAll?: boolean;
}) {
  const seq = sequenceNodes(route, lane);
  const cnd = conditionalNodes(route, lane);
  const done = seq.filter((n) => isDone(n, state));
  const pending = seq.filter((n) => !isDone(n, state));

  const [doneOpen, setDoneOpen] = useState(false);
  const [cndOpen, setCndOpen] = useState(false);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <span className={cn("size-2.5 rounded-full", LANE_DOT[lane])} />
          {LANE_LABELS[lane]}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 完了済み: 既定で畳む(ノイズ削減) */}
        {done.length > 0 && (
          <Collapsible open={expandAll || doneOpen} onOpenChange={setDoneOpen}>
            <SectionToggle
              open={expandAll || doneOpen}
              label={`✓ 完了 ${done.length}件`}
            />
            <CollapsibleContent>
              <ol className="mt-1.5 space-y-1.5">
                {done.map((n) => (
                  <li key={n.id} className="rounded-md border p-2 opacity-50">
                    <div className="flex items-start gap-2">
                      <span className="text-sm tabular-nums text-muted-foreground">
                        ✓
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-medium line-through">
                          {n.label}
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {n.detail}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 未完の順序ステップ: ▶ が今やる次の手、以降は今後 */}
        {pending.length > 0 ? (
          <ol className="space-y-1.5">
            {pending.map((n, i) => {
              const isNext = i === 0;
              return (
                <li
                  key={n.id}
                  className={cn(
                    "rounded-md border p-2",
                    isNext && "border-primary bg-primary/5",
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {isNext ? "▶" : "・"}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{n.label}</div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {n.detail}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          seq.length > 0 && (
            <p className="text-xs text-muted-foreground">
              順序ステップはすべて完了。
            </p>
          )
        )}

        {/* 条件付きの手: 既定で畳む(随時取る候補なので普段は隠す) */}
        {cnd.length > 0 && (
          <Collapsible open={expandAll || cndOpen} onOpenChange={setCndOpen}>
            <SectionToggle
              open={expandAll || cndOpen}
              label={`条件付きの手 ${cnd.length}件`}
            />
            <CollapsibleContent>
              <ul className="mt-1.5 space-y-1.5">
                {cnd.map((n) => (
                  <li
                    key={n.id}
                    className="rounded-md border border-dashed p-2"
                  >
                    <div className="text-sm font-medium">{n.label}</div>
                    <p className="text-xs text-primary">条件: {n.trigger}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {n.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}
