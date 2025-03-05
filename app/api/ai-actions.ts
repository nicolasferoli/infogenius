import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"

// Modelo padrão para todas as chamadas
const DEFAULT_MODEL = "gpt-4o-mini"

// Inicializa o cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

// Função para gerar conteúdo de produto usando GPT-4o Mini
export async function gerarConteudoProduto(prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente especializado em criar conteúdo para produtos digitais. Forneça respostas detalhadas e bem estruturadas.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    })

    // Cria uma stream para resposta em tempo real
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("Erro ao gerar conteúdo:", error)
    throw new Error("Falha ao gerar conteúdo do produto")
  }
}

// Função para gerar título de produto
export async function gerarTituloProduto(nicho: string, subnicho: string) {
  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Você é um especialista em marketing digital. Crie títulos persuasivos e atrativos para produtos digitais.",
        },
        {
          role: "user",
          content: `Crie 5 opções de títulos persuasivos para um produto digital no nicho de ${nicho}, subnicho de ${subnicho}.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 250,
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error("Erro ao gerar título:", error)
    throw new Error("Falha ao gerar título do produto")
  }
}

// Função para gerar descrição de produto
export async function gerarDescricaoProduto(titulo: string, nicho: string) {
  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Você é um copywriter especializado em produtos digitais. Crie descrições persuasivas que destacam benefícios e solucionam problemas.",
        },
        {
          role: "user",
          content: `Crie uma descrição persuasiva de 3 parágrafos para um produto digital com o título "${titulo}" no nicho de ${nicho}. Destaque os principais benefícios e como ele resolve problemas do público-alvo.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error("Erro ao gerar descrição:", error)
    throw new Error("Falha ao gerar descrição do produto")
  }
}

// Função para gerar conteúdo de e-book
export async function gerarConteudoEbook(titulo: string, descricao: string, capitulo: { id: string; titulo: string }) {
  try {
    // Determinar o tipo de capítulo com base no ID
    let tipoCapitulo = "padrão"
    if (capitulo.id.startsWith("intro")) {
      tipoCapitulo = "introdução"
    } else if (capitulo.id.startsWith("concl")) {
      tipoCapitulo = "conclusão"
    } else if (capitulo.id.startsWith("exerc")) {
      tipoCapitulo = "exercícios práticos"
    } else if (capitulo.id.startsWith("casos")) {
      tipoCapitulo = "estudos de caso"
    }

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Você é um escritor especializado em e-books educativos. Crie conteúdo detalhado, informativo e bem estruturado em formato Markdown.",
        },
        {
          role: "user",
          content: `Crie o conteúdo para um capítulo de e-book com as seguintes informações:
          
          Título do E-book: "${titulo}"
          Descrição do E-book: "${descricao}"
          Título do Capítulo: "${capitulo.titulo}"
          Tipo de Capítulo: ${tipoCapitulo}
          
          O conteúdo deve ser detalhado, com pelo menos 800 palavras, formatado em Markdown, incluindo:
          - Título principal (usando #)
          - Subtítulos (usando ## e ###)
          - Parágrafos explicativos
          - Listas com pontos importantes
          - Exemplos práticos quando apropriado
          
          Se for um capítulo de introdução, apresente o tema e explique o que o leitor aprenderá.
          Se for um capítulo de conclusão, faça um resumo dos pontos principais e dê próximos passos.
          Se for um capítulo de exercícios, crie exercícios práticos relacionados ao tema.
          Se for um capítulo de estudos de caso, crie exemplos de casos reais ou hipotéticos.
          
          Mantenha um tom profissional mas acessível, e forneça informações valiosas e acionáveis.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error("Erro ao gerar conteúdo do e-book:", error)
    throw new Error("Falha ao gerar conteúdo do e-book")
  }
}

// Função para gerar subnichos com base no nicho
export async function gerarSubnichos(nicho: string) {
  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Você é um especialista em marketing digital e pesquisa de mercado. Forneça informações precisas e baseadas em dados sobre nichos de mercado para infoprodutos.",
        },
        {
          role: "user",
          content: `Gere 6 subnichos com alta procura e rentabilidade para vendas de infoproduto no nicho de ${nicho}. 
          
          Para cada subnicho, forneça:
          1. Título do subnicho
          2. Descrição curta (1-2 frases)
          3. Estimativa de buscas mensais no Google (um número aproximado)
          4. Probabilidade de venda (Alta, Média ou Baixa)
          
          Formate a resposta como um array JSON com a seguinte estrutura:
          [
            {
              "titulo": "Nome do Subnicho",
              "descricao": "Descrição curta",
              "buscasMensais": 5000,
              "probabilidadeVenda": "Alta"
            },
            ...
          ]`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error("Resposta vazia da API")

    try {
      // Parse the JSON response
      const parsedContent = JSON.parse(content)

      // Check if the response has the expected structure
      if (Array.isArray(parsedContent)) {
        return parsedContent
      } else if (parsedContent.subnichos && Array.isArray(parsedContent.subnichos)) {
        return parsedContent.subnichos
      } else {
        console.error("Formato de resposta inesperado:", parsedContent)
        // Create a fallback response with a default structure
        return [
          {
            titulo: "Subnicho 1",
            descricao: "Descrição do subnicho 1",
            buscasMensais: 1000,
            probabilidadeVenda: "Média",
          },
          {
            titulo: "Subnicho 2",
            descricao: "Descrição do subnicho 2",
            buscasMensais: 2000,
            probabilidadeVenda: "Alta",
          },
        ]
      }
    } catch (parseError) {
      console.error("Erro ao analisar JSON:", parseError, "Conteúdo recebido:", content)
      throw new Error("Falha ao processar a resposta da API")
    }
  } catch (error) {
    console.error("Erro ao gerar subnichos:", error)
    throw new Error(error instanceof Error ? error.message : "Falha ao gerar subnichos")
  }
}

// Função para gerar detalhes do produto
export async function gerarDetalhesProduto(nicho: string, subnicho: string) {
  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Você é um especialista em desenvolvimento de produtos digitais e marketing. Forneça informações detalhadas e estratégicas para a criação de infoprodutos de sucesso.",
        },
        {
          role: "user",
          content: `Crie um infoproduto detalhado para o nicho de ${nicho}, subnicho de ${subnicho}.
          
          Forneça as seguintes informações:
          1. Nome do produto (atrativo e persuasivo)
          2. Descrição detalhada (3-4 frases)
          3. Público-alvo (quem se beneficiaria deste produto)
          4. Características e benefícios (liste pelo menos 5)
          
          Formate a resposta como um objeto JSON com a seguinte estrutura:
          {
            "nome": "Nome do Produto",
            "descricao": "Descrição detalhada",
            "publicoAlvo": "Descrição do público-alvo",
            "caracteristicasBeneficios": [
              "Característica/Benefício 1",
              "Característica/Benefício 2",
              ...
            ]
          }`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error("Resposta vazia")

    // Parsear o JSON da resposta
    return JSON.parse(content)
  } catch (error) {
    console.error("Erro ao gerar detalhes do produto:", error)
    throw new Error("Falha ao gerar detalhes do produto")
  }
}

