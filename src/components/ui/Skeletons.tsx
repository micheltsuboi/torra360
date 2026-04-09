import { Loader2 } from 'lucide-react'

export function GlobalSkeleton() {
  return (
    <div className="w-full h-[50vh] flex flex-col items-center justify-center gap-4 bg-black/20 rounded-2xl border border-white/5 animate-pulse mt-4">
      <Loader2 className="w-10 h-10 text-[--primary] animate-spin opacity-50" />
      <p className="text-[10px] uppercase tracking-widest text-[--primary] font-bold opacity-60">Carregando Módulo...</p>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full h-full flex flex-col gap-2 mt-4 glass-panel p-4 animate-pulse">
      <div className="w-full h-8 bg-white/10 rounded-t-lg mb-2"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div 
          key={i} 
          className="w-full h-12 bg-white/[0.02] rounded-md"
          style={{ backgroundColor: i % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'transparent' }}
        ></div>
      ))}
    </div>
  )
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/5 animate-pulse"></div>
      ))}
    </div>
  )
}
