'use client'

import { login, signup } from './actions'
import ErrorModal from './ErrorModal'
import { Suspense, useState } from 'react'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full wood-texture opacity-10 pointer-events-none" />
      
      <Suspense fallback={null}>
        <ErrorModal />
        <LoginFormContent />
      </Suspense>
    </div>
  )
}

function LoginFormContent() {
  const searchParams = useSearchParams()
  const errorMsg = searchParams.get('error')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative z-10 w-full max-w-md p-8 glass-panel border-t-2 border-[--primary]/20">
      <div className="text-center mb-10 flex flex-col items-center">
        <div className="w-full max-w-[220px] px-2 mb-4">
          <img src="/logo-full.png" alt="Torra 360" className="w-full h-auto object-contain brightness-125 drop-shadow-[0_0_20px_rgba(195,153,103,0.3)]" />
        </div>
        <p className="text-[--secondary-text] text-[10px] opacity-40 tracking-[0.3em] font-medium uppercase text-center">SISTEMA DE GESTÃO PARA TORREFAÇÃO</p>
      </div>

      <form className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-[--secondary-text] flex items-center gap-2 opacity-70">
            <Mail className="w-3 h-3 text-[--primary]" /> E-mail
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="voce@exemplo.com"
              className="bg-black/40 border-white/5 text-white placeholder:text-white/10 focus:border-[--primary]/50 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-[10px] uppercase tracking-widest text-[--secondary-text] flex items-center gap-2 opacity-70">
              <Lock className="w-3 h-3 text-[--primary]" /> Senha
            </label>
            <a href="/login/forgot-password" className="text-[10px] text-[--primary] hover:underline opacity-60 hover:opacity-100 transition-opacity">Esqueci minha senha</a>
          </div>
          <div className="relative w-full">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="bg-black/40 border-white/5 text-white placeholder:text-white/10 pr-12 focus:border-[--primary]/50 transition-all w-full block"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-white/30 hover:text-[--primary] transition-all cursor-pointer outline-none z-30"
              style={{ 
                right: '12px', 
                left: 'auto', 
                background: 'transparent', 
                border: 'none', 
                padding: '8px',
                appearance: 'none',
                WebkitAppearance: 'none'
              }}
              title={showPassword ? "Esconder senha" : "Ver senha"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {errorMsg && errorMsg !== 'tenant_inactive' && (
          <div className="p-4 text-xs text-[--danger] danger-bg border danger-border rounded-lg text-center animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-1">
              {errorMsg === 'reset_sent' ? (
                <>
                  <span className="font-bold text-emerald-500 uppercase tracking-wider">E-mail Enviado!</span>
                  <span className="opacity-80">Verifique sua caixa de entrada para redefinir sua senha.</span>
                </>
              ) : errorMsg === 'password_updated' ? (
                <>
                  <span className="font-bold text-emerald-500 uppercase tracking-wider">Senha Atualizada!</span>
                  <span className="opacity-80">Sua nova senha já está valendo. Pode fazer o login agora.</span>
                </>
              ) : errorMsg === 'Invalid login credentials' ? (
                <>
                  <span className="font-bold uppercase tracking-wider">Falha na Autenticação</span>
                  <span className="opacity-80">E-mail ou senha incorretos. Verifique os dados e tente novamente.</span>
                </>
              ) : (
                <>
                  <span className="font-bold uppercase tracking-wider">Erro no Servidor</span>
                  <span className="opacity-80">{errorMsg}</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 mt-4">
          <button formAction={login} className="golden-btn w-full py-4 text-sm tracking-[0.2em] uppercase">
            Entrar no Sistema
          </button>
          <a href="/signup" className="secondary-btn w-full text-center text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
            Criar uma conta
          </a>
        </div>
      </form>
    </div>
  )
}
