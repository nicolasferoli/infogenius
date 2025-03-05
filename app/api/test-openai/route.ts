import { NextResponse } from "next/server"
import OpenAI from "openai"

// Modelo padrão para todas as chamadas
const DEFAULT_MODEL = "gpt-4o-mini"

export async function GET() {
  try {
    // Verificar se a chave da API está configurada
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Chave da API OpenAI não configurada",
          error: "A variável de ambiente OPENAI_API_KEY não está definida",
          errorType: "api_key",
          apiKey: "Não configurada",
        },
        { status: 400 },
      )
    }

    // Inicializa o cliente OpenAI com a chave da API
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    })

    // Tenta fazer uma chamada simples para a API
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "user",
          content: "Responda apenas com a palavra 'conectado' para testar a conexão.",
        },
      ],
      max_tokens: 10,
    })

    // Verifica se a resposta foi bem-sucedida
    const content = response.choices[0]?.message?.content || "Sem resposta"

    return NextResponse.json({
      success: true,
      message: "Conexão com a API da OpenAI estabelecida com sucesso",
      apiKey: "Configurada",
      response: content,
      model: DEFAULT_MODEL,
    })
  } catch (error) {
    console.error("Erro ao testar conexão com a OpenAI:", error)

    // Abordagem completamente nova para tratamento de erros
    // Evitando qualquer uso de métodos de string que possam causar problemas
    let errorMessage = "Erro desconhecido ao conectar com a API da OpenAI"
    let errorType = "unknown"

    // Função segura para verificar se uma string contém um padrão
    // sem usar métodos que possam causar erros
    function safeIncludes(text, pattern) {
      // Se text não for uma string, converter para string ou retornar falso
      if (typeof text !== "string") {
        try {
          text = String(text || "")
        } catch (e) {
          return false
        }
      }

      // Verificar se a string contém o padrão
      return text.indexOf(pattern) >= 0
    }

    // Extrair mensagem de erro de forma segura
    if (error) {
      if (typeof error === "object" && error !== null) {
        // Tentar obter a mensagem do objeto de erro
        try {
          if (error.message && typeof error.message === "string") {
            errorMessage = error.message
          } else if (typeof error.toString === "function") {
            const errorString = error.toString()
            if (typeof errorString === "string") {
              errorMessage = errorString
            }
          }
        } catch (e) {
          // Se ocorrer um erro ao extrair a mensagem, manter a mensagem padrão
          console.error("Erro ao extrair mensagem de erro:", e)
        }
      } else if (typeof error === "string") {
        errorMessage = error
      }
    }

    // Determinar o tipo de erro sem usar toLowerCase()
    try {
      // Verificar padrões comuns de erro
      if (
        safeIncludes(errorMessage, "API key") ||
        safeIncludes(errorMessage, "api key") ||
        safeIncludes(errorMessage, "apiKey") ||
        safeIncludes(errorMessage, "authentication")
      ) {
        errorType = "api_key"
      } else if (
        safeIncludes(errorMessage, "timeout") ||
        safeIncludes(errorMessage, "ECONNREFUSED") ||
        safeIncludes(errorMessage, "network") ||
        safeIncludes(errorMessage, "Network") ||
        safeIncludes(errorMessage, "fetch") ||
        safeIncludes(errorMessage, "Fetch") ||
        safeIncludes(errorMessage, "abort") ||
        safeIncludes(errorMessage, "Abort")
      ) {
        errorType = "connection"
      } else if (
        safeIncludes(errorMessage, "rate limit") ||
        safeIncludes(errorMessage, "Rate limit") ||
        safeIncludes(errorMessage, "ratelimit") ||
        safeIncludes(errorMessage, "too many")
      ) {
        errorType = "rate_limit"
      } else if (safeIncludes(errorMessage, "model") || safeIncludes(errorMessage, "Model")) {
        errorType = "model_error"
      }
    } catch (e) {
      // Se ocorrer um erro ao determinar o tipo, manter o tipo padrão
      console.error("Erro ao determinar tipo de erro:", e)
    }

    // Verificar se a chave da API está configurada
    const apiKeyStatus = process.env.OPENAI_API_KEY ? "Configurada (mas pode estar inválida)" : "Não configurada"

    return NextResponse.json(
      {
        success: false,
        message: "Falha ao conectar com a API da OpenAI",
        error: errorMessage,
        errorType: errorType,
        apiKey: apiKeyStatus,
        model: DEFAULT_MODEL,
      },
      { status: 500 },
    )
  }
}

