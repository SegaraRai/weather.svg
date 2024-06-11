import { parseCSSDuration, parseCSSNumber, formatFloat } from "./utils";

/**
 * Adjusts the animations of the meteocons icon SVG.
 * @param source the SVG source of meteocons, without the `<svg>` tag
 * @returns the fixed SVG source
 */
export function repeatSVGAnimations(source: string): string {
  const ANIMATION_WAIT_SECS = 4;

  const parsed = new DOMParser().parseFromString(
    `<svg>${source}</svg>`,
    "image/svg+xml"
  );

  for (const element of [
    // `querySelectorAll` is not supported by xmldom
    ...Array.from(parsed.getElementsByTagName("animate")),
    ...Array.from(parsed.getElementsByTagName("animateTransform")),
  ]) {
    if (element.hasAttribute("repeatCount")) {
      continue;
    }

    const duration = parseCSSDuration(
      element.getAttribute("dur")?.trim() ?? "indefinite"
    );
    const values = element
      .getAttribute("values")
      ?.trim()
      ?.replace(/;\s*$/, "")
      .split(/;\s*/);
    const strKeyTimes = element.getAttribute("keyTimes")?.trim();
    const keyTimes =
      (strKeyTimes
        ? strKeyTimes
            ?.replace(/;\s*$/, "")
            .split(/;\s*/)
            .map((value) => parseCSSNumber(value))
        : null) ??
      new Array(values?.length ?? 0)
        .fill(0)
        .map((_, i) => i / (values?.length ?? 1));
    if (!duration || !isFinite(duration) || !values?.length) {
      console.warn("Non-repeatable animation", element);
      continue;
    }

    values.push(values[values.length - 1]);
    const newKeyTimes = [
      ...keyTimes.map((keyTime) => {
        if (keyTime == null) {
          throw new Error("keyTime is null");
        }
        return (keyTime * duration) / (duration + ANIMATION_WAIT_SECS);
      }),
      1,
    ];

    element.setAttribute("repeatCount", "indefinite");
    element.setAttribute(
      "dur",
      `${formatFloat(duration + ANIMATION_WAIT_SECS, 2)}s`
    );
    element.setAttribute("values", values.join(";"));
    element.setAttribute(
      "keyTimes",
      newKeyTimes.map((item) => formatFloat(item, 2)).join(";")
    );
  }

  // `innerHTML` is not supported by xmldom
  return new XMLSerializer()
    .serializeToString(parsed.documentElement)
    .replace(/^<svg>/, "")
    .replace(/<\/svg>$/, "");
}
