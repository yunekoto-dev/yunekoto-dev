import { writeFile, readFile } from "node:fs/promises";
import { profile } from "../config/profile.js";
import { projects } from "../config/projects.js";
import { fetchGitHubStats, fetchTopLanguages } from "./api/github.js";
import { generateGitHubCard } from "./generators/github-card.js";
import { generateLanguagesCard } from "./generators/languages-card.js";
import { safe } from "./utils/http.js";

const fallbackGithub = {
  login: profile.username, name: profile.displayName, avatarUrl: "", followers: 0,
  following: 0, publicRepos: 0, publicGists: 0, createdAt: "", repos: 0, stars: 0, forks: 0
};

const github = await safe("GitHub", fallbackGithub, () => fetchGitHubStats(profile.username));
const languages = await safe("GitHub languages", [], () => fetchTopLanguages(profile.username));

await generateGitHubCard(github);
await generateLanguagesCard(languages);

const featured = projects.filter((p) => p.featured).map((p) => {
  const title = p.url !== "#" ? `[${p.name}](${p.url})` : p.name;
  return `### ${title}\n${p.description}\n\n**${p.status}** · ${p.technologies.map((t) => `\`${t}\``).join(" · ")}\n`;
}).join("\n");

const projectPlaceholders = projects.filter((p) => !p.featured).map((p) => {
  const title = p.url !== "#" ? `[${p.name}](${p.url})` : p.name;
  return `- **${title}** — ${p.description} · *${p.status}*`;
}).join("\n");

const readmeTemplate = await readFile("README.template.md", "utf8");
const readme = readmeTemplate
  .replaceAll("{{DISPLAY_NAME}}", profile.displayName)
  .replaceAll("{{TAGLINE}}", profile.tagline)
  .replaceAll("{{MOTTO}}", profile.motto)
  .replaceAll("{{ABOUT}}", profile.about.map((x) => `${x}\n`).join("\n"))
  .replaceAll("{{LEARNING}}", profile.learning.map((x) => `- ${x}`).join("\n"))
  .replaceAll("{{FEATURED_PROJECTS}}", featured)
  .replaceAll("{{PROJECT_PLACEHOLDERS}}", projectPlaceholders)
  .replaceAll("{{CONTACT_EMAIL}}", profile.contacts.email)
  .replaceAll("{{CONTACT_GITHUB}}", profile.contacts.github)
  .replaceAll("{{CONTACT_DISCORD}}", profile.contacts.discord)
  .replaceAll("{{VIEWS_USERNAME}}", profile.username);

await writeFile("README.md", readme, "utf8");
console.log("Profile generated successfully.");
