"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, XCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function SupabaseTestPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [supabaseUrl, setSupabaseUrl] = useState<string | null>(null)
  const [authSession, setAuthSession] = useState<any>(null)

  const testConnection = async () => {
    setStatus("loading")
    setErrorMessage(null)

    try {
      // Verificar URL do Supabase
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      setSupabaseUrl(url || "Não configurado")

      if (!url) {
        throw new Error("URL do Supabase não configurada")
      }

      // Testar conexão com o Supabase
      const { data, error } = await supabase.from("profiles").select("count").limit(1)

      if (error) {
        throw error
      }

      // Verificar sessão atual
      const { data: sessionData } = await supabase.auth.getSession()
      setAuthSession(sessionData.session)

      setStatus("success")
      toast({
        title: "Conexão bem-sucedida",
        description: "A conexão com o Supabase está funcionando corretamente.",
      })
    } catch (error: any) {
      console.error("Erro ao testar conexão:", error)
      setStatus("error")
      setErrorMessage(error.message || "Erro desconhecido")
      toast({
        title: "Erro de conexão",
        description: error.message || "Ocorreu um erro ao conectar com o Supabase.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Teste de Conexão com Supabase</CardTitle>
          <CardDescription>Verifique se a conexão com o Supabase está funcionando corretamente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === "loading" ? (
            <div className="flex flex-col items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
              <p>Testando conexão com o Supabase...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {status === "success" ? (
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  ) : status === "error" ? (
                    <XCircle className="h-8 w-8 text-red-500" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    {status === "success"
                      ? "Conexão estabelecida"
                      : status === "error"
                        ? "Falha na conexão"
                        : "Status da conexão"}
                  </h3>
                  <p className="text-muted-foreground">
                    {status === "success"
                      ? "A conexão com o Supabase está funcionando corretamente."
                      : status === "error"
                        ? errorMessage || "Ocorreu um erro ao conectar com o Supabase."
                        : "Verificando status da conexão..."}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 border rounded-lg p-4">
                <div>
                  <p className="text-sm font-medium mb-1">URL do Supabase:</p>
                  <Badge variant={supabaseUrl ? "outline" : "destructive"}>{supabaseUrl || "Não configurado"}</Badge>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Status da autenticação:</p>
                  <Badge variant={authSession ? "default" : "secondary"}>
                    {authSession ? "Autenticado" : "Não autenticado"}
                  </Badge>
                </div>

                {authSession && (
                  <div>
                    <p className="text-sm font-medium mb-1">Usuário autenticado:</p>
                    <p className="text-sm bg-muted p-2 rounded">{authSession.user?.email}</p>
                  </div>
                )}

                {status === "error" && errorMessage && (
                  <div>
                    <p className="text-sm font-medium mb-1">Detalhes do erro:</p>
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={testConnection} disabled={status === "loading"} className="w-full">
            {status === "loading" ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Testar Novamente
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}

