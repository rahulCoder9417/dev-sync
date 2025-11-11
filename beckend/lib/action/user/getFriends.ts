import { db } from "../../db/db"

export default async function getFriends(userId: string) {
    const friends = await db.friendship.findMany({
        select:{
            initiatorId:true,
            receiverId:true
        },
        where:{
            OR:[
                {
                    initiatorId:userId
                },
                {
                    receiverId:userId
                }
            ],
            status:"accepted"
        }

    })
    return friends.map((friend)=>{
        return friend.initiatorId === userId ? friend.receiverId : friend.initiatorId
    })
}
