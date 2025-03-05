"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function MigrateDataPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<{
    products: { success: number; failed: number }
    ebooks: { success: number; failed: number }
  } | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Verificar usuário atual
  useEffect(() => {
    const checkCurrentUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setCurrentUser(data.session.user)
      } else {
        setCurrentUser(null)
        setError("Você precisa estar autenticado para migrar dados.")
      }
    }

    checkCurrentUser()
  }, [])

  const migrateData = async () => {
    if (!currentUser) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para migrar dados.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const userId = currentUser.id

      // Resultados da migração
      const migrationResults = {
        products: { success: 0, failed: 0 },
        ebooks: { success: 0, failed: 0 },
      }

      // 1. Migrar produtos
      const localProdutos = JSON.parse(localStorage.getItem("infogenius_produtos") || "[]")

      for (const produto of localProdutos) {
        if (produto.userId === userId || !produto.userId) {
          // Se não tiver userId, assume que é do usuário atual
          try {
            // Converter para o formato do Supabase
            const productData = {
              user_id: userId,
              title: produto.titulo,
              description: produto.descricao,
              niche: produto.nicho,
              subniche: produto.subnicho,
              has_ebook: produto.temEbook,
              target_audience: produto.publicoAlvo,
              features_benefits: produto.caracteristicasBeneficios,
              created_at: produto.dataCreated || new Date().toISOString(),
            }

            const { error } = await supabase.from("products").insert([productData])

            if (error) {
              console.error("Erro ao migrar produto:", error)
              migrationResults.products.failed++
            } else {
              migrationResults.products.success++
            }
          } catch (err) {
            console.error("Erro ao processar produto:", err)
            migrationResults.products.failed++
          }
        }
      }

      // 2. Migrar ebooks
      const localEbooks = JSON.parse(localStorage.getItem("infogenius_ebooks") || "[]")

      for (const ebook of localEbooks) {
        if (ebook.userId === userId || !ebook.userId) {
          // Se não tiver userId, assume que é do usuário atual
          try {
            // Converter para o formato do Supabase
            const ebookData = {
              user_id: userId,
              product_id: ebook.produtoId, // Nota: isso pode precisar ser mapeado para os novos IDs
              title: ebook.titulo,
              description: ebook.descricao,
              chapters: ebook.capitulos,
              status: ebook.status || "pending",
              progress: ebook.progresso || 0,
              created_at: ebook.dataCriacao || new Date().toISOString(),
            }

            const { error } = await supabase.from("ebooks").insert([ebookData])

            if (error) {
              console.error("Erro ao migrar ebook:", error)
              migrationResults.ebooks.failed++
            } else {
              migrationResults.ebooks.success++
            }
          } catch (err) {
            console.error("Erro ao processar ebook:", err)
            migrationResults.ebooks.failed++
          }
        }
      }

      setResults(migrationResults)

      toast({
        title: "Migração concluída",
        description: `Produtos: ${migrationResults.products.success} migrados, ${migrationResults.products.failed} falhas. Ebooks: ${migrationResults.ebooks.success} migrados, ${migrationResults.ebooks.failed} falhas.`,
      })
    } catch (error: any) {
      console.error("Erro na migração:", error)
      setError(error.message || "Ocorreu um erro durante a migração.")
      toast({
        title: "Erro na migração",
        description: error.message || "Ocorreu um erro durante a migração.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Migração de Dados</CardTitle>
          <CardDescription>Migre seus dados do localStorage para o banco de dados Supabase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!currentUser ? (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-md p-4">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <p className="text-amber-700">
                Você precisa estar autenticado para migrar dados. Por favor, faça login primeiro.
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p>Migrando dados do localStorage para o Supabase...</p>
            </div>
          ) : results ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div>
                  <h3 className="font-medium">Migração concluída</h3>
                  <p className="text-sm text-muted-foreground">Seus dados foram migrados para o Supabase.</p>
                </div>
              </div>

              <div className="grid gap-4 border rounded-lg p-4">
                <div>
                  <p className="text-sm font-medium mb-1">Produtos:</p>
                  <div className="flex gap-4">
                    <div className="text-green-600">
                      <span className="font-bold">{results.products.success}</span> migrados com sucesso
                    </div>
                    {results.products.failed > 0 && (
                      <div className="text-red-600">
                        <span className="font-bold">{results.products.failed}</span> falhas
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">E-books:</p>
                  <div className="flex gap-4">
                    <div className="text-green-600">
                      <span className="font-bold">{results.ebooks.success}</span> migrados com sucesso
                    </div>
                    {results.ebooks.failed > 0 && (
                      <div className="text-red-600">
                        <span className="font-bold">{results.ebooks.failed}</span> falhas
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {(results.products.failed > 0 || results.ebooks.failed > 0) && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <p className="text-amber-700 text-sm">
                    Alguns itens não puderam ser migrados. Isso pode acontecer se os dados estiverem em um formato
                    incompatível ou se já existirem no banco de dados.
                  </p>
                </div>
              )}
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-md p-4">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          ) : (
            <div>
              <p className="mb-4">
                Esta ferramenta irá migrar seus dados armazenados localmente (localStorage) para o banco de dados
                Supabase. Isso inclui:
              </p>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Produtos</li>
                <li>E-books</li>
              </ul>
              <p className="text-amber-600">
                <strong>Importante:</strong> Certifique-se de estar logado com a mesma conta que você usou para criar os
                dados locais.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {currentUser && !results && (
            <Button onClick={migrateData} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrando...
                </>
              ) : (
                "Iniciar Migração"
              )}
            </Button>
          )}

          {results && (
            <div className="w-full flex justify-between">
              <Button variant="outline" onClick={() => setResults(null)}>
                Nova Migração
              </Button>
              <Button onClick={() => (window.location.href = "/")}>Ir para a Página Inicial</Button>
            </div>
          )}
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}

