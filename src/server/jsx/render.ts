import {
  NODE_TYPE_FRAGMENT,
  NODE_TYPE_SUBSTANTIAL,
  SYMBOL_NODE_TYPE,
  type Children,
  type Node,
  type PropValue,
} from "./jsx-runtime";

function isPrintablePrimitive(
  value: unknown
): value is string | number | bigint | boolean {
  return (
    value != null &&
    (typeof value === "bigint" ||
      typeof value === "boolean" ||
      typeof value === "number" ||
      typeof value === "string")
  );
}

function isValidTagProp(value: unknown): boolean {
  return typeof value === "string" && /^[a-z][a-z0-9-]*$/i.test(value);
}

function normalizeNewlines(value: string): string {
  // We don't support line endings other than LF and CRLF.
  return value.replaceAll("\r", "").replace(/[\r\u0085\u2028\u2029]/g, "\n");
}

function escapeHTML(value: string): string {
  return normalizeNewlines(value).replace(
    /[&<>"'\n]/g,
    (match) =>
      ({
        "&": "&#38;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&#34;",
        "'": "&#39;",
        "\n": "&#10;",
      })[match]!
  );
}

function escapeHTMLContent(value: string): string {
  return normalizeNewlines(value).replace(
    /[&<>"']/g,
    (match) =>
      ({
        "&": "&#38;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&#34;",
        "'": "&#39;",
      })[match]!
  );
}

function escapeHTMLComment(value: string): string {
  // https://html.spec.whatwg.org/#comments
  return normalizeNewlines(value)
    .replace(/^>/, escapeHTML)
    .replaceAll("--", "&#45;&#45;");
}

function renderAttributes(props: Readonly<Record<string, PropValue>>): string {
  return Object.entries(props)
    .filter(
      ([key, value]) =>
        key !== "key" &&
        key !== "ref" &&
        isValidTagProp(key) &&
        isPrintablePrimitive(value) &&
        value !== false
    )
    .map(([key, value]) => ` ${key}="${escapeHTML(String(value))}"`)
    .join("");
}

function renderChild(children: Children, noNewlines: boolean): string {
  if (children == null || children === false) {
    return "";
  }

  if (isPrintablePrimitive(children)) {
    return noNewlines
      ? escapeHTML(String(children))
      : escapeHTMLContent(String(children));
  }

  if (children[SYMBOL_NODE_TYPE]) {
    return render(children, noNewlines);
  }

  if (import.meta.env.DEV) {
    throw new Error("Invalid children type");
  }

  return "";
}

function renderChildren(
  children: readonly Children[],
  noNewlines: boolean
): string {
  const result = children
    .map((v) => {
      const part = renderChild(v, noNewlines);
      return !noNewlines && part.endsWith(">") ? `${part}\n` : part;
    })
    .join("");
  return !noNewlines && result.includes("\n")
    ? `\n${result.trimEnd()}\n`
    : result;
}

function extractChildren(
  children: readonly Children[]
): Children | readonly Children[] {
  switch (children.length) {
    case 0:
      return;

    case 1:
      return children[0];

    default:
      return children;
  }
}

/**
 * returns true if the tag should not have newlines in its content
 */
function isNoNewlineTag(tag: string): boolean {
  // newlines can affect text rendering in SVG
  return tag === "text" || tag === "tspan";
}

export function render(node: Node, noNewlines = false): string {
  switch (node[SYMBOL_NODE_TYPE]) {
    case NODE_TYPE_SUBSTANTIAL: {
      const { t: tag, p: props } = node;
      const children = node.p.children ? [node.p.children].flat() : node.c;

      if (typeof tag === "string") {
        if (!isValidTagProp(tag)) {
          if (import.meta.env.DEV) {
            throw new Error("Invalid tag name");
          }
          return "";
        }

        // special case for comments
        if (tag === "htmlComment") {
          return `<!--${escapeHTMLComment(String(props.content))}-->`;
        }

        const preamble = `<${tag}${renderAttributes(props)}`;

        return children.some((child) => child != null && child !== "")
          ? `${preamble}>${renderChildren(children, noNewlines || isNoNewlineTag(tag))}</${tag}>`
          : `${preamble} />`;
      }

      if (typeof tag === "function") {
        return render(tag({ ...props, children: extractChildren(children) }));
      }

      if (import.meta.env.DEV) {
        throw new Error("Invalid tag type");
      }
      return "";
    }

    case NODE_TYPE_FRAGMENT: {
      const { c: children } = node;
      return renderChildren(children, noNewlines).trim();
    }

    default:
      if (import.meta.env.DEV) {
        throw new Error("Invalid node type");
      }
      return "";
  }
}
