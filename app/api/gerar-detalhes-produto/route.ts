import { NextResponse } from "next/server"
import { gerarDetalhesProduto } from "../ai-actions"

export async function POST(request: Request) {
  try {
    const { nicho, subnicho } = await request.json()

    if (!nicho || !subnicho) {
      return NextResponse.json({ error: "Nicho e subnicho são obrigatórios" }, { status: 400 })
    }

    const detalhes = await gerarDetalhesProduto(nicho, subnicho)

    return NextResponse.json({ detalhes })
  } catch (error) {
    console.error("Erro ao gerar detalhes do produto:", error)
    return NextResponse.json({ error: "Falha ao gerar detalhes do produto" }, { status: 500 })
  }
}

