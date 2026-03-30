'use client'

import { useState } from 'react'
import { createPDVSale } from './actions'
import { ShoppingCart, User, Plus, Minus, Trash, Tag } from 'lucide-react'

export default function PDVComponent({ clients, products }: { clients: any[], products: any[] }) {
  const [cart, setCart] = useState<any[]>([])
  const [selectedClient, setSelectedClient] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Pix')
  const [discountType, setDiscountType] = useState('valor') // 'valor' | '%'
  const [discountInput, setDiscountInput] = useState(0)

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        if (existing.qty >= product.quantity_units) return prev // block exceeding stock
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, {
        id: product.id,
        name: `${product.roast_batch?.green_coffee?.name || 'Lote'} - ${product.bean_format} ${product.package_size_g}g`,
        price: product.retail_price,
        qty: 1,
        maxStock: product.quantity_units
      }]
    })
  }

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta
        if (newQty < 1) return item
        if (newQty > item.maxStock) return item
        return { ...item, qty: newQty }
      }
      return item
    }))
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0)
  
  const discountAmount = discountType === '%' 
    ? subtotal * (discountInput / 100) 
    : discountInput
    
  const total = Math.max(0, subtotal - discountAmount)

  const handleCheckout = async () => {
    if (cart.length === 0) return alert('O carrinho está vazio.')
    
    const payload = {
      client_id: selectedClient || null,
      total_amount: subtotal,
      discount_amount: discountAmount,
      final_amount: total,
      payment_method: paymentMethod,
      items: cart
    }

    const { success, error } = await createPDVSale(payload)
    if (success) {
      alert('Venda registrada com sucesso e estoque de pacotes baixado!')
      setCart([])
      setDiscountInput(0)
      setSelectedClient('')
    } else {
      alert('Erro ao registrar venda: ' + error?.message)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full h-full">
      {/* Esquerda: Catálogo de Produtos para Venda */}
      <div className="glass-panel overflow-hidden flex flex-col h-full max-h-[600px]">
        <div className="p-4 border-b border-[--card-border] card-texture-header">
           <h2 className="font-serif text-[--primary]">Vitrine de Produtos</h2>
        </div>
        <div className="p-4 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {products.map((p) => (
              <div 
                key={p.id} 
                onClick={() => addToCart(p)}
                className="bg-black/20 border border-[--card-border] p-3 rounded-lg cursor-pointer hover:border-[--primary] transition-colors relative group"
              >
                <div className="text-xs text-[--secondary-text] mb-1">{p.bean_format} • {p.package_size_g}g</div>
                <div className="font-medium text-sm leading-tight text-[--foreground] h-10 line-clamp-2">
                  {p.roast_batch?.green_coffee?.name || 'Produto S/N'}
                </div>
                <div className="mt-2 text-[--success] font-bold">R$ {p.retail_price.toFixed(2)}</div>
                <div className="text-[10px] text-[--secondary-text] mt-1">Estoque: {p.quantity_units} pct</div>
                <div className="absolute inset-0 bg-[#C39967]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
              </div>
            ))}
            {products.length === 0 && (
              <div className="col-span-3 text-center text-[--secondary-text] py-10 text-sm">
                Nenhum pacote disponível em estoque. Vá em "Embalamento" para gerar pacotes.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Direita: Carrinho e Checkout */}
      <div className="glass-panel overflow-hidden flex flex-col h-full bg-[#1a1411]">
        <div className="p-4 border-b border-[--card-border] flex justify-between items-center card-texture-header">
           <h2 className="font-serif text-[--foreground] flex items-center gap-2">
             <ShoppingCart className="w-5 h-5 text-[--primary]" />
             Balcão / Carrinho
           </h2>
        </div>
        
        {/* Lista Carrinho */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-[200px]">
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b border-[--card-border]/40 pb-3">
              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-xs text-[--primary]">R$ {item.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex bg-black/40 rounded border border-[--card-border] items-center">
                  <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:text-[--primary]"><Minus className="w-3 h-3" /></button>
                  <span className="text-sm w-6 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:text-[--primary]"><Plus className="w-3 h-3" /></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-[--danger] hover:opacity-70 p-1">
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="m-auto text-center text-xs text-[--secondary-text]">Adicione produtos ao carrinho clicando na vitrine física ao lado.</div>
          )}
        </div>

        {/* Resumo Checkout */}
        <div className="p-4 border-t border-[--card-border] bg-black/40 flex flex-col gap-3">
          
          <div className="flex gap-2 items-center">
            <User className="w-4 h-4 text-[--secondary-text]" />
            <select 
              value={selectedClient} 
              onChange={e => setSelectedClient(e.target.value)}
              className="bg-transparent border-0 text-sm flex-1 text-[--foreground] focus:ring-0 p-0"
            >
              <option value="" className="bg-[#110D0B]">Consumidor Final (Sem Cadastro)</option>
              {clients.map(c => (
                <option key={c.id} value={c.id} className="bg-[#110D0B]">{c.name} {c.cpf ? `(${c.cpf})` : ''}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 border-t border-[--card-border]/30 pt-3">
            <Tag className="w-4 h-4 text-[--secondary-text]" />
            <span className="text-xs text-[--secondary-text]">Desconto:</span>
            <select value={discountType} onChange={e => setDiscountType(e.target.value)} className="bg-transparent text-xs p-1 border border-[--card-border] rounded focus:outline-none">
               <option value="valor" className="bg-[#110D0B]">R$</option>
               <option value="%" className="bg-[#110D0B]">%</option>
            </select>
            <input 
              type="number" 
              value={discountInput || ''} 
              onChange={e => setDiscountInput(parseFloat(e.target.value) || 0)} 
              className="bg-black/20 text-sm p-1 border border-[--card-border] rounded w-20 text-right focus:border-[--primary] outline-none" 
              placeholder="0.00"
            />
          </div>

          <div className="flex justify-between items-center text-sm pt-2">
            <span className="text-[--secondary-text]">Método Pgto:</span>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="bg-transparent text-sm p-1 py-0 font-bold border-0 text-[--primary] text-right outline-none cursor-pointer focus:ring-0">
               <option value="Pix" className="bg-[#110D0B]">Pix</option>
               <option value="Crédito" className="bg-[#110D0B]">Cartão de Crédito</option>
               <option value="Débito" className="bg-[#110D0B]">Cartão de Débito</option>
               <option value="Dinheiro" className="bg-[#110D0B]">Dinheiro Vivo</option>
            </select>
          </div>

          <div className="border-t border-[--card-border]/50 pt-3 flex justify-between items-end">
            <div className="text-[--secondary-text] text-sm flex flex-col">
              <span>Subtotal: R$ {subtotal.toFixed(2)}</span>
              {discountAmount > 0 && <span className="text-[--danger] text-xs">Desconto: - R$ {discountAmount.toFixed(2)}</span>}
            </div>
            <div className="text-right">
              <span className="text-xs text-[--secondary-text] block">Total</span>
              <span className="text-2xl font-bold text-[--success]">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={handleCheckout} className="primary-btn w-full mt-2 py-3 bg-gradient-to-r from-[--success] to-emerald-800 border-none !shadow-[--success] text-lg">
            Finalizar Venda
          </button>
        </div>
      </div>
    </div>
  )
}
