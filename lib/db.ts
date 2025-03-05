import { supabase, type Product, type Ebook } from "./supabase"

// Função para obter todos os ebooks
export const getEbooks = async (userId?: string): Promise<Ebook[]> => {
  try {
    let query = supabase.from("ebooks").select("*")

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Erro ao buscar ebooks:", error)
      return []
    }

    return data as Ebook[]
  } catch (error) {
    console.error("Erro ao buscar ebooks:", error)
    return []
  }
}

// Função para obter um ebook por ID
export const getEbookById = async (id: string): Promise<Ebook | null> => {
  try {
    const { data, error } = await supabase.from("ebooks").select("*").eq("id", id).single()

    if (error) {
      console.error("Erro ao buscar ebook:", error)
      return null
    }

    return data as Ebook
  } catch (error) {
    console.error("Erro ao buscar ebook:", error)
    return null
  }
}

// Função para criar um novo ebook
export const createEbook = async (ebook: Omit<Ebook, "id" | "created_at">): Promise<Ebook | null> => {
  try {
    const { data, error } = await supabase
      .from("ebooks")
      .insert([
        {
          ...ebook,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Erro ao criar ebook:", error)
      return null
    }

    return data[0] as Ebook
  } catch (error) {
    console.error("Erro ao criar ebook:", error)
    return null
  }
}

// Função para atualizar um ebook
export const updateEbook = async (id: string, updates: Partial<Ebook>): Promise<Ebook | null> => {
  try {
    const { data, error } = await supabase.from("ebooks").update(updates).eq("id", id).select()

    if (error) {
      console.error("Erro ao atualizar ebook:", error)
      return null
    }

    return data[0] as Ebook
  } catch (error) {
    console.error("Erro ao atualizar ebook:", error)
    return null
  }
}

// Função para excluir um ebook
export const deleteEbook = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("ebooks").delete().eq("id", id)

    if (error) {
      console.error("Erro ao excluir ebook:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao excluir ebook:", error)
    return false
  }
}

// Função para obter todos os produtos
export const getProdutos = async (userId?: string): Promise<Product[]> => {
  try {
    let query = supabase.from("products").select("*")

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Erro ao buscar produtos:", error)
      return []
    }

    return data as Product[]
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return []
  }
}

// Função para obter um produto por ID
export const getProdutoById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error("Erro ao buscar produto:", error)
      return null
    }

    return data as Product
  } catch (error) {
    console.error("Erro ao buscar produto:", error)
    return null
  }
}

// Função para criar um novo produto
export const createProduto = async (produto: Omit<Product, "id" | "created_at">): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          ...produto,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Erro ao criar produto:", error)
      return null
    }

    return data[0] as Product
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return null
  }
}

// Função para atualizar um produto
export const updateProduto = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase.from("products").update(updates).eq("id", id).select()

    if (error) {
      console.error("Erro ao atualizar produto:", error)
      return null
    }

    return data[0] as Product
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
    return null
  }
}

// Função para excluir um produto
export const deleteProduto = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Erro ao excluir produto:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao excluir produto:", error)
    return false
  }
}

