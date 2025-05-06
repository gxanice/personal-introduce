"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Html, Stars } from "@react-three/drei"
import { useMobile } from "@/hooks/use-mobile"
import * as THREE from "three"
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing"
import { useTheme } from "next-themes"

// 简化的GeoJSON数据 - 实际应用中应该使用完整的GeoJSON数据
const geoData = {
  countries: [
    {
      id: "china",
      name: "中国",
      center: { lat: 35.8617, lon: 104.1954 },
      color: "#f43f5e",
      // 简化的中国边界坐标点
      boundary: [
        [117.2, 49.5],
        [119.5, 46.2],
        [126.0, 41.8],
        [131.3, 42.9],
        [134.5, 39.8],
        [121.2, 25.0],
        [110.3, 18.0],
        [97.5, 28.0],
        [88.8, 36.0],
        [80.2, 42.0],
        [87.5, 49.2],
        [117.2, 49.5],
      ],
      regions: [
        {
          id: "beijing",
          name: "北京",
          center: { lat: 39.9042, lon: 116.4074 },
          color: "#f43f5e",
          // 简化的北京边界坐标点
          boundary: [
            [115.7, 40.5],
            [117.4, 40.5],
            [117.4, 39.4],
            [115.7, 39.4],
            [115.7, 40.5],
          ],
          cities: [
            {
              id: "beijing-city",
              name: "北京市",
              center: { lat: 39.9042, lon: 116.4074 },
              description: "中国首都，政治文化中心",
              // 简化的北京市中心区域坐标点
              boundary: [
                [116.2, 40.0],
                [116.6, 40.0],
                [116.6, 39.8],
                [116.2, 39.8],
                [116.2, 40.0],
              ],
            },
          ],
        },
        {
          id: "shanghai",
          name: "上海",
          center: { lat: 31.2304, lon: 121.4737 },
          color: "#f43f5e",
          // 简化的上海边界坐标点
          boundary: [
            [120.9, 31.9],
            [122.1, 31.9],
            [122.1, 30.7],
            [120.9, 30.7],
            [120.9, 31.9],
          ],
          cities: [
            {
              id: "shanghai-city",
              name: "上海市",
              center: { lat: 31.2304, lon: 121.4737 },
              description: "中国经济金融中心",
              // 简化的上海市中心区域坐标点
              boundary: [
                [121.2, 31.4],
                [121.6, 31.4],
                [121.6, 31.0],
                [121.2, 31.0],
                [121.2, 31.4],
              ],
            },
          ],
        },
      ],
    },
    {
      id: "usa",
      name: "美国",
      center: { lat: 37.0902, lon: -95.7129 },
      color: "#8b5cf6",
      // 简化的美国边界坐标点
      boundary: [
        [-125.0, 48.0],
        [-125.0, 32.5],
        [-100.0, 32.5],
        [-100.0, 48.0],
        [-125.0, 48.0],
        [-97.0, 49.0],
        [-97.0, 25.0],
        [-80.5, 25.0],
        [-80.5, 49.0],
        [-97.0, 49.0],
      ],
      regions: [
        {
          id: "california",
          name: "加利福尼亚",
          center: { lat: 36.7783, lon: -119.4179 },
          color: "#8b5cf6",
          // 简化的加州边界坐标点
          boundary: [
            [-124.4, 42.0],
            [-124.4, 32.5],
            [-114.1, 32.5],
            [-114.1, 42.0],
            [-124.4, 42.0],
          ],
          cities: [
            {
              id: "san-francisco",
              name: "旧金山",
              center: { lat: 37.7749, lon: -122.4194 },
              description: "美国科技创新中心",
              // 简化的旧金山边界坐标点
              boundary: [
                [-122.5, 37.8],
                [-122.3, 37.8],
                [-122.3, 37.7],
                [-122.5, 37.7],
                [-122.5, 37.8],
              ],
            },
            {
              id: "los-angeles",
              name: "洛杉矶",
              center: { lat: 34.0522, lon: -118.2437 },
              description: "美国娱乐产业中心",
              // 简化的洛杉矶边界坐标点
              boundary: [
                [-118.5, 34.2],
                [-118.0, 34.2],
                [-118.0, 33.8],
                [-118.5, 33.8],
                [-118.5, 34.2],
              ],
            },
          ],
        },
      ],
    },
  ],
}

// 地球组件
function Earth() {
  const earthRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const boundaryRef = useRef<THREE.Group>(null)
  const sunRef = useRef<THREE.DirectionalLight>(null)
  const [hovered, setHovered] = useState(false)
  const [activeLocation, setActiveLocation] = useState(null)
  const [navigationLevel, setNavigationLevel] = useState("country") // country, region, city
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [highlightedBoundary, setHighlightedBoundary] = useState(null)
  const [dayNightCycle, setDayNightCycle] = useState(0) // 0-1 表示一天的周期
  const [autoRotate, setAutoRotate] = useState(true)
  const isMobile = useMobile()
  const { camera, scene } = useThree()
  const { resolvedTheme, setTheme, isAutoMode } = useTheme()
  const isDark = resolvedTheme === "dark"

  // 性能优化：根据设备性能调整细节级别
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

  // 创建白天纹理
  const dayTexture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = isMobile ? 1024 : 2048
    canvas.height = isMobile ? 512 : 1024
    const ctx = canvas.getContext("2d")

    if (ctx) {
      // 海洋背景
      const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      oceanGradient.addColorStop(0, "#0077be")
      oceanGradient.addColorStop(0.5, "#0099cc")
      oceanGradient.addColorStop(1, "#00ace6")
      ctx.fillStyle = oceanGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 添加大陆
      ctx.fillStyle = "#3d8e33"

      // 欧亚大陆
      ctx.beginPath()
      ctx.ellipse(canvas.width * 0.6, canvas.height * 0.4, canvas.width * 0.18, canvas.height * 0.24, 0, 0, Math.PI * 2)
      ctx.fill()

      // 非洲
      ctx.beginPath()
      ctx.ellipse(canvas.width * 0.55, canvas.height * 0.6, canvas.width * 0.1, canvas.height * 0.28, 0, 0, Math.PI * 2)
      ctx.fill()

      // 北美
      ctx.beginPath()
      ctx.ellipse(canvas.width * 0.25, canvas.height * 0.4, canvas.width * 0.12, canvas.height * 0.2, 0, 0, Math.PI * 2)
      ctx.fill()

      // 南美
      ctx.beginPath()
      ctx.ellipse(canvas.width * 0.3, canvas.height * 0.7, canvas.width * 0.07, canvas.height * 0.2, 0, 0, Math.PI * 2)
      ctx.fill()

      // 澳大利亚
      ctx.beginPath()
      ctx.ellipse(canvas.width * 0.8, canvas.height * 0.7, canvas.width * 0.07, canvas.height * 0.1, 0, 0, Math.PI * 2)
      ctx.fill()

      // 添加一些随机小岛
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * (canvas.width * 0.01) + canvas.width * 0.005
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // 添加一些地形细节
      ctx.fillStyle = "#2d7023" // 深绿色，代表山脉
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * (canvas.width * 0.0075) + canvas.width * 0.0025
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // 添加一些沙漠区域
      ctx.fillStyle = "#d2b48c" // 棕褐色，代表沙漠
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * (canvas.width * 0.02) + canvas.width * 0.01
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // 添加一些冰川区域
      ctx.fillStyle = "#f0f8ff" // 淡蓝白色，代表冰川
      // 南极
      ctx.beginPath()
      ctx.ellipse(canvas.width * 0.5, canvas.height * 0.9, canvas.width * 0.15, canvas.height * 0.1, 0, 0, Math.PI * 2)
      ctx.fill()
      // 北极
      ctx.beginPath()
      ctx.ellipse(canvas.width * 0.5, canvas.height * 0.1, canvas.width * 0.15, canvas.height * 0.1, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [isMobile])

  // 创建夜间纹理
  const nightTexture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = isMobile ? 1024 : 2048
    canvas.height = isMobile ? 512 : 1024
    const ctx = canvas.getContext("2d")

    if (ctx) {
      // 黑色背景
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 添加城市灯光
      ctx.fillStyle = "#FFFF99"

      // 北美灯光
      for (let i = 0; i < 100; i++) {
        const x = canvas.width * 0.25 + (Math.random() - 0.5) * (canvas.width * 0.15)
        const y = canvas.height * 0.4 + (Math.random() - 0.5) * (canvas.height * 0.2)
        const size = Math.random() * 2 + 1
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // 欧洲灯光
      for (let i = 0; i < 100; i++) {
        const x = canvas.width * 0.55 + (Math.random() - 0.5) * (canvas.width * 0.1)
        const y = canvas.height * 0.35 + (Math.random() - 0.5) * (canvas.height * 0.15)
        const size = Math.random() * 2 + 1
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // 亚洲灯光
      for (let i = 0; i < 150; i++) {
        const x = canvas.width * 0.7 + (Math.random() - 0.5) * (canvas.width * 0.15)
        const y = canvas.height * 0.4 + (Math.random() - 0.5) * (canvas.height * 0.2)
        const size = Math.random() * 2 + 1
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // 添加一些蓝色调
      ctx.fillStyle = "rgba(0, 30, 60, 0.3)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [isMobile])

  // 创建云层纹理
  const cloudsTexture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = isMobile ? 512 : 1024
    canvas.height = isMobile ? 256 : 512
    const ctx = canvas.getContext("2d")

    if (ctx) {
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 绘制云层
      ctx.fillStyle = "white"
      for (let i = 0; i < (isMobile ? 50 : 100); i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * (canvas.width * 0.06) + canvas.width * 0.02

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // 添加一些云团
      for (let i = 0; i < (isMobile ? 10 : 20); i++) {
        const centerX = Math.random() * canvas.width
        const centerY = Math.random() * canvas.height
        const cloudCount = Math.floor(Math.random() * 5) + 3

        for (let j = 0; j < cloudCount; j++) {
          const offsetX = (Math.random() - 0.5) * (canvas.width * 0.1)
          const offsetY = (Math.random() - 0.5) * (canvas.height * 0.05)
          const radius = Math.random() * (canvas.width * 0.04) + canvas.width * 0.03

          ctx.beginPath()
          ctx.arc(centerX + offsetX, centerY + offsetY, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [isMobile])

  // 创建法线贴图
  const earthNormalMap = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = isMobile ? 256 : 512
    canvas.height = isMobile ? 128 : 256
    const ctx = canvas.getContext("2d")

    if (ctx) {
      // 创建一个简化的法线贴图
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const nx = 128 + Math.sin(x / 15) * 10 * Math.cos(y / 15)
          const ny = 128 + Math.sin(y / 15) * 10
          const nz = 255

          ctx.fillStyle = `rgb(${nx}, ${ny}, ${nz})`
          ctx.fillRect(x, y, 1, 1)
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [isMobile])

  // 材质
  const earthMaterial = useMemo(() => {
    const material = new THREE.MeshPhysicalMaterial({
      map: dayTexture,
      normalMap: earthNormalMap,
      metalness: 0.1,
      roughness: 0.7,
      clearcoat: 0.2,
      clearcoatRoughness: 0.4,
    })

    // 添加夜间纹理
    material.userData = { dayTexture, nightTexture }

    return material
  }, [dayTexture, nightTexture, earthNormalMap])

  // 云层材质
  const cloudsMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.4,
      alphaTest: 0.1,
      blending: THREE.AdditiveBlending,
    })
  }, [cloudsTexture])

  // 大气层材质
  const atmosphereMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isDark ? "#7dd3fc" : "#a5f3fc",
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
    })
  }, [isDark])

  // 获取当前显示的位置数据
  const locationData = useMemo(() => {
    if (navigationLevel === "country") {
      return geoData.countries
    } else if (navigationLevel === "region" && selectedCountry) {
      const country = geoData.countries.find((c) => c.id === selectedCountry)
      return country ? country.regions : []
    } else if (navigationLevel === "city" && selectedRegion) {
      const country = geoData.countries.find((c) => c.id === selectedCountry)
      if (country) {
        const region = country.regions.find((r) => r.id === selectedRegion)
        return region ? region.cities : []
      }
    }
    return []
  }, [navigationLevel, selectedCountry, selectedRegion])

  // 获取当前边界数据
  const boundaryData = useMemo(() => {
    if (navigationLevel === "country") {
      return null // 国家级别不显示边界
    } else if (navigationLevel === "region" && selectedCountry) {
      const country = geoData.countries.find((c) => c.id === selectedCountry)
      return country ? country.boundary : null
    } else if (navigationLevel === "city" && selectedRegion) {
      const country = geoData.countries.find((c) => c.id === selectedCountry)
      if (country) {
        const region = country.regions.find((r) => r.id === selectedRegion)
        return region ? region.boundary : null
      }
    }
    return null
  }, [navigationLevel, selectedCountry, selectedRegion])

  // 创建边界线
  useEffect(() => {
    if (boundaryRef.current) {
      // 清除旧的边界线
      while (boundaryRef.current.children.length > 0) {
        boundaryRef.current.remove(boundaryRef.current.children[0])
      }

      // 如果有高亮的边界，创建新的边界线
      if (highlightedBoundary) {
        const points = highlightedBoundary.map((coord) => {
          const [lon, lat] = coord
          return new THREE.Vector3(...latLongToVector3(lat, lon, 5.05))
        })

        // 闭合路径
        if (points.length > 0) {
          points.push(points[0].clone())
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const material = new THREE.LineBasicMaterial({
          color: navigationLevel === "region" ? "#f43f5e" : navigationLevel === "city" ? "#8b5cf6" : "#10b981",
          linewidth: 2,
          transparent: true,
          opacity: 0.8,
        })

        const line = new THREE.Line(geometry, material)
        boundaryRef.current.add(line)

        // 添加填充区域 - 简化处理，不创建实际的填充，只添加一个半透明平面
        const fillMaterial = new THREE.MeshBasicMaterial({
          color: navigationLevel === "region" ? "#f43f5e" : navigationLevel === "city" ? "#8b5cf6" : "#10b981",
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide,
        })

        // 简单地使用线条的几何体创建一个平面
        const fillMesh = new THREE.Mesh(geometry, fillMaterial)
        boundaryRef.current.add(fillMesh)
      }
    }
  }, [highlightedBoundary, navigationLevel])

  // 昼夜循环效果
  useEffect(() => {
    // 每10分钟完成一个昼夜循环
    const interval = setInterval(() => {
      if (autoRotate) {
        setDayNightCycle((prev) => (prev + 0.001) % 1)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [autoRotate])

  // 根据昼夜循环自动切换主题
  useEffect(() => {
    if (isAutoMode) {
      // 当地球显示夜间部分时切换到暗色模式，白天部分切换到亮色模式
      const isDaytime = dayNightCycle < 0.5
      setTheme(isDaytime ? "light" : "dark")
    }
  }, [dayNightCycle, isAutoMode, setTheme])

  // 动画
  useFrame((state) => {
    if (earthRef.current) {
      // 如果启用自动旋转，地球会缓慢自转
      if (autoRotate && !activeLocation) {
        earthRef.current.rotation.y += 0.001
      }

      // 昼夜循环 - 更新材质
      if (earthRef.current.material instanceof THREE.MeshPhysicalMaterial) {
        const material = earthRef.current.material
        const { dayTexture, nightTexture } = material.userData

        // 计算混合因子 - 使用余弦函数创建平滑过渡
        const blendFactor = (Math.cos(dayNightCycle * Math.PI * 2) + 1) / 2

        // 创建混合纹理
        if (!material._blendTexture) {
          material._blendTexture = dayTexture.clone()
        }

        // 更新纹理
        material.map = blendFactor > 0.5 ? dayTexture : nightTexture
      }

      // 添加轻微的摇摆效果
      earthRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.02
    }

    // 更新太阳位置
    if (sunRef.current) {
      // 太阳围绕地球旋转
      const angle = dayNightCycle * Math.PI * 2
      sunRef.current.position.x = Math.cos(angle) * 20
      sunRef.current.position.z = Math.sin(angle) * 20
    }

    // 云层旋转 - 比地球稍快
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0005
    }

    // 大气层呼吸效果
    if (atmosphereRef.current) {
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.01
      atmosphereRef.current.scale.set(scale, scale, scale)
    }

    // 边界线跟随地球旋转
    if (boundaryRef.current && earthRef.current) {
      boundaryRef.current.rotation.y = earthRef.current.rotation.y
      boundaryRef.current.rotation.x = earthRef.current.rotation.x
    }
  })

  // 处理位置点击
  const handleLocationClick = (location) => {
    setActiveLocation(location)
    setAutoRotate(false) // 停止自动旋转

    // 根据当前导航级别决定行为
    if (navigationLevel === "country") {
      setSelectedCountry(location.id)
      setNavigationLevel("region")

      // 设置高亮边界
      const country = geoData.countries.find((c) => c.id === location.id)
      setHighlightedBoundary(country.boundary)
    } else if (navigationLevel === "region") {
      setSelectedRegion(location.id)
      setNavigationLevel("city")

      // 设置高亮边界
      const country = geoData.countries.find((c) => c.id === selectedCountry)
      const region = country.regions.find((r) => r.id === location.id)
      setHighlightedBoundary(region.boundary)
    } else {
      // 城市级别，显示详情但不再下钻
      const country = geoData.countries.find((c) => c.id === selectedCountry)
      const region = country.regions.find((r) => r.id === selectedRegion)
      const city = region.cities.find((c) => c.id === location.id)
      setHighlightedBoundary(city.boundary)
    }

    // 相机动画移动到选中位置
    const targetPosition = new THREE.Vector3(...latLongToVector3(location.center.lat, location.center.lon, 5.2))
    animateCameraToPosition(camera, targetPosition, navigationLevel === "city" ? 8 : 12)
  }

  // 返回上一级
  const handleBack = () => {
    if (navigationLevel === "region") {
      setNavigationLevel("country")
      setSelectedCountry(null)
      setHighlightedBoundary(null)
      resetCamera()
    } else if (navigationLevel === "city") {
      setNavigationLevel("region")
      setSelectedRegion(null)

      // 返回到地区视图
      const country = geoData.countries.find((c) => c.id === selectedCountry)
      if (country) {
        setHighlightedBoundary(country.boundary)
        const targetPosition = new THREE.Vector3(...latLongToVector3(country.center.lat, country.center.lon, 5.2))
        animateCameraToPosition(camera, targetPosition, 12)
      }
    }
  }

  // 重置相机位置
  const resetCamera = () => {
    setAutoRotate(true)
    animateCameraToPosition(camera, new THREE.Vector3(0, 0, 15), 15)
  }

  // 相机动画
  const animateCameraToPosition = (camera, targetPosition, distance) => {
    const normalizedPosition = targetPosition.clone().normalize().multiplyScalar(distance)
    const currentPos = camera.position.clone()
    const duration = 1.5 // 动画持续时间（秒）
    const startTime = Date.now()

    const animateCamera = () => {
      const elapsed = (Date.now() - startTime) / 1000
      const t = Math.min(elapsed / duration, 1)
      const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t // easeInOutQuad

      camera.position.lerpVectors(currentPos, normalizedPosition, easeT)
      camera.lookAt(0, 0, 0)

      if (t < 1) {
        requestAnimationFrame(animateCamera)
      }
    }

    animateCamera()
  }

  // 切换自动旋转
  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate)
  }

  return (
    <>
      {/* 环境光 */}
      <ambientLight intensity={0.5} />

      {/* 太阳光源 */}
      <directionalLight ref={sunRef} position={[20, 0, 0]} intensity={1.5} castShadow />

      {/* 辅助光源 */}
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#7dd3fc" />

      {/* 地球 */}
      <mesh ref={earthRef} castShadow receiveShadow>
        <sphereGeometry args={[5, detailLevel.earthSegments, detailLevel.earthSegments]} />
        <primitive object={earthMaterial} attach="material" />
      </mesh>

      {/* 云层 */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[5.1, detailLevel.cloudSegments, detailLevel.cloudSegments]} />
        <primitive object={cloudsMaterial} attach="material" />
      </mesh>

      {/* 大气层 */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[5.3, detailLevel.atmosphereSegments, detailLevel.atmosphereSegments]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      {/* 边界线组 */}
      <group ref={boundaryRef} />

      {/* 位置标记 */}
      <group>
        {locationData.map((location, index) => (
          <group
            key={location.id}
            position={latLongToVector3(location.center.lat, location.center.lon, 5.2)}
            onClick={() => handleLocationClick(location)}
          >
            {/* 标记点 */}
            <mesh
              userData={{ isMarker: true }}
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
            >
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial color={location.color} />
            </mesh>

            {/* 标记文本 */}
            <Html
              position={[0, 0.5, 0]}
              center
              distanceFactor={isMobile ? 15 : 10}
              className="pointer-events-none"
              occlude={[earthRef]}
            >
              <div
                className={`glass-effect px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
                  activeLocation?.id === location.id ? "scale-110 font-bold" : "animate-pulse-soft"
                }`}
              >
                {location.name}
              </div>
            </Html>

            {/* 脉冲效果 */}
            <mesh>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshBasicMaterial color={location.color} transparent opacity={0.3} />
            </mesh>

            {/* 活跃标记的额外效果 */}
            {activeLocation?.id === location.id && (
              <>
                {/* 信息面板 */}
                <Html
                  position={[0, 1.2, 0]}
                  center
                  distanceFactor={isMobile ? 10 : 8}
                  className="pointer-events-none"
                  occlude={[earthRef]}
                >
                  <div className="glass-effect p-4 rounded-lg w-64 shadow-lg">
                    <h3 className="font-bold text-gradient mb-1">{location.name}</h3>
                    {navigationLevel === "city" && location.description && (
                      <p className="text-xs text-muted-foreground mt-2">{location.description}</p>
                    )}
                    <div className="mt-3 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                  </div>
                </Html>
              </>
            )}
          </group>
        ))}
      </group>

      {/* 导航控制 */}
      <Html position={[0, 0, 0]} center fullscreen>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {navigationLevel !== "country" && (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-background/80 backdrop-blur-sm border border-primary/20 rounded-full text-sm font-medium hover:bg-primary/10 transition-colors"
            >
              返回{navigationLevel === "region" ? "国家" : "地区"}视图
            </button>
          )}
          <button
            onClick={resetCamera}
            className="px-4 py-2 bg-background/80 backdrop-blur-sm border border-primary/20 rounded-full text-sm font-medium hover:bg-primary/10 transition-colors"
          >
            重置视图
          </button>
          <button
            onClick={toggleAutoRotate}
            className="px-4 py-2 bg-background/80 backdrop-blur-sm border border-primary/20 rounded-full text-sm font-medium hover:bg-primary/10 transition-colors"
          >
            {autoRotate ? "停止旋转" : "开始旋转"}
          </button>
        </div>
      </Html>

      {/* 轨道环 */}
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[5.5, 5.6, 32]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* 第二轨道环 */}
      <mesh rotation-x={Math.PI / 3}>
        <ringGeometry args={[6, 6.05, 32]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* 星空背景 - 减少星星数量以提高性能 */}
      <Stars
        radius={100}
        depth={50}
        count={isMobile ? 1000 : 3000}
        factor={4}
        saturation={isDark ? 0 : 1}
        fade
        speed={1}
        color={isDark ? "#ffffff" : "#0c4a6e"}
      />

      {/* 后期处理效果 - 移动设备上禁用以提高性能 */}
      {!isMobile && (
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
          <ChromaticAberration offset={[0.0005, 0.0005]} />
        </EffectComposer>
      )}
    </>
  )
}

// 经纬度转换为3D坐标
function latLongToVector3(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  const x = -radius * Math.sin(phi) * Math.cos(theta)
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)

  return [x, y, z]
}

export default function Earth3D() {
  const [loaded, setLoaded] = useState(false)
  const [textures, setTextures] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    // 简单延迟以模拟加载
    setTimeout(() => {
      setTextures(true)
      setTimeout(() => setLoaded(true), 500)
    }, 1000)
  }, [])

  return (
    <div className="w-full h-full relative">
      {!textures && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载地球资源中...</p>
          </div>
        </div>
      )}

      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <Earth />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
          minDistance={8}
          maxDistance={20}
          autoRotate={!loaded}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
