
"use client";
import { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import { recipeService } from '@/services/recipe.service';
import { categoryService } from '@/services/category.service'; 
import { Search, Filter } from 'lucide-react';

interface RecipesSectionProps {
  selectedCategory: string | null; 
}

export default function RecipesSection({ selectedCategory }: RecipesSectionProps) {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [localCategoryFilter, setLocalCategoryFilter] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        
        const [recipesData, categoriesData] = await Promise.all([
          recipeService.getAll(),
          categoryService.getAll()
        ]);
        
        setRecipes(recipesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur chargement:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const activeCategory = localCategoryFilter || selectedCategory;
  const filteredRecipes = recipes.filter(recipe => {
  const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory 
      ? recipe.category === activeCategory 
      : true;

    return matchesSearch && matchesCategory;
  });

  
  const displayLimit = 9; 
  const recipesToDisplay = filteredRecipes.slice(0, displayLimit);

  return (
    <section className="mb-24 px-4 md:px-0">
      
     
      <div className="text-center mb-10 max-w-2xl mx-auto space-y-4">
        <h2 className="text-4xl font-bold text-black tracking-tight">
          Simple and tasty recipes
        </h2>
        <p className="text-gray-500 leading-relaxed">
          Discover our selection of simple and tasty recipes, designed to inspire your daily meals and delight your taste buds with every bite.
        </p>
      </div>
      <div className="max-w-4xl mx-auto mb-12 flex flex-col md:flex-row gap-4">
       
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-[20px] leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black/5 transition-all"
          />
        </div>
        <div className="relative md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select 
            value={localCategoryFilter}
            onChange={(e) => setLocalCategoryFilter(e.target.value)}
            className="block w-full pl-12 pr-10 py-3 border border-gray-200 rounded-[20px] leading-5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-black/5 cursor-pointer appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
         {loading ? (
             <div className="col-span-3 h-64 flex items-center justify-center">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
             </div>
         ) : recipesToDisplay.length > 0 ? (
            recipesToDisplay.map(recipe => (
              <RecipeCard 
                key={recipe._id}
                id={recipe._id}
                title={recipe.title}
                image={recipe.imageUrl} 
                time={(recipe.cookingTime || 0) + (recipe.preparationTime || 0)} 
                category={recipe.category}
              />
            ))
         ) : (
            <div className="col-span-3 text-center py-20 bg-gray-50 rounded-[30px]">
                <p className="text-gray-400 font-medium">
                  No recipes found matching your criteria.
                </p>
               
                {(searchTerm || localCategoryFilter) && (
                  <button 
                    onClick={() => {setSearchTerm(""); setLocalCategoryFilter("");}}
                    className="mt-2 text-[#FF7426] text-sm font-bold hover:underline"
                  >
                    Clear filters
                  </button>
                )}
            </div>
         )}
      </div>
    </section>
  );
}