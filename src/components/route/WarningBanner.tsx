import { AlertTriangle } from "lucide-react";
import type { Warning } from "@/lib/route";
import { cn } from "@/lib/utils";

export function WarningBanner({ warnings }: { warnings: Warning[] }) {
  if (warnings.length === 0) return null;

  return (
    <div className="space-y-2">
      {warnings.map((w) => (
        <div
          key={w.id}
          className={cn(
            "flex items-start gap-2 rounded-md border px-3 py-2 text-sm",
            w.severity === "danger"
              ? "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400"
              : "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400",
          )}
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>{w.message}</span>
        </div>
      ))}
    </div>
  );
}
