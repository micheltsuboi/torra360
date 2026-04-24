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

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Verificação de Tenant Ativo para rotas protegidas
  if (user && isProtectedRoute) {
    const { data: userData } = await supabase
      .from('users')
      .select('role, tenants(active)')
      .eq('id', user.id)
      .single();

    // Se não for admin e o tenant estiver inativo, bloqueia o acesso
    const isTenantInactive = userData?.tenants && 
      (Array.isArray(userData.tenants) ? userData.tenants[0]?.active === false : (userData.tenants as any).active === false);

    if (userData && userData.role !== 'admin' && isTenantInactive) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'tenant_inactive')
      
      // Opcional: Limpar cookies da sessão para forçar logout no cliente
      const response = NextResponse.redirect(url)
      response.cookies.delete('sb-access-token') // Exemplo, o Supabase gerencia isso, mas forçar o redirect já ajuda
      return response
    }
  }

  return supabaseResponse
}
