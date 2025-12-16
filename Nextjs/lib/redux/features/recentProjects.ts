import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecentProject } from "@/lib/types/projects";

type RecentProjectsState = RecentProject[];

const initialState: RecentProjectsState = [];

const recentProjectsSlice = createSlice({
  name: "recentProjects",
  initialState,
  reducers: {
    setRecentProjects(_, action: PayloadAction<RecentProject[]>) {
      return action.payload;
    },
    clearRecentProjects() {
      return [];
    },
  },
});

export const { setRecentProjects, clearRecentProjects } =
  recentProjectsSlice.actions;

export default recentProjectsSlice.reducer;
