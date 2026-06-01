import type { Route } from "@/lib/route";
import { babylonCulture } from "./babylon-culture";

// 収録済みのルート。指導者・勝利条件・モードの追加はここに足す。
export const ROUTES: Route[] = [babylonCulture];

export function getRoute(id: string): Route | undefined {
  return ROUTES.find((r) => r.id === id);
}
