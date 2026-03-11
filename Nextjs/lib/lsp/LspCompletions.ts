import * as monaco from "monaco-editor";
import { getLanguage } from "../mainUtils/codeEditor";
import { Tab } from "../types/types";
import { CompletionRequest, LSPCompletionItem } from "../types/LspTypes";

export async function getLspCompletions(
  model: monaco.editor.ITextModel,
  position: monaco.Position,
  activeTabRef: React.RefObject<Tab | null | undefined>,
  projectId: string,
) {
  const word = model.getWordUntilPosition(position);
  if (!word.word) return { suggestions: [] };

  const lineContent = model.getLineContent(position.lineNumber);

  try {
    const res = await fetch("/api/lsp/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        fileId: activeTabRef.current?.id || "",
        filePath: activeTabRef.current?.name || "",
        language: getLanguage(activeTabRef.current?.name || ""),
        prefix: word.word,
        line: position.lineNumber - 1, // LSP is 0-indexed
        character: position.column - 1,
        lineContent,
        currentContent: model.getValue(),
      } as CompletionRequest),
    });

    const data = await res.json();

    return {
      suggestions: (data.completions ?? []).map((c: LSPCompletionItem) => ({
        label: c.label,
        kind: monaco.languages.CompletionItemKind[c.kind] ?? 1,
        detail: c.detail ?? "",
        insertText: c.insertText ?? c.label,
        range: {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        },
      })),
    };
  } catch {
    return { suggestions: [] };
  }
}
