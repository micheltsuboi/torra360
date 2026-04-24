import { createClient } from '@/utils/supabase/server'
import { cache } from 'react'

export const isAdmin = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
    
  return profile?.role === 'admin'
})
