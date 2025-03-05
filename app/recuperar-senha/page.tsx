"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ArrowLeft, FileText, Loader2, Mail } from "lucide-react"

export default function RecuperarSenhaPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe seu email.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, this would call an API endpoint to send a password reset email
      setEmailSent(true)

      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      })
    } catch (error) {
      console.error("Erro ao enviar email:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar enviar o email. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">InfoGenius</h1>
          <p className="mt-2 text-sm text-gray-600">Gerador de Infoprodutos com IA</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Recuperar Senha</CardTitle>
            <CardDescription className="text-center">
              {!emailSent
                ? "Informe seu email para receber instruções de recuperação de senha"
                : "Verifique seu email para redefinir sua senha"}
            </CardDescription>
          </CardHeader>

          {!emailSent ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-11"
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar instruções"
                  )}
                </Button>

                <div className="text-center text-sm">
                  <Link href="/login" className="inline-flex items-center text-primary hover:underline font-medium">
                    <ArrowLeft className="mr-1 h-3 w-3" />
                    Voltar para o login
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-6 pt-4 pb-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Email enviado</h3>
                  <p className="text-sm text-muted-foreground">
                    Enviamos um email para <span className="font-medium">{email}</span> com instruções para redefinir
                    sua senha.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <Button className="w-full h-11" variant="outline" onClick={() => router.push("/login")}>
                  Voltar para o login
                </Button>

                <Button
                  className="w-full h-11"
                  variant="ghost"
                  onClick={() => {
                    setEmailSent(false)
                    setEmail("")
                  }}
                >
                  Tentar com outro email
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} InfoGenius. Todos os direitos reservados.</p>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

