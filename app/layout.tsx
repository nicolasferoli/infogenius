import type React from "react"
;("use server")

import type { Metadata } from "next"
import { AppLayoutClient } from "./layout-client"

export const metadata: Metadata = {
  title: "InfoGenius - Criação de Infoprodutos com IA",
  description: "Crie produtos digitais completos com a ajuda da IA",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppLayoutClient>{children}</AppLayoutClient>
      </body>
    </html>
  )
}



import './globals.css'