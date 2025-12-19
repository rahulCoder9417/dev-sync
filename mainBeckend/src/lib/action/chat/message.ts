import { db } from "../../db/db";

export const createMessage = async(message: any) => {
    try {
        let res;
        const { chatType, chatId, id, content, senderId,createdAt, updatedAt,isRead } = message;
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
                    isRead
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

export const updateRead = async(messageId:string) => {
    try {
        const res  = await db.message.update({
            where:{
                id:messageId
            },
            data:{
                isRead:true
            }
        })
        if (!res) {
            throw new Error("Failed to update message");
        }
        return ("message readUpdated")
        return res;
    } catch (error) {
        throw error;
    }
}
