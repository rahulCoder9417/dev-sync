import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import recentRedusers from "./features/recentProjects";
import collabCodeUserReducer from "./features/collabCodeUserState";
import collabCodeFileOpReducer from "./features/collabCodeFileOp";
import ChatSlice from "./features/chatPopUpSlice";
import collabCodeEditorUpdateReducer from "./features/collabCodeEditorUpdate";
export const store = configureStore({
  reducer: {
    user: userReducer,
    chat:ChatSlice,
    recentProjects:recentRedusers,
    collabCodeEditorUpdate:collabCodeEditorUpdateReducer,
    collabCodeUser:collabCodeUserReducer,
    collabCodeFileOp:collabCodeFileOpReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
