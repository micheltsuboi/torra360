import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/login/actions'
import { 
  Leaf, 
  Settings, 
  LogOut, 
  Coffee, 
  TrendingUp, 
  Box, 
  Activity,
  Flame,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* Sidebar Lateral */}
      <aside className="w-20 lg:w-64 flex flex-col items-center lg:items-start p-4 bg-black/10 backdrop-blur-sm relative z-20">
        <div className="flex items-center gap-3 w-full mb-10 mt-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full border border-[--primary] flex items-center justify-center text-[--primary] shrink-0">
            <Coffee className="w-4 h-4" />
          </div>
          <span className="font-serif text-xl tracking-wide hidden lg:block title-glow text-[--primary]">Torra 360</span>
        </div>

        <nav className="flex-1 w-full flex flex-col gap-4 items-center lg:items-start text-[--secondary-text]">
          {/* Dashboard Item */}
          <a href="/dashboard" className="flex items-center gap-4 p-3 w-full rounded-md hover:bg-[--primary]/10 hover:text-[--primary] transition-all">
            <LayoutDashboard className="w-5 h-5 opacity-80" />
            <span className="hidden lg:block text-sm font-medium">Dashboard</span>
          </a>
          {/* Café Verde */}
          <a href="/dashboard/estoque" className="flex items-center gap-4 p-3 w-full rounded-md hover:bg-[--primary]/10 hover:text-[--primary] transition-all">
            <Leaf className="w-5 h-5 opacity-80" />
            <span className="hidden lg:block text-sm font-medium">Café Verde</span>
          </a>
          {/* Torra */}
          <a href="/dashboard/torra" className="flex items-center gap-4 p-3 w-full rounded-md hover:bg-[--primary]/10 hover:text-[--primary] transition-all">
            <Flame className="w-5 h-5 opacity-80" />
            <span className="hidden lg:block text-sm font-medium">Produção / Torra</span>
          </a>
          {/* Pacotes / Embalamento */}
          <a href="/dashboard/pacotes" className="flex items-center gap-4 p-3 w-full rounded-md hover:bg-[--primary]/10 hover:text-[--primary] transition-all">
            <Box className="w-5 h-5 opacity-80" />
            <span className="hidden lg:block text-sm font-medium">Embalamento</span>
          </a>
          {/* Comercial */}
          <a href="/dashboard/comercial" className="flex items-center gap-4 p-3 w-full rounded-md hover:bg-[--primary]/10 hover:text-[--primary] transition-all">
            <TrendingUp className="w-5 h-5 opacity-80" />
            <span className="hidden lg:block text-sm font-medium">Comercial</span>
          </a>
          {/* Parâmetros */}
          <a href="/dashboard/parametros" className="flex items-center gap-4 p-3 w-full rounded-md hover:bg-[--primary]/10 hover:text-[--primary] transition-all">
            <Settings className="w-5 h-5 opacity-80" />
            <span className="hidden lg:block text-sm font-medium">Parâmetros</span>
          </a>
        </nav>

        {/* User Profile / Logout */}
        <div className="w-full pt-4 border-t border-[--card-border] mt-auto">
          <form action={logout}>
            <button className="flex items-center justify-center lg:justify-start gap-4 p-3 w-full danger-btn w-full">
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:block text-sm font-medium">Sair</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto">
        
        {/* Topbar Header */}
        <header className="sticky top-0 z-10 p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pointer-events-none">
          {/* Titulo Header da Rota (dinamico, aqui deixamos vazio e renderizamos na pagina) */}
          <div className="w-full flex justify-end gap-4 pointer-events-auto">
             <div className="glass-panel px-3 py-2 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition">
               <div className="w-8 h-8 rounded-full bg-[--secondary] overflow-hidden">
                 {/* Replaced placeholder random image with more realistic avatar style to match reference */}
                 <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.email}`} alt="User" />
               </div>
               <div className="hidden md:flex flex-col">
                 <span className="text-sm font-medium text-[--foreground]">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                 <span className="text-xs text-[--secondary-text]">Head of Sourcing</span>
               </div>
               <ChevronDown className="w-4 h-4 text-[--secondary-text] ml-2 hidden md:block" />
             </div>
          </div>
        </header>

        {/* Content Render */}
        <div className="p-6 pt-0 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  )
}
