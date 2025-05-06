"use client"

import { useRef, useMemo } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { useTheme } from "next-themes"
import { useFrame, Canvas } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"

// 创建粒子系统
function createParticleSystem(count, size) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    // 随机位置
    positions[i * 3] = (Math.random() - 0.5) * 50
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5

    // 随机大小
    sizes[i] = Math.random() * size
  }

  return { positions, colors, sizes }
}

function ParticleField({ isDarkMode, isMobile }) {
  const pointsRef = useRef()
  const lineRef = useRef()

  // 根据主题和设备生成粒子
  const particles = useMemo(() => {
    const count = isMobile ? 100 : 200
    const size = isMobile ? 0.5 : 0.3
    return createParticleSystem(count, size)
  }, [isMobile])

  // 生成连线几何体
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particles.positions.length * 2)
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [particles])

  // 更新粒子和连线
  useFrame((state) => {
    if (!pointsRef.current) return

    const time = state.clock.getElapsedTime()
    const positions = pointsRef.current.geometry.attributes.position.array

    // 更新粒子位置 - 波浪效果
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(time * 0.2 + positions[i] * 0.05) * 0.01
      positions[i] += Math.sin(time * 0.1 + positions[i + 1] * 0.05) * 0.01
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // 更新连线
    if (lineRef.current) {
      const linePositions = lineRef.current.geometry.attributes.position.array
      let lineIndex = 0

      // 清空之前的连线
      for (let i = 0; i < linePositions.length; i++) {
        linePositions[i] = 0
      }

      // 创建新的连线 - 只连接距离较近的点
      for (let i = 0; i < positions.length; i += 3) {
        for (let j = i + 3; j < positions.length; j += 3) {
          const x1 = positions[i]
          const y1 = positions[i + 1]
          const z1 = positions[i + 2]

          const x2 = positions[j]
          const y2 = positions[j + 1]
          const z2 = positions[j + 2]

          const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2))

          // 只连接距离较近的点
          if (distance < (isMobile ? 10 : 8) && lineIndex < linePositions.length - 6) {
            linePositions[lineIndex++] = x1
            linePositions[lineIndex++] = y1
            linePositions[lineIndex++] = z1

            linePositions[lineIndex++] = x2
            linePositions[lineIndex++] = y2
            linePositions[lineIndex++] = z2
          }
        }
      }

      lineRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  // 设置颜色
  const pointColor = isDarkMode ? "#7dd3fc" : "#0e7490"
  const lineColor = isDarkMode ? "#7dd3fc" : "#0e7490"

  return (
    <>
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particles.sizes.length}
            array={particles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <PointMaterial
          size={isMobile ? 0.5 : 0.3}
          color={pointColor}
          transparent
          opacity={0.8}
          depthWrite={false}
          sizeAttenuation
        />
      </Points>

      <lineSegments ref={lineRef}>
        <bufferGeometry attach="geometry" {...lineGeometry} />
        <lineBasicMaterial attach="material" color={lineColor} transparent opacity={0.2} depthWrite={false} />
      </lineSegments>
    </>
  )
}

export default function OptimizedBackground() {
  const isMobile = useMobile()
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-60">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        dpr={[1, isMobile ? 1.5 : 2]} // 根据设备调整分辨率
        performance={{ min: 0.5 }} // 性能优化
      >
        <ParticleField isDarkMode={isDarkMode} isMobile={isMobile} />
      </Canvas>
    </div>
  )
}
