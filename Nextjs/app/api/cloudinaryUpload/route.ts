import { UploadOptions, uploadToCloudinary, UploadType } from "@/lib/mainUtils/cloudinary";
import { NextResponse } from "next/server";
export async function POST(req:Request
) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
      
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadRes = await uploadToCloudinary({
            buffer:buffer  ,
            filename:formData.get("filename") as string,
            folder: "/projects/" + formData.get("projectId") as string ,
            type: formData.get("resourceType") as UploadType,
          });
          if(!uploadRes.success){
            return NextResponse.json({success:false,error:uploadRes.error})
          }
        return NextResponse.json({success:true,data:uploadRes.secure_url});
    } catch (error) {
        return NextResponse.json({success:false,error:error})
    }
    
}