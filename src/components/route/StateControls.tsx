"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  counter,
  flag,
  type GameState,
  type Route,
  visibleCounters,
  visibleFlags,
} from "@/lib/route";

type Props = {
  route: Route;
  state: GameState;
  onTurn: (delta: number) => void;
  onCounter: (key: string, delta: number) => void;
  onFlag: (key: string, value: boolean) => void;
};

// ラベルを上、ステッパーを下に積むセル。
// 狭いカラムでもラベルとボタンが衝突しない。h-full + justify-between で
// 隣セルとラベル行数が違ってもステッパーの高さが揃う。
function StepperCell({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (delta: number) => void;
}) {
  return (
    <div className="flex h-full flex-col justify-between gap-1.5">
      <span className="text-xs leading-tight text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          className="size-7"
          onClick={() => onChange(-1)}
          aria-label={`${label} を減らす`}
        >
          <Minus className="size-3.5" />
        </Button>
        <span className="w-7 text-center text-sm tabular-nums">{value}</span>
        <Button
          variant="outline"
          size="icon"
          className="size-7"
          onClick={() => onChange(1)}
          aria-label={`${label} を増やす`}
        >
          <Plus className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function StateControls({
  route,
  state,
  onTurn,
  onCounter,
  onFlag,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">現在の状態を入力</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 数値カウンターは2列で詰めて高さを抑える。未解放・陳腐化したものは出さない */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-3">
          <StepperCell label="ターン" value={state.turn} onChange={onTurn} />
          {visibleCounters(route, state).map((c) => (
            <StepperCell
              key={c.key}
              label={c.label}
              value={counter(state, c.key)}
              onChange={(d) => onCounter(c.key, d)}
            />
          ))}
        </div>
        {/* フラグは全幅1列。スイッチが細いのでラベルと衝突しない */}
        {visibleFlags(route, state).length > 0 && (
          <div className="grid gap-y-2 border-t pt-3">
            {visibleFlags(route, state).map((f) => (
              <Label
                key={f.key}
                className="flex items-center justify-between gap-3 font-normal"
              >
                <span className="min-w-0 text-sm leading-tight">{f.label}</span>
                <Switch
                  className="shrink-0"
                  checked={flag(state, f.key)}
                  onCheckedChange={(v) => onFlag(f.key, v === true)}
                />
              </Label>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
