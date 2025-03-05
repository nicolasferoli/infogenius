import { NextResponse } from "next/server"
import { gerarDescricaoProduto } from "../ai-actions"

export async function POST(request: Request) {
  try {
    const { titulo, nicho } = await request.json()

    if (!titulo || !nicho) {
      return NextResponse.json({ error: "Título e nicho são obrigatórios" }, { status: 400 })
    }

    const descricaoGerada = await gerarDescricaoProduto(titulo, nicho)

    return NextResponse.json({ descricao: descricaoGerada })
  } catch (error) {
    console.error("Erro ao gerar descrição:", error)
    return NextResponse.json({ error: "Falha ao gerar descrição do produto" }, { status: 500 })
  }
}

