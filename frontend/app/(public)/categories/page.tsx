"use client"; 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { categoryService } from '@/services/category.service';
import CategoryCard from '@/components/public/CategoryCard'; 
import { ArrowLeft } from 'lucide-react'; 
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (name: string) => {
    router.push(`/recipes?category=${encodeURIComponent(name)}`);
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
   
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-6 py-12 mb-20">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-black mb-4">All Categories</h1>
            <p className="text-gray-500">Explore our wide variety of delicious recipe categories.</p>
          </div>
          {categories.length === 0 ? (
            <div className="text-center text-gray-500 py-20">No categories found.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {categories.map((cat) => (
                <CategoryCard 
                  key={cat._id}
                  name={cat.name}
                  image={cat.image || cat.imageUrl || '/placeholder-category.png'} 
                  onClick={() => handleCategoryClick(cat.name)}
                  isSelected={false} 
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      
    </div>
  );
}