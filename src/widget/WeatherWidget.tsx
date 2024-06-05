import { IconSymbolsDefs } from "iconSymbols.tsx";
import inlineUnoCSS from "inline.uno.css?inline";
import type { Weather } from "../types/weather";
import { WidgetBackground } from "./Background";
import { HTMLComment } from "./HTMLComment";
import animationsCSS from "./animations.css?inline";
import comments from "./comments.txt?raw";
import {
  LENGTH_CONVERSION_MAP,
  LENGTH_FRACTION_DIGITS_MAP,
  PERCENTAGE_FRACTION_DIGITS,
  PRESSURE_CONVERSION_MAP,
  PRESSURE_FRACTION_DIGITS_MAP,
  SPEED_CONVERSION_MAP,
  SPEED_FRACTION_DIGITS_MAP,
  TEMPERATURE_CONVERSION_MAP,
  TEMPERATURE_FRACTION_DIGITS_MAP,
} from "./conversion";
import { getWeatherIcon } from "./icons";
import type { PreferencesSchema } from "./schemas";
import { getTheme } from "./theme";
import { getTranslation, getTranslationLanguage } from "./translations";

const ANIMATION_PART_DURATION = 8;
const ANIMATION_SWITCH_DURATION = 0.4;

function OpacityAnimation({
  index,
  total,
  partDuration,
  switchDuration,
}: {
  index: number;
  total: number;
  partDuration: number;
  switchDuration: number;
}) {
  if (total <= 1) {
    return <></>;
  }

  const totalDuration = total * partDuration;
  const showSwitchStart = index * partDuration;
  const showSwitchFinish = showSwitchStart + switchDuration;
  const hideSwitchStart = showSwitchStart + partDuration - switchDuration;
  const hideSwitchFinish = showSwitchStart + partDuration;
  const keyTimes = [
    0,
    showSwitchStart / totalDuration,
    showSwitchFinish / totalDuration,
    hideSwitchStart / totalDuration,
    hideSwitchFinish / totalDuration,
    1,
  ];
  const values = [0, 0, 1, 1, 0, 0];
  if (index === 0) {
    values.shift();
    keyTimes.shift();
  } else if (index === total - 1) {
    values.pop();
    keyTimes.pop();
  }

  return (
    <animate
      attributeName="opacity"
      values={values.join(";")}
      keyTimes={keyTimes.join(";")}
      dur={`${totalDuration}s`}
      repeatCount="indefinite"
    />
  );
}

function formatDateTime(
  datetime: string,
  language: string,
  prefTimeFormat: PreferencesSchema["time_format"]
): [weekday: string, dateTime: string] {
  const date = new Date(datetime + "Z");
  return [
    date.toLocaleString(language, {
      timeZone: "UTC",
      weekday: "long",
    }),
    date.toLocaleString(language, {
      timeZone: "UTC",
      ...(prefTimeFormat === "auto"
        ? { dateStyle: "medium", timeStyle: "short" }
        : {
            month: "short",
            day: "numeric",
            hour: prefTimeFormat === "24h" ? "2-digit" : "numeric",
            hour12: prefTimeFormat === "12h",
            minute: "2-digit",
          }),
    }),
  ];
}

export function WeatherWidget({
  weather,
  locationLabel,
  locationLanguage,
  preferences: {
    lang: language,
    time_format: prefTimeFormat,
    air_pressure: prefAirPressure,
    precipitation: prefPrecipitation,
    temperature: prefTemperature,
    wind_speed: prefWindSpeed,
  },
}: {
  readonly weather: Weather;
  readonly locationLabel: string;
  readonly locationLanguage: string;
  readonly preferences: PreferencesSchema;
}) {
  const datetime = weather.current.time;
  const timezone = weather.timezone;

  const dailyIndex = weather.daily.time.findIndex((time) =>
    weather.current.time.startsWith(`${time}T`)
  );
  const hourlyIndex = weather.hourly.time.findIndex(
    (time) => time >= weather.current.time
  );

  const theme = getTheme(
    datetime,
    weather.daily.sunrise[dailyIndex],
    weather.daily.sunset[dailyIndex]
  );

  const [formattedWeekday, formattedDateTime] = formatDateTime(
    datetime,
    language,
    prefTimeFormat
  );

  // prevent showing 0 mm or 0.0 inch precipitation
  const showPrecipitation = weather.current.precipitation >= 5;

  const temperature = TEMPERATURE_CONVERSION_MAP[prefTemperature](
    weather.current.temperature_2m
  ).toFixed(TEMPERATURE_FRACTION_DIGITS_MAP[prefTemperature]);
  const humidity = weather.current.relative_humidity_2m.toFixed(
    PERCENTAGE_FRACTION_DIGITS
  );
  const precipitationProbability = weather.hourly.precipitation_probability[
    hourlyIndex
  ].toFixed(PERCENTAGE_FRACTION_DIGITS);
  const precipitation = LENGTH_CONVERSION_MAP[prefPrecipitation](
    weather.current.precipitation
  ).toFixed(LENGTH_FRACTION_DIGITS_MAP[prefPrecipitation]);
  const windSpeed = SPEED_CONVERSION_MAP[prefWindSpeed](
    weather.current.wind_speed_10m
  ).toFixed(SPEED_FRACTION_DIGITS_MAP[prefWindSpeed]);
  const seaLevelAirPressure = PRESSURE_CONVERSION_MAP[prefAirPressure](
    weather.current.pressure_msl
  ).toFixed(PRESSURE_FRACTION_DIGITS_MAP[prefAirPressure]);

  const translationLanguage = getTranslationLanguage(language);
  const t = (key: string) =>
    getTranslation(translationLanguage, key) ??
    getTranslation(null, key) ??
    (import.meta.env.DEV ? key : "");

  return (
    <svg
      width="800"
      height="240"
      viewBox="0 0 400 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <HTMLComment>{comments}</HTMLComment>
      <IconSymbolsDefs />
      <defs>
        <clipPath id="widget-clip">
          <rect width="400" height="120" />
        </clipPath>
        <style>{animationsCSS}</style>
        {!import.meta.env.DEV && <style>{inlineUnoCSS}</style>}
      </defs>
      <g
        clip-path="url(#widget-clip)"
        lang={language}
        font-family="system-ui, sans-serif, 'Helvetica Neue', Arial"
        style="font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;"
      >
        <WidgetBackground width="400" height="120" theme={theme} />
        <g class=":uno: an-[fade-in]-ease-out-.4s">
          {/* Weather icon */}
          <use
            href={`#${getWeatherIcon(
              weather.current.weather_code,
              weather.current.is_day
            )}`}
            y="-2"
            width="80"
            height="80"
          />
          {/* Weather description */}
          <g>
            <text
              x="88"
              y="64"
              font-size="12"
              fill-opacity=".8"
              fill={theme.text}
            >
              <tspan>
                {t(`wmo_${weather.current.weather_code}`) ?? t("wmo_unknown")}
              </tspan>
            </text>
          </g>
          {/* Temperature */}
          <text x="88">
            <tspan
              y="12"
              font-size="36"
              dominant-baseline="hanging"
              fill={theme.text}
            >
              {temperature}
            </tspan>
            <tspan
              dx="2"
              y="14"
              font-size="20"
              dominant-baseline="hanging"
              fill={theme.text}
              fill-opacity=".8"
            >
              {t(`unit_${prefTemperature}`)}
            </tspan>
          </text>
        </g>
        {/* Humidity, Precipitation, Wind and Air Pressure */}
        <g>
          <g class=":uno: an-[fade-in]-ease-out-.4s-.2s">
            {/* Humidity */}
            <use
              href="#i-meteocons-humidity-fill"
              x="176"
              y="10"
              width="28"
              height="28"
              role="img"
              aria-label={t("label_humidity")}
            />
            <text
              x="204"
              y="24"
              font-size="12"
              dominant-baseline="middle"
              fill={theme.text}
            >
              <tspan>
                {humidity}
                {t("unit_percent")}
              </tspan>
            </text>
          </g>
          <g class=":uno: an-[fade-in]-ease-out-.4s-.3s">
            {/* Precipitation */}
            <g>
              <use
                href="#i-meteocons-raindrops-fill"
                x="176"
                y="34"
                width="28"
                height="28"
                role="img"
                aria-label={t("label_precipitation_probability")}
              />
              <text
                x="204"
                y="48"
                font-size="12"
                dominant-baseline="middle"
                fill={theme.text}
              >
                <tspan>
                  {precipitationProbability}
                  {t("unit_percent")}
                </tspan>
              </text>
              <OpacityAnimation
                index={0}
                total={showPrecipitation ? 2 : 1}
                partDuration={ANIMATION_PART_DURATION}
                switchDuration={ANIMATION_SWITCH_DURATION}
              />
            </g>
            {showPrecipitation && (
              <g opacity="0">
                <use
                  href="#i-meteocons-raindrop-measure-fill"
                  x="176"
                  y="34"
                  width="28"
                  height="28"
                  role="img"
                  aria-label={t("label_precipitation")}
                />
                <text
                  x="204"
                  y="48"
                  font-size="12"
                  dominant-baseline="middle"
                  fill={theme.text}
                >
                  <tspan>
                    {precipitation}
                    {t(`unit_${prefPrecipitation}`)}
                  </tspan>
                </text>
                <OpacityAnimation
                  index={1}
                  total={2}
                  partDuration={ANIMATION_PART_DURATION}
                  switchDuration={ANIMATION_SWITCH_DURATION}
                />
              </g>
            )}
          </g>
          <g class=":uno: an-[fade-in]-ease-out-.4s-.3s">
            {/* Wind */}
            <g>
              <use
                href="#i-meteocons-windsock-fill"
                x="176"
                y="58"
                width="28"
                height="28"
                role="img"
                aria-label={t("label_wind_speed")}
              />
              <text
                x="204"
                y="72"
                font-size="12"
                dominant-baseline="middle"
                fill={theme.text}
              >
                <tspan>
                  {windSpeed}
                  {t(`unit_${prefWindSpeed}`)}
                </tspan>
              </text>
              <OpacityAnimation
                index={0}
                total={2}
                partDuration={ANIMATION_PART_DURATION}
                switchDuration={ANIMATION_SWITCH_DURATION}
              />
            </g>
            {/* Sea Level Pressure */}
            <g opacity="0">
              <use
                href="#i-meteocons-barometer-fill"
                x="176"
                y="58"
                width="28"
                height="28"
                role="img"
                aria-label={t("label_sea_level_pressure")}
              />
              <text
                x="204"
                y="72"
                font-size="12"
                dominant-baseline="middle"
                fill={theme.text}
              >
                <tspan>
                  {seaLevelAirPressure}
                  {t(`unit_${prefAirPressure}`)}
                </tspan>
              </text>
              <OpacityAnimation
                index={1}
                total={2}
                partDuration={ANIMATION_PART_DURATION}
                switchDuration={ANIMATION_SWITCH_DURATION}
              />
            </g>
          </g>
        </g>
        {/* Location */}
        <g class=":uno: an-[slide-in-left]-ease-out-.3s">
          <text
            x="392"
            y="8"
            font-size="16"
            text-anchor="end"
            dominant-baseline="hanging"
            fill={theme.text}
            lang={locationLanguage}
          >
            <tspan>{locationLabel}</tspan>
          </text>
          <text
            x="392"
            y="28"
            font-size="12"
            text-anchor="end"
            dominant-baseline="hanging"
            fill-opacity=".8"
            fill={theme.text}
            lang="en-US"
          >
            <tspan>{timezone}</tspan>
          </text>
        </g>
        {/* Time */}
        <g>
          <rect
            class=":uno: an-[reveal-to-right]-ease-out-.4s"
            y="94"
            width="400"
            height="100"
            fill="#ffffff"
            fill-opacity=".2"
          />
          <g class=":uno: an-[slide-in-up]-ease-out-.4s-.1s">
            <text x="12" y="112" font-size="16" fill={theme.text}>
              <tspan>{formattedWeekday}</tspan>
            </text>
            <text
              x="392"
              y="112"
              font-size="12"
              text-anchor="end"
              fill={theme.text}
            >
              <tspan>{formattedDateTime}</tspan>
            </text>
          </g>
        </g>
        {/* Credit. No localization needed. */}
        <g class=":uno: an-[fade-in]-ease-out-.4s-1s" lang="en-US">
          <a
            href="https://github.com/SegaraRai/weather.svg"
            hrefLang="en-US"
            rel="noreferrer"
            referrerpolicy="no-referrer"
            target="_blank"
          >
            <text
              x="392"
              y="76"
              text-anchor="end"
              font-size="7"
              fill-opacity=".4"
              fill={theme.text}
            >
              <tspan>Weather.svg</tspan>
            </text>
          </a>
          <a
            href="https://open-meteo.com/"
            hrefLang="en-US"
            rel="noreferrer"
            referrerpolicy="no-referrer"
            target="_blank"
          >
            <text
              x="392"
              y="86"
              text-anchor="end"
              font-size="7"
              fill-opacity=".4"
              fill={theme.text}
            >
              <tspan>data by Open-Meteo</tspan>
            </text>
          </a>
        </g>
      </g>
    </svg>
  );
}
