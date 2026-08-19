import type { BestTimeWindow, HourlyScore } from "@/types/recommendation";

export function findBestTime(timeline: HourlyScore[]): BestTimeWindow {
  if (timeline.length === 0) {
    throw new Error("Cannot find a best time without hourly scores.");
  }

  let bestWindow = createWindow(timeline, 0, 1);
  const windowSizes = [1, 2];

  for (const windowSize of windowSizes) {
    for (let index = 0; index <= timeline.length - windowSize; index += 1) {
      const candidate = createWindow(timeline, index, windowSize);

      if (candidate.averageScore > bestWindow.averageScore) {
        bestWindow = candidate;
      }
    }
  }

  return bestWindow;
}

function createWindow(timeline: HourlyScore[], startIndex: number, size: number): BestTimeWindow {
  const hours = timeline.slice(startIndex, startIndex + size);
  const averageScore = Math.round(
    hours.reduce((total, hour) => total + hour.score, 0) / hours.length,
  );
  const startTime = hours[0].hour.time;
  const lastTime = hours[hours.length - 1].hour.time;
  const endTime = addHours(lastTime, 1);

  return {
    startTime,
    endTime,
    averageScore,
    hours,
  };
}

function addHours(time: string, hours: number): string {
  const date = new Date(time);
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}
