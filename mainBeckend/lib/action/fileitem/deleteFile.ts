import { db } from "../../db/db";

export async function deleteFileOrFolder(fileId: string,userId:string) {
  try {
   
    const existingItem = await db.fileItem.findFirst({
        where: {
          id:fileId,
          project: {
            team: {
              members: {
                some: {
                  userId: userId
                }
              }
            }
          }
        },
        select: {
          id:true,
          type:true,
          parentId:true,
          project: {
            select: { id: true }
          }
        },    })
  
      if (!existingItem) {
        return ({
            success:false,
          message: 'File item not found or access denied' ,
           status: 404 
        })
      }
  
      // Recursive function to delete all children
      async function deleteItemAndChildren(itemId: string): Promise<void> {
        // Get all children of this item
        const children = await db.fileItem.findMany({
          where: { parentId: itemId },
          select: { id: true }
        })
  
        // Recursively delete all children first
        for (const child of children) {
          await deleteItemAndChildren(child.id)
        }
  
        // Delete the item itself
        await db.fileItem.delete({
          where: { id: itemId }
        })
      }
  
      if(existingItem.type==="file"){
        const res = await db.fileItem.deleteMany({
          where: { id: fileId }
        })
        if(!res){
          return ({
            success:false,
          message: 'File item cant be deleted' ,
           status: 404 
          })
        }
      }else{
      // Start the recursive deletion
      await deleteItemAndChildren(fileId)
      }
    return {
        success:true,
      message: 'File item deleted successfully' ,
       status: 200 
    };
  } catch (error) {
    return {
        success:false,
      message: 'File item cant be deleted' ,
       status: 404 
    };
  }
}