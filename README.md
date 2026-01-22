# opencode-plugin-openspec

An OpenCode plugin that integrates OpenSpec, providing a dedicated agent for planning and specifying software architecture.

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

### Option 1: Install from NPM (Recommended)

Simply add the plugin package name to your `opencode.json` configuration file (usually located at `~/.config/opencode/opencode.json` or `.opencode/opencode.json`):

```json
{
  "plugin": [
    "opencode-plugin-openspec"
  ]
}
```

OpenCode will automatically download and install the plugin the next time it runs.

### Option 2: Manual / Local Installation

If you want to install from a local build or a specific file:

1.  Build the project:
    ```bash
    bun run build
    ```
2.  Add the absolute path to your `opencode.json`:
    ```json
    {
      "plugin": [
        "file:///absolute/path/to/opencode-plugin-openspec/dist/index.js"
      ]
    }
    ```

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
