import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getProdutos, createProduto } from "@/lib/db"

export async function GET() {
  try {
    // Get current user
    const user = getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Get produtos for current user
    const produtos = getProdutos(user.id)

    return NextResponse.json(produtos)
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Falha ao buscar produtos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Get current user
    const user = getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Get produto data from request
    const produtoData = await request.json()

    // Create produto
    const produto = createProduto({
      ...produtoData,
      userId: user.id,
    })

    return NextResponse.json(produto)
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return NextResponse.json({ error: "Falha ao criar produto" }, { status: 500 })
  }
}

