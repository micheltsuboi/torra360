'use client'

import { useState, useEffect } from 'react'
import { createPDVSale, getClientLoyaltyBalance, getLoyaltySettings } from './actions'
import { ShoppingCart, User, Plus, Minus, Trash, Trash2, Tag, MessageCircle, Gift } from 'lucide-react'

export default function PDVComponent({ clients, products }: { clients: any[], products: any[] }) {
  const [cart, setCart] = useState<any[]>([])
  const [selectedClient, setSelectedClient] = useState('')
  const [clientBalance, setClientBalance] = useState(0)
  const [useCashback, setUseCashback] = useState(false)
  const [loyaltySettings, setLoyaltySettings] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState('Pix')
  const [discountType, setDiscountType] = useState('valor') // 'valor' | '%'
  const [discountInput, setDiscountInput] = useState(0)

  // Fetch client balance when selected
  useEffect(() => {
    if (selectedClient) {
      getClientLoyaltyBalance(selectedClient).then(setClientBalance)
      getLoyaltySettings().then(setLoyaltySettings)
    } else {
      setClientBalance(0)
      setUseCashback(false)
    }
  }, [selectedClient])

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
    
  const baseTotal = Math.max(0, subtotal - discountAmount)
  const cashbackRedeemed = useCashback ? Math.min(baseTotal, clientBalance) : 0
  const finalTotal = baseTotal - cashbackRedeemed

  const handleCheckout = async () => {
    if (cart.length === 0) return alert('O carrinho está vazio.')
    
    const payload = {
      client_id: selectedClient || null,
      total_amount: subtotal,
      discount_amount: discountAmount,
      cashback_redeemed: cashbackRedeemed,
      final_amount: finalTotal,
      payment_method: paymentMethod,
      items: cart
    }

    const { success, error } = await createPDVSale(payload)
    if (success) {
      alert('Venda registrada com sucesso e estoque de pacotes baixado!')
      setCart([])
      setDiscountInput(0)
      setSelectedClient('')
      setUseCashback(false)
    } else {
      alert('Erro ao registrar venda: ' + error?.message)
    }
  }

  const selectedClientData = clients.find(c => c.id === selectedClient)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full h-full">
      {/* Esquerda: Catálogo de Produtos para Venda */}
      <div className="glass-panel overflow-hidden flex flex-col h-full max-h-[600px]">
        <div className="p-2 border-b border-[--card-border] card-texture-header">
           <h2 className="font-serif text-[--primary]">Estoque</h2>
        </div>
        <div className="p-2 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {products.map((p) => (
              <div 
                key={p.id} 
                onClick={() => addToCart(p)}
                className="bg-black/20 border border-[--card-border] p-2 rounded-lg cursor-pointer hover:border-[--primary] transition-colors relative group"
              >
                <div className="text-xs text-[--secondary-text] mb-1">{p.bean_format} • {p.package_size_g}g</div>
                <div className="font-medium text-sm leading-tight text-[--foreground] h-10 line-clamp-2">
                  {p.roast_batch?.green_coffee?.name || 'Produto S/N'}
                </div>
                <div className="mt-2 text-[--success] font-bold">R$ {p.retail_price.toFixed(2)}</div>
                <div className="text-[10px] text-[--secondary-text] mt-1">Disp: {p.quantity_units} pct</div>
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
        <div className="p-2 border-b border-[--card-border] flex justify-between items-center card-texture-header">
           <h2 className="font-serif text-[--foreground] flex items-center gap-2">
             <ShoppingCart className="w-5 h-5 text-[--primary]" />
             Balcão / Carrinho
           </h2>
        </div>
        
        {/* Lista Carrinho */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 min-h-[300px] scrollbar-thin scrollbar-thumb-[--primary]/20">
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b border-white/5 pb-4 group/cartitem">
              <div className="flex flex-col flex-1 pr-4">
                <span className="text-base font-semibold text-[--foreground] group-hover/cartitem:text-[--primary] transition-colors line-clamp-2 leading-tight mb-1">{item.name}</span>
                <span className="text-xs font-bold text-[--primary] opacity-80">R$ {item.price.toFixed(2)} / unid</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-black/40 p-1 rounded-full border border-white/5 shadow-inner">
                  <button 
                    onClick={() => updateQty(item.id, -1)} 
                    className="qty-btn-premium w-6 h-6 flex items-center justify-center text-[--foreground] hover:bg-[--danger]/20 hover:text-[--danger]"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                  
                  <span className="text-sm font-bold font-mono w-4 text-center text-[--primary]">{item.qty}</span>
                  
                  <button 
                    onClick={() => updateQty(item.id, 1)} 
                    className="qty-btn-premium w-6 h-6 flex items-center justify-center text-[--foreground] hover:bg-[--success]/20 hover:text-[--success]"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="action-icon-btn text-[--danger] !opacity-100"
                  title="Remover Item"
                >
                  <Trash2 className="action-icon" />
                </button>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="m-auto text-center flex flex-col items-center gap-2 py-10">
              <ShoppingCart className="w-12 h-12 text-[--primary] opacity-10" />
              <p className="text-xs text-[--secondary-text] leading-relaxed max-w-[150px] opacity-40 uppercase tracking-widest text-[10px]">
                O carrinho está vazio.
              </p>
            </div>
          )}
        </div>

        {/* Resumo Checkout */}
        <div className="p-4 border-t border-[--card-border] bg-black/20 flex flex-col gap-3">
          
          <div className="flex gap-2 items-center relative group">
            <User className="w-3.5 h-3.5 text-[--primary] opacity-50" />
            <select 
              value={selectedClient} 
              onChange={e => setSelectedClient(e.target.value)}
              className="bg-transparent border-0 text-[11px] font-bold uppercase tracking-widest flex-1 text-[--foreground] focus:ring-0 p-0 cursor-pointer"
            >
              <option value="" className="bg-[#110D0B]">Consumidor Final</option>
              {clients.map(c => (
                <option key={c.id} value={c.id} className="bg-[#110D0B]">{c.name}</option>
              ))}
            </select>
            {selectedClientData?.phone && (
              <a 
                href={`https://wa.me/55${selectedClientData.phone.replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#25D366] hover:scale-125 transition-transform"
                title="Abrir WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-4 border-t border-white/5 pt-3">
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-[--primary] opacity-50" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-[--secondary-text]">Desconto:</span>
              <select value={discountType} onChange={e => setDiscountType(e.target.value)} className="bg-black/40 text-[10px] p-1 border border-white/5 rounded focus:outline-none text-[--primary] font-bold">
                 <option value="valor" className="bg-[#110D0B]">R$</option>
                 <option value="%" className="bg-[#110D0B]">%</option>
              </select>
              <input 
                type="number" 
                value={discountInput || ''} 
                onChange={e => setDiscountInput(parseFloat(e.target.value) || 0)} 
                className="bg-black/40 text-[11px] p-1 border border-white/5 rounded w-16 focus:border-[--primary] outline-none text-[--foreground] font-mono h-7" 
                placeholder="0.00"
              />
            </div>

            {/* Cashback Checkbox */}
            {clientBalance > 0 && (
              <div className="flex items-center gap-2 ml-auto bg-[--primary]/5 px-2 py-1 rounded border border-[--primary]/10">
                <Gift className="w-3 h-3 text-[--primary] opacity-60" />
                <span className="text-[9px] font-bold text-[--primary] uppercase tracking-tighter opacity-60">Resgatar R$ {clientBalance.toFixed(2)}?</span>
                <input 
                  type="checkbox" 
                  checked={useCashback} 
                  onChange={e => setUseCashback(e.target.checked)}
                  className="accent-[--primary] w-3 h-3"
                />
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[--secondary-text]">Método Pgto:</span>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="bg-black/40 text-[11px] p-1 py-0.5 font-bold rounded border border-white/5 text-[--primary] outline-none cursor-pointer focus:ring-0">
               <option value="Pix" className="bg-[#110D0B]">Pix</option>
               <option value="Crédito" className="bg-[#110D0B]">Crédito</option>
               <option value="Débito" className="bg-[#110D0B]">Débito</option>
               <option value="Dinheiro" className="bg-[#110D0B]">Dinheiro</option>
               <option value="À receber" className="bg-[#110D0B]">À receber</option>
            </select>
          </div>

          <div className="border-t border-white/10 pt-3 flex justify-between items-end">
            <div className="text-[--secondary-text] space-y-0.5">
              <div className="flex gap-2 items-center">
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Subtotal:</span>
                <span className="text-xs font-mono">R$ {subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex gap-2 items-center">
                   <span className="text-[10px] uppercase tracking-widest font-bold text-[--danger]/60">Desconto:</span>
                   <span className="text-xs font-mono text-[--danger]">- R$ {discountAmount.toFixed(2)}</span>
                </div>
              )}
              {cashbackRedeemed > 0 && (
                <div className="flex gap-2 items-center">
                   <span className="text-[10px] uppercase tracking-widest font-bold text-[--primary]/60">Cashback:</span>
                   <span className="text-xs font-mono text-[--primary] font-bold">- R$ {cashbackRedeemed.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-[--primary] font-bold uppercase tracking-widest opacity-40 mb-1">
                + Acumula: R$ {(finalTotal * (loyaltySettings?.cashback_percentage / 100 || 0)).toFixed(2)} cashback
              </span>
              <div className="text-right flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[--primary] opacity-50 leading-none mb-1">Total Final</span>
                <span className="text-xl font-serif text-[--success] title-glow">R$ {finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button onClick={handleCheckout} className="primary-btn w-full mt-2 py-4 bg-gradient-to-r from-[--success] to-emerald-800 border-none !shadow-[--success] text-base uppercase tracking-widest font-bold">
            Finalizar Venda
          </button>
        </div>
      </div>
    </div>
  )
}
