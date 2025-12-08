'use client' // <--- Add this at the very top

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "./actions"; // Import the server action we just made

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    // Call the server action
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Redirect handled by server action, but just in case:
      // router.push('/'); 
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[var(--background)] transition-colors duration-300">
      
      {/* LEFT SIDE: Illustration */}
      <div className="hidden lg:flex w-1/2 bg-blue-50 items-center justify-center relative overflow-hidden p-4">
           <img 
             src="/left.png" 
             alt="VSCAN Scanning Illustration" 
             className="object-contain w-full h-full z-10 relative"
           />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 -right-20 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* RIGHT SIDE: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:px-24 text-gray-900 dark:text-gray-200">
        
        {/* Logo Area */}
        <div className="flex justify-end mb-10 lg:absolute lg:top-8 lg:right-12">
          <div className="flex items-center gap-2 font-bold text-xl tracking-wider text-gray-900 dark:text-white transition-colors">
            <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
               <div className="bg-gray-900 dark:bg-gray-100 rounded-sm"></div>
               <div className="border-2 border-gray-900 dark:border-gray-100 rounded-sm"></div>
               <div className="bg-gray-900 dark:bg-gray-100 rounded-sm opacity-50"></div>
               <div className="bg-gray-900 dark:bg-gray-100 rounded-sm"></div>
            </div>
            VSCAN
          </div>
        </div>

        {/* Main Form Container */}
        <div className="w-full max-w-md mx-auto">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white transition-colors">Welcome</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
              Login para mahmo nakang demon hunter!
            </p>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email" // <--- IMPORTANT: This connects to FormData
                required
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-lg 
                           bg-white border border-gray-300 text-gray-900 
                           dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent 
                           transition-all"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password" // <--- IMPORTANT: This connects to FormData
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg 
                           bg-white border border-gray-300 text-gray-900 
                           dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent 
                           transition-all"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-600 dark:text-gray-400 cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 mr-2 dark:bg-gray-700 dark:border-gray-600"
                />
                Remember me
              </label>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-500 transition-colors">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-400 hover:opacity-90 text-white font-bold rounded-lg shadow-lg transform active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-6 items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700 transition-colors"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 dark:text-gray-500 text-sm transition-colors">Or</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700 transition-colors"></div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium
                       bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700
                       dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-gray-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>

          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors">
            Don't have an account?{' '}
            <Link href="/signup" className="text-cyan-600 dark:text-cyan-500 font-semibold hover:underline">
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}