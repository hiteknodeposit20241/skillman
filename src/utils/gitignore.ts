import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

export async function findGitignore(cwd: string = process.cwd()): Promise<string | undefined> {
  let dir = resolve(cwd);
  const root = dirname(dir);

  while (dir !== root) {
    const candidate = join(dir, ".gitignore");
    if (existsSync(candidate)) {
      return candidate;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  // Check root as well
  const rootCandidate = join(dir, ".gitignore");
  if (existsSync(rootCandidate)) {
    return rootCandidate;
  }

  return undefined;
}

export interface AddGitignoreEntryOptions {
  cwd?: string;
  createIfNotExists?: boolean;
}

export async function addGitignoreEntry(
  entries: string | string[],
  options: AddGitignoreEntryOptions = {},
): Promise<string | undefined> {
  const { cwd, createIfNotExists = true } = options;
  const resolvedCwd = resolve(cwd ?? process.cwd());

  // Normalize and dedupe entries
  const inputEntries = Array.isArray(entries) ? entries : [entries];
  const uniqueEntries = [...new Set(inputEntries.map((e) => e.trim()).filter(Boolean))];

  if (uniqueEntries.length === 0) {
    return undefined;
  }

  let gitignorePath = await findGitignore(resolvedCwd);

  if (!gitignorePath) {
    if (!createIfNotExists) {
      return undefined;
    }
    gitignorePath = join(resolvedCwd, ".gitignore");
    await writeFile(gitignorePath, uniqueEntries.join("\n") + "\n", "utf8");
    return gitignorePath;
  }

  const content = await readFile(gitignorePath, "utf8");
  const existingLines = new Set(content.split("\n").map((line) => line.trim()));

  // Filter out entries that already exist
  const newEntries = uniqueEntries.filter((entry) => !existingLines.has(entry));

  if (newEntries.length === 0) {
    return gitignorePath;
  }

  // Append entries, ensuring there's a newline before them if file doesn't end with one
  const prefix = content.endsWith("\n") ? "" : "\n";
  const newContent = content + prefix + newEntries.join("\n") + "\n";

  await writeFile(gitignorePath, newContent, "utf8");
  return gitignorePath;
}
