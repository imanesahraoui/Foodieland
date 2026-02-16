"use client";
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Camera, Save, Loader2 } from 'lucide-react';
import { updateProfileSuccess } from '@/store/authSlice';
import { authService } from '@/services/auth.service';

export default function AdminProfile() {
  const dispatch = useDispatch();
  
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    authService.getProfile()
      .then(data => {
        setProfile(data);
        setFullName(data.fullName);
      })
      .catch(err => console.error("Could not load profile", err));
  }, []);
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    const formData = new FormData();
    formData.append('fullName', fullName);
    if (file) formData.append('file', file);

    try {
      const data = await authService.updateProfile(formData);

      setProfile(data);
      dispatch(updateProfileSuccess(data));
      setFile(null);
      
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert("Update failed: " + (err.response?.data?.message || "Check your connection"));
    } finally { 
      setIsUpdating(false); 
    }
  };

  if (!profile) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  return (
    <div className="max-w-xl mx-auto p-6 mt-10">
      <h1 className="text-2xl font-bold mb-8">Admin Profile</h1>
      
      <form onSubmit={handleUpdate} className="bg-white p-8 rounded-[35px] shadow-sm space-y-6 border border-gray-50">
       
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#E7FAFE] bg-gray-50">
               <img 
                src={previewUrl || profile.profilePicture } 
                className="w-full h-full object-cover"
                alt="Profile"
              />
            </div>
            <label className="absolute bottom-0 right-0 bg-black text-white p-2.5 rounded-full cursor-pointer hover:scale-110 transition shadow-lg">
              <Camera size={18} />
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
              />
            </label>
          </div>
        </div>

        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2 ml-1 text-gray-700">Email Address (Read-only)</label>
            <input 
                type="text" 
                disabled 
                value={profile.email} 
                className="w-full p-4 bg-gray-50 rounded-2xl text-gray-400 cursor-not-allowed border-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 ml-1 text-gray-700">Full Name</label>
            <input 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-[#E7FAFE] transition border-none font-medium"
              placeholder="Enter your name"
              required
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isUpdating} 
          className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-70 mt-2 shadow-lg shadow-black/5"
        >
          {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save Changes
        </button>
      </form>
    </div>
  );
}