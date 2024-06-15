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

    if (!isFinite(expandX) || !isFinite(expandY)) {
      console.warn(
        "Invalid expandX",
        expandX,
        "or expandY",
        expandY,
        " generated in <symbol />",
        symbolId
      );
      continue;
    }

    if (expandX === 0 && expandY === 0) {
      continue;
    }

    expandX = Math.ceil(expandX + 10);
    expandY = Math.ceil(expandY + 10);

    const newViewBox = `${vbX - expandX} ${vbY - expandY} ${vbWidth + expandX * 2} ${vbHeight + expandY * 2}`;

    symbol.setAttribute("viewBox", newViewBox);
    for (const use of uses) {
      const x = parseFloat(use.getAttribute("x") || "0");
      const y = parseFloat(use.getAttribute("y") || "0");
      const width = parseFloat(use.getAttribute("width") || "0");
      const height = parseFloat(use.getAttribute("height") || "0");
      if (
        !isFinite(x) ||
        !isFinite(y) ||
        !isFinite(width) ||
        !isFinite(height) ||
        width === 0 ||
        height === 0
      ) {
        console.warn(
          "Invalid x",
          x,
          "y",
          y,
          "width",
          width,
          "height",
          height,
          "in <use /> of <symbol />",
          symbolId
        );
        continue;
      }

      let scale = Math.min(width / vbWidth, height / vbHeight);
      if (scale !== 1) {
        console.log("Rare scale", scale, "in <use /> of <symbol />", symbolId);
      }

      const newX = x - expandX * scale;
      const newY = y - expandY * scale;
      const newWidth = (vbWidth + expandX * 2) * scale;
      const newHeight = (vbHeight + expandY * 2) * scale;

      if (newX !== 0) {
        use.setAttribute("x", String(newX));
      }

      if (newY !== 0) {
        use.setAttribute("y", String(newY));
      }

      use.setAttribute("width", String(newWidth));
      use.setAttribute("height", String(newHeight));
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
