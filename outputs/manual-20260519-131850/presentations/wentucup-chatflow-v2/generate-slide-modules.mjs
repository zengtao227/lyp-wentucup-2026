import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const workspace = path.dirname(fileURLToPath(import.meta.url));
const slidesDir = path.join(workspace, "slides");

await fs.mkdir(slidesDir, { recursive: true });

for (let index = 1; index <= 28; index += 1) {
  const padded = String(index).padStart(2, "0");
  const source = [
    'import { buildSlide } from "./shared.mjs";',
    "",
    `export async function slide${padded}(presentation, ctx) {`,
    `  return buildSlide(presentation, ctx, ${index});`,
    "}",
    "",
  ].join("\n");
  await fs.writeFile(path.join(slidesDir, `slide-${padded}.mjs`), source, "utf8");
}
