import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Rec  {
  id: string
  title: string
  description: string | null
  framework: string
  type: string
}

const initialState:Rec[] = [{
    id: "",
    title: "",
    description: null ,
    framework: "",
    type: "",
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
