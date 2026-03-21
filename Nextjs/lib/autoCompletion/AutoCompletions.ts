import * as monaco from "monaco-editor";
import { getLanguage } from "../mainUtils/codeEditor";
import { Tab } from "../types/types";
import {
  CompletionRequest,
  AutoCompletionItem,
} from "../types/AutoCompletionTypes";

export async function getAutoCompletions(
  model: monaco.editor.ITextModel,
  position: monaco.Position,
  activeTabRef: React.RefObject<Tab | null | undefined>,
  projectId: string,
) {
  const word = model.getWordUntilPosition(position);
  if (!word.word) return { suggestions: [] };

  const lineContent = model.getLineContent(position.lineNumber);

  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_HTTP_URL_TERMINAL +
        "/api/auto-completion/get-completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          fileId: activeTabRef.current?.id || "",
          prefix: word.word,
          line: position.lineNumber - 1, // Monoco is 1-indexed
          character: position.column - 1,
          lineContent,
          currentContent: model.getValue(),
        } as CompletionRequest),
      },
    );

    const data = await res.json();

    return {
      suggestions: (data.completions ?? []).map((c: AutoCompletionItem) => ({
        label: c.label,
        kind:c.kind ?? 1,
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
