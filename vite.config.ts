import { fileURLToPath } from "node:url";
import unocss from "unocss/vite";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import yaml from "@rollup/plugin-yaml";
import { iconSymbolsPlugin } from "./iconSymbolsPlugin.js";

export default defineConfig(({ mode }) => {
  if (mode === "development") {
    return {
      plugins: [
        iconSymbolsPlugin("development"),
        // yaml for importing translations
        yaml(),
        // preact and unocss are used only for development purposes
        // in production, unocss styles will NOT be shipped to improve browser compatibility
        // preact will be replaced with something produces static HTML
        preact(),
        unocss(),
      ],
    };
  }

  return {
    build: {
      minify: mode !== "preview",
      rollupOptions: {
        input: "src/server/index.ts",
        output: {
          dir: "dist",
          format: "esm",
          entryFileNames: () => "server.js",
        },
        preserveEntrySignatures: "strict",
      },
      target: "esnext",
    },
    plugins: [iconSymbolsPlugin("production"), yaml()],
    esbuild: {
      jsx: "transform",
      jsxFactory: "h",
      jsxFragment: "Fragment",
      jsxImportSource: "server-jsx",
      jsxInject: `import { h, Fragment } from "server-jsx/jsx-runtime";`,
    },
    resolve: {
      alias: {
        "server-jsx/jsx-runtime": fileURLToPath(
          new URL("./src/server/jsx/jsx-runtime.ts", import.meta.url)
        ),
      },
    },
  };
});
