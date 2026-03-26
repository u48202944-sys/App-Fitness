import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Mail, Lock, User, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) {
          toast.error(error.message)
        } else {
          toast.success('Login realizado com sucesso!')
          navigate('/')
        }
      } else {
        const { error } = await signUp(email, password, fullName)
        if (error) {
          toast.error(error.message)
        } else {
          toast.success('Cadastro realizado! Verifique seu email para confirmar.')
        }
      }
    } catch {
      toast.error('Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background px-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <TrendingUp className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">FitApp</h1>
          <p className="mt-2 text-muted-foreground">
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-foreground">
                  Nome completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Aguarde...</span>
                </>
              ) : (
                <span>{isLogin ? 'Entrar' : 'Criar conta'}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {isLogin ? (
                <>
                  Não tem conta?{' '}
                  <span className="font-semibold text-primary">Cadastre-se</span>
                </>
              ) : (
                <>
                  Já tem conta?{' '}
                  <span className="font-semibold text-primary">Entre</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
