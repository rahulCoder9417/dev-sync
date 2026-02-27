import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { _moveNodeInternal } from "../features/projectFileSlice";
import { showToast } from "@/components/main/Toast";

export const moveNode = createAsyncThunk<
  { nodeId: string; newParentId: string | null },
  { nodeId: string; newParentId: string | null },
  { state: RootState; rejectValue: string }
>(
  "projectFiles/moveNode",
  async ({ nodeId, newParentId }, { getState, dispatch, rejectWithValue }) => {
    const state = getState().projectFile;
    const node = state.map[nodeId];

    if (!node) {
      return rejectWithValue("Node not found");
    }

    if (nodeId === newParentId) {
      return rejectWithValue("Cannot move into itself");
    }

    if (newParentId && node.ancestorIds.includes(newParentId)) {
      return rejectWithValue("Cannot move into its descendant");
    }

    if (newParentId && newParentId !== "root") {
      const newParent = state.map[newParentId];

      if (!newParent || newParent.type !== "folder") {
        return rejectWithValue("Parent could not be found");
      }

      if (node.type === "file") {
        const duplicate = newParent.fileChildren.find(
          (id) => state.map[id].name === node.name
        );
        if (duplicate) {
          return rejectWithValue("Same file name in the folder");
        }
      } else {
        const duplicate = newParent.folderChildren.find(
          (id) => state.map[id].name === node.name
        );
        if (duplicate) {
          return rejectWithValue("Same folder name in the folder");
        }
      }
    }

    if (newParentId === null || newParentId === "root") {
      if (node.type === "file") {
        const duplicate = state.fileRoot.find(
          (i) => i.name === node.name
        );
        if (duplicate) {
          return rejectWithValue("Same file name at root");
        }
      } else {
        const duplicate = state.folderRoot.find(
          (i) => i.name === node.name
        );
        if (duplicate) {
          return rejectWithValue("Same folder name at root");
        }
      }
    }

    dispatch(_moveNodeInternal({ nodeId, newParentId }));

    return { nodeId, newParentId };
  }
);