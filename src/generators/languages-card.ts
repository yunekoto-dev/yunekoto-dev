import { writeSvg } from "./svg.js";
import { theme } from "../../config/theme.js";
import type { LanguageStat } from "../api/github.js";

const PALETTE = [theme.accent, theme.accent2, "#5cc8ff", "#5cffb0", "#ffcf5c", "#ff5c8a"];

export async function generateLanguagesCard(languages: LanguageStat[]) {
  if (languages.length === 0) {
    await writeSvg(
      "languages.svg",
      `<rect x="1" y="1" width="998" height="298" rx="22" fill="#11111a" stroke="#29293b"/>
       <text x="55" y="60" fill="#f5f7ff" font-size="30" font-family="Inter,Arial" font-weight="700">Most used languages</text>
       <text x="55" y="150" fill="#9296a8" font-size="17" font-family="Inter,Arial">No language data available yet.</text>`
    );
    return;
  }

  const barX = 55;
  const barWidth = 890;
  const barHeight = 26;
  const barY = 110;

  let cursor = 0;
  const segments = languages
    .map((lang, i) => {
      const width = (lang.percent / 100) * barWidth;
      const x = barX + cursor;
      cursor += width;
      const color = PALETTE[i % PALETTE.length];
      return `<rect x="${x.toFixed(2)}" y="${barY}" width="${width.toFixed(2)}" height="${barHeight}" fill="${color}"/>`;
    })
    .join("\n       ");

  const legend = languages
    .map((lang, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = barX + col * 300;
      const y = 190 + row * 40;
      const color = PALETTE[i % PALETTE.length];
      return `<circle cx="${x}" cy="${y - 6}" r="7" fill="${color}"/>
       <text x="${x + 18}" y="${y}" fill="#f5f7ff" font-size="16" font-family="Inter,Arial" font-weight="600">${lang.name}</text>
       <text x="${x + 18}" y="${y + 18}" fill="#9296a8" font-size="13" font-family="Inter,Arial">${lang.percent.toFixed(1)}%</text>`;
    })
    .join("\n       ");

  await writeSvg(
    "languages.svg",
    `<rect x="1" y="1" width="998" height="298" rx="22" fill="#11111a" stroke="#29293b"/>
     <text x="55" y="60" fill="#f5f7ff" font-size="30" font-family="Inter,Arial" font-weight="700">Most used languages</text>
     <text x="55" y="88" fill="#9296a8" font-size="15" font-family="Inter,Arial">Aggregated across all public, non-forked repositories</text>
     <rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" rx="13" fill="#1c1c2b"/>
     <clipPath id="barClip"><rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" rx="13"/></clipPath>
     <g clip-path="url(#barClip)">
       ${segments}
     </g>
     <g>
       ${legend}
     </g>`
  );
}
