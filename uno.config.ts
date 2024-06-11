import {
  defineConfig,
  presetUno,
  toEscapedSelector as e,
  transformerCompileClass,
} from "unocss";

// https://github.com/microsoft/TypeScript/pull/58176#issuecomment-2052698294
export {} from "unocss/preset-mini";

export default defineConfig({
  presets: process.env.NODE_ENV === "development" ? [presetUno()] : [],
  rules: [
    [
      /an-\[([^\]]+)\]-(linear|ease|ease-in|ease-out|ease-in-out)-([\d.]+m?s)(?:-([\d.]+m?s))?(?:-(both|forwards|backwards|none))?/,
      ([, name, method, duration, delay, fill], { rawSelector }) => {
        const selector = e(rawSelector);
        return `
@media (prefers-reduced-motion: no-preference) {
  ${selector} {
    animation: ${name} ${duration} ${method} ${delay ?? "0s"} ${fill ?? "both"}
  }
}
`;
      },
    ],
  ],
  transformers: [
    transformerCompileClass({
      classPrefix: "u",
      alwaysHash: true,
    }),
  ],
});
