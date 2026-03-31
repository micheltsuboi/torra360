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
  LayoutDashboard,
  Users,
  Coins,
  BarChart3,
  Star
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
      <aside className="w-20 lg:w-64 flex flex-col items-center lg:items-start p-2 bg-black/10 backdrop-blur-sm relative z-20">
        <div className="flex items-center gap-3 w-full mb-10 mt-2 px-2 cursor-pointer group">
          <div className="shrink-0 transition-transform group-hover:scale-110 duration-500">
             <img src="/icon.png" alt="Icon" className="w-9 h-9 object-contain drop-shadow-[0_0_12px_rgba(195,153,103,0.3)]" />
          </div>
          <div className="hidden lg:block flex-1 min-w-0">
             <img src="/logo-full.png" alt="Torra 360" className="h-7 w-auto object-contain brightness-125 drop-shadow-md" />
          </div>
        </div>

        <nav className="flex-1 w-full flex flex-col gap-2 items-center lg:items-start text-[--secondary-text] overflow-y-auto pr-2 scrollbar-hide">
          {/* Dashboard Item */}
          <a href="/dashboard" className="flex items-center gap-2 p-2 w-full rounded-md hover:bg-[--primary]/10 hover:text-[--primary] transition-all">
            <LayoutDashboard className="w-5 h-5 opacity-80" />
            <span className="hidden lg:block text-sm font-medium">Dashboard</span>
          </a>
          {/* Café Verde */}
          <a href="/dashboard/estoque" className="flex items-center gap-2 p-2 w-full rounded-md hover:bg-[--primary]/10 hover:text-[--primary] transition-all">
            <Leaf className="w-5 h-5 opacity-80" />
            <span className="hidden lg:block text-sm font-medium">Café Verde</span>
          </a>
          {/* Torra */}
          <a href="/dashboard/torra" className="flex items-center gap-2 p-2 w-full rounded-md hover:bg-[--primary]/10 hover:text-[--primary] transition-all">
            <Flame className="w-5 h-5 opacity-80" />
            <span className="hidden lg:block text-sm font-medium">Produção / Torra</span>
          </a>
          {/* Pacotes / Embalamento */}
          <a href="/dashboard/pacotes" className="flex items-center gap-2 p-2 w-full rounded-md hover:bg-[--primary]/10 hover:text-[--primary] transition-all">
            <Box className="w-5 h-5 opacity-80" />
            <span className="hidden lg:block text-sm font-medium">Embalamento</span>
          </a>
          {/* Comercial */}
          <a href="/dashboard/comercial" className="flex items-center gap-2 p-2 w-full rounded-md hover:bg-[--primary]/10 hover:text-[--primary] transition-all">
            <TrendingUp className="w-5 h-5 opacity-80" />
            <span className="hidden lg:block text-sm font-medium">Comercial</span>
          </a>
          {/* Financeiro */}
          <a href="/dashboard/financeiro" className="flex items-center gap-2 p-2 w-full rounded-md hover:bg-[--primary]/10 hover:text-[--primary] transition-all">
            <BarChart3 className="w-5 h-5 opacity-80" />
            <span className="hidden lg:block text-sm font-medium">Financeiro</span>
          </a>
          {/* Clientes */}
          <a href="/dashboard/clientes" className="flex items-center gap-2 p-2 w-full rounded-md hover:bg-[--primary]/10 hover:text-[--primary] transition-all">
            <Users className="w-5 h-5 opacity-80" />
            <span className="hidden lg:block text-sm font-medium">Clientes</span>
          </a>
          {/* Fidelidade */}
          <a href="/dashboard/fidelidade" className="flex items-center gap-2 p-2 w-full rounded-md hover:bg-[--primary]/10 hover:text-[--primary] transition-all">
            <Star className="w-5 h-5 opacity-80" />
            <span className="hidden lg:block text-sm font-medium">Fidelidade</span>
          </a>
          {/* Custos */}
          <a href="/dashboard/custos" className="flex items-center gap-2 p-2 w-full rounded-md hover:bg-[--primary]/10 hover:text-[--primary] transition-all">
            <Coins className="w-5 h-5 opacity-80" />
            <span className="hidden lg:block text-sm font-medium">Custos</span>
          </a>
          {/* Parâmetros */}
          <a href="/dashboard/parametros" className="flex items-center gap-2 p-2 w-full rounded-md hover:bg-[--primary]/10 hover:text-[--primary] transition-all">
            <Settings className="w-5 h-5 opacity-80" />
            <span className="hidden lg:block text-sm font-medium">Parâmetros</span>
          </a>
        </nav>

        {/* User Profile / Logout */}
        <div className="w-full pt-4 border-t border-[--card-border] mt-auto">
          <form action={logout}>
            <button className="flex items-center justify-center lg:justify-start gap-2 p-2 w-full danger-btn w-full">
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:block text-sm font-medium">Sair</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto">
        
        {/* Topbar Header */}
        <header className="sticky top-0 z-10 p-6 flex flex-col md:flex-row gap-2 items-start md:items-center justify-between pointer-events-none">
          {/* Titulo Header da Rota (dinamico, aqui deixamos vazio e renderizamos na pagina) */}
          <div className="w-full flex justify-end gap-2 pointer-events-auto">
             <div className="glass-panel px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-white/5 transition">
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
