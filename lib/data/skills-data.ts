export interface Skill {
  name: string;
  level: "专家" | "精通" | "熟练" | "入门";
  description: string;
  projects: string;
  years: number;
}

export interface SkillCategory {
  title: string;
  description: string;
  color: string;
  skills: Skill[];
}

export const skillsData: Record<string, SkillCategory> = {
  frontend: {
    title: "前端开发",
    description: "构建现代化、高性能的Web应用，专注于用户体验和交互设计。",
    color: "from-cyan-500 to-blue-500",
    skills: [
      {
        name: "Vue全家桶",
        level: "精通",
        description:
          "熟悉Vue2与Vue3全家桶，了解并实践Vue3源码，包括响应式系统设计、虚拟DOM操作、Diff算法优化及模块化打包测试。",
        projects: "易存云、短剧落地页生成系统、九章大模型",
        years: 1,
      },
      {
        name: "HTML5 & CSS3",
        level: "精通",
        description: "熟悉HTML5与CSS3新特性，能够构建响应式、兼容性良好的页面布局。",
        projects: "多个实习项目的页面开发",
        years: 1,
      },
      {
        name: "JavaScript/ES6+",
        level: "精通",
        description: "熟悉ES6+规范，掌握异步编程、模块化开发等现代JavaScript技术。",
        projects: "所有前端项目",
        years: 1,
      },
      {
        name: "TypeScript",
        level: "熟练",
        description: "了解TypeScript，能够使用类型系统提高代码的可维护性和健壮性。",
        projects: "部分企业级项目",
        years: 1,
      },
      {
        name: "React相关",
        level: "熟练",
        description: "了解React，了解Redux，React-Router等使用，能够构建基于React的应用。",
        projects: "个人项目实践",
        years: 1,
      },
    ],
  },
  engTools: {
    title: "工程化工具",
    description: "前端工程化实践，提高开发效率和代码质量。",
    color: "from-violet-500 to-purple-500",
    skills: [
      {
        name: "Webpack",
        level: "熟练",
        description: "熟悉Webpack配置，能够根据项目需求进行优化和定制。",
        projects: "多个企业项目的构建优化",
        years: 1,
      },
      {
        name: "Vite",
        level: "熟练",
        description: "熟悉Vite的特性和使用，了解基本配置和优化方法。",
        projects: "新项目的快速开发与构建",
        years: 1,
      },
      {
        name: "Git版本控制",
        level: "熟练",
        description: "能够使用常用的Git命令进行团队协作开发，掌握分支管理和代码合并策略。",
        projects: "所有团队开发项目",
        years: 1,
      },
      {
        name: "Nuxt.js",
        level: "熟练",
        description: "了解SSR原理，实现过Nuxt.js项目重构，优化首页加载时间。",
        projects: "itranscibe翻译官网",
        years: 1,
      },
      {
        name: "容器化部署",
        level: "入门",
        description: "了解Docker基本概念和使用，能够进行简单的容器化部署。",
        projects: "短剧落地页生成系统",
        years: 1,
      },
    ],
  },
  creative: {
    title: "交互技术",
    description: "结合艺术与技术，创造沉浸式数字体验和视觉效果。",
    color: "from-emerald-500 to-green-500",
    skills: [
      {
        name: "Canvas开发",
        level: "熟练",
        description: "利用Canvas API创建交互式图形和动画，特别是在教育类应用中的应用。",
        projects: "千帆考务系统改卷功能",
        years: 1,
      },
      {
        name: "WebSocket应用",
        level: "熟练",
        description: "熟悉WebSocket通信原理，实现实时数据传输和交互功能。",
        projects: "九章大模型TTS功能",
        years: 1,
      },
      {
        name: "音频处理",
        level: "熟练",
        description: "使用Howler.js等库进行音频处理和播放控制，实现复杂的音频交互体验。",
        projects: "itranscibe翻译项目",
        years: 1,
      },
      {
        name: "ECharts可视化",
        level: "熟练",
        description: "使用ECharts构建数据可视化图表，呈现复杂数据关系。",
        projects: "星网大屏项目",
        years: 1,
      },
      {
        name: "性能优化",
        level: "熟练",
        description: "掌握前端性能优化技术，如虚拟列表、懒加载等，提高用户体验。",
        projects: "多个大型企业项目",
        years: 1,
      },
    ],
  },
  backend: {
    title: "其他技能",
    description: "全栈开发、安全防护等补充技能。",
    color: "from-amber-500 to-orange-500",
    skills: [
      {
        name: "Node.js",
        level: "入门",
        description: "了解Node.js及前端工程化的相关知识，能够开发简单的服务端应用。",
        projects: "前端工程化项目",
        years: 1,
      },
      {
        name: "数据加密",
        level: "熟练",
        description: "熟悉SHA-256、Spark-MD5等加密算法的应用，保障用户信息和文件安全。",
        projects: "易存云项目、四库全书项目",
        years: 1,
      },
      {
        name: "文件处理",
        level: "熟练",
        description: "掌握文件分片上传、秒传、在线预览等技术，提高用户文件操作体验。",
        projects: "易存云项目",
        years: 1,
      },
      {
        name: "人工智能",
        level: "入门",
        description: "人工智能专业背景，了解基本的AI概念和应用。",
        projects: "智慧导盲项目",
        years: 1,
      },
      {
        name: "团队协作",
        level: "熟练",
        description: "良好的沟通能力和团队协作精神，能够高效参与团队项目开发。",
        projects: "所有实习和竞赛项目",
        years: 1,
      },
    ],
  },
};

// 技能概览数据
export const skillsOverview = [
  {
    value: "1+",
    label: "年前端经验",
    description: "在前端开发领域拥有3年以上的学习和实践经验，参与过多个企业级项目的开发。"
  },
  {
    value: "3+",
    label: "实习项目",
    description: "在网易有道、好未来、亚信科技等知名企业积累了丰富的实习经验。"
  },
  {
    value: "3+",
    label: "竞赛奖项",
    description: "获得多项国家级竞赛奖项，包括挑战杯一等奖、计算机设计大赛三等奖等。"
  }
];

export const sectionTitle = "专业技能";
export const sectionDescription = "我的技术栈涵盖前端开发、工程化工具和交互技术，不断学习新技术以保持竞争力。"; 