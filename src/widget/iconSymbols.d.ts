// see iconSymbolsPlugin.ts

declare module "iconSymbols.tsx" {
  import type { JSX } from "preact";

  export function IconSymbolsDefs(): JSX.Element;
  export function injectIconSymbols(source: string): string;
}
