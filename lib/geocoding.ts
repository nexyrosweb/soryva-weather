import type { CitySuggestion, OpenMeteoGeocodingResponse } from "@/types/weather";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

const DEFAULT_LOCALE = "en";

export class GeocodingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeocodingError";
  }
}

export async function searchCities(query: string, locale: string = DEFAULT_LOCALE): Promise<CitySuggestion[]> {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    name: trimmedQuery,
    count: "5",
    language: locale,
    format: "json",
  });

  const response = await fetch(`${GEOCODING_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new GeocodingError("City search is temporarily unavailable.");
  }

  const data = (await response.json()) as OpenMeteoGeocodingResponse;

  return (data.results ?? [])
    .filter(
      (result) =>
        typeof result.name === "string" &&
        typeof result.latitude === "number" &&
        typeof result.longitude === "number",
    )
    .map((result, index) => ({
      id: result.id ?? index,
      name: result.name ?? "Unknown city",
      country: result.country ?? "Unknown country",
      admin1: result.admin1,
      latitude: result.latitude ?? 0,
      longitude: result.longitude ?? 0,
      timezone: result.timezone ?? "auto",
    }));
}
