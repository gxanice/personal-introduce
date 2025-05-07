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
- React-Globe.gl

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
const Globe = dynamic(() => import('react-globe.gl').then(mod => mod), {
  ssr: false
})

// 组件内使用客户端检测
const [isClient, setIsClient] = useState(false)
useEffect(() => {
  setIsClient(true)
}, [])

// 避免SSR渲染问题
if (!isClient) {
  return <加载占位内容/>
}
```

### 2. 3D地球模型实现与性能优化

**问题描述**：
实现一个交互式3D地球模型，展示重要地理位置并支持层级导航，同时保持良好性能。

**解决方案**：
- 使用React-Globe.gl库创建高性能3D地球：
```tsx
<Globe
  ref={globeRef}
  globeImageUrl={isDark 
    ? '夜间地球纹理' 
    : '日间地球纹理'}
  bumpImageUrl='地形纹理'
  backgroundImageUrl={isDark ? '星空背景' : null}
  
  // 多边形数据 - 根据当前视图级别显示不同地域数据
  polygonsData={getPolygonsData()}
  polygonCapColor={(d) => {
    // 根据不同视图级别设置颜色
    if (viewLevel === "global" && d.properties?.ADMIN === "China") {
      return 'rgba(244, 63, 94, 0.8)'; // 全球视图中的中国
    }
    // 其他条件...
    return 'rgba(200, 200, 200, 0.3)'; // 其他区域
  }}
/>
```

- 实现了多级地理区域导航系统：
```tsx
// 处理区域点击
const handleLocationClick = (loc) => {
  setSelectedRegion(location.id);
  
  if (location.type === "country") {
    setViewLevel("country");
  } else if (location.type === "region") {
    setViewLevel("region");
  } else if (location.type === "city") {
    setViewLevel("city");
  }
  
  // 设置摄像机位置到所选区域
  globeRef.current.pointOfView({
    lat: location.lat,
    lng: location.lng,
    altitude: zoomLevel
  }, 1000);
}
```

- 针对初始化视角问题，实现了多重保障机制：
```tsx
// 设置初始视角，使中国可见
useEffect(() => {
  if (!globeRef.current || !loaded) return;
  
  // 用多个延迟尝试确保视角正确设置
  const timer = setTimeout(() => {
    globeRef.current.pointOfView({
      lat: 35,
      lng: 105,
      altitude: 2.0
    }, 0);
  }, 500);
  
  return () => clearTimeout(timer);
}, [loaded, globeRef.current]);

// 增加备份机制
useEffect(() => {
  if (!isClient) return;
  
  const timers = [
    setTimeout(() => {/* 设置视角 */}, 800),
    setTimeout(() => {/* 再次设置视角 */}, 1500)
  ];
  
  return () => timers.forEach(clearTimeout);
}, [isClient]);
```

### 3. 暗色/亮色主题切换与3D场景适配

**问题描述**：
主题切换时需要同步调整3D地球的外观，包括地球纹理、背景和高亮颜色等，保持整体视觉一致性。

**解决方案**：
- 使用theme hook监听主题变化并应用不同资源：
```tsx
const { resolvedTheme } = useTheme()
const isDark = resolvedTheme === "dark"

// 在渲染时应用主题
<Globe
  globeImageUrl={isDark 
    ? 'https://unpkg.com/three-globe/example/img/earth-night.jpg' 
    : 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'}
  backgroundImageUrl={isDark ? 'https://unpkg.com/three-globe/example/img/night-sky.png' : null}
  // 其他主题相关配置...
/>
```

- 为UI元素添加主题感知样式：
```tsx
<Button 
  onClick={resetView}
  className={`px-4 py-2 backdrop-blur-sm border border-primary/20 rounded-full 
    ${isDark 
      ? 'bg-background/60 text-sky-300 hover:bg-sky-900/30' 
      : 'bg-background/80 hover:bg-primary/10'
    }`}
>
  重置视图
</Button>
```

## 地球组件功能特点

- **多级地理导航**：支持从全球→国家→省份→城市的层级导航
- **自适应主题**：根据系统主题自动切换日/夜间地球样式
- **交互式区域高亮**：点击区域自动高亮并缩放到合适视角
- **地理数据集成**：使用GeoJSON数据展示国家、省份和城市边界
- **移动设备优化**：针对不同屏幕尺寸优化显示效果和交互体验
- **客户端渲染保障**：完全客户端渲染，避免SSR相关问题

## 项目成果与后续计划

这个项目让我深入实践了现代前端技术，特别是3D可视化和性能优化方面的知识。后续计划添加更多交互式3D内容，增强地理数据的完整性，并继续优化移动端体验。

项目已部署在Vercel平台上。 