import type { Activity } from "@/types/activity";
import { ActivityCard } from "@/components/ActivityCard";
import { getActivityTranslationKey } from "@/lib/activityLabels";
import { useTranslations } from "next-intl";

type ActivitySelectorProps = {
  activities: Activity[];
  selectedActivityId?: string;
  onSelect: (activity: Activity) => void;
};

export function ActivitySelector({
  activities,
  selectedActivityId,
  onSelect,
}: ActivitySelectorProps) {
  const t = useTranslations("ui.activitySelector");
  const activityT = useTranslations("activity");

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-500 dark:text-sky-300">{t("label")}</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            {t("title")}
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {activities.map((activity) => {
          const key = getActivityTranslationKey(activity.id);

          return (
            <ActivityCard
              key={activity.id}
              activity={activity}
              name={activityT(`${key}.name`)}
              description={activityT(`${key}.description`)}
              isSelected={activity.id === selectedActivityId}
              onSelect={onSelect}
            />
          );
        })}
      </div>
    </section>
  );
}
