import { z } from "zod";
import { emptyState, type GameState, GameStateSchema } from "./route";
import { type Ruleset, RulesetSchema } from "./schema";

// ルート伴走セッションの永続化(localStorage)。進捗 = GameState。

const KEY = "civ6-route-sessions";

export const RouteSessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  routeId: z.string(),
  // 選択した拡張。ruleset 導入前の旧セッションは R&F として復元する。
  ruleset: RulesetSchema.default("rise-and-fall"),
  createdAt: z.string(),
  state: GameStateSchema,
});
export type RouteSession = z.infer<typeof RouteSessionSchema>;

// localStorage の生文字列を RouteSession[] に変換する純粋関数。
export function parseSessions(raw: string | null): RouteSession[] {
  if (!raw) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];

  const sessions: RouteSession[] = [];
  for (const item of data) {
    const parsed = RouteSessionSchema.safeParse(item);
    if (parsed.success) sessions.push(parsed.data);
  }
  return sessions;
}

function readRaw(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

function writeAll(sessions: RouteSession[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(sessions));
}

export function loadSessions(): RouteSession[] {
  return parseSessions(readRaw());
}

export function getSession(id: string): RouteSession | undefined {
  return loadSessions().find((s) => s.id === id);
}

export function createSession(
  name: string,
  routeId: string,
  ruleset: Ruleset,
): RouteSession {
  const session: RouteSession = {
    id: crypto.randomUUID(),
    name,
    routeId,
    ruleset,
    createdAt: new Date().toISOString(),
    state: emptyState(),
  };
  const sessions = loadSessions();
  sessions.push(session);
  writeAll(sessions);
  return session;
}

function update(id: string, updater: (s: RouteSession) => RouteSession): void {
  const sessions = loadSessions();
  const index = sessions.findIndex((s) => s.id === id);
  if (index === -1) return;
  const current = sessions[index];
  if (!current) return;
  sessions[index] = updater(current);
  writeAll(sessions);
}

export function updateState(id: string, state: GameState): void {
  update(id, (s) => ({ ...s, state }));
}

export function renameSession(id: string, name: string): void {
  update(id, (s) => ({ ...s, name }));
}

export function deleteSession(id: string): void {
  writeAll(loadSessions().filter((s) => s.id !== id));
}
