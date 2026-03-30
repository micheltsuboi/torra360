import { signup } from '@/app/login/actions'

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full wood-texture opacity-10 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md p-8 glass-panel my-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl title-glow font-serif text-[--primary] mb-2">TORRA 360</h1>
          <p className="text-[--secondary-text] text-sm">Crie sua Torrefação no sistema</p>
        </div>

        <form className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1">
            <label htmlFor="company" className="text-sm text-left text-[--secondary-text]">Nome da Torrefação</label>
            <input
              id="company"
              name="company"
              type="text"
              required
              placeholder="Ex: Aura Coffee Roasters"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm text-left text-[--secondary-text]">Seu Nome Completo</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Ex: João da Silva"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm text-left text-[--secondary-text]">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="voce@exemplo.com"
            />
          </div>

          <div className="flex flex-col gap-1">
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
            <button formAction={signup} className="primary-btn w-full py-3">
              Criar Conta e Iniciar
            </button>
            <a href="/login" className="secondary-btn w-full text-center mt-2">
              Já tem uma conta? Entre aqui
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
