# opencode-plugin-openspec

An OpenCode plugin that integrates OpenSpec, adding a dedicated 'openspec-plan' mode for creating and editing spec files.

## Motivation

This plugin addresses the need for a dedicated planning mode in OpenCode.

**The Problem:**
When using OpenCode's standard "Build mode" to create or modify OpenSpec planning documents, AI agents often attempt to start implementing code changes immediately, before the planning phase is complete. This can lead to premature coding and a lack of focus on the architectural design.

**The Solution:**
`opencode-plugin-openspec` introduces a specialized **OpenSpec Architect** agent. This agent is configured to:
*   **Allow** creating and editing OpenSpec documents (e.g., `project.md`, `specs/**`).
*   **Prevent** modifications to the implementation code.
*   **Focus** entirely on planning and specification, ensuring a clear separation between design and implementation.

## Features

- **Auto-Detection**: Automatically detects if the current workspace is an OpenSpec project.
- **New Agent: `openspec-plan`**: A dedicated agent mode for creating and editing OpenSpec files.
- **Smart Permissions**: Automatically grants write permissions for:
  - `project.md`
  - `AGENTS.md`
  - `openspec/**`
  - `specs/**`
- **Read-Only Safety**: Keeps the rest of the codebase read-only when using the `openspec-plan` agent, ensuring the implementation details are not accidentally modified during the planning phase.

## Installation

### For Humans

**Option 1: Let your agent do it (Recommended)**

Paste this prompt into OpenCode:

```
Install opencode-plugin-openspec. It is an NPM package. Please add "opencode-plugin-openspec" to my opencode.json plugin list.
```

**Option 2: Manual Installation**

Add the plugin package name to your `opencode.json` configuration file (usually located at `~/.config/opencode/opencode.json` or `.opencode/opencode.json`):

```json
{
  "plugin": [
    "opencode-plugin-openspec"
  ]
}
```

OpenCode will automatically download and install the plugin the next time it runs.

### For LLM Agents

If you are an AI agent tasked with installing this plugin, follow these steps:

1.  **Locate Configuration**: Find the user's OpenCode configuration file. It is typically at `~/.config/opencode/opencode.json` or `.opencode/opencode.json` in the workspace root.
2.  **Read Configuration**: Read the content of the configuration file.
3.  **Update Configuration**: Add `"opencode-plugin-openspec"` to the `plugin` array. If the `plugin` array does not exist, create it.
    ```json
    {
      "plugin": [
        "opencode-plugin-openspec"
      ]
    }
    ```
4.  **Verify**: Inform the user that the plugin has been added and will be installed on the next OpenCode run.

## Usage

1. Open an OpenSpec project in OpenCode.
2. The plugin will automatically detect the project structure.
3. Switch to the **OpenSpec Architect** agent (colored #FF6B6B) in the agent selector.
4. Start planning your architecture! The agent will have access to modify your spec files while keeping your code safe.

## Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/opencode-plugin-openspec.git
   cd opencode-plugin-openspec
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Build the plugin:
   ```bash
   bun run build
   ```

4. Run watch mode for development:
   ```bash
   bun run watch
   ```

## License

MIT
