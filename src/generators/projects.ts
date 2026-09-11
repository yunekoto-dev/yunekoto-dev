import { projects } from "../../config/projects.js";
import { writeFile } from "node:fs/promises";

export async function generateProjectsMarkdown() {
  const featured = projects.filter((p) => p.featured);
  const lines = featured.map((p) => {
    const tech = p.technologies.map((t) => `\`${t}\``).join(" · ");
    const title = p.url !== "#" ? `[${p.name}](${p.url})` : p.name;
    return `### ${title}\n${p.description}\n\n**${p.status}** · ${tech}\n`;
  });

  return lines.join("\n");
}
