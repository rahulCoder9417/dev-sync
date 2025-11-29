import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Rec  {
  id: string;
  title: string;
  description: string |null;
  framework: string;
  lastUpdated: string;
  type: "PUBLIC" | "PRIVATE" |"GENRATED";
  isStared?: boolean;
  isGitImport?: boolean;
  isArchived?: boolean;
  collaborators: Collaborator[];
}

interface Collaborator {
  id: string;
  fullName: string;
  email: string;
}

const initialState:Rec[] = [{
    id: "",
    title: "",
    description: null ,
    framework: "",
    type: "PUBLIC",
    collaborators: [],
    lastUpdated: "",
}];

const recentSlice = createSlice({
  name: "recentProjects",
  initialState,
  reducers: {
    setRecent(state, action: PayloadAction<Rec[]>) {
      return [ ...action.payload ];
    },
    clearRecent() {
      return [];
    },
  },
});

export const { setRecent, clearRecent } = recentSlice.actions;
export default recentSlice.reducer;
