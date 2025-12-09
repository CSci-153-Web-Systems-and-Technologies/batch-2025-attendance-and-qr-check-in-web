'use server'

import { createClient } from '@/lib/server'

export async function logAttendance(userId: string, eventId: string) {
  const supabase = await createClient()

  const { data: userProfile, error: userError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (userError || !userProfile) {
    return { error: "Invalid QR Code: User not found." }
  }

  const { data: existingScan } = await supabase
    .from('attendance')
    .select('id')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .single()

  if (existingScan) {
    return { error: "ALREADY SCANNED!", user: userProfile }
  }

  const { error: insertError } = await supabase
    .from('attendance')
    .insert({
      user_id: userId,
      event_id: eventId,
      status: 'present'
    })

  if (insertError) {
    return { error: "System Error: Could not save scan." }
  }

  return { success: true, user: userProfile }
}