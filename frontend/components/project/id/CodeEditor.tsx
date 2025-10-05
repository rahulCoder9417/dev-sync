"use client"
import Editor, { OnMount } from "@monaco-editor/react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { XCircle, Save } from 'lucide-react';
import { Tab } from '@/types';
import { showToast } from "@/components/main/Toast";
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { shallowEqual } from 'react-redux';
import { consumeUpdate } from "@/lib/redux/features/collabCodeEditorUpdate";
import PreviewCloud from "./PreviewCloud";
import CodeTabHeader from "./CodeTabHeader";
import { saveNode } from "@/lib/mainUtils/fileOp";

interface CodeEditorProps {
  isTeam: boolean;
  tabs: Tab[];
  setErrorMarkers: (errorMarkers: any) => void;
  errorMarkers: Record<string, boolean> | null;
  updatedTabs: Record<string, string>[];
  setupdatedTabs: (updatedTabs: any) => void;
  sendMessage: (message: string, projectId: string, fileId: string | undefined, data?: any) => boolean;
  setTabs: (tabs: Tab[]) => void;
  onTabClose: (tabId: string) => void;
  onTabSelect: (tabId: string) => void;
  setFiles: any;
  projectId: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  projectId, tabs, setupdatedTabs, errorMarkers, setErrorMarkers,
  sendMessage, updatedTabs, setTabs, onTabClose, onTabSelect, isTeam, setFiles
}) => {
  const savingMessages = useRef<Map<string, string>>(new Map());
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [tabToClose, setTabToClose] = React.useState<string | null>(null);
  const [readOnly, setReadOnly] = React.useState(false);

  const activeTab = tabs.find(tab => tab.isActive);
  const dispatch = useAppDispatch();
  
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const currentTabRef = useRef<string | null>(null);

  const collaboratorsMap = useAppSelector(
    (state) => activeTab ? (state.collabCodeUser.projects?.[projectId]?.[activeTab.id] ?? []) : [],
    shallowEqual
  );

  const updatesMap = useAppSelector(
    (state) => activeTab ? (state.collabCodeEditorUpdate.updates?.[activeTab.id] ?? []) : [],
    shallowEqual
  );

  const userId = useAppSelector((state) => state.user.id, shallowEqual);

  // Initialize Yjs doc when tab changes
  useEffect(() => {
    if (!activeTab?.id || !isTeam) return;

    // Tab changed - clean up old binding and create new doc
    if (currentTabRef.current !== activeTab.id) {
      // Destroy old binding
      if (bindingRef.current) {
        bindingRef.current.destroy();
        bindingRef.current = null;
      }

      // Destroy old doc (this removes all listeners automatically)
      if (ydocRef.current) {
        ydocRef.current.destroy();
      }

      // Create fresh doc for this tab
      const newDoc = new Y.Doc();
      const ytext = newDoc.getText("monaco");
      
      // Initialize with current content
      if (activeTab.content) {
        ytext.insert(0, activeTab.content);
      }

      ydocRef.current = newDoc;
      currentTabRef.current = activeTab.id;

      // Setup update listener
      const updateHandler = (update: Uint8Array, origin: any) => {
        if (origin === 'remote' || readOnly) return;
        
        sendMessage("update", projectId, activeTab.id, {
          data: Array.from(update),
          updateType: "text"
        });
      };

      newDoc.on("update", updateHandler);

      // Recreate binding if editor already mounted
      if (editorRef.current && monacoRef.current) {
        const model = editorRef.current.getModel();
        if (model) {
          bindingRef.current = new MonacoBinding(
            ytext,
            model,
            new Set([editorRef.current]),
            null
          );
        }
      }
    }

    // Cleanup: save any pending changes when tab switches
    return () => {
      if (currentTabRef.current && savingMessages.current.size > 0) {
        savingMessages.current.forEach(async (content, fileId) => {
          await updateContent(fileId, content);
        });
        savingMessages.current.clear();
      }
    };
  }, [activeTab?.id, activeTab?.content, isTeam, projectId, sendMessage, readOnly]);

  // Handle collaborators and sync
  useEffect(() => {
    if (!activeTab?.id || !isTeam || !userId || collaboratorsMap.length === 0) return;

    const isOwner = collaboratorsMap[0].userId === userId;

    if (!isOwner) {
      setReadOnly(true);
      sendMessage("sync", projectId, activeTab.id);
      showToast(false, "You are not the owner of this file");
    } else {
      setReadOnly(false);
    }
  }, [collaboratorsMap, activeTab?.id, userId, isTeam, sendMessage, projectId]);

  // Handle incoming updates
  useEffect(() => {
    if (!updatesMap || updatesMap.length === 0 || !ydocRef.current) return;

    updatesMap.forEach((update) => {
      if (update.type === "sync") {
        // Send full state
        const fullState = Y.encodeStateAsUpdate(ydocRef.current!);
        sendMessage("syncedData", projectId, activeTab!.id, {
          data: Array.from(fullState),
          updateType: "FirstSync",
          include: update.data
        });
      } else {
        // Apply update
        const updateArray = new Uint8Array(update.data);
        
        if (update.type === "FirstSync") {
          // Full sync - clear and apply
          const ytext = ydocRef.current!.getText("monaco");
          ytext.delete(0, ytext.length);
        }
        
        Y.applyUpdate(ydocRef.current!, updateArray, 'remote');
      }

      dispatch(consumeUpdate({ fileId: activeTab!.id }));
    });
  }, [updatesMap, dispatch, sendMessage, projectId, activeTab]);

  // Editor mount
  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    if (!activeTab || !ydocRef.current) return;

    editorRef.current = editor;
    monacoRef.current = monaco;

    const ytext = ydocRef.current.getText("monaco");
    const model = monaco.editor.createModel(
      ytext.toString(),
      getLanguage(activeTab.name ?? "plaintext")
    );
    
    editor.setModel(model);

    // Destroy old binding if exists
    if (bindingRef.current) {
      bindingRef.current.destroy();
    }

    // Create new binding
    bindingRef.current = new MonacoBinding(
      ytext,
      model,
      new Set([editor]),
      null
    );

    // Error markers
    monaco.editor.onDidChangeMarkers(() => {
      const markers = monaco.editor.getModelMarkers({ resource: model.uri });
      const errors = markers.filter(m => m.severity === monaco.MarkerSeverity.Error);
      setErrorMarkers({ [activeTab.id]: errors.length > 0 });
    });
  }, [activeTab, setErrorMarkers]);

  

  const updateContent = async (id: string, content: string) => {
    const res: any = await fetch(`/api/projects/fileItem/updateContent`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, content }),
    }).then(res => res.json());
    
    if (res.status === 200) {
      sendMessage("fileOp", projectId, activeTab?.id, { type: "save", content });
      showToast(true, "File saved successfully");
    } else {
      showToast(false, "Failed to save file");
    }
  };

  // Handle save with Ctrl+S
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!activeTab) return;

        // Get current content from Yjs
        if (ydocRef.current) {
          const ytext = ydocRef.current.getText('monaco');
          const content = ytext.toString();

          // Update tab content and mark as not dirty
          setTabs(tabs.map(tab =>
            tab.id === activeTab.id
              ? { ...tab, content, isDirty: false }
              : tab
          ));

          setFiles((p: any) => saveNode(p, activeTab.id, content));
          
          // Store in map and debounce save
          savingMessages.current.set(activeTab.id, content);
          
          // Clear existing timeout
          if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
          }
          
          // Debounce save by 500ms
          saveTimeoutRef.current = setTimeout(async () => {
            if (savingMessages.current.has(activeTab.id)) {
              const contentToSave = savingMessages.current.get(activeTab.id)!;
              await updateContent(activeTab.id, contentToSave);
              savingMessages.current.delete(activeTab.id);
            }
          }, 500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTab, projectId, sendMessage, tabs, setTabs, setFiles]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (bindingRef.current) bindingRef.current.destroy();
      if (ydocRef.current) ydocRef.current.destroy();
    };
  }, []);

  const handleCodeChange = useCallback((tabId: string, content: string) => {
    if (!isTeam) return;
    
    const updatedTab = tabs.find(tab => tab.id === tabId);
    if (updatedTab) {
      setupdatedTabs([...updatedTabs, { [tabId]: content }]);
    }
    
    setTabs(tabs.map(tab =>
      tab.id === tabId ? { ...tab, content, isDirty: true } : tab
    ));
  }, [tabs, isTeam, setTabs, setupdatedTabs, updatedTabs]);

  const getLanguage = (name: string): string => {
    const ext = name.toLowerCase().split('.').pop() || '';
    const map: Record<string, string> = {
      js: 'javascript', jsx: 'javascript',
      ts: 'typescript', tsx: 'typescript',
      py: 'python', java: 'java',
      cpp: 'cpp', c: 'cpp', h: 'cpp', hpp: 'cpp',
      rb: 'ruby', go: 'go', rs: 'rust',
      html: 'html', css: 'css', json: 'json',
      md: 'markdown', txt: 'plaintext',
    };
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
              key={activeTab.id}
              onMount={handleEditorMount}
              height="100%"
              language={getLanguage(activeTab.name)}
              onChange={(value) => handleCodeChange(activeTab.id, value!)}
              theme="vs-dark"
              options={{
                fontFamily: "'Fira Code', monospace",
                fontSize: 14,
                minimap: { enabled: false },
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                readOnly: !isTeam || readOnly,
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-secondary p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-medium mb-4">Save Changes</h3>
            <p className="mb-6">You have unsaved changes. Save before closing?</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => { onTabClose(tabToClose); setTabToClose(null); }}
                className="px-4 py-2 bg-brand text-white rounded hover:bg-brand/90 flex items-center space-x-2">
                <Save className="w-4 h-4" /><span>Save</span>
              </button>
              <button onClick={() => { onTabClose(tabToClose); setTabToClose(null); }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center space-x-2">
                <XCircle className="w-4 h-4" /><span>Don't Save</span>
              </button>
              <button onClick={() => setTabToClose(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
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