"use client"

import { CardFooter } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"

interface DiagnosticoResponse {
  success: boolean
  message: string
  error?: string
  errorType?: string
  apiKey: string
  response?: string
  model?: string
}

export default function DiagnosticoPage() {
  const [diagnostico, setDiagnostico] = useState<DiagnosticoResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Usar useCallback para evitar recriação da função em cada renderização
  const testarConexao = useCallback(async () => {
    setIsLoading(true)
    setDiagnostico(null)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 segundos de timeout

      const response = await fetch("/api/test-openai", {
        signal: controller.signal,
        // Adicionar cabeçalhos para evitar cache
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }).finally(() => clearTimeout(timeoutId))

      let data: DiagnosticoResponse

      try {
        // Tentar analisar a resposta como JSON
        data = await response.json()
      } catch (parseError) {
        // Se falhar ao analisar JSON, criar um objeto de erro
        console.error("Erro ao analisar resposta JSON:", parseError)
        throw new Error(`Erro ao processar resposta do servidor: ${response.status} ${response.statusText}`)
      }

      // Verificar se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error(data.error || `Erro na resposta da API: ${response.status} ${response.statusText}`)
      }

      setDiagnostico(data)

      if (data.success) {
        toast({
          title: "Conexão bem-sucedida",
          description: "A conexão com a API da OpenAI está funcionando corretamente.",
          variant: "default",
        })
      } else {
        toast({
          title: "Falha na conexão",
          description: data.message || "Erro desconhecido ao conectar com a API da OpenAI",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao testar conexão:", error)

      // Criar um objeto de diagnóstico para erros de rede/fetch
      setDiagnostico({
        success: false,
        message: "Falha ao conectar com o servidor de teste",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        errorType: "connection",
        apiKey: "Não foi possível verificar",
        model: "gpt-4o-mini",
      })

      toast({
        title: "Erro",
        description:
          error instanceof Error
            ? `Erro ao testar a conexão: ${error.message}`
            : "Ocorreu um erro ao testar a conexão com a API da OpenAI.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Usar um setTimeout para evitar problemas de renderização
    const timer = setTimeout(() => {
      testarConexao()
    }, 500)

    return () => clearTimeout(timer)
  }, [testarConexao])

  return (
    <main className="container mx-auto py-10 px-4">
      <PageHeader
        title="Diagnóstico de Conexão"
        description="Verifique o status da conexão com a API da OpenAI"
        breadcrumbs={[{ title: "Diagnóstico" }]}
      />

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Status da API da OpenAI</CardTitle>
          <CardDescription>
            Verifique se a conexão com a API da OpenAI (GPT-4o Mini) está funcionando corretamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
              <p>Testando conexão com a API da OpenAI...</p>
            </div>
          ) : diagnostico ? (
            <>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {diagnostico.success ? (
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    {diagnostico.success ? "Conexão estabelecida" : "Falha na conexão"}
                  </h3>
                  <p className="text-muted-foreground">{diagnostico.message}</p>
                </div>
              </div>

              <div className="grid gap-4 border rounded-lg p-4">
                <div>
                  <p className="text-sm font-medium mb-1">Chave da API:</p>
                  <Badge variant={diagnostico.apiKey.includes("Não") ? "destructive" : "outline"}>
                    {diagnostico.apiKey}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Modelo:</p>
                  <Badge variant="secondary">{diagnostico.model || "gpt-4o-mini"}</Badge>
                </div>

                {diagnostico.response && (
                  <div>
                    <p className="text-sm font-medium mb-1">Resposta do teste:</p>
                    <p className="text-sm bg-muted p-2 rounded">{diagnostico.response}</p>
                  </div>
                )}

                {diagnostico.error && (
                  <div>
                    <p className="text-sm font-medium mb-1">Detalhes do erro:</p>
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{diagnostico.error}</p>
                      </div>

                      {diagnostico.errorType && (
                        <div className="mt-2 pt-2 border-t border-red-200">
                          <p className="text-sm text-red-700">
                            <strong>Tipo de erro:</strong>{" "}
                            {diagnostico.errorType === "api_key" && "Problema com a chave da API"}
                            {diagnostico.errorType === "connection" && "Problema de conexão"}
                            {diagnostico.errorType === "rate_limit" && "Limite de requisições excedido"}
                            {diagnostico.errorType === "model_error" && "Problema com o modelo GPT-4o Mini"}
                            {diagnostico.errorType === "unknown" && "Erro desconhecido"}
                          </p>

                          <div className="mt-2 text-sm text-red-700">
                            <strong>Solução sugerida:</strong>
                            <ul className="list-disc ml-5 mt-1">
                              {diagnostico.errorType === "api_key" && (
                                <>
                                  <li>Verifique se a chave da API está correta</li>
                                  <li>Confirme se a chave não expirou ou foi revogada</li>
                                  <li>
                                    Verifique se a variável de ambiente OPENAI_API_KEY está configurada corretamente
                                  </li>
                                </>
                              )}
                              {diagnostico.errorType === "connection" && (
                                <>
                                  <li>Verifique sua conexão com a internet</li>
                                  <li>Confirme se não há bloqueios de firewall</li>
                                  <li>Verifique se o serviço da OpenAI está operacional</li>
                                </>
                              )}
                              {diagnostico.errorType === "rate_limit" && (
                                <>
                                  <li>Aguarde alguns minutos e tente novamente</li>
                                  <li>Considere reduzir a frequência de requisições</li>
                                  <li>Verifique os limites da sua conta na OpenAI</li>
                                </>
                              )}
                              {diagnostico.errorType === "model_error" && (
                                <>
                                  <li>Verifique se o modelo GPT-4o Mini está disponível na sua conta</li>
                                  <li>Confirme se sua conta tem acesso ao GPT-4o Mini</li>
                                  <li>Considere atualizar sua conta para ter acesso a este modelo</li>
                                </>
                              )}
                              {diagnostico.errorType === "unknown" && (
                                <>
                                  <li>Verifique os logs do servidor para mais detalhes</li>
                                  <li>Tente reiniciar o servidor</li>
                                  <li>Verifique se houve mudanças recentes na API da OpenAI</li>
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Nenhum diagnóstico disponível</p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={testarConexao} disabled={isLoading} className="w-full">
            {isLoading ? (
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

      <div className="mt-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Solução de Problemas Comuns</h2>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Chave da API não configurada</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Se a chave da API não estiver configurada, você precisa adicionar a variável de ambiente OPENAI_API_KEY.
            </p>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              <p>OPENAI_API_KEY=sk-sua-chave-aqui</p>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Problemas com o modelo GPT-4o Mini</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Certifique-se de que o modelo GPT-4o Mini está disponível na sua conta da OpenAI. Este é um modelo mais
              recente e pode exigir acesso especial ou uma conta paga.
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Limites de requisição</h3>
            <p className="text-sm text-muted-foreground">
              Contas gratuitas ou novas da OpenAI têm limites de requisições. Se você estiver recebendo erros de limite,
              considere esperar alguns minutos antes de tentar novamente ou atualizar para um plano pago com acesso ao
              GPT-4o Mini.
            </p>
          </div>
        </div>
      </div>

      <Toaster />
    </main>
  )
}

