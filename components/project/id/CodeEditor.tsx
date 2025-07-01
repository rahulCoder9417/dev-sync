
import React from 'react';
import { X, Circle } from 'lucide-react';
import { Tab } from '@/lib/types';


interface CodeEditorProps {
  tabs: Tab[];
  onTabClose: (tabId: string) => void;
  onTabSelect: (tabId: string) => void;
  onCodeChange: (tabId: string, content: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ tabs, onTabClose, onTabSelect, onCodeChange }) => {
  const activeTab = tabs.find(tab => tab.isActive);

  return (
    <div className="bg-primary border-r border-primary h-full flex flex-col">
      {/* Tab Header */}
      <div className="flex items-center bg-secondary border-b border-primary overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center space-x-2 px-3 py-2 border-r border-primary cursor-pointer min-w-0 ${
              tab.isActive ? 'bg-primary text-primary' : 'bg-secondary text-secondary hover:bg-hover'
            }`}
            onClick={() => onTabSelect(tab.id)}
          >
            <span className="text-sm truncate">{tab.name}</span>
            {tab.isDirty && (
              <Circle className="w-2 h-2 fill-current text-brand" />
            )}
            <button
              className="p-0.5 hover:bg-border-primary rounded"
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
          <textarea
            className="w-full h-full bg-primary text-primary p-4 resize-none outline-none font-mono text-sm leading-relaxed"
            value={activeTab.content}
            onChange={(e) => onCodeChange(activeTab.id, e.target.value)}
            placeholder="Start coding..."
            style={{
              fontFamily: "'Fira Code', 'Monaco', 'Cascadia Code', monospace",
              lineHeight: '1.6'
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