import { NotificationType } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "@/lib/types/notification";
import { UserState } from "@/lib/types/user";

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
}
type SetUserPayload = Omit<
  UserState,
  'isAuthenticated' | 'notifications'
>;

type UpdateUserInfoPayload = {
  fullName: string;
  bio: string;
  avatar: string | null;
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<SetUserPayload>) {
      Object.assign(state, action.payload);
      state.isAuthenticated = true;
    },

    clearUser() {
      return initialState;
    },

    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },

    updateUserInfo(state, action: PayloadAction<UpdateUserInfoPayload>) {
      state.fullName = action.payload.fullName;
      state.bio = action.payload.bio;

      if (action.payload.avatar !== null) {
        state.avatar = action.payload.avatar;
      }
    },
  },
});

export const { setUser, clearUser,removeNotification,updateUserInfo } = userSlice.actions;
export default userSlice.reducer;
