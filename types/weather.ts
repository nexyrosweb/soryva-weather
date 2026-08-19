export type CitySuggestion = {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export type HourlyWeather = {
  time: string;
  temperature: number;
  apparentTemperature: number;
  rainProbability: number;
  precipitation: number;
  windSpeed: number;
  windGusts: number;
  humidity: number;
  cloudCover: number;
  uvIndex: number;
  weatherCode: number;
};

export type WeatherForecast = {
  city: CitySuggestion;
  timezone: string;
  hours: HourlyWeather[];
};

export type WeatherSeverity =
  | "clear"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm"
  | "unknown";

export type WeatherCondition = {
  code: number;
  label: string;
  severity: WeatherSeverity;
};

export type OpenMeteoGeocodingResponse = {
  results?: Array<{
    id?: number;
    name?: string;
    latitude?: number;
    longitude?: number;
    country?: string;
    admin1?: string;
    timezone?: string;
  }>;
};

export type OpenMeteoForecastResponse = {
  timezone?: string;
  hourly?: {
    time?: string[];
    temperature_2m?: number[];
    apparent_temperature?: number[];
    precipitation_probability?: number[];
    precipitation?: number[];
    wind_speed_10m?: number[];
    wind_gusts_10m?: number[];
    relative_humidity_2m?: number[];
    cloud_cover?: number[];
    uv_index?: number[];
    weather_code?: number[];
  };
};
