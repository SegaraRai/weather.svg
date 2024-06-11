export function parseCSSNumber(value: string): number | null {
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

export function parseCSSDuration(value: string): number | null {
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

export function formatFloat(value: number, fractionDigits: number): string {
  const str1 = value.toString();
  const str2 = value.toFixed(fractionDigits);
  return str1.length <= str2.length ? str1 : str2;
}
