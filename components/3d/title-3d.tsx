"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, Center, Float, Billboard } from "@react-three/drei"
import { useMobile } from "@/hooks/use-mobile"
import { useTheme } from "next-themes"
import type * as THREE from "three"

function Title() {
  const textRef = useRef<THREE.Mesh>(null)
  const trailRef = useRef<THREE.Group>(null)
  const isMobile = useMobile()
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme === "dark"
  const [hovered, setHovered] = useState(false)

  // 动态光影效果
  useFrame((state) => {
    if (textRef.current) {
      // 基础动画
      textRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1
      textRef.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.3) * 0.05

      // 添加呼吸效果
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.03
      textRef.current.scale.set(scale, scale, scale)

      // 悬停效果 - 简化，避免异常缩放
      if (hovered) {
        textRef.current.rotation.y += Math.sin(state.clock.getElapsedTime()) * 0.01
      }
    }

    // 轨迹动画
    if (trailRef.current) {
      trailRef.current.rotation.z = state.clock.getElapsedTime() * 0.2
      trailRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
    }
  })

  return (
    <Center>
      <Float
        speed={2} // 动画速度
        rotationIntensity={0.2} // 旋转强度
        floatIntensity={0.5} // 浮动强度
      >
        {/* 使用Billboard确保文字始终面向相机 */}
        <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
          <Text
            ref={textRef}
            fontSize={isMobile ? 0.8 : 1.2}
            letterSpacing={0.05}
            lineHeight={1.2}
            material-toneMapped={false}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={() => setHovered(!hovered)}
          >
            个人作品集
            <meshStandardMaterial
              color={isDarkTheme ? "#14b8a6" : "#0891b2"}
              emissive={isDarkTheme ? "#14b8a6" : "#0891b2"}
              emissiveIntensity={hovered ? 1 : 0.5}
              metalness={0.7}
              roughness={0.3}
            />
          </Text>
        </Billboard>
      </Float>

      {/* 装饰性元素 */}
      <group ref={trailRef}>
        <mesh position={[1.5, 0, 0]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color={isDarkTheme ? "#a855f7" : "#6b21a8"} />
        </mesh>

        <mesh position={[-1.5, 0, 0]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color={isDarkTheme ? "#14b8a6" : "#0f766e"} />
        </mesh>
      </group>
    </Center>
  )
}

export default function Title3D() {
  return (
    <div className="w-full h-20">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -5]} color="#a855f7" intensity={0.5} />
        <Title />
      </Canvas>
    </div>
  )
}
