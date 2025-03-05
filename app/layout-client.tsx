"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Button } from "@/components/ui/button"
import { FileText, Settings, Home, Package, BookOpen, Activity, Menu, X, LogOut } from "lucide-react"
import { useState } from "react"
import { AuthProvider, useAuth } from "@/context/auth-context"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import { Sidebar } from "./sidebar"
import { Footer } from "./footer"

const inter = Inter({ subsets: ["latin"] })

export function AppLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Don't show layout for login and signup pages
  const pathname = typeof window !== "undefined" ? window.location.pathname : ""
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/recuperar-senha"

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Menu</span>
            </Button>

            <div className="mr-4 flex">
              <Link href="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <FileText className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">InfoGenius</span>
              </Link>
            </div>

            <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:space-x-4">
              {isAuthenticated && (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">Olá, {user?.name?.split(" ")[0]}</span>
                  <Button variant="outline" size="icon" asChild>
                    <Link href="/configuracoes">
                      <Settings className="h-5 w-5" />
                      <span className="sr-only">Configurações</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" onClick={logout}>
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Sair</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`absolute top-full left-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden ${isMenuOpen ? "block" : "hidden"}`}
          >
            <div className="p-4 space-y-4">
              <Link
                href="/"
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                <Home className="mr-2 h-4 w-4" />
                <span>Início</span>
              </Link>
              <Link
                href="/produtos"
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                <Package className="mr-2 h-4 w-4" />
                <span>Produtos</span>
              </Link>
              <Link
                href="/ebook"
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                <span>E-books</span>
              </Link>
              <Link
                href="/diagnostico"
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                <Activity className="mr-2 h-4 w-4" />
                <span>Diagnóstico</span>
              </Link>
              <Link
                href="/configuracoes"
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
              {isAuthenticated && (
                <button
                  onClick={logout}
                  className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </button>
              )}
            </div>
          </div>
        </header>
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
        <Footer />
        <Toaster />
      </div>
    </AuthProvider>
  )
}

