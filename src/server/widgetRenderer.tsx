import { render } from "./jsx/preactCompat";
import { WeatherWidget } from "../widget";
import type { Weather } from "../types/weather";
import type { PreferencesSchema } from "../widget/schemas";
import { injectIconSymbols } from "iconSymbols.tsx";

export function renderWeatherWidget(
  weather: Weather,
  preferences: PreferencesSchema,
  locationLabel: string,
  locationLanguage: string
): string {
  return (
    injectIconSymbols(
      render(
        <WeatherWidget
          weather={weather}
          preferences={preferences}
          locationLabel={locationLabel}
          locationLanguage={locationLanguage}
        />
      )
    ) + "\n"
  );
}
