import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

type UploadType = 'image' | 'video' | 'raw';

export interface UploadedAsset {
    public_id: string;
    resource_type: 'image' | 'video' | 'raw';
  }

interface UploadOptions {
  buffer: Uint8Array;
  filename: string;
  folder?: string;
  type: UploadType;
}

export function getPublicIdFromUrl(url: string) {
  try {
    // remove query params if any
    const cleanUrl = url.split("?")[0];

    const parts = cleanUrl!.split("/");
    const filename = parts.pop()!;           // rahul_avatar.jpg
    const folderPath = parts.slice(parts.indexOf("upload") + 1).join("/"); 
    const publicId = folderPath + "/" + filename.replace(/\.[^/.]+$/, ""); // remove extension

    return publicId;
  } catch (err) {
    return null;
  }
}

export async function uploadToCloudinary({
  buffer,
  filename,
  folder = '/',
  type,
  deleteBeforeUpload = null,
}: UploadOptions & { deleteBeforeUpload?: string | null }): 
Promise<{ success: boolean; secure_url?: string; public_id?: string; error?: string }> {
    
  return new Promise(async (resolve) => {
    try {
        
      // delete previous file if provided
      if (deleteBeforeUpload) {
        try {
          await cloudinary.uploader.destroy(getPublicIdFromUrl(deleteBeforeUpload)!);
        } catch (err) {
          console.error("Failed to delete previous Cloudinary file:", err);
        }
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: type,
          folder: "DevSync" + folder,
          public_id: filename,
          overwrite: true,
        },
        (err, result) => {
          if (err || !result) {
            return resolve({ success: false, error: err?.message || 'No result from Cloudinary' });
          }
          resolve({ success: true, secure_url: result.secure_url, public_id: result.public_id });
        }
      );

      uploadStream.end(buffer);
    } catch (error: any) {
      resolve({ success: false, error: error.message || String(error) });
    }
  });
}





export async function cleanupCloudinaryFiles(assets: UploadedAsset[]) {
  for (const asset of assets) {
    try {
      await cloudinary.uploader.destroy(asset.public_id, {
        resource_type: asset.resource_type,
      });
    } catch (err) {
      //  continue
    }
  }
}

