import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, Clock, CheckCircle2, Circle } from 'lucide-react'
import Layout from '@/components/Layout'
import { supabase, Module, Video, UserProgress } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export default function ModuleDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [module, setModule] = useState<Module | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [progress, setProgress] = useState<Record<string, UserProgress>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchModule() {
      if (!id) return

      try {
        const { data: moduleData } = await supabase
          .from('modules')
          .select('*')
          .eq('id', id)
          .single()

        if (moduleData) setModule(moduleData)

        const { data: videosData } = await supabase
          .from('videos')
          .select('*')
          .eq('module_id', id)
          .order('order_index')

        if (videosData) setVideos(videosData)

        if (user && videosData) {
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .in('video_id', videosData.map(v => v.id))

          if (progressData) {
            const progressMap: Record<string, UserProgress> = {}
            progressData.forEach(p => {
              progressMap[p.video_id] = p
            })
            setProgress(progressMap)
          }
        }
      } catch (error) {
        console.error('Error fetching module:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchModule()
  }, [id, user])

  if (loading) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center md:ml-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    )
  }

  if (!module) {
    return (
      <Layout>
        <div className="md:ml-64">
          <p className="text-muted-foreground">Módulo não encontrado.</p>
          <Link to="/modules" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Voltar aos módulos
          </Link>
        </div>
      </Layout>
    )
  }

  const completedCount = Object.values(progress).filter(p => p.completed).length
  const overallProgress = videos.length > 0 ? Math.round((completedCount / videos.length) * 100) : 0

  return (
    <Layout>
      <div className="pb-20 md:ml-64 md:pb-8">
        {/* Back Button */}
        <Link 
          to="/modules" 
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar aos módulos
        </Link>

        {/* Module Header */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative aspect-video md:aspect-[3/1]">
            <img
              src={module.thumbnail_url}
              alt={module.title}
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-2xl font-bold text-white md:text-3xl">{module.title}</h1>
              <p className="mt-2 text-white/80">{module.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{module.duration_minutes} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Play className="h-4 w-4" />
                  <span>{videos.length} aulas</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{completedCount} concluídas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progresso do módulo</span>
              <span className="font-medium text-foreground">{overallProgress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div 
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Videos List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Aulas</h2>
          {videos.map((video, index) => {
            const videoProgress = progress[video.id]
            const isCompleted = videoProgress?.completed

            return (
              <Link
                key={video.id}
                to={`/video/${module.id}/${video.id}`}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:bg-accent animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium truncate ${isCompleted ? 'text-primary' : 'text-foreground'}`}>
                    {video.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground truncate">
                    {video.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{video.duration_minutes} min</span>
                  </div>
                  <Play className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
