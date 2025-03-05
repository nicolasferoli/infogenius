import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Package, FileText, TrendingUp } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  trend?: {
    value: number
    label: string
  }
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 p-1.5 text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="mt-2 flex items-center text-xs">
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            <span className="text-green-500">{trend.value}%</span>
            <span className="ml-1 text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total de Produtos"
        value="12"
        description="Produtos criados até o momento"
        icon={<Package className="h-4 w-4" />}
        trend={{ value: 12, label: "desde o mês passado" }}
      />
      <StatCard
        title="E-books Gerados"
        value="5"
        description="E-books completos gerados"
        icon={<BookOpen className="h-4 w-4" />}
        trend={{ value: 8, label: "desde o mês passado" }}
      />
      <StatCard
        title="Conteúdo Gerado"
        value="24.5k"
        description="Palavras geradas pela IA"
        icon={<FileText className="h-4 w-4" />}
        trend={{ value: 15, label: "desde o mês passado" }}
      />
      <StatCard
        title="Nichos Populares"
        value="3"
        description="Nichos mais utilizados"
        icon={<TrendingUp className="h-4 w-4" />}
      />
    </div>
  )
}

