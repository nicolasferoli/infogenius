import { supabase, type UserProfile } from "./supabase"

// Função para criar um novo usuário
export const createUser = async (name: string, email: string, password: string): Promise<boolean> => {
  try {
    // 1. Registrar o usuário com Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      console.error("Erro ao criar usuário:", authError)
      return false
    }

    if (!authData.user) {
      console.error("Usuário não criado")
      return false
    }

    // 2. Criar o perfil do usuário na tabela profiles
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: authData.user.id,
        name,
        email,
      },
    ])

    if (profileError) {
      console.error("Erro ao criar perfil:", profileError)
      // Idealmente, deveríamos excluir o usuário auth se o perfil falhar
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return false
  }
}

// Função para fazer login
export const loginUser = async (email: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Erro ao fazer login:", error)
      return false
    }

    return !!data.user
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    return false
  }
}

// Função para fazer logout
export const logoutUser = async (): Promise<void> => {
  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.error("Erro ao fazer logout:", error)
  }
}

// Função para obter o usuário atual
export const getCurrentUser = async (): Promise<UserProfile | null> => {
  try {
    // Verificar se há uma sessão ativa
    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData.session) {
      return null
    }

    const userId = sessionData.session.user.id

    // Buscar os dados do perfil do usuário
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error || !data) {
      console.error("Erro ao buscar perfil do usuário:", error)
      return null
    }

    return data as UserProfile
  } catch (error) {
    console.error("Erro ao obter usuário atual:", error)
    return null
  }
}

// Função para verificar se o usuário está autenticado
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getSession()
    return !!data.session
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error)
    return false
  }
}

