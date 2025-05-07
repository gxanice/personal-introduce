"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Text, useTexture, Html, Billboard, OrbitControls } from "@react-three/drei"
import { useTheme } from "next-themes"
import * as THREE from "three"

// 项目数据
const projects = [
  {
    title: "3D互动产品展示",
    description: "使用Three.js和React开发的3D产品展示平台，支持产品360°旋转、缩放和自定义材质。",
    image: "/placeholder.svg?height=400&width=600",
    position: [-2.5, 0, 0],
    rotation: [0, Math.PI / 12, 0],
  },
  {
    title: "创意作品集网站",
    description: "为设计师打造的作品集网站，使用Canvas实现动态背景和交互效果，支持响应式设计。",
    image: "/placeholder.svg?height=400&width=600",
    position: [0, 0, -1],
    rotation: [0, 0, 0],
  },
  {
    title: "AI辅助设计工具",
    description: "结合AI技术的Web设计工具，可根据用户输入生成设计方案，并提供实时编辑功能。",
    image: "/placeholder.svg?height=400&width=600",
    position: [2.5, 0, 0],
    rotation: [0, -Math.PI / 12, 0],
  },
]

function ProjectCard({ project, index, activeIndex, setActiveIndex }: { project: any, index: number, activeIndex: number | null, setActiveIndex: (index: number | null) => void }) {
  const { title, description, image, position, rotation } = project
  const meshRef = useRef<THREE.Mesh>(null)
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme === "dark"
  const isActive = index === activeIndex
  const { viewport } = useThree()

  // 创建纹理
  const texture = useTexture(image)

  // 动画 - 简化，避免异常缩放
  useFrame((state) => {
    if (meshRef.current) {
      // 悬浮动画 - 只做简单的上下移动
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5 + index) * 0.1

      // 活跃项目的额外动画
      if (isActive) {
        meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
      }
    }
  })

  // 计算移动设备上的缩放
  const isMobile = viewport.width < 5
  const scale = isMobile ? 0.6 : 1

  return (
    <group
      position={[position[0] * (isMobile ? 0.6 : 1), position[1], position[2]]}
      rotation={rotation}
      scale={[scale, scale, scale]}
    >
      <mesh
        ref={meshRef}
        onClick={() => setActiveIndex(isActive ? null : index)}
        onPointerOver={() => !isActive && setActiveIndex(index)}
      >
        <planeGeometry args={[2, 1.2]} />
        <meshStandardMaterial
          map={texture as THREE.Texture}
          emissive={isDarkTheme ? "#14b8a6" : "#0891b2"}
          emissiveIntensity={isActive ? 0.2 : 0}
          metalness={0.5}
          roughness={0.5}
        />

        {/* 项目信息 - 使用Billboard确保文字始终面向相机 */}
        <Billboard follow={true} position={[0, -0.8, 0.1]}>
          <Html
            center
            distanceFactor={5}
            className={`transition-all duration-300 ${isActive ? "scale-110" : "scale-100"}`}
            transform
          >
            <div className={`glass-effect p-3 rounded-lg w-48 ${isActive ? "border-primary" : "border-transparent"}`}>
              <h3 className="font-bold text-gradient text-sm mb-1">{title}</h3>
              {isActive && <p className="text-xs text-muted-foreground line-clamp-3">{description}</p>}
            </div>
          </Html>
        </Billboard>

        {/* 活跃项目的高亮边框 */}
        {isActive && (
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[2.1, 1.3]} />
            <meshBasicMaterial
              color={isDarkTheme ? "#14b8a6" : "#0891b2"}
              transparent
              opacity={0.3}
              side={THREE.BackSide}
            />
          </mesh>
        )}
      </mesh>
    </group>
  )
}

function Scene() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme === "dark"

  return (
    <>
      {/* 地面反射 */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.5, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color={isDarkTheme ? "#050505" : "#f5f5f5"} metalness={0.5} />
      </mesh>

      {/* 项目展示 */}
      {projects.map((project, index) => (
        <ProjectCard
          key={index}
          project={project}
          index={index}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      ))}

      {/* 标题 - 使用Billboard确保文字始终面向相机 */}
      <Billboard follow={true} position={[0, 1.5, 0]}>
        <Text
          fontSize={0.5}
          font="/fonts/"
          color={isDarkTheme ? "#14b8a6" : "#0891b2"}
          anchorX="center"
          anchorY="middle"
        >
          精选项目
        </Text>
      </Billboard>

      {/* 灯光 */}
      <ambientLight intensity={0.5} />
      <spotLight position={[0, 5, 5]} intensity={0.8} angle={0.3} penumbra={1} castShadow />
      <pointLight position={[-5, 0, -5]} intensity={0.5} color="#a855f7" />
      <pointLight position={[5, 0, -5]} intensity={0.5} color="#14b8a6" />
    </>
  )
}

export default function ProjectsShowcase() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Scene />
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
