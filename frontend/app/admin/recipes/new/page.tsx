"use client";
import { useEffect, useState } from 'react';
import { Plus, Trash, Upload, Check, Clock, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { recipeService } from '@/services/recipe.service'; 
import { categoryService } from '@/services/category.service';

export default function NewRecipePage() {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [cookingTime, setCookingTime] = useState<number | ''>('');
  const [preparationTime, setPreparationTime] = useState<number | ''>('');
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [nutritions, setNutritions] = useState([{ name: '', quantity: '' }]);
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<{ title: string, description: string, stepFile?: File }[]>([
    { title: '', description: '' }
  ]);

  useEffect(() => {
    const getCats = async () => {
      try {
        const data = await categoryService.getAll();
        setDbCategories(data);
        if (data.length > 0) setCategory(data[0].name);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    getCats();
  }, []);
  const addNutrition = () => setNutritions([...nutritions, { name: '', quantity: '' }]);
  const updateNutrition = (index: number, field: 'name' | 'quantity', value: string) => {
    const newNutri = [...nutritions];
    newNutri[index][field] = value;
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
  const updateInstruction = (index: number, field: string, value: any) => {
    const newSteps = [...instructions];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setInstructions(newSteps);
  };
  const removeInstruction = (index: number) => {
    if (instructions.length > 1) setInstructions(instructions.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!title.trim()) return "Recipe Title is required.";
    if (!description.trim()) return "Description is required.";
    if (!category) return "Category is required.";
    if (!cookingTime || Number(cookingTime) <= 0) return "Valid Cook Time is required.";
    if (!preparationTime || Number(preparationTime) <= 0) return "Valid Prep Time is required.";
    if (!mainImage) return "Main Image is required.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) { alert("Validation Error: " + errorMsg); return; }
    if (!token) return alert("You must be logged in!");

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('cookingTime', cookingTime.toString());
    formData.append('preparationTime', preparationTime.toString());
    if (mainImage) formData.append('image', mainImage);
    formData.append('nutritions', JSON.stringify(nutritions));
    formData.append('ingredients', JSON.stringify(ingredients));
    const formattedInstructions = instructions.map((step, index) => {
      if (step.stepFile) formData.append(`stepImage_${index}`, step.stepFile);
      return { title: step.title, description: step.description };
    });
    formData.append('instructions', JSON.stringify(formattedInstructions));

    try {
      await recipeService.create(formData);
      alert("Recipe published successfully!");
      router.push('/admin');
    } catch (error: any) {
      alert("Error: " + (error.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 sm:px-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 mb-8 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Create New Recipe</h1>
          <p className="text-gray-400 text-sm mt-1">Fill in the details to publish your dish</p>
        </div>
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="text-gray-400 hover:text-black font-semibold text-sm transition-colors border-b-2 border-transparent hover:border-black"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        
        
        <div className="bg-white p-6 md:p-10 rounded-[25px] md:rounded-[40px] shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-400">Recipe Title <span className="text-red-500">*</span></label>
              <input 
                placeholder="Ex: Japanese Fried Rice" 
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-blue-100 transition text-sm md:text-base font-medium" 
                value={title}
                onChange={(e) => setTitle(e.target.value)} 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-400">Category <span className="text-red-500">*</span></label>
              <div className="relative">
                <select 
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-blue-100 transition text-sm md:text-base appearance-none font-medium cursor-pointer" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {dbCategories.map((cat) => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                   <X size={16} className="rotate-45" /> 
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-400">Description <span className="text-red-500">*</span></label>
             <textarea 
               placeholder="Short description..." 
               rows={3}
               className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-blue-100 transition resize-none text-sm md:text-base font-medium" 
               value={description}
               onChange={(e) => setDescription(e.target.value)} 
               required
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-400">Prep Time (min) <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="30" 
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-blue-100 transition text-sm md:text-base font-medium" 
                  onChange={(e) => setPreparationTime(Number(e.target.value))} 
                  required
                />
                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-400">Cook Time (min) <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="15" 
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-blue-100 transition text-sm md:text-base font-medium" 
                  onChange={(e) => setCookingTime(Number(e.target.value))} 
                  required
                />
                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-400">Main Image <span className="text-red-500">*</span></label>
            <div className={`border-2 border-dashed p-8 md:p-14 rounded-[30px] text-center relative transition-all ${mainImage ? 'border-green-300 bg-green-50/50' : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50/30'}`}>
              <input 
                type="file" accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => setMainImage(e.target.files?.[0] || null)} 
                required
              />
              {mainImage ? (
                 <div className="flex flex-col items-center text-green-600 animate-in fade-in zoom-in duration-300">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <Check size={24} />
                    </div>
                    <p className="font-bold text-sm truncate max-w-[200px] md:max-w-xs">{mainImage.name}</p>
                 </div>
              ) : (
                 <div className="flex flex-col items-center">
                    <Upload className="text-gray-300 mb-3" size={32} />
                    <p className="text-gray-500 font-bold text-sm">Upload your recipe photo</p>
                    <p className="text-gray-300 text-xs mt-1">JPEG, PNG or WebP</p>
                 </div>
              )}
            </div>
          </div>
        </div>

        
        <div className="bg-white p-6 md:p-10 rounded-[25px] md:rounded-[40px] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Ingredients</h2>
            <button type="button" onClick={addIngredient} className="w-10 h-10 flex items-center justify-center bg-[#E7FAFE] text-blue-600 rounded-full hover:bg-blue-100 transition-all active:scale-90">
              <Plus size={20}/>
            </button>
          </div>
          <div className="space-y-3">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-3 items-center group">
                <input 
                  placeholder="Ex: 2 cups of Rice" 
                  className="flex-1 p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-blue-100 transition text-sm font-medium"
                  value={ing}
                  onChange={(e) => updateIngredient(i, e.target.value)} 
                  required
                />
                <button type="button" onClick={() => removeIngredient(i)} className="shrink-0 p-2 text-gray-300 hover:text-red-500 transition-colors">
                  <Trash size={20}/>
                </button>
              </div>
            ))}
          </div>
        </div>

        
        <div className="bg-white p-6 md:p-10 rounded-[25px] md:rounded-[40px] shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">Direction Steps</h2>
            <button type="button" onClick={addInstruction} className="w-10 h-10 flex items-center justify-center bg-[#E7FAFE] text-blue-600 rounded-full active:scale-90 transition-all">
              <Plus size={20}/>
            </button>
          </div>
          <div className="space-y-10">
            {instructions.map((step, index) => (
              <div key={index} className="relative pl-0 md:pl-12 space-y-4">
                
                <div className="hidden md:flex absolute left-0 top-0 w-8 h-8 bg-black text-white rounded-full items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                
                <div className="flex items-center justify-between md:hidden mb-2">
                  <span className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                  <button type="button" onClick={() => removeInstruction(index)} className="text-red-400"><X size={20}/></button>
                </div>

                <div className="bg-gray-50/50 p-5 md:p-0 md:bg-transparent rounded-[20px] space-y-4">
                  <div className="flex items-center justify-between">
                    <input 
                      placeholder="Step Title" 
                      className="flex-1 p-0 bg-transparent outline-none font-bold text-lg md:text-xl placeholder:text-gray-300"
                      value={step.title}
                      onChange={(e) => updateInstruction(index, 'title', e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => removeInstruction(index)} className="hidden md:block text-gray-300 hover:text-red-500"><X size={20}/></button>
                  </div>
                  
                  <textarea 
                    placeholder="Describe this step..." 
                    rows={2}
                    className="w-full p-0 bg-transparent outline-none resize-none text-sm md:text-base text-gray-600 placeholder:text-gray-300 font-medium"
                    value={step.description}
                    onChange={(e) => updateInstruction(index, 'description', e.target.value)}
                    required
                  />

                  <div className="relative mt-2">
                    <div className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-2xl transition-all ${step.stepFile ? 'border-green-200 bg-white' : 'border-gray-100 bg-white hover:border-blue-100'}`}>
                      {step.stepFile ? <Check className="text-green-500" size={18}/> : <Upload className="text-gray-300" size={18} />}
                      <span className="text-xs font-bold text-gray-400 truncate flex-1">{step.stepFile ? step.stepFile.name : "Add Step Image"}</span>
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => updateInstruction(index, 'stepFile', e.target.files?.[0])} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-[25px] md:rounded-[40px] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Nutrition Facts</h2>
            <button type="button" onClick={addNutrition} className="w-10 h-10 flex items-center justify-center bg-[#E7FAFE] text-blue-600 rounded-full">
              <Plus size={20}/>
            </button>
          </div>
          <div className="space-y-4">
            {nutritions.map((nutri, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <input 
                  placeholder="Fact (ex: Calories)" 
                  className="flex-1 p-4 bg-gray-50 rounded-2xl outline-none text-sm font-medium"
                  value={nutri.name}
                  onChange={(e) => updateNutrition(i, 'name', e.target.value)}
                  required 
                />
                <div className="flex-1 flex gap-3 items-center">
                  <input 
                    placeholder="Value (ex: 250 kcal)" 
                    className="flex-1 p-4 bg-gray-50 rounded-2xl outline-none text-sm font-medium"
                    value={nutri.quantity}
                    onChange={(e) => updateNutrition(i, 'quantity', e.target.value)} 
                    required
                  />
                  <button type="button" onClick={() => removeNutrition(i)} className="p-2 text-gray-300 hover:text-red-500">
                    <Trash size={20}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="pt-4">
          <button type="submit" className="w-full bg-black text-white py-5 rounded-[25px] font-bold text-lg shadow-xl shadow-black/10 hover:bg-gray-800 transition-all active:scale-[0.98]">
            Publish Recipe
          </button>
        </div>
      </form>
    </div>
  );
}