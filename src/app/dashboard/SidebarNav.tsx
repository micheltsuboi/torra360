'use client'

import { usePathname } from 'next/navigation'
import { 
  Leaf, 
  Settings, 
  TrendingUp, 
  Box, 
  Flame,
  LayoutDashboard,
  Users,
  Coins,
  BarChart3,
  Star,
  ShieldCheck
} from 'lucide-react'

export default function SidebarNav({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname()

  const commonItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ]

  const roasteryItems = [
    { name: 'Configurações', href: '/dashboard/parametros', icon: Settings },
    { name: 'Café Verde', href: '/dashboard/estoque', icon: Leaf },
    { name: 'Produção / Torra', href: '/dashboard/torra', icon: Flame },
    { name: 'Embalamento', href: '/dashboard/pacotes', icon: Box },
    { name: 'Embalagens', href: '/dashboard/embalagens', icon: Box },
    { name: 'Comercial', href: '/dashboard/comercial', icon: TrendingUp },
    { name: 'Financeiro', href: '/dashboard/financeiro', icon: BarChart3 },
    { name: 'Clientes', href: '/dashboard/clientes', icon: Users },
    { name: 'Fidelidade', href: '/dashboard/fidelidade', icon: Star },
    { name: 'Custos', href: '/dashboard/custos', icon: Coins },
  ]

  // Se for Admin Master, mostramos um menu muito reduzido
  const navItems = isAdmin 
    ? [
        ...commonItems,
        { name: 'Admin Master', href: '/dashboard/admin', icon: ShieldCheck }
      ]
    : [
        ...commonItems,
        ...roasteryItems
      ]

  return (
    <nav className="flex-1 w-full flex flex-col gap-2 items-center lg:items-start text-[--secondary-text] overflow-y-auto pr-2 scrollbar-hide">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        const isAdminItem = item.href === '/dashboard/admin'

        return (
          <a 
            key={item.href}
            href={item.href} 
            className={`flex items-center gap-2 p-2 w-full rounded-md transition-all nav-item-glow ${
              isActive 
                ? 'nav-active' 
                : isAdminItem 
                  ? 'hover:bg-[--primary]/10 text-[--primary] border border-[--primary]/20' 
                  : 'hover:bg-[--primary]/10 hover:text-[--primary]'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? '' : 'opacity-80'}`} />
            <span className={`hidden lg:block text-sm font-medium ${isAdminItem ? 'font-bold' : ''}`}>{item.name}</span>
          </a>
        )
      })}
    </nav>
  )
}
