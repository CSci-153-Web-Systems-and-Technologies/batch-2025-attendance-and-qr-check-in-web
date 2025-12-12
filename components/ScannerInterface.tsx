'use client'

import { useState } from 'react';
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logAttendance } from '@/app/actions/scan';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  X, 
  ScanLine, 
  Users, 
  Layers,
  Zap,
  Activity,
  LogOut,
  LogIn
} from 'lucide-react';

type Event = { id: string; title: string };
type ScannedUser = { full_name: string; email: string; role: string; id: string; status?: 'checked-in' | 'checked-out' };

export default function ScannerInterface({ events }: { events: Event[] }) {
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || "");
  const [lastScannedUser, setLastScannedUser] = useState<ScannedUser | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [stats, setStats] = useState({ total: 0, success: 0, duplicates: 0 });
  const [isMobileScannerOpen, setIsMobileScannerOpen] = useState(false);

  const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (!selectedEventId) {
      toast.error("Please select an event first!");
      return;
    }

    if (detectedCodes && detectedCodes.length > 0) {
      const result = detectedCodes[0].rawValue;
      setScanStatus('idle'); 

      const response = await logAttendance(result, selectedEventId);

      if (response.success) {
        setScanStatus('success');
        toast.success(response.message);
        setLastScannedUser({ ...response.user, status: response.status });
        setStats(prev => ({ ...prev, total: prev.total + 1, success: prev.success + 1 }));
      } else {
        setScanStatus('error');
        const errorMessage = response.error || 'Unknown error occurred';
        toast.error(errorMessage);
        if (response.user) setLastScannedUser(response.user);
        if (errorMessage.includes("already") || errorMessage.includes("ALREADY")) {
           setStats(prev => ({ ...prev, total: prev.total + 1, duplicates: prev.duplicates + 1 }));
        }
      }
    }
  };

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* 1. BACKGROUND DECORATION (Cyber Grid) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         {/* Cyber Grid Pattern */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.07]"></div>
         
         {/* Glowing Blobs */}
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 p-4 md:p-6 max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
              <Link href="/" className="group p-3 rounded-2xl bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-800 shadow-sm hover:border-purple-500/50 transition-all">
                  <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-purple-500" />
              </Link>
              <div>
                  <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                    <ScanLine className="w-6 h-6 text-cyan-500" />
                    <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        Check-in Portal
                    </span>
                  </h1>
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mt-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      SYSTEM ONLINE
                  </div>
              </div>
          </div>
          
          <div className="w-full md:w-80">
              <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                  <SelectTrigger className="h-12 bg-white dark:bg-[#151515] border-gray-200 dark:border-gray-800 rounded-xl focus:ring-purple-500/50 shadow-sm">
                      <SelectValue placeholder="Select Active Event" />
                  </SelectTrigger>
                  <SelectContent>
                      {events.map(e => (
                          <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
          </div>
        </div>

        {/* STATS ROW (Glassmorphic) */}
        <div className="grid grid-cols-3 gap-3 md:gap-6">
           <StatCard 
              icon={<Activity className="w-5 h-5 text-cyan-400" />}
              value={stats.total}
              label="Total Scans"
              color="cyan"
           />
           <StatCard 
              icon={<CheckCircle2 className="w-5 h-5 text-purple-400" />}
              value={stats.success}
              label="Verified"
              color="purple"
           />
           <StatCard 
              icon={<Layers className="w-5 h-5 text-pink-400" />}
              value={stats.duplicates}
              label="Duplicates"
              color="pink"
           />
        </div>

        {/* MOBILE TRIGGER */}
        <div className="md:hidden">
          <Button 
              onClick={() => setIsMobileScannerOpen(true)}
              className="w-full py-8 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 shadow-xl shadow-purple-500/20 border border-white/10 relative overflow-hidden group"
          >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Camera className="w-6 h-6 mr-3" />
              Launch Scanner
          </Button>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-auto lg:h-[550px]">
          
          {/* LEFT: SCANNER HUD */}
          <div className={`
              ${'hidden lg:block lg:relative lg:h-full lg:w-full'}
              ${isMobileScannerOpen ? '!block fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in zoom-in-95 duration-200' : ''}
          `}>
              {isMobileScannerOpen && (
                  <div className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent">
                      <span className="text-white font-mono text-sm tracking-widest">SCANNING MODULE ACTIVE</span>
                      <button 
                          onClick={() => setIsMobileScannerOpen(false)}
                          className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white backdrop-blur-md transition-colors"
                      >
                          <X className="w-6 h-6" />
                      </button>
                  </div>
              )}

              <Card className={`overflow-hidden bg-black relative border-0 shadow-2xl h-full w-full flex flex-col ${isMobileScannerOpen ? 'rounded-none' : 'rounded-3xl border border-gray-800'}`}>
                  
                  {/* The Scanner Component */}
                  <div className="flex-1 relative">
                      <Scanner 
                          onScan={handleScan}
                          scanDelay={2000} 
                          components={{ finder: false }}
                          constraints={{ facingMode: 'environment' }}
                      />
                      
                      {/* HUD Overlay */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          {/* Corner Brackets */}
                          <div className="w-64 h-64 relative">
                              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-500 rounded-tl-lg shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
                              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-500 rounded-tr-lg shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
                              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-500 rounded-bl-lg shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
                              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-500 rounded-br-lg shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
                              
                              {/* Scanning Laser */}
                              <div className="absolute top-0 left-4 right-4 h-0.5 bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,1)] animate-scan"></div>
                          </div>
                      </div>

                      {/* Status Text */}
                      <div className="absolute bottom-8 left-0 right-0 text-center">
                          <span className="inline-block px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-cyan-300">
                             ALIGN QR CODE
                          </span>
                      </div>
                  </div>
              </Card>
          </div>

          {/* RIGHT: LIVE RESULTS */}
          <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                   <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                       Live Feed
                   </h3>
                   <div className="flex gap-1">
                       <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" />
                       <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce delay-75" />
                       <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce delay-150" />
                   </div>
              </div>
              
              <div className="flex-1 relative perspective-1000">
                  {lastScannedUser ? (
                       <div className={`
                          h-full w-full rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all duration-500 relative overflow-hidden
                          ${scanStatus === 'success' 
                              ? 'bg-gradient-to-br from-[#1a1a1a] to-black border border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.15)]' 
                              : 'bg-[#1a1a1a] border border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.15)]'}
                       `}>
                          
                          {/* Animated Background Gradient */}
                          <div className={`absolute inset-0 opacity-20 bg-gradient-to-tr ${scanStatus === 'success' ? 'from-purple-600 via-transparent to-cyan-600' : 'from-red-600 via-transparent to-orange-600'}`}></div>

                          {/* Status Badge */}
                          <div className={`
                              mb-8 px-6 py-2 rounded-full font-bold text-xs tracking-wider flex items-center gap-2 border shadow-lg z-10
                              ${scanStatus === 'success' 
                                  ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                  : 'bg-red-500/10 text-red-400 border-red-500/20'}
                          `}>
                              {scanStatus === 'success' ? (
                                  lastScannedUser.status === 'checked-out' ? (
                                    <><LogOut className="w-4 h-4" /> CHECKED OUT</>
                                  ) : (
                                    <><LogIn className="w-4 h-4" /> CHECKED IN</>
                                  )
                              ) : (
                                  <><AlertTriangle className="w-4 h-4" /> SCAN REJECTED</>
                              )}
                          </div>

                          {/* Avatar */}
                          <div className="relative mb-6 z-10">
                              <div className={`absolute inset-0 rounded-full blur-xl opacity-40 ${scanStatus === 'success' ? 'bg-purple-500' : 'bg-red-500'}`}></div>
                              <div className="w-24 h-24 rounded-full bg-gray-900 border-2 border-white/10 flex items-center justify-center relative overflow-hidden">
                                  <span className="text-3xl font-black text-white">
                                      {lastScannedUser.full_name.charAt(0)}
                                  </span>
                              </div>
                          </div>

                          {/* User Details */}
                          <h2 className="text-2xl font-bold text-white mb-1 z-10 relative">
                              {lastScannedUser.full_name}
                          </h2>
                          <p className="text-gray-400 mb-8 z-10 relative text-sm">
                              {lastScannedUser.email}
                          </p>
                          
                          {/* Info Grid */}
                          <div className="grid grid-cols-2 gap-4 w-full z-10 relative">
                              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                  <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Role</p>
                                  <p className="font-semibold text-gray-200 capitalize text-sm">{lastScannedUser.role}</p>
                              </div>
                              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                  <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">ID Hash</p>
                                  <p className="font-mono text-xs text-purple-400 truncate">{lastScannedUser.id}</p>
                              </div>
                          </div>

                       </div>
                  ) : (
                      /* IDLE STATE */
                      <div className="h-full w-full bg-white dark:bg-[#151515] border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center text-center group hover:border-purple-500/30 transition-colors">
                          <div className="w-24 h-24 bg-gray-50 dark:bg-black rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                              <Zap className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                          </div>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">Ready to Scan</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xs px-4">
                              Point the camera at a QR code to instantly verify attendee status.
                          </p>
                      </div>
                  )}
              </div>
          </div>

        </div>
        
        {/* CSS FOR SCANNING ANIMATION */}
        <style jsx global>{`
          @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
          .animate-scan {
            animation: scan 2s linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode, value: number, label: string, color: 'cyan' | 'purple' | 'pink' }) {
    
    const colors = {
        cyan: "from-cyan-500/10 to-transparent border-cyan-500/20 text-cyan-500",
        purple: "from-purple-500/10 to-transparent border-purple-500/20 text-purple-500",
        pink: "from-pink-500/10 to-transparent border-pink-500/20 text-pink-500"
    };

    return (
        <Card className={`
            p-5 border bg-gradient-to-br ${colors[color]} 
            bg-white dark:bg-[#111] dark:bg-opacity-40 backdrop-blur-md shadow-lg
            flex flex-col items-center justify-center text-center relative overflow-hidden group
        `}>
            <div className={`mb-3 p-3 rounded-xl bg-${color}-500/10 ring-1 ring-${color}-500/20 group-hover:scale-110 transition-transform`}>
               {icon}
            </div>
            <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{value}</span>
            <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-1">{label}</span>
        </Card>
    )
}