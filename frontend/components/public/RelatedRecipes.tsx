"use client";
import { useEffect, useState } from 'react';
import { recipeService } from '@/services/recipe.service';
import Link from 'next/link';

interface RelatedRecipesProps {
  category: string;
  currentRecipeId: string;
}

export default function RelatedRecipes({ category, currentRecipeId }: RelatedRecipesProps) {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const data = await recipeService.getAll(category);
        const filtered = data
          .filter((r: any) => r._id !== currentRecipeId)
          .slice(0, 3); 

        setRecipes(filtered);
      } catch (error) {
        console.error("Erreur chargement suggestions", error);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchRelated();
    }
  }, [category, currentRecipeId]);

  if (loading) return <div className="animate-pulse h-40 bg-gray-100 rounded-xl"></div>;
  if (recipes.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold mb-6 text-black">Other Recipe</h3>
      <div className="space-y-6">
        {recipes.map((recipe) => {
          const imageUrl = recipe.imageUrl;

           return (
            <Link key={recipe._id} href={`/recipes/${recipe._id}`} className="flex gap-4 items-center group cursor-pointer">
              
              <div className="w-[120px] h-[80px] rounded-[20px] overflow-hidden bg-gray-100 shrink-0">
                <img 
                  src={imageUrl} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
              <div className="flex flex-col">
                <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-[#FF7426] transition line-clamp-2">
                  {recipe.title}
                </h4>
                <span className="text-xs text-gray-500 font-medium">
                  By {recipe.authorName || "Foodieland"}
                </span>
              </div>
            </Link>
           );
        })}
      </div>
    </div>
  );
}