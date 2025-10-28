import React from 'react'
import { Circle, X } from 'lucide-react';
import Collaborators from './fileExplorer/Collaborators';

const CodeTabHeader = ({tabs,errorMarkers,onTabSelect,onTabClose,setTabToClose,projectId}:any) => {
  return (
    <div className="flex items-center bg-secondary border-b border-primary overflow-x-auto">
    {tabs.map((tab:any) => (
      <div
        key={tab.id}
        className={`flex items-center space-x-2 px-3 py-2 border-r border-primary  cursor-pointer min-w-0 ${tab.isActive ? 'bg-primary text-primary' : 'bg-secondary text-secondary hover:bg-hover'
          } ${ errorMarkers?.[tab.id] ? '!bg-[#ff2929ca]' : ''}`}
        onClick={() => onTabSelect(tab)}
      >
        <span className="text-sm truncate">{tab.name}</span>
        {tab.isDirty && (
          <Circle className="w-2 h-2 fill-current text-brand" />
        )}
         <div className="ml-auto">
            <Collaborators projectId={projectId} fileId={tab.id} />
          </div>
        <button
          className="p-0.5 hover:bg-border-primary cursor-pointer rounded"
          onClick={(e) => {
            e.stopPropagation();
            if (tab.isDirty) {
              setTabToClose(tab.id);
            } else {
              onTabClose(tab.id);
            }
          }}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    ))}
  </div>
  )
}

export default React.memo(CodeTabHeader)
