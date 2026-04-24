import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/app');

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Verificação de Tenant e Redirecionamento para usuários logados
  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role, tenants(active)')
      .eq('id', user.id)
      .single();

    const isTenantInactive = userData?.tenants && 
      (Array.isArray(userData.tenants) ? userData.tenants[0]?.active === false : (userData.tenants as any).active === false);

    // Se o tenant estiver inativo e não for admin
    if (userData && userData.role !== 'admin' && isTenantInactive) {
      if (isProtectedRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('error', 'tenant_inactive')
        return NextResponse.redirect(url)
      }
      
      // Se estiver em rota de auth mas com tenant inativo, não redireciona para o dashboard
      // Apenas retorna a resposta padrão (mantém no login/signup)
      return supabaseResponse
    }

    // Se o usuário está logado e o tenant está ATIVO (ou é admin)
    if (isAuthRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
