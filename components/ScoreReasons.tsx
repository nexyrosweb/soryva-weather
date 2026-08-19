import { Check, X, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ScoreReason } from "@/types/recommendation";
import { cn } from "@/lib/utils";

type ScoreReasonsProps = {
  reasons: ScoreReason[];
};

export function ScoreReasons({ reasons }: ScoreReasonsProps) {
  const t = useTranslations("ui.scoreReasons");

  return (
    <div className="rounded-3xl border border-white/70 bg-white/70 p-4 shadow-sm shadow-slate-200/60 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/10">
      <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{t("title")}</h3>
      <ul className="mt-3 space-y-2.5">
        {reasons.map((reason) => (
          <li key={`${reason.status}-${reason.label}`} className="flex items-start gap-2.5 text-sm">
            <ReasonIcon status={reason.status} />
            <span className="pt-0.5 leading-5 text-slate-700 dark:text-slate-200">{reason.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReasonIcon({ status }: { status: ScoreReason["status"] }) {
  const Icon = status === "good" ? Check : status === "warning" ? AlertTriangle : X;

  return (
    <span
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
        status === "good" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
        status === "warning" && "bg-amber-500/10 text-amber-600 dark:text-amber-300",
        status === "bad" && "bg-rose-500/10 text-rose-600 dark:text-rose-300",
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
    </span>
  );
}
