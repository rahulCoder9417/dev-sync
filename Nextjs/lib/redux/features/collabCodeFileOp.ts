import { FileNodeWithChildrenAndMeta } from "@/lib/types/types";
import { FileNode } from "@/lib/types/usCollabPayload";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface PresenceState {
    projects: Record<
      string, 
      { type: string; name?: string; newNode?: FileNodeWithChildrenAndMeta; id: string ,content?:string }[]
    >;
    fileSaveProjects:Record<string,{projectId:string,fileId:string,content:string}[]>;
  }

const initialState: PresenceState = {
  projects: {},
  fileSaveProjects:{

  }
};

interface UpdateFileOpPayload {
    type:string,name?:string,newNode?:FileNodeWithChildrenAndMeta,id:string
    projectId:string
    content?:string
    }
const fileOpSlice = createSlice({
  name: "fileOp",
  initialState,
  reducers: {
    addFileOp: (state, action: PayloadAction<UpdateFileOpPayload>) => {
      const { type, name, id, newNode, projectId,content } = action.payload;
      if (!state.projects[projectId]) state.projects[projectId] = [];

      switch (type) {
        case "rename":
          state.projects[projectId].push({ type, name, id });
          break;
        case "create":
          state.projects[projectId].push({ type, id, newNode });
          break;
        case "save":
          state.projects[projectId].push({ type, id,content });
          break;
        case "delete":
          state.projects[projectId].push({ type, id });
          break;
      }
    },
    consumeFileOp: (
  state,
  action: PayloadAction<{ projectId: string }>
) => {
  if (state.projects[action.payload.projectId]?.length) {
    state.projects[action.payload.projectId].shift(); // just remove it
  }
},
    clearProjectOps: (state, action: PayloadAction<{ projectId: string }>) => {
      state.projects[action.payload.projectId] = [];
    },

    addSaveFileOp: (state, action: PayloadAction<{ projectId: string,fileId:string,content:string }>) => {
      const { projectId,fileId,content } = action.payload;
      if (!state.fileSaveProjects[projectId]) state.fileSaveProjects[projectId] = [];
      state.fileSaveProjects[projectId].push({ projectId,fileId,content });
    },

    consumeSaveFileOp: (
      state,
      action: PayloadAction<{ projectId: string }>
    ) => {
      if (state.fileSaveProjects[action.payload.projectId]?.length) {
        state.fileSaveProjects[action.payload.projectId].shift(); // just remove it
      }
    },
    clearSaveFileOp: (state, action: PayloadAction<{ projectId: string }>) => {
      state.fileSaveProjects[action.payload.projectId] = [];
    },
  },
});

export const { addFileOp ,consumeFileOp,clearProjectOps,addSaveFileOp,consumeSaveFileOp,clearSaveFileOp} = fileOpSlice.actions;
export default fileOpSlice.reducer;
