"use client"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} InfoGenius. Todos os direitos reservados.
        </p>
        <div className="flex items-center space-x-4">
          <Link href="/termos" className="text-sm text-muted-foreground hover:text-foreground">
            Termos de Uso
          </Link>
          <Link href="/privacidade" className="text-sm text-muted-foreground hover:text-foreground">
            Privacidade
          </Link>
          <Link href="/suporte" className="text-sm text-muted-foreground hover:text-foreground">
            Suporte
          </Link>
        </div>
      </div>
    </footer>
  )
}

