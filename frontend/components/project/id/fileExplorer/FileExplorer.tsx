// FileExplorer.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Edit3, Folder, Plus, Trash2, X } from 'lucide-react';
import TreeNodeMemo from './TreeNode';
import { Tab, FileNode } from '@/types';
import { showToast } from '@/components/main/Toast';
import InputBox from './InputBox';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addFileOp, consumeFileOp } from '@/lib/redux/features/collabCodeFileOp';
import { shallowEqual } from 'react-redux';
import { FaUserAstronaut } from 'react-icons/fa';

interface FileExplorerProps {
  files: FileNode[];
  setFiles: (files: FileNode[]) => void;
  tabs: Tab[];
  onFileSelect: (file: any) => void;
  projectId: string;
  particapantsRef:number | null;
  setTabs: (tabs: Tab[]) => void;
  sendMessage: (message: string, projectId: string, fileId: string | undefined, data: any) => void;
  setdeletionMenu: (menu: any) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  setFiles,
  tabs,
  particapantsRef,
  onFileSelect,
  setdeletionMenu,
  sendMessage,
  projectId,
  setTabs,
}) => {
  const userInfo = useAppSelector(state=>state.user,shallowEqual)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<any>(null);
  const [isFileAction, setIsFileAction] = useState<null | {id:string,type:string,name?:string | undefined}>({id:"1",type:"1"});
  const [adminMenu, setAdminMenu] = useState<any>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null)
  // stable toggler
  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  }, []);

  

  const renameNode = (tree: FileNode[], nodeId: string, newName: string): FileNode[] => {
    return tree.map(node => {
      if (node.id === nodeId) {
        return { ...node, name: newName }; 
      }
      if (node.children) {
        return { ...node, children: renameNode(node.children, nodeId, newName) };
      }
      return node;
    });
  };

  const removeNode = (tree: FileNode[], nodeId: string): [FileNode[], boolean] => {
    let deleted = false;
  
    const newTree = tree.filter(node => {
      if (node.id === nodeId) {
        deleted = true;
        return false;
      }
      return true;
    }).map(node => {
      if (!deleted && node.children) {
        const [updatedChildren, childDeleted] = removeNode(node.children, nodeId);
        if (childDeleted) {
          deleted = true;
          return { ...node, children: updatedChildren };
        }
      }
      return node;
    });
  
    return [newTree, deleted];
  };
  
  
  

  const addNode = (
    tree: FileNode[],
    nodeId: string,
    newNode: any
  ): FileNode[] => {
    return tree.map(node => {
      if (node.id === nodeId) {
        if(newNode.type === "folder"){node.children = [newNode,...(node.children || [])];}else{
          node.children = [...(node.children || []), newNode];}
        return node;
      }
      if (node.children) {
        return { ...node, children: addNode(node.children, nodeId, newNode) };
      }
      return node;
    });
  };

const fileOpSelector = useAppSelector((state)=>state.collabCodeFileOp.projects,shallowEqual)

let fileOp=fileOpSelector[projectId]
const dispatch = useAppDispatch()
  useEffect(() => {
    if (!fileOp || Object.keys(fileOp)?.length === 0)return
    let newTree = files
    fileOp?.forEach((item:any)=>{
      switch (item.type) {
        case "rename":
          newTree = renameNode(newTree, item.id, item.name!)
          break;
        case "create":
          newTree = addNode(newTree, item.id, item.newNode)
          break;
        case "delete":
          newTree = removeNode(newTree, item.id)[0]
          break;
      
        default:
          break;
      }
    dispatch(consumeFileOp({projectId}))
    setIsFileAction({id:item.id,type:""})
      
    })
    setFiles(newTree)
  }, [fileOp])

  const handleDelete = (nodeId :string,name:string)=>{
    sendMessage("vote_delete",projectId,nodeId,{fullName:userInfo.fullName,fileName:name});
  }

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
      return false  
    }  
    dispatch(addFileOp({
      type:"rename",
      name:newName,
      id:nodeId,
      projectId:projectId
    }))
    sendMessage("fileOp",projectId,nodeId,{type:"rename",fileName:newName});
    return true
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
        return
      }
        dispatch(addFileOp({
                  type:"create",
                  name:name,
                  id:nodeId,
                  newNode:res.data,
                  projectId:projectId
                }))
      sendMessage("fileOp",projectId,nodeId,{type:"create",fileName:name,newNode:res.data});
      
    };
  
  const actionHandler = useCallback(async(action:string,nodeId?:string,name?:string) => {
    switch (action) {
      case "rename":
        await handleRename(nodeId!,name!);
        break;
      case "file":
        await handleCreate("file",nodeId!,name!);
        break;
      case "folder":
        await handleCreate("folder",nodeId!,name!);
        break;
      default:
        break;
    }
  },[])
  // stable select handler
  const handleSelect = useCallback(
    (node: FileNode) => {
      setTabs(
        tabs.map(tab =>
          tab.id === node.id
            ? { ...tab, isActive: true }
            : { ...tab, isActive: false } as Tab
        )
      );
      onFileSelect(node);
      
    },
    [onFileSelect, setTabs, tabs]
  );

  const handleContextMenu = useCallback(
    (
      e: React.MouseEvent,
      nodeType: string,
      parentNodeId: string | null,
      nodeId: string,
      nodeName: string
    ) => {
      e.preventDefault();
      setIsFileAction(null)
      setContextMenu({
        nodeType,
        parentNodeId,
        nodeId,
        nodeName,
        x: e.clientX,
        y: e.clientY,
      });
    },
    []
  );

  // Close menu if click happens outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
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
        <button className="p-1 text-secondary hover:text-primary hover:bg-hover rounded">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        
        {files.map(node => (
          <TreeNodeMemo
            key={node.id}
            node={node}
            expandedFolders={expandedFolders}
            depth={0}
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

      {/* contextMenu rendering */}
      {contextMenu  && (
        <div
          ref={contextMenuRef}
          className="fixed bg-card border border-primary rounded-md shadow-lg py-1 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <p className="px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2">
            {contextMenu.nodeName}
          </p>
          <button
            onClick={() => setContextMenu(null)}
            className="w-full cursor-pointer px-3 py-2 text-left text-sm text-red-500 hover:bg-hover flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          {contextMenu.nodeType === 'folder' && (
            <>
              <button
                onClick={() => {
                  setIsFileAction({id:contextMenu.nodeId,type:"file"});
                  setExpandedFolders((prev)=>{prev.has(contextMenu.nodeId)?prev:prev.add(contextMenu.nodeId);return prev})
                  setContextMenu(null);
                }}
                className="w-full cursor-pointer px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New File</span>
              </button>
              <button
                onClick={() => {
                  setIsFileAction({id:contextMenu.nodeId,type:"folder"});
                  setExpandedFolders((prev)=>{prev.has(contextMenu.nodeId)?prev:prev.add(contextMenu.nodeId);return prev})
                 setContextMenu(null);
                }}
                className="w-full cursor-pointer px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2"
              >
                <Folder className="w-4 h-4" />
                <span>New Folder</span>
              </button>
            </>
          )}
          <hr className="border-border-primary my-1" />
          <button
            onClick={() => {
              setIsFileAction({id:contextMenu.nodeId,type:"rename"});
              setContextMenu(null);
            }}
            className="w-full cursor-pointer px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Rename</span>
          </button>
          <button
            onClick={() => {
              
              setIsFileAction({id:contextMenu.nodeId,type:"delete",name:contextMenu.nodeName});
              handleDelete(contextMenu.nodeId,contextMenu.nodeName);
              setContextMenu(null);
            }}
            className="w-full cursor-pointer px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
          {contextMenu.nodeType==="file" && (
             <button
             onClick={() => {
               
               setIsFileAction({id:contextMenu.nodeId,type:"Change Admin"});
               setAdminMenu(contextMenu.nodeId);
               setContextMenu(null);
             }}
             className="w-full cursor-pointer px-3 py-2 text-left text-sm text-primary hover:bg-hover flex items-center space-x-2"
           >
             <FaUserAstronaut className="w-4 h-4" />
             <span>Change Admin</span>
           </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
