import { Controller, Get ,Post, Delete ,Param ,Patch ,Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoriesService } from './category.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly cloudinaryService: CloudinaryService,
) {}

  @Get()
  getAll() {
    return this.categoriesService.findAll();
  }

  
  @Post()
  @UseInterceptors(FileInterceptor('file')) 
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
  ) {
    
    const upload = await this.cloudinaryService.uploadFile(file);
    
    
    return this.categoriesService.create(name, upload.url);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
  ) {
    let imageUrl;
    if (file) {
      const upload = await this.cloudinaryService.uploadFile(file);
      imageUrl = upload.url;
    }
    return this.categoriesService.update(id, name, imageUrl);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}