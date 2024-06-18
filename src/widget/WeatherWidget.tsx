import { IconSymbolsDefs } from "iconSymbols.tsx";
import inlineUnoCSS from "inline.uno.css?inline";
import type { Weather } from "../types/weather";
import { WidgetBackgroundGradient } from "./BackgroundGradient";
import { HTMLComment } from "./HTMLComment";
import { OpacityAnimation } from "./OpacityAnimation";
import animationsCSS from "./animations.css?inline";
import commentBanner from "./bannerComment.txt?raw";
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
import { formatDateTime } from "./format";
import { getWeatherIcon } from "./icons";
import { resolvePreferences } from "./resolvePreferences";
import rootCSS from "./root.css?inline";
import { createLogicalComponent, isRTLLanguage } from "./rtl";
import type { PreferencesSchema } from "./schemas";
import { getTheme } from "./theme";
import { getTranslation, getTranslationLanguage } from "./translations";

const ANIMATION_PART_DURATION = 8;
const ANIMATION_SWITCH_DURATION = 0.4;

export function WeatherWidget({
  weather,
  locationLabel,
  locationLanguage,
  preferences,
  commentCredits,
}: {
  readonly weather: Weather;
  readonly locationLabel: string;
  readonly locationLanguage: string;
  readonly preferences: PreferencesSchema;
  readonly commentCredits: string;
}) {
  const { lang: language } = preferences;
  const {
    airPressure: prefAirPressure,
    precipitation: prefPrecipitation,
    temperature: prefTemperature,
    windSpeed: prefWindSpeed,
    timeFormat: prefTimeFormat,
  } = resolvePreferences(preferences);

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
  const showPrecipitation = weather.hourly.precipitation[hourlyIndex] >= 3;

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
    weather.hourly.precipitation[hourlyIndex]
  ).toFixed(LENGTH_FRACTION_DIGITS_MAP[prefPrecipitation]);
  const windSpeed = SPEED_CONVERSION_MAP[prefWindSpeed](
    weather.current.wind_speed_10m
  ).toFixed(SPEED_FRACTION_DIGITS_MAP[prefWindSpeed]);
  const seaLevelAirPressure = PRESSURE_CONVERSION_MAP[prefAirPressure](
    weather.current.pressure_msl
  ).toFixed(PRESSURE_FRACTION_DIGITS_MAP[prefAirPressure]);

  const translationLanguage = getTranslationLanguage(language);
  const t = (key: string): string =>
    getTranslation(translationLanguage, key) ??
    getTranslation(null, key) ??
    (import.meta.env.DEV ? key : "");

  const isRTL = isRTLLanguage(language);
  const BOX_SIZE = 400;
  const LRect = createLogicalComponent("rect", BOX_SIZE, isRTL);
  const LText = createLogicalComponent("text", BOX_SIZE, isRTL);
  const LUse = createLogicalComponent("use", BOX_SIZE, isRTL);

  return (
    <svg
      width="800"
      height="240"
      viewBox="0 0 400 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <HTMLComment>{commentBanner + commentCredits}</HTMLComment>
      <defs>
        <style>
          {animationsCSS}
          {rootCSS}
          {inlineUnoCSS}
        </style>
        <IconSymbolsDefs />
        <clipPath id="widget-clip">
          <rect width="400" height="120" />
        </clipPath>
        <WidgetBackgroundGradient id="background-gradient" theme={theme} />
        <linearGradient id="mask-gradient" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#000" />
          <stop offset=".05" stop-color="#fff" />
          <stop offset=".95" stop-color="#fff" />
          <stop offset="1" stop-color="#000" />
        </linearGradient>
        <mask id="description-mask">
          <LRect
            x="80"
            y="40"
            width="112"
            height="30"
            fill="url(#mask-gradient)"
          />
        </mask>
        <mask id="location-mask">
          <LRect
            x="250"
            y="0"
            width="148"
            height="60"
            fill="url(#mask-gradient)"
          />
        </mask>
      </defs>
      <g
        clip-path="url(#widget-clip)"
        lang={language}
        font-family="system-ui,sans-serif,'Helvetica Neue',Arial"
        style="font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;"
      >
        <rect
          class=":uno: an-[fade-in]-ease-out-.3s-.7s"
          width="400"
          height="120"
          fill="url(#background-gradient)"
        />
        <g class=":uno: an-[fade-in]-ease-out-.4s-1s">
          {/* Weather icon */}
          <LUse
            href={`#${getWeatherIcon(
              weather.current.weather_code,
              weather.current.is_day
            )}`}
            y="-2"
            width="80"
            height="80"
          />
          {/* Weather description */}
          <g mask="url(#description-mask)">
            <LText
              x="88"
              y="64"
              font-size="12"
              fill-opacity=".8"
              fill={theme.text}
            >
              <tspan>
                {t(`wmo_${weather.current.weather_code}`) ?? t("wmo_unknown")}
              </tspan>
            </LText>
          </g>
          {/* Temperature */}
          <LText x="88">
            <tspan
              {...(isRTL ? { x: "290", "text-anchor": "end" } : {})}
              y="12"
              font-size="36"
              dominant-baseline="hanging"
              fill={theme.text}
            >
              {temperature}
            </tspan>
            <tspan
              {...(isRTL ? { x: "312", "text-anchor": "end" } : { dx: "2" })}
              y="14"
              font-size="20"
              dominant-baseline="hanging"
              fill={theme.text}
              fill-opacity=".8"
            >
              {t(`unit_${prefTemperature}`)}
            </tspan>
          </LText>
        </g>
        {/* Humidity, Precipitation, Wind and Air Pressure */}
        <g>
          <g class=":uno: an-[fade-in]-ease-out-.4s-1.2s">
            {/* Humidity */}
            <LUse
              href="#i-meteocons-humidity-fill"
              x="192"
              y="10"
              width="28"
              height="28"
              role="img"
              aria-label={t("label_humidity")}
            />
            <LText
              x="220"
              y="24"
              font-size="12"
              dominant-baseline="middle"
              fill={theme.text}
            >
              <tspan>
                {humidity}
                {t("unit_percent")}
              </tspan>
            </LText>
          </g>
          <g class=":uno: an-[fade-in]-ease-out-.4s-1.3s">
            {/* Precipitation */}
            <g>
              <LUse
                href="#i-meteocons-umbrella-fill"
                x="192"
                y="34"
                width="28"
                height="28"
                role="img"
                aria-label={t("label_precipitation_probability")}
              />
              <LText
                x="220"
                y="48"
                font-size="12"
                dominant-baseline="middle"
                fill={theme.text}
              >
                <tspan>
                  {precipitationProbability}
                  {t("unit_percent")}
                </tspan>
              </LText>
              <OpacityAnimation
                index={0}
                total={showPrecipitation ? 2 : 1}
                partDuration={ANIMATION_PART_DURATION}
                switchDuration={ANIMATION_SWITCH_DURATION}
              />
            </g>
            {showPrecipitation && (
              <g opacity="0">
                <LUse
                  href="#i-meteocons-raindrop-measure-fill"
                  x="192"
                  y="34"
                  width="28"
                  height="28"
                  role="img"
                  aria-label={t("label_precipitation")}
                />
                <LText
                  x="220"
                  y="48"
                  font-size="12"
                  dominant-baseline="middle"
                  fill={theme.text}
                >
                  <tspan>
                    {precipitation}
                    {t(`unit_${prefPrecipitation}`)}
                  </tspan>
                </LText>
                <OpacityAnimation
                  index={1}
                  total={2}
                  partDuration={ANIMATION_PART_DURATION}
                  switchDuration={ANIMATION_SWITCH_DURATION}
                />
              </g>
            )}
          </g>
          <g class=":uno: an-[fade-in]-ease-out-.4s-1.3s">
            {/* Wind */}
            <g>
              <LUse
                href="#i-meteocons-windsock-fill"
                x="192"
                y="58"
                width="28"
                height="28"
                role="img"
                aria-label={t("label_wind_speed")}
              />
              <LText
                x="220"
                y="72"
                font-size="12"
                dominant-baseline="middle"
                fill={theme.text}
              >
                <tspan>
                  {windSpeed}
                  {t(`unit_${prefWindSpeed}`)}
                </tspan>
              </LText>
              <OpacityAnimation
                index={0}
                total={2}
                partDuration={ANIMATION_PART_DURATION}
                switchDuration={ANIMATION_SWITCH_DURATION}
              />
            </g>
            {/* Sea Level Pressure */}
            <g opacity="0">
              <LUse
                href="#i-meteocons-barometer-fill"
                x="192"
                y="58"
                width="28"
                height="28"
                role="img"
                aria-label={t("label_sea_level_pressure")}
              />
              <LText
                x="220"
                y="72"
                font-size="12"
                dominant-baseline="middle"
                fill={theme.text}
              >
                <tspan>
                  {seaLevelAirPressure}
                  {t(`unit_${prefAirPressure}`)}
                </tspan>
              </LText>
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
        <g
          class={
            isRTL
              ? ":uno: an-[slide-in-left-rtl]-ease-out-.3s-1s"
              : ":uno: an-[slide-in-left]-ease-out-.3s-1s"
          }
          mask="url(#location-mask)"
        >
          <LText
            x="392"
            y="8"
            font-size="16"
            text-anchor="end"
            dominant-baseline="hanging"
            fill={theme.text}
            lang={locationLanguage}
          >
            <tspan>{locationLabel}</tspan>
          </LText>
          <LText
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
          </LText>
        </g>
        {/* Time */}
        <g>
          <rect
            class={
              isRTL
                ? ":uno: an-[reveal-to-right-rtl]-ease-out-.4s-1s"
                : ":uno: an-[reveal-to-right]-ease-out-.4s-1s"
            }
            y="94"
            width="400"
            height="100"
            fill="#ffffff"
            fill-opacity=".2"
          />
          <g class=":uno: an-[slide-in-up]-ease-out-.4s-1.1s">
            <LText x="8" y="112" font-size="16" fill={theme.text}>
              <tspan>{formattedWeekday}</tspan>
            </LText>
            <LText
              x="392"
              y="112"
              font-size="12"
              text-anchor="end"
              fill={theme.text}
            >
              <tspan>{formattedDateTime}</tspan>
            </LText>
          </g>
        </g>
        {/* Credit. No localization needed. */}
        <g class=":uno: an-[fade-in]-ease-out-.4s-2s" lang="en-US">
          <a
            href="https://github.com/SegaraRai/weather.svg"
            hrefLang="en-US"
            rel="noreferrer"
            referrerpolicy="no-referrer"
            target="_blank"
          >
            <LText
              x="392"
              y="76"
              text-anchor="end"
              font-size="7"
              fill-opacity=".4"
              fill={theme.text}
            >
              <tspan>Weather.svg</tspan>
            </LText>
          </a>
          <a
            href="https://open-meteo.com/"
            hrefLang="en-US"
            rel="noreferrer"
            referrerpolicy="no-referrer"
            target="_blank"
          >
            <LText
              x="392"
              y="86"
              text-anchor="end"
              font-size="7"
              fill-opacity=".4"
              fill={theme.text}
            >
              <tspan>data by Open-Meteo</tspan>
            </LText>
          </a>
        </g>
      </g>
    </svg>
  );
}
