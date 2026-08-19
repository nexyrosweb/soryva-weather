import type {
  CitySuggestion,
  HourlyWeather,
  OpenMeteoForecastResponse,
  WeatherForecast,
} from "@/types/weather";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const FORECAST_HOURS = 24;

export class WeatherApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WeatherApiError";
  }
}

export async function getHourlyForecast(city: CitySuggestion): Promise<WeatherForecast> {
  const params = new URLSearchParams({
    latitude: city.latitude.toString(),
    longitude: city.longitude.toString(),
    hourly: [
      "temperature_2m",
      "apparent_temperature",
      "precipitation_probability",
      "precipitation",
      "wind_speed_10m",
      "wind_gusts_10m",
      "relative_humidity_2m",
      "cloud_cover",
      "uv_index",
      "weather_code",
    ].join(","),
    forecast_days: "2",
    timezone: "auto",
  });

  const response = await fetch(`${FORECAST_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new WeatherApiError("Weather forecast is temporarily unavailable.");
  }

  const data = (await response.json()) as OpenMeteoForecastResponse;
  const hourly = data.hourly;

  if (!hourly?.time?.length || !hourly.temperature_2m?.length) {
    throw new WeatherApiError("No hourly weather data was returned.");
  }

  return {
    city,
    timezone: data.timezone ?? city.timezone,
    hours: normalizeHourlyWeather(hourly).slice(0, FORECAST_HOURS),
  };
}

function normalizeHourlyWeather(
  hourly: NonNullable<OpenMeteoForecastResponse["hourly"]>,
): HourlyWeather[] {
  const times = hourly.time ?? [];

  return times.map((time, index) => {
    const temperature = hourly.temperature_2m?.[index] ?? 0;

    return {
      time,
      temperature,
      apparentTemperature: hourly.apparent_temperature?.[index] ?? temperature,
      rainProbability: hourly.precipitation_probability?.[index] ?? 0,
      precipitation: hourly.precipitation?.[index] ?? 0,
      windSpeed: hourly.wind_speed_10m?.[index] ?? 0,
      windGusts: hourly.wind_gusts_10m?.[index] ?? 0,
      humidity: hourly.relative_humidity_2m?.[index] ?? 50,
      cloudCover: hourly.cloud_cover?.[index] ?? 0,
      uvIndex: hourly.uv_index?.[index] ?? 0,
      weatherCode: hourly.weather_code?.[index] ?? 0,
    };
  });
}
