import { fileURLToPath } from "node:url";
import unocss from "unocss/vite";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import yaml from "@rollup/plugin-yaml";
import {
  iconSymbolsPlugin,
  inlineUnoCSSPlugin,
  dummyInlineUnoCSSPlugin,
} from "./vite-plugins";

export default defineConfig(({ mode }) => {
  if (mode === "development") {
    return {
      plugins: [
        iconSymbolsPlugin("development"),
        // dummy plugin to provide `inline-uno.css?inline` content
        dummyInlineUnoCSSPlugin(),
        // yaml for importing translations
        yaml(),
        unocss(),
        // preact is only used for development purposes
        // in production, preact will be replaced with custom JSX runtime (see ./src/server/jsx/jsx-runtime.ts)
        preact(),
      ],
    };
  }

  return {
    build: {
      minify: "esbuild",
      // esbuild doesn't seem to merge CSS rules with same media queries; lightningcss does.
      cssMinify: "lightningcss",
      rollupOptions: {
        input: "src/server/index.ts",
        output: {
          dir: "dist",
          format: "esm",
          entryFileNames: () =>
            mode === "production" ? "server.js" : "preview.server.js",
        },
        preserveEntrySignatures: "strict",
      },
      target: "esnext",
    },
    plugins: [
      iconSymbolsPlugin("production"),
      inlineUnoCSSPlugin(),
      yaml(),
      unocss(),
    ],
    esbuild: {
      jsx: "transform",
      jsxFactory: "h",
      jsxFragment: "Fragment",
      jsxImportSource: "#server/jsx",
      jsxInject: `import { h, Fragment } from "#server/jsx/jsx-runtime";`,
    },
    resolve: {
      alias: {
        "#server/jsx/jsx-runtime": fileURLToPath(
          new URL("./src/server/jsx/jsx-runtime.ts", import.meta.url)
        ),
      },
    },
  };
});
