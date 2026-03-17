
// ─────────────────────────────────────────────
// Types straight from LSP 3.17 spec
// ─────────────────────────────────────────────

interface LSPMessage {
  jsonrpc: "2.0";
}

interface LSPRequest extends LSPMessage {
  id: number;
  method: string;
  params?: object;
}

interface LSPNotification extends LSPMessage {
  method: string;
  params?: object;
}

interface LSPResponse extends LSPMessage {
  id: number | null;
  result?: any;
  error?: { code: number; message: string; data?: any };
}

interface Position {
  line: number;       // 0-indexed
  character: number;  // 0-indexed
}

interface TextDocumentItem {
  uri: string;
  languageId: string;
  version: number;
  text: string;
}

interface CompletionItem {
  label: string;
  kind?: number;
  detail?: string;
  insertText?: string;
}
