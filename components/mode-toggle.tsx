"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [icon, setIcon] = useState<"sun" | "moon">("sun")
  
  // 只在客户端运行
  useEffect(() => {
    setMounted(true)
    // 初始图标基于系统偏好，确保服务器渲染和客户端一致
    const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIcon(darkModePreference ? "moon" : "sun")
    
    // 监听主题更改
    const onThemeChange = () => {
      setIcon(theme === "dark" ? "moon" : "sun")
    }
    
    // 立即同步图标状态
    onThemeChange()
    
    return () => {
      // 清理
    }
  }, [theme])
  
  // 在客户端挂载前，返回静态内容
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full" aria-label="切换主题">
        <div className="h-[1.2rem] w-[1.2rem]"></div>
      </Button>
    )
  }
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
      aria-label="切换主题"
    >
      <AnimatePresence mode="wait" initial={false}>
        {icon === "moon" ? (
          <motion.div
            key="moon"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-[1.2rem] w-[1.2rem] text-primary" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] text-primary" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}
