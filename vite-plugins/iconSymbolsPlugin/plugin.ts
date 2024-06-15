import fg from "fast-glob";
import fsp from "node:fs/promises";
import type { Plugin } from "vite";
import { OPTIMIZE_FLOAT_PRECISION, RESOLVE_ID } from "./config";
import { expandClippedViewBox } from "./expandClippedViewBox";
import { optimizeSVG } from "./optimizeSVG";
import { repeatSVGAnimations } from "./repeatSVGAnimations";

// use dynamic import to avoid TypeScript error regarding JSON import (import attributes vs. import assertions)
// note that import attributes are erased by Vite (esbuild)
const { default: meteocons } = await import(
  "@iconify-json/meteocons/icons.json",
  {
    with: { type: "json" },
  }
);

export function iconSymbolsPlugin(mode: "development" | "production"): Plugin {
  return {
    name: "icon-symbols",
    resolveId(source) {
      if (source === RESOLVE_ID) {
        return { id: RESOLVE_ID, moduleSideEffects: false };
      }
      return null;
    },
    async load(id) {
      if (id === RESOLVE_ID) {
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
              .map((key, i) => {
                const content = optimizeSVG(
                  expandClippedViewBox(
                    repeatSVGAnimations(meteocons.icons[key].body)
                  ),
                  `i${i.toString(36).padStart(2, "0")}`,
                  OPTIMIZE_FLOAT_PRECISION
                );
                return [
                  `i-meteocons-${key}`,
                  `<symbol id="i-meteocons-${key}" viewBox="0 0 512 512">${content}</symbol>`,
                ];
              })
          );

          return `
const ICON_MAP = ${JSON.stringify(iconMap)};

export function IconSymbolsDefs() {
  return <htmlComment content="__ICON_SYMBOLS_PLACEHOLDER__" />;
}

export function injectIconSymbols(source: string): string {
  const usedIcons = Array.from(new Set(source.match(/i-meteocons-[a-z0-9-]+/g) ?? [])).sort();
  const replacement = usedIcons.map(icon => ICON_MAP[icon]).join("\\n");
  return source.replace("<!--__ICON_SYMBOLS_PLACEHOLDER__-->", replacement);
}
`;
        } else {
          // During development, we inject all icons via a component (`<symbols>` elements)
          const allIcons = Object.entries(meteocons.icons)
            .map(([key, icon]) => {
              const content = optimizeSVG(
                expandClippedViewBox(repeatSVGAnimations(icon.body)),
                `i-${key}--`,
                OPTIMIZE_FLOAT_PRECISION
              );
              return `<symbol id="i-meteocons-${key}" viewBox="0 0 512 512">${content}</symbol>`;
            })
            .join("\n");

          return `
export function IconSymbolsDefs() {
  return (
    <>
${allIcons}
    </>
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
