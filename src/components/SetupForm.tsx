"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CIVILIZATIONS, IMPLEMENTED_VICTORIES } from "@/data";
import {
  MODE_LABELS,
  RULESET_LABELS,
  SPEED_LABELS,
  VICTORY_LABELS,
} from "@/data/labels";
import {
  GAME_MODES,
  GAME_SPEEDS,
  type GameMode,
  type GameSetup,
  GameSetupSchema,
  RULESETS,
  VICTORY_TYPES,
  type VictoryType,
} from "@/lib/schema";

function asVictories(values: string[]): VictoryType[] {
  return VICTORY_TYPES.filter((t) => values.includes(t));
}

export function SetupForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (name: string, setup: GameSetup) => void;
  onCancel: () => void;
}) {
  const [civId, setCivId] = useState(CIVILIZATIONS[0]?.id ?? "babylon");
  const civ = useMemo(() => CIVILIZATIONS.find((c) => c.id === civId), [civId]);
  const [leaderId, setLeaderId] = useState(civ?.leaders[0]?.id ?? "");
  const [victories, setVictories] = useState<VictoryType[]>(["culture"]);
  const [ruleset, setRuleset] = useState<string>("rise-and-fall");
  const [speed, setSpeed] = useState<string>("online");
  const [modes, setModes] = useState<GameMode[]>([]);
  const [name, setName] = useState("");
  const [modesOpen, setModesOpen] = useState(false);

  const defaultName = `${civ?.name ?? ""}・${victories
    .map((v) => VICTORY_LABELS[v])
    .join("/")}`;

  function toggleMode(mode: GameMode, on: boolean) {
    setModes((prev) => (on ? [...prev, mode] : prev.filter((m) => m !== mode)));
  }

  function submit() {
    const parsed = GameSetupSchema.safeParse({
      civId,
      leaderId,
      victories,
      ruleset,
      speed,
      modes,
    });
    if (!parsed.success) return;
    onSubmit(name.trim() || defaultName, parsed.data);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="civ">文明</Label>
          <Select
            value={civId}
            onValueChange={(value) => {
              setCivId(value);
              const next = CIVILIZATIONS.find((c) => c.id === value);
              setLeaderId(next?.leaders[0]?.id ?? "");
            }}
          >
            <SelectTrigger id="civ" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CIVILIZATIONS.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="leader">指導者</Label>
          <Select value={leaderId} onValueChange={setLeaderId}>
            <SelectTrigger id="leader" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {civ?.leaders.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>勝利条件（複数可）</Label>
        <ToggleGroup
          type="multiple"
          variant="outline"
          value={victories}
          onValueChange={(values) => setVictories(asVictories(values))}
          className="flex flex-wrap justify-start gap-2"
        >
          {VICTORY_TYPES.map((v) => {
            const ready = IMPLEMENTED_VICTORIES.includes(v);
            return (
              <ToggleGroupItem
                key={v}
                value={v}
                disabled={!ready}
                className="rounded-md border data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
              >
                {VICTORY_LABELS[v]}
                {!ready && "（準備中）"}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ruleset">拡張</Label>
          <Select value={ruleset} onValueChange={setRuleset}>
            <SelectTrigger id="ruleset" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RULESETS.map((r) => (
                <SelectItem key={r} value={r}>
                  {RULESET_LABELS[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="speed">ゲームスピード</Label>
          <Select value={speed} onValueChange={setSpeed}>
            <SelectTrigger id="speed" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GAME_SPEEDS.map((s) => (
                <SelectItem key={s} value={s}>
                  {SPEED_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Collapsible open={modesOpen} onOpenChange={setModesOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-md text-sm font-medium"
          >
            <span>
              ゲームモード（任意）
              {modes.length > 0 && (
                <span className="ml-2 text-muted-foreground">
                  {modes.length} 件選択中
                </span>
              )}
            </span>
            <ChevronDown
              className={`size-4 transition-transform ${modesOpen ? "rotate-180" : ""}`}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {GAME_MODES.map((m) => (
              <Label
                key={m}
                className="flex items-center gap-2 font-normal text-muted-foreground"
              >
                <Checkbox
                  checked={modes.includes(m)}
                  onCheckedChange={(c) => toggleMode(m, c === true)}
                />
                {MODE_LABELS[m]}
              </Label>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            現在モード別のタスク補正は未収録です（選択しても標準タスクが表示されます）。
          </p>
        </CollapsibleContent>
      </Collapsible>

      <div className="space-y-2">
        <Label htmlFor="name">ゲーム名</Label>
        <Input
          id="name"
          placeholder={defaultName}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          キャンセル
        </Button>
        <Button onClick={submit} disabled={victories.length === 0}>
          作成
        </Button>
      </div>
    </div>
  );
}
