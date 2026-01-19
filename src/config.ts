import type { Hooks } from "@opencode-ai/plugin";
import { isOpenSpecProject } from "./utils/detection";
import { OPENSPEC_SYSTEM_PROMPT } from "./prompts";

export function createConfigHook(ctx: { directory: string }): Hooks["config"] {
  return async (config) => {
    // 1. Check if this is an OpenSpec project
    const mockCtx = { directory: ctx.directory } as any;
    
    const isActive = await isOpenSpecProject(mockCtx);
    if (!isActive) {
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
          // Allow editing specific root files
          "project.md": "allow",
          "AGENTS.md": "allow",
          // Allow editing anything in openspec directory
          "openspec/**": "allow",
          // Allow editing anything in specs directory (standard OpenSpec structure)
          "specs/**": "allow"
        }
      },
      color: "#FF6B6B" // Distinctive color for the agent
    };

    // 3. Inject into configuration
    const agentConfig = (config.agent || {}) as any;
    agentConfig["openspec-plan"] = openSpecAgent;
    config.agent = agentConfig;
  };
}
