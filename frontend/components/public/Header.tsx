"use client";
import Link from 'next/link';
import { Lobster } from 'next/font/google';

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function Header() {
  return (
    <header className="w-full border-b border-black/10 bg-white mb-12">
      
      <nav className="container mx-auto px-6 py-8 flex justify-center items-center">
        <Link href="/" className={`${lobster.className} text-[24px] text-black`}>
          Foodieland<span className="text-[#FF7426]">.</span>
        </Link>
      </nav>
      
    </header>
  );
}