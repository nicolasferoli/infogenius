"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getCurrentUser, isAuthenticated, logoutUser } from "@/lib/auth"
import { useRouter, usePathname } from "next/navigation"
import type { UserProfile } from "@/lib/supabase"

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  logout: async () => {},
  refreshUser: async () => {},
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const refreshUser = async () => {
    setIsLoading(true)
    try {
      const isAuth = await isAuthenticated()

      if (isAuth) {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
      setAuthChecked(true)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (!isLoading && authChecked) {
      const publicRoutes = ["/login", "/signup", "/recuperar-senha"]
      const isPublicRoute = publicRoutes.includes(pathname)

      if (!user && !isPublicRoute) {
        router.push("/login")
      } else if (user && isPublicRoute) {
        router.push("/")
      }
    }
  }, [user, isLoading, authChecked, pathname, router])

  const logout = async () => {
    await logoutUser()
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

