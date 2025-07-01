import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  fullName: string;
  email: string;
  username: string;
  id:string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  fullName: "",
  email: "",
  id:"",
  username: "",
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
      return { fullName: "", email: "", username: "",id:"", isAuthenticated: false };
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
