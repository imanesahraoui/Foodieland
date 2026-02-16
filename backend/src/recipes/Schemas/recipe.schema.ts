import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type RecipeDocument = Recipe & Document;

export class InstructionStep {
  title: string;
  description: string;
  stepImage?: string; 
}

export class Nutrition {
  name: string; 
  quantity: string; 
}

@Schema({ timestamps: true }) 
export class Recipe extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  
  @Prop({ type: [{ title: String, description: String, stepImage: String }] })
  instructions: InstructionStep[];

  @Prop()
  cookingTime: number;

  @Prop()
  preparationTime: number;

  @Prop()
  imageUrl: string;

  @Prop({ required: true })
  category: string; 

  @Prop([String]) 
  ingredients: string[];

  @Prop({ type: [{ name: String, quantity: String }] })
  nutritions: Nutrition[];
 
  
  @Prop()
    CeatedAt : Date;
  
 // pour affichage dans recipe details 
  @Prop({ type: String, ref: 'Admin', required: true }) 
  createdBy: string;

  @Prop() 
  authorName: string;

  @Prop()
  authorAvatar: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);