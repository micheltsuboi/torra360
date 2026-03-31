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
    <div className="w-full max-w-5xl">
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        
        {/* Card 1: Ganhos Ativos */}
        <div className="flex-1 glass-panel overflow-hidden border-t-2 border-[--success]/40 bg-black/20 text-center">
          <div className="p-2 px-4 border-b border-[--card-border] card-texture-header flex justify-between items-center bg-black/40">
             <h3 className="text-[9px] uppercase tracking-widest text-[--success] font-serif font-bold">Ganhos Ativos</h3>
             <Star className="w-4 h-4 text-[--success] opacity-60" />
          </div>
          <div className="p-4 flex flex-col items-center bg-gradient-to-b from-transparent to-[--success]/5">
             <span className="text-2xl font-serif text-[--success] title-glow">R$ {stats.totalEarned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
             <p className="text-[9px] text-[--secondary-text] mt-1 font-bold opacity-40 uppercase tracking-tighter text-center">Acumulado não expirado</p>
          </div>
        </div>

        {/* Card 2: Saldo Disponível */}
        <div className="flex-1 glass-panel overflow-hidden border-t-2 border-[--primary] bg-black/20 text-center">
          <div className="p-2 px-4 border-b border-[--card-border] card-texture-header flex justify-between items-center bg-black/40">
             <h3 className="text-[9px] uppercase tracking-widest text-[--primary] font-serif font-bold">Saldo Disponível</h3>
             <Gift className="w-4 h-4 text-[--primary] opacity-60" />
          </div>
          <div className="p-4 flex flex-col items-center bg-gradient-to-b from-transparent to-[--primary]/5">
             <span className="text-2xl font-serif text-[--foreground] title-glow">R$ {stats.activeBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
             <p className="text-[9px] text-[--secondary-text] mt-1 font-bold opacity-40 uppercase tracking-tighter text-center">Pronto para resgate</p>
          </div>
        </div>

        {/* Card 3: Configurações Admin */}
        <div className="flex-1 glass-panel overflow-hidden border-t-2 border-[--primary]/20 bg-black/40 shadow-2xl">
           <div className="p-2 px-4 border-b border-[--card-border] card-texture-header flex items-center gap-2 bg-black/60 shadow-lg">
              <Settings className="w-3 h-3 text-[--primary]" />
              <h3 className="text-[9px] uppercase tracking-widest font-bold font-serif text-[--primary]">Configuração</h3>
           </div>
           
           <div className="p-2 px-4">
             <form action={updateLoyaltySettings} className="flex flex-col gap-2">
                <div className="flex gap-2">
                   <div className="flex-1">
                      <label className="text-[8px] uppercase tracking-widest text-[--secondary-text] block mb-1 font-bold opacity-60">Cashback (%)</label>
                      <input 
                        name="cashback_percentage"
                        type="number" 
                        step="0.1" 
                        defaultValue={stats.settings?.cashback_percentage || 5} 
                        className="bg-black/60 border border-white/10 text-sm p-1.5 w-full rounded font-serif text-[--primary] focus:border-[--primary] outline-none"
                      />
                   </div>
                   <div className="flex-1">
                      <label className="text-[8px] uppercase tracking-widest text-[--secondary-text] block mb-1 font-bold opacity-60">Validade (dias)</label>
                      <input 
                        name="expiry_days"
                        type="number" 
                        defaultValue={stats.settings?.expiry_days || 365} 
                        className="bg-black/60 border border-white/10 text-sm p-1.5 w-full rounded font-serif text-[--primary] focus:border-[--primary] outline-none"
                      />
                   </div>
                </div>
                <button type="submit" className="golden-btn w-full py-1.5 text-[9px] uppercase tracking-widest font-serif font-bold mb-2">
                   Atualizar Regras
                </button>
             </form>
           </div>
        </div>

      </div>

    </div>
  )
}
