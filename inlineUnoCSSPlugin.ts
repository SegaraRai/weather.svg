import fsp from "node:fs/promises";
import { build } from "@unocss/cli";
import type { Plugin } from "vite";

const ID = "inline.uno.css?inline";

async function getUnoCSSContent(): Promise<string> {
  const filename = `./__inline-unocss-${Date.now()}.css`;

  await build({
    cwd: process.cwd(),
    config: "./unocss.config.ts",
    stdout: false,
    minify: true,
    outFile: filename,
    patterns: ["./src/**/*.{js,mjs,jsx,ts,mts,tsx}"],
  });

  const content = (await fsp.readFile(filename, "utf-8")).trim();
  await fsp.unlink(filename);

  return content;
}

let contentPromise: Promise<string> | null = null;

export function inlineUnoCSSPlugin(): Plugin {
  return {
    name: "inline-unocss",
    resolveId(source) {
      if (source === ID) {
        return { id: ID, moduleSideEffects: false };
      }
      return null;
    },
    async load(id) {
      if (id !== ID) {
        return null;
      }

      contentPromise ??= getUnoCSSContent();

      return await contentPromise;
    },
  };
}

export function dummyInlineUnoCSSPlugin(): Plugin {
  return {
    name: "inline-unocss-dummy",
    resolveId(source) {
      if (source === ID) {
        return { id: ID, moduleSideEffects: false };
      }
      return null;
    },
    async load(id) {
      if (id !== ID) {
        return null;
      }

      return "";
    },
  };
}
