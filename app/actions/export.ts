'use server'

import { createClient } from '@/lib/server'

// 1. Define the shape of the data manually to fix the TypeScript error
type AttendanceExport = {
  check_in_time: string | null
  check_out_time: string | null
  status: string
  profiles: {
    full_name: string | null
    email: string | null
  } | null // <--- We explicitly say this is an Object, not an Array
  events: {
    title: string | null
  } | null // <--- We explicitly say this is an Object, not an Array
}

export async function exportAttendanceData() {
  const supabase = await createClient()

  // Authenticate
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Fetch events
  const { data: events } = await supabase
    .from('events')
    .select('id')
    .eq('organizer_id', user.id)

  const eventIds = events?.map(e => e.id) || []

  if (eventIds.length === 0) {
    return { error: "No events found to export." }
  }

  // 2. Fetch Data
  const { data } = await supabase
    .from('attendance')
    .select(`
      check_in_time,
      check_out_time,
      status,
      profiles (full_name, email),
      events (title)
    `)
    .in('event_id', eventIds)
    .order('check_in_time', { ascending: false })

  if (!data || data.length === 0) {
    return { error: "No attendance data found." }
  }

  // 3. CAST THE DATA to our new type
  // This forces TypeScript to treat events/profiles as objects
  const attendance = data as unknown as AttendanceExport[]

  // 4. Convert to CSV
  const headers = ['Event Name', 'Participant Name', 'Email', 'Check In Time', 'Check Out Time', 'Status']
  const csvRows = [headers.join(',')]

  attendance.forEach(record => {
    const row = [
      `"${record.events?.title || 'Unknown'}"`,
      `"${record.profiles?.full_name || 'Unknown'}"`,
      `"${record.profiles?.email || 'Unknown'}"`,
      `"${record.check_in_time ? new Date(record.check_in_time).toLocaleString() : ''}"`,
      `"${record.check_out_time ? new Date(record.check_out_time).toLocaleString() : ''}"`,
      `"${record.status}"`
    ]
    csvRows.push(row.join(','))
  })

  const csvString = csvRows.join('\n')

  return { success: true, csv: csvString }
}