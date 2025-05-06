"use client"

import { useRef, useState, useMemo, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Text, OrbitControls, Html, Billboard } from "@react-three/drei"
import { useTheme } from "next-themes"
import * as THREE from "three"

// 技能数据
const skills = [
  { name: "React", level: 0.95, group: "前端", color: "#61dafb" },
  { name: "Three.js", level: 0.85, group: "创意", color: "#049ef4" },
  { name: "TypeScript", level: 0.9, group: "前端", color: "#3178c6" },
  { name: "WebGL", level: 0.8, group: "创意", color: "#990000" },
  { name: "Next.js", level: 0.9, group: "前端", color: "#000000" },
  { name: "Tailwind", level: 0.85, group: "前端", color: "#38bdf8" },
  { name: "GLSL", level: 0.75, group: "创意", color: "#5586a4" },
  { name: "Figma", level: 0.8, group: "设计", color: "#f24e1e" },
  { name: "UI/UX", level: 0.85, group: "设计", color: "#ff7262" },
  { name: "Node.js", level: 0.75, group: "后端", color: "#539e43" },
]

// 创建粒子系统
function createParticleSystem(count, radius, isDark) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const angles = new Float32Array(count)
  const orbital = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    // 随机角度和半径
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * (0.6 + Math.random() * 0.4)

    // 转换为笛卡尔坐标
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    // 随机颜色 - 根据主题调整
    if (isDark) {
      // 暗色模式下使用亮色粒子
      colors[i * 3] = 0.5 + Math.random() * 0.5 // R
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.5 // G
      colors[i * 3 + 2] = 0.5 + Math.random() * 0.5 // B
    } else {
      // 浅色模式下使用深色粒子
      colors[i * 3] = 0.1 + Math.random() * 0.3 // R - 低红色
      colors[i * 3 + 1] = 0.2 + Math.random() * 0.3 // G - 低绿色
      colors[i * 3 + 2] = 0.5 + Math.random() * 0.3 // B - 较高蓝色，创建深蓝色
    }

    // 随机大小
    sizes[i] = 0.1 + Math.random() * 0.5

    // 随机轨道角度和速度
    angles[i] = Math.random() * Math.PI * 2
    orbital[i] = 0.2 + Math.random() * 0.8
  }

  return { positions, colors, sizes, angles, orbital }
}

// 重置相机控制器
function ResetCameraButton() {
  const { camera } = useThree()
  const controlsRef = useRef()

  const resetCamera = useCallback(() => {
    camera.position.set(0, 0, 15)
    camera.lookAt(0, 0, 0)
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }, [camera])

  return (
    <Html position={[0, 0, 0]} center fullscreen>
      <button
        onClick={resetCamera}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-background/80 backdrop-blur-sm border border-primary/20 rounded-full text-sm font-medium hover:bg-primary/10 transition-colors"
      >
        重置视角
      </button>
    </Html>
  )
}

function PlanetarySkillsSystem() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [activeSkill, setActiveSkill] = useState<number | null>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const skillsRef = useRef<THREE.Group>(null)
  const orbitLinesRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  // 创建背景粒子
  const particles = useMemo(() => createParticleSystem(500, 15, isDark), [isDark])

  // 为技能创建轨道数据
  const skillOrbits = useMemo(() => {
    return skills.map((skill, i) => {
      // 计算轨道参数
      const orbitRadius = 3 + i * 0.5 // 逐渐增加轨道半径
      const orbitTilt = Math.random() * Math.PI * 0.5 // 随机轨道倾角
      const orbitPhase = Math.random() * Math.PI * 2 // 随机初始相位
      const orbitSpeed = 0.1 + Math.random() * 0.2 // 随机轨道速度
      const orbitEccentricity = 0.1 + Math.random() * 0.3 // 随机轨道偏心率

      return {
        ...skill,
        orbitRadius,
        orbitTilt,
        orbitPhase,
        orbitSpeed,
        orbitEccentricity,
        position: new THREE.Vector3(),
      }
    })
  }, [])

  // 动画
  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // 更新背景粒子
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.02
      particlesRef.current.rotation.x = Math.sin(time * 0.01) * 0.1

      // 更新粒子位置 - 创造流动效果
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const angles = particles.angles
      const orbital = particles.orbital

      for (let i = 0; i < positions.length / 3; i++) {
        // 更新角度
        angles[i] += 0.001 * orbital[i]

        // 计算新位置
        const r = 15 * (0.6 + Math.sin(time * 0.1 + i) * 0.1)
        const theta = angles[i]
        const phi = Math.acos(Math.cos(time * 0.1 + i * 0.01) * 0.5)

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
        positions[i * 3 + 2] = r * Math.cos(phi)
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }

    // 更新技能轨道和位置
    if (skillsRef.current) {
      skillOrbits.forEach((skill, i) => {
        const child = skillsRef.current?.children[i]
        if (child) {
          // 计算开普勒轨道位置
          const a = skill.orbitRadius
          const e = skill.orbitEccentricity
          const angle = time * skill.orbitSpeed + skill.orbitPhase

          // 椭圆轨道方程
          const r = (a * (1 - e * e)) / (1 + e * Math.cos(angle))

          // 应用轨道倾角
          const x = r * Math.cos(angle)
          const z = r * Math.sin(angle) * Math.cos(skill.orbitTilt)
          const y = r * Math.sin(angle) * Math.sin(skill.orbitTilt)

          // 更新位置
          child.position.set(x, y, z)

          // 保存位置用于轨道线更新
          skill.position.set(x, y, z)
        }
      })
    }

    // 更新轨道线
    if (orbitLinesRef.current) {
      orbitLinesRef.current.rotation.y = time * 0.01
      orbitLinesRef.current.rotation.x = Math.sin(time * 0.1) * 0.1
    }
  })

  // 创建轨道线
  const orbitLines = useMemo(() => {
    return skillOrbits.map((skill, i) => {
      const curve = new THREE.EllipseCurve(
        0,
        0, // 中心点
        skill.orbitRadius,
        skill.orbitRadius, // x半径，y半径
        0,
        2 * Math.PI, // 起始角度，结束角度
        false, // 顺时针
        0, // 旋转
      )

      const points = curve.getPoints(100)
      const geometry = new THREE.BufferGeometry().setFromPoints(points)

      // 将点转换为3D空间中的点，应用轨道倾角
      const positions = geometry.attributes.position.array
      for (let j = 0; j < points.length; j++) {
        const x = positions[j * 3]
        const z = positions[j * 3 + 1] * Math.cos(skill.orbitTilt)
        const y = positions[j * 3 + 1] * Math.sin(skill.orbitTilt)

        positions[j * 3] = x
        positions[j * 3 + 1] = y
        positions[j * 3 + 2] = z
      }

      return (
        <line key={i}>
          <bufferGeometry attach="geometry" {...geometry} />
          <lineBasicMaterial attach="material" color={skill.color} transparent opacity={0.3} linewidth={1} />
        </line>
      )
    })
  }, [skillOrbits])

  // 处理技能点击
  const handleSkillClick = (index) => {
    setActiveSkill(activeSkill === index ? null : index)
    // 不要在点击时改变相机位置，避免视角问题
  }

  return (
    <>
      {/* 中心"太阳" */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={isDark ? "#14b8a6" : "#0891b2"}
          emissive={isDark ? "#14b8a6" : "#0891b2"}
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>

      {/* 发光光环 */}
      <mesh>
        <ringGeometry args={[1.2, 2, 32]} />
        <meshBasicMaterial color={isDark ? "#14b8a6" : "#0891b2"} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* 轨道线 */}
      <group ref={orbitLinesRef}>{orbitLines}</group>

      {/* 技能"行星" */}
      <group ref={skillsRef}>
        {skillOrbits.map((skill, i) => (
          <group key={i} onClick={() => handleSkillClick(i)}>
            {/* 行星 */}
            <mesh>
              <sphereGeometry args={[0.3 + skill.level * 0.3, 16, 16]} />
              <meshStandardMaterial
                color={skill.color}
                emissive={skill.color}
                emissiveIntensity={activeSkill === i ? 1 : 0.5}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>

            {/* 使用Billboard组件确保文字始终面向相机 */}
            <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
              {/* 技能名称 */}
              <Text
                position={[0, 0.8, 0]}
                fontSize={0.3}
                color={activeSkill === i ? "#ffffff" : skill.color}
                anchorX="center"
                anchorY="middle"
                font="/fonts/Inter-Bold.ttf"
              >
                {skill.name}
              </Text>

              {/* 技能等级 */}
              {activeSkill === i && (
                <Text
                  position={[0, 1.2, 0]}
                  fontSize={0.2}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                  font="/fonts/Inter-Regular.ttf"
                >
                  {`${skill.level * 100}%`}
                </Text>
              )}
            </Billboard>

            {/* 轨道尾迹 */}
            <mesh>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial color={skill.color} transparent opacity={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 背景粒子 */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particles.sizes.length}
            array={particles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial size={0.1} vertexColors transparent opacity={isDark ? 0.8 : 0.9} sizeAttenuation />
      </points>

      {/* 灯光 */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={1} color="#ffffff" />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#14b8a6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />

      {/* 重置相机按钮 */}
      <ResetCameraButton />
    </>
  )
}

export default function SkillsVisualization3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <PlanetarySkillsSystem />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
          minDistance={8} // 限制最小距离，防止过度缩放
          maxDistance={25} // 限制最大距离
          maxPolarAngle={Math.PI * 0.8} // 限制垂直旋转角度
          minPolarAngle={Math.PI * 0.2} // 限制垂直旋转角度
        />
      </Canvas>
    </div>
  )
}
