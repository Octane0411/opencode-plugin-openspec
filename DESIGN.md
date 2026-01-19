# OpenCode Plugin OpenSpec Design

## 1. Overview
This plugin integrates OpenSpec into OpenCode. It is **context-aware**: it activates only when it detects an OpenSpec-initialized project. When active, it dynamically registers an `openspec-plan` agent via the `config` hook, tailored for architectural planning.

## 2. Activation Logic
The plugin checks for OpenSpec presence at startup.

- **Condition**: Existence of `openspec/AGENTS.md` (or `AGENTS.md`).
- **Action**: If detected, the plugin hooks into the configuration loading process to inject the OpenSpec agent.

## 3. Features (Active Mode)

### 3.1. Agent Injection (`config` hook)
Instead of just relying on runtime hooks, we will use the `config` hook to modify the OpenCode configuration directly. This is how `oh-my-opencode` replaces the default plan agent.

**Implementation Strategy:**
1.  **Hook**: `config`
2.  **Logic**:
    - Check if `openspec/AGENTS.md` exists.
    - If yes, inject a new agent `openspec-plan` into the `agent` configuration object.
    - **Agent Configuration**:
        - `name`: "openspec-plan"
        - `mode`: "primary"
        - `description`: "OpenSpec Architect - Plan and specify software architecture."
        - `prompt`: (Custom System Prompt for OpenSpec)
        - `permission`:
            - Explicitly `allow` editing `**/*.spec.md`, `project.md`, `AGENTS.md`.
            - This avoids reliance on the global `permission.ask` hook for basic operations, though we can keep `permission.ask` as a fallback or for finer control.
    - **Optional**: Hide/Demote default `plan` or `sisyphus-plan` to reduce confusion.

### 3.2. Auto-Permission (Fallback)
While the agent config handles most permissions, we can still use `permission.ask` for edge cases or to ensure a smooth experience if the static permission config isn't enough.

- **Scope**: `openspec/**/*.md`, `specs/**/*.md`.
- **Logic**: Intercept `permission.ask` and return `allow` for these patterns.

## 4. Dependencies
- `@opencode-ai/plugin`: ^1.1.1
- `@opencode-ai/sdk`: ^1.1.1

## 5. Project Structure
```
opencode-plugin-openspec/
├── package.json
├── tsconfig.json
├── README.md
├── DESIGN.md
└── src/
    ├── index.ts           # Plugin entry point
    ├── config.ts          # Config hook implementation (Agent injection)
    ├── prompts.ts         # System prompts
    └── utils/
        └── detection.ts   # Detection logic
```

## 6. Implementation Details

### 6.1. Config Hook (`src/config.ts`)
```typescript
export const configHook: Hooks["config"] = async (config, ctx) => {
  if (!await isOpenSpecProject(ctx)) return config;

  // Define OpenSpec Plan Agent
  const openSpecAgent = {
    name: "openspec-plan",
    mode: "primary",
    description: "OpenSpec Architect",
    prompt: OPENSPEC_SYSTEM_PROMPT,
    permission: {
      edit: {
        "**/*.spec.md": "allow",
        "**/project.md": "allow",
        "**/AGENTS.md": "allow"
      }
    }
  };

  // Inject into config
  return {
    ...config,
    agent: {
      ...(config.agent || {}),
      "openspec-plan": openSpecAgent
    }
  };
};
```

### 6.2. System Prompt
The prompt will instruct the model to:
- Act as an Architect.
- Read `project.md` and `AGENTS.md` for context.
- Create/Update `specs/*.spec.md` files.
- **NOT** write implementation code.
