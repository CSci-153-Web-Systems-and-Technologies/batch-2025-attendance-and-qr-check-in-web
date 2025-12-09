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
  AlertCircle, 
  User, 
  X, 
  Scan, 
  Users, 
  Copy,
  LogOut,
  LogIn
} from 'lucide-react';

type Event = { id: string; title: string };
// Updated type to include the status from the server response
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

      // Calls the updated server action we created
      const response = await logAttendance(result, selectedEventId);

      if (response.success) {
        setScanStatus('success');
        
        // 1. Show the dynamic message (Check-in vs Check-out)
        toast.success(`${response.message} - ${response.user.full_name}`);
        
        // 2. Save the user AND their new status to state
        setLastScannedUser({ ...response.user, status: response.status });
        
        setStats(prev => ({ ...prev, total: prev.total + 1, success: prev.success + 1 }));
      } else {
        setScanStatus('error');
        const errorMessage = response.error || 'Unknown error occurred';
        toast.error(errorMessage);
        if (response.user) setLastScannedUser(response.user);
        if (errorMessage.includes("ALREADY")) {
           setStats(prev => ({ ...prev, total: prev.total + 1, duplicates: prev.duplicates + 1 }));
        }
      }
    }
  };

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden">
      
      {/* 1. BACKGROUND DECORATION (The "Vibe" Layer) */}
      <div className="absolute inset-0 z-[-1] bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-72 h-72 bg-cyan-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-gray-200/50 dark:border-gray-800/50">
          <div className="flex items-center gap-4">
              <Link href="/" className="p-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all text-gray-700 dark:text-gray-200">
                  <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                    Check-in Portal
                  </h1>
                  <p className="text-gray-500 text-sm font-medium">Ready to scan attendees</p>
              </div>
          </div>
          
          <div className="w-full md:w-72">
              <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                  <SelectTrigger className="h-12 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm rounded-xl">
                      <SelectValue placeholder="Select Event" />
                  </SelectTrigger>
                  <SelectContent>
                      {events.map(e => (
                          <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
          </div>
        </div>

        {/* STATS ROW - Now Colorful */}
        <div className="grid grid-cols-3 gap-3 md:gap-6">
           <Card className="p-4 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 flex flex-col items-center justify-center text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
               <div className="mb-2 p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full text-blue-600 dark:text-blue-400">
                  <Scan className="w-5 h-5" />
               </div>
               <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{stats.total}</span>
               <span className="text-[10px] md:text-xs font-bold text-blue-600/80 uppercase tracking-widest mt-1">Total Scans</span>
           </Card>

           <Card className="p-4 border-0 shadow-lg bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900 flex flex-col items-center justify-center text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />
               <div className="mb-2 p-2 bg-green-100 dark:bg-green-900/50 rounded-full text-green-600 dark:text-green-400">
                  <Users className="w-5 h-5" />
               </div>
               <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{stats.success}</span>
               <span className="text-[10px] md:text-xs font-bold text-green-600/80 uppercase tracking-widest mt-1">Verified</span>
           </Card>

           <Card className="p-4 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-900 flex flex-col items-center justify-center text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-orange-500" />
               <div className="mb-2 p-2 bg-orange-100 dark:bg-orange-900/50 rounded-full text-orange-600 dark:text-orange-400">
                  <Copy className="w-5 h-5" />
               </div>
               <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{stats.duplicates}</span>
               <span className="text-[10px] md:text-xs font-bold text-orange-600/80 uppercase tracking-widest mt-1">Duplicates</span>
           </Card>
        </div>

        {/* MOBILE BUTTON - Now Pulsing */}
        <div className="md:hidden">
          <Button 
              onClick={() => setIsMobileScannerOpen(true)}
              className="w-full py-8 text-lg rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] animate-gradient hover:scale-[1.02] transition-transform shadow-xl shadow-blue-500/20 border border-white/10"
          >
              <Camera className="w-6 h-6 mr-3 animate-pulse" />
              Tap to Scan QR Code
          </Button>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[600px]">
          
          {/* CAMERA SECTION */}
          <div className={`
              ${'hidden lg:block lg:relative lg:h-full lg:w-full'}
              ${isMobileScannerOpen ? '!block fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-300' : ''}
          `}>
              {isMobileScannerOpen && (
                  <div className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent">
                      <span className="text-white font-bold text-xl tracking-wide">Scanning...</span>
                      <button 
                          onClick={() => setIsMobileScannerOpen(false)}
                          className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white backdrop-blur-md transition-colors"
                      >
                          <X className="w-6 h-6" />
                      </button>
                  </div>
              )}

              <Card className={`overflow-hidden bg-black relative border-0 shadow-2xl h-full w-full ${isMobileScannerOpen ? 'rounded-none' : 'rounded-3xl border border-gray-800'}`}>
                  <div className="absolute inset-0 z-10">
                      <Scanner 
                          onScan={handleScan}
                          scanDelay={2000} 
                          components={{ finder: false }}
                          constraints={{ facingMode: 'environment' }}
                      />
                  </div>
                  
                  {/* Styled Overlay */}
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                      <div className="w-72 h-72 border-2 border-cyan-400/50 rounded-[2rem] relative shadow-[0_0_100px_rgba(6,182,212,0.2)]">
                          <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
                          {/* Decorative Corners */}
                          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl" />
                          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl" />
                          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl" />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-xl" />
                      </div>
                      {!isMobileScannerOpen && (
                          <div className="mt-8 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white font-medium text-sm">
                              Align QR code within frame
                          </div>
                      )}
                  </div>
              </Card>
          </div>

          {/* RESULTS CARD - Re-designed */}
          <div className="flex flex-col h-full">
              <div className="mb-4 text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  Live Results
              </div>
              
              {lastScannedUser ? (
                   <div className={`
                      flex-1 rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all duration-500 shadow-2xl relative overflow-hidden
                      ${scanStatus === 'success' 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-700 text-white scale-[1.02] ring-4 ring-green-500/20' 
                          : 'bg-white dark:bg-[#111] border-2 border-red-500'}
                   `}>
                      
                      {/* Success Background Pattern */}
                      {scanStatus === 'success' && (
                          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                      )}

                      <div className={`
                          mb-6 px-6 py-2 rounded-full font-bold text-sm tracking-wide flex items-center gap-2 shadow-lg
                          ${scanStatus === 'success' ? 'bg-white text-green-700' : 'bg-red-100 text-red-700'}
                      `}>
                          {scanStatus === 'success' ? (
                              lastScannedUser.status === 'checked-out' ? (
                                <><LogOut className="w-4 h-4" /> CHECKED-OUT</>
                              ) : (
                                <><LogIn className="w-4 h-4" /> CHECKED-IN</>
                              )
                          ) : (
                              <><AlertCircle className="w-4 h-4" /> SCAN ERROR</>
                          )}
                      </div>

                      <div className={`
                          w-28 h-28 rounded-full p-1 mb-6 shadow-xl
                          ${scanStatus === 'success' ? 'bg-white/30' : 'bg-red-100'}
                      `}>
                          <div className={`
                              w-full h-full rounded-full flex items-center justify-center text-4xl font-black overflow-hidden
                              ${scanStatus === 'success' ? 'bg-white text-green-600' : 'bg-white text-red-500'}
                          `}>
                              {lastScannedUser.full_name.charAt(0)}
                          </div>
                      </div>

                      <h2 className={`text-3xl font-bold mb-1 ${scanStatus === 'success' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                          {lastScannedUser.full_name}
                      </h2>
                      <p className={`text-lg mb-8 ${scanStatus === 'success' ? 'text-green-100' : 'text-gray-500'}`}>
                          {lastScannedUser.email}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                          <div className={`p-4 rounded-2xl ${scanStatus === 'success' ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                              <p className={`text-xs uppercase font-bold mb-1 ${scanStatus === 'success' ? 'text-green-200' : 'text-gray-400'}`}>Role</p>
                              <p className="font-semibold capitalize text-sm">{lastScannedUser.role}</p>
                          </div>
                          <div className={`p-4 rounded-2xl ${scanStatus === 'success' ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                              <p className={`text-xs uppercase font-bold mb-1 ${scanStatus === 'success' ? 'text-green-200' : 'text-gray-400'}`}>User ID</p>
                              <p className="font-mono font-semibold text-sm truncate">{lastScannedUser.id.slice(0, 8)}</p>
                          </div>
                      </div>

                   </div>
              ) : (
                  /* IDLE STATE */
                  <div className="flex-1 bg-white/50 dark:bg-[#111]/50 border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center text-center text-gray-400 hover:bg-gray-50 dark:hover:bg-[#111] transition-colors">
                      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                          <User className="w-10 h-10 opacity-30" />
                      </div>
                      <p className="text-xl font-semibold text-gray-600 dark:text-gray-300">Waiting for Scan</p>
                      <p className="text-sm px-8 mt-2 opacity-60">
                          Participant details will appear here instantly upon verification.
                      </p>
                  </div>
              )}
          </div>

        </div>
        
        {/* ANIMATIONS */}
        <style jsx global>{`
          @keyframes scan {
            0%, 100% { top: 0%; opacity: 0; }
            10% { opacity: 1; box-shadow: 0 0 20px rgba(34,211,238,1); }
            90% { opacity: 1; box-shadow: 0 0 20px rgba(34,211,238,1); }
            100% { top: 100%; opacity: 0; }
          }
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background-size: 200% auto;
            animation: gradient 4s ease infinite;
          }
        `}</style>
      </div>
    </div>
  );
}