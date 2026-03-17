import { AutoCompletionInstance } from "./AutoCompletionInstance.js";

// ─────────────────────────────────────────────
// Manager — one LSP instance per project+language
// ─────────────────────────────────────────────

export class AutoCompletionManager {
  // key = "projectId:language" → instance
  private instances = new Map<string, AutoCompletionInstance>();

  async getOrCreate(
    projectId: string,
    language: string,
    projectRoot: string
  ): Promise<AutoCompletionInstance> {
    const key = `${projectId}:${language}`;

    if (this.instances.has(key)) {
      return this.instances.get(key)!;
    }

    console.log("[LSP Manager] starting new instance for:", key);
    const instance = new AutoCompletionInstance(projectRoot);
    this.instances.set(key, instance);
    return instance;
  }

  dispose(projectId: string, language: string) {
    const key = `${projectId}:${language}`;
    this.instances.get(key)?.dispose();
    this.instances.delete(key);
  }
}

// singleton — one manager for the entire server process
export const autoCompletionManager = new AutoCompletionManager();