'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'

export async function login(formData: FormData) {
  // 1. Create the Supabase client
  const supabase = await createClient()

  // 2. Extract data from the form
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 3. Authenticate with Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Return the error message to be displayed on the frontend
    return { error: error.message }
  }

  // 4. On success, revalidate the layout and redirect
  revalidatePath('/', 'layout')
  redirect('/') // Change '/' to '/dashboard' or your desired home page
}