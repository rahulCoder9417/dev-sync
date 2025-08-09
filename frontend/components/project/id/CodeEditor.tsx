import Editor from "@monaco-editor/react";
import React, { useEffect } from 'react';
import { X, Circle } from 'lucide-react';
import { Tab } from '@/types';
import { showToast } from "@/components/main/Toast";


interface CodeEditorProps {
  isTeam: boolean;
  tabs: Tab[];
  updatedTabs: Record<string, string>[];
  setupdatedTabs: (updatedTabs:any) => void;
  setTabs: (tabs: Tab[]) => void;
  onTabClose: (tabId: string) => void;
  onTabSelect: (tabId: string) => void;
  onCodeChange: (tabId: string, content: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ tabs,setupdatedTabs, updatedTabs, setTabs,onTabClose, onTabSelect, onCodeChange, isTeam }) => {
  const activeTab = tabs.find(tab => tab.isActive);
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
            ? { ...tab, isDirty: false,content:activeTab.content }
            : tab
        ));
        const d= updatedTabs.find(tab => tab.id === activeTab.id)
        if(d){
          setupdatedTabs((prev:any)=>prev.map((tab:any) =>
            tab.id === activeTab.id
              ? {content:activeTab.content }
              : tab
          ));
        }else{
          setupdatedTabs((prev:any)=>[...prev,{id:activeTab.id,content:activeTab.content}]);
        }
        }else{
          showToast(false, "Error updating " + data.error);
        }
      } 
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [activeTab]);


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
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab ? (

          <Editor
            height="100%"
            defaultLanguage="plaintext" // or "python", "cpp", etc.
            language={getLanguage(activeTab.name)} // if you're tracking selected language
            value={activeTab.content}
            onChange={(value) => onCodeChange(activeTab.id, value!)}
            theme="vs-dark"
            options={{
              fontFamily: "'Fira Code', 'Monaco', 'Cascadia Code', monospace",
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              readOnly: !isTeam, // replace your pointer-events logic
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

export default CodeEditor;