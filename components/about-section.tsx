"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { aboutData } from "@/lib/data/about-data"

// 动态导入3D头像组件
const Avatar3D = dynamic(() => import("@/components/3d/avatar-3d"), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] flex items-center justify-center">加载中...</div>,
})

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // 视差滚动效果
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section id="about" ref={ref} className="py-20 relative">
      {/* 装饰元素 */}
      <div className="absolute left-0 top-1/4 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl"></div>
      <div className="absolute right-0 bottom-1/4 w-64 h-64 bg-accent/5 rounded-full filter blur-3xl"></div>

      <motion.div style={{ y, opacity }} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        <div className="order-2 md:order-1">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-6 text-gradient"
          >
            {aboutData.title}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 text-muted-foreground"
          >
            {aboutData.paragraphs.map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </motion.div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {aboutData.stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="card-hover overflow-hidden border-primary/10">
                  <CardContent className={`p-4 bg-gradient-to-br from-${stat.color}/5 to-transparent`}>
                    <div className={`text-4xl font-bold text-${stat.color}`}>{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8 }}
          className="order-1 md:order-2 h-[300px] md:h-[400px] animate-float"
        >
          <Avatar3D />
        </motion.div>
      </motion.div>
    </section>
  )
}