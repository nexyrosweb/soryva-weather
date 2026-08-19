import { SoryvaClient } from "@/components/app/SoryvaClient";
import type { CitySuggestion } from "@/types/weather";

type ActivityPageProps = PageProps<"/[locale]/activity/[activity]">;

export default async function ActivityPage({ params, searchParams }: ActivityPageProps) {
  const { activity } = await params;
  const query = await searchParams;
  const city = createInitialCity(query);

  return <SoryvaClient initialActivityId={activity} initialCity={city} />;
}

function createInitialCity(query: Awaited<ActivityPageProps["searchParams"]>): CitySuggestion | undefined {
  const lat = getSingleValue(query.lat);
  const lon = getSingleValue(query.lon);
  const city = getSingleValue(query.city);

  if (!lat || !lon || !city) {
    return undefined;
  }

  const latitude = Number(lat);
  const longitude = Number(lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return undefined;
  }

  return {
    id: 0,
    name: city,
    country: getSingleValue(query.country) ?? "Unknown country",
    admin1: getSingleValue(query.admin1),
    latitude,
    longitude,
    timezone: getSingleValue(query.timezone) ?? "auto",
  };
}

function getSingleValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
