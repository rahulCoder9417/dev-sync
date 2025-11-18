import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UpdateState {
  updates:Record<string,{type:string,data:any,stateDiff?:any}[]>;
}

const initialState: UpdateState = {
  updates: {},
};


const updateSlice = createSlice({
  name: "update",
  initialState,
  reducers: {
    updateCode: (state, action: PayloadAction<{type:string,data:any,fileId:string,stateDiff?:any}>) => {
      const { type,data,fileId,stateDiff } = action.payload;
      if(!state.updates[fileId]) state.updates[fileId] = [];
      state.updates[fileId].push({type,data,stateDiff})

        },
    consumeUpdate: (state, action: PayloadAction<{fileId:string}>) => {
      const { fileId } = action.payload;
      state.updates[fileId].shift()
    }
    
  },
});

export const { updateCode,consumeUpdate } = updateSlice.actions;
export default updateSlice.reducer;
