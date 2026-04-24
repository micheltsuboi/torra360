import { updatePassword } from '../actions'

export default function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: { error: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full wood-texture opacity-10 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md p-8 glass-panel">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-serif text-[--primary] mb-2 tracking-widest uppercase">Nova Senha</h1>
          <p className="text-[--secondary-text] text-xs opacity-60">Defina sua nova senha de acesso.</p>
        </div>

        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm text-left text-[--secondary-text]">Nova Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>

          {searchParams?.error && (
            <div className="p-3 text-sm text-[--danger] danger-bg border danger-border rounded-md text-center">
              {searchParams.error}
            </div>
          )}

          <div className="flex flex-col gap-3 mt-4">
            <button formAction={updatePassword} className="primary-btn w-full">
              Atualizar Senha
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
