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
    .select('amount, transaction_type')

  const totalEarned = totals?.filter(t => t.transaction_type === 'EARNED').reduce((acc, curr) => acc + curr.amount, 0) || 0
  const totalRedeemed = totals?.filter(t => t.transaction_type === 'REDEEMED').reduce((acc, curr) => acc + Math.abs(curr.amount), 0) || 0

  return {
    settings,
    totalEarned,
    totalRedeemed,
    activeBalance: totalEarned - totalRedeemed
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

  const report = clients?.map(client => {
    const clientTrans = transactions?.filter(t => t.client_id === client.id) || []
    const earned = clientTrans.filter(t => t.transaction_type === 'EARNED').reduce((acc, curr) => acc + curr.amount, 0)
    const redeemed = clientTrans.filter(t => t.transaction_type === 'REDEEMED').reduce((acc, curr) => acc + Math.abs(curr.amount), 0)
    
    return {
      ...client,
      earned,
      redeemed,
      balance: earned - redeemed
    }
  }) || []

  return report.sort((a, b) => b.balance - a.balance)
}

export async function updateLoyaltySettings(formData: FormData) {
  const percentage = parseFloat(formData.get('cashback_percentage') as string)
  const is_active = formData.get('is_active') === 'on'
  const apply_to_all = formData.get('apply_to_all') === 'on'

  const supabase = await createClient()
  await supabase
    .from('loyalty_settings')
    .upsert({ 
        cashback_percentage: percentage, 
        is_active, 
        apply_to_all,
        updated_at: new Date().toISOString()
    }, { onConflict: 'tenant_id' })

  revalidatePath('/dashboard/fidelidade')
  revalidatePath('/dashboard/parametros')
}
