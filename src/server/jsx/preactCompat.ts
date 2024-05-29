import type { JSX } from "preact";
import { render as renderJSX } from "./render";

export function render(component: JSX.Element): string {
  // @ts-expect-error
  return renderJSX(component);
}
