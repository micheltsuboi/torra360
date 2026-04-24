import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mbtmizhqcbfrfyrhuuwg.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idG1pemhxY2JmcmZ5cmh1dXdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDg4MzM4NiwiZXhwIjoyMDkwNDU5Mzg2fQ.DY3lqgOcpmx5WCXtfU1Tejy_oLSZ6utu_Su--4hdYTQ'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function resetUserPassword() {
  const userId = '1a162a59-0e39-40c8-a51c-133fe81646f5'
  const newPassword = '@U73n71c0'
  
  console.log(`Alterando a senha do usuário ${userId} para: ${newPassword}`)

  const { data, error } = await supabase.auth.admin.updateUserById(
    userId,
    { password: newPassword }
  )

  if (error) {
    console.error('❌ Erro ao alterar senha:', error.message)
  } else {
    console.log('✅ Senha alterada com sucesso!')
    
    // Testar o novo login
    const anonClient = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idG1pemhxY2JmcmZ5cmh1dXdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODMzODYsImV4cCI6MjA5MDQ1OTM4Nn0.aCQH0fjvvftFJtJoeb1I0VLaY1LTvZmBLcvvX6VWPnM')
    
    const { error: signInError } = await anonClient.auth.signInWithPassword({
      email: 'contato.autenticocafe@gmail.com',
      password: newPassword
    })

    if (signInError) {
      console.log(`❌ Falha ao validar a nova senha: ${signInError.message}`)
    } else {
      console.log('✅ Validação da nova senha concluída com sucesso!')
    }
  }
}

resetUserPassword()
