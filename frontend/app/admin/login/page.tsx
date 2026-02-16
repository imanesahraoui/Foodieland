"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFailure } from "@/store/authSlice";
import { authService } from "@/services/auth.service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authService.login({ email, password });

      dispatch(
        loginSuccess({
          token: data.accessToken,
          user: data.user,
        }),
      );

      router.push("/admin");
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      dispatch(loginFailure(message));
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E7FAFE] flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md p-10 rounded-[40px] shadow-sm border border-white">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-black mb-2">
            Welcome back, Chef!
          </h1>
          <p className="text-gray-400">
            Log in to manage your recipes.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="email"
                required
                value={email}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#E7FAFE] outline-none transition"
                placeholder="chef@foodieland.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#E7FAFE] outline-none transition"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Access restricted to Foodieland administrators.
        </p>
      </div>
    </div>
  );
}