
// ─────────────────────────────────────────────
// Types straight from LSP 3.17 spec
// ─────────────────────────────────────────────

export interface LSPMessage {
  jsonrpc: "2.0";
}

export interface LSPRequest extends LSPMessage {
  id: number;
  method: string;
  params?: object;
}

export interface LSPNotification extends LSPMessage {
  method: string;
  params?: object;
}

export interface LSPResponse extends LSPMessage {
  id: number | null;
  result?: any;
  error?: { code: number; message: string; data?: any };
}

export interface Position {
  line: number;       // 0-indexed
  character: number;  // 0-indexed
}

export interface TextDocumentItem {
  uri: string;
  languageId: string;
  version: number;
  text: string;
}

export interface CompletionItem {
  label: string;
  kind?: number;
  detail?: string;
  insertText?: string;
}
