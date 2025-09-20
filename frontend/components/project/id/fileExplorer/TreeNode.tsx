// TreeNode.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { ChevronRight, ChevronDown, Folder, MoreHorizontal } from 'lucide-react';
import { getFileIcon } from '@/lib/mainUtils/icons';
import Collaborators from './Collaborators';
import { FileNode, Tab } from '@/types';
import InputBox from './InputBox';
import ChnageAdmin from './ChnageAdmin';

// Minimal props — primitives to make shallow compare meaningful
type Props = {
  node: FileNode;
  depth: number;
  expandedFolders: Set<string>;
  adminMenu:any;
  setAdminMenu:any;
  onToggle: (id: string) => void;
  actionHandler: (action:string,nodeId?:string,name?:string) => void;
  onSelect: (node: FileNode) => void;
  setIsFileAction: (action: { id: string, type: string } | null) => void;
  isFileAction: { id: string, type: string } | null;
  onContextMenu: (e: React.MouseEvent, nodeType: string, parentNodeId: string | null, nodeId: string, nodeName: string) => void;
  projectId: string;
};

const TreeNodeInner: React.FC<Props> = ({ node, depth, expandedFolders, adminMenu,setAdminMenu,onToggle,actionHandler, onSelect, setIsFileAction, isFileAction, onContextMenu, projectId }) => {
  
  const [action, setAction] = useState<null | string>(null)
  const paddingLeft = depth * 16 + 8;
  const left = depth * 16 + 12;
  const isExpanded = expandedFolders.has(node.id);
  const [bg, setbg] = useState<boolean>(false)
  const handleClick = useCallback(() => {
    if (action) return
    if (node.type === 'folder') onToggle(node.id);

    else onSelect(node);
  }, [node, onSelect, onToggle]);

  const handleContext = useCallback((e: React.MouseEvent) => {
    if (action) return
    onContextMenu(e, node.type, node.parentId ?? null, node.id, node.name);
  }, [onContextMenu, node]);

  const handactions = async (name:string) => {
    await actionHandler(action!,node.id,name) 
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
        className={`flex items-center justify-between px-2 py-1 hover:bg-primary cursor-pointer text-sm group ${bg ? 'bg-[#151728]' : ''}`}
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
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-secondary" /> : <ChevronRight className="w-4 h-4 text-secondary" />}
                    <Folder className="w-4 h-4 text-brand" />
                  </>
                ) : (
                  <>
                    <div className="w-4" />
                    {getFileIcon(node.name)}
                  </>
                )}

                <span className="text-primary truncate">{node.type === 'folder' ? node.name.slice(0, -1) : node.name}</span>

                {/* Collaborators uses useSelector internally — isolates re-renders */}
                {(adminMenu && adminMenu === node.id)?
                <div className="ml-auto">
                  <ChnageAdmin projectId={projectId} fileId={node.id} setAdminMenu={setAdminMenu} />
                </div>
                :
                <div className="ml-auto">
                  <Collaborators setBg={setbg} projectId={projectId} fileId={node.id} child={!isExpanded ? node.children : undefined} />
                </div>}
              </div>
                
              <button
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-hover rounded transition-opacity"
                onClick={(e) => { e.stopPropagation(); handleContext(e as any); }}
              >
                <MoreHorizontal className="w-3 h-3 text-secondary" />
              </button>
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
              key={child.id+child.name}
              node={child}
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
    && prev.depth === next.depth
    && prev.adminMenu === next.adminMenu
    && prev.node?.children === next.node?.children
    && prev.isFileAction?.id === next.isFileAction?.id
};

const TreeNodeMemo = React.memo(TreeNodeInner, propsAreEqual);
export default TreeNodeMemo;
