import type { Hooks } from "@opencode-ai/plugin";
import { isOpenSpecProject } from "./utils/detection";
import { OPENSPEC_SYSTEM_PROMPT } from "./prompts";

export function createConfigHook(ctx: { directory: string }): Hooks["config"] {
  return async (config) => {
    // 1. Check if this is an OpenSpec project
    const mockCtx = { directory: ctx.directory } as any;
    
    if (!await isOpenSpecProject(mockCtx)) {
      return;
    }

    // 2. Define the OpenSpec Plan Agent
    const openSpecAgent = {
      name: "openspec-plan",
      mode: "primary",
      description: "OpenSpec Architect - Plan and specify software architecture.",
      prompt: OPENSPEC_SYSTEM_PROMPT,
      permission: {
        edit: {
          "**/*.spec.md": "allow",
          "**/project.md": "allow",
          "**/AGENTS.md": "allow",
          // Allow creating new spec directories
          "specs/**": "allow",
          "openspec/**": "allow"
        }
      },
      color: "#FF6B6B" // Distinctive color for the agent
    };

    // 3. Inject into configuration
    // We use 'any' cast here to bypass strict type checking on the config object structure
    // because we are dynamically extending it.
    const agentConfig = (config.agent || {}) as any;
    agentConfig["openspec-plan"] = openSpecAgent;
    config.agent = agentConfig;
  };
}
