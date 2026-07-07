import { afterEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createConfigHook } from "./config";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

async function createOpenSpecProject() {
  const dir = await mkdtemp(join(tmpdir(), "openspec-plugin-"));
  tempDirs.push(dir);
  await mkdir(join(dir, "openspec"), { recursive: true });
  await writeFile(join(dir, "openspec", "config.yaml"), "project: test\n");
  return dir;
}

async function loadOpenSpecAgent() {
  const directory = await createOpenSpecProject();
  const config: Record<string, any> = {};
  await createConfigHook({ directory })!(config);
  return config.agent["openspec-plan"];
}

function wildcardMatch(input: string, pattern: string) {
  let escaped = pattern
    .replaceAll("\\", "/")
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".");

  if (escaped.endsWith(" .*")) {
    escaped = escaped.slice(0, -3) + "( .*)?";
  }

  return new RegExp(`^${escaped}$`, "s").test(input.replaceAll("\\", "/"));
}

function evaluate(rules: Record<string, "ask" | "allow" | "deny">, value: string) {
  return (
    Object.entries(rules)
      .filter(([pattern]) => wildcardMatch(value, pattern))
      .at(-1)?.[1] ?? "ask"
  );
}

describe("createConfigHook", () => {
  test("keeps implementation files read-only while allowing OpenSpec documents", async () => {
    const agent = await loadOpenSpecAgent();

    expect(evaluate(agent.permission.edit, "src/app.ts")).toBe("deny");
    expect(evaluate(agent.permission.edit, "project.md")).toBe("allow");
    expect(evaluate(agent.permission.edit, "AGENTS.md")).toBe("allow");
    expect(evaluate(agent.permission.edit, "openspec/AGENTS.md")).toBe("allow");
    expect(evaluate(agent.permission.edit, "specs/feature/spec.md")).toBe("allow");
  });

  test("denies bash write bypasses without blocking read-only exploration", async () => {
    const agent = await loadOpenSpecAgent();
    const bash = agent.permission.bash;

    expect(evaluate(bash, "cat README.md")).toBe("allow");
    expect(evaluate(bash, "echo ready")).toBe("allow");
    expect(evaluate(bash, "find specs -name '*.md'")).toBe("allow");
    expect(evaluate(bash, "git diff -- specs/feature/spec.md")).toBe("allow");
    expect(evaluate(bash, "openspec new change add-login")).toBe("allow");

    expect(evaluate(bash, "cat > src/app.ts")).toBe("deny");
    expect(evaluate(bash, "echo ready > src/app.ts")).toBe("deny");
    expect(evaluate(bash, "tee src/app.ts")).toBe("deny");
    expect(evaluate(bash, "cp specs/a.md src/app.ts")).toBe("deny");
    expect(evaluate(bash, "mv specs/a.md src/app.ts")).toBe("deny");
    expect(evaluate(bash, "rm src/app.ts")).toBe("deny");
    expect(evaluate(bash, "mkdir src/generated")).toBe("deny");
    expect(evaluate(bash, "find . -delete")).toBe("deny");
    expect(evaluate(bash, "find . -exec rm {} ;")).toBe("deny");
    expect(evaluate(bash, "git diff > src/app.patch")).toBe("deny");
  });
});
