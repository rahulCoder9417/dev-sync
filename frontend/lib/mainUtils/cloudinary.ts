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

export async function uploadToCloudinary({
  buffer,
  filename,
  folder = '/',
  type,
}: UploadOptions): Promise<{ success: boolean; secure_url?: string; public_id?: string; error?: string }> {
  return new Promise((resolve) => {
    try {
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
      uploadStream.on('error', (err) => {
        resolve({ success: false, error: err.message || 'Cloudinary stream error' });
      });
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

