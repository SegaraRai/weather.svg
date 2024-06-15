import type { Meta, StoryObj } from "@storybook/preact";

import { useLayoutEffect } from "preact/hooks";
import type { Weather } from "../types/weather";
import { WeatherWidget } from "./WeatherWidget";
import {
  LENGTH_CONVERSION_MAP,
  PRESSURE_CONVERSION_MAP,
  SPEED_CONVERSION_MAP,
  TEMPERATURE_CONVERSION_MAP,
} from "./conversion";
import type { PreferencesSchema } from "./schemas";
import * as PRESETS from "./storybook-weather-presets";

const WEATHER_ICONS = [
  "auto",
  "i-meteocons-clear-day-fill",
  "i-meteocons-drizzle-fill",
  "i-meteocons-extreme-drizzle-fill",
  "i-meteocons-extreme-rain-fill",
  "i-meteocons-extreme-snow-fill",
  "i-meteocons-fog-fill",
  "i-meteocons-overcast-fill",
  "i-meteocons-partly-cloudy-day-fill",
  "i-meteocons-rain-fill",
  "i-meteocons-snow-fill",
  "i-meteocons-thunderstorms-fill",
].flatMap((icon) => {
  const nightIcon = icon.replace(/-day\b/, "-night");
  return icon !== nightIcon ? [icon, nightIcon] : [icon];
});

function WeatherWidgetWithPreset({
  weatherPreset,
  locationLabel,
  locationLanguage,
  language,
  timeFormat,
  airPressure,
  precipitation,
  temperature,
  windSpeed,
  weatherIcon,
}: {
  readonly weatherPreset: keyof typeof PRESETS;
  readonly locationLabel: string;
  readonly locationLanguage: string;
  readonly language: string;
  readonly timeFormat: PreferencesSchema["time_format"];
  readonly airPressure: PreferencesSchema["air_pressure"];
  readonly precipitation: PreferencesSchema["precipitation"];
  readonly temperature: PreferencesSchema["temperature"];
  readonly windSpeed: PreferencesSchema["wind_speed"];
  readonly weatherIcon?: string | null;
}) {
  const weather = PRESETS[weatherPreset] as Weather;

  useLayoutEffect(() => {
    if (!weatherIcon || weatherIcon === "auto") {
      return;
    }

    const weatherIconUse = document.querySelector(
      'use[width="80"]'
    ) as SVGUseElement | null;

    if (!weatherIconUse) {
      return;
    }

    if (!weatherIconUse.dataset.original) {
      weatherIconUse.dataset.original = weatherIconUse.getAttribute("href")!;
    }
    weatherIconUse.setAttribute("href", `#${weatherIcon}`);

    return (): void => {
      const original = weatherIconUse.dataset.original;
      if (original) {
        weatherIconUse.setAttribute("href", original);
      }
      weatherIconUse.dataset.original = "";
    };
  }, [weatherIcon]);

  return (
    <WeatherWidget
      weather={weather}
      locationLabel={locationLabel}
      locationLanguage={locationLanguage}
      preferences={{
        lang: language,
        time_format: timeFormat,
        air_pressure: airPressure,
        precipitation,
        temperature,
        wind_speed: windSpeed,
      }}
      commentCredits=""
    />
  );
}

const meta: Meta<typeof WeatherWidgetWithPreset> = {
  component: WeatherWidgetWithPreset,
  argTypes: {
    weatherPreset: {
      options: Object.keys(PRESETS),
      control: {
        type: "select",
      },
    },
    weatherIcon: {
      options: WEATHER_ICONS,
      control: {
        type: "select",
      },
    },
    locationLabel: {
      control: {
        type: "text",
      },
    },
    locationLanguage: {
      control: {
        type: "text",
      },
    },
    language: {
      control: {
        type: "text",
      },
    },
    timeFormat: {
      options: ["auto", "12h", "24h", "24hn"],
      control: {
        type: "radio",
      },
    },
    airPressure: {
      options: Object.keys(PRESSURE_CONVERSION_MAP),
      control: {
        type: "radio",
      },
    },
    precipitation: {
      options: Object.keys(LENGTH_CONVERSION_MAP),
      control: {
        type: "radio",
      },
    },
    temperature: {
      options: Object.keys(TEMPERATURE_CONVERSION_MAP),
      control: {
        type: "radio",
      },
    },
    windSpeed: {
      options: Object.keys(SPEED_CONVERSION_MAP),
      control: {
        type: "radio",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof WeatherWidgetWithPreset>;

export const WEATHER_EARLY_MORNING_RAINY_EN_EN: Story = {
  args: {
    weatherPreset: "WEATHER_EARLY_MORNING_RAINY_CA",
    weatherIcon: "auto",
    locationLabel: "Vancouver, BC",
    locationLanguage: "en-CA",
    language: "en-CA",
    timeFormat: "12h",
    airPressure: "hpa",
    precipitation: "inch",
    temperature: "fahrenheit",
    windSpeed: "mph",
  },
};

export const WEATHER_MORNING_CLEAR_EN_EN: Story = {
  args: {
    weatherPreset: "WEATHER_MORNING_CLEAR_US",
    weatherIcon: "auto",
    locationLabel: "Boston, MA",
    locationLanguage: "en-US",
    language: "en-US",
    timeFormat: "12h",
    airPressure: "hpa",
    precipitation: "inch",
    temperature: "fahrenheit",
    windSpeed: "mph",
  },
};

export const WEATHER_MORNING_CLOUDY_EN_EN: Story = {
  args: {
    weatherPreset: "WEATHER_MORNING_CLOUDY_US",
    weatherIcon: "auto",
    locationLabel: "Kansas City, MO",
    locationLanguage: "en-US",
    language: "en-US",
    timeFormat: "12h",
    airPressure: "hpa",
    precipitation: "inch",
    temperature: "fahrenheit",
    windSpeed: "mph",
  },
};

export const WEATHER_AFTERNOON_CLOUDY_EN_EN: Story = {
  args: {
    weatherPreset: "WEATHER_AFTERNOON_CLOUDY_GB",
    weatherIcon: "auto",
    locationLabel: "Leeds",
    locationLanguage: "en-GB",
    language: "en-GB",
    timeFormat: "12h",
    airPressure: "hpa",
    precipitation: "inch",
    temperature: "fahrenheit",
    windSpeed: "mph",
  },
};

export const WEATHER_AFTERNOON_CLOUDY_PL_PL: Story = {
  args: {
    weatherPreset: "WEATHER_AFTERNOON_CLOUDY_PL",
    weatherIcon: "auto",
    locationLabel: "Warszawa",
    locationLanguage: "pl-PL",
    language: "pl-PL",
    timeFormat: "12h",
    airPressure: "hpa",
    precipitation: "mm",
    temperature: "celsius",
    windSpeed: "mps",
  },
};

export const WEATHER_EVENING_CLOUDY_DE_DE: Story = {
  args: {
    weatherPreset: "WEATHER_EVENING_CLOUDY_DE",
    weatherIcon: "auto",
    locationLabel: "Frankfurt am Main",
    locationLanguage: "de-DE",
    language: "de-DE",
    timeFormat: "auto",
    airPressure: "hpa",
    precipitation: "mm",
    temperature: "celsius",
    windSpeed: "mps",
  },
};

export const WEATHER_NIGHT_CLOUDY_JA_JA: Story = {
  args: {
    weatherPreset: "WEATHER_NIGHT_CLOUDY_JP",
    weatherIcon: "auto",
    locationLabel: "千代田区, 東京都",
    locationLanguage: "ja-JP",
    language: "ja-JP",
    timeFormat: "auto",
    airPressure: "hpa",
    precipitation: "mm",
    temperature: "celsius",
    windSpeed: "mps",
  },
};

export const WEATHER_NIGHT_RAINY_VN_VN: Story = {
  args: {
    weatherPreset: "WEATHER_NIGHT_RAINY_VN",
    weatherIcon: "auto",
    locationLabel: "Hà Nội",
    locationLanguage: "vn-VN",
    language: "vn-VN",
    timeFormat: "auto",
    airPressure: "hpa",
    precipitation: "mm",
    temperature: "celsius",
    windSpeed: "mps",
  },
};
