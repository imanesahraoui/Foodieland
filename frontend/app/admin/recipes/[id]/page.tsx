"use client";
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation'; 
import { Clock, Utensils, Printer, Share2, Loader2, ArrowLeft } from 'lucide-react'; 
import { recipeService } from '@/services/recipe.service';

export default function RecipeDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter(); 
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await recipeService.getById(id);
        setRecipe(data);
      } catch (error) {
        console.error("Failed to fetch recipe:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );
  
  if (!recipe) return <div className="p-20 text-center">Recipe not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back</span>
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-5xl font-bold mb-4">{recipe.title}</h1>
          <div className="flex items-center gap-6 text-gray-500 text-sm">
             <div className="flex items-center gap-2 border-r pr-6">
                <Clock size={18} /> {recipe.preparationTime } Min
             </div>
             <div className="flex items-center gap-2 border-r pr-6">
                <Utensils size={18} /> {recipe.cookingTime } Min
             </div>
             <div className="flex items-center gap-2 uppercase tracking-widest font-bold text-black">
                {recipe.category}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          
          {recipe.imageUrl && (
            <img src={recipe.imageUrl} className="w-full h-[500px] object-cover rounded-[30px] shadow-sm mb-10" alt={recipe.title}/>
          )}
          <p className="text-gray-500 leading-relaxed mb-12">{recipe.description}</p>

          <h2 className="text-3xl font-bold mb-8">Ingredients</h2>
          <div className="space-y-6 mb-12">
            {recipe.ingredients?.map((ing: string, i: number) => (
              <div key={i} className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <span className="text-lg text-gray-700">{ing}</span>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold mb-8">Directions</h2>
          <div className="space-y-10">
            {recipe.instructions?.map((step: any, i: number) => (
              <div key={i} className="space-y-4">
                <h4 className="text-xl font-bold mb-3">{i + 1}. {step.title}</h4>
                <p className="text-gray-500 leading-relaxed mb-6">{step.description}</p>
                {step.stepImage && <img src={step.stepImage} className="w-full h-auto rounded-2xl mb-6 shadow-sm" alt="" />}
                <div className="h-[1px] bg-gray-100 w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#E7FAFE] p-8 rounded-[30px] sticky top-10">
            <h3 className="text-2xl font-bold mb-6">Nutrition Information</h3>
            <div className="space-y-4">
              {recipe.nutritions?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between border-b border-blue-100 pb-3 text-gray-600">
                  <span>{item.name}</span>
                  <span className="text-black font-bold">{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}