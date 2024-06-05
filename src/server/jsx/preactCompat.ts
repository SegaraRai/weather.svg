import type { JSX } from "preact";
import type { Node } from "./jsx-runtime";
import { render } from "./render";

export function fromPreact(component: JSX.Element): Node {
  return component as unknown as Node;
}

export function pRender(component: JSX.Element): string {
  return render(fromPreact(component));
}
