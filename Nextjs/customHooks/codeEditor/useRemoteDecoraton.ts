
import { useCallback, useRef } from 'react';

export const useRemoteDecorations = () => {
  const decorationsRef = useRef<Map<string, Map<string, string[]>>>(new Map());

  const updateRemoteDecorations = useCallback((
    editor: any,
    monaco: any,
    tabId: string,
    remoteUserId: string,
    cursor?: any,
    selection?: any
  ) => {
    if (!decorationsRef.current.has(tabId)) {
      decorationsRef.current.set(tabId, new Map());
    }

    const tabDecorations = decorationsRef.current.get(tabId)!;
    const oldDecorations = tabDecorations.get(remoteUserId) || [];

    const newDecorations: any[] = [];

    if (cursor) {
      newDecorations.push({
        range: new monaco.Range(
          cursor.lineNumber || cursor.line,
          cursor.column,
          cursor.lineNumber || cursor.line,
          cursor.column
        ),
        options: {
          className: "remote-cursor",
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
        }
      });
    }

    if (selection && selection.start && selection.end) {
      const isSamePosition =
        selection.start.lineNumber === selection.end.lineNumber &&
        selection.start.column === selection.end.column;

      if (!isSamePosition) {
        newDecorations.push({
          range: new monaco.Range(
            selection.start.lineNumber,
            selection.start.column,
            selection.end.lineNumber,
            selection.end.column
          ),
          options: {
            className: "remote-selection",
            isWholeLine: false,
            stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
          }
        });
      }
    }

    const newIds = editor.deltaDecorations(oldDecorations, newDecorations);
    tabDecorations.set(remoteUserId, newIds);
  }, []);

  return { decorationsRef, updateRemoteDecorations };
};
