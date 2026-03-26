import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Play } from 'lucide-react'
import Layout from '@/components/Layout'
import { supabase, Video, UserProgress } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export default function VideoDetail() {
  const { moduleId, videoId } = useParams<{ moduleId: string; videoId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [video, setVideo] = useState<Video | null>(null)
  const [allVideos, setAllVideos] = useState<Video[]>([])
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)

  useEffect(() => {
    async function fetchVideo() {
      if (!videoId || !moduleId) return

      try {
        const { data: videoData } = await supabase
          .from('videos')
          .select('*')
          .eq('id', videoId)
          .single()

        if (videoData) setVideo(videoData)

        const { data: videosData } = await supabase
          .from('videos')
          .select('*')
          .eq('module_id', moduleId)
          .order('order_index')

        if (videosData) setAllVideos(videosData)

        if (user) {
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('video_id', videoId)
            .single()

          setProgress(progressData)
        }
      } catch (error) {
        console.error('Error fetching video:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideo()
  }, [videoId, moduleId, user])

  const markAsCompleted = async () => {
    if (!user || !videoId) return
    
    setMarking(true)
    try {
      if (progress) {
        await supabase
          .from('user_progress')
          .update({ completed: true, progress_percent: 100, last_watched_at: new Date().toISOString() })
          .eq('id', progress.id)
      } else {
        await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            video_id: videoId,
            completed: true,
            progress_percent: 100,
            last_watched_at: new Date().toISOString()
          })
      }
      
      setProgress({ ...progress, completed: true, progress_percent: 100 } as UserProgress)
      toast.success('Aula marcada como concluída!')
    } catch (error) {
      toast.error('Erro ao marcar aula como concluída')
    } finally {
      setMarking(false)
    }
  }

  const currentIndex = allVideos.findIndex(v => v.id === videoId)
  const prevVideo = currentIndex > 0 ? allVideos[currentIndex - 1] : null
  const nextVideo = currentIndex < allVideos.length - 1 ? allVideos[currentIndex + 1] : null

  if (loading) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center md:ml-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    )
  }

  if (!video) {
    return (
      <Layout>
        <div className="md:ml-64">
          <p className="text-muted-foreground">Vídeo não encontrado.</p>
          <Link to={`/module/${moduleId}`} className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao módulo
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="pb-20 md:ml-64 md:pb-8">
        {/* Back Button */}
        <Link 
          to={`/module/${moduleId}`} 
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao módulo
        </Link>

        {/* Video Player */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative aspect-video bg-black">
            <iframe
              src={video.video_url}
              title={video.title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Video Info */}
        <div className="mb-6 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground md:text-2xl">{video.title}</h1>
              <p className="mt-2 text-muted-foreground">{video.description}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{video.duration_minutes} min</span>
                </div>
                {progress?.completed && (
                  <div className="flex items-center gap-1 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Concluído</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={markAsCompleted}
              disabled={marking || progress?.completed}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 font-medium transition-colors ${
                progress?.completed
                  ? 'bg-primary/10 text-primary cursor-default'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              } disabled:opacity-50`}
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>{progress?.completed ? 'Concluído' : 'Marcar como concluído'}</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          {prevVideo ? (
            <Link
              to={`/video/${moduleId}/${prevVideo.id}`}
              className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Anterior</p>
                <p className="truncate font-medium text-foreground">{prevVideo.title}</p>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextVideo ? (
            <Link
              to={`/video/${moduleId}/${nextVideo.id}`}
              className="flex flex-1 items-center justify-end gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:bg-accent"
            >
              <div className="min-w-0 text-right">
                <p className="text-xs text-muted-foreground">Próximo</p>
                <p className="truncate font-medium text-foreground">{nextVideo.title}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ) : (
            <Link
              to={`/module/${moduleId}`}
              className="flex flex-1 items-center justify-end gap-3 rounded-xl border border-primary bg-primary/10 p-4 transition-all hover:bg-primary/20"
            >
              <div className="min-w-0 text-right">
                <p className="text-xs text-primary/70">Módulo completo!</p>
                <p className="truncate font-medium text-primary">Voltar ao módulo</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </Link>
          )}
        </div>

        {/* Other Videos */}
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Outras aulas deste módulo</h2>
          <div className="space-y-2">
            {allVideos.filter(v => v.id !== videoId).map((v) => (
              <Link
                key={v.id}
                to={`/video/${moduleId}/${v.id}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary hover:bg-accent"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-muted text-sm text-muted-foreground">
                  <Play className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{v.title}</p>
                </div>
                <span className="text-xs text-muted-foreground">{v.duration_minutes} min</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
