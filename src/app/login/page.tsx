import { login, signup } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full wood-texture opacity-10 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md p-8 glass-panel">
        <div className="text-center mb-10 flex flex-col items-center">
          <img src="/logo-full.png" alt="Torra 360" className="h-16 object-contain mb-4 brightness-125 drop-shadow-[0_0_15px_rgba(195,153,103,0.3)]" />
          <p className="text-[--secondary-text] text-sm opacity-60">Acesse seu painel de torrefação</p>
        </div>

        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-left text-[--secondary-text]">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="voce@exemplo.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm text-left text-[--secondary-text]">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
            />
          </div>

          {searchParams?.error && (
            <div className="p-3 text-sm text-[--danger] danger-bg border danger-border rounded-md">
              {searchParams.error}
            </div>
          )}

          <div className="flex flex-col gap-3 mt-4">
            <button formAction={login} className="primary-btn w-full">
              Entrar
            </button>
            <a href="/signup" className="secondary-btn w-full text-center">
              Criar uma conta
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
