import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import OrganizerSidebar from "@/components/OrganizerSidebar";
import ParticipantSidebar from "@/components/ParticipantSidebar";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();

  // 1. Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Profile Fetch
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) redirect("/login");

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      
      {/* Dynamic Sidebar */}
      {profile.role === 'organizer' ? (
        <OrganizerSidebar profile={profile} />
      ) : (
        <ParticipantSidebar profile={profile} />
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 relative overflow-hidden">
        
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto p-6 lg:p-10 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Account Settings</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your personal details and preferences.</p>
          </div>

          <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-purple-500/5 border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
             <SettingsForm profile={profile} />
          </div>
        
        </div>
      </div>
    </div>
  );
}