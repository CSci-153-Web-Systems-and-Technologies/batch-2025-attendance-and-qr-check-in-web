'use client'

import { useState } from 'react';
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Import Button
import { logAttendance } from '@/app/actions/scan';
import Link from 'next/link';
import { ArrowLeft, Camera, CheckCircle2, AlertTriangle, User, X } from 'lucide-react'; // Import X icon

type Event = { id: string; title: string };
type ScannedUser = { full_name: string; email: string; role: string; id: string };

export default function ScannerInterface({ events }: { events: Event[] }) {
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || "");
  const [lastScannedUser, setLastScannedUser] = useState<ScannedUser | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [stats, setStats] = useState({ total: 0, success: 0, duplicates: 0 });
  
  // NEW: State to control the mobile camera modal
  const [isMobileScannerOpen, setIsMobileScannerOpen] = useState(false);

  // 1. Handle Scan Logic
  const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (!selectedEventId) {
      toast.error("Please select an event first!");
      return;
    }

    if (detectedCodes && detectedCodes.length > 0) {
      const result = detectedCodes[0].rawValue;
      
      // Pause scanner UI momentarily
      setScanStatus('idle'); 

      // Call Server Action
      const response = await logAttendance(result, selectedEventId);

      if (response.success) {
        setScanStatus('success');
        toast.success(`Verified: ${response.user.full_name}`);
        setLastScannedUser(response.user);
        setStats(prev => ({ ...prev, total: prev.total + 1, success: prev.success + 1 }));
        
        // Optional: Close modal on success (uncomment if desired)
        // setIsMobileScannerOpen(false);
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
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 pb-24">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </Link>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Check-in Portal</h1>
                <p className="text-gray-500 text-sm">Scanner Operator Dashboard</p>
            </div>
        </div>
        
        {/* Event Selector */}
        <div className="w-full md:w-64">
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
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

      {/* STATS ROW */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
         <div className="bg-white dark:bg-[#111] p-3 md:p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center text-center">
             <span className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
             <span className="text-[10px] md:text-sm text-gray-500 uppercase tracking-wider font-medium mt-1">Total</span>
         </div>
         <div className="bg-white dark:bg-[#111] p-3 md:p-6 rounded-xl border-b-4 border-green-500 shadow-sm flex flex-col items-center justify-center text-center">
             <span className="text-2xl md:text-4xl font-bold text-green-600">{stats.success}</span>
             <span className="text-[10px] md:text-sm text-gray-500 uppercase tracking-wider font-medium mt-1">Success</span>
         </div>
         <div className="bg-white dark:bg-[#111] p-3 md:p-6 rounded-xl border-b-4 border-orange-500 shadow-sm flex flex-col items-center justify-center text-center">
             <span className="text-2xl md:text-4xl font-bold text-orange-600">{stats.duplicates}</span>
             <span className="text-[10px] md:text-sm text-gray-500 uppercase tracking-wider font-medium mt-1">Duplicate</span>
         </div>
      </div>

      {/* MOBILE TRIGGER BUTTON (Visible only on mobile) */}
      <div className="md:hidden">
        <Button 
            onClick={() => setIsMobileScannerOpen(true)}
            className="w-full py-8 text-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg"
        >
            <Camera className="w-6 h-6 mr-2" />
            Tap to Scan QR Code
        </Button>
      </div>

      {/* MAIN SPLIT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[600px]">
        
        {/* LEFT: CAMERA CONTAINER */}
        <div className={`
            ${/* Desktop: Always show in grid */ 'hidden lg:block lg:relative lg:h-full lg:w-full'}
            ${/* Mobile: Show as fixed modal if open */ isMobileScannerOpen ? '!block fixed inset-0 z-50 bg-black flex flex-col' : ''}
        `}>
            
            {/* Mobile Header (Only visible in modal mode) */}
            {isMobileScannerOpen && (
                <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                    <span className="text-white font-bold text-lg">Scanning...</span>
                    <button 
                        onClick={() => setIsMobileScannerOpen(false)}
                        className="bg-white/20 p-2 rounded-full text-white backdrop-blur-md"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            )}

            <Card className={`overflow-hidden bg-black relative border-0 shadow-xl h-full w-full ${isMobileScannerOpen ? 'rounded-none' : 'rounded-xl'}`}>
                <div className="absolute inset-0 z-10">
                    <Scanner 
                        onScan={handleScan}
                        scanDelay={2000} 
                        components={{ finder: false }}
                        constraints={{ facingMode: 'environment' }} // Force back camera
                    />
                </div>
                
                {/* Custom Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 border-2 border-cyan-400/50 rounded-3xl relative">
                        {/* Scanning Animation Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                        {/* Corners */}
                        <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-cyan-500 rounded-tl-xl"></div>
                        <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-cyan-500 rounded-tr-xl"></div>
                        <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-cyan-500 rounded-bl-xl"></div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-cyan-500 rounded-br-xl"></div>
                    </div>
                    {/* Hide text on mobile modal to keep it clean */}
                    {!isMobileScannerOpen && (
                        <p className="mt-8 text-white/80 font-medium bg-black/50 px-4 py-1 rounded-full backdrop-blur-md">
                            Point camera at QR Code
                        </p>
                    )}
                </div>
            </Card>
        </div>

        {/* RIGHT: PARTICIPANT INFO (ID CARD STYLE) */}
        <div className="flex flex-col h-full">
            <div className="mb-4 text-sm font-medium text-gray-500 uppercase tracking-wide">Participant Information</div>
            
            {lastScannedUser ? (
                 <div className={`
                    flex-1 rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all duration-500 shadow-sm
                    ${scanStatus === 'success' ? 'bg-white dark:bg-[#111] border-2 border-green-500/50' : 'bg-white dark:bg-[#111] border-2 border-red-500/50'}
                 `}>
                    
                    {/* Status Badge */}
                    <div className={`
                        mb-8 px-6 py-2 rounded-full font-bold text-lg flex items-center gap-2
                        ${scanStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                    `}>
                        {scanStatus === 'success' ? (
                            <><CheckCircle2 className="w-5 h-5" /> VERIFIED</>
                        ) : (
                            <><AlertTriangle className="w-5 h-5" /> CHECK ERROR</>
                        )}
                    </div>

                    {/* Avatar */}
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 p-1 mb-6">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-bold text-gray-400 overflow-hidden">
                            {lastScannedUser.full_name.charAt(0)}
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{lastScannedUser.full_name}</h2>
                    <p className="text-gray-500 text-base md:text-lg mb-6 break-all">{lastScannedUser.email}</p>
                    
                    <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-400 uppercase">Role</p>
                            <p className="font-semibold capitalize text-sm">{lastScannedUser.role}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-400 uppercase">User ID</p>
                            <p className="font-mono font-semibold text-sm truncate">{lastScannedUser.id.slice(0, 8)}</p>
                        </div>
                    </div>

                 </div>
            ) : (
                /* IDLE STATE */
                <div className="min-h-[300px] flex-1 bg-gray-50 dark:bg-gray-900/50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center text-center text-gray-400">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <User className="w-8 h-8 md:w-10 md:h-10 opacity-50" />
                    </div>
                    <p className="text-lg font-medium">Ready to Scan</p>
                    <p className="text-sm px-4">Tap "Scan QR Code" on mobile or use the camera on desktop.</p>
                </div>
            )}
        </div>

      </div>
      
      <style jsx global>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}