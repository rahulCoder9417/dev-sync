import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import recentRedusers from "./features/recentProjects";

export const store = configureStore({
  reducer: {
    user: userReducer,
    recentProjects:recentRedusers
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
