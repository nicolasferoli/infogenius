"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Loader2 } from "lucide-react"
import { createUser, loginUser, logoutUser } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export default function AuthTestPage() {
  const [activeTab, setActiveTab] = useState("signup")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Verificar usuário atual
  const checkCurrentUser = async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      const { data: userData } = await supabase.from("profiles").select("*").eq("id", data.session.user.id).single()

      setCurrentUser({
        ...data.session.user,
        profile: userData,
      })
    } else {
      setCurrentUser(null)
    }
  }

  // Ao carregar a página
  useEffect(() => {
    checkCurrentUser()
  }, [])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const success = await createUser(name, email, password)

      if (success) {
        toast({
          title: "Conta criada com sucesso",
          description: "Agora você pode fazer login.",
        })
        setActiveTab("login")
      } else {
        toast({
          title: "Falha ao criar conta",
          description: "Este email já pode estar em uso. Por favor, tente outro email.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Erro ao criar conta:", error)
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao tentar criar sua conta.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const success = await loginUser(email, password)

      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Você está autenticado.",
        })
        await checkCurrentUser()
      } else {
        toast({
          title: "Falha no login",
          description: "Email ou senha incorretos. Por favor, tente novamente.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Erro ao fazer login:", error)
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao tentar fazer login.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      await logoutUser()
      setCurrentUser(null)
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado.",
      })
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error)
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao tentar fazer logout.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Teste de Autenticação</h1>

        {currentUser ? (
          <Card>
            <CardHeader>
              <CardTitle>Usuário Autenticado</CardTitle>
              <CardDescription>Você está logado como {currentUser.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">ID:</p>
                  <p className="text-sm bg-muted p-2 rounded">{currentUser.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Email:</p>
                  <p className="text-sm bg-muted p-2 rounded">{currentUser.email}</p>
                </div>
                {currentUser.profile && (
                  <div>
                    <p className="text-sm font-medium mb-1">Nome:</p>
                    <p className="text-sm bg-muted p-2 rounded">{currentUser.profile.name}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleLogout} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saindo...
                  </>
                ) : (
                  "Sair"
                )}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Criar Conta</CardTitle>
                  <CardDescription>Crie uma nova conta para testar o Supabase</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        "Criar Conta"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Entrar</CardTitle>
                  <CardDescription>Faça login com sua conta</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        "Entrar"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
      <Toaster />
    </div>
  )
}

