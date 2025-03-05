import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, FileText, Share2 } from "lucide-react"
import Link from "next/link"

interface RecentProductsProps {
  limit?: number
}

export function RecentProducts({ limit = 3 }: RecentProductsProps) {
  // Dados simulados - em uma implementação real, estes viriam de uma API
  const recentProducts = [
    {
      id: "1",
      titulo: "Dominando o Tráfego Pago: Estratégias Avançadas para Multiplicar seu ROI",
      descricao:
        "Aprenda a criar campanhas de tráfego pago altamente eficientes que convertem visitantes em clientes fiéis.",
      nicho: "marketing-digital",
      subnicho: "Tráfego Pago",
      dataCreated: "2025-03-01",
      temEbook: true,
    },
    {
      id: "2",
      titulo: "Guia Definitivo de SEO: Domine os Rankings do Google em 2025",
      descricao:
        "Descubra as técnicas mais atualizadas de SEO para posicionar seu site nas primeiras posições do Google.",
      nicho: "marketing-digital",
      subnicho: "SEO",
      dataCreated: "2025-03-03",
      temEbook: false,
    },
    {
      id: "3",
      titulo: "Transformação Financeira: O Caminho para a Liberdade Financeira em 12 Meses",
      descricao: "Um sistema passo a passo para organizar suas finanças, eliminar dívidas e construir patrimônio.",
      nicho: "financas",
      subnicho: "Investimentos",
      dataCreated: "2025-03-05",
      temEbook: true,
    },
  ].slice(0, limit)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Produtos Recentes</h2>
        <Link href="/produtos">
          <Button variant="link" size="sm" className="text-primary">
            Ver todos
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recentProducts.map((produto) => (
          <Card key={produto.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="mb-2">
                  {produto.subnicho}
                </Badge>
                {produto.temEbook && <Badge variant="secondary">E-book</Badge>}
              </div>
              <CardTitle className="line-clamp-2 text-lg">{produto.titulo}</CardTitle>
              <CardDescription>Criado em {new Date(produto.dataCreated).toLocaleDateString("pt-BR")}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-2">{produto.descricao}</p>
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              {produto.temEbook ? (
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Ver E-book
                </Button>
              ) : (
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

