export const SYMBOL_NODE_TYPE = Symbol("node");
export const NODE_TYPE_SUBSTANTIAL = 1;
export const NODE_TYPE_FRAGMENT = 2;

export type PropValue = string | bigint | number | null | undefined | boolean;

export type Component = (props: Record<string, unknown>) => Node;

export interface SubstantialNode {
  readonly [SYMBOL_NODE_TYPE]: typeof NODE_TYPE_SUBSTANTIAL;
  readonly t: string | Component;
  readonly p: Readonly<Record<string, PropValue>>;
  readonly c: readonly Children[];
}

export interface FragmentNode {
  readonly [SYMBOL_NODE_TYPE]: typeof NODE_TYPE_FRAGMENT;
  readonly c: readonly Children[];
}

export type Node = SubstantialNode | FragmentNode;

export type Children =
  | Node
  | string
  | bigint
  | number
  | null
  | undefined
  | boolean;

export function h(
  tag: string | Component,
  props: Readonly<Record<string, PropValue>>,
  ...children: Children[]
): SubstantialNode {
  return {
    [SYMBOL_NODE_TYPE]: NODE_TYPE_SUBSTANTIAL,
    t: tag,
    p: props ?? {},
    c: children ?? [],
  };
}

export function Fragment({
  children,
}: {
  readonly children: readonly Children[];
}): FragmentNode {
  return {
    [SYMBOL_NODE_TYPE]: NODE_TYPE_FRAGMENT,
    c: children ?? [],
  };
}
