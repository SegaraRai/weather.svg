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
    picklist(["auto", ...Object.keys(PRESSURE_CONVERSION_MAP)] as (
      | "auto"
      | keyof typeof PRESSURE_CONVERSION_MAP
    )[]),
    "auto"
  ),
  precipitation: nullish(
    picklist(["auto", ...Object.keys(LENGTH_CONVERSION_MAP)] as (
      | "auto"
      | keyof typeof LENGTH_CONVERSION_MAP
    )[]),
    "auto"
  ),
  temperature: nullish(
    picklist(["auto", ...Object.keys(TEMPERATURE_CONVERSION_MAP)] as (
      | "auto"
      | keyof typeof TEMPERATURE_CONVERSION_MAP
    )[]),
    "auto"
  ),
  wind_speed: nullish(
    picklist(["auto", ...Object.keys(SPEED_CONVERSION_MAP)] as (
      | "auto"
      | keyof typeof SPEED_CONVERSION_MAP
    )[]),
    "auto"
  ),
  time_format: nullish(
    picklist(["auto", "12h", "24h", "24hn", "native"]),
    "auto"
  ),
  lang: pipe(
    string("lang must be a string"),
    custom(isValidLanguageTag, "invalid lang string specified")
  ),
});

export type PreferencesSchema = InferOutput<typeof preferencesSchema>;
