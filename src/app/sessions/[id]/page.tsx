"use client";

import { ArrowLeft } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { getRoute } from "@/data/routes";
import {
  currentPhase,
  evaluateWarnings,
  type GameState,
  LANES,
} from "@/lib/route";
import { getSession, updateState } from "@/lib/route-storage";

export default function SessionPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [name, setName] = useState("");
  const [routeId, setRouteId] = useState("");
  const [state, setState] = useState<GameState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession(id);
    if (session) {
      setName(session.name);
      setRouteId(session.routeId);
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
      <main className="mx-auto max-w-5xl px-5 py-8">
        <Skeleton className="h-40 w-full" />
      </main>
    );
  }

  const route = routeId ? getRoute(routeId) : undefined;
  if (!route || !state) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-8">
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

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
        <Link href="/">
          <ArrowLeft className="size-4" />
          一覧
        </Link>
      </Button>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-semibold tracking-tight">{name}</h1>
        <Badge variant="secondary">{route.name}</Badge>
        {phase && <Badge variant="outline">{phase.label}</Badge>}
      </div>

      {phase && (
        <p className="mb-4 text-sm text-muted-foreground">{phase.hint}</p>
      )}

      <div className="mb-4">
        <WarningBanner warnings={warnings} />
      </div>

      <div className="mb-6">
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
      </div>

      <div className="mb-6">
        <BranchSection route={route} state={s} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {LANES.map((lane) => (
          <LaneColumn key={lane} route={route} lane={lane} state={s} />
        ))}
      </div>

      <div className="mt-6">
        <PrinciplePanel route={route} />
      </div>
    </main>
  );
}
