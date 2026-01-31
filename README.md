# 🤹 skillman

Manage project Agent [skills](https://skills.sh/) from `skills.json`. Uses [`skills`](https://github.com/vercel-labs/skills) CLI under the hood.

## Usage

Add skills to your project:

```sh
npx skillman add vercel-labs/skills:find-skills anthropics/skills:skill-creator
```

```sh
✔ Added vercel-labs/skills to skills.json (find-skills)
✔ Added anthropics/skills to skills.json (skill-creator)
```

This creates a `skills.json` file:

```json
{
  "skills": [
    { "source": "vercel-labs/skills", "skills": ["find-skills"] },
    { "source": "anthropics/skills", "skills": ["skill-creator"] }
  ]
}
```

User can later install all skills from `skills.json`:

```sh
npx skillman
```

```
🤹 Installing 2 skills...

◐ [1/2] Installing vercel-labs/skills (find-skills)
✔ Installed vercel-labs/skills (1s)

◐ [2/2] Installing anthropics/skills (skill-creator)
✔ Installed anthropics/skills (1s)

🎉 Done! 2 skills installed in 2s.
```

## Development

🤖 Are you a robot? Read [AGENTS.md](./AGENTS.md).

<details>

<summary>local development</summary>

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

</details>

## Alternatives

- Proposal PR for adding `skill-lock.json` ([vercel-labs/skills#234](https://github.com/vercel-labs/skills/pull/234))
- Proposal PR for adding `.skills` ([vercel-labs/skills#134](https://github.com/vercel-labs/skills/pull/134))
- [hairyf/skills-manifest](https://github.com/hairyf/skills-manifest)

## License

Published under the [MIT](https://github.com/unjs/skillman/blob/main/LICENSE) license 💛.
