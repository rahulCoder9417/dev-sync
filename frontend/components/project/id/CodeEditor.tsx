"use client"
import Editor, { OnMount } from "@monaco-editor/react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { X, Circle } from 'lucide-react';
import { Tab } from '@/types';
import { showToast } from "@/components/main/Toast";
import Collaborators from "./fileExplorer/Collaborators";
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { shallowEqual } from 'react-redux';
import { consumeUpdate } from "@/lib/redux/features/collabCodeEditorUpdate";

interface CodeEditorProps {
  isTeam: boolean;
  tabs: Tab[];
  updatedTabs: Record<string, string>[];
  setupdatedTabs: (updatedTabs: any) => void;
  sendMessage: (message: string, projectId: string, fileId: string | undefined, data?: any) => boolean;
  setTabs: (tabs: Tab[]) => void;
  onTabClose: (tabId: string) => void;
  onTabSelect: (tabId: string) => void;
  projectId: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ projectId, tabs, setupdatedTabs, sendMessage, updatedTabs, setTabs, onTabClose, onTabSelect, isTeam }) => {
  const activeTab = tabs.find(tab => tab.isActive);
  const bindingRef = useRef<MonacoBinding>(null);
  const [isFirstSync,setIsFirstSync] = useState(false)
  const handleCodeChange = useCallback((tabId: string, content: string) => {
    if (!isTeam) return
    setTabs(tabs.map(tab =>
      tab.id === tabId
        ? { ...tab, content, isDirty: content !== tab.content }
        : tab
    ));
  }, [tabs]);
  const dispatch = useAppDispatch();
  const docRef = useRef<Y.Doc>(new Y.Doc());
  const [readOnly, setReadOnly] = useState(false)
  const collaboratorsMap = useAppSelector(
    (state) => {
      if (!activeTab) return [];
      return state.collabCodeUser.projects?.[projectId]?.[activeTab.id] ?? []
    },
    shallowEqual
  );

  const updatesMap = useAppSelector(
    (state) => {
      if (!activeTab) return [];
      return state.collabCodeEditorUpdate.updates?.[activeTab.id] ?? []
    },
    shallowEqual
  );

  const userId = useAppSelector(
    state => state.user.id,
    shallowEqual
  );


  const getLanguage = (name: string): string => {
    const ext = name.toLowerCase().split('.').pop() || '';
    const map: Record<string, string> = {
      js: 'javascript',
      ts: 'typescript',
      jsx: 'javascript',
      tsx: 'typescript',
      html: 'html',
      css: 'css',
      scss: 'scss',
      sass: 'scss',
      less: 'less',
      json: 'json',
      md: 'markdown',
      txt: 'plaintext',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      h: 'cpp',
      hpp: 'cpp',
      php: 'php',
      rb: 'ruby',
      go: 'go',
      rs: 'rust',
      rust: 'rust',
      swift: 'swift',
      kt: 'kotlin',
      dart: 'dart',
      vue: 'vue',
      svelte: 'svelte',
      xml: 'xml',
      yml: 'yaml',
      yaml: 'yaml',
      toml: 'toml',
      ini: 'ini',
      cfg: 'ini',
      conf: 'ini',
      log: 'plaintext',
      sql: 'sql',
      sh: 'shell',
      bash: 'shell',
      zsh: 'shell',
      bat: 'bat',
      ps1: 'powershell',
      dockerfile: 'dockerfile',
      gitignore: 'gitignore',
      gitattributes: 'gitignore',
      env: 'dotenv',
      sample: 'dotenv',
      example: 'dotenv',
      template: 'dotenv',
      lock: 'plaintext',
      min: 'plaintext',
      map: 'plaintext',
    };

    // Ignore known binary or media extensions
    const binaryExtensions = new Set([
      'woff', 'woff2', 'ttf', 'otf', 'eot',
      'svg', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'ico',
      'pdf', 'zip', 'tar', 'gz', 'rar', '7z',
      'bak', 'tmp', 'cache', 'dist', 'build'
    ]);

    if (binaryExtensions.has(ext)) return 'plaintext';

    return map[ext] || 'plaintext';
  };
  useEffect(() => {
    console.log("i change collaboratorsMap")
    if (collaboratorsMap && collaboratorsMap.length > 0 && userId) {
      console.log(collaboratorsMap)
      if ((collaboratorsMap[0].userId !== userId)) {
        setReadOnly(true)
        if(!isFirstSync){
          sendMessage("sync", projectId, activeTab?.id);console.log("sync")
          setIsFirstSync(true)
        }
        showToast(false, "You are not the owner of this file");
      }
      else {
        setReadOnly(false)
      }
    }
  }, [collaboratorsMap])
  useEffect(() => {
    console.log("i change active tab", activeTab)
    const handleKeyDown = async (e: KeyboardEvent) => {
      const isSaveShortcut = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's';

      if (isSaveShortcut) {
        e.preventDefault(); // prevent browser save dialog

        if (activeTab?.isDirty) {
          const response = await fetch(`/api/projects/fileItem/updateContent`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: activeTab.id,
              content: activeTab.content,
            }),
          });

          const data = await response.json();

          if (data.success) {
            setTabs(tabs.map(tab =>
              tab.id === activeTab.id
                ? { ...tab, isDirty: false, content: activeTab.content }
                : tab
            ));
            const d = updatedTabs.find(tab => tab.id === activeTab.id)
            if (d) {
              setupdatedTabs((prev: any) => prev.map((tab: any) =>
                tab.id === activeTab.id
                  ? { content: activeTab.content }
                  : tab
              ));
            } else {
              setupdatedTabs((prev: any) => [...prev, { id: activeTab.id, content: activeTab.content }]);
            }
          } else {
            showToast(false, "Error updating " + data.error);
          }
        }
      }
    };
    const updateHandler = (update: Uint8Array) => {
      if (readOnly) return
      console.log(readOnly, "update", update)
      sendMessage("update", projectId, activeTab?.id, { data: Array.from(update), updateType: "text" });
    };
    const ytext = docRef.current!.getText("monaco");
    ytext.delete(0, ytext.length)
    ytext.insert(0, activeTab?.content || "");
    console.log(ytext.toString())
    docRef.current.on("update", updateHandler);
    // window.addEventListener('keydown', handleKeyDown);

    return () => {
      //window.removeEventListener('keydown', handleKeyDown);
      docRef.current?.off("update", updateHandler);
    }
  }, [activeTab?.id, readOnly]);



  useEffect(() => {
    console.log("i change updatesMap")
    if (updatesMap && updatesMap.length > 0) {
      console.log(updatesMap)
      updatesMap.forEach((update) => {
        console.log(update)
        if (update.type === "sync") {
          console.log("giving thwe sync")
          const fullState = Y.encodeStateAsUpdate(docRef.current!);
          sendMessage("syncedData", projectId, activeTab?.id, { data: Array.from(fullState), updateType: "FirstSync" ,include:update.data});
          return
        }
        const ytext = docRef.current!.getText("monaco");
        const a = new Uint8Array(update.data);
        console.log(a)
        if(update.type==="FirstSync")ytext.delete(0,ytext.length)
        console.log(ytext.toString())
        Y.applyUpdate(docRef.current!, a);
        console.log("H", docRef.current!.getText("monaco").toString())
        dispatch(consumeUpdate({ fileId: activeTab?.id! }))
      })
    }

  }, [updatesMap])
  const handleEditorMount: OnMount = (editor, monaco) => {
    if (!activeTab) return;
    const ydoc = docRef.current!;
    const ytext = ydoc.getText("monaco");

    if (ytext.length === 0 && activeTab?.content) {
      ytext.insert(0, activeTab.content);
    }
    const model = monaco.editor.createModel(
      ytext.toString(),
      getLanguage(activeTab?.name ?? "plaintext")
    );
    editor.setModel(model);

    const binding = new MonacoBinding(
      ytext,
      model,
      new Set([editor]),
      null // awareness (we’ll add later)
    );
    bindingRef.current = binding;
  };
  return (
    <div className="bg-primary border-r border-primary h-full flex flex-col">
      {/* Tab Header */}
      <div className="flex items-center bg-secondary border-b border-primary overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center space-x-2 px-3 py-2 border-r border-primary cursor-pointer min-w-0 ${tab.isActive ? 'bg-primary text-primary' : 'bg-secondary text-secondary hover:bg-hover'
              }`}
            onClick={() => onTabSelect(tab.id)}
          >
            <span className="text-sm truncate">{tab.name}</span>
            {tab.isDirty && (
              <Circle className="w-2 h-2 fill-current text-brand" />
            )}
            <button
              className="p-0.5 hover:bg-border-primary cursor-pointer rounded"
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
            >
              <div className="ml-auto">
                <Collaborators projectId={projectId} fileId={tab.id} />
              </div>
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab ? (


          <Editor
            onMount={handleEditorMount}
            height="100%"
            defaultLanguage="plaintext" // or "python", "cpp", etc.
            language={getLanguage(activeTab.name)}
            onChange={(value) => handleCodeChange(activeTab.id, value!)}
            theme="vs-dark"
            options={{
              fontFamily: "'Fira Code', 'Monaco', 'Cascadia Code', monospace",
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              readOnly: !isTeam || readOnly, // replace your pointer-events logic
            }}
          />

        ) : (
          <div className="flex items-center justify-center h-full text-muted">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No file selected</h3>
              <p className="text-sm">Open a file from the explorer to start editing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CodeEditor);