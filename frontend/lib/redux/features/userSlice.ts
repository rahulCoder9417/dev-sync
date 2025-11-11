import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification{
  id:string;
  createdAt:string;
  content:string;
  sender:{
    id:string;
    fullName:string;
    avatar:string;
    username:string;
  }
}
interface UserState {
  fullName: string;
  email: string;
  username: string;
  id:string;
  githubUrl:string| null;
  avatar:string;
  isAuthenticated: boolean;
  notifications:Notification[];
}

const initialState: UserState = {
  fullName: "",
  email: "",
  id:"",
  githubUrl:null,
  username: "",
  avatar:"",
  isAuthenticated: false,
  notifications:[]
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return { ...action.payload, isAuthenticated: true };
    },
    clearUser() {
      return { fullName: "",avatar:"", email: "", username: "",githubUrl:null,id:"", isAuthenticated: false,notifications:[] };
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
    },
  },
});

export const { setUser, clearUser,removeNotification } = userSlice.actions;
export default userSlice.reducer;
