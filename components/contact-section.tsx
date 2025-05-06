"use client"

import type React from "react"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Send, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { contactData } from "@/lib/data/contact-data"

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // 视差滚动效果
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormState("submitting")

    // 模拟表单提交
    setTimeout(() => {
      console.log("Form submitted:", formData)
      setFormState("success")
      setFormData({ name: "", email: "", subject: "", message: "" })

      // 重置表单状态
      setTimeout(() => {
        setFormState("idle")
      }, 3000)
    }, 1500)
  }

  return (
    <section id="contact" ref={ref} className="py-24 relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl opacity-50"></div>
      </div>

      <motion.div style={{ y, opacity }} className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              <span className="text-gradient">联系我</span>
            </h2>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-8 text-muted-foreground text-center max-w-2xl"
          >
            如果您有项目合作或工作机会，欢迎随时联系我。我期待与您共同创造令人惊叹的数字体验。
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div
              className={cn(
                "h-full rounded-xl overflow-hidden",
                "border border-transparent",
                "bg-gradient-to-br from-background/80 to-background",
                "shadow-lg shadow-primary/5",
                isDark ? "backdrop-blur-sm" : "",
              )}
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-6">联系信息</h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{contactData.email.label}</div>
                      <a href={contactData.email.href} className="hover:text-primary transition-colors">
                        {contactData.email.value}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{contactData.phone.label}</div>
                      <a href={contactData.phone.href} className="hover:text-primary transition-colors">
                        {contactData.phone.value}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{contactData.address.label}</div>
                      <div>{contactData.address.value}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <h4 className="text-lg font-medium mb-4">社交媒体</h4>
                  <div className="flex gap-4">
                    {contactData.socialMedia.map((platform, index) => (
                      <a
                        key={index}
                        href={platform.url}
                        className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        aria-label={platform.name}
                      >
                        {platform.name === "Github" && <Github className="w-5 h-5" />}
                        {platform.name === "LinkedIn" && <Linkedin className="w-5 h-5" />}
                        {platform.name === "Twitter" && <Twitter className="w-5 h-5" />}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-64 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg font-medium mb-2">{contactData.messagePrompt}</p>
                    <p className="text-sm text-muted-foreground">{contactData.responseTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div
              className={cn(
                "h-full rounded-xl overflow-hidden",
                "border border-transparent",
                "bg-gradient-to-br from-background/80 to-background",
                "shadow-lg shadow-primary/5",
                isDark ? "backdrop-blur-sm" : "",
              )}
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-6">发送消息</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm mb-2 font-medium">
                        姓名
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-muted/30 border-muted focus:border-primary"
                        disabled={formState === "submitting"}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm mb-2 font-medium">
                        邮箱
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-muted/30 border-muted focus:border-primary"
                        disabled={formState === "submitting"}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm mb-2 font-medium">
                      主题
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="bg-muted/30 border-muted focus:border-primary"
                      disabled={formState === "submitting"}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm mb-2 font-medium">
                      消息
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="bg-muted/30 border-muted focus:border-primary resize-none"
                      disabled={formState === "submitting"}
                    />
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full rounded-full"
                      disabled={formState === "submitting" || formState === "success"}
                    >
                      {formState === "idle" && (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          发送消息
                        </>
                      )}
                      {formState === "submitting" && "发送中..."}
                      {formState === "success" && (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          发送成功
                        </>
                      )}
                      {formState === "error" && (
                        <>
                          <AlertCircle className="mr-2 h-4 w-4" />
                          发送失败
                        </>
                      )}
                    </Button>
                  </div>

                  {formState === "success" && (
                    <div className="p-4 bg-primary/10 text-primary rounded-lg text-center">
                      感谢您的留言！我会尽快回复您。
                    </div>
                  )}

                  {formState === "error" && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-center">
                      发送失败，请稍后再试或直接通过邮箱联系我。
                    </div>
                  )}
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
