'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'

export async function createEvent(formData: FormData) {
  const supabase = await createClient()

  // 1. Get the current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "You must be logged in." }

  // 2. Extract Data
  const title = formData.get('title') as string
  const location = formData.get('location') as string
  const description = formData.get('description') as string
  const startTime = formData.get('start_time') as string
  const coverFile = formData.get('cover_image') as File

  let coverImageUrl = null

  // 3. Handle Image Upload (if a file was selected)
  if (coverFile && coverFile.size > 0) {
    const filename = `${user.id}/${Date.now()}-${coverFile.name}`
    const { data, error } = await supabase.storage
      .from('event-covers')
      .upload(filename, coverFile)

    if (error) return { error: "Image upload failed: " + error.message }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('event-covers')
      .getPublicUrl(filename)
    
    coverImageUrl = publicUrl
  }

  // 4. Insert into Database
  const { error: insertError } = await supabase
    .from('events')
    .insert({
      organizer_id: user.id,
      title,
      location,
      description,
      start_time: new Date(startTime).toISOString(),
      cover_image_url: coverImageUrl
    })

  if (insertError) return { error: insertError.message }

  revalidatePath('/')
  return { success: true }
}