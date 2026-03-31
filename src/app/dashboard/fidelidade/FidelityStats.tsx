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
        <div className="glass-panel p-6 border-l-4 border-[--primary]">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-[--primary]/10 rounded-lg">
                <Gift className="w-6 h-6 text-[--primary]" />
             </div>
             <span className="text-[10px] uppercase tracking-widest text-[--secondary-text] opacity-60">Passivo de Cashback</span>
          </div>
          <div className="flex flex-col">
             <span className="text-2xl font-serif text-[--foreground]">R$ {stats.activeBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
             <p className="text-[10px] text-[--secondary-text] mt-1 font-bold">Total a ser resgatado pelos clientes</p>
          </div>
        </div>

        {/* Card: Total Já Gerado */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-[--success]/10 rounded-lg">
                <Star className="w-6 h-6 text-[--success]" />
             </div>
             <span className="text-[10px] uppercase tracking-widest text-[--secondary-text] opacity-60">Histórico de Ganhos</span>
          </div>
          <div className="flex flex-col">
             <span className="text-2xl font-serif text-[--success]">R$ {stats.totalEarned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
             <p className="text-[10px] text-[--secondary-text] mt-1">Acumulado desde o início</p>
          </div>
        </div>

        {/* Configuração Rápida */}
        <div className="glass-panel p-4 bg-black/40 border border-[--primary]/20">
           <div className="flex items-center gap-2 mb-3">
              <Settings className="w-4 h-4 text-[--primary]" />
              <h3 className="text-xs uppercase tracking-widest font-bold font-serif text-[--primary]">Configuração Admin</h3>
           </div>
           <form action={updateLoyaltySettings} className="flex items-end gap-3">
              <div className="flex-1">
                 <label className="text-[9px] uppercase tracking-tighter opacity-50 block mb-1">Cashback (%)</label>
                 <div className="relative">
                    <input 
                      name="cashback_percentage"
                      type="number" 
                      step="0.1" 
                      defaultValue={stats.settings?.cashback_percentage || 5} 
                      className="bg-black/60 border-white/10 text-sm p-2 w-full pr-8 rounded font-bold"
                    />
                    <Percent className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 opacity-30" />
                 </div>
              </div>
              <button type="submit" className="golden-btn px-4 py-2 text-[10px]">Salvar</button>
           </form>
        </div>

      </div>

    </div>
  )
}
