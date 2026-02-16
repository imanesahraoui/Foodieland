"use client";
import { useState, useEffect } from 'react';
import { Timer, Utensils, Play } from 'lucide-react';
import { recipeService } from '@/services/recipe.service';
import Link from 'next/link';

export default function HeroSection() {
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await recipeService.getLatest();
        setRecipe(data);
      } catch (error) {
        console.error("Erreur", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  if (loading) return (
    <div className="container mx-auto px-4 lg:px-0">
      <div className="w-full h-[400px] lg:h-[640px] bg-gray-100 rounded-[30px] animate-pulse mx-auto"></div>
    </div>
  );
  
  if (!recipe) return null;

  return (
    <section className="container mx-auto px-4 lg:px-0 mb-10 lg:mb-20">
      <div className="flex flex-col lg:flex-row w-full max-w-[1280px] min-h-[500px] lg:h-[640px] rounded-[30px] overflow-hidden lg:overflow-visible shadow-sm mx-auto relative">
        

        <div className="w-full lg:w-1/2 bg-[#E7FAFE] p-6 lg:p-[50px] flex flex-col relative z-10 rounded-t-[30px] lg:rounded-t-none lg:rounded-l-[30px]">
          <div className="mb-6">
            <h1 className="text-3xl md:text-5xl lg:text-[64px] font-bold text-black leading-[1.1] mb-4 lg:mb-6 tracking-tight">
              {recipe.title}
            </h1>
            <p className="text-gray-500 text-base lg:text-lg leading-relaxed max-w-[480px] line-clamp-3">
              {recipe.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-4 mt-2 mb-8 lg:mb-auto">
            <div className="flex items-center gap-2 bg-black/5 px-4 py-2 rounded-full text-xs md:text-sm font-medium text-gray-600">
              <Timer size={18} /> 
              <span>{(recipe.preparationTime || 0) + (recipe.cookingTime || 0)} Minutes</span>
            </div>
            <div className="flex items-center gap-2 bg-black/5 px-4 py-2 rounded-full text-xs md:text-sm font-medium text-gray-600">
              <Utensils size={18} /> 
              <span>{recipe.category}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-6 lg:mt-10">
              <div className="flex items-center gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-200 rounded-full overflow-hidden shrink-0">
                     <img src={recipe.authorAvatar || "/avatar-placeholder.png"} alt="Chef" className="w-full h-full object-cover"/> 
                  </div>
                  <div className="flex flex-col">
                      <span className="font-bold text-black text-sm">{recipe.authorName || "John Smith"}</span>
                      <span className="text-gray-500 text-xs font-medium">15 March 2022</span>
                  </div>
              </div>
              <Link 
                href={`/recipes/${recipe._id}`}
                className="w-full sm:w-auto bg-black text-white px-6 lg:px-8 py-4 lg:py-6 rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-gray-800 transition text-sm lg:text-base"
              >
                View Recipes 
                <Play size={16} fill="white" className="text-white" />
              </Link>
          </div>
        </div>
        <div className="w-full lg:w-1/2 h-[300px] md:h-[400px] lg:h-full bg-white relative shrink-0">
            <img 
              src={recipe.imageUrl} 
              alt={recipe.title} 
              className="w-full h-full object-cover rounded-b-[30px] lg:rounded-b-none lg:rounded-r-[30px]"
            />
            <div className="absolute top-4 lg:top-[50px] -left-4 lg:-left-[75px] z-20 scale-75 lg:scale-100 w-[150px] h-[150px] flex items-center justify-center">
              
              <div className="absolute w-[150px] h-[150px] bg-black rounded-full shadow-xl flex items-center justify-center">
                  <svg viewBox="0 0 150 150" className="w-full h-full animate-spin-slow">
                    <path id="textCurve" d="M 75, 75 m -60, 0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0" fill="transparent"/>
                    <text className="text-[11px] font-bold uppercase tracking-[0.18em] fill-white">
                      <textPath href="#textCurve" startOffset="50%" textAnchor="middle">
                        Handpicked Recipes
                      </textPath>
                    </text>
                  </svg>
              </div>

              <div className="absolute w-[120px] h-[120px] rounded-full border border-dashed border-white/30 z-10"></div>

              <div className="absolute w-[80px] h-[80px] bg-white rounded-full z-20 flex items-center justify-center shadow-sm">
                  <div className="w-[50px] h-[50px] flex items-center justify-center">
                    <img 
                      src="https://res.cloudinary.com/dmdnjvaku/image/upload/v1770673904/05b4764d7410b2b85fbc35b68e97884a21b2dcdf_wzbsoj.png"
                      alt="Handpicked Icon"
                      className="w-full h-full object-contain"
                    />
                  </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}