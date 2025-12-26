// ============================================
// FILE: CodeEditor.tsx (Main Component)
// ============================================
"use client"
import Editor, { OnMount } from "@monaco-editor/react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Tab, FileNode } from '@/lib/types/types';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { shallowEqual } from 'react-redux';
import PreviewCloud from "./PreviewCloud";
import CodeTabHeader from "./CodeTabHeader";
import * as awarenessProtocol from "y-protocols/awareness.js";
import { theme } from "@/lib/mainUtils/themeMonoco";

// Import custom hooks
import { useYjsDocument } from '@/customHooks/codeEditor/useYjsDocumenet';
import { useEditorSave } from '@/customHooks/codeEditor/useEditorSave';
import { useRemoteDecorations } from '@/customHooks/codeEditor/useRemoteDecoraton';
import { useCollabSync } from '@/customHooks/codeEditor/useCollabSync';

// Import utilities
import { getLanguage } from '@/lib/mainUtils/codeEditor';
import { checkNotEditor } from '@/lib/mainUtils/codeEditor';

// Import sub-components
import { Save, XCircle } from "lucide-react";

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

const CodeEditor: React.FC<CodeEditorProps> = ({
  projectId, tabs, errorMarkers, setErrorMarkers,
  sendMessage, setTabs, setFiles, onTabClose, onTabSelect, isTeam
}) => {
  // ============================================
  // State Management
  // ============================================
  const [tabToClose, setTabToClose] = useState<string | null>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [isFirstSync, setIsFirstSync] = useState<string | null>(null);

  const activeTab = tabs.find(tab => tab.isActive);
  const dispatch = useAppDispatch();

  // ============================================
  // Custom Hooks
  // ============================================
  const { docsRef, awarenessMap, docRef, getOrCreateDoc, getOrCreateAwareness } = useYjsDocument();
  const { decorationsRef, updateRemoteDecorations } = useRemoteDecorations();

  // ============================================
  // Refs
  // ============================================
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const pendingScrollRef = useRef<{top: number, left: number} | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const activeTabRef = useRef<Tab | null>(activeTab);
  const silentMode = useRef(false);
  const updateHandlerRef = useRef<((update: Uint8Array) => void) | null>(null);

  // ============================================
  // Save Hook
  // ============================================
  const { handleSave } = useEditorSave(
    docRef,
    activeTabRef as React.MutableRefObject<Tab | null>,
    readOnly,
    setTabs,
    setFiles,
    sendMessage,
    projectId
  );

  // ============================================
  // Redux Selectors
  // ============================================
  const collaboratorsMap = useAppSelector(
    (state) => activeTab ? (state.collabCodeUser.projects?.[projectId]?.[activeTab.id] ?? []) : [],
    shallowEqual
  );

  const userId = useAppSelector((state) => state.user.id, shallowEqual);

  // ============================================
  // Collaboration Sync Hook
  // ============================================
  useCollabSync(
    projectId,
    activeTab,
    activeTabRef as React.MutableRefObject<Tab | null>,
    docRef,
    docsRef,
    readOnly,
    editorRef,
    monacoRef,
    awarenessMap,
    pendingScrollRef,
    updateRemoteDecorations,
    sendMessage,
    setTabs,
    setFiles
  );

  // ============================================
  // Event Handlers
  // ============================================
  const handleCodeChange = useCallback((tabId: string, content: string) => {
    if (!isTeam) return;
    setTabs(prev => prev.map(t =>
      t.id === tabId ? { ...t, isDirty: content !== t.content } : t
    ));
  }, [isTeam, setTabs]);

  // ============================================
  // Effect: Active Tab Changes
  // ============================================
  useEffect(() => {
    if (!activeTab?.id) return;
    setIsFirstSync("")
    
    // Destroy previous binding
    if (bindingRef.current) {
      try {
        bindingRef.current.destroy?.(true);
      } catch (e) {
        // pass 
      }
      bindingRef.current = null;
    }

    // Switch to new doc for this tab
    const ydoc = getOrCreateDoc(activeTab.id);
    const ytext = ydoc.getText("monaco");

    // Insert content if empty
    silentMode.current = true;
    if (ytext.length === 0 && activeTab.content) {
      ytext.insert(0, activeTab.content);
    }
    setTimeout(() => {
      silentMode.current = false;
    }, 0);
    
    docRef.current = ydoc;
    activeTabRef.current = activeTab;
  }, [activeTab?.id, getOrCreateDoc]);

  // ============================================
  // Effect: Outgoing Yjs Updates
  // ============================================
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

      sendMessage("YjsCodeChanges", projectId, tab.id, {
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
  }, [readOnly, activeTab?.id, projectId, sendMessage]);

  // ============================================
  // Effect: Collaborators / ReadOnly Logic
  // ============================================
  useEffect(() => {
    if (!activeTab?.id) return;
    
    if (collaboratorsMap.length > 0 && userId) {
      const isOwner = collaboratorsMap[0].userId === userId;
      if (!isOwner) {
        if (!readOnly) setReadOnly(true);
        if (isFirstSync !== activeTab.id) {
          setTimeout(() => {
            docRef.current.destroy()
            docsRef.current.set(activeTab.id, new Y.Doc())
            
            docRef.current = docsRef.current.get(activeTab.id)!
            sendMessage("sync", projectId, activeTab.id);
            setIsFirstSync(activeTab.id);
          }, 0);
        }
      } else {
        if (readOnly) setReadOnly(false);
      }
      
      setIsFirstSync(activeTab.id);
    }
  }, [collaboratorsMap, activeTab?.id, isFirstSync, userId, readOnly, projectId, sendMessage, docsRef]);

  // ============================================
  // Editor Mount Handler
  // ============================================
  const handleEditorMount: OnMount = (editor, monaco) => {
    if (!activeTab || typeof window === "undefined") return;
    
    const ydoc = getOrCreateDoc(activeTab.id);
    docRef.current = ydoc;
    editorRef.current = editor;
    monacoRef.current = monaco;

    const model = monaco.editor.createModel(
      ydoc.getText("monaco").toString(),
      getLanguage(activeTab.name ?? "plaintext")
    );
    editor.setModel(model);

    // Register Ctrl/Cmd+S keybinding
    try {
      const keybinding = (monaco as any).KeyMod.CtrlCmd | (monaco as any).KeyCode.KeyS;
      editor.addCommand(keybinding, () => {
        handleSave();
      });
    } catch (e) {
      // no-op
    }

    // Create Monaco binding
    const binding = new MonacoBinding(ydoc.getText("monaco"), model, new Set([editor]), null);
    bindingRef.current = binding;
    
    const awareness = new awarenessProtocol.Awareness(ydoc);
    awareness.setLocalState({});
    awarenessMap.current.set(activeTab.id, awareness)
    binding.awareness = awareness;

    // Apply pending scroll if any
    if (pendingScrollRef.current) {
      const { top, left } = pendingScrollRef.current;
      editor?.setScrollTop(top);
      editor?.setScrollLeft(left);
      pendingScrollRef.current = null;
    }

    // Error markers
    monaco.editor.onDidChangeMarkers(() => {
      const markers = monaco.editor.getModelMarkers({ resource: model.uri });
      const errors = markers.filter(m => m.severity === monaco.MarkerSeverity.Error);
      const hasErrors = errors.length > 0;
      setErrorMarkers({ [activeTab.id]: hasErrors });
    });

    // Theme setup
    monaco.editor.defineTheme("devsync-blue-dark", theme as any)
    monaco.editor.setTheme(readOnly ? "devsync-blue-dark" : "vs-dark")
    
    // Cursor position change
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

    // Cursor selection change
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

    // Scroll change
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

  // ============================================
  // Render
  // ============================================
  const fileType = checkNotEditor(activeTab?.name!);

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
          fileType ? (
            <PreviewCloud url={activeTab.content!} type={fileType as any} />
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