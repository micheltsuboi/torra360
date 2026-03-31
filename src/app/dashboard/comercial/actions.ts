'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// ====== BUSCA DE DADOS PRO PDV ======
export async function getPDVData() {
  const supabase = await createClient()
  
  // Clientes
  const { data: clients } = await supabase.from('clients').select('id, name, cpf').order('name')
  
  // Produtos (Pacotes Gerados)
  const { data: products } = await supabase
    .from('packaging_batches')
    .select('id, bean_format, package_size_g, retail_price, quantity_units, roast_batch:roast_batch_id(green_coffee(name))')
    .gt('quantity_units', 0) // Só mostra pacotes criados
    .order('created_at', { ascending: false })

  return {
    clients: clients || [],
    products: products || []
  }
}

// ====== SALVAR VENDA PDV ======
export async function createPDVSale(payload: any) {
  const supabase = await createClient()
  
  const { client_id, total_amount, discount_amount, final_amount, payment_method, items, cashback_redeemed } = payload

  // Inserir Transacao Principal
  const { data: saleData, error: saleError } = await supabase.from('sale_transactions').insert({
    client_id: client_id || null,
    total_amount,
    discount_amount,
    final_amount,
    payment_method
  }).select('id').single()

  if (saleError || !saleData) {
    console.error('Error creating sale:', saleError)
    return { success: false, error: saleError }
  }

  // Inserir Itens do Carrinho
  const saleItems = items.map((item: any) => ({
    sale_id: saleData.id,
    packaging_batch_id: item.id,
    quantity: item.qty,
    unit_price: item.price,
    total_price: item.qty * item.price
  }))

  const { error: itemsError } = await supabase.from('sale_items').insert(saleItems)
  if (itemsError) {
    console.error('Error inserting sale items:', itemsError)
    return { success: false, error: itemsError }
  }

  // LÓGICA DE FIDELIDADE (CASHBACK)
  if (client_id) {
    // 1. Registrar Resgate se houver
    if (cashback_redeemed > 0) {
      await supabase.from('loyalty_transactions').insert({
        client_id,
        sale_id: saleData.id,
        amount: -cashback_redeemed,
        transaction_type: 'REDEEMED',
        description: `Resgate de cashback na venda #${saleData.id.slice(0,8)}`
      })
    }

    // 2. Calcular e Registrar Ganho (Baseado na configuração do tenant)
    const { data: settings } = await supabase.from('loyalty_settings').select('cashback_percentage, is_active, expiry_days').single()
    
    if (settings?.is_active) {
       const earnedAmount = final_amount * (settings.cashback_percentage / 100)
       if (earnedAmount > 0) {
          const expiresAt = new Date()
          expiresAt.setDate(expiresAt.getDate() + (settings.expiry_days || 365))

          await supabase.from('loyalty_transactions').insert({
            client_id,
            sale_id: saleData.id,
            amount: earnedAmount,
            transaction_type: 'EARNED',
            description: `Cashback gerado na venda #${saleData.id.slice(0,8)}`,
            expires_at: expiresAt.toISOString()
          })
       }
    }
  }

  // Atualizar Estoque de Pacotes (reduzir quantity_units)
  for (const item of items) {
    const { data: pkg, error: pkgError } = await supabase.from('packaging_batches').select('quantity_units').eq('id', item.id).single()
    if (pkgError) {
      console.error('Error fetching package units:', pkgError)
      continue
    }
    if (pkg) {
      const { error: updateError } = await supabase.from('packaging_batches').update({
        quantity_units: Math.max(0, pkg.quantity_units - item.qty)
      }).eq('id', item.id)
      
      if (updateError) console.error('Error updating stock:', updateError)
    }
  }

  revalidatePath('/dashboard/comercial')
  revalidatePath('/dashboard/pacotes')
  revalidatePath('/dashboard/fidelidade')
  return { success: true }
}

export async function getClientLoyaltyBalance(clientId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('loyalty_transactions')
    .select('amount')
    .eq('client_id', clientId)
  
  const balance = data?.reduce((acc, curr) => acc + curr.amount, 0) || 0
  return balance
}

export async function getLoyaltySettings() {
  const supabase = await createClient()
  const { data } = await supabase.from('loyalty_settings').select('*').single()
  return data
}

// ====== HISTÓRICO ======
export async function getSalesHistory() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sale_transactions')
    .select('*, client:client_id(name), sale_items(*, pkg:packaging_batch_id(bean_format, package_size_g, roast_batch:roast_batch_id(green_coffee(name))))')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching sales history:', error)
    return []
  }
  
  return data || []
}

// ====== DESPESAS MANTIDAS ======
export async function getExpenses() {
  const supabase = await createClient()
  const { data } = await supabase.from('expenses').select('*').order('date', { ascending: false })
  return data || []
}

export async function createExpense(formData: FormData) {
  const supabase = await createClient()
  const category = formData.get('category') as string
  const date = formData.get('date') as string
  const amount = parseFloat(formData.get('amount') as string)
  const notes = formData.get('notes') as string

  await supabase.from('expenses').insert({ category, date, amount, notes })
  revalidatePath('/dashboard/comercial')
}

export async function deleteSale(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()
  await supabase.from('sale_transactions').delete().eq('id', id)
  
  revalidatePath('/dashboard/comercial')
  revalidatePath('/dashboard/pacotes') // estoque pode ter voltado
}
