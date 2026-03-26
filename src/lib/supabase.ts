import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

// Types
export interface Module {
  id: string
  title: string
  description: string
  thumbnail_url: string
  duration_minutes: number
  order_index: number
  is_published: boolean
  created_at: string
}

export interface Video {
  id: string
  module_id: string
  title: string
  description: string
  video_url: string
  thumbnail_url: string
  duration_minutes: number
  order_index: number
  is_published: boolean
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  video_id: string
  completed: boolean
  progress_percent: number
  last_watched_at: string
}

export interface ChecklistItem {
  id: string
  title: string
  description: string
  category: string
  order_index: number
  is_active: boolean
}

export interface UserChecklist {
  id: string
  user_id: string
  checklist_item_id: string
  completed_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string
}
