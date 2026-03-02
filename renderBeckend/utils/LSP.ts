import { spawn, ChildProcess } from "child_process";
import path from "path";

export class LSP {
  private projectRoot: string;
  private lsp: ChildProcess;
  private rootUri: string;
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

    this.lsp.stdout.on("data", (chunk) => {
      console.log("RAW:", chunk.toString());
    });

    this.lsp.stderr.on("data", (data) => {
      console.error("LSP stderr:", data.toString());
    });

    this.lsp.on("exit", (code) => {
      console.log("LSP exited with code:", code);
    });
  }

  private send(message: Record<string, unknown>) {
    const json = JSON.stringify(message);
    const contentLength = Buffer.byteLength(json, "utf8");

    const payload = `Content-Length: ${contentLength}\r\n` + `\r\n` + json;

    this.lsp.stdin.write(payload);
  }
}
