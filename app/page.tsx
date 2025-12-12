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

  // 3. ORGANIZER LOGIC
  if (profile?.role === 'organizer') {
    
    // A. Get all events by this organizer
    const { data: events, count: totalEvents } = await supabase
        .from('events')
        .select('id, title', { count: 'exact' })
        .eq('organizer_id', user.id);

    // B. Get all attendance records for these events
    const eventIds = events?.map(e => e.id) || [];
    let attendanceData: any[] = [];
    
    if (eventIds.length > 0) {
        // UPDATED: Fetch 'check_in_time' and 'status' instead of 'scanned_at'
        const { data } = await supabase
            .from('attendance')
            .select('check_in_time, status, event_id')
            .in('event_id', eventIds);
        attendanceData = data || [];
    }

    // C. Calculate Stats
    
    // 1. Total unique check-ins (lifetime)
    const totalParticipants = attendanceData.length;
    
    const activeNow = attendanceData.filter(a => 
        a.status === 'checked-in' || a.status === 'present'
    ).length;
    
    // 3. "Activity Today" -> Anyone who interacted (in OR out) today
    const today = new Date().toISOString().split('T')[0];
    const activityToday = attendanceData.filter(a => 
        a.check_in_time && a.check_in_time.startsWith(today)
    ).length;
    
    // D. Process Data for Charts (Trends)
    const trendMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
        trendMap.set(dateStr, 0);
    }
    
    attendanceData.forEach(a => {
        if (a.check_in_time) {
            const dateStr = new Date(a.check_in_time).toLocaleDateString('en-US', { weekday: 'short' });
            if (trendMap.has(dateStr)) {
                trendMap.set(dateStr, (trendMap.get(dateStr) || 0) + 1);
            }
        }
    });
    const trendData = Array.from(trendMap).map(([name, attendees]) => ({ name, attendees }));

    // E. Pie Chart (Attendance by Event)
    const eventCounts: Record<string, number> = {};
    attendanceData.forEach(a => {
        const eventTitle = events?.find(e => e.id === a.event_id)?.title || "Unknown";
        eventCounts[eventTitle] = (eventCounts[eventTitle] || 0) + 1;
    });
    
    const colors = ['#06b6d4', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
    const eventDistribution = Object.entries(eventCounts)
        .map(([name, value], index) => ({
            name,
            value,
            color: colors[index % colors.length]
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    const stats: DashboardStats = {
        totalParticipants,
        checkedInToday: activeNow,
        totalEvents: totalEvents || 0,
        recentCheckins: activityToday,
        trendData,
        eventDistribution
    };

    return <OrganizerDashboard profile={profile} stats={stats} />;
  }

  return <ParticipantDashboard profile={profile} />;
}