import { db } from "../../db/db";

export const createMessage = async(message: any) => {
    try {
        let res;
        const { chatType, chatId, id, content, senderId,createdAt, updatedAt } = message;
        if(!chatType || !chatId || !id || !content || !createdAt || !updatedAt){
            throw new Error("Missing parameters");
        }
        if(chatType === "direct"){
          res=  db.message.create({
                data:{
                    id,
                    content,
                    senderId:senderId,
                    dmChatRoomId:chatId,
                    createdAt,
                    updatedAt,
                }
            })
        }else{
          res=  db.message.create({
                data:{
                    id,
                    content,
                    senderId:senderId,
                    teamId:chatId,
                    createdAt,
                    updatedAt,
                }
            })
        }
        if(!res){
            throw new Error("Failed to create message");
        }
        return res;
    } catch (error) {
        throw error;
    }
}
