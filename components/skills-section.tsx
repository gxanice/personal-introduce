"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Code, Palette, Layers, Cpu, ChevronRight } from "lucide-react"
import dynamic from "next/dynamic"
import { skillsData, skillsOverview, sectionTitle, sectionDescription, type Skill } from "@/lib/data/skills-data"

// 动态导入3D技能可视化组件
const SkillsVisualization3D = dynamic(() => import("@/components/3d/skills-visualization"), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] flex items-center justify-center">加载中...</div>,
})

// 图标映射
const categoryIcons = {
  frontend: <Code className="w-6 h-6" />,
  creative: <Palette className="w-6 h-6" />,
  design: <Layers className="w-6 h-6" />,
  other: <Cpu className="w-6 h-6" />
}

export default function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const [activeCategory, setActiveCategory] = useState<string>("frontend")
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // 视差滚动效果
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(selectedSkill === skill ? null : skill)
  }

  const currentCategory = skillsData[activeCategory]

  return (
    <section id="skills" ref={ref} className="py-24 relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl opacity-50"></div>
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
              <span className="text-gradient">{sectionTitle}</span>
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
            {sectionDescription}
          </motion.p>
        </div>

        {/* 3D技能可视化 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <SkillsVisualization3D />
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* 技能类别选择器 - 六边形设计 */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {Object.entries(skillsData).map(([key, category]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                onClick={() => setActiveCategory(key)}
                className={cn(
                  "cursor-pointer transition-all duration-300",
                  "transform hover:scale-105",
                  activeCategory === key ? "z-10" : "",
                )}
              >
                <div
                  className={cn(
                    "hexagon relative",
                    "w-32 h-32 md:w-40 md:h-40",
                    "flex flex-col items-center justify-center text-center p-4",
                    activeCategory === key
                      ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50",
                  )}
                >
                  <div className="mb-2">{categoryIcons[key as keyof typeof categoryIcons]}</div>
                  <h3 className="text-sm font-medium">{category.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 当前类别技能展示 */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div
              className={cn(
                "rounded-xl overflow-hidden mb-8 p-8",
                "border border-transparent",
                "bg-gradient-to-br from-background/80 to-background",
                "shadow-lg shadow-primary/5",
                isDark ? "backdrop-blur-sm" : "",
              )}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={cn("p-3 rounded-full", `bg-gradient-to-r ${currentCategory.color} text-white`)}>
                  {categoryIcons[activeCategory as keyof typeof categoryIcons]}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{currentCategory.title}</h3>
                  <p className="text-muted-foreground">{currentCategory.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentCategory.skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={cn(
                      "rounded-lg p-5 cursor-pointer transition-all duration-300",
                      "border border-transparent hover:border-primary/20",
                      "hover:shadow-md hover:shadow-primary/5",
                      selectedSkill === skill ? "bg-primary/5 border-primary/20" : "bg-muted/20",
                    )}
                    onClick={() => handleSkillClick(skill)}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{skill.name}</h4>
                      <span
                        className={cn(
                          "px-2 py-1 text-xs rounded-full",
                          skill.level === "专家"
                            ? "bg-primary/20 text-primary"
                            : skill.level === "精通"
                              ? "bg-accent/20 text-accent"
                              : "bg-muted/30 text-muted-foreground",
                        )}
                      >
                        {skill.level}
                      </span>
                    </div>

                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      <span>{skill.years}年经验</span>
                      <ChevronRight
                        className={cn(
                          "ml-auto w-4 h-4 transition-transform",
                          selectedSkill === skill ? "rotate-90" : "",
                        )}
                      />
                    </div>

                    {/* 展开的详细信息 */}
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: selectedSkill === skill ? "auto" : 0,
                        opacity: selectedSkill === skill ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-border">
                        <p className="text-sm mb-4">{skill.description}</p>
                        <div className="text-sm">
                          <span className="font-medium">相关项目：</span> {skill.projects}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 技能概览 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {skillsOverview.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-xl overflow-hidden p-6",
                  "border border-transparent",
                  "bg-gradient-to-br from-background/80 to-background",
                  "shadow-lg shadow-primary/5",
                  isDark ? "backdrop-blur-sm" : "",
                )}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">{item.value}</span>
                </div>
                <h4 className="text-lg font-bold mb-2">{item.label}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <style jsx global>{`
        .hexagon {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>
    </section>
  )
}
