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
    <div className="relative z-10 w-full max-w-md p-8 glass-panel">
      <div className="text-center mb-10 flex flex-col items-center">
        <div className="w-full max-w-[240px] px-2 mb-4">
          <img src="/logo-full.png" alt="Torra 360" className="w-full h-auto object-contain brightness-125 drop-shadow-[0_0_20px_rgba(195,153,103,0.3)]" />
        </div>
        <p className="text-[--secondary-text] text-[10px] opacity-50 tracking-[0.2em] font-medium uppercase text-center">SISTEMA DE GESTÃO PARA TORREFAÇÃO</p>
      </div>

      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm text-left text-[--secondary-text] flex items-center gap-2">
            <Mail className="w-3 h-3" /> E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="voce@exemplo.com"
            className="bg-black/20 border-white/10 text-white placeholder:text-white/20"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-sm text-left text-[--secondary-text] flex items-center gap-2">
              <Lock className="w-3 h-3" /> Senha
            </label>
            <a href="/login/forgot-password" className="text-[10px] text-[--primary] hover:underline opacity-70">Esqueci minha senha</a>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="bg-black/20 border-white/10 text-white placeholder:text-white/20 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {errorMsg && errorMsg !== 'tenant_inactive' && (
          <div className="p-3 text-sm text-[--danger] danger-bg border danger-border rounded-md text-center">
            {errorMsg === 'reset_sent' ? (
              <div className="flex flex-col gap-1 text-emerald-500">
                <span className="font-bold">E-mail Enviado!</span>
                <span className="opacity-80 text-xs">Verifique sua caixa de entrada para redefinir sua senha.</span>
              </div>
            ) : errorMsg === 'password_updated' ? (
              <div className="flex flex-col gap-1 text-emerald-500">
                <span className="font-bold">Senha Atualizada!</span>
                <span className="opacity-80 text-xs">Sua nova senha já está valendo. Pode fazer o login agora.</span>
              </div>
            ) : errorMsg === 'Invalid login credentials' ? (
              "E-mail ou senha incorretos."
            ) : (
              errorMsg || "Dados de acesso inválidos ou erro no servidor."
            )}
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
  )
}
