"use client";
import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Lobster } from 'next/font/google';
const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function Footer() {
  return (
    <footer className="bg-white">
       <div className="container mx-auto px-6">
       
        <div className="border-t border-black/10"></div>
        <div className="py-8 flex flex-col-reverse md:flex-row justify-center items-center relative">
          <div className="text-gray-500 text-sm opacity-70">
             2020 Flowbase. Powered by <span className="text-[#FF7426]">Webflow</span>
          </div>

          <div className="flex gap-8 text-black mb-4 md:mb-0 md:absolute md:right-0">
             <a href="#" className="hover:text-[#FF7426] transition-colors" aria-label="Facebook">
               <Facebook size={20} />
             </a>
             <a href="#" className="hover:text-[#FF7426] transition-colors" aria-label="Twitter">
               <Twitter size={20} />
             </a>
             <a href="#" className="hover:text-[#FF7426] transition-colors" aria-label="Instagram">
               <Instagram size={20} />
             </a>
          </div>

        </div>
      </div>
    </footer>
  );
}