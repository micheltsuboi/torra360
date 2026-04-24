'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: (formData.get('email') as string).trim(),
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // Retorna a mensagem de erro específica do Supabase para facilitar o diagnóstico
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const full_name = formData.get('name') as string
  const company_name = formData.get('company') as string

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name,
        company_name,
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/signup?error=There was an error signing up')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  
  try {
    await supabase.auth.signOut()
  } catch (err) {
    console.error('Logout error:', err)
  }
  
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login/update-password`,
  })

  if (error) {
    redirect('/login/forgot-password?error=Erro ao enviar e-mail')
  }

  redirect('/login?error=reset_sent')
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  
  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    redirect('/login/update-password?error=Erro ao atualizar senha')
  }

  redirect('/login?error=password_updated')
}
