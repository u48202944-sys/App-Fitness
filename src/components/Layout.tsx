import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, CheckSquare, TrendingUp, User, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { user, signOut } = useAuth()

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/modules', icon: BookOpen, label: 'Módulos' },
    { path: '/checklist', icon: CheckSquare, label: 'Checklist' },
    { path: '/progress', icon: TrendingUp, label: 'Progresso' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">FitApp</span>
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user.email}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 md:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-64 border-r border-border bg-card p-4 md:block">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Spacer for sidebar */}
      <div className="hidden md:block md:w-64" />
    </div>
  )
}
