export const projects = [
  {
    id: 1,
    title: "易存云文件存储系统",
    description:
      "易存云提供了高效的文件存储服务，具备文件加密、分片传输和秒传功能，确保安全快速地管理文件。平台支持文件在线预览和生成分享链接，方便用户分享和访问文件。",
    image: "/saber.jpg?height=600&width=800",
    tags: ["Vue", "SHA-256", "Spark-MD5", "文件预览"],
    demoUrl: "#",
    githubUrl: "#",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: 2,
    title: "短剧落地页生成系统",
    description:
      "为了解决手动修改短剧落地页内容的问题，实现了自动化的短剧落地页生成系统。支持空白落地页、新版落地页以及双语落地页的适配，通过容器化进行内网部署，保证了访问的安全性。",
    image: "/saber.jpg?height=600&width=800",
    tags: ["Vue", "容器化", "自动化", "多语言"],
    demoUrl: "#",
    githubUrl: "#",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: 3,
    title: "九章大模型(mathGPT)",
    description:
      "专注于数学教育的AI辅助工具，支持特殊数学公式的输入与展示。利用界定符匹配数学公式，通过MathJax进行渲染，并实现问答的TTS阅读功能，利用WebSocket与Audio进行数据的接收以及播放。",
    image: "/saber.jpg?height=600&width=800",
    tags: ["Vue", "WebSocket", "MathJax", "TTS"],
    demoUrl: "#",
    githubUrl: "#",
    color: "from-emerald-500 to-green-500",
  },
  {
    id: 4,
    title: "千帆考务系统",
    description:
      "教育考试管理系统，包含答题卡模块和改卷系统。答题卡支持三栏布局和跨页内容渲染；改卷系统利用Canvas实现对卷纸的标注与打分，支持动态调整绘图模式、笔刷属性及橡皮擦功能。",
    image: "/saber.jpg?height=600&width=800",
    tags: ["Vue", "Canvas", "教育科技", "考试系统"],
    demoUrl: "#",
    githubUrl: "#",
    color: "from-amber-500 to-orange-500",
  },
]

// 项目亮点 - 所有项目共用
export const projectHighlights = [
  "用户体验优先的设计理念",
  "高效的代码实现与性能优化",
  "响应式设计适配各种设备",
  "注重安全性与数据保护"
] 