import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification{
  id:string;
  createdAt:string;
  content:string;
  type:string;
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
  bio:string;
  avatar:string;
  isAuthenticated: boolean;
  notifications:Notification[];
}

const initialState: UserState = {
  fullName: "",
  email: "",
  id:"",
  githubUrl:null,
  bio:"",
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
      return { fullName: "",avatar:"", email: "", username: "",githubUrl:null,id:"",bio:"", isAuthenticated: false,notifications:[] };
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
    },
    updateUserInfo(state, action: PayloadAction<{fullName:string,bio:string,avatar:string | null}>) {
      return { ...state, ...action.payload,avatar:action.payload.avatar || state.avatar };
    },
  },
});

export const { setUser, clearUser,removeNotification,updateUserInfo } = userSlice.actions;
export default userSlice.reducer;
