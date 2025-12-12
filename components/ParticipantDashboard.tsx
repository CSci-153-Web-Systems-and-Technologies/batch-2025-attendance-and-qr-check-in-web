'use client'

import { QRCodeCanvas } from 'qrcode.react'; //
import { useRef } from 'react';
import ParticipantSidebar from "@/components/ParticipantSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ScanLine, Sparkles, CheckCircle2, Fingerprint } from "lucide-react";
import { toast } from "sonner";

type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export default function ParticipantDashboard({ profile }: { profile: UserProfile }) {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png'); //
      const a = document.createElement('a'); //
      a.href = url; //
      a.download = `vscan-pass-${profile.full_name.replace(/\s+/g, '-').toLowerCase()}.png`; //
      a.click(); //
      toast.success("Ticket downloaded successfully!");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      
      <ParticipantSidebar profile={profile} />

      <main className="flex-1 lg:ml-72 relative overflow-hidden">
        
        {/* Background Blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[0%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto p-6 lg:p-10 space-y-10">
            
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                    My Digital Pass <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                    Your universal access key for all VSCAN events.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                
                {/* LEFT: THE TICKET (Takes up 3 cols) */}
                <div className="lg:col-span-3">
                    <div ref={qrRef} className="relative group overflow-hidden rounded-3xl bg-white dark:bg-[#111] shadow-2xl shadow-purple-500/10 border border-gray-200 dark:border-gray-800 transition-all hover:shadow-purple-500/20">
                        
                        <div className="h-32 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 relative overflow-hidden p-6 flex items-start justify-between">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                            
                            <div className="relative z-10 text-white">
                                <div className="flex items-center gap-2 font-bold tracking-widest text-sm opacity-80 mb-1">
                                    <ScanLine className="w-4 h-4" /> VSCAN OFFICIAL
                                </div>
                                <h2 className="text-2xl font-black tracking-tight">Access Pass</h2>
                            </div>
                            
                            <div className="relative z-10 bg-white/20 backdrop-blur-md p-2 rounded-lg border border-white/10">
                                <Fingerprint className="w-8 h-8 text-white/90" />
                            </div>
                        </div>

                        {/* Ticket Body */}
                        <div className="p-8 flex flex-col items-center text-center relative">
                            {/* Cutout Circles (Visual Ticket Effect) */}
                            <div className="absolute -left-4 top-[-16px] w-8 h-8 bg-gray-50 dark:bg-[#0a0a0a] rounded-full" />
                            <div className="absolute -right-4 top-[-16px] w-8 h-8 bg-gray-50 dark:bg-[#0a0a0a] rounded-full" />

                            {/* QR Container */}
                            <div className="relative mb-6 p-4 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm group-hover:border-purple-300 transition-colors">
                                <QRCodeCanvas 
                                    value={profile.id} 
                                    size={200}
                                    level={"H"} 
                                    includeMargin={true}
                                />
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                    Scan to Verify
                                </div>
                            </div>

                            {/* User Info */}
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {profile.full_name}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">
                                {profile.email}
                            </p>
                            
                            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-4 py-1.5 text-xs font-bold uppercase tracking-wide border-0">
                                {profile.role}
                            </Badge>

                            {/* Unique ID Hash */}
                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 w-full flex justify-between items-center">
                                <div className="text-left">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Pass ID</p>
                                    <p className="font-mono text-xs text-gray-600 dark:text-gray-300">{profile.id.slice(0, 12).toUpperCase()}...</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Status</p>
                                    <p className="font-mono text-xs text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Active
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: ACTIONS & INFO (Takes up 2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Action Card */}
                    <div className="bg-white dark:bg-[#111] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Ticket Actions</h3>
                        <div className="space-y-3">
                            <Button 
                                onClick={downloadQR}
                                className="w-full h-12 bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity font-semibold rounded-xl shadow-lg shadow-gray-500/10"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Save to Gallery
                            </Button>
                        </div>
                    </div>

                    {/* Instructions Card */}
                    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl shadow-purple-900/20">
                        {/* Decorative Circle */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        
                        <h3 className="font-bold mb-4 relative z-10 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" /> Instructions
                        </h3>
                        
                        <ul className="space-y-4 relative z-10">
                            {[
                                "Arrive at the event check-in desk.",
                                "Present this digital pass to staff.",
                                "Wait for the scanner beep.",
                                "Enjoy the event!"
                            ].map((step, i) => (
                                <li key={i} className="flex gap-3 text-sm text-indigo-100">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">
                                        {i + 1}
                                    </span>
                                    <span className="leading-relaxed">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}