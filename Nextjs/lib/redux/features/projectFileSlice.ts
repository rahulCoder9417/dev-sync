import { showToast } from "@/components/main/Toast";
import { createComputeAncestors } from "@/lib/mainUtils/treeOperations";
import { FileNode, FileNodeWithChildren } from "@/lib/types/types";
import { createSlice } from "@reduxjs/toolkit";
interface ProjectFilesState {
  projectId: string;
  fileRoot: FileNodeWithChildren[];
  folderRoot: FileNodeWithChildren[];
  map: Record<string, FileNodeWithChildren>;
}
const initialState: ProjectFilesState = {} as ProjectFilesState; //only one projectId at a time
const changeParentChildrenForMove = (
  map: Record<string, FileNodeWithChildren>,
  node: FileNodeWithChildren,
  newParentId: string | null,
) => {
  map[node.id].parentId = newParentId;
  const computeAncestors = createComputeAncestors(map);
  let newAncestors: string[] = [];
  if (newParentId)
    newAncestors = [...map[newParentId].ancestorIds, newParentId];
  computeAncestors(map[node.id], newAncestors);
};
const fileNodeSlice = createSlice({
  name: "projectFiles",
  initialState,
  reducers: {
    setInitialProjectFiles(state, action: { payload: ProjectFilesState }) {
      state.projectId = action.payload.projectId;
      state.map = action.payload.map;
      state.fileRoot = action.payload.fileRoot;
      state.folderRoot = action.payload.folderRoot;
    },
    deleteProjectFiles(state) {
      state.projectId = "";
      state.map = {};
      state.fileRoot = [];
      state.folderRoot = [];
    },

    renameNode(
      state,
      action: { payload: { newName: string; nodeId: string } },
    ) {
      let node = state.map?.[action.payload.nodeId];
      if (!node) return;
      node.name = action.payload.newName;
      if (node.parentId !== null) return;
      if (node.type === "file") {
        state.fileRoot = state.fileRoot?.map((item) => {
          if (item.id === node.id) {
            return { ...item, name: action.payload.newName };
          }
          return item;
        });
      } else {
        state.folderRoot = state.folderRoot?.map((item) => {
          if (item.id === node.id) {
            return { ...item, name: action.payload.newName };
          }
          return item;
        });
      }
    },

    deleteNode(state, action: { payload: { nodeId: string } }) {
      const node = state.map?.[action.payload.nodeId];
      if (!node || !state.map) return;

      const idsToDelete: string[] = [];
      const stack = [node.id];
      while (stack.length) {
        const currentId = stack.pop()!;
        idsToDelete.push(currentId);

        const currentNode = state.map[currentId];
        if (!currentNode) continue;

        if (currentNode.type === "folder") {
          stack.push(...currentNode.folderChildren);
          stack.push(...currentNode.fileChildren);
        }
      }

      if (node.parentId) {
        const parent = state.map[node.parentId];
        if (parent) {
          parent.fileChildren = parent.fileChildren.filter(
            (id) => id !== node.id,
          );
          parent.folderChildren = parent.folderChildren.filter(
            (id) => id !== node.id,
          );
        }
      }

      if (node.parentId === null) {
        state.fileRoot = state.fileRoot?.filter((item) => item.id !== node.id);
        state.folderRoot = state.folderRoot?.filter(
          (item) => item.id !== node.id,
        );
      }

      for (const id of idsToDelete) {
        delete state.map[id];
      }
    },
    createNode(state, action: { payload: { newNode: FileNodeWithChildren } }) {
      if (!state.map) return;
      const newNode = action.payload.newNode;
      if (!newNode) return;

      if (!newNode.ancestorIds) newNode.ancestorIds = [];
      if (!newNode.fileChildren) newNode.fileChildren = [];
      if (!newNode.folderChildren) newNode.folderChildren = [];

      state.map[newNode.id] = newNode;

      if (newNode.parentId === null) {
        if (newNode.type === "file") {
          state.fileRoot?.push(newNode);
        } else {
          state.folderRoot?.push(newNode);
        }
        return;
      }

      const parent = state.map[newNode.parentId];
      if (!parent) return;

      if (newNode.type === "file") {
        if (!parent.fileChildren) parent.fileChildren = [];
        parent.fileChildren.push(newNode.id);
      } else {
        if (!parent.folderChildren) parent.folderChildren = [];
        parent.folderChildren.push(newNode.id);
      }
    },
    saveContent(state, action: { payload: { id: string; content: string } }) {
      if (!state.map) return;
      state.map[action.payload.id].content = action.payload.content;
      if (state.map[action.payload.id].parentId === null)
        state.fileRoot = state.fileRoot?.map((i) => {
          if (i.id === action.payload.id) {
            return {
              ...i,
              content: action.payload.content,
            };
          } else {
            return i;
          }
        });
    },
    moveNode(
      state,
      action: { payload: { nodeId: string; newParentId: string | null } },
    ) {
      const { nodeId, newParentId } = action.payload;
      const node = state.map[nodeId];
      if (!node) return;

      if (nodeId === newParentId) return;

      if (newParentId && node.ancestorIds.includes(newParentId)) return;

      const oldParentId = node.parentId;

      if (oldParentId) {
        const oldParent = state.map[oldParentId];
        if (oldParent) {
          oldParent.fileChildren = oldParent.fileChildren.filter(
            (id) => id !== nodeId,
          );
          oldParent.folderChildren = oldParent.folderChildren.filter(
            (id) => id !== nodeId,
          );
        }
      }

      if (oldParentId === null) {
        state.fileRoot = state.fileRoot.filter((n) => n.id !== nodeId);
        state.folderRoot = state.folderRoot.filter((n) => n.id !== nodeId);
      }
      if (newParentId === null || newParentId === "root") {
        if (node.type === "file") {
          state.fileRoot.push(node);
        } else {
          state.folderRoot.push(node);
        }
      } else {
        const newParent = state.map[newParentId];
        if (!newParent || newParent.type !== "folder") return;

        if (node.type === "file") {
          newParent.fileChildren.push(nodeId);
        } else {
          newParent.folderChildren.push(nodeId);
        }
      }

      node.parentId = newParentId;

      const computeAncestors = createComputeAncestors(state.map);
      const newAncestors = (newParentId && newParentId !== "root")
        ? [...state.map[newParentId].ancestorIds, newParentId]
        : [];

      computeAncestors(node, newAncestors);
    },
  },
});
export default fileNodeSlice.reducer;
export const {
  setInitialProjectFiles,
  deleteProjectFiles,
  renameNode,
  createNode,
  deleteNode,
  saveContent,
  moveNode,
} = fileNodeSlice.actions;
