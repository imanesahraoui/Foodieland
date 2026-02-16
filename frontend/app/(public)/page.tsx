"use client";
import { useState } from 'react';
import { Facebook, Twitter, Instagram, User } from 'lucide-react';
import HeroSection from '@/components/public/HeroSection';
import CategoriesSection from '@/components/public/CategoriesSection';
import RecipesSection from '@/components/public/RecipesSection';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer'; 
export default function PublicHomePage() {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 max-w-7xl space-y-24 pb-20">
        <HeroSection />
        <CategoriesSection onCategorySelect={setCategoryFilter} />
        <RecipesSection selectedCategory={categoryFilter} />
      </main>
      <Footer />
    </div>
  );
}