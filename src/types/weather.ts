// https://api.open-meteo.com/v1/forecast?latitude=35.698683&longitude=139.774219&timezone=auto&timeformat=iso8601&temperature_unit=celsius&precipitation_unit=mm&wind_speed_unit=ms&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,is_day&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,pressure_msl&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours,precipitation_probability_max,sunrise,sunset
// generated with https://transform.tools/json-to-typescript

export interface Weather {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: CurrentUnits;
  current: Current;
  hourly_units: HourlyUnits;
  hourly: Hourly;
  daily_units: DailyUnits;
  daily: Daily;
}

export interface CurrentUnits {
  /** @example "iso8601" */
  time: string;
  /** @example "seconds" */
  interval: string;
  /** @example "°C" */
  temperature_2m: string;
  /** @example "%" */
  relative_humidity_2m: string;
  /** @example "mm" */
  precipitation: string;
  /** @example "wmo code" */
  weather_code: string;
  /** @example "%" */
  cloud_cover: string;
  /** @example "hPa" */
  pressure_msl: string;
  /** @example "m/s" */
  wind_speed_10m: string;
  /** @example "" */
  is_day: string;
}

export interface Current {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  precipitation: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  wind_speed_10m: number;
  is_day: 0 | 1;
}

export interface HourlyUnits {
  /** @example "iso8601" */
  time: string;
  /** @example "°C" */
  temperature_2m: string;
  /** @example "%" */
  relative_humidity_2m: string;
  /** @example "%" */
  precipitation_probability: string;
  /** @example "mm" */
  precipitation: string;
  /** @example "wmo code" */
  weather_code: string;
  /** @example "hPa" */
  pressure_msl: string;
}

export interface Hourly {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  pressure_msl: number[];
}

export interface DailyUnits {
  /** @example "iso8601" */
  time: string;
  /** @example "wmo code" */
  weather_code: string;
  /** @example "°C" */
  temperature_2m_max: string;
  /** @example "°C" */
  temperature_2m_min: string;
  /** @example "mm" */
  precipitation_sum: string;
  /** @example "h" */
  precipitation_hours: string;
  /** @example "%" */
  precipitation_probability_max: string;
  /** @example "iso8601" */
  sunrise: string;
  /** @example "iso8601" */
  sunset: string;
}

export interface Daily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  sunrise: string[];
  sunset: string[];
}
