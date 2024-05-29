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
  return value.replace(/[\r\u0085\u2028\u2029]/g, "\n");
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

function escapeHTMLComment(value: string): string {
  // https://html.spec.whatwg.org/#comments
  return normalizeNewlines(value)
    .replace(/^>/, escapeHTML)
    .replaceAll("--", "&#45;&#45;");
}

function renderProps(props: Readonly<Record<string, PropValue>>): string {
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

function renderChild(children: Children): string {
  if (children == null || children === false) {
    return "";
  }

  if (isPrintablePrimitive(children)) {
    return escapeHTML(String(children));
  }

  if (children[SYMBOL_NODE_TYPE]) {
    return render(children);
  }

  if (import.meta.env.DEV) {
    throw new Error("Invalid children type");
  }

  return "";
}

function renderChildren(children: readonly Children[]): string {
  const result = children
    .map((v) => {
      const part = renderChild(v);
      return part.endsWith(">") ? `${part}\n` : part;
    })
    .join("");
  return result.includes("\n") ? `\n${result.trimEnd()}\n` : result;
}

function extractChildren(
  children: readonly Children[]
): Children | readonly Children[] {
  return children.length === 0
    ? undefined
    : children.length === 1
      ? children[0]
      : children;
}

export function render(node: Node): string {
  switch (node[SYMBOL_NODE_TYPE]) {
    case NODE_TYPE_SUBSTANTIAL: {
      const { t: tag, p: props, c: children } = node;
      if (typeof tag === "string") {
        if (!isValidTagProp(tag)) {
          if (import.meta.env.DEV) {
            throw new Error("Invalid tag name");
          }
          return "";
        }

        if (tag === "htmlComment") {
          return `<!--${escapeHTMLComment(String(props.content))}-->`;
        }

        const preamble = `<${tag}${renderProps(props)}`;

        return children.some((child) => child != null && child !== "")
          ? `${preamble}>${renderChildren(children)}</${tag}>`
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
      return renderChildren(children).trim();
    }

    default:
      if (import.meta.env.DEV) {
        throw new Error("Invalid node type");
      }
      return "";
  }
}
