"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.div
            key="dark"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-[1.2rem] w-[1.2rem] text-primary" />
          </motion.div>
        ) : (
          <motion.div
            key="light"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] text-primary" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only">切换主题</span>
    </Button>
  )
}
