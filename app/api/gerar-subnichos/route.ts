import { NextResponse } from "next/server"
import { gerarSubnichos } from "../ai-actions"

export async function POST(request: Request) {
  try {
    const { nicho } = await request.json()

    if (!nicho) {
      return NextResponse.json({ error: "Nicho é obrigatório" }, { status: 400 })
    }

    const subnichos = await gerarSubnichos(nicho)

    // Ensure we're returning an array
    const subnichoArray = Array.isArray(subnichos) ? subnichos : []

    return NextResponse.json({ subnichos: subnichoArray })
  } catch (error) {
    console.error("Erro ao gerar subnichos:", error)
    // Return a more detailed error message
    const errorMessage = error instanceof Error ? error.message : "Falha ao gerar subnichos"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

