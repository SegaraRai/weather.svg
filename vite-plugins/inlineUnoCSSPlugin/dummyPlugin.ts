import type { Plugin } from "vite";
import { RESOLVE_ID } from "./config";

export function dummyInlineUnoCSSPlugin(): Plugin {
  return {
    name: "inline-unocss-dummy",
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

      return "";
    },
  };
}
