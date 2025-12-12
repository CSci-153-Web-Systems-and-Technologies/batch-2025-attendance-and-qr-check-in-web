'use server'

import { createClient } from '@/lib/server'

export async function searchUsersForEvent(query: string, eventId: string) {
  const supabase = await createClient()

  if (!query || query.length < 2) return { users: [] }


  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url, role')
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(5)

  if (error || !profiles) return { users: [] }

  const usersWithStatus = await Promise.all(profiles.map(async (user) => {
    const { data: attendance } = await supabase
      .from('attendance')
      .select('status')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .maybeSingle()

    return {
      ...user,
      status: attendance?.status || null
    }
  }))

  return { users: usersWithStatus }
}