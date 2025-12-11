'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { QrCode, CalendarDays, Menu } from "lucide-react";
import SignOutButton from "./SignOutButton";
import { useState, useEffect } from "react"; 
import { cn } from "@/lib/utils";

// Updated type
type UserProfile = {
  full_name: string;
  email: string;
  role: string;
  avatar_url?: string;
}

export default function ParticipantSidebar({ profile }: { profile: UserProfile }) {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false); 
  const pathname = usePathname();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  const getButtonClass = (active: boolean) => {
    return cn(
      "w-full justify-start h-12 gap-4 transition-all",
      active 
        ? "bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-transparent border border-purple-100 dark:border-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold shadow-sm" 
        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
    );
  };

  const SidebarContent = (
    <div className="flex flex-col h-full">
        {/* Logo Area */}
        <div className="p-8 flex items-center gap-4">
           <div className="grid grid-cols-2 gap-1 w-10 h-10 shadow-lg shadow-purple-500/20 rounded-lg p-1 bg-white dark:bg-black/50">
               <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-sm"></div>
               <div className="border-2 border-purple-500 rounded-sm"></div>
               <div className="bg-purple-500/50 rounded-sm"></div>
               <div className="bg-gradient-to-tl from-cyan-400 to-blue-500 rounded-sm"></div>
          </div>
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            VSCAN
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 space-y-3 mt-4">
          <Link href="/" className="w-full" onClick={() => setOpen(false)}>
            <Button variant={isActive('/') ? "secondary" : "ghost"} className={getButtonClass(isActive('/'))}>
                <QrCode className={cn("w-5 h-5", isActive('/') ? "text-purple-600 dark:text-purple-400" : "")} />
                My QR Code
            </Button>
          </Link>
          <Link href="/my-events" className="w-full" onClick={() => setOpen(false)}>
            <Button variant={isActive('/my-events') ? "secondary" : "ghost"} className={getButtonClass(isActive('/my-events'))}>
                <CalendarDays className={cn("w-5 h-5", isActive('/my-events') ? "text-purple-600 dark:text-purple-400" : "")} />
                Events History
            </Button>
          </Link>
        </nav>

        {/* User Profile */}
        <div className="mt-auto p-6 border-t border-gray-200/50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-black/20">
            <SignOutButton profile={profile} />
        </div>
    </div>
  );

  if (!isMounted) {
    return (
       <aside className="hidden lg:flex flex-col w-72 bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 h-screen fixed top-0 left-0 z-30">
          {SidebarContent}
       </aside>
    );
  }

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="bg-white/80 dark:bg-black/50 backdrop-blur-md shadow-md border-gray-200 dark:border-gray-800">
                    <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-white/95 dark:bg-[#111]/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                {SidebarContent}
            </SheetContent>
        </Sheet>
      </div>
      <aside className="hidden lg:flex flex-col w-72 bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 h-screen fixed top-0 left-0 z-30">
        {SidebarContent}
      </aside>
    </>
  );
}