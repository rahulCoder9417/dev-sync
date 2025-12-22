// TreeNode.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { ChevronRight, ChevronDown, Folder, MoreHorizontal } from 'lucide-react';
import { getFileIcon } from '@/lib/mainUtils/icons';
import Collaborators from './Collaborators';
import { FileNode, Tab } from '@/lib/types/types';
import InputBox from './InputBox';
import ChnageAdmin from './ChnageAdmin';
import { showToast } from '@/components/main/Toast';
import { useAppSelector } from '@/lib/redux/hooks';
import { shallowEqual } from 'react-redux';

// Minimal props — primitives to make shallow compare meaningful
type Props = {
  node: FileNode;
  depth: number;
  canMakeChanges:boolean;
  expandedFolders: Set<string>;
  adminMenu:any;
  setAdminMenu:any;
  sendMessage:any;
  onToggle: (id: string) => void;
  actionHandler: (action:string,nodeId?:string,name?:string,oldName?:string) => void;
  onSelect: (node: FileNode) => void;
  errorMarkers: Record<string, boolean> | null;
  setIsFileAction: (action: { id: string, type: string } | null) => void;
  isFileAction: { id: string, type: string } | null;
  onContextMenu: (e: React.MouseEvent, nodeType: string, parentNodeId: string | null, nodeId: string, nodeName: string,isUserAdmin:boolean) => void;
  projectId: string;
};

const TreeNodeInner: React.FC<Props> = ({ node,errorMarkers,  sendMessage, depth, expandedFolders, adminMenu,setAdminMenu,onToggle,actionHandler, onSelect, setIsFileAction, isFileAction, onContextMenu, projectId,canMakeChanges }) => {
  const [action, setAction] = useState<null | string>(null)
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false)
  const paddingLeft = depth * 16 + 8;
  const left = depth * 16 + 12;
  const isExpanded = expandedFolders.has(node.id);
  const [bg, setbg] = useState<boolean>(false)
  const user = useAppSelector((state)=>state.user.id,shallowEqual)
  const collaboratorsMap = useAppSelector(
    state => state.collabCodeUser.projects?.[projectId]?.[node.id] ?? [],
    shallowEqual
  );
  useEffect(() => {
    if(!collaboratorsMap || collaboratorsMap.length===0) return
    setIsUserAdmin(collaboratorsMap[0].userId===user && collaboratorsMap.length>1)
  }, [collaboratorsMap])
  const handleClick = useCallback(() => {
    console.log("click",action)
    if (action) return
    console.log("click",node)
    if (node.type === 'folder') onToggle(node.id);
    
    else onSelect(node);
  }, [node, onSelect, onToggle,action]);

  const handleContext = useCallback((e: React.MouseEvent) => {
    
    if (action || !canMakeChanges) return
    onContextMenu(e, node.type, node.parentId ?? null, node.id, node.name,isUserAdmin);
  }, [onContextMenu,isUserAdmin, node]);

  const handactions = async (name:string) => {
    await actionHandler(action!,node.id,name,node.name) 
   // action==="rename" && (node.name=name)
   setIsFileAction(null)
    setAction(null)
}


  useEffect(() => {
    if (!isFileAction || isFileAction.id !== node.id) return
    setAction(isFileAction.type)
}, [isFileAction])
  return (
    <div key={node.id} id={node.id}>
      <div
        className={`flex items-center justify-between px-2 py-1 hover:bg-primary cursor-pointer text-sm group ${bg ? errorMarkers?.[node.id] ? 'bg-[#ff2929ca]' : 'bg-[#151728]' : ''}`}
        style={{ paddingLeft }}
        onClick={handleClick}
        onContextMenu={handleContext}
      >
        {
          action === "rename" ?
            (<InputBox id={node.id} type={node.type} Name={node.name} setAction={setAction}  handleNameConfirm={(name:string) =>handactions( name)} />)
            :
            (
            <>
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                {node.type === 'folder' ? (
                  <>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-secondary flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-secondary flex-shrink-0" />}
                    <Folder className="w-4 h-4 text-brand flex-shrink-0" />
                  </>
                ) : (
                  <>
                    <div className="w-4 flex-shrink-0" />
                    <span className="flex-shrink-0">{getFileIcon(node.name)}</span>
                  </>
                )}

                <span className="text-primary truncate flex-1 min-w-0">{node.type === 'folder' ? node.name.slice(0, -1) : node.name}</span>

                {(adminMenu && adminMenu === node.id)?
                <div className="ml-auto flex-shrink-0">
                  <ChnageAdmin projectId={projectId} fileId={node.id} setAction={setAction} sendMessage={sendMessage} setAdminMenu={setAdminMenu} />
                </div>
                :
                <div className="ml-auto flex-shrink-0">
                  <Collaborators setBg={setbg} projectId={projectId} fileId={node.id} child={!isExpanded ? node.children : undefined} />
                </div>}
              </div>
                
           { canMakeChanges &&  <button
                className="opacity-0 group-hover:opacity-100 p-1 cursor-pointer hover:bg-hover rounded transition-opacity flex-shrink-0"
                onClick={(e) => { e.stopPropagation(); handleContext(e as any); }}
              >
                <MoreHorizontal className="w-3 h-3 text-secondary" />
              </button>}
            </>
            )
        }
      </div>
      {node.type === 'folder' && expandedFolders.has(node.id) && node.children && (
        <div className="relative">
          <span className="absolute top-0 h-full w-[1px] bg-[#292f52]" style={{ left: `${left}px` }} />
          {
            (action === "file" || action === "folder")&&(
              <InputBox id={node.id} type={action} Name={""} setAction={setAction}  handleNameConfirm={(name:string) =>handactions(name)} />
            )
          }
          {node.children.map(child => (
            <TreeNodeMemo
            canMakeChanges={canMakeChanges}
              key={child.id+child.name}
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
    && prev.expandedFolders.size === next.expandedFolders.size
    && prev.errorMarkers?.[prev.node.id] == next.errorMarkers?.[next.node.id]
    && prev.depth === next.depth
    && prev.adminMenu === next.adminMenu
    && prev.node?.children === next.node?.children
    && prev.isFileAction?.id === next.isFileAction?.id
};

const TreeNodeMemo = React.memo(TreeNodeInner, propsAreEqual);
export default TreeNodeMemo;