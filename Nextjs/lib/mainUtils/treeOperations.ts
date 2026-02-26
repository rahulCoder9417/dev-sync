// import { FileNode, Tab } from '@/lib/types/types';

import { FileNodeWithChildren } from "../types/types";

// export const renameNodeInTree = (
//   tree: FileNode[], 
//   nodeId: string, 
//   newName: string, 
//   tabs: Tab[]
// ): FileNode[] => {
//   let tab = tabs.find((tab: any) => tab.id === nodeId);
//   if (tab) tab.name = newName;
  
//   return tree.map(node => {
//     if (node.id === nodeId) {
//       return { ...node, name: newName };
//     }
//     if (node.children) {
//       return { 
//         ...node, 
//         children: renameNodeInTree(node.children, nodeId, newName, tabs) 
//       };
//     }
//     return node;
//   });
// };

// export const removeNodeFromTree = (
//   tree: FileNode[], 
//   nodeId: string
// ): [FileNode[], boolean] => {
//   let deleted = false;
  
//   const newTree = tree.filter(node => {
//     if (node.id === nodeId) {
//       deleted = true;
//       return false;
//     }
//     return true;
//   }).map(node => {
//     if (!deleted && node.children) {
//       const [updatedChildren, childDeleted] = removeNodeFromTree(node.children, nodeId);
//       if (childDeleted) {
//         deleted = true;
//         return { ...node, children: updatedChildren };
//       }
//     }
//     return node;
//   });

//   return [newTree, deleted];
// };

// export const addNodeToTree = (
//   tree: FileNode[],
//   nodeId: string,
//   newNode: FileNode
// ): FileNode[] => {
//   if (!nodeId) { 
//     return newNode.type === "file"
//       ? [...tree, newNode]
//       : [newNode, ...tree];
//   }

//   return tree.map(node => {
//     if (node.id === nodeId) {
//       const children = node.children ?? [];
//       const updatedChildren = newNode.type === "folder"
//         ? [newNode, ...children]
//         : [...children, newNode];
      
//       return { ...node, children: updatedChildren };
//     }

//     if (node.children) {
//       return { 
//         ...node, 
//         children: addNodeToTree(node.children, nodeId, newNode) 
//       };
//     }

//     return node;
//   });
// };
//legacy code above 
export const createComputeAncestors = (
  map: Record<string, FileNodeWithChildren>
) => {
  return function computeAncestors(
    node: FileNodeWithChildren,
    parentAncestors: string[]
  ) {
    node.ancestorIds = parentAncestors;

    const nextAncestors = [...parentAncestors, node.id];

    for (const childId of node?.folderChildren || []) {
      const child = map[childId];
      if (child) computeAncestors(child, nextAncestors);
    }

    for (const childId of node?.fileChildren || []) {
      const child = map[childId];
      if (child) computeAncestors(child, nextAncestors);
    }
  };
};