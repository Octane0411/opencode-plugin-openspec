import type { PluginInput } from "@opencode-ai/plugin";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Checks if the current workspace is an OpenSpec project.
 * 
 * Detection logic:
 * 1. Checks for `openspec/AGENTS.md` (Primary indicator)
 * 2. Checks for `AGENTS.md` in root (Secondary indicator)
 */
export async function isOpenSpecProject(ctx: PluginInput): Promise<boolean> {
  const openspecAgentsPath = join(ctx.directory, "openspec", "AGENTS.md");
  const rootAgentsPath = join(ctx.directory, "AGENTS.md");

  return existsSync(openspecAgentsPath) || existsSync(rootAgentsPath);
}
