type ThemeKey = "midnight" | "morning" | "day" | "evening" | "night";

export interface Theme {
  backgroundGradient1: string;
  backgroundGradient2: string;
  backgroundGradient2b: string;
  text: string;
}

const THEME_MAP: Record<ThemeKey, Theme> = {
  // midnight: jet black
  midnight: {
    backgroundGradient1: "#06083c",
    backgroundGradient2: "#0f0127",
    backgroundGradient2b: "#03093c",
    text: "#fdfdfd",
  },
  // morning: pale blue
  morning: {
    backgroundGradient1: "#d4e0f2",
    backgroundGradient2: "#f5f9fb",
    backgroundGradient2b: "#ddf2e7",
    text: "#05080a",
  },
  // day: sky blue
  day: {
    backgroundGradient1: "#a6dcef",
    backgroundGradient2: "#f3f0f8",
    backgroundGradient2b: "#e0f2f1",
    text: "#05080a",
  },
  // evening: orange
  evening: {
    backgroundGradient1: "#f9d976",
    backgroundGradient2: "#f3f7ec",
    backgroundGradient2b: "#f9e3d5",
    text: "#05080a",
  },
  // night: dark blue
  night: {
    backgroundGradient1: "#1f2437",
    backgroundGradient2: "#46385c",
    backgroundGradient2b: "#3a4f2d",
    text: "#fdfdfd",
  },
};

function blendRGB(a: string, b: string, ratio: number): string {
  return `#${[1, 3, 5]
    .map((i) =>
      Math.round(
        parseInt(a.slice(i, i + 2), 16) * (1 - ratio) +
          parseInt(b.slice(i, i + 2), 16) * ratio
      )
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
}

function ease(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function cut(t: number): number {
  return t < 0.5 ? Math.min(t, 0.4) : Math.max(t, 0.6);
}

function hyperCut(t: number): number {
  return t < 0.5 ? Math.min(t, 0.1) : Math.max(t, 0.9);
}

export function getTheme(
  current: string,
  sunrise: string,
  sunset: string
): Theme {
  const sunriseTimestamp = new Date(sunrise + "Z").getTime();
  const sunsetTimestamp = new Date(sunset + "Z").getTime();
  const daylightDuration = sunsetTimestamp - sunriseTimestamp;
  const nightDuration = 86400_000 - daylightDuration;
  const currentTimestamp = new Date(current + "Z").getTime();

  const timeThemePairs = [-1, 0, 1].flatMap(
    (i) =>
      [
        [i * 86400_000 + sunriseTimestamp + nightDuration / 6, "morning"],
        [i * 86400_000 + sunriseTimestamp + (daylightDuration / 6) * 4, "day"],
        [i * 86400_000 + sunsetTimestamp - nightDuration / 6, "evening"],
        [i * 86400_000 + sunsetTimestamp + nightDuration / 6, "night"],
        [i * 86400_000 + sunsetTimestamp + (nightDuration / 6) * 5, "midnight"],
      ] as [number, ThemeKey][]
  );

  const before = timeThemePairs
    .filter(([timestamp]) => timestamp < currentTimestamp)
    .pop()!;
  const after = timeThemePairs.filter(
    ([timestamp]) => timestamp >= currentTimestamp
  )[0];
  const ratio = ease((currentTimestamp - before[0]) / (after[0] - before[0]));

  const beforeTheme = THEME_MAP[before[1]];
  const afterTheme = THEME_MAP[after[1]];

  return {
    backgroundGradient1: blendRGB(
      beforeTheme.backgroundGradient1,
      afterTheme.backgroundGradient1,
      ratio
    ),
    backgroundGradient2: blendRGB(
      beforeTheme.backgroundGradient2,
      afterTheme.backgroundGradient2,
      cut(ratio)
    ),
    backgroundGradient2b: blendRGB(
      beforeTheme.backgroundGradient2b,
      afterTheme.backgroundGradient2b,
      cut(ratio)
    ),
    text: blendRGB(beforeTheme.text, afterTheme.text, hyperCut(ratio)), // hyperCut for more contrast
  };
}
