import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n";

type ActivityPageProps = PageProps<"/activity/[activity]">;

export default async function ActivityPage({ params, searchParams }: ActivityPageProps) {
  const { activity } = await params;
  const query = await searchParams;
  const queryString = new URLSearchParams(flattenSearchParams(query)).toString();

  redirect(`/${defaultLocale}/activity/${activity}${queryString ? `?${queryString}` : ""}`);
}

function flattenSearchParams(
  query: Awaited<ActivityPageProps["searchParams"]>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(query).flatMap(([key, value]) => {
      if (value === undefined) {
        return [];
      }

      return [[key, Array.isArray(value) ? value[0] : value]];
    }),
  );
}
