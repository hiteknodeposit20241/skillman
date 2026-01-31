import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findSkillsConfig, readSkillsConfig } from "../src/config.ts";
import { findSkillsBinary } from "../src/skills.ts";

describe("findSkillsConfig", () => {
  const testDir = join(import.meta.dirname, ".tmp");

  it("finds skills.json in current directory", async () => {
    const dir = join(testDir, "current");
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "skills.json"), JSON.stringify({ skills: [] }));

    const result = await findSkillsConfig(dir);
    expect(result).toBe(join(dir, "skills.json"));

    await rm(testDir, { recursive: true, force: true });
  });

  it("finds skills.json in parent directory", async () => {
    const parent = join(testDir, "parent");
    const child = join(parent, "child");
    await mkdir(child, { recursive: true });
    await writeFile(join(parent, "skills.json"), JSON.stringify({ skills: [] }));

    const result = await findSkillsConfig(child);
    expect(result).toBe(join(parent, "skills.json"));

    await rm(testDir, { recursive: true, force: true });
  });

  it("returns undefined when not found", async () => {
    const result = await findSkillsConfig("/");
    expect(result).toBeUndefined();
  });
});

describe("readSkillsConfig", () => {
  const testDir = join(import.meta.dirname, ".tmp");

  it("reads and parses skills.json", async () => {
    const dir = join(testDir, "read");
    await mkdir(dir, { recursive: true });
    await writeFile(
      join(dir, "skills.json"),
      JSON.stringify({ skills: [{ source: "test", skills: ["a"] }] }),
    );

    const { config, path } = await readSkillsConfig({ cwd: dir });
    expect(config.skills).toHaveLength(1);
    expect(config.skills[0]?.source).toBe("test");
    expect(path).toBe(join(dir, "skills.json"));

    await rm(testDir, { recursive: true, force: true });
  });

  it("throws when skills.json not found", async () => {
    await expect(readSkillsConfig({ cwd: "/" })).rejects.toThrow("skills.json not found");
  });
});

describe("findSkillsBinary", () => {
  it("finds skills binary in node_modules", () => {
    const binary = findSkillsBinary({ cache: false });
    expect(binary).toBeDefined();
    expect(binary).toMatch(/node_modules[/\\]\.bin[/\\]skills$/);
  });
});
