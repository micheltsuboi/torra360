import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mbtmizhqcbfrfyrhuuwg.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idG1pemhxY2JmcmZ5cmh1dXdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDg4MzM4NiwiZXhwIjoyMDkwNDU5Mzg2fQ.DY3lqgOcpmx5WCXtfU1Tejy_oLSZ6utu_Su--4hdYTQ'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkUserDetailed() {
  const email = 'contato.autenticocafe@gmail.com'
  
  console.log(`Verificando detalhes do usuário: ${email}`)

  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
  
  if (authError) {
    console.error('Erro:', authError)
    return
  }

  const user = users.find(u => u.email === email)

  if (!user) {
    console.log('Usuário NÃO encontrado.')
    return
  }

  console.log('Dados do Auth:')
  console.log(`- ID: ${user.id}`)
  console.log(`- Confirmado: ${user.email_confirmed_at}`)
  console.log(`- Banned Until: ${user.banned_until || 'Não banido'}`)
  console.log(`- Recovery Sent At: ${user.recovery_sent_at || 'Nunca'}`)
  console.log(`- Invited At: ${user.invited_at || 'Não convidado'}`)
  console.log(`- Identities:`, user.identities?.map(i => i.provider))
  
  // Tentar um login de teste via script para validar a senha (usando o client anon)
  const anonClient = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idG1pemhxY2JmcmZ5cmh1dXdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODMzODYsImV4cCI6MjA5MDQ1OTM4Nn0.aCQH0fjvvftFJtJoeb1I0VLaY1LTvZmBLcvvX6VWPnM')
  
  console.log('\nTestando login com "segredo10"...')
  const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
    email,
    password: 'segredo10'
  })

  if (signInError) {
    console.log(`❌ Falha no login: ${signInError.message} (Status: ${signInError.status})`)
  } else {
    console.log('✅ Login bem-sucedido via script!')
  }
}

checkUserDetailed()
