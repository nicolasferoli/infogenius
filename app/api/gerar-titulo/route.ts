import { NextResponse } from "next/server"
import { gerarTituloProduto } from "../ai-actions"

export async function POST(request: Request) {
  try {
    const { nicho, subnicho } = await request.json()

    if (!nicho || !subnicho) {
      return NextResponse.json({ error: "Nicho e subnicho são obrigatórios" }, { status: 400 })
    }

    const tituloGerado = await gerarTituloProduto(nicho, subnicho)

    return NextResponse.json({ titulo: tituloGerado })
  } catch (error) {
    console.error("Erro ao gerar título:", error)
    return NextResponse.json({ error: "Falha ao gerar título do produto" }, { status: 500 })
  }
}

