import type { GameSetup, SavedGame } from "./schema";
import { SavedGameSchema } from "./schema";

const KEY = "civ6-games";

// localStorage の生文字列を SavedGame[] に変換する純粋関数。
// スキーマに合わない要素は黙って捨て、壊れたデータで全体が落ちないようにする。
export function parseSavedGames(raw: string | null): SavedGame[] {
  if (!raw) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];

  const games: SavedGame[] = [];
  for (const item of data) {
    const parsed = SavedGameSchema.safeParse(item);
    if (parsed.success) games.push(parsed.data);
  }
  return games;
}

function readRaw(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

function writeAll(games: SavedGame[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(games));
}

export function loadGames(): SavedGame[] {
  return parseSavedGames(readRaw());
}

export function getGame(id: string): SavedGame | undefined {
  return loadGames().find((g) => g.id === id);
}

export function createGame(name: string, setup: GameSetup): SavedGame {
  const game: SavedGame = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    setup,
    checked: {},
  };
  const games = loadGames();
  games.push(game);
  writeAll(games);
  return game;
}

function updateGame(id: string, updater: (game: SavedGame) => SavedGame): void {
  const games = loadGames();
  const index = games.findIndex((g) => g.id === id);
  if (index === -1) return;
  const current = games[index];
  if (!current) return;
  games[index] = updater(current);
  writeAll(games);
}

export function setChecked(id: string, taskId: string, checked: boolean): void {
  updateGame(id, (g) => ({
    ...g,
    checked: { ...g.checked, [taskId]: checked },
  }));
}

export function setNote(id: string, taskId: string, note: string): void {
  updateGame(id, (g) => {
    const notes = { ...(g.notes ?? {}) };
    if (note.trim() === "") {
      delete notes[taskId];
    } else {
      notes[taskId] = note;
    }
    return { ...g, notes };
  });
}

export function renameGame(id: string, name: string): void {
  updateGame(id, (g) => ({ ...g, name }));
}

export function deleteGame(id: string): void {
  writeAll(loadGames().filter((g) => g.id !== id));
}
