import path from "path";

/**
 * Made to avoid FS watcher echo when UI-originated
 * file/folder operations hit disk.
 */
export class FsSuppressionRegistry {
  private map = new Map<string, number>();
  private ttl: number;

  constructor(ttlMs = 500) {
    this.ttl = ttlMs;
  }

  private normalize(p: string) {
    return path.resolve(p);
  }

  suppress(absPath: string) {
    this.map.set(this.normalize(absPath), Date.now());
  }

  isSuppressed(absPath: string): boolean {
    const key = this.normalize(absPath);
    const ts = this.map.get(key);

    if (!ts) return false;

    if (Date.now() - ts > this.ttl) {
      this.map.delete(key);
      return false;
    }

    return true;
  }

  isSuppressedOrParent(absPath: string): boolean {
    const key = this.normalize(absPath);
    for (const [p, ts] of this.map.entries()) {
      if (Date.now() - ts > this.ttl) {
        this.map.delete(p);
        continue;
      }

      if (key === p || key.startsWith(p + path.sep)) {
        return true;
      }
    }

    return false;
  }

  remove(absPath: string) {
    this.map.delete(this.normalize(absPath));
  }

  clear() {
    this.map.clear();
  }

  size() {
    return this.map.size;
  }
}

export const Sup = new FsSuppressionRegistry();
