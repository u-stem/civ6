"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/data/routes";

export function NewSessionDialog({
  onCreate,
}: {
  onCreate: (name: string, routeId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [routeId, setRouteId] = useState(ROUTES[0]?.id ?? "");
  const [name, setName] = useState("");
  const route = useMemo(() => ROUTES.find((r) => r.id === routeId), [routeId]);

  function submit() {
    if (!route) return;
    onCreate(name.trim() || route.name, route.id);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          新規セッション
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>新規セッション</DialogTitle>
          <DialogDescription>
            伴走するルートを選び、1ゲームのセッションを開始します。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="route">ルート</Label>
            <Select value={routeId} onValueChange={setRouteId}>
              <SelectTrigger id="route" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROUTES.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {route && (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {route.premise}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">セッション名</Label>
            <Input
              id="name"
              placeholder={route?.name ?? ""}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={submit} disabled={!route}>
              開始
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
