'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  // 1. Authenticate
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "You must be logged in." }

  // 2. Extract Data
  const fullName = formData.get('full_name') as string
  const avatarFile = formData.get('avatar') as File

  const updateData: any = {
    full_name: fullName,
    updated_at: new Date().toISOString(),
  }

  // 3. Handle Avatar Upload (if provided)
  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop()
    const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile, { upsert: true })

    if (uploadError) return { error: "Avatar upload failed: " + uploadError.message }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)
    
    updateData.avatar_url = publicUrl
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', user.id)

  if (updateError) return { error: updateError.message }

  revalidatePath('/', 'layout')
  return { success: true }
}