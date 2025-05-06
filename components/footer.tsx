"use client"

import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="py-6 border-t border-primary/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 md:mb-0"
          >
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} 个人作品集. 保留所有权利.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-sm text-gradient font-medium">使用 Next.js, React Three Fiber 和 Tailwind CSS 构建</p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
