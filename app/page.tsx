import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import ParticipantDashboard from "@/components/ParticipantDashboard";
import OrganizerDashboard, { DashboardStats } from "@/components/OrganizerDashboard";

export default async function Home() {
  const supabase = await createClient();

  // 1. Check Login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 3. TRAFFIC COP: Show dashboard based on role
  if (profile?.role === 'organizer') {
    
    // --- ORGANIZER DATA FETCHING ---
    
    // A. Get all events by this organizer
    const { data: events, count: totalEvents } = await supabase
        .from('events')
        .select('id, title', { count: 'exact' })
        .eq('organizer_id', user.id);

    // B. Get all attendance records for these events
    const eventIds = events?.map(e => e.id) || [];
    let attendanceData: any[] = [];
    
    if (eventIds.length > 0) {
        const { data } = await supabase
            .from('attendance')
            .select('scanned_at, event_id')
            .in('event_id', eventIds);
        attendanceData = data || [];
    }

    // C. Calculate Stats
    const totalParticipants = attendanceData.length;
    
    // "Checked in Today" logic
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    const checkedInToday = attendanceData.filter(a => a.scanned_at.startsWith(today)).length;
    
    // D. Process Data for Charts

    // 1. Trend Data (Last 7 Days)
    const trendMap = new Map<string, number>();
    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", "Tue"
        trendMap.set(dateStr, 0);
    }
    // Fill with actual data
    attendanceData.forEach(a => {
        const dateStr = new Date(a.scanned_at).toLocaleDateString('en-US', { weekday: 'short' });
        if (trendMap.has(dateStr)) {
            trendMap.set(dateStr, (trendMap.get(dateStr) || 0) + 1);
        }
    });
    const trendData = Array.from(trendMap).map(([name, attendees]) => ({ name, attendees }));

    // 2. Pie Chart (Attendance by Event)
    const eventCounts: Record<string, number> = {};
    attendanceData.forEach(a => {
        const eventTitle = events?.find(e => e.id === a.event_id)?.title || "Unknown";
        eventCounts[eventTitle] = (eventCounts[eventTitle] || 0) + 1;
    });
    
    // Define some colors for the pie slices
    const colors = ['#06b6d4', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
    const eventDistribution = Object.entries(eventCounts)
        .map(([name, value], index) => ({
            name,
            value,
            color: colors[index % colors.length]
        }))
        .sort((a, b) => b.value - a.value) // Sort highest first
        .slice(0, 5); // Take top 5

    const stats: DashboardStats = {
        totalParticipants,
        checkedInToday,
        totalEvents: totalEvents || 0,
        recentCheckins: checkedInToday, // Re-using today's count for this stat
        trendData,
        eventDistribution
    };

    return <OrganizerDashboard profile={profile} stats={stats} />;
  }

  // Default to Participant view
  return <ParticipantDashboard profile={profile} />;
}