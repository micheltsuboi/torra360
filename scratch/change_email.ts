import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mbtmizhqcbfrfyrhuuwg.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idG1pemhxY2JmcmZ5cmh1dXdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDg4MzM4NiwiZXhwIjoyMDkwNDU5Mzg2fQ.DY3lqgOcpmx5WCXtfU1Tejy_oLSZ6utu_Su--4hdYTQ'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function changeUserEmail() {
  const userId = '1a162a59-0e39-40c8-a51c-133fe81646f5'
  const oldEmail = 'contato.autenticocafe@gmail.com'
  const newEmail = 'contato.cafeautentico@gmail.com'
  
  console.log(`Alterando e-mail de ${oldEmail} para ${newEmail} (ID: ${userId})`)

  // 1. Atualizar e-mail e marcar como confirmado
  const { data, error } = await supabase.auth.admin.updateUserById(
    userId,
    { 
      email: newEmail,
      email_confirm: true 
    }
  )

  if (error) {
    console.error('❌ Erro ao alterar e-mail:', error.message)
  } else {
    console.log('✅ E-mail alterado e confirmado no Supabase Auth!')
    
    // 2. Verificar se o login funciona com o novo e-mail (usando a senha anterior @U73n71c0)
    const anonClient = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idG1pemhxY2JmcmZ5cmh1dXdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODMzODYsImV4cCI6MjA5MDQ1OTM4Nn0.aCQH0fjvvftFJtJoeb1I0VLaY1LTvZmBLcvvX6VWPnM')
    
    const { error: signInError } = await anonClient.auth.signInWithPassword({
      email: newEmail,
      password: '@U73n71c0'
    })

    if (signInError) {
      console.log(`❌ Falha ao validar o novo e-mail no login: ${signInError.message}`)
    } else {
      console.log('✅ Login validado com o novo e-mail!')
    }
  }
}

changeUserEmail()
