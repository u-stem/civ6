"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GameCard } from "@/components/GameCard";
import { SetupForm } from "@/components/SetupForm";
import type { GameSetup, SavedGame } from "@/lib/schema";
import { createGame, deleteGame, loadGames } from "@/lib/storage";

export default function Page() {
  const router = useRouter();
  const [games, setGames] = useState<SavedGame[]>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setGames(loadGames());
  }, []);

  function handleCreate(name: string, setup: GameSetup) {
    const game = createGame(name, setup);
    router.push(`/games/${game.id}`);
  }

  function handleDelete(id: string) {
    deleteGame(id);
    setGames(loadGames());
  }

  return (
    <main className="container">
      <div className="row">
        <h1 style={{ margin: 0 }}>ゲーム一覧</h1>
        <div className="spacer" />
        {!creating && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setCreating(true)}
          >
            ＋ 新規ゲーム
          </button>
        )}
      </div>

      {creating && (
        <div style={{ marginTop: "1rem" }}>
          <SetupForm
            onCreate={handleCreate}
            onCancel={() => setCreating(false)}
          />
        </div>
      )}

      <div style={{ marginTop: "1.25rem" }}>
        {games.length === 0 && !creating ? (
          <p className="hint">
            まだゲームがありません。「新規ゲーム」から作成してください。
          </p>
        ) : (
          games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onOpen={() => router.push(`/games/${game.id}`)}
              onDelete={() => handleDelete(game.id)}
            />
          ))
        )}
      </div>
    </main>
  );
}
