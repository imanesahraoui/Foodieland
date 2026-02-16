"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react'; 
import { recipeService } from '@/services/recipe.service';
import RecipeCard from '@/components/public/RecipeCard'; 
import { ArrowLeft } from 'lucide-react';

import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';


function RecipesList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get('category'); 
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const data = await recipeService.getAll(category);
        setRecipes(data);
        console.log(`Recettes trouvées pour ${category}:`, data.length);
      } catch (error) {
        console.error("Erreur de chargement :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [category]);

  return (
    <main className="flex-1">
      <div className="container mx-auto px-6 py-12">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-black mb-4">
            {category ? `${category} Recipes` : 'All Recipes'}
          </h1>
          <p className="text-gray-500">
            Check out our delicious selection of {category ? category.toLowerCase() : 'our'} dishes.
          </p>
        </div>

        {loading ? (
           <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
           </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {recipes.map((recipe) => (
               <RecipeCard 
                 key={recipe._id}
                 id={recipe._id}
                 title={recipe.title}
                 image={recipe.imageUrl}
                 time={(recipe.cookingTime || 0) + (recipe.preparationTime || 0)}
                 category={recipe.category}
               />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[30px]">
            <p className="text-gray-400 font-medium">
              No recipes found in category "{category}".
            </p>
          </div>
        )}
      </div>
    </main>
  );
}


export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <Suspense fallback={
        <div className="flex justify-center py-20 flex-1">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      }>
        <RecipesList />
      </Suspense>

      <Footer />
    </div>
  );
}