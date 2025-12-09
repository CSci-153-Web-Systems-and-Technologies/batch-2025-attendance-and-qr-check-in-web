'use client'

import { useState } from 'react';
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { toast } from 'sonner'; // Notifications
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { logAttendance } from '@/app/actions/scan';
import Link from 'next/link';
import { ArrowLeft, Camera, CheckCircle2, AlertTriangle, User } from 'lucide-react';

type Event = { id: string; title: string };
type ScannedUser = { full_name: string; email: string; role: string; id: string };

export default function ScannerInterface({ events }: { events: Event[] }) {
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || "");
  const [lastScannedUser, setLastScannedUser] = useState<ScannedUser | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [stats, setStats] = useState({ total: 0, success: 0, duplicates: 0 });

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
      } else {
        setScanStatus('error');
        const errorMessage = response.error || 'Unknown error occurred';
        toast.error(errorMessage);
        if (response.user) setLastScannedUser(response.user); // Show who caused the error
        if (errorMessage.includes("ALREADY")) {
           setStats(prev => ({ ...prev, total: prev.total + 1, duplicates: prev.duplicates + 1 }));
        }
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white dark:bg-[#111] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center">
             <span className="text-4xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
             <span className="text-sm text-gray-500 uppercase tracking-wider font-medium mt-1">Total Scans</span>
         </div>
         <div className="bg-white dark:bg-[#111] p-6 rounded-xl border-b-4 border-green-500 shadow-sm flex flex-col items-center justify-center">
             <span className="text-4xl font-bold text-green-600">{stats.success}</span>
             <span className="text-sm text-gray-500 uppercase tracking-wider font-medium mt-1">Successful</span>
         </div>
         <div className="bg-white dark:bg-[#111] p-6 rounded-xl border-b-4 border-orange-500 shadow-sm flex flex-col items-center justify-center">
             <span className="text-4xl font-bold text-orange-600">{stats.duplicates}</span>
             <span className="text-sm text-gray-500 uppercase tracking-wider font-medium mt-1">Duplicates</span>
         </div>
      </div>

      {/* MAIN SPLIT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        
        {/* LEFT: CAMERA */}
        <Card className="overflow-hidden bg-black relative border-0 shadow-xl">
            <div className="absolute inset-0 z-10">
                <Scanner 
                    onScan={handleScan}
                    scanDelay={2000} // 2 sec cooldown
                    components={{ finder: false }} // We build our own overlay
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
                <p className="mt-8 text-white/80 font-medium bg-black/50 px-4 py-1 rounded-full backdrop-blur-md">
                    Point camera at QR Code
                </p>
            </div>
        </Card>

        {/* RIGHT: PARTICIPANT INFO (ID CARD STYLE) */}
        <div className="flex flex-col h-full">
            <div className="mb-4 text-sm font-medium text-gray-500 uppercase tracking-wide">Participant Information</div>
            
            {lastScannedUser ? (
                 <div className={`
                    flex-1 rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all duration-500
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
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 p-1 mb-6">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-bold text-gray-400 overflow-hidden">
                            {/* If you had user avatars, put <img /> here. For now, Initials. */}
                            {lastScannedUser.full_name.charAt(0)}
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{lastScannedUser.full_name}</h2>
                    <p className="text-gray-500 text-lg mb-6">{lastScannedUser.email}</p>
                    
                    <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-400 uppercase">Role</p>
                            <p className="font-semibold capitalize">{lastScannedUser.role}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-400 uppercase">User ID</p>
                            <p className="font-mono font-semibold text-sm truncate">{lastScannedUser.id.slice(0, 8)}</p>
                        </div>
                    </div>

                 </div>
            ) : (
                /* IDLE STATE */
                <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center text-center text-gray-400">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <User className="w-10 h-10 opacity-50" />
                    </div>
                    <p className="text-lg font-medium">Ready to Scan</p>
                    <p className="text-sm">Participant details will appear here</p>
                </div>
            )}
        </div>

      </div>
      
      {/* Required style for scanning animation */}
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