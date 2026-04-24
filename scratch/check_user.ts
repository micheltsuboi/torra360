import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mbtmizhqcbfrfyrhuuwg.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idG1pemhxY2JmcmZ5cmh1dXdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDg4MzM4NiwiZXhwIjoyMDkwNDU5Mzg2fQ.DY3lqgOcpmx5WCXtfU1Tejy_oLSZ6utu_Su--4hdYTQ'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkUser() {
  const email = 'contato.autenticocafe@gmail.com'
  
  console.log(`Verificando usuário: ${email}`)

  // 1. Verificar em auth.users
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
  
  if (authError) {
    console.error('Erro ao listar usuários:', authError)
    return
  }

  const user = authData.users.find(u => u.email === email)

  if (!user) {
    console.log('Usuário NÃO encontrado no Supabase Auth.')
  } else {
    console.log('Usuário encontrado no Supabase Auth:')
    console.log(`- ID: ${user.id}`)
    console.log(`- Email confirmado: ${user.email_confirmed_at ? 'Sim' : 'Não'}`)
    console.log(`- Último login: ${user.last_sign_in_at || 'Nunca'}`)
    
    // 2. Verificar em public.users
    const { data: publicUser, error: publicError } = await supabase
      .from('users')
      .select('*, tenants(*)')
      .eq('id', user.id)
      .single()

    if (publicError) {
      console.error('Erro ao buscar perfil público:', publicError)
    } else {
      console.log('Perfil público encontrado:')
      console.log(`- Role: ${publicUser.role}`)
      console.log(`- Tenant: ${publicUser.tenants?.name || 'Nenhum'}`)
      console.log(`- Tenant Ativo: ${publicUser.tenants?.active}`)
    }
  }
}

checkUser()
