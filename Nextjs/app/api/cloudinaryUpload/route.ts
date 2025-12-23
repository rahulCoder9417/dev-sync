import { uploadToCloudinary } from "@/lib/mainUtils/cloudinary";

export async function POST(req:Request
) {
    const body = await req.json();
    try {
        const uploadRes = await uploadToCloudinary({
            buffer:body.buffer,
            filename:body.filename,
            folder: "/projects/" + body.projectId,
            type: body.resourceType,
          });
        return {success:true,data:uploadRes.secure_url};
    } catch (error) {
        return {success:false,error:error}
    }
    
}