import config from "../config/index.js";
import { getRealProjectDir } from "./getProjectDir.js";
import { AutoCompletionInstance } from "./AutoCompletionInstance.js";

class AutoCompletionManager {
  private instances = new Map<string, AutoCompletionInstance>();

  async getOrCreate(projectId: string): Promise<AutoCompletionInstance> {
    if (this.instances.has(projectId)) {
      return this.instances.get(projectId)!;
    }
    const projectRoot = await getRealProjectDir(config.projectRoot, projectId);
    const instance = new AutoCompletionInstance(projectRoot);
    this.instances.set(projectId, instance);

    return instance;
  }

  dispose(projectId: string) {
    const inst = this.instances.get(projectId);
    inst?.dispose();
    this.instances.delete(projectId);
  }
}
const autoCompletionManager = new AutoCompletionManager();
export default autoCompletionManager;