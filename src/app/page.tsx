"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GameCard } from "@/components/GameCard";
import { NewGameDialog } from "@/components/NewGameDialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { GameSetup, SavedGame } from "@/lib/schema";
import { createGame, deleteGame, loadGames } from "@/lib/storage";

export default function Page() {
  const router = useRouter();
  const [games, setGames] = useState<SavedGame[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setGames(loadGames());
    setReady(true);
  }, []);

  function handleCreate(name: string, setup: GameSetup) {
    const game = createGame(name, setup);
    toast.success("ゲームを作成しました");
    router.push(`/games/${game.id}`);
  }

  function handleDelete(id: string, name: string) {
    deleteGame(id);
    setGames(loadGames());
    toast.success(`「${name}」を削除しました`);
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">ゲーム一覧</h1>
          <p className="text-sm text-muted-foreground">
            勝利条件ごとのタスクを管理します。
          </p>
        </div>
        <NewGameDialog onCreate={handleCreate} />
      </div>

      {!ready ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
      ) : games.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <p className="text-muted-foreground">
            まだゲームがありません。最初のゲームを作成しましょう。
          </p>
          <div className="mt-4 flex justify-center">
            <NewGameDialog onCreate={handleCreate} />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onOpen={() => router.push(`/games/${game.id}`)}
              onDelete={() => handleDelete(game.id, game.name)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
