import { Link } from 'react-router-dom'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function AuthError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-foreground">Erro de Autenticação</h1>
        <p className="mt-2 text-muted-foreground">
          Ocorreu um erro durante a autenticação. Por favor, tente novamente.
        </p>
        <Link
          to="/auth"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao login
        </Link>
      </div>
    </div>
  )
}
