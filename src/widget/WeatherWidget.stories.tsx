import type { Meta, StoryObj } from "@storybook/preact";

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
}) {
  const weather = PRESETS[weatherPreset] as Weather;

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
      control: {
        type: "radio",
        options: ["auto", "12h", "24h", "24hn"],
      },
    },
    airPressure: {
      control: {
        type: "radio",
        options: Object.keys(PRESSURE_CONVERSION_MAP),
      },
    },
    precipitation: {
      control: {
        type: "radio",
        options: Object.keys(LENGTH_CONVERSION_MAP),
      },
    },
    temperature: {
      control: {
        type: "radio",
        options: Object.keys(TEMPERATURE_CONVERSION_MAP),
      },
    },
    windSpeed: {
      control: {
        type: "radio",
        options: Object.keys(SPEED_CONVERSION_MAP),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof WeatherWidgetWithPreset>;

export const WEATHER_EARLY_MORNING_RAINY_EN_EN: Story = {
  args: {
    weatherPreset: "WEATHER_EARLY_MORNING_RAINY_CA",
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

export const WEATHER_EVENING_CLOUDY_EN_EN: Story = {
  args: {
    weatherPreset: "WEATHER_EVENING_CLOUDY_ID",
    locationLabel: "Delhi Cantonment",
    locationLanguage: "en-US",
    language: "en-US",
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
