import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Clock, BookOpen } from 'lucide-react'
import Layout from '@/components/Layout'
import { supabase, Module, Video } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export default function Modules() {
  const { user } = useAuth()
  const [modules, setModules] = useState<(Module & { videos: Video[]; completedCount: number })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchModules() {
      try {
        const { data: modulesData } = await supabase
          .from('modules')
          .select('*')
          .order('order_index')

        if (modulesData) {
          const modulesWithVideos = await Promise.all(
            modulesData.map(async (module) => {
              const { data: videos } = await supabase
                .from('videos')
                .select('*')
                .eq('module_id', module.id)
                .order('order_index')

              let completedCount = 0
              if (user && videos) {
                const { data: progress } = await supabase
                  .from('user_progress')
                  .select('video_id')
                  .eq('user_id', user.id)
                  .eq('completed', true)
                  .in('video_id', videos.map(v => v.id))

                completedCount = progress?.length || 0
              }

              return {
                ...module,
                videos: videos || [],
                completedCount
              }
            })
          )
          setModules(modulesWithVideos)
        }
      } catch (error) {
        console.error('Error fetching modules:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchModules()
  }, [user])

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
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Módulos de Treino</h1>
          <p className="mt-1 text-muted-foreground">
            Explore todos os módulos disponíveis
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const progress = module.videos.length > 0 
              ? Math.round((module.completedCount / module.videos.length) * 100) 
              : 0

            return (
              <Link
                key={module.id}
                to={`/module/${module.id}`}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary hover:shadow-lg animate-fade-in"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={module.thumbnail_url}
                    alt={module.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Play className="h-14 w-14 text-white" />
                  </div>
                  {progress === 100 && (
                    <div className="absolute right-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                      Completo
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
                    {module.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {module.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{module.duration_minutes} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{module.videos.length} aulas</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium text-foreground">{progress}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                      <div 
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
