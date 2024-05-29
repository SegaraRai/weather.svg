import { Hono } from "hono";
import { validator } from "hono/validator";
import { FALLBACK_LANGUAGE } from "../widget/translations";
import { isValidLanguageTag, preferencesSchema } from "../widget/schemas";
import { safeParse, type InferOutput } from "valibot";
import { locationParamSchema } from "./schemas";
import type { Weather } from "../types/weather";
import { renderWeatherWidget } from "./widgetRenderer";

const app = new Hono({
  strict: true,
});

app.get(
  "/weather.svg",
  validator("query", (data, c) => {
    if ((data?.lang ?? "auto") === "auto") {
      const detectedLanguage = c.req
        .header("Accept-Language")
        ?.replace(/[,;].*$/, "")
        .trim();
      data.lang = isValidLanguageTag(detectedLanguage)
        ? detectedLanguage
        : FALLBACK_LANGUAGE;
    }

    const issues = [];

    const result1 = safeParse(preferencesSchema, data);
    if (!result1.success) {
      issues.push(...result1.issues);
    }

    const result2 = safeParse(locationParamSchema, data);
    if (!result2.success) {
      issues.push(...result2.issues);
    }

    if (!result1.success || !result2.success) {
      return c.json(
        {
          error: "Invalid query parameters",
          issues,
        },
        400
      );
    }

    return { ...result1.output, ...result2.output } as InferOutput<
      typeof preferencesSchema
    > &
      InferOutput<typeof locationParamSchema>;
  }),
  async (c) => {
    const query = c.req.valid("query");

    if ("encrypted_location" in query) {
      return c.json(
        {
          error: "encrypted_location is not supported yet",
        },
        500
      );
    }

    const forecastURL = new URL(
      "https://api.open-meteo.com/v1/forecast?timezone=auto&timeformat=iso8601&temperature_unit=celsius&precipitation_unit=mm&wind_speed_unit=ms"
    );
    forecastURL.searchParams.set(
      "current",
      "temperature_2m,relative_humidity_2m,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,is_day"
    );
    forecastURL.searchParams.set(
      "hourly",
      "temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,pressure_msl"
    );
    forecastURL.searchParams.set(
      "daily",
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours,precipitation_probability_max,sunrise,sunset"
    );
    forecastURL.searchParams.set("latitude", query.latitude);
    forecastURL.searchParams.set("longitude", query.longitude);

    const weatherRes = await fetch(forecastURL);
    if (!weatherRes.ok) {
      return c.json(
        {
          error: "Failed to fetch weather data",
        },
        500
      );
    }

    const weatherData = (await weatherRes.json()) as Weather;
    return c.text(
      renderWeatherWidget(weatherData, query, "Somewhere", "en-US") + "\n",
      200,
      {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Content-Type": "image/svg+xml; charset=UTF-8",
      }
    );
  }
);

export default app;
