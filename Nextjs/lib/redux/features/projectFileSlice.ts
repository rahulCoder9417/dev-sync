import { FileNode, FileNodeWithChildren } from "@/lib/types/types";
import { createSlice } from "@reduxjs/toolkit";
interface ProjectFilesState {
  projectId: string;
  files: FileNode[];
  fileRoot?: FileNodeWithChildren[];
  folderRoot?: FileNodeWithChildren[];
  map?: Record<string, FileNodeWithChildren>;
}
const initialState: ProjectFilesState = {} as ProjectFilesState; //only one projectId at a time
const fileNodeSlice = createSlice({
  name: "projectFiles",
  initialState,
  reducers: {
    setInitialProjectFiles(state, action: { payload: ProjectFilesState }) {
      state.projectId = action.payload.projectId;
      state.files = action.payload.files;
      state.map = action.payload.map;
      state.fileRoot = action.payload.fileRoot;
      state.folderRoot = action.payload.folderRoot;
    },
    deleteProjectFiles(state) {
      state.projectId = "";
      state.files = [];
    },
    setNewProjectFiles(state, action: { payload: FileNode[] }) {
      state.files = action.payload;
    },
    addFileNode(state, action: { payload: FileNode }) {
      state.files =
        action.payload.type === "file"
          ? [...state.files, action.payload]
          : [action.payload, ...state.files];
    },
  },
});
export default fileNodeSlice.reducer;
export const {
  setInitialProjectFiles,
  deleteProjectFiles,
  addFileNode,
  setNewProjectFiles,
} = fileNodeSlice.actions;
