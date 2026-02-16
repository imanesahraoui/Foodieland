"use client";
import Link from 'next/link';
import { UtensilsCrossed, LayoutGrid, LogOut, ChevronLeft, ChevronRight, UserCircle, X, Menu } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/authSlice';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const handleLogout = () => {
    dispatch(logout());
    router.push('/admin/login');
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-md border border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <Menu size={24} className="text-gray-600" />
        </button>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen bg-white border-r border-gray-100 z-50
        transition-all duration-300 ease-in-out flex flex-col
        ${''}
        ${isOpen 
          ? 'translate-x-0 w-64' 
          : '-translate-x-full lg:translate-x-0 lg:w-20'
        } 
      `}>
        
        <button 
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3 top-10 bg-white border border-gray-100 rounded-full p-1 shadow-sm hover:bg-gray-50 transition-colors z-[60]"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        <button 
          onClick={toggleSidebar}
          className="lg:hidden absolute right-4 top-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-6 flex flex-col h-full overflow-hidden">
         
          <h1 className="text-2xl font-bold mb-10 italic whitespace-nowrap">
            {isOpen ? (
              <>Foodieland<span className="text-orange-500">.</span></>
            ) : (
              <span className="text-orange-500 lg:block hidden">F.</span>
            )}
          </h1>
          
          <nav className="flex-1 space-y-4">
            <Link 
              href="/admin" 
              onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              className={`flex items-center gap-3 p-3 rounded-2xl transition ${
                pathname === '/admin' ? 'bg-[#E7FAFE] text-blue-600' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <UtensilsCrossed size={22} className="shrink-0" />
              <span className={`font-medium ${isOpen ? 'block' : 'lg:hidden'}`}>Recipes</span>
            </Link>

            <Link 
              href="/admin/categories" 
              onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              className={`flex items-center gap-3 p-3 rounded-2xl transition ${
                pathname === '/admin/categories' ? 'bg-[#E7FAFE] text-blue-600' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <LayoutGrid size={22} className="shrink-0" />
              <span className={`font-medium ${isOpen ? 'block' : 'lg:hidden'}`}>Categories</span>
            </Link>
          </nav>

          <div className="border-t border-gray-50 pt-4 space-y-2">
            <Link 
              href="/admin/profile" 
              onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              className={`flex items-center gap-3 p-2 rounded-2xl transition ${
                pathname === '/admin/profile' ? 'bg-gray-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0 overflow-hidden border border-blue-100">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Admin" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle size={20} className="text-blue-500" />
                )}
              </div>
              {isOpen && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-black truncate">
                    {user?.fullName || 'Admin'}
                  </span>
                  <span className="text-[10px] text-gray-400 truncate">Settings</span>
                </div>
              )}
            </Link>

            <button 
              onClick={handleLogout} 
              className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-2xl transition w-full"
            >
              <LogOut size={22} className="shrink-0" />
              {isOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}