"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CategoryCard from './CategoryCard';
import { categoryService } from '@/services/category.service';

interface CategoriesSectionProps {
  onCategorySelect?: (categoryName: string | null) => void;
}

export default function CategoriesSection({ onCategorySelect }: CategoriesSectionProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Erreur chargement catégories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const displayedCategories = categories.slice(0, 6);

  const handleCategoryClick = (name: string) => {
    router.push(`/recipes?category=${encodeURIComponent(name)}`);
  };

  if (loading) return <div className="text-center py-10">Loading categories...</div>;

  return (
    <section className="mb-20">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Categories</h2>
        
        <Link 
          href="/categories" 
          className="bg-[#E7FAFE] text-blue-900 font-bold px-6 py-3 rounded-2xl text-sm hover:bg-blue-100 transition"
        >
          View All Categories
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-center text-gray-500">No categories found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {displayedCategories.map((cat) => (
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
    </section>
  );
}