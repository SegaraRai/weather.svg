import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { validator } from "hono/validator";
import { safeParse, type InferOutput } from "valibot";
import type { ReverseGeocoding } from "../types/reverseGeocoding";
import type { Weather } from "../types/weather";
import {
  CREDIT_BIG_DATA_CLOUD,
  CREDIT_METEOCONS,
  CREDIT_OPEN_METEO,
} from "../widget/credits";
import { isValidLanguageTag, preferencesSchema } from "../widget/schemas";
import { FALLBACK_LANGUAGE } from "../widget/translations";
import type { Bindings } from "./bindings";
import { cachedFetch } from "./cachedFetch";
import {
  BASE_REQUEST_HEADERS,
  REV_GEOCODING_CACHE_TTL,
  WEATHER_CACHE_TTL_MAX,
  WEATHER_CACHE_TTL_MIN,
} from "./config";
import { derivePublicKey, importPrivateKey } from "./cryptoKey";
import { encryptLocation, parseLocation } from "./location";
import { locationParamSchema } from "./schemas";
import { clamp, getNextWeatherDataUpdateTimestamp } from "./utils";
import { renderWeatherWidget } from "./widgetRenderer";

const NO_CACHE = "private, max-age=0, no-cache, no-store";

const app = new Hono<{ Bindings: Bindings }>({
  strict: true,
});

app.onError((err, c) => {
  if (import.meta.env.DEV) {
    console.error(err);
  }

  if (err instanceof HTTPException) {
    return c.json(
      {
        error: err.message,
      },
      err.status,
      {
        "Cache-Control": NO_CACHE,
      }
    );
  }

  return c.json(
    {
      error: "Internal Server Error",
    },
    500,
    {
      "Cache-Control": NO_CACHE,
    }
  );
});

app.get(
  "/weather.svg",
  validator("query", ({ ...data }, c) => {
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
        400,
        {
          "Cache-Control": NO_CACHE,
        }
      );
    }

    return { ...result1.output, ...result2.output } as InferOutput<
      typeof preferencesSchema
    > &
      InferOutput<typeof locationParamSchema>;
  }),
  async (c) => {
    const fetcher = (url: URL | string): Promise<Response> =>
      fetch(url, {
        headers: BASE_REQUEST_HEADERS,
      });
    const proxiedFetcher = c.env.PROXY_URL
      ? (url: URL | string): Promise<Response> =>
          fetch(`${c.env.PROXY_URL}${encodeURIComponent(url.toString())}`, {
            headers: {
              ...BASE_REQUEST_HEADERS,
              "Proxy-Authorization": c.env.PROXY_AUTHORIZATION,
            },
          })
      : fetcher;

    const query = c.req.valid("query");

    const privateKey = await importPrivateKey(c.env.JWK_RSA_PRIVATE_KEY);

    const parsedLocation = await parseLocation(query, privateKey);
    if (!parsedLocation) {
      throw new HTTPException(400, {
        message: "Invalid location",
      });
    }

    const { location, encrypted } = parsedLocation;
    if (!encrypted && c.req.query("encrypt") != null) {
      const publicKey = await derivePublicKey(c.env.JWK_RSA_PRIVATE_KEY);

      // redirect to the same URL with encrypted location
      const url = new URL(c.req.url);
      url.searchParams.delete("latitude");
      url.searchParams.delete("longitude");
      url.searchParams.delete("location");
      url.searchParams.delete("location_lang");
      url.searchParams.delete("encrypt");
      url.searchParams.set(
        "encrypted_location",
        await encryptLocation(location, publicKey)
      );

      // 302 Found is used to indicate that the resource is temporarily located at another URL
      // the encrypted URL is not unique to the plain URL, so it's not a permanent redirect
      return c.redirect(url.toString(), 302);
    }

    let commentCredits = "";

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
    forecastURL.searchParams.set("latitude", location.latitude);
    forecastURL.searchParams.set("longitude", location.longitude);

    const weatherData = (await cachedFetch(
      forecastURL,
      c.env.KV_FETCH_CACHE,
      (data) =>
        clamp(
          Math.round(
            (getNextWeatherDataUpdateTimestamp(data as Weather) - Date.now()) /
              1000
          ),
          WEATHER_CACHE_TTL_MIN,
          WEATHER_CACHE_TTL_MAX
        ),
      proxiedFetcher
    ).catch(() =>
      Promise.reject(
        new HTTPException(500, {
          message: "Failed to fetch weather data",
        })
      )
    )) as Weather;
    commentCredits += CREDIT_OPEN_METEO;

    let { location: locationName, location_lang: locationLanguage } = location;
    if (!locationName || !locationLanguage) {
      const revGeocodingURL = new URL(
        "https://api-bdc.net/data/reverse-geocode"
      );
      revGeocodingURL.searchParams.set("latitude", location.latitude);
      revGeocodingURL.searchParams.set("longitude", location.longitude);
      revGeocodingURL.searchParams.set("localityLanguage", query.lang);
      revGeocodingURL.searchParams.set("key", c.env.API_KEY_BIG_DATA_CLOUD);

      const revGeocodingData = (await cachedFetch(
        revGeocodingURL,
        c.env.KV_FETCH_CACHE,
        REV_GEOCODING_CACHE_TTL,
        fetcher
      ).catch(() =>
        Promise.reject(
          new HTTPException(500, {
            message: "Failed to fetch location data",
          })
        )
      )) as ReverseGeocoding;
      commentCredits += CREDIT_BIG_DATA_CLOUD;

      locationName = revGeocodingData.locality;
      locationLanguage = revGeocodingData.localityLanguageRequested;
    }

    commentCredits += CREDIT_METEOCONS;

    return c.text(
      renderWeatherWidget(
        weatherData,
        query,
        locationName,
        locationLanguage,
        commentCredits
      ) + "\n",
      200,
      {
        "Cache-Control": NO_CACHE,
        "Content-Type": "image/svg+xml; charset=UTF-8",
        Vary: "Accept-Language",
      }
    );
  }
);

app.get("/public-key.json", async (c) => {
  const publicKey = await derivePublicKey(c.env.JWK_RSA_PRIVATE_KEY);

  return c.json(await crypto.subtle.exportKey("jwk", publicKey), 200, {
    "Cache-Control": NO_CACHE,
  });
});

export default app;
