'use client'

import Link from "next/link";
import { useState } from "react";
import { signup } from "./actions";
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  ChevronDown, 
  Briefcase,
  Cat 
} from "lucide-react";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Client-side validation: Check passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    // Call server action
    const result = await signup(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300 selection:bg-purple-500/30">
      
      {/* --- LEFT SIDE: Background Image & Vibe --- */}
      <div 
        className="hidden lg:flex w-1/2 items-center justify-center relative p-12 border-r border-gray-200 dark:border-gray-800 bg-cover bg-center"
        style={{ backgroundImage: "url('/left.png')" }}
      >
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-purple-900/40 to-black/60 backdrop-blur-[1px]"></div>

        <div className="relative z-10 text-center space-y-6 max-w-lg text-white">
            <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full backdrop-blur-md mb-2 shadow-xl border border-white/10 animate-pulse">
                {/* Updated color to text-purple-300 to match Login Page */}
                <Cat className="w-10 h-10 text-purple-300" />
            </div>
            
            <h2 className="text-4xl font-black tracking-tight drop-shadow-lg">
                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">Pounce?</span>
            </h2>
            <p className="text-gray-200 text-lg font-medium drop-shadow-md leading-relaxed">
                Join thousands of organizers and attendees who have ditched the line. 
                Create your account and land on your feet.
            </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: Signup Form --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:px-24 bg-white dark:bg-[#0a0a0a] relative">
        
        {/* Logo Area */}
        <div className="flex justify-end mb-8">
          <div className="flex items-center gap-3">
            <div className="grid grid-cols-2 gap-1 w-8 h-8 shadow-lg shadow-purple-500/20 rounded-lg p-0.5 bg-white dark:bg-black/50">
               <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-sm"></div>
               <div className="border-2 border-purple-500 rounded-sm"></div>
               <div className="bg-purple-500/50 rounded-sm"></div>
               <div className="bg-gradient-to-tl from-cyan-400 to-blue-500 rounded-sm"></div>
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                VSCAN
            </span>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          
          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2 text-gray-900 dark:text-white tracking-tight">
              Join the <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">Litter</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Create your VSCAN account in seconds.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider ml-1">Full Name</label>
              <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    name="fullName"
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider ml-1">Email</label>
              <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
              </div>
            </div>

            {/* Role Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider ml-1">I am a...</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400 z-10" />
                <select
                  name="role"
                  className="w-full pl-10 pr-10 py-3 rounded-xl appearance-none bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all cursor-pointer"
                >
                  <option value="participant">Participant (I attend events)</option>
                  <option value="organizer">Organizer (I manage events)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider ml-1">Password</label>
              <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider ml-1">Confirm Password</label>
              <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transform active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-6 items-center">
            <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-widest">Or continue with</span>
            <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all font-medium
                       bg-white hover:bg-gray-50 border border-gray-200 text-gray-700
                       dark:bg-[#151515] dark:hover:bg-[#1a1a1a] dark:border-gray-800 dark:text-gray-200"
          >
             <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
            Google
          </button>

          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
              Log in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}