import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  fullName: string;
  email: string;
  username: string;
  id:string;
  githubUrl:string| null;
  avatar:string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  fullName: "",
  email: "",
  id:"",
  githubUrl:null,
  username: "",
  avatar:"",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return { ...action.payload, isAuthenticated: true };
    },
    clearUser() {
      return { fullName: "",avatar:"", email: "", username: "",githubUrl:null,id:"", isAuthenticated: false };
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
