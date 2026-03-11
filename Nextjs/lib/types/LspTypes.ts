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
export interface CompletionRequest {
  projectId: string;
  fileId: string;
  filePath: string;
  language: string;
  prefix: string;
  line: number;
  character: number;
  lineContent: string;
  currentContent: string;
}
export interface LSPCompletionItem {
  label: string;
  kind: number;
  detail?: string;
  insertText?: string;
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