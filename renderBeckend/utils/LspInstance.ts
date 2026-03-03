import { spawn, ChildProcess } from "child_process";
import path from "path";

export class LspInstance {
  private projectRoot: string;
  private lsp: ChildProcess;
  private rootUri: string;
  private buffer = "";

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.rootUri = "file:///" + this.projectRoot.replace(/\\/g, "/");
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
        console.log("PARSED MESSAGE:", message);
        // If this is initialize response
        if (message.id === 1) {
          this.send({
            jsonrpc: "2.0",
            method: "initialized",
            params: {},
          });
        }
      }
    });
  }

  private send(message: Record<string, unknown>) {
    const json = JSON.stringify(message);
    const contentLength = Buffer.byteLength(json, "utf8");

    const payload = `Content-Length: ${contentLength}\r\n` + `\r\n` + json;

    this.lsp.stdin.write(payload);
  }

  public dispose() {
    this.lsp.kill();
  }
}
