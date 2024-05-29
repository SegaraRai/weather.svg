const WEATHER_ICON_MAP = {
  // Clear sky
  0: "i-meteocons-clear-day-fill",
  // Mainly clear, partly cloudy, and overcast
  1: "i-meteocons-partly-cloudy-day-fill",
  2: "i-meteocons-partly-cloudy-day-fill",
  3: "i-meteocons-overcast-fill",
  // Fog and depositing rime fog
  45: "i-meteocons-fog-fill",
  48: "i-meteocons-fog-fill",
  // Drizzle: Light, moderate, and dense intensity
  51: "i-meteocons-drizzle-fill",
  53: "i-meteocons-drizzle-fill",
  55: "i-meteocons-extreme-drizzle-fill",
  // Freezing Drizzle: Light and dense intensity
  56: "i-meteocons-drizzle-fill",
  57: "i-meteocons-extreme-drizzle-fill",
  // Rain: Slight, moderate and heavy intensity
  61: "i-meteocons-rain-fill",
  63: "i-meteocons-rain-fill",
  65: "i-meteocons-extreme-rain-fill",
  // Freezing Rain: Light and heavy intensity
  66: "i-meteocons-rain-fill",
  67: "i-meteocons-extreme-rain-fill",
  // Snow fall: Slight, moderate, and heavy intensity
  71: "i-meteocons-snow-fill",
  73: "i-meteocons-snow-fill",
  75: "i-meteocons-extreme-snow-fill",
  // Snow grains
  77: "i-meteocons-snow-fill",
  // Rain showers: Slight, moderate, and violent
  80: "i-meteocons-extreme-rain-fill",
  81: "i-meteocons-extreme-rain-fill",
  82: "i-meteocons-extreme-rain-fill",
  // Snow showers slight and heavy
  85: "i-meteocons-extreme-snow-fill",
  86: "i-meteocons-extreme-snow-fill",
  // Thunderstorm: Slight or moderate
  95: "i-meteocons-thunderstorms-fill",
  // Thunderstorm with slight and heavy hail
  96: "i-meteocons-thunderstorms-fill",
  97: "i-meteocons-thunderstorms-fill",
};

export function getWeatherIcon(weatherCode: number, isDay: 0 | 1) {
  return (
    WEATHER_ICON_MAP[weatherCode as keyof typeof WEATHER_ICON_MAP] ??
    "i-meteocons-clear-day-fill"
  ).replace(/-day\b/, isDay ? "-day" : "-night");
}
