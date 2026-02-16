import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: (configService: ConfigService) => {
    const cloudName = configService.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = configService.get('CLOUDINARY_API_KEY');
    const apiSecret = configService.get('CLOUDINARY_API_SECRET');


    return cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  },
  inject: [ConfigService],
};
