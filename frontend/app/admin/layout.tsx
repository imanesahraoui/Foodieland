
"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar"; 
import { usePathname, useRouter } from "next/navigation"; 
import { useSelector } from "react-redux"; 
import { RootState } from "@/store/store"; 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const pathname = usePathname();
  const router = useRouter(); 
  const token = useSelector((state: RootState) => state.auth.token);
  
  const isLoginPage = pathname.includes("/login");
  useEffect(() => {
    if (isLoginPage) {
      setIsAuthorized(true);
      return;
    }
    const storedToken = localStorage.getItem('token') || token;

    if (!storedToken) {
      router.push("/admin/login");
    } else {
      setIsAuthorized(true);
    }
  }, [isLoginPage, router, token]);

  if (isLoginPage) return <>{children}</>;
  if (!isAuthorized) {
    return null; 
  }

  
  return (
    <div className="flex min-h-screen bg-[#F9F9F9]">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} /> 

      <main className={`
        flex-1 transition-all duration-300 min-h-screen
        ${isSidebarOpen ? "lg:pl-64" : "lg:pl-20"}
        p-8 md:p-12
      `}>
        <div className="mx-auto max-w-7xl">
            {children}
        </div>
      </main>
    </div>
  );
}