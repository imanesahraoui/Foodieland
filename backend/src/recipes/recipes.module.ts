import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { Recipe, RecipeSchema } from './Schemas/recipe.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
    CloudinaryModule,
  ],
  providers: [RecipesService],
  controllers: [RecipesController]
})
export class RecipesModule {}
