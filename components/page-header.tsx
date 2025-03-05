import React from "react"
import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  breadcrumbs?: {
    title: string
    href?: string
  }[]
}

export function PageHeader({
  title,
  description,
  children,
  breadcrumbs,
  className,
  ...props
}: PageHeaderProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-8", className)} {...props}>
      {breadcrumbs && (
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Início</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {breadcrumbs.map((breadcrumb, index) => {
              const isLast = index === breadcrumbs.length - 1
              return (
                <React.Fragment key={breadcrumb.title}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={breadcrumb.href || "#"}>{breadcrumb.title}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-lg text-muted-foreground">{description}</p>}
      </div>

      {children && <div className="mt-4 flex items-center">{children}</div>}
    </div>
  )
}

