"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { GameSetup } from "@/lib/schema";
import { SetupForm } from "./SetupForm";

export function NewGameDialog({
  onCreate,
  trigger,
}: {
  onCreate: (name: string, setup: GameSetup) => void;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="size-4" />
            新規ゲーム
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>新規ゲーム</DialogTitle>
          <DialogDescription>
            文明・勝利条件・環境を選ぶと、序盤/中盤/終盤のタスクを生成します。
          </DialogDescription>
        </DialogHeader>
        <SetupForm
          onSubmit={(name, setup) => {
            onCreate(name, setup);
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
