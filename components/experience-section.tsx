"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Briefcase, GraduationCap, Calendar, ChevronDown, ChevronUp, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { experiences } from "@/lib/data/experience-data"

export default function ExperienceSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const [expandedId, setExpandedId] = useState<number | null>(1)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // 视差滚动效果
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <section id="experience" ref={ref} className="py-24 relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl opacity-50"></div>
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
              <span className="text-gradient">专业经历</span>
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
            我的职业旅程展现了在前端开发和创意技术领域的成长历程，每一步都是宝贵的学习和成就。
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* 时间线 */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary transform -translate-x-1/2"></div>

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "relative flex flex-col md:flex-row mb-12 last:mb-0",
                index % 2 === 0 ? "md:flex-row-reverse" : "",
              )}
            >
              {/* 时间点 */}
              <div className="absolute left-0 md:left-1/2 w-5 h-5 rounded-full bg-gradient-to-r from-primary to-accent transform -translate-x-1/2 z-10 shadow-lg shadow-primary/20"></div>

              {/* 内容卡片 */}
              <div className={cn("md:w-1/2", index % 2 === 0 ? "md:pr-12" : "md:pl-12")}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={cn(
                    "relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300",
                    "border border-transparent hover:border-primary/20",
                    "bg-gradient-to-br from-background/80 to-background",
                    "hover:shadow-lg hover:shadow-primary/5",
                    isDark ? "backdrop-blur-sm" : "",
                  )}
                  onClick={() => toggleExpand(exp.id)}
                >
                  <div className={cn("absolute top-0 left-0 w-full h-1", `bg-gradient-to-r ${exp.color}`)}></div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                      {exp.type === "work" ? (
                        <Briefcase className="w-4 h-4 text-primary" />
                      ) : (
                        <GraduationCap className="w-4 h-4 text-primary" />
                      )}
                      <span>{exp.type === "work" ? "工作经历" : "教育背景"}</span>
                    </div>

                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors duration-300">
                      {exp.title}
                    </h3>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-muted-foreground">{exp.company}</div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        {exp.location}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{exp.period}</span>
                    </div>

                    <p className="text-muted-foreground mb-4">{exp.description}</p>

                    {/* 展开/收起内容 */}
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: expandedId === exp.id ? "auto" : 0,
                        opacity: expandedId === exp.id ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-border">
                        <h4 className="font-medium mb-3">主要成就</h4>
                        <ul className="space-y-2 mb-6">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                              <span className="text-sm text-muted-foreground">{achievement}</span>
                            </li>
                          ))}
                        </ul>

                        <h4 className="font-medium mb-3">技能</h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="inline-block px-3 py-1 text-xs rounded-full bg-primary/10 text-primary"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    <div className="flex justify-center mt-4">
                      <button
                        className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleExpand(exp.id)
                        }}
                      >
                        {expandedId === exp.id ? (
                          <>
                            收起详情
                            <ChevronUp className="ml-1 w-4 h-4" />
                          </>
                        ) : (
                          <>
                            查看详情
                            <ChevronDown className="ml-1 w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
