"use client";
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { recipeService } from '@/services/recipe.service';
import { Clock, Share, PlayCircle, Utensils, Check, ArrowLeft, X, Copy } from 'lucide-react'; 
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import RelatedRecipes from '@/components/public/RelatedRecipes';

export default function RecipeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await recipeService.getById(id);
        setRecipe(data);
      } catch (e) {
        console.error("Error", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const toggleIngredient = (index: number) => {
    setCheckedIngredients(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const copyToClipboard = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col">
       <Header />
       <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
       </div>
       <Footer />
    </div>
  );
  
  if (!recipe) return (
    <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 text-center py-20">Recipe not found</div>
        <Footer />
    </div>
  );

 const mainImageUrl = recipe.imageUrl;

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          
      
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Back 
          </button>
          <div className="mb-12">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-4xl md:text-[56px] font-bold text-black leading-tight max-w-4xl">
                {recipe.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-8 text-sm text-gray-500 border-b border-gray-100 pb-10">
                
                <div className="flex items-center gap-3 pl-2 pr-6 border-r border-gray-200">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                    <img 
                      src={recipe.authorAvatar  
                        
                      } 
                      alt="Chef" 
                      className="w-full h-full object-cover"
                    />
                  </div> 
                  <div className="flex flex-col">
                      <span className="font-bold text-black text-base">{recipe.authorName  
                     }</span>
                      <span className="text-gray-400 text-xs">
                        {new Date(recipe.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                  </div>
                </div>

             
                <div className="flex items-center gap-3 pr-6 border-r border-gray-200">
                  <Clock size={24} className="text-black"/> 
                  <div className="flex flex-col">
                      <span className="font-bold text-gray-400 text-xs uppercase tracking-wider">Prep Time</span>
                      <span className="text-gray-600 font-medium text-sm">{recipe.preparationTime 
                     } Minutes</span>
                  </div>
                </div>

               
                <div className="flex items-center gap-3 pr-6 border-r border-gray-200">
                  <Clock size={24} className="text-black"/> 
                  <div className="flex flex-col">
                      <span className="font-bold text-gray-400 text-xs uppercase tracking-wider">Cook Time</span>
                      <span className="text-gray-600 font-medium text-sm">{recipe.cookingTime 
                     } Minutes</span>
                  </div>
                </div>

               
                <div className="flex items-center gap-3">
                  <Utensils size={24} className="text-black"/> 
                  <div className="flex flex-col">
                      <span className="font-bold text-gray-400 text-xs uppercase tracking-wider">Category</span>
                      <span className="text-gray-600 font-medium text-sm">{recipe.category
                     }</span>
                  </div>
                </div>

                
                <div className="ml-auto flex gap-4">
                  <button 
                    onClick={() => setIsShareModalOpen(true)} 
                    className="w-12 h-12 bg-[#E7FAFE] rounded-full flex items-center justify-center text-black hover:bg-blue-100 transition"
                  >
                      <Share size={20}/>
                  </button>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
           
            <div className="lg:col-span-8 space-y-12">
                
                
                <div className="relative w-full aspect-[16/9] rounded-[30px] overflow-hidden bg-gray-100">
                  <img src={mainImageUrl} className="w-full h-full object-cover" alt={recipe.title} />
                </div>

                
                <p className="text-gray-500 leading-relaxed text-base">
                  {recipe.description}
                </p>

                
                <div>
                  <h2 className="text-3xl font-bold mb-8 text-black">Ingredients</h2>
                  <div className="space-y-4">
                      {recipe.ingredients?.map((ing: string, i: number) => {
                        const isChecked = checkedIngredients.includes(i);
                        return (
                          <div key={i} onClick={() => toggleIngredient(i)} className="flex items-center gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 px-2 rounded-lg transition cursor-pointer group select-none">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isChecked ? 'bg-black border-black' : 'border-gray-300 group-hover:border-black'}`}>
                                {isChecked && <Check size={14} className="text-white" strokeWidth={3} />}
                              </div>
                              <span className={`font-medium text-lg transition-all duration-200 ${isChecked ? 'text-gray-400 line-through decoration-gray-400' : 'text-gray-600'}`}>{ing}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                
                <div>
                  <h2 className="text-3xl font-bold mb-8 text-black">Directions</h2>
                  <div className="space-y-10">
                      {recipe.instructions?.map((inst: any, i: number) => {
                        const stepImg = inst.stepImage 
                        ;
                        const stepImgUrl = stepImg;
                        return (
                            <div key={i} className="flex gap-6 items-start">
                              <div className="flex-shrink-0 mt-1">
                                  <input type="checkbox" className="w-6 h-6 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black" />
                              </div>
                              <div className="space-y-4 flex-1">
                                  <h3 className="font-bold text-xl text-black">{i + 1}. {inst.title}</h3>
                                  <p className="text-gray-500 leading-relaxed text-base">{inst.description}</p>
                                  {stepImg && (
                                    <div className="mt-4 rounded-[20px] overflow-hidden w-full max-w-md shadow-sm">
                                        <img src={stepImgUrl} className="w-full h-auto object-cover" alt={`Step ${i+1}`} />
                                    </div>
                                  )}
                              </div>
                            </div>
                        );
                      })}
                  </div>
                </div>
            </div>


            <div className="lg:col-span-4 space-y-10">
                <div className="bg-[#E7FAFE] p-8 rounded-[30px]">
                  <h3 className="text-2xl font-bold mb-6 text-black">Nutrition Information</h3>
                  <div className="space-y-4">
                      {recipe.nutritions?.length > 0 ? (
                        recipe.nutritions.map((nutri: any, i: number) => (
                            <div key={i} className="flex justify-between items-center pb-3 border-b border-gray-300 last:border-0">
                              <span className="text-gray-500 font-medium text-base">{nutri.name}</span>
                              <span className="font-bold text-gray-900 text-base">{nutri.quantity}</span>
                            </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">No nutrition info available.</p>
                      )}
                  </div>
                  </div>

                <RelatedRecipes category={recipe.category} currentRecipeId={recipe._id} />
            </div>

          </div>
        </div>
      </main>

      <Footer />

      
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[30px] p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            
            <button 
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <X size={20} className="text-gray-600" />
            </button>

            <h3 className="text-2xl font-bold text-black mb-2">Share this recipe</h3>
            <p className="text-gray-500 mb-6">Copy the link below to share with your friends!</p>
            
           
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
              <input 
                type="text" 
                readOnly 
                value={typeof window !== 'undefined' ? window.location.href : ''}
                className="bg-transparent flex-1 outline-none text-gray-600 px-2 text-sm"
              />
              <button 
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 
                  ${copied ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800'}`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}