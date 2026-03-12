export interface AutoCompletionResponse {
  jsonrpc: string;
  id: number;
  result: Record<string, any>;
}

export interface AutoCompletionRequest {
  jsonrpc: string;
  id: number;
  method: AutoCompletionMethodNames;
  params: Record<string, any>;
}

export interface AutoCompletionNotification {
  jsonrpc: string;
  method: AutoCompletionMethodNames;
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
export interface AutoCompletionItem {
  label: string;
  kind: number;
  detail?: string;
  insertText?: string;
}
export type AutoCompletionMethodNames = 
  | "initialize"
  | "initialized"
  | "textDocument/didOpen"
  | "textDocument/didChange"
  | "textDocument/didClose"
  | "textDocument/completion"
  | "textDocument/hover"
  | "textDocument/definition"
  | "textDocument/publishDiagnostics";