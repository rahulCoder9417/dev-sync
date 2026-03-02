import { spawn } from "child_process";
import path from "path";

export class LSP {
  private projectRoot: string;
  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.start();
  }
  private start() {
    const lspPath = path.join(
    process.cwd(),
    "node_modules",
    "typescript-language-server",
    "lib",
    "cli.mjs"
  );

  const lsp = spawn(
    process.execPath, 
    [lspPath, "--stdio"], 
    {
      cwd: this.projectRoot,
    },
  );
    console.log("LSP started for ", this.projectRoot.split(path.sep).pop());
    lsp.stderr.on("data", (data) => {
      console.error("LSP stderr:", data.toString());
    });
    lsp.on("exit", (code) => {
      console.log("LSP exited with code:", code);
    });
  }
}
