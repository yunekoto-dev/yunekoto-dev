import { writeSvg } from "./svg.js";
import type { GitHubStats } from "../api/github.js";

const n = (value: number) => value.toLocaleString("en-US");

export async function generateGitHubCard(stats: GitHubStats) {
  const rawAvatarHref = stats.avatarUrl
    ? `${stats.avatarUrl}${stats.avatarUrl.includes("?") ? "&" : "?"}s=160`
    : "";
  const avatarHref = rawAvatarHref.replace(/&/g, "&amp;");

  const avatar = avatarHref
    ? `<clipPath id="avatarClip"><circle cx="72" cy="70" r="38"/></clipPath>
       <circle cx="72" cy="70" r="40" fill="url(#g)" filter="url(#glow)"/>
       <image href="${avatarHref}" xlink:href="${avatarHref}" x="34" y="32" width="76" height="76" clip-path="url(#avatarClip)" preserveAspectRatio="xMidYMid slice"/>`
    : `<circle cx="72" cy="70" r="38" fill="url(#g)" filter="url(#glow)"/>`;

  await writeSvg(
    "github.svg",
    `<rect x="1" y="1" width="998" height="298" rx="22" fill="#11111a" stroke="#29293b"/>
     ${avatar}
     <text x="130" y="62" fill="#f5f7ff" font-size="30" font-family="Inter,Arial" font-weight="700">GitHub overview</text>
     <text x="130" y="92" fill="#9296a8" font-size="17" font-family="Inter,Arial">@${stats.login}</text>
     <g font-family="Inter,Arial">
       <text x="55" y="160" fill="#9296a8" font-size="15">REPOSITORIES</text>
       <text x="55" y="198" fill="#f5f7ff" font-size="30" font-weight="700">${n(stats.repos)}</text>
       <text x="280" y="160" fill="#9296a8" font-size="15">STARS</text>
       <text x="280" y="198" fill="#f5f7ff" font-size="30" font-weight="700">${n(stats.stars)}</text>
       <text x="505" y="160" fill="#9296a8" font-size="15">FOLLOWERS</text>
       <text x="505" y="198" fill="#f5f7ff" font-size="30" font-weight="700">${n(stats.followers)}</text>
       <text x="730" y="160" fill="#9296a8" font-size="15">FORKS</text>
       <text x="730" y="198" fill="#f5f7ff" font-size="30" font-weight="700">${n(stats.forks)}</text>
       <text x="55" y="250" fill="#9296a8" font-size="14">Public profile statistics · refreshed automatically</text>
     </g>`
  );
}
