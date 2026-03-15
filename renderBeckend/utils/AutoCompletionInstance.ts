import { spawn, ChildProcess } from "child_process";

export class AutoCompletionInstance {
  private projectRoot: string;
  private lsp: ChildProcess;
  private rootUri: string;
  private buffer = "";
  private messageId = 1;
  private pendingRequests = new Map<number, (result: any) => void>();
  private openFiles = new Set<string>();
  private fileVersions = new Map<string, number>();
  private initialized = false;
  private initPromise: Promise<void>;
  private initResolve!: () => void;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.rootUri = "file:///" + this.projectRoot.replace(/\\/g, "/");
    
    this.initPromise = new Promise((resolve) => {
      this.initResolve = resolve;  
    });

    this.start();
  }

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

    this.attachStdoutHandler();

    this.send({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        processId: process.pid,
        rootUri: this.rootUri,
        capabilities: {},
      },
    });

    this.lsp.stderr.on("data", (data) => {
      console.error("LSP stderr:", data.toString());
    });

    this.lsp.on("exit", (code) => {
      console.log("LSP exited with code:", code);
    });
  }

  private attachStdoutHandler() {
    this.lsp.stdout.on("data", (chunk) => {
      this.buffer += chunk.toString();

      while (true) {
        const headerEnd = this.buffer.indexOf("\r\n\r\n");
        if (headerEnd === -1) break;

        const header = this.buffer.slice(0, headerEnd);
        const match = header.match(/Content-Length: (\d+)/);
        if (!match) break;

        const contentLength = parseInt(match[1], 10);
        const totalLength = headerEnd + 4 + contentLength;
        if (this.buffer.length < totalLength) break;

        const body = this.buffer.slice(headerEnd + 4, totalLength);
        this.buffer = this.buffer.slice(totalLength);

        const message = JSON.parse(body);
        console.log("LSP message:", message.id ?? message.method);

        // initialize response
        if (message.id === 1) {
          this.send({
            jsonrpc: "2.0",
            method: "initialized",
            params: {},
          });
          this.initialized = true;
          this.initResolve();  
          console.log("LSP ready ✓");
        }

        // resolve any pending completion/other requests
        if (message.id && this.pendingRequests.has(message.id)) {
          const resolve = this.pendingRequests.get(message.id)!;
          this.pendingRequests.delete(message.id);
          resolve(message.result);
        }
      }
    });
  }

  // send a request and wait for its response
  public sendRequest(method: string, params: any): Promise<any> {
    const id = ++this.messageId;
    return new Promise((resolve) => {
      this.pendingRequests.set(id, resolve);  // save resolve under this id
      this.send({ jsonrpc: "2.0", id, method, params });
    });
  }

  // send a notification (no response expected)
  public sendNotification(method: string, params: any) {
    this.send({ jsonrpc: "2.0", method, params });
  }

  // wait until LSP is initialized
  public waitUntilReady(): Promise<void> {
    return this.initPromise;
  }

  private send(message: Record<string, unknown>) {
    const json = JSON.stringify(message);
    const contentLength = Buffer.byteLength(json, "utf8");
    const payload = `Content-Length: ${contentLength}\r\n\r\n${json}`;
    this.lsp.stdin.write(payload);
  }

  public dispose() {
    this.lsp.kill();
  }
}