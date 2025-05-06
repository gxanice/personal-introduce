"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { label: "首页", href: "#" },
  { label: "关于", href: "#about" },
  { label: "技能", href: "#skills" },
  { label: "项目", href: "#projects" },
  { label: "经历", href: "#experience" },
  { label: "联系", href: "#contact" },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const isMobile = useMobile()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)

      // 检测当前活动的部分
      const sections = navItems.map((item) => item.href.replace("#", "")).filter(Boolean)

      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100) {
            setActiveSection(section)
            break
          }
        }
      }

      if (window.scrollY < 100) {
        setActiveSection("")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleNavClick = (e: React.MouseEvent<HTMLButtonElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace("#", "")
    const element = document.getElementById(targetId)

    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      closeMenu()
    } else if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      closeMenu()
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gradient">
            八菜の个人页
          </Link>

          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => {
              const isActive = item.href === "#" ? activeSection === "" : activeSection === item.href.replace("#", "")

              return (
                <Button
                  key={index}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`rounded-full transition-all duration-300 ${
                    isActive ? "bg-primary text-primary-foreground" : ""
                  }`}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleNavClick(e, item.href)}
                >
                  {item.label}
                </Button>
              )
            })}
            <ModeToggle />
          </nav>

          {/* 移动端导航按钮 */}
          <div className="flex items-center md:hidden">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu" className="ml-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? "close" : "menu"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <X /> : <Menu />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>

      {/* 移动端导航菜单 */}
      {isMobile && (
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-effect border-t border-primary/10"
            >
              <nav className="flex flex-col p-4">
                {navItems.map((item, index) => {
                  const isActive =
                    item.href === "#" ? activeSection === "" : activeSection === item.href.replace("#", "")

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="lg"
                        className={`justify-start mb-2 w-full ${isActive ? "bg-primary text-primary-foreground" : ""}`}
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleNavClick(e, item.href)}
                      >
                        {item.label}
                      </Button>
                    </motion.div>
                  )
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </header>
  )
}
