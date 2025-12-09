import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import EventsList from "@/components/EventsList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CreateEventModal from "@/components/CreateEventModal";
import OrganizerSidebar from "@/components/OrganizerSidebar"; 

export default async function EventsPage() {
  const supabase = await createClient();

  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Fetch Profile (Needed for the Sidebar)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 3. Fetch Events
  // Select '*' ensures we get description & cover_image_url for the Edit modal
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      
      {/* 4. Sidebar */}
      <OrganizerSidebar profile={profile} />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 relative overflow-hidden">
        
        {/* Background Decor */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
                {/* Mobile Back Button (Hidden on Desktop since we have sidebar) */}
                <Link href="/" className="lg:hidden p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all text-gray-700 dark:text-gray-200">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Events</h1>
                <p className="text-gray-500 dark:text-gray-400">View and edit your event details.</p>
                </div>
            </div>
            
            <CreateEventModal />
            </div>

            {/* The Table Component */}
            <EventsList events={events || []} />
            
        </div>
      </div>
    </div>
  );
}