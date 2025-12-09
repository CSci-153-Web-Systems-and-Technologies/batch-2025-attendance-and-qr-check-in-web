'use client'

import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import Link from "next/link";
import CreateEventModal from "./CreateEventModal";
import SignOutButton from "./SignOutButton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Users, QrCode, CalendarDays, TrendingUp, FileDown, Plus
} from "lucide-react";

// --- TYPES ---
export type DashboardStats = {
  totalParticipants: number;
  checkedInToday: number;
  totalEvents: number;
  recentCheckins: number; // replacing "pending"
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
  
  return (
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-[#0a0a0a] transition-colors duration-300">
      
      {/* SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#111] border-r border-gray-200 dark:border-gray-800 h-screen fixed top-0 left-0 z-20">
        <div className="p-6 flex items-center gap-3">
           <div className="grid grid-cols-2 gap-0.5 w-8 h-8">
               <div className="bg-purple-600 rounded-sm"></div>
               <div className="border-2 border-purple-600 rounded-sm"></div>
               <div className="bg-purple-600 rounded-sm opacity-50"></div>
               <div className="bg-purple-600 rounded-sm"></div>
          </div>
          <span className="text-xl font-bold tracking-wider text-gray-900 dark:text-white">VSCAN</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Button variant="secondary" className="w-full justify-start gap-3 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30">
            <CalendarDays className="w-4 h-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 dark:text-gray-400">
            <QrCode className="w-4 h-4" />
            Manage Events
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            Attendees
          </Button>
        </nav>

        {/* User Mini Profile */}
        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800">
            <SignOutButton profile={profile} />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-8 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Event Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back, here's your real-time overview.</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2 hidden sm:flex">
                    <FileDown className="w-4 h-4" /> Export Report
                </Button>
                <CreateEventModal />
            </div>
        </header>

        {/* 1. STATS ROW - NOW USING REAL PROPS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Check-ins</CardTitle>
                    <Users className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalParticipants}</div>
                    <p className="text-xs text-gray-500 mt-1">Lifetime scans</p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Checked-In Today</CardTitle>
                    <QrCode className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.checkedInToday}</div>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" /> Active Now
                    </p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Events</CardTitle>
                    <CalendarDays className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalEvents}</div>
                    <p className="text-xs text-gray-500 mt-1">Created by you</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Recent Activity</CardTitle>
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.recentCheckins}</div>
                    <p className="text-xs text-gray-500 mt-1">Scans in last 24h</p>
                </CardContent>
            </Card>
        </div>

        {/* 2. CHARTS ROW - NOW USING REAL DATA */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            
            {/* Trend Chart */}
            <Card className="lg:col-span-4 shadow-sm">
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
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', color: '#fff', borderRadius: '8px', border: 'none' }}
                                />
                                <Area type="monotone" dataKey="attendees" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAttendees)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="lg:col-span-3 shadow-sm">
                <CardHeader>
                    <CardTitle>Attendance by Event</CardTitle>
                    <CardDescription>Your top events</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] w-full flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.eventDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.eventDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.eventDistribution.length > 0 ? "Active" : "No Data"}
                            </span>
                        </div>
                    </div>
                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {stats.eventDistribution.map((type, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></div>
                                <span className="truncate max-w-[120px]">{type.name}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* 3. BOTTOM ROW: QUICK ACTIONS & NOTIFICATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* SCANNER CARD */}
            <Link href="/scan" className="block h-full">
                <div className="h-full bg-gradient-to-br from-gray-900 to-black rounded-xl p-8 text-white relative overflow-hidden group cursor-pointer border border-gray-800 hover:border-purple-500/50 transition-all shadow-lg">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                                <QrCode className="w-7 h-7 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Scan QR Codes</h3>
                            <p className="text-gray-400 mb-8 max-w-sm">
                                Open the camera to scan attendee tickets and automatically mark them as present.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-purple-300 font-semibold group-hover:translate-x-2 transition-transform">
                            Launch Scanner <span className="text-xl">→</span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Recent Notifications (Static for now) */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Notifications</CardTitle>
                    <CardDescription>Latest system updates and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 mt-2 rounded-full bg-green-500 shrink-0"></div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">System online</p>
                                <p className="text-xs text-muted-foreground">Ready to create events</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

      </main>
    </div>
  );
}