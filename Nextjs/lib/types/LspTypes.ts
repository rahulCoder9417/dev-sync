export interface LspResponse {
  jsonrpc: string;
  id: number;
  result: Record<string, any>;
}

export interface LspRequest {
  jsonrpc: string;
  id: number;
  method: LspMethodNames;
  params: Record<string, any>;
}

export interface LspNotification {
  jsonrpc: string;
  method: LspMethodNames;
  params: Record<string, any>;
}

export type LspMethodNames = 
  | "initialize"
  | "initialized"
  | "textDocument/didOpen"
  | "textDocument/didChange"
  | "textDocument/didClose"
  | "textDocument/completion"
  | "textDocument/hover"
  | "textDocument/definition"
  | "textDocument/publishDiagnostics";