import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getEbooks } from "@/lib/db"

export async function GET() {
  try {
    // Get current user
    const user = getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Get ebooks for current user
    const ebooks = getEbooks(user.id)

    return NextResponse.json(ebooks)
  } catch (error) {
    console.error("Erro ao buscar ebooks:", error)
    return NextResponse.json({ error: "Falha ao buscar ebooks" }, { status: 500 })
  }
}

