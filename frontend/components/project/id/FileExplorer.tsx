
import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronDown, Folder, File, MoreHorizontal, Plus, Edit3, Trash2, X } from 'lucide-react';
import { getFileIcon } from '@/lib/mainUtils/icons';
import { showToast } from '@/components/main/Toast';
import InputBox from './InputBox';
import { Tab } from '@/types';

export type FileNode = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  children?: FileNode[];
}

interface FileExplorerProps {
  files: FileNode[];
  setFiles: (files: FileNode[]) => void;
  tabs: Tab[];
  onFileSelect: (file: any) => void;
  projectId: string;
  setTabs: (tabs: Tab[]) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files,setFiles,tabs, onFileSelect,projectId,setTabs }) => {

  const [isFileAction, setIsFileAction] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{ nodeType: string; parentNodeId: string | null; nodeId: string; nodeName: string; x: number; y: number } | null>(null);
const [fileOrFolder, setFileOrFolder] = useState("folder")
const activeFile = tabs.find(tab => tab.isActive);
  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleContextMenu = (e: React.MouseEvent, nodeType: string, parentNodeId: string | null, nodeId: string, nodeName: string) => {
    e.preventDefault();
    setContextMenu({ nodeType, parentNodeId, nodeId, nodeName, x: e.clientX, y: e.clientY });
  };
  // const getCollaboratorAvatars = (collaboratorIds?: string[]) => {
  //   if (!collaboratorIds || collaboratorIds.length === 0) return null;

  //   const collaborators = mockUsers.filter(user => collaboratorIds.includes(user.id));
  //   return (
  //     <div className="flex -space-x-1 ml-2">
  //       {collaborators.slice(0, 3).map((user) => (
  //         <img
  //           key={user.id}
  //           src={user.avatar}
  //           alt={user.name}
  //           className="w-4 h-4 rounded-full border border-bg-primary"
  //           title={user.name}
  //         />
  //       ))}
  //       {collaborators.length > 3 && (
  //         <div className="w-4 h-4 rounded-full bg-brand text-xs flex items-center justify-center text-white border border-bg-primary">
  //           +{collaborators.length - 3}
  //         </div>
  //       )}
  //     </div>
  //   );
  // };
  const renderFileNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const paddingLeft = depth * 16 + 8;
    const left = depth * 16 + 12;
    return (
      <div key={node.id}>
        <div className="block" id={node.id} >
          <div
            className={`flex items-center justify-between px-2 py-1 hover:bg-primary cursor-pointer text-sm group ${activeFile?.id === node.id ? 'bg-[#151728]' : ''}`}
            style={{ paddingLeft }}
            onClick={() => {
              if (node.type === 'folder') {
                toggleFolder(node.id);
              } else {
                setTabs(tabs.map(tab => tab.id === node.id ? { ...tab, isActive: true } : tab));
                onFileSelect(node);
              }
            }}
            onContextMenu={(e) => handleContextMenu(e, node.type, node.parentId, node.id, node.name)}
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
                  {
                    getFileIcon(node.name

                    )}
                </>
              )}
              <span className="text-primary truncate">{node.type === "folder" ? node.name.slice(0, -1) : node.name}</span>
              {/* {getCollaboratorAvatars(node.collaborators)} */}
            </div>

            <button
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-hover rounded transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                handleContextMenu(e, node.type, node.parentId, node.id, node.name);
              }}
            >
              <MoreHorizontal className="w-3 h-3 text-secondary" />
            </button>

          </div>
          {node.type === "folder" && (
            <div id={'a'+node.id} className="hidden">
              <InputBox id={node.id} type={fileOrFolder} Name={""} setIsFileAction={setIsFileAction} projectId={projectId} handleNameConfirm={(a:string,b:string,c:string) => handleCreate(a,b,c)} />
            </div>
          )}
          {node.type === "folder" && isExpanded && node.children && (
            <div className='relative'>
              <span
                className="absolute top-0 h-full w-[1px] bg-[#292f52]"
                style={{ left: `${left}px` }}
              />
              {node.children.map((child: FileNode) => renderFileNode(child, depth + 1))}
            </div>
          )}
        </div>
        <div className="hidden " id={"i" + node.id}>
          <InputBox id={node.id} type={node.name.includes(".") ? "file" : "folder"} Name={node.name} setIsFileAction={setIsFileAction} handleNameConfirm={(i: string, n: string) => handleRename(i, n)} />
        </div>
      </div>
    );
  };
  //create afunction to reame and delete file and check for rename
  const renameNode = (
    tree: any[],
    nodeId: string,
    newName: string
  ): boolean => {
    for (let node of tree) {
      if (node.id === nodeId) {
        node.name = newName;
        return true;
      }

      if (node.children && node.children.length > 0) {
        const renamed = renameNode(node.children, nodeId, newName);
        if (renamed) return true;
      }
    }
    return false;
  };

  const addNode = (
    tree: any[],
    nodeId: string,
    newNode: any
  ): boolean => {
    for (let node of tree) {
      if (node.id === nodeId) {
        if(newNode.type === "folder"){node.children = [newNode,...(node.children || [])];}else{
        node.children = [...(node.children || []), newNode];}
        return true;
      }

      if (node.children && node.children.length > 0) {
        const added = addNode(node.children, nodeId, newNode);
        if (added) return true;
      }
    }
    return false;
  };

  const handleRename = async (nodeId: string, newName: string) => {
    const res: any = await fetch(`/api/projects/fileItem/rename`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: nodeId, name: newName }),
    }).then(res => res.json());
    if (res.status !== 200) {
      showToast(false, "Error renaming node -> " + res.error);
      return
    }
    let updated = [...files];

    const renamed = renameNode(updated, nodeId, newName);

    if (renamed) {
      setFiles(updated); // set new state
    } else {
      showToast(false, "Node not found");
    }
    document.getElementById("i" + nodeId)?.classList.add("hidden");
    document.getElementById(nodeId)?.classList.remove("hidden");
  };


  const handleDelete = async (nodeId: string) => {
    const res: any = await fetch(`/api/projects/fileItem/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: nodeId }),
    }).then(res => res.json());
    if (res.status !== 200) {
      showToast(false, "Error deleting node -> " + res.error);
      setIsFileAction(false);
      return
    }
    
    document.getElementById(nodeId)?.classList.add("hidden");
    setIsFileAction(false);
  };

  const handleCreate = async (type: string, nodeId: string,name:string ) => {
    const res: any = await fetch(`/api/projects/fileItem/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type,name,projectId,parentId: nodeId }),
    }).then(res => res.json())
    if (res.status !== 201) {
      showToast(false, "Error creating node -> " + res.error);
      setIsFileAction(false);
      return
    }
    let updated = [...files];
    addNode(updated, nodeId, res.data);
    setFiles(updated);
    
    document.getElementById("a" + nodeId)?.classList.add("hidden");
  };
  return (
    <div className="bg-secondary border-r border-primary h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-primary">
        <h2 className="text-primary font-medium">Explorer</h2>
        <button className="p-1 text-secondary hover:text-primary hover:bg-hover rounded">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-auto">
        {files.map((file) => renderFileNode(file))}
      </div>

      {(contextMenu && !isFileAction) && (
        <div
          className="fixed bg-card border border-primary rounded-md shadow-lg py-1 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}

        >
          <p className="px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2">{contextMenu.nodeName}</p>
          <button onClick={() => setContextMenu(null)} className="w-full hover:bg-[#2e3044] cursor-pointer px-3 py-2 text-left text-sm text-red-500 hover:bg-hover flex items-center space-x-2">
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>{contextMenu.nodeType === 'folder' &&
            <>
              <button onClick={() => {
                setIsFileAction(true);
                setContextMenu(null);
                setFileOrFolder("file")
                document.getElementById("a" + contextMenu.nodeId)?.classList.remove("hidden");
              }} className="w-full hover:bg-[#2e3044] cursor-pointer px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New File</span>
              </button>
              <button onClick={() => {
                setIsFileAction(true);
                setContextMenu(null);
                setFileOrFolder("folder")
                document.getElementById("a" + contextMenu.nodeId)?.classList.remove("hidden");
              }} className="w-full hover:bg-[#2e3044] cursor-pointer px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2">
                <Folder className="w-4 h-4" />
                <span>New Folder</span>
              </button>
            </>}
          <hr className="border-border-primary my-1" />
          <button onClick={() => {
            document.getElementById("i" + contextMenu.nodeId)?.classList.remove("hidden");
            document.getElementById(contextMenu.nodeId)?.classList.add("hidden");
            setIsFileAction(true);
            setContextMenu(null);
          }} className="w-full hover:bg-[#2e3044] cursor-pointer px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2">
            <Edit3 className="w-4 h-4" />
            <span>Rename</span>
          </button>
          <button onClick={() => {
            setIsFileAction(true);
            setContextMenu(null);
            handleDelete(contextMenu.nodeId);
          }} className="w-full hover:bg-[#2e3044] cursor-pointer px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2">
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;