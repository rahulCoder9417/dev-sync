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
}: UploadOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: type,
          folder: "DevSync" + folder,
          public_id: filename,
          overwrite: true,
        },
        (err, result) => {
          if (err || !result) return reject(err || new Error('No result from Cloudinary'));
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      // Catch stream pipe errors
      uploadStream.on('error', (streamErr) => {
        reject(new Error(`Stream error: ${streamErr.message}`));
      });

      uploadStream.end(buffer);
    } catch (error :any) {
      reject(new Error(`Upload crashed: ${error.message || String(error) }`));
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

