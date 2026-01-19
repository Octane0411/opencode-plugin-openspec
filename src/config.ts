import type { Hooks } from "@opencode-ai/plugin";
import { isOpenSpecProject } from "./utils/detection";
import { OPENSPEC_SYSTEM_PROMPT } from "./prompts";

export function createConfigHook(ctx: { directory: string }, log: (msg: string, ...args: any[]) => void): Hooks["config"] {
  return async (config) => {
    log("[OpenSpec Plugin] Config hook triggered.");
    
    // 1. Check if this is an OpenSpec project
    const mockCtx = { directory: ctx.directory } as any;
    
    const isActive = await isOpenSpecProject(mockCtx);
    if (!isActive) {
      log("[OpenSpec Plugin] Config hook: Not an OpenSpec project, skipping.");
      return;
    }

    log("[OpenSpec Plugin] Config hook: Injecting openspec-plan agent.");

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
    
    // Check if already injected to avoid potential re-injection loops
    if (agentConfig["openspec-plan"]) {
       log("[OpenSpec Plugin] Agent already exists, updating...");
    }
    
    agentConfig["openspec-plan"] = openSpecAgent;
    config.agent = agentConfig;
    
    log("[OpenSpec Plugin] Config hook: Injection complete.");
  };
}
