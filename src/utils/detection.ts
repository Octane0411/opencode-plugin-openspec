import type { PluginInput } from "@opencode-ai/plugin";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Checks if the current workspace is an OpenSpec project.
 *
 * Detection logic:
 * 1. Checks for `openspec/config.yaml` (Primary indicator - new OPSX format)
 * 2. Checks for `openspec/AGENTS.md` (Fallback - legacy format)
 */
export async function isOpenSpecProject(ctx: PluginInput): Promise<boolean> {
  const openspecDir = join(ctx.directory, "openspec");
  const configYamlPath = join(openspecDir, "config.yaml");
  const agentsMdPath = join(openspecDir, "AGENTS.md");

  return existsSync(configYamlPath) || existsSync(agentsMdPath);
}
