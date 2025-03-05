"use client"

import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { Home, Package, BookOpen, Activity } from "lucide-react"

export function Sidebar() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) return null

  return (
    <div className="hidden md:block border-r w-64 p-4">
      <div className="space-y-4">
        <div className="py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Módulos</h2>
          <div className="space-y-1">
            <Link
              href="/"
              className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Início</span>
            </Link>
            <Link
              href="/produtos"
              className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Package className="mr-2 h-4 w-4" />
              <span>Produtos</span>
            </Link>
            <Link
              href="/ebook"
              className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              <span>E-books</span>
            </Link>
            <Link
              href="/diagnostico"
              className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Activity className="mr-2 h-4 w-4" />
              <span>Diagnóstico</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

