"use client"
import Editor, { OnMount } from "@monaco-editor/react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { XCircle, Save } from 'lucide-react';
import { Tab } from '@/types';
import { showToast } from "@/components/main/Toast";
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { shallowEqual } from 'react-redux';
import { consumeUpdate } from "@/lib/redux/features/collabCodeEditorUpdate";
import PreviewCloud from "./PreviewCloud";
import CodeTabHeader from "./CodeTabHeader";

interface CodeEditorProps {
  isTeam: boolean;
  tabs: Tab[];
  setErrorMarkers: (errorMarkers: any) => void;
  errorMarkers: Record<string, boolean> | null;
  sendMessage: (message: string, projectId: string, fileId: string | undefined, data?: any) => boolean;
  setTabs: (tabs: Tab[]) => void;
  onTabClose: (tabId: string) => void;
  onTabSelect: (tab: Tab) => void;
  projectId: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  projectId, tabs, errorMarkers, setErrorMarkers,
  sendMessage, setTabs, onTabClose, onTabSelect, isTeam
}) => {

  const [tabToClose, setTabToClose] = useState<string | null>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [isFirstSync, setIsFirstSync] = useState<string | null>(null);

  const activeTab = tabs.find(tab => tab.isActive);
  const dispatch = useAppDispatch();
  const docRef = useRef<Y.Doc>(new Y.Doc());
  const bindingRef = useRef<MonacoBinding>(null);

  const collaboratorsMap = useAppSelector(
    (state) => activeTab ? (state.collabCodeUser.projects?.[projectId]?.[activeTab.id] ?? []) : [],
    shallowEqual
  );

  const updatesMap = useAppSelector(
    (state) => activeTab ? (state.collabCodeEditorUpdate.updates?.[activeTab.id] ?? []) : [],
    shallowEqual
  );

  const userId = useAppSelector((state) => state.user.id, shallowEqual);


  const handleCodeChange = useCallback((tabId: string, content: string) => {
    if (!isTeam) return;
    setTabs(tabs.map(tab =>
      tab.id === tabId ? { ...tab, content, isDirty: content !== tab.content } : tab
    ));
  }, [tabs]);

  const activeTabRef = useRef<Tab | null>(activeTab);

  /** 🧠 Active tab changes */
  useEffect(() => {
    if (!activeTab?.id) return;
    activeTabRef.current = activeTab;
    const ytext = docRef.current.getText("monaco");

    ytext.delete(0, ytext.length);
    ytext.insert(0, activeTab?.content || "");
  }, [activeTab?.id]);

  /** 🧩 Yjs doc initialization and outgoing updates */
  const updateHandlerRef = useRef<(u: Uint8Array) => void>(()=>{});

  useEffect(() => {
    updateHandlerRef.current = (update) => {
      const tab = activeTabRef.current;
      if (!tab || readOnly) return;
  
      sendMessage("update", projectId, tab.id, {
        data: Array.from(update),
        updateType: "text",
      });
    };
  }, [readOnly]);
  
  useEffect(() => {
    const ydoc = docRef.current;
    if (!ydoc) return;
  
    const wrapper = (update: Uint8Array) => updateHandlerRef.current?.(update);
  
    ydoc.on("update", wrapper);
    return () => {
      ydoc.off("update", wrapper);
    };
  }, [docRef.current]);


  /** 📦 Collaborators / readOnly logic */
  useEffect(() => {
    if (!activeTab?.id) return;

    if (collaboratorsMap.length > 0 && userId) {
      const isOwner = collaboratorsMap[0].userId === userId;

      if (!isOwner) {
        if (!readOnly) setReadOnly(true);
        if (isFirstSync !== activeTab.id) {
          sendMessage("sync", projectId, activeTab.id);
          setIsFirstSync(activeTab.id);
        }
        showToast(false, "You are not the owner of this file");
      } else {
        if(readOnly) setReadOnly(false);
        setIsFirstSync(activeTab.id);
      }
    }
  }, [collaboratorsMap, activeTab?.id]);

  /** 🔁 Incoming updates from Yjs / Redux */
  useEffect(() => {
        if (!updatesMap || updatesMap.length === 0) return;

    updatesMap.forEach((update) => {
      const tab = activeTabRef.current;
      if (!tab) return;


      if (update.type === "sync") {
        const fullState = Y.encodeStateAsUpdate(docRef.current);
        sendMessage("syncedData", projectId, tab.id, {
          data: Array.from(fullState),
          updateType: "FirstSync",
          include: update.data
        });
        return;
      }
      console.log("hmm wahi",update)
      const ytext = docRef.current.getText("monaco");
      const updateArray = new Uint8Array(update.data);
      if (update.type === "FirstSync") ytext.delete(0, ytext.length);
      Y.applyUpdate(docRef.current, updateArray);

      dispatch(consumeUpdate({ fileId: tab.id }));
    });
  }, [updatesMap]);


  /** 🧩 Editor mount handler */
  const handleEditorMount: OnMount = (editor, monaco) => {
    if (!activeTab || typeof window === "undefined") return;

    const ydoc = docRef.current;
    const ytext = ydoc.getText("monaco");

    if (ytext.length === 0 && activeTab.content) {
      ytext.insert(0, activeTab.content);
    }

    const model = monaco.editor.createModel(
      ytext.toString(),
      getLanguage(activeTab.name ?? "plaintext")
    );
    editor.setModel(model);

    const binding = new MonacoBinding(ytext, model, new Set([editor]), null);
      bindingRef.current = binding;

    monaco.editor.onDidChangeMarkers(() => {
      const markers = monaco.editor.getModelMarkers({ resource: model.uri });
      const errors = markers.filter(m => m.severity === monaco.MarkerSeverity.Error);
      const hasErrors = errors.length > 0;
      setErrorMarkers({ [activeTab.id]: hasErrors });
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

    // Treat known binary/media files as plain text
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
              onMount={handleEditorMount}
              height="100%"
              defaultLanguage="plaintext"
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
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-secondary p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-medium mb-4">Save Changes</h3>
            <p className="mb-6">You have unsaved changes. Save before closing?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
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