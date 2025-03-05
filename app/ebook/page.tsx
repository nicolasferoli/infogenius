"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, BookOpen, AlertCircle, CheckCircle, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import { PageHeader } from "@/components/page-header"

interface Capitulo {
  id: string
  titulo: string
  conteudo?: string
  status?: "pendente" | "gerando" | "concluido" | "erro"
}

interface Ebook {
  id: string
  produtoId: string
  titulo: string
  descricao: string
  capitulos: Capitulo[]
  status?: "pendente" | "gerando" | "concluido" | "erro"
  progresso?: number
}

export default function EbookPage() {
  const router = useRouter()
  const [ebooks, setEbooks] = useState<Ebook[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função para buscar ebooks
  const fetchEbooks = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ebooks", {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar ebooks: ${response.status} ${response.statusText}`)
      }

      // Verificar se a resposta é JSON antes de tentar analisá-la
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("A resposta não é um JSON válido")
      }

      const data = await response.json()
      setEbooks(data)
    } catch (error) {
      console.error("Erro ao buscar ebooks:", error)
      setError(error instanceof Error ? error.message : "Erro desconhecido ao buscar ebooks")
      toast({
        title: "Erro",
        description: "Falha ao carregar os ebooks. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEbooks()
  }, [fetchEbooks])

  // Função para gerar um ebook
  const handleGerarEbook = async (ebook: Ebook) => {
    toast({
      title: "Iniciando geração",
      description: `Iniciando a geração do ebook "${ebook.titulo}"`,
    })

    // Aqui você implementaria a lógica real para gerar o ebook
    // Por enquanto, apenas simulamos uma atualização de estado
    setEbooks((prev) => prev.map((e) => (e.id === ebook.id ? { ...e, status: "gerando", progresso: 10 } : e)))

    // Simular progresso
    setTimeout(() => {
      setEbooks((prev) => prev.map((e) => (e.id === ebook.id ? { ...e, progresso: 50 } : e)))

      // Simular conclusão após mais tempo
      setTimeout(() => {
        setEbooks((prev) =>
          prev.map((e) =>
            e.id === ebook.id
              ? {
                  ...e,
                  status: "concluido",
                  progresso: 100,
                  capitulos: e.capitulos.map((c) => ({ ...c, status: "concluido" })),
                }
              : e,
          ),
        )

        toast({
          title: "Ebook gerado",
          description: `O ebook "${ebook.titulo}" foi gerado com sucesso!`,
        })
      }, 3000)
    }, 2000)
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <PageHeader title="Seus E-books" breadcrumbs={[{ title: "E-books" }]}>
        <Button onClick={fetchEbooks} variant="outline" disabled={isLoading}>
          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          <span className="ml-2">Atualizar</span>
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando e-books...</span>
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              Erro ao carregar e-books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={fetchEbooks} variant="outline">
              Tentar novamente
            </Button>
          </CardFooter>
        </Card>
      ) : ebooks.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum e-book encontrado</CardTitle>
            <CardDescription>
              Você ainda não tem nenhum e-book. Crie um produto com a opção de e-book para começar.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/">
              <Button>Criar novo produto</Button>
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ebooks.map((ebook) => (
            <Card key={ebook.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={ebook.status === "concluido" ? "default" : "outline"}>
                    {ebook.status === "pendente" && "Pendente"}
                    {ebook.status === "gerando" && "Gerando"}
                    {ebook.status === "concluido" && "Concluído"}
                    {ebook.status === "erro" && "Erro"}
                  </Badge>
                  {ebook.status === "concluido" && <CheckCircle className="h-5 w-5 text-green-500" />}
                </div>
                <CardTitle className="line-clamp-2">{ebook.titulo}</CardTitle>
                <CardDescription className="line-clamp-2">{ebook.descricao}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progresso</span>
                    <span>{ebook.progresso || 0}%</span>
                  </div>
                  <Progress value={ebook.progresso || 0} className="h-2" />
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Capítulos ({ebook.capitulos.length})</h4>
                  <ul className="space-y-1 text-sm">
                    {ebook.capitulos.slice(0, 3).map((capitulo) => (
                      <li key={capitulo.id} className="flex items-center justify-between">
                        <span className="truncate">{capitulo.titulo}</span>
                        <Badge variant="outline" className="ml-2 shrink-0">
                          {capitulo.status === "pendente" && "Pendente"}
                          {capitulo.status === "gerando" && "Gerando"}
                          {capitulo.status === "concluido" && "Concluído"}
                          {capitulo.status === "erro" && "Erro"}
                        </Badge>
                      </li>
                    ))}
                    {ebook.capitulos.length > 3 && (
                      <li className="text-muted-foreground text-xs">+ {ebook.capitulos.length - 3} mais capítulos</li>
                    )}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {ebook.status === "pendente" ? (
                  <Button onClick={() => handleGerarEbook(ebook)} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Gerar E-book
                  </Button>
                ) : ebook.status === "gerando" ? (
                  <Button disabled className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Gerando...
                  </Button>
                ) : (
                  <Link href={`/ebook/${ebook.id}`} className="w-full">
                    <Button className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Visualizar E-book
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Toaster />
    </main>
  )
}

