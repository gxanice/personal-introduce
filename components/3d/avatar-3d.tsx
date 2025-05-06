"use client"

import { useRef, useMemo, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial, OrbitControls, Billboard } from "@react-three/drei"
import * as THREE from "three"
import type { AdditiveBlending } from "three"
import { useTheme } from "next-themes"

function PointCloud() {
  const ref = useRef<THREE.Points>(null)
  const trailRef = useRef<THREE.Group>(null)
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme === "dark"
  const [hovered, setHovered] = useState(false)

  // 创建点云数据 - 使用更柔和的颜色
  const points = useMemo(() => {
    // 创建一个简单的头像形状的点云
    const count = 5000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    // 创建一个球形的点云，模拟头部形状
    for (let i = 0; i < count; i++) {
      // 球坐标
      const radius = 2.5 + Math.random() * 0.2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      // 转换为笛卡尔坐标
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta) + 0.5 // 稍微上移
      const z = radius * Math.cos(phi)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // 渐变颜色 - 使用更明显的对比色
      const colorIndex = Math.random() // 定义 colorIndex 变量
      if (isDarkTheme) {
        // 暗色模式下使用亮色粒子
        colors[i * 3] = 0.2 + colorIndex * 0.5 // R - 更柔和的红色
        colors[i * 3 + 1] = 0.7 + colorIndex * 0.3 // G - 更多的绿色
        colors[i * 3 + 2] = 0.8 - colorIndex * 0.2 // B - 保持蓝色
      } else {
        // 浅色模式下使用深色粒子
        colors[i * 3] = 0.1 + colorIndex * 0.2 // R - 低红色
        colors[i * 3 + 1] = 0.3 + colorIndex * 0.2 // G - 中等绿色
        colors[i * 3 + 2] = 0.6 + colorIndex * 0.2 // B - 较高蓝色，创建深蓝色/深青色
      }
    }

    return { positions, colors }
  }, [isDarkTheme])

  // 更丰富的动画
  useFrame((state) => {
    if (ref.current) {
      // 基础旋转
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.1

      // 呼吸效果
      const breathScale = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05
      ref.current.scale.x = breathScale
      ref.current.scale.y = breathScale
      ref.current.scale.z = breathScale

      // 轻微摇摆
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05
      ref.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.2) * 0.03

      // 悬停时的额外效果 - 移除可能导致异常缩放的代码
      if (hovered && ref.current.geometry.attributes.position) {
        ref.current.rotation.y += 0.01
        // 移除粒子扩散效果，避免异常缩放
      }
    }

    // 轨迹动画
    if (trailRef.current) {
      trailRef.current.rotation.y = state.clock.getElapsedTime() * 0.2
      trailRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2
    }
  })

  return (
    <>
      <Points
        ref={ref}
        positions={points.positions}
        colors={points.colors}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <PointMaterial
          vertexColors
          size={0.05}
          sizeAttenuation
          transparent
          depthWrite={false}
          opacity={isDarkTheme ? 0.8 : 1} // 浅色模式下提高不透明度
          blending={THREE.AdditiveBlending as AdditiveBlending}
        />
      </Points>

      {/* 技能标签 - 使用Billboard确保始终面向相机 */}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false} position={[0, -2.5, 0]}>
        <mesh>
          <planeGeometry args={[3, 0.5]} />
          <meshBasicMaterial color={isDarkTheme ? "#14b8a6" : "#0891b2"} transparent opacity={0.2} />
        </mesh>
      </Billboard>
    </>
  )
}

export default function Avatar3D() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#14b8a6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
        <PointCloud />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          minPolarAngle={Math.PI * 0.3} // 限制垂直旋转角度
          maxPolarAngle={Math.PI * 0.7} // 限制垂直旋转角度
        />
      </Canvas>
    </div>
  )
}
