export const WEATHER_CACHE_TTL_MIN = 2 * 60;
export const WEATHER_CACHE_TTL_MAX = 14 * 60;

export const REV_GEOCODING_CACHE_TTL = 24 * 60 * 60;

export const BASE_REQUEST_HEADERS = {
  Accept: "application/json",
  "Cache-Control": "no-cache, no-store, no-transform",
  "User-Agent": "weather.svg/1.0",
} as const;
