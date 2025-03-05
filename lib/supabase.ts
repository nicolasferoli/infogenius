import { createClient } from "@supabase/supabase-js"

// Essas variáveis de ambiente precisam ser configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Verificar se as variáveis de ambiente estão configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL e Anon Key são necessários. Configure as variáveis de ambiente.")
}

// Criar o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para os usuários
export type UserProfile = {
  id: string
  name: string
  email: string
  created_at: string
}

// Tipos para os produtos
export type Product = {
  id: string
  user_id: string
  title: string
  description: string
  niche: string
  subniche: string
  has_ebook: boolean
  target_audience?: string
  features_benefits?: string[]
  created_at: string
}

// Tipos para os ebooks
export type Ebook = {
  id: string
  user_id: string
  product_id: string
  title: string
  description: string
  chapters: Chapter[]
  status: "pending" | "generating" | "completed" | "error"
  progress: number
  created_at: string
}

export type Chapter = {
  id: string
  title: string
  content?: string
  status?: "pending" | "generating" | "completed" | "error"
}

