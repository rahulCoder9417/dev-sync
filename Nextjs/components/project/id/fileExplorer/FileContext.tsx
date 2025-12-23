import React from 'react';
import { Boxes, Edit3, Folder, Plus, Trash2, X } from 'lucide-react';
import { FaUserAstronaut } from 'react-icons/fa';

interface FileContextMenuProps {
  contextMenu: any;
  contextMenuRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
  onNewFile: () => void;
  onNewFolder: () => void;
  onNewResourse: () => void;
  onRename: () => void;
  onDelete: () => void;
  onChangeAdmin?: () => void;
}

const FileContextMenu: React.FC<FileContextMenuProps> = ({
  contextMenu,
  contextMenuRef,
  onClose,
  onNewFile,
  onNewFolder,
  onNewResourse,
  onRename,
  onDelete,
  onChangeAdmin
}) => {
  if (!contextMenu) return null;

  return (
    <div
      ref={contextMenuRef}
      className="fixed bg-card border border-primary rounded-md shadow-lg py-1 z-50"
      style={{ left: contextMenu.x, top: contextMenu.y }}
    >
      <p className="px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2">
        {contextMenu.nodeName}
      </p>
      
      <button
        onClick={onClose}
        className="w-full cursor-pointer px-3 py-2 text-left text-sm text-red-500 hover:bg-hover flex items-center space-x-2"
      >
        <X className="w-4 h-4" />
        <span>Cancel</span>
      </button>
      
      {contextMenu.nodeType === 'folder' && (
        <>
          <button
            onClick={onNewFile}
            className="w-full cursor-pointer px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New File</span>
          </button>
          <button
            onClick={onNewFolder}
            className="w-full cursor-pointer px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2"
          >
            <Folder className="w-4 h-4" />
            <span>New Folder</span>
          </button>
          <button
            onClick={onNewResourse}
            className="w-full cursor-pointer px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2"
          >
            <Boxes className="w-4 h-4" />
            <span>New Resourse</span>
          </button>
        </>
      )}
      
      {contextMenu.nodeId && (
        <>
          <hr className="border-border-primary my-1" />
          <button
            onClick={onRename}
            className="w-full cursor-pointer px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Rename</span>
          </button>
          <button
            onClick={onDelete}
            className="w-full cursor-pointer px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
          {(contextMenu.nodeType === "file" && contextMenu.isUserAdmin && onChangeAdmin) && (
            <button
              onClick={onChangeAdmin}
              className="w-full cursor-pointer px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2"
            >
              <FaUserAstronaut className="w-4 h-4" />
              <span>Change Admin</span>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default FileContextMenu;