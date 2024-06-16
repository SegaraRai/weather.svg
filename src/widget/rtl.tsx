import type { JSX as PreactJSX } from "preact";

export function isRTLLanguage(language: string): boolean {
  const locale = new Intl.Locale(language);
  // @ts-expect-error
  const textInfo = locale.getTextInfo?.() ?? locale.textInfo;
  return textInfo?.direction === "rtl";
}

export function createLogicalComponent<T extends "rect" | "text" | "use">(
  tagName: T,
  boxWidth: number,
  flip: boolean
) {
  const Tag = tagName;
  if (!flip) {
    return (props: PreactJSX.SVGAttributes<SVGElementTagNameMap[T]>) => (
      // @ts-expect-error
      <Tag {...props} />
    );
  }

  return ({ ...props }) => {
    const x = boxWidth - Number(props.x ?? "0") - Number(props.width ?? "0");
    const textAnchor =
      tagName === "text" ? props["text-anchor"] ?? "start" : undefined;
    const flippedTextAnchor =
      textAnchor === "start"
        ? "end"
        : textAnchor === "end"
          ? "start"
          : textAnchor;

    // @ts-expect-error
    return <Tag {...props} x={x} text-anchor={flippedTextAnchor} />;
  };
}
