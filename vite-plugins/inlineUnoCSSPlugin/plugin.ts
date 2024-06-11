import type { Plugin } from "vite";
import { getUnoCSSContent } from "./utils";
import { RESOLVE_ID } from "./config";

export function inlineUnoCSSPlugin(): Plugin {
  let contentPromise: Promise<string> | null = null;

  return {
    name: "inline-unocss",
    resolveId(source) {
      if (source === RESOLVE_ID) {
        return { id: RESOLVE_ID, moduleSideEffects: false };
      }
      return null;
    },
    async load(id) {
      if (id !== RESOLVE_ID) {
        return null;
      }

      contentPromise ??= getUnoCSSContent();

      return await contentPromise;
    },
  };
}
