"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Edit, Trash2, FileText, Share2 } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"

// Tipo para os produtos
interface Produto {
  id: string
  titulo: string
  descricao: string
  nicho: string
  subnicho: string
  dataCreated: string
  temEbook: boolean
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("todos")

  // Simular carregamento de produtos do backend
  useEffect(() => {
    // Em uma implementação real, isso seria uma chamada à API
    const fetchProdutos = async () => {
      setIsLoading(true)
      try {
        // Simulando dados - em produção, isso viria da sua API
        const produtosSimulados: Produto[] = [
          {
            id: "1",
            titulo: "Dominando o Tráfego Pago: Estratégias Avançadas para Multiplicar seu ROI",
            descricao:
              "Aprenda a criar campanhas de tráfego pago altamente eficientes que convertem visitantes em clientes fiéis. Este guia completo revela as estratégias utilizadas pelos maiores especialistas do mercado.",
            nicho: "marketing-digital",
            subnicho: "Tráfego Pago",
            dataCreated: "2025-03-01",
            temEbook: true,
          },
          {
            id: "2",
            titulo: "Guia Definitivo de SEO: Domine os Rankings do Google em 2025",
            descricao:
              "Descubra as técnicas mais atualizadas de SEO para posicionar seu site nas primeiras posições do Google. Estratégias testadas e aprovadas por especialistas.",
            nicho: "marketing-digital",
            subnicho: "SEO",
            dataCreated: "2025-03-03",
            temEbook: false,
          },
          {
            id: "3",
            titulo: "Transformação Financeira: O Caminho para a Liberdade Financeira em 12 Meses",
            descricao:
              "Um sistema passo a passo para organizar suas finanças, eliminar dívidas e construir patrimônio de forma consistente e segura.",
            nicho: "financas",
            subnicho: "Investimentos",
            dataCreated: "2025-03-05",
            temEbook: true,
          },
        ]

        setProdutos(produtosSimulados)
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProdutos()
  }, [])

  // Filtrar produtos com base na aba ativa
  const produtosFiltrados = produtos.filter((produto) => {
    if (activeTab === "todos") return true
    if (activeTab === "ebooks") return produto.temEbook
    return produto.nicho === activeTab
  })

  // Função para excluir produto
  const handleExcluirProduto = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      // Em uma implementação real, isso seria uma chamada à API
      setProdutos(produtos.filter((produto) => produto.id !== id))
    }
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <PageHeader title="Seus Produtos" breadcrumbs={[{ title: "Produtos" }]}>
        <Link href="/">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </Link>
      </PageHeader>

      <Tabs defaultValue="todos" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="ebooks">E-books</TabsTrigger>
          <TabsTrigger value="marketing-digital">Marketing Digital</TabsTrigger>
          <TabsTrigger value="financas">Finanças</TabsTrigger>
          <TabsTrigger value="saude-bem-estar">Saúde</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="text-center py-10">Carregando produtos...</div>
          ) : produtosFiltrados.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">Nenhum produto encontrado nesta categoria.</p>
              <Link href="/">
                <Button>Criar Novo Produto</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {produtosFiltrados.map((produto) => (
                <Card key={produto.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="mb-2">
                        {produto.subnicho}
                      </Badge>
                      {produto.temEbook && <Badge variant="secondary">E-book</Badge>}
                    </div>
                    <CardTitle className="line-clamp-2">{produto.titulo}</CardTitle>
                    <CardDescription>
                      Criado em {new Date(produto.dataCreated).toLocaleDateString("pt-BR")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{produto.descricao}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between mt-auto">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleExcluirProduto(produto.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      {produto.temEbook && (
                        <Button variant="outline" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}

