import { useEffect, useState } from 'react'
import { CheckCircle2, Circle, Droplets, Dumbbell, Apple, Calendar } from 'lucide-react'
import Layout from '@/components/Layout'
import { supabase, ChecklistItem, UserChecklist } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

const categoryIcons: Record<string, typeof Droplets> = {
  saude: Droplets,
  treino: Dumbbell,
  nutricao: Apple,
}

const categoryLabels: Record<string, string> = {
  saude: 'Saúde',
  treino: 'Treino',
  nutricao: 'Nutrição',
}

export default function Checklist() {
  const { user } = useAuth()
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    async function fetchChecklist() {
      try {
        const { data: itemsData } = await supabase
          .from('checklist_items')
          .select('*')
          .order('order_index')

        if (itemsData) setItems(itemsData)

        if (user) {
          const { data: completedData } = await supabase
            .from('user_checklist')
            .select('checklist_item_id')
            .eq('user_id', user.id)
            .eq('completed_at', today)

          if (completedData) {
            setCompletedIds(new Set(completedData.map(c => c.checklist_item_id)))
          }
        }
      } catch (error) {
        console.error('Error fetching checklist:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChecklist()
  }, [user, today])

  const toggleItem = async (itemId: string) => {
    if (!user) return

    const isCompleted = completedIds.has(itemId)

    try {
      if (isCompleted) {
        // Remove completion
        await supabase
          .from('user_checklist')
          .delete()
          .eq('user_id', user.id)
          .eq('checklist_item_id', itemId)
          .eq('completed_at', today)

        setCompletedIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      } else {
        // Add completion
        await supabase
          .from('user_checklist')
          .insert({
            user_id: user.id,
            checklist_item_id: itemId,
            completed_at: today
          })

        setCompletedIds(prev => new Set([...prev, itemId]))
        
        // Check if all items are completed
        if (completedIds.size + 1 === items.length) {
          toast.success('Parabéns! Você completou todas as metas de hoje!')
        }
      }
    } catch (error) {
      toast.error('Erro ao atualizar checklist')
    }
  }

  const completedCount = completedIds.size
  const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'geral'
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {} as Record<string, ChecklistItem[]>)

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
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Checklist Diário</h1>
          <p className="mt-1 text-muted-foreground">
            Mantenha sua consistência cumprindo suas metas diárias
          </p>
        </div>

        {/* Today's Progress */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Calendar className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Progresso de hoje</p>
              <p className="text-2xl font-bold text-foreground">
                {completedCount} de {items.length} metas
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{progress}%</p>
              <p className="text-sm text-muted-foreground">completo</p>
            </div>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
            <div 
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Checklist by Category */}
        {Object.entries(groupedItems).map(([category, categoryItems]) => {
          const Icon = categoryIcons[category] || Circle
          const label = categoryLabels[category] || category

          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">{label}</h2>
              </div>
              <div className="space-y-2">
                {categoryItems.map((item, index) => {
                  const isCompleted = completedIds.has(item.id)

                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all animate-fade-in ${
                        isCompleted
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card hover:border-primary hover:bg-accent'
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                        isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${isCompleted ? 'text-primary line-through' : 'text-foreground'}`}>
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Motivational Message */}
        {progress === 100 && (
          <div className="rounded-2xl border border-primary bg-primary/10 p-6 text-center animate-fade-in">
            <p className="text-lg font-semibold text-primary">
              Excelente! Você completou todas as metas de hoje!
            </p>
            <p className="mt-1 text-muted-foreground">
              Continue assim e alcance seus objetivos.
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}
