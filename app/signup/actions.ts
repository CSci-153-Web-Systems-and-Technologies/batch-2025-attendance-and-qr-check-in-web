'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // 1. Extract data
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const role = formData.get('role') as string

  // 2. Sign Up with Supabase
  // We pass "full_name" and "role" into the 'data' object so it saves to the user's metadata
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role, // 'participant' or 'organizer'
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // 3. Success
  revalidatePath('/', 'layout')
  redirect('/')
}