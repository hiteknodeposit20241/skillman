# AGENTS.md

## Project Overview

**skillman** is a CLI wrapper to manage project [skills](https://github.com/vercel-labs/skills) and lock them in `skills.json`. It provides a declarative way to install skills per project, similar to how package managers work with `package.json`.

## Architecture

```
src/
├── cli.ts              # CLI entry point with parseArgs
├── config.ts           # skills.json config management
├── skills.ts           # Skills CLI execution
└── utils/
    ├── colors.ts       # ANSI color codes for terminal output
    └── gitignore.ts    # .gitignore file management
test/index.test.ts      # Tests using vitest
```

### Config (src/config.ts)

- `findSkillsConfig(cwd?)` — Finds `skills.json` by traversing up from cwd
- `readSkillsConfig(options?)` — Reads and validates `skills.json` (options: `{ cwd?, createIfNotExists? }`)
- `updateSkillsConfig(updater, options?)` — Generic update with callback (options: `{ cwd?, createIfNotExists? }`, defaults `createIfNotExists: true`)
- `addSkill(source, skills?, options?)` — Adds a skill source (options: `{ cwd?, createIfNotExists? }`, defaults `createIfNotExists: true`)

### Skills CLI (src/skills.ts)

- `findSkillsBinary(cwd?)` — Finds local `skills` binary in node_modules/.bin
- `installSkills(options?)` — Spawns `skills add` for each source with progress logging; options: `{ cwd?, agents?, global?, yes? }`

### CLI Entry (src/cli.ts)

- `main(argv?)` — CLI entry point using Node.js `parseArgs`
- `parseSource(input)` — Parses `owner/repo:skill1:skill2` format into `{ source, skills }`

### Utils (src/utils/)

**colors.ts** — ANSI escape codes for terminal styling:

- `c.reset`, `c.bold`, `c.dim` — formatting
- `c.red`, `c.green`, `c.yellow`, `c.blue`, `c.magenta`, `c.cyan` — colors
- Auto-disabled when stdout is not a TTY

**gitignore.ts** — .gitignore management:

- `findGitignore(cwd?)` — Finds `.gitignore` by traversing up from cwd
- `addGitignoreEntry(entry, options?)` — Adds entry if not present (options: `{ cwd?, createIfNotExists? }`)

### `skills.json` Schema

```ts
interface SkillsConfig {
  skills: SkillSource[];
}

interface SkillSource {
  source: string; // e.g., "vercel-labs/skills"
  skills: string[]; // specific skills to install (empty = all)
}
```

## CLI Commands

```sh
skillman                                    # Install skills (default)
skillman install, i [--agent <name>...]     # Install skills from skills.json
skillman add <source>... [--skill <name>...]  # Add skill source(s) to skills.json
```

### Source Format

Sources can include inline skills using colon-separated syntax:

```sh
skillman add owner/repo              # Add all skills from source
skillman add owner/repo:pdf:commit   # Add specific skills inline
skillman add org/a:skill1 org/b:skill2  # Multiple sources
```

### Options

- `--agent <name>` — Target agent (default: `claude-code`, repeatable)
- `--skill <name>` — Specific skill to add (repeatable, combines with inline skills)
- `-h, --help` — Show help
- `-v, --version` — Show version

## Development

```sh
pnpm install    # Install dependencies
pnpm dev        # Run tests in watch mode
pnpm build      # Build with obuild
pnpm test       # Full test suite with coverage
pnpm lint       # Lint and format check
pnpm typecheck  # TypeScript type checking
```

## Code Style

- ESM only (`"type": "module"`)
- Use explicit `.ts` extensions in imports
- Uses `obuild` for building, `oxlint`/`oxfmt` for linting/formatting
- TypeScript strict mode enabled

## Integration

Skillman delegates actual skill installation to Vercel's skills CLI. It first checks for a local `skills` binary in `node_modules/.bin`, falling back to `npx skills`:

```sh
# Uses local binary if available, otherwise:
npx skills add <source> --skill <name> --agent <agent-name> --yes
```

### Automatic .gitignore

During `install`, skillman automatically adds `.agents` to `.gitignore` (creating the file if needed).

### Install Output

Installation shows colored progress with timing:

```
📦 Installing 2 skills...

◐ [1/2] Installing vercel-labs/skills (pdf, commit)
✔ Installed vercel-labs/skills (2s)

◐ [2/2] Installing anthropics/courses
✔ Installed anthropics/courses (1s)

🎉 Done! 2 skills installed in 3s.
```

## Maintaining Documentation

When making changes to the project (new APIs, architectural changes, updated conventions):

- **`AGENTS.md`** — Update with technical details, architecture, and best practices for AI agents
- **`README.md`** — Update with user-facing documentation (usage, installation, examples) for end users
