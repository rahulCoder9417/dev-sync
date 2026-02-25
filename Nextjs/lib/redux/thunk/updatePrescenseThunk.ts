import { AppDispatch, RootState } from "../store";
import { updatePresence } from "../features/collabCodeUserState";

export const updatePresenceWithAncestors =
  (payload: {
    projectId: string;
    fileId: string;
    userId: string;
    fullName: string;
    avatar: string;
    action: "join" | "leave";
  }) =>
  (dispatch: AppDispatch, getState: () => RootState) => {

    const state = getState();

    const node = state.projectFile.map?.[payload.fileId];
    if (!node) return;

    const ancestorIds = node.ancestorIds ?? [];

    dispatch(
      updatePresence({
        ...payload,
        ancestorId: ancestorIds,
      })
    );
  };