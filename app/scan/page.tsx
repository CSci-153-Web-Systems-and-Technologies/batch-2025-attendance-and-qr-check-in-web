import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import ScannerInterface from "@/components/ScannerInterface";

export default async function ScanPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: events } = await supabase
    .from('events')
    .select('id, title')
    .eq('organizer_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0a0a0a]">
       <ScannerInterface events={events || []} />
    </div>
  );
}