import { spawn, ChildProcess, execSync } from "child_process";
import {
  CompletionItem,
  LSPResponse,
  Position,
  TextDocumentItem,
} from "../types/AutoCompletionTypes.js";
import { platform, release } from "os";

// ─────────────────────────────────────────────
// AutoCompletionInstance
// ─────────────────────────────────────────────

export class AutoCompletionInstance {
  private projectRoot: string;
  private lsp!: ChildProcess;
  private rootUri: string;

  // buffer for incoming stdout data
  private buffer = "";

  // message id counter — starts at 2 because 1 is used by initialize
  private messageId = 1;

  // map of pending request id → resolve function
  private pendingRequests = new Map<number, (result: any) => void>();

  // track which files are already open in LSP
  private openFiles = new Set<string>();

  // track version per file (LSP requires incrementing version on every change)
  private fileVersions = new Map<string, number>();

  // ready promise — resolves when LSP sends back initialize response
  private initPromise: Promise<void>;
  private initResolve!: () => void;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    // normalize path for URI — windows backslashes → forward slashes
    this.rootUri = "file:///" + projectRoot.replace(/\\/g, "/");

    // create the ready promise BEFORE calling start()
    // so initResolve is available when attachStdoutHandler fires
    this.initPromise = new Promise((resolve) => {
      this.initResolve = resolve;
    });

    this.start();
  }

  // ─────────────────────────────────────────────
  // STEP 1: Spawn LSP process and send initialize
  // LSP spec section: Lifecycle Messages → Initialize
  // ─────────────────────────────────────────────
  private start() {
 const isWindows = process.platform === "win32";

  const command = isWindows ? "npx" : "typescript-language-server";
  const args = isWindows
    ? ["typescript-language-server", "--stdio"]
    : ["--stdio"];

  this.lsp = spawn(command, args, {
    cwd: this.projectRoot,
    shell: isWindows,
  });

    // attach stdout reader before sending anything
    this.attachStdoutHandler();

    // send initialize request — MUST be the first message per LSP spec
    // this is a Request (has id) — LSP will respond with id:1
    this.sendRaw({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        processId: process.pid,
        rootUri: this.rootUri,
        // capabilities tell LSP what features our client supports
        capabilities: {
          textDocument: {
            completion: {
              completionItem: {
                snippetSupport: false, // keep simple for now
              },
            },
          },
        },
        // workspace folders — tells LSP which directories to index
        workspaceFolders: [
          {
            uri: this.rootUri,
            name: "project",
          },
        ],
      },
    });

    this.lsp.stderr?.on("data", (data) => {
      console.error("[LSP stderr]", data.toString());
    });

    this.lsp.on("exit", (code) => {
      console.log("[LSP] process exited with code:", code);
    });
  }

  // ─────────────────────────────────────────────
  // STEP 2: Read LSP stdout and parse messages
  // LSP spec section: Base Protocol → Header Part + Content Part
  //
  // Every message from LSP looks like:
  //   Content-Length: 123\r\n
  //   \r\n
  //   { "jsonrpc": "2.0", "id": 1, "result": { ... } }
  // ─────────────────────────────────────────────
  private attachStdoutHandler() {
    this.lsp.stdout?.on("data", (chunk: Buffer) => {
      this.buffer += chunk.toString();

      // keep parsing as long as there are complete messages in the buffer
      while (true) {
        // find the \r\n\r\n that separates header from body
        const headerEnd = this.buffer.indexOf("\r\n\r\n");
        if (headerEnd === -1) break; // header not fully received yet

        const header = this.buffer.slice(0, headerEnd);

        // extract Content-Length from header
        const match = header.match(/Content-Length: (\d+)/);
        if (!match) break;

        const contentLength = parseInt(match[1], 10);

        // check if the full body has arrived
        // headerEnd + 4 = skip the \r\n\r\n separator
        const totalLength = headerEnd + 4 + contentLength;
        if (this.buffer.length < totalLength) break; // body not fully received yet

        // extract the body and remove it from buffer
        const body = this.buffer.slice(headerEnd + 4, totalLength);
        this.buffer = this.buffer.slice(totalLength);

        let message: LSPResponse;
        try {
          message = JSON.parse(body);
        } catch (e) {
          console.error("[LSP] failed to parse message:", body);
          continue;
        }

        this.handleMessage(message);
      }
    });
  }

  // ─────────────────────────────────────────────
  // Handle incoming LSP messages
  // ─────────────────────────────────────────────
  private handleMessage(message: LSPResponse) {
    // initialize response — id 1
    // LSP spec: after receiving initialize response, client MUST send initialized notification
    if (message.id === 1) {
      console.log("[LSP] initialized ✓");

      // send initialized notification — this is a Notification (no id, no response)
      // LSP spec: "The initialized notification is sent from the client to the server
      // after the client received the result of the initialize request"
      this.sendRaw({
        jsonrpc: "2.0",
        method: "initialized",
        params: {},
      });

      // unlock the ready promise — anyone awaiting waitUntilReady() can now continue
      this.initResolve();
      return;
    }

    // any other response — match to pending request by id
    if (message.id !== null && message.id !== undefined) {
      const resolve = this.pendingRequests.get(message.id as number);
      if (resolve) {
        this.pendingRequests.delete(message.id as number);
        resolve(message.result);
      }
    }
  }

  // ─────────────────────────────────────────────
  // STEP 3: Sync file to LSP
  // LSP spec section: Document Synchronization → didOpen / didChange
  //
  // didOpen  — first time we see a file
  // didChange — file already open, content changed
  // Both are Notifications (no id, no response)
  // ─────────────────────────────────────────────
  public async syncFile(uri: string, languageId: string, content: string) {
    await this.initPromise; // wait for LSP to be ready

    if (!this.openFiles.has(uri)) {
      // ── didOpen ──
      // LSP spec: "The document open notification is sent from the client to the server
      // to signal newly opened text documents"
      // params: TextDocumentItem { uri, languageId, version, text }
      this.sendRaw({
        jsonrpc: "2.0",
        method: "textDocument/didOpen",
        params: {
          textDocument: {
            uri,
            languageId, // "typescript", "javascript" etc
            version: 1,
            text: content,
          } as TextDocumentItem,
        },
      });

      this.openFiles.add(uri);
      this.fileVersions.set(uri, 1);
      console.log("[LSP] didOpen →", uri);
    } else {
      // ── didChange ──
      // LSP spec: version must be incremented on every change
      // contentChanges: array of changes — we send full content (no range = full replace)
      const version = (this.fileVersions.get(uri) ?? 1) + 1;
      this.fileVersions.set(uri, version);

      this.sendRaw({
        jsonrpc: "2.0",
        method: "textDocument/didChange",
        params: {
          textDocument: {
            uri,
            version,
          },
          // LSP spec: if range is omitted → entire document is replaced with text
          contentChanges: [{ text: content }],
        },
      });

      console.log("[LSP] didChange →", uri, "version:", version);
    }
  }

  //
  // STEP 4: Request completions
  // LSP spec section: Language Features → Completion Proposals
  //
  // This is a Request (has id) — LSP will respond with completion items
  // ─────────────────────────────────────────────
  public async getCompletions(
    uri: string,
    position: Position,
  ): Promise<CompletionItem[]> {
    await this.initPromise;

    // LSP spec: textDocument/completion request
    // params: { textDocument: { uri }, position: { line, character } }
    const result = await this.sendRequest("textDocument/completion", {
      textDocument: { uri },
      position, // { line: 0-indexed, character: 0-indexed }
    });

    // LSP spec: result can be CompletionList { isIncomplete, items } or CompletionItem[]
    if (!result) return [];
    const items: CompletionItem[] = Array.isArray(result)
      ? result
      : (result.items ?? []);

    console.log("[LSP] completions received:", items.length);
    return items;
  }

  // ─────────────────────────────────────────────
  // Send a Request (expects response — has id)
  // ─────────────────────────────────────────────
  private sendRequest(method: string, params: object): Promise<any> {
    const id = ++this.messageId;

    return new Promise((resolve) => {
      // save resolve function — will be called when response with this id arrives
      this.pendingRequests.set(id, resolve);

      this.sendRaw({
        jsonrpc: "2.0",
        id,
        method,
        params,
      });
    });
  }

  // ─────────────────────────────────────────────
  // Send raw message over stdin
  // LSP spec: Content-Length header + \r\n\r\n + JSON body
  // ─────────────────────────────────────────────
  private sendRaw(message: object) {
    const json = JSON.stringify(message);
    // Content-Length must be byte length, not character length
    // (matters for unicode characters)
    const contentLength = Buffer.byteLength(json, "utf8");
    const payload = `Content-Length: ${contentLength}\r\n\r\n${json}`;
    this.lsp.stdin?.write(payload);
  }

  // public: wait until initialize handshake is complete
  public waitUntilReady(): Promise<void> {
    return this.initPromise;
  }

  public dispose() {
    this.lsp.kill();
  }
}
