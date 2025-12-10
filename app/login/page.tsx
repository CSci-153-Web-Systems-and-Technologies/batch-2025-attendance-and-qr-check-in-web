'use client'

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "./actions"; 
import { 
  ShieldCheck, 
  Zap, 
  Eye, 
  ChevronDown, 
  Globe, 
  Lock, 
  FileText, 
  LifeBuoy,
  Cat 
} from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300 overflow-x-hidden selection:bg-purple-500/30">
      
      {/* --- HERO SECTION (Login Split) --- */}
      <section className="min-h-screen flex w-full relative">
        
        {/* LEFT SIDE: Background Image & Overlay */}
        <div 
            className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden p-12 border-r border-gray-200 dark:border-gray-800 bg-cover bg-center"
            style={{ backgroundImage: "url('/left.png')" }} 
        >
             {/* Dark Gradient Overlay for Text Readability */}
             <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 to-black/80 backdrop-blur-[1px]"></div>

             <div className="relative z-10 text-center space-y-6 max-w-lg text-white">
                <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full backdrop-blur-md mb-4 shadow-xl border border-white/10">
                    <Cat className="w-12 h-12 text-purple-300" />
                </div>
                
                <h2 className="text-4xl font-black tracking-tight drop-shadow-lg">
                    Stop <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">Herding Cats</span>. <br/>
                    Start Managing Events.
                </h2>
                <p className="text-gray-200 text-lg font-medium drop-shadow-md leading-relaxed">
                    The purr-fect solution for check-ins, tracking, and security. 
                    Don't let your queue turn into a cat-astrophe.
                </p>
             </div>
             
             {/* Scroll Indicator - Centered */}
             <button 
                onClick={scrollToFeatures} 
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce flex flex-col items-center gap-2"
             >
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Explore</span>
                <ChevronDown className="w-8 h-8" />
             </button>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:px-24 bg-white dark:bg-[#0a0a0a] relative">
          
          {/* Logo Area (Matched to Sidebar Style) */}
          <div className="flex justify-between items-center mb-10 lg:absolute lg:top-8 lg:right-12 lg:mb-0 w-full lg:w-auto">
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

          <div className="w-full max-w-md mx-auto relative z-10">
            <div className="mb-8">
              <h1 className="text-4xl font-black mb-3 text-gray-900 dark:text-white tracking-tight">
                Welcome Back, <br/>
                <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">Cool Cat</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Enter your credentials to access the dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider ml-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="meow@vscan.com"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider ml-1">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2 bg-gray-100 dark:bg-gray-800 dark:border-gray-700" />
                  Remember me
                </label>
                <a href="#" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transform active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Authenticating..." : "Log In"}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              New to the litter?{' '}
              <Link href="/signup" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
                Create an account
              </Link>
            </div>
            
            {/* Divider for Mobile Scroll - NOW CENTERED */}
            <div className="lg:hidden mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-center">
                <button onClick={scrollToFeatures} className="text-xs font-bold uppercase tracking-widest text-gray-400 flex flex-col items-center gap-2">
                    Explore Features
                    <ChevronDown className="w-4 h-4 animate-bounce" />
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-24 px-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
                    Why Hunters Choose <span className="text-purple-600">VSCAN</span>
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                    We've got the instincts to keep your event running smooth. No fluff, just results.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<Zap className="w-6 h-6 text-cyan-500" />}
                    title="Cat-like Reflexes"
                    desc="Scan entry codes in under 0.2 seconds. Agile, fast, and always lands on its feet."
                />
                <FeatureCard 
                    icon={<ShieldCheck className="w-6 h-6 text-purple-500" />}
                    title="Nine Lives Security"
                    desc="Encrypted passes that are tough to crack. We guard the gate like a tiger."
                />
                <FeatureCard 
                    icon={<Eye className="w-6 h-6 text-indigo-500" />}
                    title="Silent Paws Mode"
                    desc="Monitor attendance in real-time without making a sound. Stealth analytics at your fingertips."
                />
            </div>
        </div>
      </section>

      {/* --- ABOUT US --- */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-[#0f0f0f] border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
        {/* Background Blob */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
            <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                "We built VSCAN because waiting in line is about as fun as a bath. We believe events should be smooth, secure, and stress-free. We are a team of curious cats dedicated to making queue management purr-fectly simple."
            </p>
            <div className="pt-8">
                {/* Team Avatars Placeholder */}
                <div className="flex justify-center gap-2 mb-4">
                     {[1,2,3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-black flex items-center justify-center text-xs font-bold text-gray-400 shadow-sm">
                            <Cat className="w-5 h-5 opacity-50" />
                        </div>
                     ))}
                </div>
                <p className="text-sm text-gray-400 font-mono">EST. 2025 • CITY OF BAYBAY</p>
            </div>
        </div>
      </section>

      {/* --- FOOTER (Privacy, Terms, Support) --- */}
      <footer className="py-12 px-6 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            
            <div className="flex flex-col items-center md:items-start gap-3">
                {/* Logo in Footer */}
                <div className="flex items-center gap-3">
                    <div className="grid grid-cols-2 gap-0.5 w-6 h-6 rounded p-0.5 bg-gray-100 dark:bg-gray-900">
                       <div className="bg-purple-500 rounded-[1px]"></div>
                       <div className="bg-indigo-500 rounded-[1px]"></div>
                       <div className="bg-cyan-500 rounded-[1px]"></div>
                       <div className="bg-blue-500 rounded-[1px]"></div>
                    </div>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">VSCAN</span>
                </div>
                <p className="text-sm text-gray-500">© 2025 VSCAN Inc. All rights reserved.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
                <Link href="#" className="flex items-center gap-2 hover:text-purple-600 transition-colors">
                    <Lock className="w-4 h-4" /> Privacy Policy
                </Link>
                <Link href="#" className="flex items-center gap-2 hover:text-purple-600 transition-colors">
                    <FileText className="w-4 h-4" /> Terms of Service
                </Link>
                <Link href="#" className="flex items-center gap-2 hover:text-purple-600 transition-colors">
                    <LifeBuoy className="w-4 h-4" /> Support Center
                </Link>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-full">
                <Globe className="w-3 h-3" />
                <span>System Status: <span className="text-green-500 font-bold">Purring</span></span>
            </div>
        </div>
      </footer>

    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-8 rounded-3xl bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-gray-800 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 group">
            <div className="w-12 h-12 bg-white dark:bg-black rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                {desc}
            </p>
        </div>
    )
}