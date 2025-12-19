import { RawData } from "ws";
import {  BaseWsHandler } from "./baseWsHandler.js";
import RoomManager from "../utils/roomManagerChat.js";
import getFriends from "../lib/action/user/getFriends.js";
import { createMessage, updateRead } from "../lib/action/chat/message.js";
import { createNotification } from "../lib/action/chat/notification.js";
import { ExtWebSocket } from "../types/ws.js";
import { ChatClientMessage } from "../types/chatRoomManager.js";


export class ChatWsHandler extends BaseWsHandler {
  private messageHistory: Map<string, any[]> = new Map();
  private room: RoomManager;

  // key = roomId, value = array of messages
  // the global have all online people ,onload of website the user would make room on client side with his friends and that data would be sent to other friends to let them know their friend is online which is stored in the state(rtk store)
  // for team there are two things
  // 1. team in team section would make a room of those and send status update
  // 2, the project team already have participents 
  constructor() {
    super('/ws/chat');
    this.room = new RoomManager();
  }

  protected async handleDisconnect(ws: ExtWebSocket) {
    const roomsToRemove = Array.from(ws.rooms ?? []);
    for (const room of roomsToRemove) {
      this.room.removeFromRoom(room, ws);
    }
    this.room.removeFromGlobalUserList(ws);
    const friends = await getFriends(ws.userId)
    friends.forEach((friend)=>{
      this.room.users.get(friend)?.send(JSON.stringify({
        type:"user_offline",
        userId:ws.userId
      }))
    })
  }

  protected  async sendGlobalUserList(ws: ExtWebSocket){
    this.room.addToGlobalUserList(ws);
    const friends = await getFriends(ws.userId)
    friends.forEach((friend)=>{
      let friendWs = this.room.users.get(friend)
      if(!friendWs || friendWs.readyState !== WebSocket.OPEN) return
      friendWs.send(JSON.stringify({
        type:"user_online",
        userId:ws.userId
      }))
      ws.send(JSON.stringify({
        type:"user_online",
        userId:friend
      }))
    })
  }

  protected async handleMessage(ws: ExtWebSocket, data: RawData) {
    let parsed: ChatClientMessage;
    try {
      parsed = JSON.parse(data.toString());
    } catch (err) {
      const error = err as Error;
      ws.send(JSON.stringify({ error: "invalid_json", message: error.message }));
      return;
    }

    if (!parsed || typeof parsed !== "object" || !("action" in parsed)) {
      ws.send(JSON.stringify({ error: "invalid_message" }));
      return;
    }

    try {
      switch (parsed.action) {
      
        case 'send_message':
          await this.handleSendMessage(ws, parsed );
          break;
        case "deleteMessage":
          await this.handleDeleteMessage(ws, parsed );
          break;
        case 'join':
          await this.handleJoinRoom(ws, parsed );
          break;
        case 'leave':
          await this.handleLeaveRoom(ws, parsed );
          break;
        case 'read':
          await this.handleReadMessage(ws, parsed );
          break;
        case 'typingStart':
          await this.handleTypingStart(ws, parsed );
          break;
        case 'typingEnd':
          await this.handleTypingEnd(ws, parsed );
          break;
        default:
          ws.send(JSON.stringify({ error: "unknown_action" }));
      }
    } catch (error) {
      const err = error as Error;
      console.error('Error handling chat message:', err);
      ws.send(JSON.stringify({ 
        error: "internal_error", 
        message: err.message || 'An unknown error occurred' 
      }));
    }
  }

  private async handleJoinRoom(ws: ExtWebSocket, message: any) {
    if(message.action !== "join") return
    const { chatId,chatType } = message;
    this.room.addToRoom(chatId, ws,true);
    if(chatType === "team"){
      this.room.getRoomUsers(chatId).forEach((user)=>{
        user.send(JSON.stringify({
          type:"userOnlineTeam",
          userId:user.userId
        }))
      })
    }
    
  }

  private async handleTypingStart(ws: ExtWebSocket, message: any) {
    if(message.action !== "typingStart") return
    const { chatId, } = message;
    console.log(chatId)
    this.room.addToTypingStatus(chatId, ws);
  }

  private async handleTypingEnd(ws: ExtWebSocket, message: any) {
    if(message.action !== "typingEnd") return
    const { chatId } = message;
    this.room.removeFromTypingStatus(chatId, ws);
  }

  private async handleDeleteMessage(ws: ExtWebSocket, message: any) {
    if(message.action !== "deleteMessage") return
    const { chatId,messageId,chatType } = message;
    this.room.broadcastToRoom(chatId,{
      type:"deleteMessage",
      chatId,
      messageId,
      chatType
    },ws)
  }

  private handleLeaveRoom(ws: ExtWebSocket, message: any) {
    const { chatId,chatType } = message;
    this.room.removeFromRoom(chatId, ws,true);
  }

  private async handleReadMessage(ws: ExtWebSocket, message: ChatClientMessage) {
    if(message.action !== "read") return
    const { chatId, reciverId } = message;
    if (!chatId || !reciverId) {
      ws.send(JSON.stringify({ error: "missing_parameters" }));
      return;
    }
    if(this.room.users.has(reciverId)){
      this.room.users.get(reciverId)?.send(JSON.stringify({
        type:"chatRead",
        chatId,
        userId:reciverId
      }))
    }
  }
  private async handleSendMessage(ws: ExtWebSocket, message: ChatClientMessage) {
    if(message.action !== "send_message") return
    const { chatType, chatId, id, content, createdAt, updatedAt,reciverId } = message;
    if (!chatId || !content || !id || !chatType) {
      ws.send(JSON.stringify({ error: "missing_parameters" }));
      return;
    }
    let isRead = false
    let res =await createMessage({
      chatType,
      chatId,
      id,
      content,
      senderId:ws.userId,
      createdAt:new Date(createdAt),
      updatedAt:new Date(updatedAt),
       isRead,
    })  
    if(chatType === "direct"){
      if(this.room.chatRooms.get(chatId)?.size ===2){
        isRead = true
        ws.send(JSON.stringify({
          type:"chatRead",
          chatId,
          userId:ws.userId
        }))
        this.room.broadcastToRoom(chatId,{
          type:"chatMessage",
          id,
          content,
          createdAt,
          chatType,
          isRead:true,
          chatId,
          updatedAt,
          user:{
            userId:ws.userId,
            username:ws.username,
            fullName:ws.fullName,
            avatar:ws.avatar,
          }
        },ws)
        await updateRead(id)
      }else if(this.room.users.has(reciverId)){
        this.room.users.get(reciverId)?.send(JSON.stringify({
          type:"chatToast",
          content,
          createdAt,
          updatedAt,
          chatId,
          id,
          chatType,
          isRead:false,
          user:{
            userId:ws.userId,
            username:ws.username,
            fullName:ws.fullName,
            avatar:ws.avatar,
          }
        }))
      }else{
       await createNotification(ws.userId,reciverId,content,"MESSAGE",id)
      }
    }else{

      this.room.broadcastToRoom(chatId,{
        type:"chatMessage",
        id,
        content,
        createdAt,
        chatType,
        chatId,
        updatedAt,
        user:{
          userId:ws.userId,
          username:ws.username,
          fullName:ws.fullName,
          avatar:ws.avatar,
        }
      },ws)
    }
   
    if(!res){
      ws.send(JSON.stringify({ error: "failedToCreateMessaage" }));
      return;
    }
  }
}

