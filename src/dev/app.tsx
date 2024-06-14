import type { Weather } from "../types/weather";
import { WeatherWidget } from "../widget";
import * as _forecast from "./example/forecast.json";
import * as _geocoding from "./example/reverse-geocode-client.json";

const forecast = _forecast as Weather;

export function App() {
  return (
    <div className="p-10">
      <WeatherWidget
        weather={forecast}
        locationLabel="秋葉原"
        locationLanguage="ja-JP"
        preferences={{
          lang: "ja-JP",
          time_format: "24hn",
          air_pressure: "hpa",
          precipitation: "mm",
          temperature: "celsius",
          wind_speed: "mps",
        }}
        commentCredits=""
      />
    </div>
  );
}
