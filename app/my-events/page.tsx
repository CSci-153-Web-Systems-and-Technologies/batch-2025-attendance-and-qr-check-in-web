import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import ParticipantSidebar from "@/components/ParticipantSidebar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Clock, Calendar, ArrowUpRight, CheckCircle2, History } from "lucide-react";
import Link from "next/link";

export default async function MyEventsPage() {
  const supabase = await createClient();

  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) redirect("/login");

  // 3. Fetch Attendance History
  const { data: attendanceRecords } = await supabase
    .from('attendance')
    .select(`
      id,
      check_in_time,
      check_out_time,
      status,
      events (
        id,
        title,
        location,
        start_time,
        end_time,
        cover_image_url
      )
    `)
    .eq('user_id', user.id)
    .order('check_in_time', { ascending: false });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      <ParticipantSidebar profile={profile} />

      <div className="flex-1 lg:ml-72 relative overflow-hidden">
        
        {/* BACKGROUND BLOBS (Matches Organizer Style) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto p-6 lg:p-10 space-y-10">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        Event History
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                        Your personal timeline of attended events.
                    </p>
                </div>
                {/* Stats Summary (Optional Polish) */}
                <div className="flex items-center gap-2 bg-white/50 dark:bg-white/5 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800 backdrop-blur-sm">
                    <History className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                        {attendanceRecords?.length || 0} Events Attended
                    </span>
                </div>
            </div>

            {/* Event Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {attendanceRecords && attendanceRecords.length > 0 ? (
                    attendanceRecords.map((record: any) => (
                        <div 
                            key={record.id} 
                            className="group relative bg-white/80 dark:bg-[#151515]/80 backdrop-blur-xl rounded-3xl p-1 shadow-xl shadow-gray-200/50 dark:shadow-none border border-white/50 dark:border-gray-800 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-1"
                        >
                            <div className="flex flex-col lg:flex-row h-full rounded-[20px] overflow-hidden bg-gray-50 dark:bg-[#0a0a0a]">
                                
                                {/* IMAGE SECTION */}
                                <div className="lg:w-64 h-48 lg:h-auto relative shrink-0 overflow-hidden">
                                    {record.events?.cover_image_url ? (
                                        <>
                                            <img 
                                                src={record.events.cover_image_url} 
                                                alt={record.events.title} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:bg-gradient-to-r" />
                                        </>
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                                            <CalendarDays className="w-12 h-12 text-purple-300" />
                                        </div>
                                    )}
                                    
                                    {/* STATUS BADGE */}
                                    <div className="absolute top-3 left-3">
                                        {record.status === 'checked-in' ? (
                                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 shadow-lg shadow-green-500/20 px-3 py-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-white mr-2 animate-pulse" />
                                                Live Now
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-md border border-white/10">
                                                <CheckCircle2 className="w-3 h-3 mr-1.5 text-gray-300" />
                                                Completed
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* CONTENT SECTION */}
                                <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between relative">
                                    
                                    <div>
                                        <div className="flex justify-between items-start gap-4">
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                {record.events?.title || "Unknown Event"}
                                            </h3>
                                            <Link href="#" className="p-2 bg-gray-100 dark:bg-white/5 rounded-full text-gray-400 group-hover:text-white group-hover:bg-purple-600 transition-all">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </Link>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-4 mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-2 bg-white dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
                                                <MapPin className="w-4 h-4 text-cyan-500" />
                                                {record.events?.location}
                                            </div>
                                            <div className="flex items-center gap-2 bg-white dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
                                                <Calendar className="w-4 h-4 text-purple-500" />
                                                {new Date(record.check_in_time).toLocaleDateString(undefined, {
                                                    weekday: 'short', month: 'short', day: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* TIMESTAMPS */}
                                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center gap-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Checked In</span>
                                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-mono text-sm font-bold">
                                                <Clock className="w-4 h-4" />
                                                {new Date(record.check_in_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                        </div>
                                        
                                        {record.check_out_time ? (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Checked Out</span>
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-mono text-sm font-bold">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(record.check_out_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Status</span>
                                                <span className="text-xs font-bold text-purple-500 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-md w-fit">
                                                    In Progress
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-gradient-to-tr from-gray-100 to-gray-50 dark:from-white/5 dark:to-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
                            <div className="absolute inset-0 rounded-full border border-gray-200 dark:border-white/10"></div>
                            <CalendarDays className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">No history yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                            You haven't attended any events yet. Once you scan in, your history will appear here instantly.
                        </p>
                        <Link href="/" className="mt-8">
                            <button className="px-6 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-medium hover:scale-105 transition-transform">
                                Go to Dashboard
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}