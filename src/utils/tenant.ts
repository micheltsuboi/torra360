import { createClient } from '@/utils/supabase/server'
import { cache } from 'react'

export const getCachedTenantId = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')
  
  const { data: profile } = await supabase
    .from('users')
    .select('tenant_id')
    .eq('id', user.id)
    .single()
    
  if (!profile) throw new Error('Perfil não encontrado')
  return profile.tenant_id
})
