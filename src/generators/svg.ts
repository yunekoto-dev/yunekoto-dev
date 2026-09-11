import { mkdir, writeFile } from "node:fs/promises";
import { theme } from "../../config/theme.js";

export async function writeSvg(filename: string, body: string, width = 1000, height = 300) {
  await mkdir("generated", { recursive: true });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0" stop-color="${theme.accent}"/>
      <stop offset="1" stop-color="${theme.accent2}"/>
    </linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  ${body}
</svg>`;
  await writeFile(`generated/${filename}`, svg, "utf8");
}
