import type { Weather } from "../types/weather";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getNextWeatherDataUpdateTimestamp(weather: Weather): number {
  const localOffsetDate = new Date(`${weather.current.time}:00Z`);
  const localOffsetTimestamp = localOffsetDate.getTime();
  return (
    localOffsetTimestamp -
    weather.utc_offset_seconds * 1000 +
    weather.current.interval * 1000
  );
}
