"use client"

import { useRef, useEffect } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { useTheme } from "next-themes"

export default function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isMobile = useMobile()
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置画布尺寸为窗口大小
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // 粒子数量 - 移动端减少粒子数量以提高性能
    const particleCount = isMobile ? 50 : 100

    // 粒子类
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      originalX: number
      originalY: number
      angle: number
      velocity: number
      distance: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.originalX = this.x
        this.originalY = this.y
        this.size = Math.random() * 2 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.angle = Math.random() * Math.PI * 2
        this.velocity = 0.01 + Math.random() * 0.02
        this.distance = Math.random() * 100 + 50

        // 根据主题颜色设置粒子颜色
        const isDarkMode = theme === "dark"
        const opacity = Math.random() * 0.5 + 0.3 // 增加最小不透明度

        // 使用更明显的颜色对比
        if (isDarkMode) {
          const hue = Math.random() * 60 + 180 // 青色到蓝紫色范围
          this.color = `hsla(${hue}, 70%, 70%, ${opacity})`
        } else {
          const hue = Math.random() * 60 + 160 // 青色到蓝绿色范围
          this.color = `hsla(${hue}, 80%, 25%, ${opacity})` // 更深的颜色，增加对比度
        }
      }

      update() {
        // 波浪运动
        this.angle += this.velocity
        this.x = this.originalX + Math.cos(this.angle) * this.distance * 0.02
        this.y = this.originalY + Math.sin(this.angle) * this.distance * 0.02

        // 边界检查
        if (this.x > canvas.width) this.x = 0
        else if (this.x < 0) this.x = canvas.width

        if (this.y > canvas.height) this.y = 0
        else if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
      }
    }

    // 创建粒子数组
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // 连接粒子
    function connectParticles() {
      if (!ctx) return

      const maxDistance = isMobile ? 100 : 150

      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance
            const isDarkMode = theme === "dark"

            // 使用更明显的连线颜色
            if (isDarkMode) {
              ctx.strokeStyle = `rgba(100, 220, 220, ${opacity * 0.15})`
            } else {
              ctx.strokeStyle = `rgba(0, 100, 120, ${opacity * 0.3})` // 更深的颜色，增加不透明度
            }

            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // 动画循环
    function animate() {
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 更新并绘制所有粒子
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }

      connectParticles()
      requestAnimationFrame(animate)
    }

    animate()

    // 清理函数
    return () => {
      window.removeEventListener("resize", setCanvasSize)
    }
  }, [isMobile, theme])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-50" />
}
