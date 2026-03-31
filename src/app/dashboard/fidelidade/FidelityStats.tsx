'use client'

import { Star, Gift, Users, Settings, Percent } from 'lucide-react'
import { updateLoyaltySettings } from './actions'

interface Stats {
  settings: any
  totalEarned: number
  totalRedeemed: number
  activeBalance: number
}

export default function FidelityStats({ stats }: { stats: Stats }) {
  return (
    <div className="flex flex-col gap-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card: Saldo Total Ativo */}
        <div className="glass-panel overflow-hidden border-t-2 border-[--primary]">
          <div className="p-2 px-4 border-b border-[--card-border] card-texture-header flex justify-between items-center bg-black/40">
             <h3 className="text-[10px] uppercase tracking-widest text-[--primary] font-serif font-bold">Passivo de Cashback</h3>
             <Gift className="w-4 h-4 text-[--primary] opacity-60" />
          </div>
          <div className="p-6 flex flex-col items-center bg-gradient-to-b from-transparent to-[--primary]/5">
             <span className="text-3xl font-serif text-[--foreground] title-glow uppercase">R$ {stats.activeBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
             <p className="text-[10px] text-[--secondary-text] mt-2 font-bold opacity-60 uppercase tracking-tighter">Total a ser resgatado</p>
          </div>
        </div>

        {/* Card: Total Já Gerado */}
        <div className="glass-panel overflow-hidden border-t-2 border-[--success]/40">
          <div className="p-2 px-4 border-b border-[--card-border] card-texture-header flex justify-between items-center bg-black/40">
             <h3 className="text-[10px] uppercase tracking-widest text-[--success] font-serif font-bold">Histórico de Ganhos</h3>
             <Star className="w-4 h-4 text-[--success] opacity-60" />
          </div>
          <div className="p-6 flex flex-col items-center bg-gradient-to-b from-transparent to-[--success]/5">
             <span className="text-3xl font-serif text-[--success] title-glow uppercase">R$ {stats.totalEarned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
             <p className="text-[10px] text-[--secondary-text] mt-2 font-bold opacity-60 uppercase tracking-tighter">Acumulado Total</p>
          </div>
        </div>

        {/* Configuração Rápida */}
        <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/20 bg-black/40 shadow-2xl">
           <div className="p-2 px-4 border-b border-[--card-border] card-texture-header flex items-center gap-2 bg-black/60">
              <Settings className="w-4 h-4 text-[--primary]" />
              <h3 className="text-[10px] uppercase tracking-widest font-bold font-serif text-[--primary]">Configuração Global</h3>
           </div>
           
           <div className="p-6">
             <form action={updateLoyaltySettings} className="flex flex-col gap-4">
                <div className="flex-1">
                   <label className="text-[10px] uppercase tracking-widest text-[--secondary-text] block mb-2 font-bold opacity-60">Percentual de Cashback</label>
                   <div className="relative group">
                      <input 
                        name="cashback_percentage"
                        type="number" 
                        step="0.1" 
                        defaultValue={stats.settings?.cashback_percentage || 5} 
                        className="bg-black/60 border border-white/10 text-lg p-3 w-full pr-10 rounded-xl font-serif text-[--primary] focus:border-[--primary] transition-all outline-none shadow-inner"
                      />
                      <Percent className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[--primary] opacity-20 group-focus-within:opacity-100 transition-opacity" />
                   </div>
                </div>
                <button type="submit" className="golden-btn w-full py-3 text-xs uppercase tracking-widest font-serif font-bold">
                   Salvar Alterações
                </button>
             </form>
           </div>
        </div>

      </div>

    </div>
  )
}
