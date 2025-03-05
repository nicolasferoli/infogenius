"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, ChevronRight, Check } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentProducts } from "@/components/recent-products"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

// Interfaces
interface Subnicho {
  titulo: string
  descricao: string
  buscasMensais: number
  probabilidadeVenda: string
}

interface DetalhesProduto {
  nome: string
  descricao: string
  publicoAlvo: string
  caracteristicasBeneficios: string[]
}

const getFallbackSubnichos = (nicho: string) => {
  // Provide fallback subnichos based on the selected nicho
  const fallbacks: Record<string, any[]> = {
    "marketing-digital": [
      {
        titulo: "Marketing de Conteúdo",
        descricao: "Estratégias para criar e distribuir conteúdo relevante para atrair clientes.",
        buscasMensais: 22000,
        probabilidadeVenda: "Alta",
      },
      {
        titulo: "Tráfego Pago",
        descricao: "Técnicas para gerar visitantes qualificados através de anúncios pagos.",
        buscasMensais: 18000,
        probabilidadeVenda: "Alta",
      },
      {
        titulo: "SEO",
        descricao: "Otimização para mecanismos de busca para aumentar visibilidade orgânica.",
        buscasMensais: 27000,
        probabilidadeVenda: "Média",
      },
    ],
    "saude-bem-estar": [
      {
        titulo: "Emagrecimento Saudável",
        descricao: "Métodos para perda de peso de forma saudável e sustentável.",
        buscasMensais: 33000,
        probabilidadeVenda: "Alta",
      },
      {
        titulo: "Yoga e Meditação",
        descricao: "Práticas para equilíbrio mental e físico através de exercícios específicos.",
        buscasMensais: 15000,
        probabilidadeVenda: "Média",
      },
    ],
    financas: [
      {
        titulo: "Investimentos para Iniciantes",
        descricao: "Guia para começar a investir com segurança e conhecimento.",
        buscasMensais: 29000,
        probabilidadeVenda: "Alta",
      },
      {
        titulo: "Independência Financeira",
        descricao: "Estratégias para alcançar liberdade financeira e viver de renda passiva.",
        buscasMensais: 19000,
        probabilidadeVenda: "Alta",
      },
    ],
  }

  return (
    fallbacks[nicho] || [
      {
        titulo: "Subnicho Popular",
        descricao: "Um dos subnichos mais procurados nesta área.",
        buscasMensais: 15000,
        probabilidadeVenda: "Alta",
      },
      {
        titulo: "Nicho Emergente",
        descricao: "Área em crescimento com grande potencial de mercado.",
        buscasMensais: 8000,
        probabilidadeVenda: "Média",
      },
    ]
  )
}

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()
  const [nicho, setNicho] = useState("")
  const [subnicho, setSubnicho] = useState("")
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSubnichos, setIsLoadingSubnichos] = useState(false)
  const [isLoadingDetalhes, setIsLoadingDetalhes] = useState(false)
  const [subnichos, setSubnichos] = useState<Subnicho[]>([])
  const [subnichoSelecionado, setSubnichoSelecionado] = useState<Subnicho | null>(null)
  const [detalhesProduto, setDetalhesProduto] = useState<DetalhesProduto | null>(null)
  const [activeTab, setActiveTab] = useState("nicho")
  const [produto, setProduto] = useState({
    titulo: "",
    descricao: "",
    nicho: "",
    subnicho: "",
    temEbook: false,
    publicoAlvo: "",
    caracteristicasBeneficios: [] as string[],
  })
  const [showGenerator, setShowGenerator] = useState(true)

  const handleGerarSubnichos = async () => {
    if (!nicho) return

    setIsLoadingSubnichos(true)
    setSubnichos([])
    setSubnichoSelecionado(null)
    setDetalhesProduto(null)

    try {
      const response = await fetch("/api/gerar-subnichos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nicho }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Falha ao gerar subnichos")
      }

      // Ensure we have an array of subnichos
      let subnichoArray = data.subnichos && Array.isArray(data.subnichos) ? data.subnichos : []

      if (subnichoArray.length === 0) {
        // Use fallback data if API returns empty array
        subnichoArray = getFallbackSubnichos(nicho)
        toast({
          title: "Usando dados locais",
          description: "Não foi possível obter dados em tempo real. Usando dados pré-definidos.",
          variant: "default",
        })
      }

      setSubnichos(subnichoArray)
      setActiveTab("subnicho")
    } catch (error) {
      console.error("Erro:", error)
      // Use fallback data if API fails
      const fallbackData = getFallbackSubnichos(nicho)
      setSubnichos(fallbackData)
      setActiveTab("subnicho")

      toast({
        title: "Usando dados locais",
        description: "Ocorreu um erro ao gerar subnichos. Usando dados pré-definidos.",
        variant: "default",
      })
    } finally {
      setIsLoadingSubnichos(false)
    }
  }

  const handleSelecionarSubnicho = (subnicho: Subnicho) => {
    setSubnichoSelecionado(subnicho)
    setSubnicho(subnicho.titulo)
    setProduto((prev) => ({ ...prev, nicho, subnicho: subnicho.titulo }))
  }

  const handleGerarDetalhesProduto = async () => {
    if (!nicho || !subnichoSelecionado) return

    setIsLoadingDetalhes(true)
    setDetalhesProduto(null)

    try {
      const response = await fetch("/api/gerar-detalhes-produto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nicho, subnicho: subnichoSelecionado.titulo }),
      })

      if (!response.ok) throw new Error("Falha ao gerar detalhes do produto")

      const data = await response.json()
      setDetalhesProduto(data.detalhes)
      setTitulo(data.detalhes.nome)
      setDescricao(data.detalhes.descricao)

      setProduto((prev) => ({
        ...prev,
        titulo: data.detalhes.nome,
        descricao: data.detalhes.descricao,
        publicoAlvo: data.detalhes.publicoAlvo,
        caracteristicasBeneficios: data.detalhes.caracteristicasBeneficios,
      }))

      setActiveTab("produto")
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro",
        description: "Não foi possível gerar os detalhes do produto. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingDetalhes(false)
    }
  }

  const handleSalvarProduto = async () => {
    if (!produto.titulo || !produto.descricao || !produto.nicho || !produto.subnicho) {
      toast({
        title: "Campos incompletos",
        description: "Preencha todos os campos antes de salvar o produto.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produto),
      })

      if (!response.ok) {
        throw new Error("Falha ao salvar produto")
      }

      toast({
        title: "Produto salvo",
        description: "Seu produto foi salvo com sucesso!",
      })

      // Redirect to products page
      setTimeout(() => {
        router.push("/produtos")
      }, 1500)
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar o produto. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <PageHeader
        title="Gerador de Infoprodutos com IA"
        description={`Olá, ${user?.name}. Crie produtos digitais completos com a ajuda da inteligência artificial`}
      />

      {!showGenerator ? (
        <>
          <DashboardStats />
          <div className="mt-8">
            <RecentProducts />
          </div>
          <div className="mt-8 text-center">
            <Button size="lg" onClick={() => setShowGenerator(true)} className="px-8">
              Criar Novo Produto
            </Button>
          </div>
        </>
      ) : null}

      <div className={cn("mt-8", !showGenerator && "hidden")}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="nicho">1. Escolha do Nicho</TabsTrigger>
            <TabsTrigger value="subnicho" disabled={!nicho}>
              2. Escolha do Subnicho
            </TabsTrigger>
            <TabsTrigger value="produto" disabled={!subnichoSelecionado}>
              3. Detalhes do Produto
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nicho">
            <Card className="border-2">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Escolha do Nicho</CardTitle>
                <CardDescription className="text-base">Selecione o nicho para seu infoproduto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="nicho" className="text-base font-medium">
                    Nicho
                  </Label>
                  <div className="grid gap-3">
                    {[
                      { value: "marketing-digital", label: "Marketing Digital", icon: "💻" },
                      { value: "saude-bem-estar", label: "Saúde e Bem-estar", icon: "🌿" },
                      { value: "financas", label: "Finanças Pessoais", icon: "💰" },
                      { value: "desenvolvimento-pessoal", label: "Desenvolvimento Pessoal", icon: "🎯" },
                      { value: "ecommerce", label: "E-commerce", icon: "🛍️" },
                    ].map((item) => (
                      <Button
                        key={item.value}
                        variant={nicho === item.value ? "default" : "outline"}
                        className={`h-auto p-4 justify-start text-left ${
                          nicho === item.value ? "border-2 border-primary" : ""
                        }`}
                        onClick={() => setNicho(item.value)}
                      >
                        <span className="mr-2 text-xl">{item.icon}</span>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{item.label}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handleGerarSubnichos}
                  disabled={!nicho || isLoadingSubnichos}
                  size="lg"
                >
                  {isLoadingSubnichos ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Gerando Subnichos...
                    </>
                  ) : (
                    <>
                      Próximo Passo
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="subnicho">
            <Card>
              <CardHeader>
                <CardTitle>Escolha do Subnicho</CardTitle>
                <CardDescription>Subnichos com alta procura e rentabilidade para o nicho de {nicho}</CardDescription>
              </CardHeader>
              <CardContent>
                {subnichos.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum subnicho gerado. Volte e selecione um nicho.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subnichos.map((item, index) => (
                      <Card
                        key={index}
                        className={`cursor-pointer transition-all ${
                          subnichoSelecionado?.titulo === item.titulo
                            ? "border-primary ring-2 ring-primary ring-opacity-50"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => handleSelecionarSubnicho(item)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{item.titulo}</CardTitle>
                            {subnichoSelecionado?.titulo === item.titulo && (
                              <Badge variant="default">
                                <Check className="h-3 w-3 mr-1" /> Selecionado
                              </Badge>
                            )}
                          </div>
                          <CardDescription>{item.descricao}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Buscas/Mês:</p>
                              <p className="font-medium">{item.buscasMensais.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Probabilidade de Venda:</p>
                              <p
                                className={`font-medium ${
                                  item.probabilidadeVenda === "Alta"
                                    ? "text-green-600"
                                    : item.probabilidadeVenda === "Média"
                                      ? "text-amber-600"
                                      : "text-red-600"
                                }`}
                              >
                                {item.probabilidadeVenda}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("nicho")}>
                  Voltar
                </Button>
                <Button onClick={handleGerarDetalhesProduto} disabled={!subnichoSelecionado || isLoadingDetalhes}>
                  {isLoadingDetalhes ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Gerando Detalhes...
                    </>
                  ) : (
                    <>
                      Próximo Passo
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="produto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Produto</CardTitle>
                  <CardDescription>
                    Infoproduto gerado para o nicho de {nicho}, subnicho de {subnichoSelecionado?.titulo}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!detalhesProduto ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhum detalhe gerado. Volte e selecione um subnicho.</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="titulo">Nome do Produto</Label>
                        <Input
                          id="titulo"
                          value={titulo}
                          onChange={(e) => {
                            setTitulo(e.target.value)
                            setProduto((prev) => ({ ...prev, titulo: e.target.value }))
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="descricao">Descrição</Label>
                        <Textarea
                          id="descricao"
                          value={descricao}
                          onChange={(e) => {
                            setDescricao(e.target.value)
                            setProduto((prev) => ({ ...prev, descricao: e.target.value }))
                          }}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="publicoAlvo">Público-Alvo</Label>
                        <Textarea
                          id="publicoAlvo"
                          value={produto.publicoAlvo}
                          onChange={(e) => setProduto((prev) => ({ ...prev, publicoAlvo: e.target.value }))}
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Características e Benefícios</Label>
                        <div className="space-y-2 border rounded-md p-3">
                          {produto.caracteristicasBeneficios.map((item, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="mt-1 h-4 w-4 shrink-0 rounded-sm border border-primary bg-primary text-xs flex items-center justify-center text-primary-foreground">
                                <Check className="h-3 w-3" />
                              </div>
                              <Input
                                value={item}
                                onChange={(e) => {
                                  const newBeneficios = [...produto.caracteristicasBeneficios]
                                  newBeneficios[index] = e.target.value
                                  setProduto((prev) => ({ ...prev, caracteristicasBeneficios: newBeneficios }))
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-4">
                        <Checkbox
                          id="temEbook"
                          checked={produto.temEbook}
                          onCheckedChange={(checked) => setProduto((prev) => ({ ...prev, temEbook: checked === true }))}
                        />
                        <label
                          htmlFor="temEbook"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Gerar E-book para este produto
                        </label>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("subnicho")}>
                    Voltar
                  </Button>
                  <Button onClick={handleSalvarProduto} disabled={!detalhesProduto || isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar Produto"
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prévia do Produto</CardTitle>
                  <CardDescription>Visualize como seu produto ficará</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!detalhesProduto ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhum detalhe gerado ainda.</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{titulo}</h3>
                        <p className="text-muted-foreground">{descricao}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Nicho / Subnicho</h4>
                        <div className="flex gap-2">
                          <Badge variant="outline">{nicho}</Badge>
                          <Badge variant="secondary">{subnichoSelecionado?.titulo}</Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Público-Alvo</h4>
                        <p>{produto.publicoAlvo}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold uppercase text-muted-foreground mb-2">
                          Características e Benefícios
                        </h4>
                        <ul className="space-y-1">
                          {produto.caracteristicasBeneficios.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="mt-1 h-4 w-4 shrink-0 rounded-sm border border-primary bg-primary text-xs flex items-center justify-center text-primary-foreground">
                                <Check className="h-3 w-3" />
                              </div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {produto.temEbook && (
                        <div className="mt-4 p-3 bg-muted rounded-md">
                          <div className="flex items-center gap-2">
                            <Badge>E-book</Badge>
                            <p className="text-sm">Este produto incluirá um e-book completo</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

