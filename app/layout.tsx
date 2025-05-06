import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "个人展示网站",
  description: "基于React和WebGL的个人展示网站"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background antialiased theme-transition", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <Suspense>
              <main className="flex-1">{children}</main>
            </Suspense>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
