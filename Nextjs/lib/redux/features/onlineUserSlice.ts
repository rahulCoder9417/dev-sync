import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OnlineUserState {
  onlineUsers: string[]; // Array of user IDs who are online
}

const initialState: OnlineUserState = {
  onlineUsers: [],
};

const onlineUserSlice = createSlice({
  name: "onlineUser",
  initialState,
  reducers: {
    addOnlineUser(state, action: PayloadAction<string>) {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser(state, action: PayloadAction<string>) {
      state.onlineUsers = state.onlineUsers.filter((id) => id !== action.payload);
    },
    setOnlineUsers(state, action: PayloadAction<string[]>) {
      state.onlineUsers = action.payload;
    },
    clearOnlineUsers(state) {
      state.onlineUsers = [];
    },
  },
});

export const { addOnlineUser, removeOnlineUser, setOnlineUsers, clearOnlineUsers } = onlineUserSlice.actions;
export default onlineUserSlice.reducer;
