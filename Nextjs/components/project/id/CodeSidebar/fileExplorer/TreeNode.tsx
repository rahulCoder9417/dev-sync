// TreeNode.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, ChevronDown, Folder, MoreHorizontal } from 'lucide-react';
import { getFileIcon } from '@/lib/mainUtils/icons';
import Collaborators from './Collaborators';
import { FileNode, FileNodeWithChildren, Tab } from '@/lib/types/types';
import InputBox from './InputBox';
import ChnageAdmin from './ChnageAdmin';
import { useAppSelector } from '@/lib/redux/hooks';
import { shallowEqual, useSelector } from 'react-redux';
import { showToast } from '@/components/main/Toast';
import { makeSelectNodesByIds } from '@/lib/redux/selector/childNodeSelector';
// Minimal props — primitives to make shallow compare meaningful
type Props = {
  node: FileNodeWithChildren;
  parentDetails: { id: string, name: string, parentId: string | null } | null;
  depth: number;
  currParent: { id: string, name: string, parentId: string | null } | null;
  canMakeChanges: boolean;
  expandedFolders: Set<string>;
  adminMenu: any;
  dragPos: { x: number, y: number, name: string },
  setCurrParent: React.Dispatch<React.SetStateAction<{ id: string, name: string, parentId: string | null } | null>>;
  setAdminMenu: any;
  handleMouseDown: (name: string,id:string,parentId:string| null) => void;
  handleMouseUp: () => void;
  sendMessage: any;
  onToggle: (id: string) => void;
  setExpandedFolders: React.Dispatch<React.SetStateAction<Set<string>>>;
  actionHandler: (action: string, nodeId?: string, name?: string, oldName?: string) => void;
  onSelect: (node: FileNode) => void;
  errorMarkers: Record<string, boolean> | null;
  setIsFileAction: (action: { id: string, type: string } | null) => void;
  isFileAction: { id: string, type: string } | null;
  onContextMenu: (e: React.MouseEvent, nodeType: string, parentNodeId: string | null, nodeId: string, nodeName: string, isUserAdmin: boolean) => void;
  projectId: string;
};

const TreeNodeInner: React.FC<Props> = ({ setExpandedFolders, parentDetails, handleMouseDown, currParent, dragPos, setCurrParent, handleMouseUp, node, errorMarkers, sendMessage, depth, expandedFolders, adminMenu, setAdminMenu, onToggle, actionHandler, onSelect, setIsFileAction, isFileAction, onContextMenu, projectId, canMakeChanges }) => {
  const [action, setAction] = useState<null | string>(null)
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false)
  const paddingLeft = depth * 16 + 8;
  const left = depth * 16 + 12;
  const isExpanded = expandedFolders.has(node.id);
  const [bg, setbg] = useState<boolean>(false)
  const user = useAppSelector((state) => state.user.id, shallowEqual)
  const collaboratorsMap = useAppSelector(
    state => state.collabCodeUser?.projects?.[projectId]?.[node.id] ?? [],
    shallowEqual
  );

   const selectNodes = useMemo(makeSelectNodesByIds, []);
  const map = useAppSelector((state) => state.projectFile.map);
  const nodeChildrenFilesIds = useAppSelector(
    (state) => state.projectFile.map?.[node.id]?.fileChildren ?? []
  );
  const nodeChildrenFoldersIds = useAppSelector(
    (state) => state.projectFile.map?.[node.id]?.folderChildren ?? []
  );

  const nodeChildrenFiles = useAppSelector((state) =>
    selectNodes(state, nodeChildrenFilesIds ?? []))

  const nodeChildrenFolders = useAppSelector((state) =>
    selectNodes(state, nodeChildrenFoldersIds ?? []))
  useEffect(() => {
    if (!collaboratorsMap || collaboratorsMap.length === 0) return
    setIsUserAdmin(collaboratorsMap[0].userId === user && collaboratorsMap.length > 1)
  }, [collaboratorsMap])
  const handleClick = useCallback(() => {
    if (action) return
    if (node.type === 'folder') onToggle(node.id);

    else onSelect(node);
  }, [node, onSelect, onToggle, action]);

  const handleContext = useCallback((e: React.MouseEvent) => {
    if (action || !canMakeChanges) return
    onContextMenu(e, node.type, node.parentId ?? null, node.id, node.name, isUserAdmin);
  }, [onContextMenu, isUserAdmin, node]);

  const handactions = async (name: string) => {
    await actionHandler(action!, node.id, name, node.name)
    // action==="rename" && (node.name=name)
    setIsFileAction(null)
    setAction(null)
  }


  useEffect(() => {
    if (!isFileAction || isFileAction.id !== node.id) return
    setAction(isFileAction.type)
  }, [isFileAction])


  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return (
    <div key={node.id} id={node.id}>
      <div
        className={`flex items-center  justify-between px-2 py-1 ${ node.parentId === currParent?.id ? "" :"hover:bg-primary"} cursor-pointer text-sm group ${(bg || currParent?.id===node.id) ? errorMarkers?.[node.id] ? 'bg-[#ff2929ca]' : 'bg-[#151728]' : ''}`}
        style={{ paddingLeft }}

        onContextMenu={handleContext}
      >
        {
          action === "rename" ?
            (<InputBox id={node.id} type={node.type} Name={node.name} setAction={setAction} handleNameConfirm={(name: string) => handactions(name)} />)
            :
            (
              <>
                <div
                  onClick={handleClick}
                  onMouseEnter={() => {
                    if (dragPos.name === "") return
                    if (node.type === "folder") {
                      setCurrParent({ id: node.id, parentId: node.parentId, name: node.name })
                      if (!expandedFolders.has(node.id)) {
                        timeoutRef.current = setTimeout(() => {
                          
                          setExpandedFolders(prev => {
                            if (prev.has(node.id)) return prev;
                            return new Set([...prev, node.id]);
                          })
                          timeoutRef.current = null;

                        }, 1000);
                      }
                    } else {
                      if ( (currParent?.id != node.parentId)) {
                        setCurrParent({ id: node.parentId || "root", parentId: parentDetails?.parentId || null, name: parentDetails?.name || "root" })
                      }
                    }
                  }
                  }

                  onMouseLeave={
                    () => {
                      if (node.type === "folder" && currParent?.id === node.id) {
                        timeoutRef.current && clearTimeout(timeoutRef.current)
                        setCurrParent(null)
                      }
                    }
                  }
                  className="flex no-select items-center space-x-2 flex-1 min-w-0"
                  onMouseDown={() => handleMouseDown(node.name,node.id,node.parentId)}
                  onMouseUp={handleMouseUp}
                >
                  {node.type === 'folder' ? (
                    <>
                      {(isExpanded) ? <ChevronDown className="w-4 h-4 text-secondary shrink-0" /> : <ChevronRight className="w-4 h-4 text-secondary shrink-0" />}
                      <Folder className="w-4 h-4 text-brand shrink-0" />
                    </>
                  ) : (
                    <>
                      <div className="w-4 shrink-0" />
                      <span className="shrink-0">{getFileIcon(node.name)}</span>
                    </>
                  )}

                  <span className="text-primary truncate flex-1 min-w-0">{node.type === 'folder' ? node.name.slice(0, -1) : node.name}</span>

                  {(adminMenu && adminMenu === node.id) ?
                    <div className="ml-auto shrink-0">
                      <ChnageAdmin projectId={projectId} fileId={node.id} setAction={setAction} sendMessage={sendMessage} setAdminMenu={setAdminMenu} />
                    </div>
                    :
                    <div className="ml-auto shrink-0">
                      <Collaborators setBg={setbg} projectId={projectId} fileId={node.id} />
                    </div>}
                </div>

                {canMakeChanges && <button
                  className="opacity-0 group-hover:opacity-100 p-1 cursor-pointer hover:bg-hover rounded transition-opacity flex-shrink-0"
                  onClick={(e) => { e.stopPropagation(); handleContext(e as any); }}
                >
                  <MoreHorizontal className="w-3 h-3 text-secondary" />
                </button>}
              </>
            )
        }
      </div>
      {node.type === 'folder' && (expandedFolders.has(node.id)) && ( node.folderChildren || node.fileChildren) && (
        <div className={`relative ${currParent?.id === node.id && "bg-primary"} `}>
          <span className="absolute top-0 h-full w-px bg-[#292f52]" style={{ left: `${left}px` }} />
          {
            (action === "file" || action === "folder") && (
              <InputBox id={node.id} type={action} Name={""} setAction={setAction} handleNameConfirm={(name: string) => handactions(name)} />
            )
          }
          {nodeChildrenFolders.map(child => (
            <TreeNodeMemo
              parentDetails={{ id: node.id, name: node.name, parentId: node.parentId }}
              setExpandedFolders={setExpandedFolders}
              currParent={currParent}
              dragPos={dragPos}
              setCurrParent={setCurrParent}
              handleMouseDown={handleMouseDown}
              handleMouseUp={handleMouseUp}
              canMakeChanges={canMakeChanges}
              key={child.id + child.name}
              sendMessage={sendMessage}
              node={child}
              errorMarkers={errorMarkers}
              adminMenu={adminMenu}
              setAdminMenu={setAdminMenu}
              expandedFolders={expandedFolders}
              depth={depth + 1}
              onToggle={onToggle}
              actionHandler={actionHandler}
              onSelect={onSelect}
              setIsFileAction={setIsFileAction}
              isFileAction={isFileAction}
              onContextMenu={onContextMenu}
              projectId={projectId}
            />
          ))}
          {nodeChildrenFiles.map(child => (
            <TreeNodeMemo
              parentDetails={{ id: node.id, name: node.name, parentId: node.parentId }}
              setExpandedFolders={setExpandedFolders}
              currParent={currParent}
              dragPos={dragPos}
              setCurrParent={setCurrParent}
              handleMouseDown={handleMouseDown}
              handleMouseUp={handleMouseUp}
              canMakeChanges={canMakeChanges}
              key={child.id + child.name}
              sendMessage={sendMessage}
              node={child}
              errorMarkers={errorMarkers}
              adminMenu={adminMenu}
              setAdminMenu={setAdminMenu}
              expandedFolders={expandedFolders}
              depth={depth + 1}
              onToggle={onToggle}
              actionHandler={actionHandler}
              onSelect={onSelect}
              setIsFileAction={setIsFileAction}
              isFileAction={isFileAction}
              onContextMenu={onContextMenu}
              projectId={projectId}
            />
          ))}
        </div>
      )}

    </div>
  );
};

// A custom equality check can help — only re-render when meaningful props change
const propsAreEqual = (prev: Props, next: Props) => {
  return prev.node.id === next.node.id
    && prev.node.name === next.node.name
    && prev.expandedFolders === next.expandedFolders
    && prev.errorMarkers?.[prev.node.id] == next.errorMarkers?.[next.node.id]
    && prev.depth === next.depth
    && prev.currParent === next.currParent
    && prev.dragPos === next.dragPos
    && prev.node.content === next.node.content
    && prev.adminMenu === next.adminMenu
    && prev.node?.folderChildren === next.node?.folderChildren
    && prev.node?.fileChildren === next.node?.fileChildren

    && prev.isFileAction?.id === next.isFileAction?.id
};

const TreeNodeMemo = React.memo(TreeNodeInner, propsAreEqual);
export default TreeNodeMemo;