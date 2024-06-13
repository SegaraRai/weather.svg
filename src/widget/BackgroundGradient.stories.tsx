import type { Meta, StoryObj } from "@storybook/preact";

import { WidgetBackgroundGradient } from "./BackgroundGradient";
import { getTheme } from "./theme";

const BG_COLOR = "#111";

function formatTime(hour: number, minute: number): string {
  return `2024-05-23T${String(hour).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0"
  )}:00`;
}

function WidgetBackgroundWithText({
  currentHour,
  currentMinute,
  sunriseHour,
  sunriseMinute,
  sunsetHour,
  sunsetMinute,
}: {
  currentHour: number;
  currentMinute: number;
  sunriseHour: number;
  sunriseMinute: number;
  sunsetHour: number;
  sunsetMinute: number;
}) {
  const theme = getTheme(
    formatTime(currentHour, currentMinute),
    formatTime(sunriseHour, sunriseMinute),
    formatTime(sunsetHour, sunsetMinute)
  );
  return (
    <svg
      width="800"
      height="240"
      viewBox="0 0 400 120"
      style={`background:${BG_COLOR};`}
    >
      <defs>
        <WidgetBackgroundGradient id="background-gradient" theme={theme} />
      </defs>
      <g font-family="system-ui, sans-serif">
        <rect width="400" height="120" fill="url(#background-gradient)" />
        <text x="12" y="40" font-size="28" fill={theme.text}>
          Example Text
        </text>
        <text x="12" y="64" font-size="16" fill={theme.text} opacity=".8">
          Example Text 2
        </text>
        <text x="12" y="78" font-size="8" fill={theme.text} opacity=".4">
          Example Text 3
        </text>
        <g>
          <rect
            y="94"
            width="400"
            height="100"
            fill="#ffffff"
            fill-opacity=".2"
          />
          <g>
            <text x="12" y="112" font-size="16" fill={theme.text}>
              Footer Example
            </text>
          </g>
        </g>
      </g>
    </svg>
  );
}

const meta: Meta<typeof WidgetBackgroundWithText> = {
  component: WidgetBackgroundWithText,
  argTypes: {
    currentHour: {
      control: {
        type: "number",
        min: 0,
        max: 23,
        step: 1,
      },
    },
    currentMinute: {
      control: {
        type: "number",
        min: 0,
        max: 59,
        step: 15,
      },
    },
    sunriseHour: {
      control: {
        type: "number",
        min: 0,
        max: 23,
        step: 1,
      },
    },
    sunriseMinute: {
      control: {
        type: "number",
        min: 0,
        max: 59,
        step: 15,
      },
    },
    sunsetHour: {
      control: {
        type: "number",
        min: 0,
        max: 23,
        step: 1,
      },
    },
    sunsetMinute: {
      control: {
        type: "number",
        min: 0,
        max: 59,
        step: 15,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof WidgetBackgroundWithText>;

export const WIDGET_BACKGROUND: Story = {
  args: {
    currentHour: 12,
    currentMinute: 0,
    sunriseHour: 4,
    sunriseMinute: 30,
    sunsetHour: 18,
    sunsetMinute: 45,
  },
};
