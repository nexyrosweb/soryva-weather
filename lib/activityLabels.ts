const activityTranslationKeys: Record<string, string> = {
  "dry-laundry": "dryLaundry",
  "wash-car": "washCar",
};

export function getActivityTranslationKey(activityId: string): string {
  return activityTranslationKeys[activityId] ?? activityId;
}
