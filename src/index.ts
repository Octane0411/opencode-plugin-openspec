import type { Plugin } from "@opencode-ai/plugin";
import { createConfigHook } from "./config";
import { isOpenSpecProject } from "./utils/detection";

const OpenSpecPlugin: Plugin = async (ctx) => {
  const isActive = await isOpenSpecProject(ctx);

  if (!isActive) {
    return {};
  }

  return {
    config: createConfigHook(ctx),
  };
};

export default OpenSpecPlugin;
