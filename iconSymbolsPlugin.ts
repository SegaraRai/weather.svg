import fsp from "node:fs/promises";
import fg from "fast-glob";
import type { Plugin } from "vite";
import meteocons from "@iconify-json/meteocons/icons.json" assert { type: "json" };
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";

const ID = "iconSymbols.tsx";

function parseCSSNumber(value: string): number | null {
  const match = /^(\d*\.\d+|\d+\.\d*|\d+)$/.exec(value)?.[1];
  if (!match) {
    console.warn(`Cannot parse CSS number: ${value}`);
    return null;
  }

  const parsed = parseFloat(match[0] === "." ? `0${match}` : match);
  if (!isFinite(parsed)) {
    console.warn(`Invalid CSS number: ${value}`);
  }

  return parsed;
}

function parseCSSDuration(value: string): number | null {
  const [, strNumber, unit] =
    /^(\d*\.\d+|\d+\.\d*|\d+)(\D+)$/.exec(value) ?? [];
  if (!strNumber || !unit) {
    console.warn(`Cannot parse CSS duration: ${value}`);
    return null;
  }

  const scale = {
    s: 1,
    ms: 0.001,
  }[unit];
  if (!scale) {
    console.warn(`Unsupported CSS duration unit: ${value}`);
    return null;
  }

  const parsed = parseCSSNumber(strNumber);
  if (parsed == null) {
    console.warn(`Cannot parse CSS duration: ${value}`);
    return null;
  }

  return parsed * scale;
}

function formatFloat(value: number, fractionDigits: number): string {
  const str1 = value.toString();
  const str2 = value.toFixed(fractionDigits);
  return str1.length <= str2.length ? str1 : str2;
}

/**
 * Adjusts the animations of the meteocons icon SVG.
 * @param source the SVG source of meteocons, without the `<svg>` tag
 * @returns the fixed SVG source
 */
function enhanceIconAnimations(source: string): string {
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

export function iconSymbolsPlugin(mode: "development" | "production"): Plugin {
  return {
    name: "icon-symbols",
    resolveId(source) {
      if (source === ID) {
        return { id: ID, moduleSideEffects: false };
      }
      return null;
    },
    async load(id) {
      if (id === ID) {
        if (mode === "production") {
          // On production, we first extract all used icons on build time and write them to a map for later (runtime) injection.
          // The component is only for placeholder and will be replaced by the injected icons on post-processing.
          const files = await fg("src/**/*.{ts,tsx}");
          const usedIconSet = new Set<string>();
          for (const file of files) {
            const content = await fsp.readFile(file, "utf-8");
            const matches = content.match(/i-meteocons-[a-z0-9-]+/g) ?? [];
            for (const match of matches) {
              usedIconSet.add(match);
              usedIconSet.add(match.replace(/-day\b/, "-night"));
              usedIconSet.add(match.replace(/-night\b/, "-day"));
            }
          }

          const usedIcons = Array.from(usedIconSet).sort();
          const iconMap = Object.fromEntries(
            usedIcons
              .map(
                (fullKey) =>
                  fullKey.replace(
                    /^i-meteocons-/,
                    ""
                  ) as keyof (typeof meteocons)["icons"]
              )
              .map((key) => [
                `i-meteocons-${key}`,
                `<symbol id="i-meteocons-${key}" viewBox="0 0 512 512">${enhanceIconAnimations(meteocons.icons[key].body)}</symbol>\n`,
              ])
          );

          return `
const ICON_MAP = ${JSON.stringify(iconMap)};

export function IconSymbolsDefs() {
  return <htmlComment content="__ICON_SYMBOLS_PLACEHOLDER__" />;
}

export function injectIconSymbols(source: string): string {
  const usedIcons = Array.from(new Set(source.match(/i-meteocons-[a-z0-9-]+/g) ?? []));
  const replacement = usedIcons.map(icon => ICON_MAP[icon]).join("");
  return source.replace("<!--__ICON_SYMBOLS_PLACEHOLDER__-->", \`<defs>\\n\${replacement}</defs>\`);
}
`;
        } else {
          // During development, we inject all icons via a component (`<symbols>` elements)
          const allIcons = Object.entries(meteocons.icons)
            .map(
              ([key, icon]) =>
                `<symbol id="i-meteocons-${key}" viewBox="0 0 512 512">${enhanceIconAnimations(icon.body)}</symbol>`
            )
            .join("\n");

          return `
export function IconSymbolsDefs() {
  return (
    <defs>
${allIcons}
    </defs>
  );
}

export function injectIconSymbols(_source: string): string {
  throw new Error("not available on development build");
}
`;
        }
      }
      return null;
    },
  };
}
