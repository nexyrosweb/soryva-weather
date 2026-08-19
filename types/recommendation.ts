import type { Activity } from "@/types/activity";
import type { HourlyWeather } from "@/types/weather";

export type ScoreStatus = "go" | "maybe" | "no";

export type ScoreReason = {
  label: string;
  status: "good" | "warning" | "bad";
};

export type HourlyScore = {
  hour: HourlyWeather;
  score: number;
  status: ScoreStatus;
  reasons: ScoreReason[];
};

export type BestTimeWindow = {
  startTime: string;
  endTime: string;
  averageScore: number;
  hours: HourlyScore[];
};

export type ActivityRecommendation = {
  activity: Activity;
  current: HourlyScore;
  bestTime: BestTimeWindow;
  summary: string;
  timeline: HourlyScore[];
};
