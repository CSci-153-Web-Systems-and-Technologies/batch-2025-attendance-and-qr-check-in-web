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
    return { error: "Invalid QR: User not found.", success: false }
  }

  const { data: existingScan } = await supabase
    .from('attendance')
    .select('*')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .maybeSingle()

  const now = new Date()

  if (!existingScan) {
    const { error: insertError } = await supabase
      .from('attendance')
      .insert({
        user_id: userId,
        event_id: eventId,
        status: 'checked-in',
        check_in_time: now.toISOString(),
      })

    if (insertError) return { error: "Check-in failed.", success: false }

    return { 
      success: true, 
      message: "Check-in Successful!", 
      status: 'checked-in',
      user: userProfile 
    }
  }

  if (existingScan.status === 'registered') {
    const { error: updateError } = await supabase
      .from('attendance')
      .update({ 
        status: 'checked-in',
        check_in_time: now.toISOString()
      })
      .eq('id', existingScan.id)

    if (updateError) return { error: "Check-in failed.", success: false }

    return { 
      success: true, 
      message: "Check-in Confirmed (Registered)", 
      status: 'checked-in',
      user: userProfile 
    }
  }

  if (existingScan.status === 'checked-in') {
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('end_time')
      .eq('id', eventId)
      .single()

    if (!eventError && event) {
        const eventEndTime = new Date(event.end_time)
        if (now < eventEndTime) {
            const minutesLeft = Math.ceil((eventEndTime.getTime() - now.getTime()) / (1000 * 60))
            return { 
                error: `Cannot check out yet! Event ends in ${minutesLeft} mins.`, 
                success: false,
                user: userProfile
            }
        }
    }

    const { error: updateError } = await supabase
      .from('attendance')
      .update({ 
        status: 'checked-out',
        check_out_time: now.toISOString()
      })
      .eq('id', existingScan.id)

    if (updateError) return { error: "Check-out failed.", success: false }

    return { 
      success: true, 
      message: "Check-out Successful!", 
      status: 'checked-out',
      user: userProfile 
    }
  }

  if (existingScan.status === 'checked-out') {
    return { 
      error: "User has already checked out.", 
      success: false, 
      user: userProfile 
    }
  }

  return { error: "Unknown error.", success: false }
}