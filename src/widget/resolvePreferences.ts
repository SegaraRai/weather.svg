import { parse } from "bcp-47";
import type { PreferencesSchema } from "./schemas";

// Get commonly used units from language and region
// Region list may be incorrect as I asked AI

export function inferPreferredTemperatureUnit(
  languageCode: string,
  regionCode: string
): "celsius" | "fahrenheit" {
  if (["AU", "CA", "GB", "IE", "IN", "NZ", "ZA"].includes(regionCode)) {
    return "celsius";
  }

  if (
    [
      "AS",
      "BS",
      "BZ",
      "FM",
      "GU",
      "KY",
      "LR",
      "MH",
      "MP",
      "PR",
      "PW",
      "US",
      "VI",
    ].includes(regionCode)
  ) {
    return "fahrenheit";
  }

  return languageCode === "en" ? "fahrenheit" : "celsius";
}

export function inferPreferredPrecipitationUnit(
  languageCode: string,
  regionCode: string
): "mm" | "inch" {
  if (["AU", "CA", "GB", "IE", "IN", "NZ", "ZA"].includes(regionCode)) {
    return "mm";
  }

  if (
    [
      "AS",
      "BS",
      "BZ",
      "FM",
      "GB",
      "GU",
      "KY",
      "LR",
      "MH",
      "MP",
      "PR",
      "PW",
      "US",
      "VI",
    ].includes(regionCode)
  ) {
    return "inch";
  }

  return languageCode === "en" ? "inch" : "mm";
}

export function inferPreferredWindSpeedUnit(
  languageCode: string,
  regionCode: string
): "mph" | "mps" {
  return inferPreferredPrecipitationUnit(languageCode, regionCode) === "inch"
    ? "mph"
    : "mps";
}

export function inferPreferredTimeFormat(
  language: string
): "12h" | "24h" | "24hn" | "native" {
  const strDate1 = new Date("2024-01-03T17:07:09Z").toLocaleTimeString(
    language,
    {
      timeZone: "UTC",
      timeStyle: "short",
    }
  );

  const has5 = strDate1.includes("5");
  const has17 = strDate1.includes("17");
  if (has5 === has17) {
    return "native";
  }

  if (has5) {
    return "12h";
  }

  const strDate2 = new Date("2024-01-03T05:07:09Z").toLocaleTimeString(
    language,
    {
      timeZone: "UTC",
      timeStyle: "short",
    }
  );
  return strDate2.includes("05") ? "24h" : "24hn";
}

export interface PreferredFormats {
  airPressure: Exclude<PreferencesSchema["air_pressure"], "auto">;
  precipitation: Exclude<PreferencesSchema["precipitation"], "auto">;
  temperature: Exclude<PreferencesSchema["temperature"], "auto">;
  windSpeed: Exclude<PreferencesSchema["wind_speed"], "auto">;
  timeFormat: Exclude<PreferencesSchema["time_format"], "auto">;
}

export function inferPreferredFormats(language: string): PreferredFormats {
  let { language: languageCode, region: regionCode } = parse(language);
  languageCode = languageCode?.toLowerCase() ?? "";
  regionCode = regionCode?.toUpperCase() ?? "";

  return {
    airPressure: "hpa",
    precipitation: inferPreferredPrecipitationUnit(languageCode, regionCode),
    temperature: inferPreferredTemperatureUnit(languageCode, regionCode),
    windSpeed: inferPreferredWindSpeedUnit(languageCode, regionCode),
    timeFormat: inferPreferredTimeFormat(language),
  };
}

function resolveValue<T>(value: T | "auto", defaultValue: T): T {
  return value === "auto" ? defaultValue : value;
}

export function resolvePreferences(
  preference: PreferencesSchema
): PreferredFormats {
  const autoPreference = inferPreferredFormats(preference.lang);

  return {
    airPressure: resolveValue(
      preference.air_pressure,
      autoPreference.airPressure
    ),
    precipitation: resolveValue(
      preference.precipitation,
      autoPreference.precipitation
    ),
    temperature: resolveValue(
      preference.temperature,
      autoPreference.temperature
    ),
    windSpeed: resolveValue(preference.wind_speed, autoPreference.windSpeed),
    timeFormat: resolveValue(preference.time_format, autoPreference.timeFormat),
  };
}
