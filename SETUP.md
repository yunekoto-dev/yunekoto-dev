# Setup

## 1. Create the profile repository

The repository must be named exactly:

```text
yunekoto-dev
```

and belong to the GitHub account `yunekoto-dev`.

A profile README is displayed automatically when a public repository has the same name as the account.

## 2. Install

```bash
npm install
```

## 3. Local generation

GitHub data works without credentials in most cases (unauthenticated rate limits apply):

```bash
npm run build
```

To raise the GitHub API rate limit (recommended, since language stats fetch every repo), set:

```text
GITHUB_TOKEN=...
```

You can use a local `.env` with your preferred environment loader, or export the variable in your shell.

## 4. GitHub Actions secrets

`GITHUB_TOKEN` is supplied automatically by GitHub Actions — no extra secrets are required.

## 5. Set your contact links

Open `config/profile.ts` and fill in the `contacts` object (email, website, socials) with your real information.

## 6. Update your emulator link

Open:

```text
config/projects.ts
```

and replace:

```ts
url: "#"
```

with the public URL of the emulator repository when you publish it.

## 7. Add future projects

Add another object to `projects`:

```ts
{
  name: "My project",
  description: "What it does.",
  technologies: ["Rust", "TypeScript"],
  status: "Public",
  url: "https://github.com/yunekoto-dev/my-project",
  featured: true
}
```

The next workflow run will regenerate the profile.

## 8. Refresh frequency

The workflow runs every hour and can also be launched manually from the Actions tab, keeping the GitHub stats and language breakdown up to date.
