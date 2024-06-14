import { injectIconSymbols } from "iconSymbols.tsx";
import type { Weather } from "../types/weather";
import { WeatherWidget } from "../widget";
import type { PreferencesSchema } from "../widget/schemas";
import { pRender } from "./jsx";

export function renderWeatherWidget(
  weather: Weather,
  preferences: PreferencesSchema,
  locationLabel: string,
  locationLanguage: string,
  commentCredits: string
): string {
  return injectIconSymbols(
    pRender(
      <WeatherWidget
        weather={weather}
        preferences={preferences}
        locationLabel={locationLabel}
        locationLanguage={locationLanguage}
        commentCredits={commentCredits}
      />
    )
  );
}
