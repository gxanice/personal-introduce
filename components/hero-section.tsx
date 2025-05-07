"use client"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

// 动态导入3D组件以减少首屏加载时间
const Earth3D = dynamic(() => import("@/components/3d/earth-3d"), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] flex items-center justify-center">加载中...</div>,
})

const Title3D = dynamic(() => import("@/components/3d/title-3d"), {
  ssr: false,
  loading: () => <div className="h-20"></div>,
})

export default function HeroSection() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  return (
    <section className="min-h-screen flex flex-col justify-center items-center py-20 relative overflow-hidden">
      {/* 装饰元素 */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl animate-pulse-soft"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full filter blur-3xl animate-pulse-soft"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center mb-8 relative z-10"
      >
        <motion.div variants={itemVariants} className="mb-6">
          {isMounted && <Title3D />}
        </motion.div>

        <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl mb-6 text-gradient font-bold">
          前端开发工程师 / 创意开发者
        </motion.h2>

        <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-muted-foreground mb-8 leading-relaxed">
          专注于创建具有视觉吸引力和高性能的Web体验， 结合创新技术和设计理念打造独特的数字产品。
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
          <Button
            size="lg"
            onClick={scrollToAbout}
            className="rounded-full px-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
          >
            了解更多
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 border-primary/20 hover:border-primary/50 transition-all duration-300"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            联系我
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="w-full max-w-4xl h-[400px] md:h-[600px] animate-float"
      >
        {isMounted && <Earth3D />}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={scrollToAbout}
          className="animate-bounce rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80"
        >
          <ArrowDown className="text-primary" />
        </Button>
      </motion.div>
    </section>
  )
}
