'use client'

import { useState } from "react"; 
import { toast } from "sonner"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import CreateEventModal from "./CreateEventModal";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Users, QrCode, CalendarDays, TrendingUp, FileDown, Activity, Bell, Loader2
} from "lucide-react";
import OrganizerSidebar from "./OrganizerSidebar"; 
import { exportAttendanceData } from "@/app/actions/export"; 

// --- TYPES ---
export type DashboardStats = {
  totalParticipants: number;
  checkedInToday: number;
  totalEvents: number;
  recentCheckins: number;
  trendData: { name: string; attendees: number }[];
  eventDistribution: { name: string; value: number; color: string }[];
}

type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export default function OrganizerDashboard({ profile, stats }: { profile: UserProfile, stats: DashboardStats }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    toast.info("Preparing export...");

    const result = await exportAttendanceData();

    if (result.success && result.csv) {
      // Create a blob and trigger download
      const blob = new Blob([result.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vscan-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Export downloaded successfully!");
    } else {
      toast.error(result.error || "Failed to export data");
    }
    setExporting(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300 relative overflow-hidden">
      
      {/* BACKGROUND BLOBS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      <OrganizerSidebar profile={profile} />

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-72 p-6 lg:p-10 space-y-10 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Event Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Real-time overview & analytics.</p>
            </div>
            <div className="flex items-center gap-3">
                <Button 
                    variant="outline" 
                    onClick={handleExport}
                    disabled={exporting}
                    className="gap-2 h-11 hidden sm:flex bg-white/50 dark:bg-black/50 border-gray-200 dark:border-gray-800 backdrop-blur-sm hover:bg-white dark:hover:bg-black transition-all"
                >
                    {exporting ? (
                        <Loader2 className="w-4 h-4 animate-spin" /> 
                    ) : (
                        <FileDown className="w-4 h-4" /> 
                    )}
                    {exporting ? "Exporting..." : "Export"}
                </Button>
                <CreateEventModal />
            </div>
        </header>

        {/* 1. STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg shadow-purple-500/5 bg-gradient-to-br from-white to-purple-50/50 dark:from-[#151515] dark:to-purple-900/10 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                    <Users className="w-24 h-24 text-purple-600" />
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Total Check-ins</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black text-gray-900 dark:text-white">{stats.totalParticipants}</div>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Lifetime scans recorded</p>
                </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg shadow-cyan-500/5 bg-gradient-to-br from-white to-cyan-50/50 dark:from-[#151515] dark:to-cyan-900/10 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                    <TrendingUp className="w-24 h-24 text-cyan-600" />
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Active Today</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black text-gray-900 dark:text-white">{stats.checkedInToday}</div>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <p className="text-sm text-gray-500 font-medium">Live updates</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-lg shadow-blue-500/5 bg-gradient-to-br from-white to-blue-50/50 dark:from-[#151515] dark:to-blue-900/10 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                    <CalendarDays className="w-24 h-24 text-blue-600" />
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Total Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black text-gray-900 dark:text-white">{stats.totalEvents}</div>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Events managed</p>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-lg shadow-orange-500/5 bg-gradient-to-br from-white to-orange-50/50 dark:from-[#151515] dark:to-orange-900/10 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                    <Activity className="w-24 h-24 text-orange-600" />
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">24h Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black text-gray-900 dark:text-white">{stats.recentCheckins}</div>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Recent interactions</p>
                </CardContent>
            </Card>
        </div>

        {/* 2. CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
            
            {/* Trend Chart */}
            <Card className="lg:col-span-4 border-0 shadow-xl bg-white/50 dark:bg-[#111]/50 backdrop-blur-md">
                <CardHeader>
                    <CardTitle>Attendance Trends</CardTitle>
                    <CardDescription>Daily check-ins over the past week</CardDescription>
                </CardHeader>
                <CardContent className="pl-0">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAttendees" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', color: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                />
                                <Area type="monotone" dataKey="attendees" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAttendees)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="lg:col-span-3 border-0 shadow-xl bg-white/50 dark:bg-[#111]/50 backdrop-blur-md">
                <CardHeader>
                    <CardTitle>Event Distribution</CardTitle>
                    <CardDescription>Top active events</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] w-full flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.eventDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    cornerRadius={6}
                                >
                                    {stats.eventDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', color: '#fff', borderRadius: '8px', border: 'none' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-3xl font-black text-gray-900 dark:text-white">
                                {stats.eventDistribution.length > 0 ? "100%" : "0%"}
                            </span>
                            <span className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">Status</span>
                        </div>
                    </div>
                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {stats.eventDistribution.map((type, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-white/5 px-2 py-1 rounded-md">
                                <div className="w-2 h-2 rounded-full shadow-[0_0_8px]" style={{ backgroundColor: type.color, boxShadow: `0 0 8px ${type.color}` }}></div>
                                <span className="truncate max-w-[100px]">{type.name}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* 3. BOTTOM ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* SCANNER CARD */}
            <Link href="/scan" className="block h-full group">
                <div className="h-full bg-black rounded-2xl p-8 text-white relative overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all shadow-2xl group-hover:shadow-purple-500/20">
                    {/* Background Animation */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600 rounded-full blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                    
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform">
                                    <QrCode className="w-8 h-8 text-purple-300" />
                                </div>
                                <h3 className="text-3xl font-bold mb-2 tracking-tight">Scan QR Codes</h3>
                                <p className="text-gray-400 mb-8 max-w-sm leading-relaxed">
                                    Open the camera interface to scan tickets. Supports instant verification and duplicate detection.
                                </p>
                            </div>
                            <div className="bg-purple-500/20 p-2 rounded-full animate-pulse">
                                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-purple-300 font-bold group-hover:text-purple-200 transition-colors">
                            <span className="bg-purple-500/20 px-4 py-2 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-all">Launch Scanner</span>
                            <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Notifications */}
            <Card className="border-0 shadow-xl bg-white/50 dark:bg-[#111]/50 backdrop-blur-md h-full">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>System Updates</CardTitle>
                            <CardDescription>Real-time system activity logs</CardDescription>
                        </div>
                        <Bell className="w-5 h-5 text-gray-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">System Online</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">All systems operational. Ready to process new events.</p>
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono ml-auto">NOW</span>
                        </div>
                        
                        <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">New Registration</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">New participants are registering for upcoming events.</p>
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono ml-auto">2m</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

      </main>
    </div>
  );
}