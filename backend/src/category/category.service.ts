import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './Schemas/category.schema';
import { Recipe } from '../recipes/Schemas/recipe.schema'; 

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private catModel: Model<Category>,
    @InjectModel('Recipe') private recipeModel: Model<any>, 
  ) {}

  findAll() {
    return this.catModel.find().exec();
  }

  create(name: string, imageUrl: string) {
    return new this.catModel({ name, imageUrl }).save();
  }

  async update(id: string, name: string, imageUrl?: string) {
    const updateData: any = { name };
    if (imageUrl) updateData.imageUrl = imageUrl;
    return this.catModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string) {
    const category = await this.catModel.findById(id);
    if (!category) {
      throw new BadRequestException("Catégorie non trouvée.");
    }
    const recipesUsingIt = await this.recipeModel.findOne({ category: category.name });
    if (recipesUsingIt) {
      throw new BadRequestException("Impossible de supprimer : des recettes sont liées à cette catégorie.");
    }
    
    return this.catModel.findByIdAndDelete(id);
  }
}