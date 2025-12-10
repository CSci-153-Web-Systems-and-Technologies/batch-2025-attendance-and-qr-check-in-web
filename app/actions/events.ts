'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'

export async function deleteEvent(eventId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)
    .eq('organizer_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/events')
  revalidatePath('/')
  return { success: true }
}