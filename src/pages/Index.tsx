import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, CheckSquare, TrendingUp, Play, Clock, Target } from 'lucide-react'
import Layout from '@/components/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, Module, ChecklistItem, UserProgress } from '@/lib/supabase'

export default function Index() {
  const { user } = useAuth()
  const [modules, setModules] = useState<Module[]>([])
  const [todayChecklist, setTodayChecklist] = useState<{ total: number; completed: number }>({ total: 0, completed: 0 })
  const [progressStats, setProgressStats] = useState<{ completed: number; total: number }>({ completed: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch modules
        const { data: modulesData } = await supabase
          .from('modules')
          .select('*')
          .order('order_index')
          .limit(3)

        if (modulesData) setModules(modulesData)

        // Fetch checklist stats
        const { data: checklistItems } = await supabase
          .from('checklist_items')
          .select('id')

        if (checklistItems && user) {
          const today = new Date().toISOString().split('T')[0]
          const { data: completedToday } = await supabase
            .from('user_checklist')
            .select('id')
            .eq('user_id', user.id)
            .eq('completed_at', today)

          setTodayChecklist({
            total: checklistItems.length,
            completed: completedToday?.length || 0
          })
        }

        // Fetch progress stats
        if (user) {
          const { data: videos } = await supabase.from('videos').select('id')
          const { data: progress } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('completed', true)

          setProgressStats({
            total: videos?.length || 0,
            completed: progress?.length || 0
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8 pb-20 md:ml-64 md:pb-8">
        {/* Welcome Section */}
        <section className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {greeting()}! <span className="text-primary">{user?.user_metadata?.full_name?.split(' ')[0] || 'Atleta'}</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Pronto para mais um dia de evolução?
          </p>
        </section>

        {/* Stats Cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/progress"
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progresso Geral</p>
                <p className="text-2xl font-bold text-foreground">
                  {progressStats.total > 0 
                    ? Math.round((progressStats.completed / progressStats.total) * 100)
                    : 0}%
                </p>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div 
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progressStats.total > 0 ? (progressStats.completed / progressStats.total) * 100 : 0}%` }}
              />
            </div>
          </Link>

          <Link
            to="/checklist"
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <CheckSquare className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Checklist Hoje</p>
                <p className="text-2xl font-bold text-foreground">
                  {todayChecklist.completed}/{todayChecklist.total}
                </p>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div 
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${todayChecklist.total > 0 ? (todayChecklist.completed / todayChecklist.total) * 100 : 0}%` }}
              />
            </div>
          </Link>

          <Link
            to="/modules"
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-lg sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aulas Concluídas</p>
                <p className="text-2xl font-bold text-foreground">
                  {progressStats.completed}/{progressStats.total}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Continue seu treino de onde parou
            </p>
          </Link>
        </section>

        {/* Featured Modules */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Módulos em Destaque</h2>
            <Link to="/modules" className="text-sm font-medium text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <Link
                key={module.id}
                to={`/module/${module.id}`}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary hover:shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={module.thumbnail_url}
                    alt={module.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary">
                    {module.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {module.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{module.duration_minutes} min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">Ações Rápidas</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/checklist"
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:bg-accent"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Completar Checklist</p>
                <p className="text-sm text-muted-foreground">Marque suas metas diárias</p>
              </div>
            </Link>
            <Link
              to="/modules"
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:bg-accent"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Play className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Assistir Aula</p>
                <p className="text-sm text-muted-foreground">Continue seu aprendizado</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  )
}
