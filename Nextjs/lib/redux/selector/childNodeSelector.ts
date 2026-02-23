import { FileNodeWithChildren } from "@/lib/types/types";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const makeSelectNodesByIds = () => {
  let lastResult: FileNodeWithChildren[] = [];
  let lastIds: string[] = [];

  return createSelector(
    [
      (state: RootState) => state.projectFile.map ?? {},
      
      (_state: RootState, ids: string[]) => ids,
    ],
    (map, ids) => {
      if (ids !== lastIds) {
        lastIds = ids;
        lastResult = ids.map(id => map[id]).filter(Boolean);
        return lastResult;
      }

      let changed = false;
      const newResult = ids.map((id, index) => {
        const node = map[id];
        if (node !== lastResult[index]) {
          changed = true;
        }
        return node;
      });

      if (!changed) {
        return lastResult;
      }

      lastResult = newResult;
      return lastResult;
    }
  );
};