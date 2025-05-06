"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, ArrowRight, X } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { projects, projectHighlights } from "@/lib/data/projects-data"

export default function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const openProject = (project: typeof projects[0]) => {
    setSelectedProject(project)
    document.body.style.overflow = "hidden"
  }

  const closeProject = () => {
    setSelectedProject(null)
    document.body.style.overflow = "auto"
  }

  return (
    <section id="projects" ref={ref} className="py-24 relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl opacity-50"></div>
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
              <span className="text-gradient">精选项目</span>
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
            探索我的创意作品集，每个项目都融合了技术创新与设计美学，展现了我对数字体验的独特见解。
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
              onClick={() => openProject(project)}
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-xl cursor-pointer transition-all duration-500",
                  "border border-transparent hover:border-primary/20",
                  "bg-gradient-to-br from-background/80 to-background",
                  "hover:shadow-lg hover:shadow-primary/5",
                  isDark ? "backdrop-blur-sm" : "",
                )}
              >
                <div className="relative h-64 overflow-hidden">
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-20", project.color)}></div>
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className={cn(
                            "inline-block px-2 py-1 text-xs rounded-full",
                            "bg-primary/10 text-primary",
                            "backdrop-blur-sm",
                          )}
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <p className="text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                  <div className="flex items-center text-sm font-medium text-primary">
                    <span>查看详情</span>
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 项目详情弹窗 */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
            onClick={closeProject}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-background border border-border rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-72 md:h-96">
                <Image
                  src={selectedProject.image || "/placeholder.svg"}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
                <div
                  className={cn(
                    "absolute inset-0 opacity-40 mix-blend-overlay",
                    `bg-gradient-to-br ${selectedProject.color}`,
                  )}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90"></div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80"
                  onClick={closeProject}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{selectedProject.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-block px-3 py-1 text-xs rounded-full bg-primary/10 text-primary backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-muted-foreground mb-6 leading-relaxed">{selectedProject.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">项目亮点</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {projectHighlights.map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">技术栈</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {selectedProject.tags.map((tag, i) => (
                        <li key={i}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button className="rounded-full" asChild>
                    <a href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      查看演示
                    </a>
                  </Button>
                  <Button variant="outline" className="rounded-full" asChild>
                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      查看代码
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
