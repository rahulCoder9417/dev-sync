import config from "../config/index.js";
import { getRealProjectDir } from "./getProjectDir.js";
import { AutoCompletionInstance } from "./AutoCompletionInstance.js";

class AutoCompletionManager {
  private instances = new Map<string, AutoCompletionInstance>();// projectid-language to AutoCompletionInstance

  async getOrCreate(projectId: string, language: string): Promise<AutoCompletionInstance> {
    const key = `${projectId}-${language}`;
    if (this.instances.has(key)) {
      return this.instances.get(key)!;
    }
    const projectRoot = await getRealProjectDir(config.projectRoot, projectId);
    const instance = new AutoCompletionInstance(projectRoot);
    this.instances.set(key, instance);

    return instance;
  }

  dispose(projectId: string, language: string) {
    const key = `${projectId}-${language}`;
    const inst = this.instances.get(key);
    inst?.dispose();
    this.instances.delete(key);
  }
}
const autoCompletionManager = new AutoCompletionManager();
export default autoCompletionManager;