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
        // --- Read ---
        // Full read access; agent is trusted with the whole project
        read: {
          "*": "allow"
        },

        // --- Exploration tools (read-only, no side effects) ---
        glob: "allow",
        grep: "allow",
        list: "allow",
        lsp: "allow",

        // --- Task management ---
        todoread: "allow",
        todowrite: "allow",

        // --- Web & search ---
        webfetch: "allow",
        websearch: "allow",
        codesearch: "allow",

        // --- Agent tooling ---
        task: "allow",
        skill: "allow",
        question: "allow",

        // --- Safety guards ---
        doom_loop: "ask",
        external_directory: "ask",

        // --- Edit: deny everything, allow only spec files ---
        // Rules are evaluated last-match-wins, so "*": "deny" must come first
        edit: {
          "*": "deny",
          "project.md": "allow",
          "AGENTS.md": "allow",
          "openspec/**": "allow",
          "specs/**": "allow"
        },

        // --- Bash: deny all by default, allow read-only filesystem + git read ---
        bash: {
          "*": "deny",
          "grep *": "allow",
          "ls": "allow",
          "ls *": "allow",
          "cat *": "allow",
          "find *": "allow",
          "echo": "allow",
          "echo *": "allow",
          "pwd": "allow",
          "which *": "allow",
          "env": "allow",
          "printenv *": "allow",
          "git status*": "allow",
          "git log*": "allow",
          "git diff*": "allow",
          "git show*": "allow"
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
