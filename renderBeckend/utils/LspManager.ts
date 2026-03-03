import config from "../config/index.js";
import { getRealProjectDir } from "./getProjectDir.js";
import { LspInstance } from "./LspInstance.js";

export class LspManager {
  private instances = new Map<string, LspInstance>();

  async getOrCreate(projectId: string): Promise<LspInstance> {
    if (this.instances.has(projectId)) {
      return this.instances.get(projectId)!;
    }
    const projectRoot = await getRealProjectDir(config.projectRoot, projectId);
    const instance = new LspInstance(projectRoot);
    this.instances.set(projectId, instance);

    return instance;
  }

  dispose(projectId: string) {
    const inst = this.instances.get(projectId);
    inst?.dispose();
    this.instances.delete(projectId);
  }
}