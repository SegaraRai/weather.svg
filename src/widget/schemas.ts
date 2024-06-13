import { parse } from "bcp-47";
import {
  custom,
  nullish,
  object,
  picklist,
  pipe,
  string,
  type InferOutput,
} from "valibot";
import {
  LENGTH_CONVERSION_MAP,
  PRESSURE_CONVERSION_MAP,
  SPEED_CONVERSION_MAP,
  TEMPERATURE_CONVERSION_MAP,
} from "./conversion";

export function isValidLanguageTag(language: unknown): language is string {
  try {
    return (
      typeof language === "string" &&
      !!new Date().toLocaleString(language) &&
      !!parse(language).language
    );
  } catch {
    return false;
  }
}

export const preferencesSchema = object({
  air_pressure: nullish(
    picklist(
      Object.keys(
        PRESSURE_CONVERSION_MAP
      ) as (keyof typeof PRESSURE_CONVERSION_MAP)[]
    ),
    "hpa"
  ),
  precipitation: nullish(
    picklist(
      Object.keys(
        LENGTH_CONVERSION_MAP
      ) as (keyof typeof LENGTH_CONVERSION_MAP)[]
    ),
    "mm"
  ),
  temperature: nullish(
    picklist(
      Object.keys(
        TEMPERATURE_CONVERSION_MAP
      ) as (keyof typeof TEMPERATURE_CONVERSION_MAP)[]
    ),
    "celsius"
  ),
  wind_speed: nullish(
    picklist(
      Object.keys(SPEED_CONVERSION_MAP) as (keyof typeof SPEED_CONVERSION_MAP)[]
    ),
    "mps"
  ),
  time_format: nullish(picklist(["auto", "12h", "24h", "24hn"]), "auto"),
  lang: pipe(
    string("lang must be a string"),
    custom(isValidLanguageTag, "invalid lang string specified")
  ),
});

export type PreferencesSchema = InferOutput<typeof preferencesSchema>;
