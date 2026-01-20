import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TerminalType = "server" | "client" | "browser";

interface TerminalOptionState {
  terminalOptions: Record<string, TerminalType>;
}

const initialState: TerminalOptionState = {
  terminalOptions: {},
};

const terminalOptionsSlice = createSlice({
  name: "terminalOptions",
  initialState,
  reducers: {
    setTerminalOptions(
      state,
      action: PayloadAction<{ id: string; terminalOption: TerminalType }>
    ) {
      state.terminalOptions[action.payload.id] =
        action.payload.terminalOption;
    },
  },
});

export const { setTerminalOptions } = terminalOptionsSlice.actions;
export default terminalOptionsSlice.reducer;
