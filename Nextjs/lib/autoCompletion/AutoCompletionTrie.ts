
interface TrieNode {
  children: Map<string, TrieNode>;
  completions: CompletionEntry[];
}

export interface CompletionEntry {
  label: string;
  kind: number;
  detail?: string;
  insertText?: string;
  insertedAt: number; // timestamp for TTL
}

const TTL_SYMBOL = 30_000;   // 30s for file-specific symbols
const TTL_STDLIB = 300_000;  // 5min for stdlib/keywords
const MAX_ENTRIES = 500;

export class LSPTrieCache {
  private roots = new Map<string, TrieNode>(); // key: `${lang}:${scope}`
  private entryCount = 0;

  private getRoot(lang: string, scope: string): TrieNode {
    const key = `${lang}:${scope}`;
    if (!this.roots.has(key)) {
      this.roots.set(key, { children: new Map(), completions: [] });
    }
    return this.roots.get(key)!;
  }

  insert(lang: string, scope: string, prefix: string, entries: CompletionEntry[]) {
    if (this.entryCount >= MAX_ENTRIES) this.evict();

    let node = this.getRoot(lang, scope);
    for (const ch of prefix.toLowerCase()) {
      if (!node.children.has(ch)) {
        node.children.set(ch, { children: new Map(), completions: [] });
      }
      node = node.children.get(ch)!;
    }
    node.completions = entries;
    this.entryCount += entries.length;
  }

  lookup(lang: string, scope: string, prefix: string): CompletionEntry[] | null {
    let node = this.getRoot(lang, scope);
    for (const ch of prefix.toLowerCase()) {
      if (!node.children.has(ch)) return null;
      node = node.children.get(ch)!;
    }
    if (!node.completions.length) return null;

    // TTL check
    const now = Date.now();
    const valid = node.completions.filter(e => {
      const ttl = e.kind === 17 ? TTL_STDLIB : TTL_SYMBOL; // kind 17 = keyword
      return now - e.insertedAt < ttl;
    });

    if (!valid.length) {
      node.completions = [];
      return null;
    }
    return valid;
  }

  // Flush all entries for a specific file (on save/edit)
  invalidateScope(lang: string, scope: string) {
    this.roots.delete(`${lang}:${scope}`);
  }

  // Full flush (on LSP restart or branch switch)
  flush() {
    this.roots.clear();
    this.entryCount = 0;
  }

  private evict() {
    // Simple: drop the oldest scope
    const firstKey = this.roots.keys().next().value;
    if (firstKey) this.roots.delete(firstKey);
    this.entryCount = Math.max(0, this.entryCount - 50);
  }
}

export const lspCache = new LSPTrieCache();