
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import TreeNodeMemo from './TreeNode';
import { Tab, FileNode } from '@/lib/types/types';
import { showToast } from '@/components/main/Toast';
import InputBox from './InputBox';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addFileOp, consumeFileOp } from '@/lib/redux/features/collabCodeFileOp';
import { shallowEqual } from 'react-redux';
import { Button } from '@/components/ui/button';
import cuid from "cuid";
import { saveNode } from '@/lib/mainUtils/fileOp';
import { renameNodeInTree, removeNodeFromTree, addNodeToTree } from '@/lib/mainUtils/treeOperations';
import FileContextMenu from './FileContext';
export const fileApiService = {
  async renameFile(nodeId: string, newName: string) {
    const res = await fetch(`/api/projects/fileItem/rename`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: nodeId, name: newName }),
    }).then(res => res.json());
    
    if (res.status !== 200) {
      throw new Error(res.error);
    }
    return res;
  },

  async createFile(
    id: string, 
    type: string, 
    name: string, 
    projectId: string, 
    parentId: string | null
  ) {
    const res = await fetch(`/api/projects/fileItem/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type, name, projectId, parentId }),
    }).then(res => res.json());
    
    if (res.status !== 201) {
      throw new Error(res.error);
    }
    return res;
  }
};
interface FileExplorerProps {
  files: FileNode[];
  canMakeChanges: boolean;
  setFiles: React.Dispatch<React.SetStateAction<FileNode[]>>;
  errorMarkers: Record<string, boolean> | null;
  tabs: Tab[];
  onFileSelect: (file: any) => void;
  onTabClose: (fileId: string) => void;
  projectId: string;
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  sendMessage: (message: string, projectId: string, fileId: string | undefined, data: any) => void;
  setdeletionMenu: (menu: any) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  canMakeChanges,
  files,
  setFiles,
  errorMarkers,
  tabs,
  onFileSelect,
  setdeletionMenu,
  sendMessage,
  onTabClose,
  projectId,
  setTabs,
}) => {
  const [rootAction, setrootAction] = useState<{ type: string } | null>(null);
  const userInfo = useAppSelector(state => state.user, shallowEqual);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<any>(null);
  const [isFileAction, setIsFileAction] = useState<null | { 
    id: string, 
    type: string, 
    name?: string | undefined 
  }>({ id: "1", type: "1" });
  const [adminMenu, setAdminMenu] = useState<any>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();

  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      console.log("toggleFolder", folderId, next);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  }, []);

  const handleDelete = (nodeId: string, name: string) => {
    sendMessage("vote_delete", projectId, nodeId, { 
      fullName: userInfo.fullName, 
      fileName: name 
    });
  };

  const handleRename = async (nodeId: string, newName: string, oldName: string) => {
    dispatch(addFileOp({
      type: "rename",
      name: newName,
      id: nodeId,
      projectId: projectId
    }));

    try {
      await fileApiService.renameFile(nodeId, newName);
      sendMessage("fileOp", projectId, nodeId, { type: "rename", fileName: newName });
      return true;
    } catch (error: any) {
      showToast(false, "Error renaming node -> Pls try Again " + error.message);
      dispatch(addFileOp({
        type: "rename",
        name: oldName,
        id: nodeId,
        projectId: projectId
      }));
      return false;
    }
  };

  const handleCreate = async (type: string, nodeId: string, name: string) => {
    let id = cuid();
    let newNode = {
      id,
      name,
      type: type as "file" | "folder",
      projectId,
      parentId: nodeId,
      createdAt: "",
      updatedAt: "",
      children: []
    };

    if (nodeId === null) {
      if (type === "file") {
        setFiles((prev: FileNode[]) => [...prev, newNode] as FileNode[]);
      } else {
        setFiles((prev: FileNode[]) => [newNode, ...prev] as FileNode[]);
      }
      setrootAction(null);
    } else {
      console.log("disp");
      dispatch(addFileOp({
        type: "create",
        name: name,
        id: nodeId,
        newNode: newNode,
        projectId: projectId
      }));
    }

    try {
      const res = await fileApiService.createFile(id, type, name, projectId, nodeId);
      sendMessage("fileOp", projectId, nodeId, { 
        type: "create", 
        fileName: name, 
        newNode: res.data 
      });
    } catch (error: any) {
      showToast(false, "Error creating node -> " + error.message, "Node removed");
      dispatch(addFileOp({
        type: "delete",
        id: id,
        projectId: projectId
      }));
    }
  };

  const actionHandler = useCallback(async (
    action: string, 
    nodeId?: string | null, 
    name?: string, 
    oldName?: string
  ) => {
    if (!canMakeChanges) return;
    
    switch (action) {
      case "rename":
        await handleRename(nodeId!, name!, oldName!);
        break;
      case "file":
        await handleCreate("file", nodeId!, name!);
        break;
      case "folder":
        await handleCreate("folder", nodeId!, name!);
        break;
      default:
        break;
    }
  }, [canMakeChanges]);

  const handleSelect = useCallback((node: FileNode) => {
    onFileSelect(node);
  }, [onFileSelect]);

  const handleContextMenu = useCallback((
    e: React.MouseEvent,
    nodeType: string,
    parentNodeId: string | null,
    nodeId: string | null,
    nodeName: string,
    isUserAdmin?: boolean
  ) => {
    e.preventDefault();
    setIsFileAction(null);
    setContextMenu({
      nodeType,
      parentNodeId,
      nodeId,
      isUserAdmin,
      nodeName,
      x: e.clientX,
      y: e.clientY,
    });
  }, []);

  // File operations processor
  const fileOpSelector = useAppSelector(
    (state) => state.collabCodeFileOp.projects, 
    shallowEqual
  );
  let fileOp = fileOpSelector[projectId];

  useEffect(() => {
    if (!fileOp || Object.keys(fileOp)?.length === 0) return;
    
    let newTree = files;
    fileOp?.forEach((item: any) => {
      switch (item.type) {
        case "rename":
          newTree = renameNodeInTree(newTree, item.id, item.name!, tabs);
          break;
        case "create":
          newTree = addNodeToTree(newTree, item.id, item.newNode);
          break;
        case "delete":
          onTabClose(item.id);
          newTree = removeNodeFromTree(newTree, item.id)[0];
          break;
        case "save":
          setTabs(prev => prev.map(t =>
            t.id === item.id ? { ...t, content: item.content, isDirty: false } : t
          ));
          newTree = saveNode(newTree, item.id, item.content!);
          break;
        default:
          break;
      }
      dispatch(consumeFileOp({ projectId }));
      setIsFileAction({ id: item.id, type: "" });
    });
    setFiles(newTree);
  }, [fileOp]);

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node) && 
        contextMenu?.nodeId
      ) {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      window.addEventListener('click', handleClickOutside);
    }

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu]);

  return (
    <div className="bg-secondary border-r border-primary h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-primary">
        <h2 className="text-primary font-medium">Explorer</h2>
        {canMakeChanges && (
          <Button
            onClick={(e) => { 
              e.stopPropagation(); 
              handleContextMenu(e, "folder", null, null, "--root--"); 
            }}
            className='cursor-pointer hover:bg-[#6a5d89] rounded-full p-1 hover:text-primary'
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        {rootAction && rootAction.type && (
          <InputBox 
            id={null} 
            type={rootAction.type} 
            Name={""} 
            setAction={setrootAction} 
            handleNameConfirm={(name: string) => actionHandler(rootAction.type, null, name)} 
          />
        )}
        {files.map(node => (
          <TreeNodeMemo
            sendMessage={sendMessage}
            key={node.id}
            node={node}
            expandedFolders={expandedFolders}
            canMakeChanges={canMakeChanges}
            depth={0}
            errorMarkers={errorMarkers}
            onToggle={toggleFolder}
            setIsFileAction={setIsFileAction}
            isFileAction={isFileAction}
            onSelect={handleSelect}
            adminMenu={adminMenu}
            setAdminMenu={setAdminMenu}
            actionHandler={actionHandler}
            onContextMenu={handleContextMenu}
            projectId={projectId}
          />
        ))}
      </div>

      <FileContextMenu
        contextMenu={contextMenu}
        contextMenuRef={contextMenuRef as any}
        onClose={() => setContextMenu(null)}
        onNewFile={() => {
          contextMenu.nodeId 
            ? (setIsFileAction({ id: contextMenu.nodeId, type: "file" }),
               setExpandedFolders((prev) => { 
                 prev.has(contextMenu.nodeId) ? prev : prev.add(contextMenu.nodeId); 
                 return prev 
               }))
            : setrootAction({ type: "file" });
          setContextMenu(null);
        }}
        onNewFolder={() => {
          contextMenu.nodeId 
            ? (setIsFileAction({ id: contextMenu.nodeId, type: "folder" }),
               setExpandedFolders((prev) => { 
                 prev.has(contextMenu.nodeId) ? prev : prev.add(contextMenu.nodeId); 
                 return prev 
               }))
            : setrootAction({ type: "folder" });
          setContextMenu(null);
        }}
        onRename={() => {
          setIsFileAction({ id: contextMenu.nodeId, type: "rename" });
          setContextMenu(null);
        }}
        onDelete={() => {
          setIsFileAction({ 
            id: contextMenu.nodeId, 
            type: "delete", 
            name: contextMenu.nodeName 
          });
          handleDelete(contextMenu.nodeId, contextMenu.nodeName);
          setContextMenu(null);
        }}
        onChangeAdmin={() => {
          setIsFileAction({ id: contextMenu.nodeId, type: "Change Admin" });
          setAdminMenu(contextMenu.nodeId);
          setContextMenu(null);
        }}
      />
    </div>
  );
};

export default FileExplorer;