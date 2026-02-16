import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/components/ReduxProvider"; 

export const metadata: Metadata = {
  title: "Foodieland. ",
  description: "Discover and manage the best recipes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased bg-[#F9F9F9] text-black">
        
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}