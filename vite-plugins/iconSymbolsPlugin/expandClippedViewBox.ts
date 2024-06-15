import { DOMParser, XMLSerializer } from "@xmldom/xmldom";

/**
 * Adjusts the animations of the meteocons icon SVG.
 * @param source the SVG source of meteocons, without the `<svg>` tag
 * @returns the fixed SVG source
 */
export function expandClippedViewBox(source: string): string {
  const parsed = new DOMParser().parseFromString(
    `<svg>${source}</svg>`,
    "image/svg+xml"
  );

  l: for (const symbol of Array.from(parsed.getElementsByTagName("symbol"))) {
    const symbolId = symbol.getAttribute("id");
    if (!symbolId) {
      console.warn("<symbol /> without id attribute");
      continue;
    }

    const uses = Array.from(parsed.getElementsByTagName("use")).filter(
      (element) => element.getAttribute("href") === `#${symbolId}`
    );
    if (!uses.length) {
      console.warn("<symbol />", symbolId, "not used");
      continue;
    }

    const viewBox = symbol
      .getAttribute("viewBox")
      ?.trim()
      .split(/\s+/)
      .map(parseFloat);
    if (viewBox?.length !== 4) {
      console.warn("Invalid viewBox", viewBox, "in <symbol />", symbolId);
      continue;
    }

    const [vbX, vbY, vbWidth, vbHeight] = viewBox;
    for (const use of uses) {
      const width = use.getAttribute("width")?.trim();
      const height = use.getAttribute("height")?.trim();

      if (!width || !height) {
        console.warn(
          "Missing width or height in <use /> of <symbol />",
          symbolId
        );
        continue l;
      }

      const diffWidth = Math.abs(parseFloat(width) - vbWidth);
      const diffHeight = Math.abs(parseFloat(height) - vbHeight);
      if (diffWidth >= 1 || diffHeight >= 1) {
        console.warn(
          "Mismatched width or height in <use /> of <symbol />",
          symbolId,
          width,
          height,
          "vs",
          vbWidth,
          vbHeight
        );
        continue l;
      }
    }

    let expandX = 0;
    let expandY = 0;

    for (const animateTransform of Array.from(
      symbol.getElementsByTagName("animateTransform")
    )) {
      if (animateTransform.getAttribute("type") !== "translate") {
        continue;
      }

      const values = animateTransform
        .getAttribute("values")
        ?.trim()
        .split(/;\s*/)
        .filter(Boolean);
      if (!values?.length) {
        console.warn(
          "Invalid values attribute in <animateTransform /> in <symbol />",
          symbolId
        );
        continue;
      }

      const [minX, maxX, minY, maxY] = values.reduce(
        ([minX, maxX, minY, maxY], value) => {
          const [x, y] = value.trim().split(/\s+/).map(parseFloat);
          return [
            Math.min(minX, x),
            Math.max(maxX, x),
            Math.min(minY, y),
            Math.max(maxY, y),
          ];
        },
        [Infinity, -Infinity, Infinity, -Infinity]
      );

      expandX = Math.max(expandX, Math.abs(minX), Math.abs(maxX));
      expandY = Math.max(expandY, Math.abs(minY), Math.abs(maxY));
    }

    if (expandX === 0 && expandY === 0) {
      continue;
    }

    expandX = Math.ceil(expandX + 10);
    expandY = Math.ceil(expandY + 10);

    const newViewBox = `${vbX - expandX} ${vbY - expandY} ${vbWidth + expandX * 2} ${vbHeight + expandY * 2}`;

    symbol.setAttribute("viewBox", newViewBox);
    for (const use of uses) {
      if (expandX) {
        use.setAttribute("x", String(-expandX));
      }

      if (expandY) {
        use.setAttribute("y", String(-expandY));
      }

      use.setAttribute("width", String(vbWidth + expandX * 2));
      use.setAttribute("height", String(vbHeight + expandY * 2));
    }

    /*
    console.info(
      "Expanded viewBox for <symbol />",
      symbolId,
      "by",
      expandX,
      expandY,
      "referenced",
      uses.length,
      "times"
    );
    //*/
  }

  // `innerHTML` is not supported by xmldom
  return new XMLSerializer()
    .serializeToString(parsed.documentElement)
    .replace(/^<svg>/, "")
    .replace(/<\/svg>$/, "");
}
