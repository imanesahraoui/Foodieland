"use client";
import { useState, useEffect, use } from 'react';
import { Plus, Trash, ChevronLeft, X, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { recipeService } from '@/services/recipe.service'; 
import { categoryService } from '@/services/category.service'; 

export default function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); 
  const [cookingTime, setCookingTime] = useState(0);
  const [preparationTime, setPreparationTime] = useState(0);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<any[]>([]);
  const [nutritions, setNutritions] = useState<{ name: string; quantity: string }[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const [recipeData, categoriesData] = await Promise.all([
          recipeService.getById(id),
          categoryService.getAll()
        ]);
        
        setCategoriesList(categoriesData);
        setTitle(recipeData.title);
        setDescription(recipeData.description);
        setCategory(recipeData.category);
        setCookingTime(recipeData.cookingTime || 0);
        setPreparationTime(recipeData.preparationTime || 0);
        setIngredients(recipeData.ingredients || ['']);
        setInstructions(recipeData.instructions || []);
        setNutritions(recipeData.nutritions || [{ name: '', quantity: '' }]);
        setPreviewUrl(recipeData.imageUrl);

      } catch (err) {
        console.error(err);
        alert("Error loading data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const addNutrition = () => setNutritions([...nutritions, { name: '', quantity: '' }]);
  const updateNutrition = (index: number, field: 'name' | 'quantity', value: string) => {
    const newNutri = [...nutritions];
    newNutri[index] = { ...newNutri[index], [field]: value };
    setNutritions(newNutri);
  };
  const removeNutrition = (index: number) => {
    if (nutritions.length > 1) setNutritions(nutritions.filter((_, i) => i !== index));
  };

  const addIngredient = () => setIngredients([...ingredients, '']);
  const updateIngredient = (index: number, value: string) => {
    const newIngs = [...ingredients];
    newIngs[index] = value;
    setIngredients(newIngs);
  };
  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addInstruction = () => setInstructions([...instructions, { title: '', description: '' }]);
  const updateInstruction = (index: number, field: string, value: string) => {
    const newSteps = [...instructions];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setInstructions(newSteps);
  };
  const removeInstruction = (index: number) => {
    if (instructions.length > 1) setInstructions(instructions.filter((_, i) => i !== index));
  };

 
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('cookingTime', cookingTime.toString());
    formData.append('preparationTime', preparationTime.toString());
    
    formData.append('ingredients', JSON.stringify(ingredients));
    formData.append('instructions', JSON.stringify(instructions));
    formData.append('nutritions', JSON.stringify(nutritions));
    
    if (mainImage) {
      formData.append('image', mainImage);
    }

    try {
      await recipeService.update(id, formData);
      alert("Recipe updated successfully!");
      router.push('/admin');
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">Loading data...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4">
      <div className="flex justify-between items-center mb-10">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-black transition">
          <ChevronLeft size={20} /> Back
        </button>
      </div>

      <form onSubmit={handleUpdate} className="space-y-8">
        
        
        <div className="bg-white p-8 rounded-[30px] shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Recipe Title</label>
              <input 
                type="text" required value={title}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-blue-100"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            
            <div>
              <label className="block text-sm font-bold mb-2">Category</label>
              <select 
                className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none"
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>Select a category</option>
                {categoriesList.length > 0 ? (
                  categoriesList.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No categories found</option>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Prep Time (min)</label>
              <div className="relative">
                <input type="number" value={preparationTime} className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none" onChange={(e) => setPreparationTime(Number(e.target.value))} />
                <Clock className="absolute right-4 top-4 text-gray-300" size={20} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Cook Time (min)</label>
              <div className="relative">
                <input type="number" value={cookingTime} className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none" onChange={(e) => setCookingTime(Number(e.target.value))} />
                <Clock className="absolute right-4 top-4 text-gray-300" size={20} />
              </div>
            </div>
          </div>

          <div>
              <label className="block text-sm font-bold mb-2">Recipe Image</label>
              <div className="flex flex-col md:flex-row items-center gap-6">
                 <img src={previewUrl || '/placeholder.png'} className="w-full md:w-48 h-32 object-cover rounded-2xl shadow-sm" alt="current" />
                 <div className="w-full flex-1 border-2 border-dashed border-gray-100 p-6 rounded-2xl text-center">
                    <input type="file" accept="image/*" className="text-sm" onChange={(e) => setMainImage(e.target.files?.[0] || null)} />
                    <p className="text-xs text-gray-400 mt-2">Leave empty to keep current image (Max 10MB)</p>
                 </div>
              </div>
          </div>
        </div>

        
        <div className="bg-white p-8 rounded-[30px] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Ingredients</h2>
            <button type="button" onClick={addIngredient} className="p-2 bg-[#E7FAFE] text-blue-600 rounded-full hover:bg-blue-100"><Plus size={20} /></button>
          </div>
          <div className="space-y-4">
            {ingredients.map((ing, index) => (
              <div key={index} className="flex gap-4 items-center">
                <input 
                  placeholder="Ex: 200g of Flour" value={ing} 
                  className="flex-1 p-4 bg-gray-50 rounded-2xl outline-none"
                  onChange={(e) => updateIngredient(index, e.target.value)}
                />
                <button type="button" onClick={() => removeIngredient(index)} className="text-red-400 p-2">
                  <Trash size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        
        <div className="bg-white p-8 rounded-[30px] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Instructions</h2>
            <button type="button" onClick={addInstruction} className="p-2 bg-[#E7FAFE] text-blue-600 rounded-full hover:bg-blue-100"><Plus size={20} /></button>
          </div>
          <div className="space-y-6">
            {instructions.map((step, index) => (
              <div key={index} className="p-6 border border-gray-100 rounded-[25px] space-y-4 relative bg-gray-50/30">
                <div className="flex justify-between">
                  <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">{index + 1}</span>
                  <button type="button" onClick={() => removeInstruction(index)} className="text-red-300 hover:text-red-500"><X size={18} /></button>
                </div>
                <input 
                  placeholder="Step Title" value={step.title} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-lg"
                  onChange={(e) => updateInstruction(index, 'title', e.target.value)}
                />
                <textarea 
                  placeholder="Step Description" rows={3} value={step.description} className="w-full p-4 bg-gray-50 rounded-2xl outline-none resize-none"
                  onChange={(e) => updateInstruction(index, 'description', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        
        <div className="bg-white p-8 rounded-[30px] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Nutrition Information</h2>
            <button type="button" onClick={addNutrition} className="p-2 bg-[#E7FAFE] text-blue-600 rounded-full hover:bg-blue-100">
              <Plus size={20} />
            </button>
          </div>
          <div className="space-y-4">
            {nutritions.map((nutri, index) => (
              <div key={index} className="flex gap-4 items-center">
                <input 
                  placeholder="Label (ex: Calories)" value={nutri.name} 
                  className="flex-1 p-4 bg-gray-50 rounded-2xl outline-none"
                  onChange={(e) => updateNutrition(index, 'name', e.target.value)}
                />
                <input 
                  placeholder="Value (ex: 250 kcal)" value={nutri.quantity} 
                  className="w-1/3 p-4 bg-gray-50 rounded-2xl outline-none font-bold"
                  onChange={(e) => updateNutrition(index, 'quantity', e.target.value)}
                />
                <button type="button" onClick={() => removeNutrition(index)} className="text-red-400 p-2">
                  <Trash size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full bg-black text-white py-5 rounded-[25px] font-bold text-lg shadow-xl hover:bg-gray-800 transition-all transform active:scale-[0.98]">
          Save Changes
        </button>
      </form>
    </div>
  );
}