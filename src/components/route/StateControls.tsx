"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { counter, flag, type GameState, type Route } from "@/lib/route";

type Props = {
  route: Route;
  state: GameState;
  onTurn: (delta: number) => void;
  onCounter: (key: string, delta: number) => void;
  onFlag: (key: string, value: boolean) => void;
};

function Stepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (delta: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm">{label}</span>
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
      <CardContent className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
        <Stepper label="ターン" value={state.turn} onChange={onTurn} />
        {route.counters.map((c) => (
          <Stepper
            key={c.key}
            label={c.label}
            value={counter(state, c.key)}
            onChange={(d) => onCounter(c.key, d)}
          />
        ))}
        {route.flags.map((f) => (
          <Label
            key={f.key}
            className="flex items-center justify-between gap-2 font-normal"
          >
            <span className="text-sm">{f.label}</span>
            <Switch
              checked={flag(state, f.key)}
              onCheckedChange={(v) => onFlag(f.key, v === true)}
            />
          </Label>
        ))}
      </CardContent>
    </Card>
  );
}
