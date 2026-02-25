import { FileNodeWithChildrenAndMeta } from "@/lib/types/types";
import { addFileOp } from "../features/collabCodeFileOp";
import { AppDispatch, RootState } from "../store";

export const createNodeWithAncestors =
  (payload:{type: "create",
        name: string,
        id: string,
        newNode: FileNodeWithChildrenAndMeta,
        projectId: string}) =>
  (dispatch: AppDispatch, getState: () => RootState) => {

    const state = getState();
    const map = state.projectFile.map;

    const parent = map?.[payload.id];
    const ancestorIds = parent
      ? [...(parent.ancestorIds ?? []), parent.id]
      : [];

    dispatch(addFileOp({
      ...payload,
      newNode:{...payload.newNode!,ancestorIds}
    }));
  };