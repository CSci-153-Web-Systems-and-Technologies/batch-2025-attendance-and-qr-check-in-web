'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'

export async function registerAttendee(userId: string, eventId: string) {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('attendance')
    .select('status')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .maybeSingle()

  if (existing) {
    return { error: `User is already listed as ${existing.status}.`, success: false }
  }

  const { error } = await supabase
    .from('attendance')
    .insert({
      user_id: userId,
      event_id: eventId,
      status: 'registered',
      check_in_time: new Date().toISOString(), 
      check_out_time: null
    })

  if (error) return { error: error.message, success: false }

  revalidatePath('/attendees')
  return { success: true, message: "User registered successfully!" }
}