'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getLoyaltyStats() {
  const supabase = await createClient()

  const { data: settings } = await supabase
    .from('loyalty_settings')
    .select('*')
    .single()

  const { data: totals } = await supabase
    .from('loyalty_transactions')
    .select('amount, transaction_type, expires_at')

  const now = new Date()
  
  // Apenas EARNED que não expirou
  const activeEarned = totals?.filter(t => 
    t.transaction_type === 'EARNED' && 
    (!t.expires_at || new Date(t.expires_at) > now)
  ).reduce((acc, curr) => acc + curr.amount, 0) || 0

  const totalRedeemed = totals?.filter(t => t.transaction_type === 'REDEEMED').reduce((acc, curr) => acc + Math.abs(curr.amount), 0) || 0

  return {
    settings,
    totalEarned: activeEarned,
    totalRedeemed,
    activeBalance: Math.max(0, activeEarned - totalRedeemed)
  }
}

export async function getCustomerLoyaltyReport() {
  const supabase = await createClient()

  // Agrupamos transações por cliente para ver o saldo de cada um
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, phone')
  
  const { data: transactions } = await supabase
    .from('loyalty_transactions')
    .select('*')

  const now = new Date()

  const report = clients?.map(client => {
    const clientTrans = transactions?.filter(t => t.client_id === client.id) || []
    
    // Apenas EARNED que não expirou PARA O SALDO
    const earned = clientTrans.filter(t => 
       t.transaction_type === 'EARNED' && 
       (!t.expires_at || new Date(t.expires_at) > now)
    ).reduce((acc, curr) => acc + curr.amount, 0)

    const redeemed = clientTrans.filter(t => t.transaction_type === 'REDEEMED').reduce((acc, curr) => acc + Math.abs(curr.amount), 0)
    
    return {
      ...client,
      earned,
      redeemed,
      balance: Math.max(0, earned - redeemed)
    }
  }) || []

  return report.sort((a, b) => b.balance - a.balance)
}

export async function updateLoyaltySettings(formData: FormData) {
  const percentage = parseFloat(formData.get('cashback_percentage') as string)
  const expiryDays = parseInt(formData.get('expiry_days') as string) || 365
  const is_active = formData.get('is_active') === 'on' || formData.get('is_active') === 'true'

  const supabase = await createClient()
  await supabase
    .from('loyalty_settings')
    .upsert({ 
        cashback_percentage: percentage, 
        expiry_days: expiryDays,
        is_active, 
        updated_at: new Date().toISOString()
    }, { onConflict: 'tenant_id' })

  revalidatePath('/dashboard/fidelidade')
}
