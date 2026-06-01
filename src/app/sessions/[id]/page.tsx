"use client";

import { ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BranchSection } from "@/components/route/BranchSection";
import { LaneColumn } from "@/components/route/LaneColumn";
import { PrinciplePanel } from "@/components/route/PrinciplePanel";
import { StateControls } from "@/components/route/StateControls";
import { WarningBanner } from "@/components/route/WarningBanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRoute } from "@/data/routes";
import {
  activeBranches,
  currentPhase,
  evaluateWarnings,
  filterRoute,
  type GameState,
  LANES,
} from "@/lib/route";
import { getSession, updateState } from "@/lib/route-storage";
import { RULESET_LABELS, type Ruleset } from "@/lib/schema";

export default function SessionPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [name, setName] = useState("");
  const [routeId, setRouteId] = useState("");
  const [ruleset, setRuleset] = useState<Ruleset>("rise-and-fall");
  const [state, setState] = useState<GameState | null>(null);
  const [ready, setReady] = useState(false);
  const [expandAll, setExpandAll] = useState(false);

  useEffect(() => {
    const session = getSession(id);
    if (session) {
      setName(session.name);
      setRouteId(session.routeId);
      setRuleset(session.ruleset);
      setState(session.state);
    }
    setReady(true);
  }, [id]);

  function commit(next: GameState) {
    setState(next);
    updateState(id, next);
  }

  if (!ready) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-8">
        <Skeleton className="h-40 w-full" />
      </main>
    );
  }

  const raw = routeId ? getRoute(routeId) : undefined;
  const route = raw ? filterRoute(raw, ruleset) : undefined;
  if (!route || !state) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-8">
        <p className="text-muted-foreground">
          セッションが見つかりません。
          <Link href="/" className="ml-1 underline">
            一覧へ戻る
          </Link>
        </p>
      </main>
    );
  }

  const s = state;
  const warnings = evaluateWarnings(route, s);
  const phase = currentPhase(route, s);
  const activeCount = activeBranches(route, s).length;

  const controls = (
    <StateControls
      route={route}
      state={s}
      onTurn={(d) => commit({ ...s, turn: Math.max(0, s.turn + d) })}
      onCounter={(key, d) =>
        commit({
          ...s,
          counters: {
            ...s.counters,
            [key]: Math.max(0, (s.counters[key] ?? 0) + d),
          },
        })
      }
      onFlag={(key, value) =>
        commit({ ...s, flags: { ...s.flags, [key]: value } })
      }
    />
  );

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
        <Link href="/">
          <ArrowLeft className="size-4" />
          一覧
        </Link>
      </Button>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-semibold tracking-tight">{name}</h1>
        <Badge variant="secondary">{route.name}</Badge>
        <Badge variant="outline">{RULESET_LABELS[ruleset]}</Badge>
        {phase && <Badge variant="outline">{phase.label}</Badge>}
      </div>

      <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-6">
        {/* 状態入力: デスクトップは左 sticky、モバイルは折りたたみ */}
        <aside className="mb-6 lg:mb-0">
          <div className="hidden lg:block lg:sticky lg:top-4">{controls}</div>
          <div className="lg:hidden">
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="mb-2 flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm font-medium">
                状態入力
                <ChevronDown className="size-4" />
              </CollapsibleTrigger>
              <CollapsibleContent>{controls}</CollapsibleContent>
            </Collapsible>
          </div>
        </aside>

        {/* メイン: 警告・フェーズは常時、その他は本線/分岐/判断軸のタブに畳む */}
        <div className="space-y-4">
          {phase && (
            <p className="text-sm text-muted-foreground">{phase.hint}</p>
          )}

          <WarningBanner warnings={warnings} />

          <Tabs defaultValue="lanes">
            <TabsList className="w-full">
              <TabsTrigger value="lanes">本線</TabsTrigger>
              <TabsTrigger value="branches">
                分岐
                {activeCount > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5">
                    {activeCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="principles">判断軸</TabsTrigger>
            </TabsList>

            <TabsContent value="lanes" className="mt-4 space-y-3">
              <div className="flex justify-end">
                <Label className="flex items-center gap-2 text-xs font-normal text-muted-foreground">
                  全部表示
                  <Switch
                    checked={expandAll}
                    onCheckedChange={(v) => setExpandAll(v === true)}
                  />
                </Label>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {LANES.map((lane) => (
                  <LaneColumn
                    key={lane}
                    route={route}
                    lane={lane}
                    state={s}
                    expandAll={expandAll}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="branches" className="mt-4">
              {route.branches.length > 0 ? (
                <BranchSection route={route} state={s} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  このルートに状況分岐はありません。
                </p>
              )}
            </TabsContent>

            <TabsContent value="principles" className="mt-4">
              <PrinciplePanel route={route} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
