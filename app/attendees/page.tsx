import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import OrganizerSidebar from "@/components/OrganizerSidebar";
import AttendeesList from "@/components/AttendeesList";
import AddAttendeeModal from "@/components/AddAttendeeModal";

export default async function AttendeesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'organizer') redirect("/");

  const { data: events } = await supabase
    .from('events')
    .select('id, title') 
    .eq('organizer_id', user.id);

  const eventIds = events?.map(e => e.id) || [];
  let attendanceData: any[] = [];
  
  if (eventIds.length > 0) {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
            id,
            check_in_time,
            check_out_time,
            status,
            profiles (full_name, email, avatar_url),
            events (id, title, location)
        `)
        .in('event_id', eventIds)
        .order('check_in_time', { ascending: false });
      
      if (!error && data) {
          attendanceData = data;
      }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      <OrganizerSidebar profile={profile} />
      
      <div className="flex-1 lg:ml-72 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
            
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendees</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Real-time list of all participants across your events.
                </p>
            </div>

            {/* List Component with Events Prop */}
            <div className="flex flex-col gap-6">
                <div className="flex justify-end">
                    <AddAttendeeModal events={events || []} />
                </div>
                
                <AttendeesList 
                    initialData={attendanceData} 
                    events={events || []} 
                />
            </div>
            
        </div>
      </div>
    </div>
  );
}