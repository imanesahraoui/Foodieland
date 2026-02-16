"use client";
import { Clock, Utensils, Heart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  time: number;
  category: string;
}

export default function RecipeCard({ id, title, image, time, category }: RecipeCardProps) {
  const [isLiked, setIsLiked] = useState(false);

const imageUrl = image;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    setIsLiked(!isLiked);
  };

  return (
    <div className="h-full relative group">
      <Link href={`/recipes/${id}`} className="block h-full">
        <div className="bg-[#E7FAFE] rounded-[30px] p-4 transition-all duration-300 h-full flex flex-col hover:shadow-lg">
          
          <div className="relative w-full h-[250px] rounded-[20px] overflow-hidden mb-6">
            <img 
              src={imageUrl || '/placeholder-recipe.png'} 
              alt={title} 
              className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
              onError={(e) => (e.target as HTMLImageElement).src = '/placeholder-recipe.png'}
            />
            
            
          </div>
          <h3 className="font-bold text-2xl text-black mb-6 line-clamp-2 leading-tight flex-1">
            {title}
          </h3>

          <div className="flex items-center gap-4 mt-auto">
            
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <Clock size={18} />
              <span>{time} Minutes</span>
            </div>

            
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <Utensils size={18} />
              <span>{category}</span>
            </div>
          </div>
          
        </div>
      </Link>
    </div>
  );
}