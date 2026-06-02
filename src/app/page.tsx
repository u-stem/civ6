"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { NewSessionDialog } from "@/components/NewSessionDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getRoute } from "@/data/routes";
import {
  currentPhase,
  evaluateWarnings,
  filterRoute,
  sequenceProgress,
} from "@/lib/route";
import {
  createSession,
  deleteSession,
  loadSessions,
  type RouteSession,
} from "@/lib/route-storage";
import { RULESET_LABELS, type Ruleset } from "@/lib/schema";

export default function Page() {
  const router = useRouter();
  const [sessions, setSessions] = useState<RouteSession[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSessions(loadSessions());
    setReady(true);
  }, []);

  function handleCreate(name: string, routeId: string, ruleset: Ruleset) {
    const session = createSession(name, routeId, ruleset);
    toast.success("セッションを開始しました");
    router.push(`/sessions/${session.id}`);
  }

  function handleDelete(id: string, name: string) {
    deleteSession(id);
    setSessions(loadSessions());
    toast.success(`「${name}」を削除しました`);
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            ルート伴走セッション
          </h1>
          <p className="text-sm text-muted-foreground">
            決めた1ルートを逸脱させない状態機械として伴走します。
          </p>
        </div>
        <NewSessionDialog onCreate={handleCreate} />
      </div>

      {!ready ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <p className="text-muted-foreground">
            まだセッションがありません。右上の「新規セッション」から始めましょう。
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {sessions.map((session) => {
            const raw = getRoute(session.routeId);
            if (!raw) return null;
            const route = filterRoute(raw, session.ruleset);
            const progress = sequenceProgress(route, session.state);
            const warnings = evaluateWarnings(route, session.state);
            const phase = currentPhase(route, session.state);
            const dangers = warnings.filter(
              (w) => w.severity === "danger",
            ).length;
            return (
              <Card key={session.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="truncate">{session.name}</CardTitle>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary">{route.name}</Badge>
                    <Badge variant="outline">
                      {RULESET_LABELS[session.ruleset]}
                    </Badge>
                    <Badge variant="outline">ターン {session.state.turn}</Badge>
                    {phase && <Badge variant="outline">{phase.label}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    順序ステップ {progress.done}/{progress.total} 完了
                  </p>
                  {dangers > 0 ? (
                    <p className="text-red-600 dark:text-red-400">
                      警告 {dangers} 件(要対応)
                    </p>
                  ) : warnings.length > 0 ? (
                    <p className="text-amber-600 dark:text-amber-400">
                      注意 {warnings.length} 件
                    </p>
                  ) : (
                    <p className="text-muted-foreground">警告なし</p>
                  )}
                </CardContent>
                <CardContent className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => router.push(`/sessions/${session.id}`)}
                  >
                    開く
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" aria-label="削除">
                        <Trash2 className="size-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          「{session.name}」を削除しますか？
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          この操作は取り消せません。進捗(状態)も削除されます。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(session.id, session.name)}
                        >
                          削除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
