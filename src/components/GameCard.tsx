"use client";

import { Trash2 } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ALL_FRAGMENTS, getCivilization } from "@/data";
import { RULESET_LABELS, SPEED_LABELS, VICTORY_LABELS } from "@/data/labels";
import type { SavedGame } from "@/lib/schema";
import { synthesize } from "@/lib/synthesize";

export function GameCard({
  game,
  onOpen,
  onDelete,
}: {
  game: SavedGame;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const civ = getCivilization(game.setup.civId);
  const tasks = synthesize(game.setup, ALL_FRAGMENTS);
  const all = [...tasks.early, ...tasks.mid, ...tasks.late];
  const done = all.filter((t) => game.checked[t.id]).length;
  const pct = all.length > 0 ? Math.round((done / all.length) * 100) : 0;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="truncate">{game.name}</CardTitle>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{civ?.name ?? game.setup.civId}</Badge>
          {game.setup.victories.map((v) => (
            <Badge key={v}>{VICTORY_LABELS[v]}勝利</Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <p className="text-xs text-muted-foreground">
          {RULESET_LABELS[game.setup.ruleset]} ・{" "}
          {SPEED_LABELS[game.setup.speed]}
        </p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>進捗</span>
            <span className="tabular-nums">
              {done}/{all.length}（{pct}%）
            </span>
          </div>
          <Progress value={pct} />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="flex-1" onClick={onOpen}>
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
                「{game.name}」を削除しますか？
              </AlertDialogTitle>
              <AlertDialogDescription>
                この操作は取り消せません。チェック済みの進捗も削除されます。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>削除</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
