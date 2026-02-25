
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import TreeNodeMemo from './TreeNode';
import { Tab, FileNode, FileNodeWithChildren } from '@/lib/types/types';
import { showToast } from '@/components/main/Toast';
import InputBox from './InputBox';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addFileOp, consumeFileOp } from '@/lib/redux/features/collabCodeFileOp';
import { shallowEqual } from 'react-redux';
import { Button } from '@/components/ui/button';
import cuid from "cuid";
import FileContextMenu from './FileContext';
import { getResourceType } from '@/lib/mainUtils/getResourseType';
import { createNode, deleteNode, renameNode, saveContent, } from '@/lib/redux/features/projectFileSlice';
import { createPortal } from 'react-dom';
import { getFileIcon } from '@/lib/mainUtils/icons';
import { number } from 'zod';
import ConfirmDialog from '@/components/main/ConfirmationModal';
import { createNodeWithAncestors } from '@/lib/redux/thunk/createNodeThunk';
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
  canMakeChanges: boolean;
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
  errorMarkers,
  tabs,
  onFileSelect,
  setdeletionMenu,
  sendMessage,
  onTabClose,
  projectId,
  setTabs,
}) => {
  const files = useAppSelector(state => state.projectFile.files, shallowEqual);

  const folderRoots = useAppSelector(state => state.projectFile.folderRoot, shallowEqual);

  const filesRoot = useAppSelector(state => state.projectFile.fileRoot, shallowEqual);
  const [rootAction, setrootAction] = useState<{ type: string } | null>(null);
  const userInfo = useAppSelector(state => state.user, shallowEqual);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<any>(null);
  const [resourceTargetId, setResourceTargetId] = useState<string | null>(null);
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
    let newNode: FileNodeWithChildren & { projectId: string, createdAt: string, updatedAt: string } = {
      id,
      name,
      type: type as "file" | "folder",
      projectId,
      parentId: nodeId,
      content: "",
      createdAt: "",
      updatedAt: "",
      fileChildren: [],
      folderChildren: [],
      ancestorIds: [],
    };

    if (nodeId === null) {
      setTimeout(() => {
        dispatch(createNode({ newNode }));
        setrootAction(null);
      }, 0);
    } else {
      dispatch(createNodeWithAncestors({
        type: "create",
        name: name,
        id: nodeId,
        newNode: newNode,
        projectId: projectId
      }));
    }

    try {
      const res = await fileApiService.createFile(id, type, name, projectId, nodeId);
      const { children, ...rest } = res.data;

      const newObj = {
        ...rest,
        fileChildren: [],
        folderChildren: [],
        ancestorIds: [],
      };
      sendMessage("fileOp", projectId, nodeId, {
        type: "create",
        fileName: name,
        newNode: newObj
      });
    } catch (error: any) {
      showToast(false, "Error creating node -> " + error.message, "Node removed");
      dispatch(addFileOp({
        type: "delete",
        id: id,
        projectId: projectId
      }));
    }
    return id
  };

  const actionHandler = useCallback(async (
    action: string,
    nodeId?: string | null,
    name?: string,
    oldName?: string,
  ) => {
    if (!canMakeChanges) return;
    let id;
    switch (action) {
      case "rename":
        await handleRename(nodeId!, name!, oldName!);
        break;
      case "file":
        id = await handleCreate("file", nodeId!, name!);
        break;
      case "folder":
        id = await handleCreate("folder", nodeId!, name!);
        break;
      default:
        break;
    }
    return id
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

  const handleResourseUpload = useCallback(async (file: File, filename: string, nodeId: string) => {

    const resourceType = getResourceType(filename.split(".").pop()!);
    if (!resourceType) return
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.name);
    formData.append("resourceType", resourceType);
    formData.append("projectId", projectId);

    const res = await fetch("/api/cloudinaryUpload", {
      method: "POST",
      body: formData,
    });

    const uploadRes = await res.json()
    let obj;
    if (uploadRes.success) {
      obj = {
        path: filename,
        type: "file",
        content: uploadRes.data!,
      };
    } else {
      obj = {
        path: filename.replace(/\.[^/.]+$/, "") + ".txt",
        type: "file",
        content: `Upload failed: ${uploadRes.error}`,
      };
    }
    const id = await actionHandler("file", nodeId!, obj.path, undefined,)
    if (!id) {
      showToast(false, "Error making file  ", "Please do a refresh");
      return
    }
    const r: any = await fetch(`/api/projects/fileItem/updateContent`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, content: obj.content }),
    })
    if (r.status !== 200) {
      showToast(false, "Error saving content  -> " + r.error, "Please do a refresh");
      return
    }
    dispatch(addFileOp({
      type: "save",
      id: id,
      content: obj.content,
      projectId: projectId
    }));
    sendMessage("fileSave", projectId, id, { content: obj.content });
    setResourceTargetId(null);
  }, [actionHandler])
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
          dispatch(renameNode({ newName: item.name, nodeId: item.id }));
          break;
        case "create":
          dispatch(createNode({ newNode: item.newNode }));
          break;
        case "delete":
          onTabClose(item.id);
          dispatch(deleteNode({ nodeId: item.id }));
          break;
        case "save":
          setTabs(prev => prev.map(t =>
            t.id === item.id ? { ...t, content: item.content, isDirty: false } : t
          ));
          dispatch(saveContent({ id: item.id, content: item.content }));
          break;
        default:
          break;
      }
      // dispatch(setNewProjectFiles(newTree));
      dispatch(consumeFileOp({ projectId }));
      setIsFileAction({ id: item.id, type: "" });
    });
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
  //mouse drag for while
  const [currParent, setCurrParent] = useState<{ id: string, name: string, parentId: string | null } | null>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number, parentId: string | null, name: string, id: string }>({ id: "", x: 0, y: 0, name: "", parentId: "" });
  const mouseDownRef = React.useRef<boolean>(false);
  const [confirmModal, setConfirmModal] = useState<{ folderId: string, changePathId: string, changePathName: string, changePathParentId: string | null, folderName: string, folderParentId: string | null } | null>(null)

  function handleMouseDown(name: string, id: string, parentId: string | null) {
    mouseDownRef.current = true;
    setDragPos({ x: 0, y: 0, name, id, parentId });
  }

  function handleMouseUp() {
    if (currParent && dragPos.name !== currParent.name) setConfirmModal({ folderId: currParent.id, changePathId: dragPos.id, changePathName: dragPos.name, changePathParentId: dragPos.parentId, folderName: currParent.name, folderParentId: currParent.parentId })
    mouseDownRef.current = false;
    setCurrParent(null)
    setDragPos({ x: 0, y: 0, name: "", id: "", parentId: "" });
  }
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseDownRef.current) return
      setDragPos((prev) => ({ ...prev, x: e.clientX + 12, y: e.clientY + 12 }))
    };


    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp)
    };
  }, []);

  return (
    <div className="bg-secondary border-r border-primary h-full flex flex-col">
      {confirmModal && <ConfirmDialog message={`Are you sure you want to move ${confirmModal.changePathName} to ${confirmModal?.folderName}?`} onAccept={() => { setConfirmModal(null) }} onCancel={() => { setConfirmModal(null) }} />}
      <div className="flex items-center justify-between p-3 border-b border-primary">
        {/* to take input for resourse */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setContextMenu(null);
            await handleResourseUpload(file, file.name, resourceTargetId!)
            e.target.value = "";
          }}
        />

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

        {folderRoots?.map(node => (
          <TreeNodeMemo
            currParent={currParent}
            dragPos={dragPos}
            setCurrParent={setCurrParent}
            handleMouseDown={handleMouseDown}
            handleMouseUp={handleMouseUp}
            sendMessage={sendMessage}
            key={node.id}
            node={node}
            parentDetails={null}
            expandedFolders={expandedFolders}
            setExpandedFolders={setExpandedFolders}
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
        {filesRoot?.map(node => (
          <TreeNodeMemo
            currParent={currParent}
            dragPos={dragPos}
            setCurrParent={setCurrParent}
            handleMouseDown={handleMouseDown}
            handleMouseUp={handleMouseUp}
            sendMessage={sendMessage}
            key={node.id}
            node={node}
            parentDetails={null}
            expandedFolders={expandedFolders}
            setExpandedFolders={setExpandedFolders}
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
        onNewResourse={() => {

          setResourceTargetId(contextMenu?.nodeId ?? null);
          contextMenu.nodeId && setExpandedFolders((prev) => {
            if (prev.has(contextMenu.nodeId)) return prev;
            return new Set([...prev, contextMenu.nodeId]);
          })

          fileInputRef.current?.click();
        }}
        contextMenuRef={contextMenuRef as any}
        onClose={() => setContextMenu(null)}
        onNewFile={() => {
          contextMenu.nodeId
            ? (setIsFileAction({ id: contextMenu.nodeId, type: "file" }),
              setExpandedFolders((prev) => {
                if (prev.has(contextMenu.nodeId)) return prev;
                return new Set([...prev, contextMenu.nodeId]);
              }))
            : setrootAction({ type: "file" });
          setContextMenu(null);
        }}
        onNewFolder={() => {
          contextMenu.nodeId
            ? (setIsFileAction({ id: contextMenu.nodeId, type: "folder" }),
              setExpandedFolders((prev) => {
                if (prev.has(contextMenu.nodeId)) return prev;
                return new Set([...prev, contextMenu.nodeId]);
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
      {mouseDownRef.current && dragPos.name !== "" && dragPos.x !== 0 && dragPos.y !== 0 && createPortal(
        <div
          className="
    fixed
    pointer-events-none
    z-[9999]
    bg-[#1e2235]
    border
    border-[#292f52]
    rounded-lg
    px-2
    py-1
    text-xs
    text-white
    flex
    items-center
    gap-2
  "
          style={{
            top: dragPos.y,
            left: dragPos.x,
          }}
        >

          {getFileIcon(dragPos.name)}
          <span>{dragPos.name}</span>
        </div>,
        document.body
      )}
    </div>
  );
};

export default FileExplorer;