"use client"
import Editor, { OnMount } from "@monaco-editor/react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { XCircle, Save } from 'lucide-react';
import { Tab, FileNode } from '@/types';
import { showToast } from "@/components/main/Toast";
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { shallowEqual } from 'react-redux';
import { consumeUpdate } from "@/lib/redux/features/collabCodeEditorUpdate";
import PreviewCloud from "./PreviewCloud";
import CodeTabHeader from "./CodeTabHeader";
import { consumeSaveFileOp } from "@/lib/redux/features/collabCodeFileOp";
import * as awarenessProtocol from "y-protocols/awareness.js";
import { theme } from "@/lib/mainUtils/themeMonoco";
import { fa } from "zod/v4/locales";

interface CodeEditorProps {
  isTeam: boolean;

  tabs: Tab[];
  setErrorMarkers: (errorMarkers: any) => void;
  errorMarkers: Record<string, boolean> | null;
  sendMessage: (message: string, projectId: string, fileId: string | undefined, data?: any) => boolean;
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  setFiles: React.Dispatch<React.SetStateAction<FileNode[]>>;
  onTabClose: (tabId: string) => void;
  onTabSelect: (tab: Tab) => void;
  projectId: string;
}

export const saveNode = (tree: any, nodeId: string, content: string) => {
  return tree.map((node: any) => {
    if (node.id === nodeId) {

      return { ...node, content };
    }
    if (node.children) {
      return { ...node, children: saveNode(node.children, nodeId, content) };
    }
    return node;
  });
};
const CodeEditor: React.FC<CodeEditorProps> = ({
  projectId, tabs, errorMarkers, setErrorMarkers,
  sendMessage, setTabs, setFiles, onTabClose, onTabSelect, isTeam
}) => {

  const [tabToClose, setTabToClose] = useState<string | null>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [isFirstSync, setIsFirstSync] = useState<string | null>(null);


  const activeTab = tabs.find(tab => tab.isActive);
  const dispatch = useAppDispatch();

  // ⭐ Map of Y.Doc per file/tab
  const decorationsRef = useRef<Map<string, Map<string, string[]>>>(new Map());
  const docsRef = useRef<Map<string, Y.Doc>>(new Map());
  const awarenessMap = useRef<Map<string, any>>(new Map());// there is actually no  use as i am not allowing multiple user awareness
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const pendingScrollRef = useRef<{top: number, left: number} | null>(null);
  // ⭐ Current Y.Doc for the active tab
  let docRef = useRef<Y.Doc>(new Y.Doc());
  const bindingRef = useRef<MonacoBinding | null>(null);

  const collaboratorsMap = useAppSelector(
    (state) => activeTab ? (state.collabCodeUser.projects?.[projectId]?.[activeTab.id] ?? []) : [],
    shallowEqual
  );

  const updatesMap = useAppSelector(
    (state) => activeTab ? (state.collabCodeEditorUpdate.updates?.[activeTab.id] ?? []) : [],
    shallowEqual
  );

  const userId = useAppSelector((state) => state.user.id, shallowEqual);
  const t = () => {
    const d = new Date();
    return `${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}:${String(d.getMilliseconds()).padStart(3, "0")}`;
  };

  // ⭐ Helper to get/create a Y.Doc per tab/file
  const getOrCreateDoc = useCallback((tabId: string) => {
    const docs = docsRef.current;
    if (!docs.has(tabId)) {
      docs.set(tabId, new Y.Doc());
    }
    return docs.get(tabId)!;
  }, []);

  const getOrCreateAwareness = useCallback((tabId: string) => {
    if (!awarenessMap.current.has(tabId)) {
      const doc = docsRef.current.get(tabId);
      const awareness = new awarenessProtocol.Awareness(doc!);
      awareness.setLocalState({});
      awarenessMap.current.set(tabId, awareness);
    }
    return awarenessMap.current.get(tabId);
  }, []);


  const handleCodeChange = useCallback((tabId: string, content: string) => {
    if (!isTeam) return;
    setTabs(prev => prev.map(t =>
      t.id === tabId ? { ...t, isDirty: content !== t.content } : t
    ));
  }, [isTeam, setTabs]);

  const activeTabRef = useRef<Tab | null>(activeTab);
  const silentMode = useRef(false);

  // 💾 Save: copy current Y.Text -> activeTab.content and clear isDirty
  const handleSave = useCallback(async () => {
    const tab = activeTabRef.current;
    if (!tab || readOnly) return;
    try {
      const ytext = docRef.current.getText("monaco");
      const newContent = ytext.toString();
      setTabs(prev => prev.map(t =>
        t.id === tab.id ? { ...t, content: newContent, isDirty: false } : t
      ));
      // sync file tree content as well
      setFiles(prev => saveNode(prev, tab.id, newContent));
      const res: any = await fetch(`/api/projects/fileItem/updateContent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: tab.id, content: newContent }),
      }).then(res => res.json())
      if (res.status !== 200) {
        showToast(false, "Error saving content  -> " + res.error, "Please do a refresh");
        return
      }
      sendMessage("fileSave", projectId, tab.id, { content: newContent });
    } catch (e) {
      console.error("Save failed", e);
    }
  }, [setTabs, setFiles]);
  const savePending = useAppSelector(
    (state) => state.collabCodeFileOp.fileSaveProjects?.[projectId] ?? [],
    shallowEqual
  );
  useEffect(() => {
    if (savePending.length === 0) return
    savePending.forEach((item: any) => {
      console.log("hmm", item.content, item.fileId)
      setTabs(prev => prev.map(t =>
        t.id === item.fileId ? { ...t, content: item.content, isDirty: false } : t
      ));

      setFiles(prev => saveNode(prev, item.fileId, item.content!))

      if (item.fileId !== activeTab?.id) {
        const ydoc = docsRef.current.get(item.fileId);
        if (ydoc) {
          const ytext = ydoc.getText("monaco");
          ytext.delete(0, ytext.length);
          ytext.insert(0, item.content);
        }
      }
      dispatch(consumeSaveFileOp({ projectId }))

    })
  }, [savePending]);

  /** 🧠 Active tab changes */
  useEffect(() => {
    if (!activeTab?.id) return;
    setIsFirstSync("")
    // ⭐ Destroy previous binding so it stops listening to thegit  old doc/editor
    if (bindingRef.current) {
      try {
        bindingRef.current.destroy?.(true);

      } catch (e) {
        // pass 
      }
      bindingRef.current = null;
    }

    // ⭐ Switch docRef to the doc for this tab
    const ydoc = getOrCreateDoc(activeTab.id);

    const ytext = ydoc.getText("monaco");

    // only because the code will be sent by the other user if some one joined the same file
    silentMode.current = true;
    if (ytext.length === 0 && activeTab.content) {
      console.log("inserting the contesnts of save", activeTab.content)
      ytext.insert(0, activeTab.content);
      console.log("insertedok")
    }
    setTimeout(() => {
      silentMode.current = false;
    }, 0);
    docRef.current = ydoc;

    activeTabRef.current = activeTab;

  }, [activeTab?.id, getOrCreateDoc]);

  const updateHandlerRef = useRef<((update: Uint8Array) => void) | null>(null);

  // 🔁 Outgoing Yjs updates → sendMessage
  useEffect(() => {

    const ydoc = docRef.current;

    if (updateHandlerRef.current) {
      ydoc.off("update", updateHandlerRef.current);
    }

    const handler = (update: Uint8Array) => {
      if (silentMode.current || readOnly) {
        return;
      }
      const tab = activeTabRef.current;
      if (!tab) return;

      sendMessage("update", projectId, tab.id, {
        data: Array.from(update),
        updateType: "text"
      });
    };

    updateHandlerRef.current = handler;
    ydoc.on("update", handler);

    return () => {
      if (updateHandlerRef.current) {
        ydoc.off("update", updateHandlerRef.current);
        updateHandlerRef.current = null;
      }
    };
    // ⭐ Depend on activeTab.id so handler moves to the new doc when tab changes
  }, [readOnly, activeTab?.id, projectId, sendMessage]);

  /** 📦 Collaborators / readOnly logic */
  useEffect(() => {
    if (!activeTab?.id) return;

    if (collaboratorsMap.length > 0 && userId) {
      const isOwner = collaboratorsMap[0].userId === userId;

      if (!isOwner) {
        if (!readOnly) setReadOnly(true);
        if (isFirstSync !== activeTab.id) {

          setTimeout(() => {
            docRef.current.getText("monaco").delete(0, docRef.current.getText("monaco").length)
            sendMessage("sync", projectId, activeTab.id);
            setIsFirstSync(activeTab.id);
          }, 0);
        }
      } else {
        if (readOnly) setReadOnly(false);
        setIsFirstSync(activeTab.id);
      }
    }
  }, [collaboratorsMap, activeTab?.id, isFirstSync]);

  const updateRemoteDecorations = useCallback((
    editor: any,
    monaco: any,
    tabId: string,
    remoteUserId: string,
    cursor?: any,
    selection?: any
  ) => {
    // Initialize decoration map for this tab if needed
    if (!decorationsRef.current.has(tabId)) {
      decorationsRef.current.set(tabId, new Map());
    }

    const tabDecorations = decorationsRef.current.get(tabId)!;
    const oldDecorations = tabDecorations.get(remoteUserId) || [];

    const newDecorations: any[] = [];

    // Add cursor decoration if provided
    if (cursor) {
      newDecorations.push({
        range: new monaco.Range(
          cursor.lineNumber || cursor.line,  // Handle both formats
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

    // Add selection decoration if provided
    if (selection && selection.start && selection.end) {
      const isSamePosition =
        selection.start.lineNumber === selection.end.lineNumber &&
        selection.start.column === selection.end.column;

      // Only show selection if start and end are different
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

    // Apply decorations and store new IDs
    const newIds = editor.deltaDecorations(oldDecorations, newDecorations);
    tabDecorations.set(remoteUserId, newIds);
  }, []);

  useEffect(() => {
    if (!updatesMap || updatesMap.length === 0) return;

    updatesMap.forEach((update) => {
      const tab = activeTabRef.current;
      if (!tab) return;

      if (update.type === "awareness") {
        if (!readOnly) {
          dispatch(consumeUpdate({ fileId: tab.id }));
          return;
        }
        const editor = editorRef.current
        const monaco = monacoRef.current
        const awareness = awarenessMap.current.get(tab.id);
        if (update.data.type === "cursor") {
          awareness.setLocalStateField("remoteCursor", {
            ...update.data.cursor,
            userId: update.data.userId
          });
          const existingSelection = awareness?.getLocalState()?.remoteSelection;

          // Update both cursor and selection (if exists from same user)
          updateRemoteDecorations(
            editor,
            monaco,
            tab.id,
            update.data.userId,
            update.data.cursor,
            existingSelection?.userId === update.data.userId ? existingSelection : undefined
          );
        }

        if (update.data.type === "selection") {
          awareness.setLocalStateField("remoteSelection", {
            ...update.data.selection,
            userId: update.data.userId
          });

          // Get existing cursor if any
          const existingCursor = awareness?.getLocalState()?.remoteCursor;

          // Update both cursor and selection
          updateRemoteDecorations(
            editor,
            monaco,
            tab.id,
            update.data.userId,
            existingCursor?.userId === update.data.userId ? existingCursor : undefined,
            update.data.selection
          );
        }

        if (update.data.type === "scroll") {
          const editor = editorRef.current;
          
          if (editor?.setScrollTop && editor?.setScrollLeft) {
            editor.setScrollTop(update.data.scroll.top);
            editor.setScrollLeft(update.data.scroll.left);
          } else {
            // Editor not ready - queue it
            pendingScrollRef.current = {
              top: update.data.scroll.top,
              left: update.data.scroll.left
            };
          }
        }

        dispatch(consumeUpdate({ fileId: tab.id }));
        return;
      }


      if (update.type === "sync") {

        const diffData = Y.encodeStateAsUpdate(docRef.current);
        sendMessage("syncedData", projectId, tab.id, {
          data: Array.from(diffData),
          updateType: "FirstSync",
          include: update.data,

        });
        // send first scroll awareness

        const top = editorRef.current!.getScrollTop();
        const left = editorRef.current!.getScrollLeft();
        sendMessage("awareness", projectId, tab.id, {
          type: "scroll",
          scroll: { top, left }
        });
        dispatch(consumeUpdate({ fileId: tab.id }));
        return;
      }

      const updateArray = new Uint8Array(update.data);

      try {
        Y.applyUpdate(docRef.current, updateArray);
        console.log("✅ Update applied successfully");
      } catch (error) {
        console.error("❌ Failed to apply update:", error);
      }

      dispatch(consumeUpdate({ fileId: tab.id }));
    });
  }, [updatesMap, dispatch, projectId, sendMessage]);

  /** 🧩 Editor mount handler */
  const handleEditorMount: OnMount = (editor, monaco) => {
    if (!activeTab || typeof window === "undefined") return;

    // ⭐ Always get the doc for this specific tab
    const ydoc = getOrCreateDoc(activeTab.id);
    docRef.current = ydoc;
    editorRef.current = editor;
    monacoRef.current = monaco;

    const model = monaco.editor.createModel(
      ydoc.getText("monaco").toString(),
      getLanguage(activeTab.name ?? "plaintext")
    );
    editor.setModel(model);

    // ⌨️ Ctrl/Cmd+S to Save
    try {
      const keybinding = (monaco as any).KeyMod.CtrlCmd | (monaco as any).KeyCode.KeyS;
      editor.addCommand(keybinding, () => {
        handleSave();
      });
    } catch (e) {
      // no-op
    }

    const binding = new MonacoBinding(ydoc.getText("monaco"), model, new Set([editor]), null);
    bindingRef.current = binding;

    const awareness = getOrCreateAwareness(activeTab.id);

    binding.awareness = awareness; // REQUIRED for MonacoBinding awareness handling
//scroll
if (pendingScrollRef.current) {
  const { top, left } = pendingScrollRef.current;
    editor?.setScrollTop(top);
    editor?.setScrollLeft(left);
    pendingScrollRef.current = null;
}
    monaco.editor.onDidChangeMarkers(() => {
      const markers = monaco.editor.getModelMarkers({ resource: model.uri });
      const errors = markers.filter(m => m.severity === monaco.MarkerSeverity.Error);
      const hasErrors = errors.length > 0;
      setErrorMarkers({ [activeTab.id]: hasErrors });
    });

    monaco.editor.defineTheme("devsync-blue-dark", theme as any)
    monaco.editor.setTheme(readOnly ? "devsync-blue-dark" : "vs-dark")
    editor.onDidChangeCursorPosition((e) => {
      if (readOnly) return;

      const pos = editor.getPosition();
      if (!pos) return;
      awareness.setLocalStateField("cursor", {
        line: pos.lineNumber,
        column: pos.column,
        userId
      })
      sendMessage("awareness", projectId, activeTab.id, {
        type: "cursor",
        cursor: pos
      });
    });

    editor.onDidChangeCursorSelection((e) => {
      if (readOnly) return;

      const sel = editor.getSelection();
      if (!sel) return;
      awareness.setLocalStateField("selection", {
        start: sel.getStartPosition(),
        end: sel.getEndPosition(),
        userId
      });
      sendMessage("awareness", projectId, activeTab.id, {
        type: "selection",
        selection: {
          start: sel.getStartPosition(),
          end: sel.getEndPosition()
        }
      });
    });

    editor.onDidScrollChange((e) => {
      if (readOnly) return;

      const top = editor.getScrollTop();
      const left = editor.getScrollLeft();
      awareness.setLocalStateField("scroll", {
        top,
        left,
        userId
      });
      sendMessage("awareness", projectId, activeTab.id, {
        type: "scroll",
        scroll: { top, left }
      });
    });

  };

  const getLanguage = (name: string): string => {
    const ext = name.toLowerCase().split('.').pop() || '';

    const map: Record<string, string> = {
      js: 'javascript', jsx: 'javascript',
      ts: 'typescript', tsx: 'typescript',
      py: 'python',
      java: 'java',
      cpp: 'cpp', c: 'cpp', h: 'cpp', hpp: 'cpp',
      rb: 'ruby',
      go: 'go',
      rs: 'rust', rust: 'rust',
      swift: 'swift',
      kt: 'kotlin',
      dart: 'dart',
      html: 'html',
      css: 'css', scss: 'scss', sass: 'scss', less: 'less',
      json: 'json',
      md: 'markdown',
      txt: 'plaintext',
      xml: 'xml',
      yml: 'yaml', yaml: 'yaml',
      toml: 'toml',
      ini: 'ini', cfg: 'ini', conf: 'ini',
      sql: 'sql',
      sh: 'shell', bash: 'shell', zsh: 'shell',
      bat: 'bat',
      ps1: 'powershell',
      dockerfile: 'dockerfile',
      gitignore: 'gitignore',
      env: 'dotenv', sample: 'dotenv', example: 'dotenv', template: 'dotenv',
      lock: 'plaintext', min: 'plaintext', map: 'plaintext',
      vue: 'vue',
      svelte: 'svelte',
    };

    const binaryExtensions = new Set([
      'woff', 'woff2', 'ttf', 'otf', 'eot',
      'svg', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'ico',
      'pdf', 'zip', 'tar', 'gz', 'rar', '7z',
      'bak', 'tmp', 'cache', 'dist', 'build'
    ]);
    if (binaryExtensions.has(ext)) return 'plaintext';

    return map[ext] || 'plaintext';
  };

  const SUPPORTED_EXTS = {
    images: ["png", "jpg", "jpeg", "gif", "webp"],
    videos: ["mp4", "mov", "webm"],
    audio: ["mp3", "wav", "ogg"],
    docs: ["pdf"]
  };

  const checkNotEditor = useCallback(() => {
    if (!activeTab?.name) return false;
    const ext = activeTab.name.split(".").pop()!.toLowerCase();
    if (SUPPORTED_EXTS.images.includes(ext)) return "image";
    if (SUPPORTED_EXTS.videos.includes(ext)) return "video";
    if (SUPPORTED_EXTS.audio.includes(ext)) return "audio";
    if (SUPPORTED_EXTS.docs.includes(ext)) return "doc";
  }, [activeTab]);

  return (
    <div className="bg-primary border-r border-primary h-full flex flex-col">
      <CodeTabHeader
        tabs={tabs}
        errorMarkers={errorMarkers}
        onTabSelect={onTabSelect}
        onTabClose={onTabClose}
        setTabToClose={setTabToClose}
        projectId={projectId}
      />

      <div className="flex-1 overflow-hidden">
        {activeTab ? (
          checkNotEditor() ? (
            <PreviewCloud url={activeTab.content!} type={checkNotEditor() as any} />
          ) : (
            <Editor
              key={`${activeTab.id}-${readOnly}`}
              onMount={handleEditorMount}
              height="100%"
              defaultLanguage="plaintext"
              language={getLanguage(activeTab.name)}
              onChange={(value) => handleCodeChange(activeTab.id, value!)}
              theme={"vs-dark"}
              options={{
                fontFamily: "'Fira Code', monospace",
                fontSize: 14,
                minimap: { enabled: false },
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                readOnly: !isTeam || readOnly || !bindingRef.current,
              }}
            />
          )
        ) : (
          <div className="flex items-center justify-center h-full text-muted">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No file selected</h3>
              <p className="text-sm">Open a file from the explorer to start editing</p>
            </div>
          </div>
        )}
      </div>

      {tabToClose && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-secondary p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-medium mb-4">Save Changes</h3>
            <p className="mb-6">You have unsaved changes. Save before closing?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  handleSave();
                  onTabClose(tabToClose);
                  setTabToClose(null);
                }}
                className="px-4 py-2 bg-brand text-white rounded hover:bg-brand/90 cursor-pointer flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={() => {
                  onTabClose(tabToClose);
                  setTabToClose(null);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer flex items-center space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Don't Save</span>
              </button>
              <button
                onClick={() => {
                  setTabToClose(null);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(CodeEditor);
