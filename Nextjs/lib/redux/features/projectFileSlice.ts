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
    renameNode(state,action:{payload:{newName:string,nodeId:string}}){
      let node = state.map?.[action.payload.nodeId]
      if(!node)return
      node.name = action.payload.newName
      if(node.parentId!==null)return
      if (node.type==="file") {
        state.fileRoot = state.fileRoot?.map((item)=>{
          if(item.id===node.id){
            return {...item,name:action.payload.newName}
          }
          return item
        })
      }else{
        state.folderRoot = state.folderRoot?.map((item)=>{
          if(item.id===node.id){
            return {...item,name:action.payload.newName}
          }
          return item
        })
      }
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
  renameNode,
  addFileNode,
  setNewProjectFiles,
} = fileNodeSlice.actions;
