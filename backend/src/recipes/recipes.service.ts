import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from './Schemas/recipe.schema';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
  ) {}

  async create(recipeData: any): Promise<Recipe> {
    const newRecipe = new this.recipeModel(recipeData);
    return newRecipe.save();
  }

  async findAll(): Promise<Recipe[]> {
    return this.recipeModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByCategory(category: string): Promise<Recipe[]> {
    return this.recipeModel.find({ category }).exec();
  }

  async findOne(id: string): Promise<Recipe> {
    const recipe = await this.recipeModel.findById(id).exec();
    if (!recipe) throw new NotFoundException(`La recette avec l'id ${id} n'existe pas`);
    return recipe;
  }

  async update(id: string, updateData: any): Promise<Recipe> {
    const updatedRecipe = await this.recipeModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedRecipe) {
      throw new NotFoundException(`La recette avec l'id ${id} n'existe pas`);
    }

    return updatedRecipe;
  }

  async delete(id: string): Promise<any> {
    return this.recipeModel.findByIdAndDelete(id).exec();
  }
 
async findLatest(): Promise<Recipe | null> {
  return this.recipeModel.findOne().sort({ createdAt: -1 }).exec();
}
}