import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesController } from './category.controller';
import { CategoriesService } from './category.service';
import { Category, CategorySchema } from './Schemas/category.schema';
import { Recipe, RecipeSchema } from '../recipes/Schemas/recipe.schema'; 
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: 'Recipe', schema: RecipeSchema } 
    ]),
    CloudinaryModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService]
})
export class CategoriesModule {}