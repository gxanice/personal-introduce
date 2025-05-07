# 个人展示网站开发记录

## 开发概述

这是我的个人展示网站项目，主要用于展示我的前端开发技能和项目经验。网站采用现代化的设计风格，并融入了3D交互和动画效果来增强用户体验。

## 使用的技术栈

- Next.js
- TypeScript 
- Tailwind CSS
- Three.js + React Three Fiber
- Framer Motion
- shadcn/ui组件库

## 开发流程简述

1. **设计阶段**：使用Figma设计了网站的基本布局和风格
2. **基础搭建**：使用Next.js和TypeScript建立项目架构
3. **组件开发**：实现了导航栏、个人介绍、项目展示等基础组件
4. **3D场景实现**：开发了基于Three.js的技能可视化和交互式地球模型
5. **性能优化**：针对移动设备和加载速度进行了多方面优化
6. **部署上线**：使用Vercel平台部署网站

## 遇到的挑战与解决方案

### 1. 3D内容服务端渲染(SSR)问题

**问题描述**：
Three.js组件在服务器渲染和客户端水合时产生不匹配，导致React hydration错误。具体表现为控制台报错"Text content did not match"，并且3D场景在页面加载时闪烁或完全不显示。

**解决方案**：
- 实现了一个自定义钩子`useClientOnly`，确保3D组件仅在客户端渲染：
```tsx
function useClientOnly() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])
  
  return mounted
}
```

- 在3D组件中使用动态导入并添加客户端检测：
```tsx
const Scene = dynamic(() => import('@/components/3d/Scene'), { 
  ssr: false,
  loading: () => <ScenePlaceholder />
})
```

- 对于需要随机生成的3D元素，使用了确定性的种子生成算法，确保服务端和客户端生成相同的结果：
```tsx
// 使用固定种子的伪随机数生成
const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}
```

### 2. 3D场景在移动设备上的性能问题

**问题描述**：
完整3D场景在低端移动设备上帧率明显下降，导致交互卡顿，特别是在3D地球模型旋转和缩放时尤为明显。设备发热严重且电池消耗快。

**解决方案**：
- 实现了设备性能自适应检测，为不同性能等级的设备提供不同复杂度的渲染：
```tsx
const detailLevel = useMemo(() => {
  return isMobile
    ? {
        earthSegments: 32,
        cloudSegments: 24,
        atmosphereSegments: 16,
        particleCount: 1000,
      }
    : {
        earthSegments: 64,
        cloudSegments: 32,
        atmosphereSegments: 32,
        particleCount: 3000,
      }
}, [isMobile])
```

- 优化了几何体和纹理加载：
  - 使用LOD (Level of Detail)技术根据相机距离动态调整模型复杂度
  - 实现纹理渐进式加载，先显示低分辨率纹理，再逐渐加载高清纹理
  - 针对移动设备禁用了部分后期处理效果

- 添加了性能监测与自动优化系统：
```tsx
useEffect(() => {
  let frameCount = 0
  let lastTime = performance.now()
  let fpsCheckTimeout
  
  const checkPerformance = () => {
    const now = performance.now()
    const elapsed = now - lastTime
    const fps = frameCount / (elapsed / 1000)
    
    // 如果FPS低于阈值，自动降低渲染质量
    if (fps < 30 && !hasReducedQuality) {
      setReducedQuality(true)
    }
    
    frameCount = 0
    lastTime = now
    fpsCheckTimeout = setTimeout(checkPerformance, 2000)
  }
  
  const frameListener = () => {
    frameCount++
  }
  
  // 启动性能监测
  renderer.current?.setAnimationLoop(frameListener)
  fpsCheckTimeout = setTimeout(checkPerformance, 2000)
  
  return () => {
    clearTimeout(fpsCheckTimeout)
    renderer.current?.setAnimationLoop(null)
  }
}, [])
```

### 3. 暗色/亮色主题切换导致的UI不一致

**问题描述**：
主题切换时产生了多种视觉问题，包括闪烁、组件状态不一致和动画中断。特别是3D场景和背景色之间的过渡不协调，用户体验较差。

**解决方案**：
- 重构了主题切换逻辑，使用CSS变量和渐变动画实现平滑过渡：
```css
:root {
  --transition-duration: 0.5s;
}

body {
  transition: background-color var(--transition-duration) ease,
              color var(--transition-duration) ease;
}
```

- 为3D场景添加了主题感知能力，在主题切换时动态调整材质和光照：
```tsx
useEffect(() => {
  if (earthRef.current) {
    // 根据当前主题调整材质
    const material = earthRef.current.material
    
    if (isDark) {
      scene.background = new THREE.Color('#0f172a')
      material.emissiveIntensity = 0.3
      ambientLight.intensity = 0.3
    } else {
      scene.background = new THREE.Color('#f8fafc')
      material.emissiveIntensity = 0.1
      ambientLight.intensity = 0.7
    }
    
    // 添加过渡动画
    gsap.to(material, {
      duration: 0.5,
      emissiveIntensity: isDark ? 0.3 : 0.1,
      ease: "power2.inOut"
    })
  }
}, [isDark])
```

- 使用Suspense和骨架屏优化主题切换过程中的加载体验：
```tsx
<Suspense fallback={<ThemeSwitchSkeleton />}>
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <ModeToggle />
  </ThemeProvider>
</Suspense>
```

## 项目成果与后续计划

这个项目让我深入实践了现代前端技术，特别是3D可视化和性能优化方面的知识。后续计划添加更多交互式3D内容，并继续优化移动端体验。

项目已部署在Vercel平台上。 