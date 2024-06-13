import type { ComponentProps } from "preact";
import type { Theme } from "./theme";

export function WidgetBackgroundGradient({
  theme,
  ...props
}: { readonly theme: Theme } & ComponentProps<"linearGradient">) {
  return (
    <linearGradient x1="0" x2="2" y1="0" y2="3" {...props}>
      <animate
        attributeName="x2"
        values="2;2.5;2"
        dur="11s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="y2"
        values="3;3.5;3"
        dur="13s"
        repeatCount="indefinite"
      />
      <stop offset="0" stop-color={theme.backgroundGradient1} />
      <stop offset="1" stop-color={`${theme.backgroundGradient2}33`}>
        <animate
          attributeName="stop-color"
          values={`${theme.backgroundGradient2}33;${theme.backgroundGradient2b}55;${theme.backgroundGradient2}33`}
          dur="10s"
          repeatCount="indefinite"
        />
      </stop>
    </linearGradient>
  );
}
