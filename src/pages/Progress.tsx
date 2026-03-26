import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, BookOpen, CheckCircle2, Clock, Trophy, Target, Calendar } from 'lucide-react'
import Layout from '@/components/Layout'
import { supabase, Module, Video, UserProgress } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface ModuleProgress {
  module: Module
  videos: Video[]
  completedVideos: number
  progress: number
}

export default function Progress() {
  const { user } = useAuth()
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([])
  const [totalStats, setTotalStats] = useState({
    totalVideos: 0,
    completedVideos: 0,
    totalMinutes: 0,
    completedMinutes: 0
  })
  const [checklistStats, setChecklistStats] = useState({
    todayCompleted: 0,
    totalItems: 0,
    weekStreak: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProgress() {
      if (!user) return

      try {
        // Fetch modules and videos
        const { data: modules } = await supabase
          .from('modules')
          .select('*')
          .order('order_index')

        const { data: videos } = await supabase
          .from('videos')
          .select('*')
          .order('order_index')

        const { data: userProgress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed', true)

        if (modules && videos) {
          const completedVideoIds = new Set(userProgress?.map(p => p.video_id) || [])

          const progress = modules.map(module => {
            const moduleVideos = videos.filter(v => v.module_id === module.id)
            const completedVideos = moduleVideos.filter(v => completedVideoIds.has(v.id)).length
            return {
              module,
              videos: moduleVideos,
              completedVideos,
              progress: moduleVideos.length > 0 
                ? Math.round((completedVideos / moduleVideos.length) * 100)
                : 0
            }
          })

          setModuleProgress(progress)

          // Calculate total stats
          const completedVideosData = videos.filter(v => completedVideoIds.has(v.id))
          setTotalStats({
            totalVideos: videos.length,
            completedVideos: completedVideosData.length,
            totalMinutes: videos.reduce((acc, v) => acc + v.duration_minutes, 0),
            completedMinutes: completedVideosData.reduce((acc, v) => acc + v.duration_minutes, 0)
          })
        }

        // Fetch checklist stats
        const today = new Date().toISOString().split('T')[0]
        const { data: checklistItems } = await supabase
          .from('checklist_items')
          .select('id')

        const { data: todayChecklist } = await supabase
          .from('user_checklist')
          .select('id')
          .eq('user_id', user.id)
          .eq('completed_at', today)

        setChecklistStats({
          todayCompleted: todayChecklist?.length || 0,
          totalItems: checklistItems?.length || 0,
          weekStreak: 0 // Could calculate actual streak
        })

      } catch (error) {
        console.error('Error fetching progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [user])

  const overallProgress = totalStats.totalVideos > 0
    ? Math.round((totalStats.completedVideos / totalStats.totalVideos) * 100)
    : 0

  if (loading) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center md:ml-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6 pb-20 md:ml-64 md:pb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Seu Progresso</h1>
          <p className="mt-1 text-muted-foreground">
            Acompanhe sua evolução e conquistas
          </p>
        </div>

        {/* Overall Progress Card */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
            <div className="relative mb-4 sm:mb-0 sm:mr-6">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-card shadow-lg">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{overallProgress}%</p>
                  <p className="text-xs text-muted-foreground">completo</p>
                </div>
              </div>
              <Trophy className="absolute -right-1 -top-1 h-8 w-8 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">Progresso Geral</h2>
              <p className="mt-1 text-muted-foreground">
                Continue assim! Você está indo muito bem.
              </p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                <div 
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {totalStats.completedVideos}/{totalStats.totalVideos}
                </p>
                <p className="text-sm text-muted-foreground">Aulas concluídas</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {totalStats.completedMinutes} min
                </p>
                <p className="text-sm text-muted-foreground">Tempo assistido</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {checklistStats.todayCompleted}/{checklistStats.totalItems}
                </p>
                <p className="text-sm text-muted-foreground">Metas hoje</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {moduleProgress.filter(m => m.progress === 100).length}
                </p>
                <p className="text-sm text-muted-foreground">Módulos completos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Module Progress */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Progresso por Módulo</h2>
          {moduleProgress.map((mp, index) => (
            <Link
              key={mp.module.id}
              to={`/module/${mp.module.id}`}
              className="block rounded-xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={mp.module.thumbnail_url}
                    alt={mp.module.title}
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                  {mp.progress === 100 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/80">
                      <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{mp.module.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {mp.completedVideos} de {mp.videos.length} aulas concluídas
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1 h-2 overflow-hidden rounded-full bg-muted">
                      <div 
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${mp.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">{mp.progress}%</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}
