import { FileNode } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface PresenceState {
    projects: Record<
      string, 
      { type: string; name?: string; newNode?: FileNode; id: string }[]
    >;
  }

const initialState: PresenceState = {
  projects: {},
};

interface UpdateFileOpPayload {
    type:string,name?:string,newNode?:FileNode,id:string
    projectId:string
}
const fileOpSlice = createSlice({
  name: "fileOp",
  initialState,
  reducers: {
    addFileOp: (state, action: PayloadAction<UpdateFileOpPayload>) => {
      const { type, name, id, newNode, projectId } = action.payload;
      if (!state.projects[projectId]) state.projects[projectId] = [];

      switch (type) {
        case "rename":
          state.projects[projectId].push({ type, name, id });
          break;
        case "create":
          state.projects[projectId].push({ type, id, newNode });
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
  },
});

export const { addFileOp ,consumeFileOp,clearProjectOps} = fileOpSlice.actions;
export default fileOpSlice.reducer;
