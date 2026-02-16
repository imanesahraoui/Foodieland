"use client";
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Loader2 } from 'lucide-react';
import { categoryService } from '@/services/category.service';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('name', name);
    if (file) formData.append('file', file);

    try {
      if (editingCat) {
        await categoryService.update(editingCat._id, formData);
      } else {
        await categoryService.create(formData);
      }
      closeModal();
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error saving category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await categoryService.delete(id);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const openModal = (cat: any = null) => {
    setEditingCat(cat);
    setName(cat ? cat.name : '');
    setFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCat(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">

      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Manage Categories</h1>
          <p className="text-gray-500 mt-1">Add or edit food categories</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-black text-white px-6 py-4 rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10"
        >
          <Plus size={20} /> Add Category
        </button>
      </div>


      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gray-300" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white p-6 rounded-[35px] shadow-sm flex flex-col items-center group relative border border-gray-50 hover:border-blue-100 transition-all">
             
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                <button onClick={() => openModal(cat)} className="p-2.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(cat._id)} className="p-2.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition">
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-50 border-4 border-white shadow-inner">
                <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-lg text-center">{cat.name}</h3>
            </div>
          ))}
        </div>
      )}

  
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={closeModal} className="absolute top-8 right-8 text-gray-400 hover:text-black transition">
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold mb-8">
              {editingCat ? 'Edit Category' : 'New Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-3 ml-1">Category Name</label>
                <input 
                  type="text" required value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-blue-100 transition"
                  placeholder="Ex: Breakfast"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-3 ml-1">Category Image</label>
                <div className="flex items-center gap-4">
                  {editingCat && !file && (
                    <img src={editingCat.imageUrl} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt="current" />
                  )}
                  <div className="flex-1 relative border-2 border-dashed border-gray-200 p-6 rounded-2xl text-center hover:bg-gray-50 transition cursor-pointer">
                    <input 
                      type="file" 
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                    <Upload className="mx-auto text-gray-300 mb-2" size={24} />
                    <p className="text-xs font-medium text-gray-400 truncate px-2">
                      {file ? file.name : "Select or drop image"}
                    </p>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (editingCat ? 'Save Changes' : 'Create Category')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}