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

You don't need to build this plugin yourself. You can install it via npm or download the pre-built binary.

### Option 1: Install via npm (Recommended)

1. Install the plugin globally:
   ```bash
   npm install -g opencode-plugin-openspec
   ```

2. Add it to your `opencode.json` (usually in `~/.config/opencode/opencode.json` or `.opencode/opencode.json`):

   ```json
   {
     "plugin": [
       "opencode-plugin-openspec"
     ]
   }
   ```
   *(Note: If OpenCode doesn't support package names directly, you may need to provide the full path, e.g., `$(npm root -g)/opencode-plugin-openspec/dist/index.js`)*

### Option 2: Download from Releases

1. Go to the [Releases](https://github.com/yourusername/opencode-plugin-openspec/releases) page.
2. Download the latest `index.js`.
3. Place it anywhere on your disk.
4. Add the path to your `opencode.json`:
   ```json
   {
     "plugin": [
       "/absolute/path/to/downloaded/index.js"
     ]
   }
   ```

## Usage

1. Open an OpenSpec project in OpenCode.
2. The plugin will automatically detect the project structure.
3. Switch to the **OpenSpec Architect** agent (colored #FF6B6B) in the agent selector.
4. Start planning your architecture! The agent will have access to modify your spec files while keeping your code safe.

## Development

If you want to contribute or modify the plugin, follow these steps:

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
