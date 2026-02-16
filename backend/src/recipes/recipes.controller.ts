import { 
  Controller, Get, Post, Delete, Put ,Body, Param, Query, 
  UseInterceptors, UploadedFiles, BadRequestException ,Patch , UseGuards, Req
} from '@nestjs/common'; 
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { RecipesService } from './recipes.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(AnyFilesInterceptor())
async create(
  @UploadedFiles() files: Express.Multer.File[],
  @Body() body: any,
  @Req() req: any
) {
  const user = req.user; 
  const adminId = user.sub; 
  if (!files || files.length === 0) {
    throw new BadRequestException("No files uploaded");
  }
  const mainImageFile = files.find(f => f.fieldname === 'image');
  if (!mainImageFile) throw new BadRequestException("Main image is required");
  const mainUpload = await this.cloudinaryService.uploadFile(mainImageFile);
  let ingredients = typeof body.ingredients === 'string' ? JSON.parse(body.ingredients) : body.ingredients;
  let instructions = typeof body.instructions === 'string' ? JSON.parse(body.instructions) : body.instructions;
  let nutritions = typeof body.nutritions === 'string' ? JSON.parse(body.nutritions) : body.nutritions;
  if (instructions && Array.isArray(instructions)) {
    for (let i = 0; i < instructions.length; i++) {
      const stepFile = files.find(f => f.fieldname === `stepImage_${i}`);
      if (stepFile) {
        const stepUpload = await this.cloudinaryService.uploadFile(stepFile);
        instructions[i].stepImage = stepUpload.url; 
      }
    }
  }
  const recipeData = {
    ...body, 
    createdBy: user.sub, 
    authorName: user.fullName, 
    authorAvatar: user.profilePicture,
    imageUrl: mainUpload.url,
    ingredients,
    instructions,
    nutritions,
    cookingTime: Number(body.cookingTime),
    preparationTime: Number(body.preparationTime),
  };

  return this.recipesService.create(recipeData);
}

  


  @Get()
  findAll(@Query('category') category: string) {
    if (category) {
      return this.recipesService.findByCategory(category);
    }
    return this.recipesService.findAll();
  }

    @Get('latest') 
  async getLatestRecipe() {
    return this.recipesService.findLatest();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

@Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
  ) {
    let updateData = { ...body };
    const mainImageFile = files?.find(f => f.fieldname === 'image');
    if (mainImageFile) {
      const mainUpload = await this.cloudinaryService.uploadFile(mainImageFile);
      updateData.imageUrl = mainUpload.url;
    }
    if (body.ingredients) {
      updateData.ingredients = typeof body.ingredients === 'string' 
        ? JSON.parse(body.ingredients) 
        : body.ingredients;
    }
    
    if (body.instructions) {
      updateData.instructions = typeof body.instructions === 'string' 
        ? JSON.parse(body.instructions) 
        : body.instructions;
    }
    if (body.nutritions) {
        updateData.nutritions = typeof body.nutritions === 'string'
          ? JSON.parse(body.nutritions)
          : body.nutritions;
    }
    if (body.cookingTime) updateData.cookingTime = Number(body.cookingTime);
    if (body.preparationTime) updateData.preparationTime = Number(body.preparationTime);

    return this.recipesService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipesService.delete(id);
  }



}