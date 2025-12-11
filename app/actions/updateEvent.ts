'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'

export async function updateEvent(formData: FormData) {
  const supabase = await createClient()

  // 1. Authenticate
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "You must be logged in." }

  // 2. Extract Data
  const eventId = formData.get('event_id') as string
  const title = formData.get('title') as string
  const location = formData.get('location') as string
  const description = formData.get('description') as string
  const startTime = formData.get('start_time') as string
  const endTime = formData.get('end_time') as string
  const coverFile = formData.get('cover_image') as File

  // 3. Prepare Update Object
  const updateData: any = {
    title,
    location,
    description,
    start_time: new Date(startTime).toISOString(),
    end_time: new Date(endTime).toISOString(),
  }

  // 4. Handle Image Upload (Only if a new file is uploaded)
  if (coverFile && coverFile.size > 0) {
    const filename = `${user.id}/${Date.now()}-${coverFile.name}`
    const { error: uploadError } = await supabase.storage
      .from('event-covers')
      .upload(filename, coverFile)

    if (uploadError) return { error: "Image upload failed: " + uploadError.message }
    
    const { data: { publicUrl } } = supabase.storage
      .from('event-covers')
      .getPublicUrl(filename)
    
    updateData.cover_image_url = publicUrl
  }

  // 5. Update Database
  // We check 'data' length to ensure the row was actually updated
  const { data, error: updateError } = await supabase
    .from('events')
    .update(updateData)
    .eq('id', eventId)
    .eq('organizer_id', user.id) // Security check: ensure they own it
    .select()

  if (updateError) return { error: updateError.message }

  // Check if any row was returned. If not, the update didn't happen (RLS or wrong ID).
  if (!data || data.length === 0) {
    return { error: "Update failed: You don't have permission to edit this event." }
  }

  revalidatePath('/events')
  revalidatePath('/')
  return { success: true }
}