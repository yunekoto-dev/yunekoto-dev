import { getJson } from "../utils/http.js";

export type GitHubStats = {
  login: string;
  name: string | null;
  avatarUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
  publicGists: number;
  createdAt: string;
  repos: number;
  stars: number;
  forks: number;
};

type User = {
  login: string; name: string | null; avatar_url: string;
  followers: number; following: number; public_repos: number;
  public_gists: number; created_at: string;
};

type Repo = {
  name: string;
  fork: boolean;
  stargazers_count: number;
  forks_count: number;
  languages_url: string;
};

export type LanguageStat = {
  name: string;
  bytes: number;
  percent: number;
};

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
  const user = await getJson<User>(`https://api.github.com/users/${username}`, { headers });
  const repos = await getJson<Repo[]>(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    { headers }
  );

  const ownRepos = repos.filter((repo) => !repo.fork);
  return {
    login: user.login,
    name: user.name,
    avatarUrl: user.avatar_url,
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    publicGists: user.public_gists,
    createdAt: user.created_at,
    repos: ownRepos.length,
    stars: ownRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    forks: ownRepos.reduce((sum, repo) => sum + repo.forks_count, 0)
  };
}

/**
 * Aggregates language byte counts across all of a user's non-fork repositories
 * and returns the top `limit` languages by share of total bytes written.
 */
export async function fetchTopLanguages(
  username: string,
  limit = 6
): Promise<LanguageStat[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
  const repos = await getJson<Repo[]>(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    { headers }
  );

  const ownRepos = repos.filter((repo) => !repo.fork);
  const totals = new Map<string, number>();

  for (const repo of ownRepos) {
    try {
      const languages = await getJson<Record<string, number>>(repo.languages_url, { headers });
      for (const [language, bytes] of Object.entries(languages)) {
        totals.set(language, (totals.get(language) ?? 0) + bytes);
      }
    } catch {
      // Skip repos whose language data can't be read (e.g. empty repos).
    }
  }

  const totalBytes = [...totals.values()].reduce((sum, bytes) => sum + bytes, 0);
  if (totalBytes === 0) return [];

  return [...totals.entries()]
    .map(([name, bytes]) => ({ name, bytes, percent: (bytes / totalBytes) * 100 }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, limit);
}
