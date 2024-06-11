import fsp from "node:fs/promises";
import { build } from "@unocss/cli";

export async function getUnoCSSContent(): Promise<string> {
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
