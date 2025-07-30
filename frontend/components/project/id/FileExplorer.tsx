
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, File, MoreHorizontal, Plus, Edit3, Trash2 } from 'lucide-react';


import { FileNode } from '@/lib/types';
// import { mockUsers } from '@/app/projects/[id]/page';

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileSelect }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1']));
  const [contextMenu, setContextMenu] = useState<{ nodeId: string; x: number; y: number } | null>(null);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleContextMenu = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    setContextMenu({ nodeId, x: e.clientX, y: e.clientY });
  };

  const getCollaboratorAvatars = (collaboratorIds?: string[]) => {
    if (!collaboratorIds || collaboratorIds.length === 0) return null;
    
    // const collaborators = mockUsers.filter(user => collaboratorIds.includes(user.id));
    return (
      <div className="flex -space-x-1 ml-2">
        {/* {collaborators.slice(0, 3).map((user) => (
          <img
            key={user.id}
            src={user.avatar}
            alt={user.name}
            className="w-4 h-4 rounded-full border border-bg-primary"
            title={user.name}
          />
        ))}
        {collaborators.length > 3 && (
          <div className="w-4 h-4 rounded-full bg-brand text-xs flex items-center justify-center text-white border border-bg-primary">
            +{collaborators.length - 3}
          </div>
        )} */}
      </div>
    );
  };

  const renderFileNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const paddingLeft = depth * 16 + 8;

    return (
      <div key={node.id}>
        <div
          className="flex items-center justify-between px-2 py-1 hover:bg-hover cursor-pointer text-sm group"
          style={{ paddingLeft }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.id);
            } else {
              onFileSelect(node);
            }
          }}
          onContextMenu={(e) => handleContextMenu(e, node.id)}
        >
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {node.type === 'folder' ? (
              <>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-secondary" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-secondary" />
                )}
                <Folder className="w-4 h-4 text-brand" />
              </>
            ) : (
              <>
                <div className="w-4"></div>
                <File className="w-4 h-4 text-secondary" />
              </>
            )}
            <span className="text-primary truncate">{node.name}</span>
            {getCollaboratorAvatars(node.collaborators)}
          </div>
          
          <button
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-card rounded transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              handleContextMenu(e, node.id);
            }}
          >
            <MoreHorizontal className="w-3 h-3 text-secondary" />
          </button>
        </div>

        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderFileNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-secondary border-r border-primary h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-primary">
        <h2 className="text-primary font-medium">Explorer</h2>
        <button className="p-1 text-secondary hover:text-primary hover:bg-hover rounded">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {files.map((file) => renderFileNode(file))}
      </div>

      {contextMenu && (
        <div
          className="fixed bg-card border border-primary rounded-md shadow-lg py-1 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={() => setContextMenu(null)}
        >
          <button className="w-full px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New File</span>
          </button>
          <button className="w-full px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2">
            <Folder className="w-4 h-4" />
            <span>New Folder</span>
          </button>
          <hr className="border-border-primary my-1" />
          <button className="w-full px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2">
            <Edit3 className="w-4 h-4" />
            <span>Rename</span>
          </button>
          <button className="w-full px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2">
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;