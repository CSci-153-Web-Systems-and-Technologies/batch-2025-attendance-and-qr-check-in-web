'use server'

import { createClient } from '@/lib/server'

export async function logAttendance(userId: string, eventId: string) {
  const supabase = await createClient()

  // 1. Validate the User Exists
  const { data: userProfile, error: userError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (userError || !userProfile) {
    return { error: "Invalid QR: User not found.", success: false }
  }

  // 2. Check for an existing attendance record for this event
  const { data: existingScan } = await supabase
    .from('attendance')
    .select('*')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .maybeSingle() // Use maybeSingle to prevent errors if no record exists yet

  // --- SCENARIO A: CHECK-IN (First time scanning) ---
  if (!existingScan) {
    const { error: insertError } = await supabase
      .from('attendance')
      .insert({
        user_id: userId,
        event_id: eventId,
        status: 'checked-in',
        scanned_at: new Date().toISOString() // Explicitly set time if needed
      })

    if (insertError) {
      console.error("Check-in Error:", insertError)
      return { error: "System Error: Check-in failed.", success: false }
    }

    return { 
      success: true, 
      message: "Check-in Successful!", 
      status: 'checked-in',
      user: userProfile 
    }
  }

  // --- SCENARIO B: CHECK-OUT (User is currently checked in) ---
  // We check for 'checked-in' OR 'present' to be backward compatible with your old data
  if (existingScan.status === 'checked-in' || existingScan.status === 'present') {
    const { error: updateError } = await supabase
      .from('attendance')
      .update({ 
        status: 'checked-out',
        // Optional: You could add a 'checked_out_at' column to your DB later
      })
      .eq('id', existingScan.id)

    if (updateError) {
      console.error("Check-out Error:", updateError)
      return { error: "System Error: Check-out failed.", success: false }
    }

    return { 
      success: true, 
      message: "Check-out Successful!", 
      status: 'checked-out',
      user: userProfile 
    }
  }

  // --- SCENARIO C: ALREADY CHECKED OUT ---
  if (existingScan.status === 'checked-out') {
    return { 
      error: "User has already checked out.", 
      success: false, 
      user: userProfile 
    }
  }

  return { error: "Unknown error occurred.", success: false }
}