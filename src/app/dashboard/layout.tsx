import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/login/actions'
import SidebarNav from './SidebarNav'
import { 
  LogOut, 
  ChevronDown,
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
        <div className="flex items-center gap-3 w-full mb-12 mt-4 px-2 cursor-pointer group h-14 overflow-hidden">
          <img 
            src="/icon.png" 
            alt="Icon" 
            width="48"
            height="48"
            style={{ maxWidth: '48px', maxHeight: '48px' }}
            className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(195,153,103,0.3)] branding-icon-only" 
          />
          <img 
            src="/logo-full.png" 
            alt="Torra 360" 
            style={{ maxWidth: '180px', maxHeight: '56px' }}
            className="h-full w-auto object-contain brightness-125 drop-shadow-lg branding-logo-full" 
          />
        </div>

        <SidebarNav />

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
