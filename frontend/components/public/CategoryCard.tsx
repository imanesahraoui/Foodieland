"use client";
import Image from 'next/image';

interface CategoryCardProps {
  name: string;
  image: string; 
  gradientColor?: string; 
  onClick: () => void;
  isSelected?: boolean;
}

export default function CategoryCard({ name, image, onClick, isSelected }: CategoryCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center p-6 rounded-[30px] cursor-pointer transition-all duration-300
        ${isSelected ? 'bg-[#E7FAFE] ring-2 ring-blue-200' : 'bg-gradient-to-b from-white to-gray-50 hover:shadow-lg'}
      `}
    >
      <div className="w-16 h-16 relative mb-4">
        <img src={image} alt={name} className="object-contain w-full h-full drop-shadow-md" />
      </div>
      <span className={`font-semibold text-sm ${isSelected ? 'text-black' : 'text-gray-500'}`}>
        {name}
      </span>
    </div>
  );
}