import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PresenceState {
  projects: Record<string, Record<string , {userId:string,fullName:string,avatar:string}[]>>;
}

const initialState: PresenceState = {
  projects: {},
};

interface UpdatePresencePayload {
  projectId: string;
  avatar: string;
  fullName: string;
  fileId: string;
  userId: string;
  action: "join" | "leave";
}

const presenceSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    updatePresence: (state, action: PayloadAction<UpdatePresencePayload>) => {
      const { projectId, fileId, userId, avatar,fullName,action: userAction } = action.payload;
      if(fileId === "" || !fileId)return
      if (!state.projects[projectId]) {
        state.projects[projectId] = {};
      }

      if (!state.projects[projectId][fileId]) {
        state.projects[projectId][fileId] = [];
      }

      let users = state.projects[projectId][fileId];

      if (userAction === "join") {
        if (!users.some(user => user.userId === userId)) {
          users.push({userId,fullName,avatar});
        }
      } else if (userAction === "leave") {

        users = users.filter((user) => user.userId !== userId);
        if (users.length === 0) {
            delete state.projects[projectId][fileId];
          } else {
            state.projects[projectId][fileId] = users;
          }
      }
    },
    changeAdmin: (state, action) => {
      const { projectId, fileId, userId } = action.payload;
      const arr = state.projects[projectId][fileId];
    
      if (!arr) return;
    
      const idx = arr.findIndex(user => user.userId === userId);
      if (idx === -1) return;
    
      const [userObj] = arr.splice(idx, 1);
    
      arr.unshift(userObj);
    }
    
  },
});

export const { updatePresence,changeAdmin } = presenceSlice.actions;
export default presenceSlice.reducer;
