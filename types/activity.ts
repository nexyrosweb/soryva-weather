export type ActivityRules = {
  minTemperature: number;
  idealMinTemperature: number;
  idealMaxTemperature: number;
  maxTemperature: number;
  maxRainProbability: number;
  maxPrecipitation: number;
  maxWindSpeed: number;
  maxWindGusts: number;
  minHumidity: number;
  maxHumidity: number;
  maxCloudCover?: number;
  maxUvIndex?: number;
  prefersClearSky?: boolean;
  needsDryGround?: boolean;
};

export type Activity = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rules: ActivityRules;
};
