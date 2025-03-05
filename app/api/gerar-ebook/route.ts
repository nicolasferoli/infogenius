import { NextResponse } from "next/server"
import { gerarConteudoEbook } from "../ai-actions"

export const maxDuration = 60 // Aumentar o tempo máximo de execução para 60 segundos

export async function POST(request: Request) {
  try {
    const { produtoId, titulo, descricao, capitulo } = await request.json()

    if (!produtoId || !titulo || !capitulo) {
      return NextResponse.json({ error: "Dados incompletos para geração do e-book" }, { status: 400 })
    }

    // Gerar conteúdo para o capítulo específico
    const conteudoGerado = await gerarConteudoEbook(titulo, descricao, capitulo)

    return NextResponse.json({ conteudo: conteudoGerado })
  } catch (error) {
    console.error("Erro ao gerar conteúdo do e-book:", error)
    return NextResponse.json({ error: "Falha ao gerar conteúdo do e-book" }, { status: 500 })
  }
}

