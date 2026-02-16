
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
export interface UploadedFile {
  url: string;
  publicId: string;
}
@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<UploadedFile> {
    return new Promise<UploadedFile>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          timeout: 120000,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) {
            return reject(
              new Error('Cloudinary upload failed: No result returned'),
            );
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
