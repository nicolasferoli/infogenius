"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Download, Printer, Share2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { PageHeader } from "@/components/page-header"

// Tipos
interface Capitulo {
  id: string
  titulo: string
  conteudo: string
  status: "pendente" | "gerando" | "concluido" | "erro"
}

interface Ebook {
  id: string
  produtoId: string
  titulo: string
  descricao: string
  capitulos: Capitulo[]
  status: "pendente" | "gerando" | "concluido" | "erro"
  progresso: number
  dataCriacao: string
}

export default function EbookVisualizacaoPage() {
  const params = useParams()
  const ebookId = params.id as string
  const [ebook, setEbook] = useState<Ebook | null>(null)
  const [capituloAtivo, setCapituloAtivo] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulação de carregamento de dados
    const fetchEbook = async () => {
      setIsLoading(true)
      try {
        // Em uma implementação real, isso seria uma chamada à API
        // Simulando um e-book
        const ebookSimulado: Ebook = {
          id: ebookId,
          produtoId: "1",
          titulo: "E-book: Dominando o Tráfego Pago",
          descricao: "Guia completo sobre estratégias de tráfego pago para maximizar seu ROI",
          capitulos: [
            {
              id: "intro",
              titulo: "Introdução",
              conteudo:
                "# Introdução ao Tráfego Pago\n\nBem-vindo ao guia definitivo sobre tráfego pago! Neste e-book, você aprenderá estratégias avançadas para maximizar seu ROI em campanhas de tráfego pago.\n\n## O que é tráfego pago?\n\nTráfego pago refere-se aos visitantes que chegam ao seu site através de anúncios pagos. Diferente do tráfego orgânico, que vem naturalmente através de buscas ou referências, o tráfego pago é resultado direto de investimentos em publicidade.\n\n## Por que investir em tráfego pago?\n\n- **Resultados imediatos**: Diferente do SEO, que pode levar meses para mostrar resultados, o tráfego pago pode trazer visitantes para seu site instantaneamente.\n- **Altamente direcionável**: Você pode segmentar seu público com precisão baseado em demografia, interesses, comportamento e muito mais.\n- **Escalável**: Uma vez que você encontra campanhas lucrativas, pode aumentar seu orçamento para escalar seus resultados.\n- **Mensurável**: Você pode rastrear precisamente quanto está gastando e quanto está ganhando com cada campanha.\n\nNos próximos capítulos, vamos explorar as principais plataformas de tráfego pago, estratégias avançadas de segmentação, otimização de campanhas e muito mais. Prepare-se para transformar sua abordagem de marketing digital!",
              status: "concluido",
            },
            {
              id: "cap1",
              titulo: "Fundamentos do Tráfego Pago",
              conteudo:
                "# Fundamentos do Tráfego Pago\n\nAntes de mergulharmos nas estratégias avançadas, é essencial compreender os fundamentos do tráfego pago. Este capítulo abordará os conceitos básicos que formam a base de qualquer campanha bem-sucedida.\n\n## Principais Plataformas de Tráfego Pago\n\n### Google Ads\nO Google Ads é uma das plataformas mais populares e eficazes para tráfego pago. Ela permite que você exiba anúncios nos resultados de pesquisa do Google, em sites parceiros, no YouTube e em aplicativos móveis.\n\n### Facebook Ads\nO Facebook Ads oferece um alcance massivo e opções de segmentação incrivelmente detalhadas. Você pode exibir anúncios no Facebook, Instagram, Messenger e na Audience Network.\n\n### LinkedIn Ads\nIdeal para B2B, o LinkedIn Ads permite segmentar profissionais com base em cargo, setor, tamanho da empresa e muito mais.\n\n### TikTok Ads\nUma plataforma em rápido crescimento, especialmente eficaz para alcançar públicos mais jovens com conteúdo criativo e envolvente.\n\n## Métricas Essenciais\n\n- **CTR (Click-Through Rate)**: Percentual de pessoas que clicam no seu anúncio após vê-lo.\n- **CPC (Custo Por Clique)**: Quanto você paga, em média, por cada clique no seu anúncio.\n- **CPM (Custo Por Mil Impressões)**: Quanto você paga por mil visualizações do seu anúncio.\n- **Taxa de Conversão**: Percentual de visitantes que realizam a ação desejada (compra, cadastro, etc.).\n- **ROAS (Return On Ad Spend)**: Retorno sobre o investimento em publicidade.\n- **CPA (Custo Por Aquisição)**: Quanto você gasta, em média, para adquirir um cliente.\n\n## Estrutura de Campanha\n\nUma estrutura de campanha bem organizada é fundamental para o sucesso. Geralmente, segue-se a hierarquia:\n\n1. **Conta**: Seu perfil principal na plataforma.\n2. **Campanhas**: Organizadas por objetivos específicos.\n3. **Grupos de Anúncios**: Conjuntos de anúncios com segmentação similar.\n4. **Anúncios**: As peças criativas que os usuários realmente veem.\n\nNo próximo capítulo, exploraremos estratégias avançadas de segmentação para garantir que seus anúncios alcancem exatamente o público certo.",
              status: "concluido",
            },
            {
              id: "cap2",
              titulo: "Estratégias para Facebook Ads",
              conteudo:
                "# Estratégias Avançadas para Facebook Ads\n\nO Facebook continua sendo uma das plataformas mais poderosas para publicidade digital. Com bilhões de usuários ativos e um sistema de segmentação sofisticado, oferece oportunidades únicas para anunciantes. Neste capítulo, exploraremos estratégias avançadas para maximizar seus resultados no Facebook Ads.\n\n## Segmentação Avançada\n\n### Públicos Semelhantes (Lookalike Audiences)\nUma das ferramentas mais poderosas do Facebook. Crie públicos semelhantes baseados em seus clientes atuais para encontrar pessoas com características similares.\n\n**Estratégia**: Comece com um público semelhante de 1% (mais preciso) e teste expandir para 2-5% à medida que encontra resultados positivos.\n\n### Segmentação por Engajamento\nDirecione anúncios para pessoas que já interagiram com sua página, vídeos ou eventos.\n\n**Estratégia**: Crie uma sequência de anúncios que primeiro gere engajamento e depois converta esses usuários engajados.\n\n### Exclusões Estratégicas\nExclua públicos que já converteram ou que não são relevantes para sua oferta.\n\n**Estratégia**: Exclua compradores recentes de campanhas de aquisição para evitar desperdício de orçamento.\n\n## Estrutura de Campanha Avançada\n\n### Método de Escalonamento Vertical\n1. Comece com orçamentos pequenos (R$10-20/dia)\n2. Aumente o orçamento em 20-30% a cada 3-4 dias para campanhas com ROAS positivo\n3. Evite alterações frequentes que possam reiniciar o algoritmo de aprendizado\n\n### Teste de Criativos Sistemático\n1. Teste diferentes formatos (imagem única, carrossel, vídeo)\n2. Varie os elementos criativos (título, texto, imagem, CTA)\n3. Mantenha os vencedores e substitua os perdedores a cada 7-10 dias\n\n## Otimização Avançada\n\n### Otimização para Valor de Conversão\nEm vez de otimizar apenas para conversões, configure suas campanhas para otimizar para o valor máximo de conversão.\n\n### Regras Automatizadas\nConfigure regras para ajustar automaticamente orçamentos, pausar anúncios de baixo desempenho ou receber alertas quando métricas importantes mudarem significativamente.\n\n### Teste de Objetivos de Campanha\nExperimente diferentes objetivos (conversões, tráfego, engajamento) mesmo que seu objetivo final seja o mesmo.\n\n## Estratégias de Remarketing Avançadas\n\n### Sequência de Remarketing\nCrie uma série de anúncios que são exibidos em sequência para visitantes do site:\n1. Dia 1-3: Anúncios educacionais\n2. Dia 4-7: Depoimentos e estudos de caso\n3. Dia 8-14: Ofertas com senso de urgência\n\n### Remarketing Dinâmico\nMostre aos usuários os produtos específicos que eles visualizaram em seu site.\n\n### Remarketing de Carrinho Abandonado\nCrie ofertas especiais para pessoas que adicionaram produtos ao carrinho mas não concluíram a compra.\n\nNo próximo capítulo, abordaremos estratégias específicas para o Google Ads, outra plataforma essencial em sua estratégia de tráfego pago.",
              status: "concluido",
            },
            {
              id: "cap3",
              titulo: "Estratégias para Google Ads",
              conteudo:
                "# Estratégias Avançadas para Google Ads\n\nO Google Ads continua sendo uma das plataformas mais eficazes para tráfego pago, oferecendo acesso ao maior mecanismo de busca do mundo e a uma vasta rede de sites parceiros. Neste capítulo, exploraremos estratégias avançadas para maximizar seu ROI no Google Ads.\n\n## Estratégias de Pesquisa Avançadas\n\n### Estrutura de Conta SKAG (Single Keyword Ad Groups)\nEstruture suas campanhas com grupos de anúncios contendo apenas uma palavra-chave em diferentes tipos de correspondência.\n\n**Benefícios**:\n- Maior relevância entre palavra-chave e anúncio\n- CTR mais alto\n- Melhor Quality Score\n- Menor CPC\n\n### Estratégia de Lances Avançada\n\n#### Lances por Dispositivo\nAjuste seus lances com base no desempenho em diferentes dispositivos (desktop, mobile, tablet).\n\n#### Lances por Localização\nAumente ou diminua lances em regiões específicas com base no desempenho histórico.\n\n#### Lances por Horário\nOtimize seus lances para os dias da semana e horários que geram melhores resultados.\n\n### Extensões de Anúncio Estratégicas\nUtilize todas as extensões relevantes para aumentar o espaço do seu anúncio e melhorar o CTR:\n- Extensões de site\n- Extensões de chamada\n- Extensões de texto destacado\n- Extensões de preço\n- Extensões de aplicativo\n- Extensões de local\n\n## Rede de Display Avançada\n\n### Segmentação Contextual Refinada\nEm vez de segmentar categorias amplas, crie segmentações contextuais personalizadas com palavras-chave e tópicos específicos.\n\n### Estratégias de Remarketing Avançadas\n\n#### RLSA (Remarketing Lists for Search Ads)\nCombine remarketing com campanhas de pesquisa para ajustar lances quando usuários que já visitaram seu site pesquisarem termos relevantes.\n\n#### Remarketing Dinâmico\nMostre anúncios personalizados com produtos específicos que os usuários visualizaram em seu site.\n\n### Campanhas de Display Responsivas\nUtilize anúncios responsivos de display, fornecendo múltiplos títulos, descrições e imagens para que o Google possa testar e otimizar automaticamente as combinações.\n\n## YouTube Ads Avançados\n\n### Segmentação por Intenção de Compra\nUtilize segmentação por intenção de compra para alcançar pessoas que estão pesquisando ativamente produtos ou serviços como os seus.\n\n### Remarketing de Vídeo\nReconecte-se com pessoas que assistiram seus vídeos ou visitaram seu canal.\n\n### Sequência de Anúncios\nCrie uma jornada para o espectador com uma série de vídeos que contam uma história progressiva.\n\n## Automação e Machine Learning\n\n### Campanhas Smart\nUtilize campanhas smart para permitir que o algoritmo do Google otimize seus anúncios automaticamente.\n\n### Scripts Personalizados\nImplemente scripts para automatizar tarefas repetitivas e ajustes baseados em regras específicas.\n\n### Estratégias de Lance Automatizadas\nExperimente estratégias como CPA alvo, ROAS alvo ou maximização de conversões para otimizar automaticamente seus lances.\n\n## Análise Avançada\n\n### Atribuição Baseada em Dados\nUtilize modelos de atribuição baseados em dados para entender melhor como diferentes pontos de contato contribuem para conversões.\n\n### Integração com Google Analytics\nConecte Google Ads e Analytics para obter insights mais profundos sobre o comportamento pós-clique.\n\n### Teste A/B Sistemático\nImplemente uma cultura de teste contínuo, testando sistematicamente diferentes elementos de suas campanhas.\n\nNo próximo capítulo, abordaremos estratégias de otimização de landing pages para maximizar suas taxas de conversão.",
              status: "concluido",
            },
            {
              id: "concl",
              titulo: "Conclusão",
              conteudo:
                "# Conclusão: Dominando o Tráfego Pago\n\nAo longo deste e-book, exploramos estratégias avançadas para maximizar seu ROI em campanhas de tráfego pago. Vamos recapitular os principais pontos e discutir como integrar essas estratégias em um plano de marketing digital coeso.\n\n## Recapitulação dos Pontos-Chave\n\n### Fundamentos Sólidos\nComeçamos estabelecendo a importância de compreender os fundamentos do tráfego pago, incluindo as principais plataformas, métricas essenciais e estruturas de campanha eficazes.\n\n### Estratégias Específicas por Plataforma\nExploramos estratégias avançadas para as principais plataformas:\n\n- **Facebook Ads**: Segmentação avançada, estrutura de campanha otimizada e estratégias de remarketing sofisticadas.\n- **Google Ads**: Estrutura SKAG, estratégias de lances avançadas, extensões de anúncio estratégicas e automação inteligente.\n\n### Otimização Contínua\nEnfatizamos a importância da otimização contínua através de:\n- Testes A/B sistemáticos\n- Análise de dados aprofundada\n- Ajustes baseados em desempenho\n- Automação e machine learning\n\n## Integrando Tráfego Pago em sua Estratégia Digital\n\n### Abordagem Omnichannel\nO tráfego pago não deve existir isoladamente. Para maximizar resultados, integre-o com:\n\n- **SEO**: Use insights de campanhas pagas para informar sua estratégia de SEO e vice-versa.\n- **Email Marketing**: Alimente sua lista de email com leads gerados por tráfego pago e use email para nutrir esses leads.\n- **Conteúdo**: Crie conteúdo que suporte suas campanhas pagas e use tráfego pago para amplificar seu melhor conteúdo.\n- **Mídias Sociais Orgânicas**: Construa presença orgânica que complemente e reforce suas mensagens pagas.\n\n### Ciclo de Vida do Cliente\nUtilize tráfego pago estrategicamente em cada estágio do funil:\n\n1. **Conscientização**: Campanhas de alcance amplo para introduzir sua marca.\n2. **Consideração**: Remarketing e conteúdo educacional para nutrir interesse.\n3. **Conversão**: Ofertas direcionadas para incentivar a ação.\n4. **Retenção**: Campanhas para clientes existentes para aumentar o valor do cliente.\n5. **Advocacia**: Incentivos para compartilhamento e indicações.\n\n## Tendências Futuras no Tráfego Pago\n\n### Privacidade e Rastreamento\nCom mudanças nas políticas de privacidade e rastreamento (como o fim dos cookies de terceiros), prepare-se para:\n- Maior ênfase em dados first-party\n- Soluções de rastreamento alternativas\n- Estratégias de segmentação contextual\n\n### Automação e IA\nA inteligência artificial continuará transformando o tráfego pago com:\n- Otimização automatizada de campanhas\n- Criação de anúncios assistida por IA\n- Previsão de comportamento do consumidor\n\n### Novos Formatos e Plataformas\nFique atento a:\n- Realidade aumentada e virtual em anúncios\n- Novas plataformas emergentes\n- Formatos de anúncio inovadores\n\n## Palavras Finais\n\nDominar o tráfego pago é uma jornada contínua, não um destino. As plataformas evoluem, os comportamentos dos consumidores mudam e novas tecnologias emergem constantemente. O segredo para o sucesso a longo prazo é:\n\n1. **Aprendizado Contínuo**: Mantenha-se atualizado com as últimas tendências e melhores práticas.\n2. **Experimentação**: Teste constantemente novas abordagens e estratégias.\n3. **Análise de Dados**: Baseie suas decisões em dados, não em suposições.\n4. **Adaptabilidade**: Esteja pronto para pivotar sua estratégia quando necessário.\n\nLembre-se: o tráfego pago é uma ferramenta poderosa, mas é apenas uma parte de uma estratégia de marketing digital bem-sucedida. Use-o sabiamente, integre-o com outros canais e mantenha o foco em proporcionar valor real para seu público-alvo.\n\nObrigado por acompanhar este guia. Desejamos a você muito sucesso em suas campanhas de tráfego pago!",
              status: "concluido",
            },
          ],
          status: "concluido",
          progresso: 100,
          dataCriacao: "2025-03-02",
        }

        setEbook(ebookSimulado)

        // Definir o primeiro capítulo como ativo por padrão
        if (ebookSimulado.capitulos.length > 0) {
          setCapituloAtivo(ebookSimulado.capitulos[0].id)
        }
      } catch (error) {
        console.error("Erro ao carregar e-book:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEbook()
  }, [ebookId])

  // Função para renderizar o conteúdo do capítulo com formatação Markdown simples
  const renderConteudo = (conteudo: string) => {
    // Implementação básica de renderização Markdown
    // Em uma aplicação real, você usaria uma biblioteca como react-markdown

    // Converter títulos
    let html = conteudo
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-6 mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-5 mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')

      // Converter listas
      .replace(/^\* (.*$)/gm, '<li class="ml-6 list-disc">$1</li>')
      .replace(/^- (.*$)/gm, '<li class="ml-6 list-disc">$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-6 list-decimal">$1. $2</li>')

      // Converter parágrafos
      .replace(/^(?!<h|<li|<ul|<ol|<p)(.*$)/gm, '<p class="my-3">$1</p>')

      // Converter negrito e itálico
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")

      // Converter quebras de linha
      .replace(/\n\n/g, "<br /><br />")

    // Agrupar itens de lista
    html = html
      .replace(
        /<li class="ml-6 list-disc">(.*?)<\/li>\n<li class="ml-6 list-disc">/g,
        '<li class="ml-6 list-disc">$1</li><li class="ml-6 list-disc">',
      )
      .replace(
        /<li class="ml-6 list-decimal">(.*?)<\/li>\n<li class="ml-6 list-decimal">/g,
        '<li class="ml-6 list-decimal">$1</li><li class="ml-6 list-decimal">',
      )

    // Envolver listas em ul/ol
    html = html
      .replace(/(<li class="ml-6 list-disc">.*?<\/li>)/gs, '<ul class="my-4">$1</ul>')
      .replace(/(<li class="ml-6 list-decimal">.*?<\/li>)/gs, '<ol class="my-4">$1</ol>')

    return { __html: html }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>Carregando e-book...</p>
      </div>
    )
  }

  if (!ebook) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">E-book não encontrado</h1>
        <p className="mb-6">O e-book solicitado não foi encontrado ou não está disponível.</p>
        <Link href="/ebook">
          <Button>Voltar para E-books</Button>
        </Link>
      </div>
    )
  }

  const capituloAtual = ebook.capitulos.find((c) => c.id === capituloAtivo)

  return (
    <main className="container mx-auto py-6 px-4">
      <PageHeader
        title={ebook.titulo}
        description={ebook.descricao}
        breadcrumbs={[{ title: "E-books", href: "/ebook" }, { title: ebook.titulo }]}
      />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar com capítulos */}
        <div className="w-full md:w-64 shrink-0">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Capítulos</h3>
              <div className="space-y-1">
                {ebook.capitulos.map((capitulo) => (
                  <Button
                    key={capitulo.id}
                    variant={capituloAtivo === capitulo.id ? "default" : "ghost"}
                    className="w-full justify-start text-sm h-auto py-2"
                    onClick={() => setCapituloAtivo(capitulo.id)}
                  >
                    {capitulo.titulo}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 space-y-2">
            <Button variant="outline" className="w-full" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
            <Button variant="outline" className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>

        {/* Conteúdo do capítulo */}
        <div className="flex-1">
          <Card>
            <CardContent className="p-6">
              {capituloAtual ? (
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={renderConteudo(capituloAtual.conteudo)} />
                </div>
              ) : (
                <p className="text-center py-10 text-muted-foreground">
                  Selecione um capítulo para visualizar seu conteúdo
                </p>
              )}
            </CardContent>
          </Card>

          {/* Navegação entre capítulos */}
          {capituloAtual && (
            <div className="flex justify-between mt-4">
              {ebook.capitulos.findIndex((c) => c.id === capituloAtivo) > 0 ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    const currentIndex = ebook.capitulos.findIndex((c) => c.id === capituloAtivo)
                    if (currentIndex > 0) {
                      setCapituloAtivo(ebook.capitulos[currentIndex - 1].id)
                    }
                  }}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Capítulo Anterior
                </Button>
              ) : (
                <div></div>
              )}

              {ebook.capitulos.findIndex((c) => c.id === capituloAtivo) < ebook.capitulos.length - 1 ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    const currentIndex = ebook.capitulos.findIndex((c) => c.id === capituloAtivo)
                    if (currentIndex < ebook.capitulos.length - 1) {
                      setCapituloAtivo(ebook.capitulos[currentIndex + 1].id)
                    }
                  }}
                >
                  Próximo Capítulo
                  <ChevronLeft className="h-4 w-4 ml-1 rotate-180" />
                </Button>
              ) : (
                <div></div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

