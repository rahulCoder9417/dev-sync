import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface PresenceState {
    isOpen:boolean
    selectedChat:{
        type: 'team' | 'direct';
        id: string;
        name: string    
    } |  null
  }

const initialState: PresenceState = {
  isOpen:false,
  selectedChat:null
};

interface UpdateChatPopUpPayload {
    isOpen:boolean,
    selectedChat:{
        type: 'team' | 'direct';
        id: string;
        name: string    
    } |  null
    }
const ChatSlice = createSlice({
  name: "chatPopUp",
  initialState,
  reducers: {
    updateChatPopUp: (state, action: PayloadAction<UpdateChatPopUpPayload>) => {
      const { isOpen, selectedChat } = action.payload;
      state.isOpen = isOpen;
      state.selectedChat = selectedChat;
    },
    
    
}})
export const { updateChatPopUp } = ChatSlice.actions;
export default ChatSlice.reducer;
