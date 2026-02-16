"use client";
import { useState, useEffect } from 'react';
import { Eye, Pencil, Trash, Plus, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { recipeService } from '@/services/recipe.service';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await recipeService.getAll();
      setRecipes(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecipes = recipes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(recipes.length / itemsPerPage);
  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const confirmDelete = (recipe: any) => {
    setSelectedRecipe(recipe);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedRecipe) return;
    try {
      await recipeService.delete(selectedRecipe._id);
      const updatedRecipes = recipes.filter(r => r._id !== selectedRecipe._id);
      setRecipes(updatedRecipes);
      if (currentRecipes.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
      setShowDeleteModal(false);
    } catch (error) {
      alert("Error deleting recipe");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Recipes</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your culinary directory</p>
        </div>
        <Link href="/admin/recipes/new" className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg">
          <Plus size={20} /> Add Recipe
        </Link>
      </div>

      <div className="bg-white rounded-[30px] shadow-sm border border-gray-100 overflow-hidden">
        
        
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase sticky top-0 z-10">
              <tr>
                <th className="p-6">Recipe</th>
                <th>Category</th>
                <th>Prep Time</th>
                <th>Cook Time</th>
                <th className="pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-400">Loading recipes...</td></tr>
              ) : recipes.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-400">No recipes found.</td></tr>
              ) : (
                currentRecipes.map((recipe) => (
                  <tr key={recipe._id} className="hover:bg-gray-50 transition group">
                    <td className="p-4 pl-6 flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                        <img src={recipe.imageUrl} alt={recipe.title} className="object-cover w-full h-full" />
                      </div>
                      <span className="font-bold text-gray-700">{recipe.title}</span>
                    </td>
                    <td>
                      <span className="bg-[#E7FAFE] text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                        {recipe.category}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                         <Clock size={16} className="text-gray-400" />
                         {recipe.preparationTime || 0} min
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                         <Clock size={16} className="text-gray-400" />
                         {recipe.cookingTime || 0} min
                      </div>
                    </td>
                    <td className="pr-6">
                      <div className="flex gap-1 justify-end">
                        <Link href={`/admin/recipes/${recipe._id}`} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition">
                          <Eye size={18}/>
                        </Link>
                        <Link href={`/admin/recipes/edit/${recipe._id}`} className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition">
                          <Pencil size={18}/>
                        </Link>
                        <button onClick={() => confirmDelete(recipe)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                          <Trash size={18}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

       
        <div className="lg:hidden">
            {loading ? (
                <div className="p-10 text-center text-gray-400">Loading...</div>
            ) : currentRecipes.length === 0 ? (
                <div className="p-10 text-center text-gray-400">No recipes found.</div>
            ) : (
                <div className="flex flex-col divide-y divide-gray-100">
                    {currentRecipes.map((recipe) => (
                        <div key={recipe._id} className="p-4 flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                                <img src={recipe.imageUrl} alt={recipe.title} className="object-cover w-full h-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-800 truncate">{recipe.title}</h4>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                    <span className="text-blue-600 font-bold">{recipe.category}</span>
                                    <span className="flex items-center gap-1"><Clock size={12}/> {recipe.preparationTime + recipe.cookingTime}m</span>
                                </div>
                            </div>
                            
                            <div className="flex gap-1">
                                <Link href={`/admin/recipes/${recipe._id}`} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition">
                                    <Eye size={18}/>
                                </Link>
                                <Link href={`/admin/recipes/edit/${recipe._id}`} className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-xl transition">
                                    <Pencil size={18}/>
                                </Link>
                                <button onClick={() => confirmDelete(recipe)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition">
                                    <Trash size={18}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

       
        {!loading && recipes.length > 0 && (
          <div className="border-t border-gray-100 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-white">
            <span className="text-sm text-gray-500 order-2 md:order-1">
              Showing <span className="font-semibold text-gray-700">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, recipes.length)}</span> of {recipes.length}
            </span>
            
            <div className="flex items-center gap-4 order-1 md:order-2">
              <button 
                onClick={prevPage} 
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition"
              >
                <ChevronLeft size={20} />
              </button>
              
              <span className="font-bold text-sm min-w-[80px] text-center">
                {currentPage} / {totalPages}
              </span>

              <button 
                onClick={nextPage} 
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 md:p-8 rounded-[30px] shadow-2xl max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Delete Recipe?</h3>
            <p className="text-gray-500 mb-8 text-sm md:text-base">This will permanently remove "{selectedRecipe?.title}" from your database.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 bg-gray-100 rounded-2xl font-bold hover:bg-gray-200 transition text-sm">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-200 text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}