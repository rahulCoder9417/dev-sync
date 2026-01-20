import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import recentRedusers from "./features/recentProjects";
import collabCodeUserReducer from "./features/collabCodeUserState";
import collabCodeFileOpReducer from "./features/collabCodeFileOp";
import chatPopUpReducer from "./features/chatPopUpSlice";
import chatReducer from "./features/chatSlice";
import collabCodeEditorUpdateReducer from "./features/collabCodeEditorUpdate";
import onlineUserReducer from "./features/onlineUserSlice";
import terminalOptionsReducer from "./features/terminalOptions";
export const store = configureStore({
  reducer: {
    terminalOptions: terminalOptionsReducer,
    user: userReducer,
    chatPopUp: chatPopUpReducer,
    chat: chatReducer,
    recentProjects:recentRedusers,
    collabCodeEditorUpdate:collabCodeEditorUpdateReducer,
    collabCodeUser:collabCodeUserReducer,
    collabCodeFileOp:collabCodeFileOpReducer,
    onlineUser:onlineUserReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
