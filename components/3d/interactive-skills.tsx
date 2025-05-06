"use client"

import { useRef, useState, useMemo, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Text, OrbitControls, Html, Billboard } from "@react-three/drei"
import { useTheme } from "next-themes"
import * as THREE from "three"
import { useMobile } from "@/hooks/use-mobile"
import { motion } from "framer-motion"

// 技能数据
const skills = [
  { name: "React", level: 0.95, group: "前端", color: "#61dafb", icon: "⚛️" },
  { name: "Three.js", level: 0.85, group: "创意", color: "#049ef4", icon: "🌐" },
  { name: "TypeScript", level: 0.9, group: "前端", color: "#3178c6", icon: "📘" },
  { name: "WebGL", level: 0.8, group: "创意", color: "#990000", icon: "🎮" },
  { name: "Next.js", level: 0.9, group: "前端", color: "#000000", icon: "▲" },
  { name: "Tailwind", level: 0.85, group: "前端", color: "#38bdf8", icon: "🎨" },
  { name: "GLSL", level: 0.75, group: "创意", color: "#5586a4", icon: "⚡" },
  { name: "Figma", level: 0.8, group: "设计", color: "#f24e1e", icon: "🎭" },
  { name: "UI/UX", level: 0.85, group: "设计", color: "#ff7262", icon: "🖌️" },
  { name: "Node.js", level: 0.75, group: "后端", color: "#539e43", icon: "🟢" },
]

// 创建粒子系统
function createParticleSystem(count: number, radius: number) {
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

    // 随机颜色
    colors[i * 3] = 0.5 + Math.random() * 0.5
    colors[i * 3 + 1] = 0.5 + Math.random() * 0.5
    colors[i * 3 + 2] = 0.5 + Math.random() * 0.5

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
  const [isHovered, setIsHovered] = useState(false)

  const resetCamera = useCallback(() => {
    camera.position.set(0, 0, 15)
    camera.lookAt(0, 0, 0)
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }, [camera])

  return (
    <Html position={[0, 0, 0]} center fullscreen>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={resetCamera}
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
          isHovered
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            : "bg-background/80 backdrop-blur-sm border border-primary/20 hover:bg-primary/10"
        }`}
      >
        重置视角
      </motion.button>
    </Html>
  )
}

// 技能行星组件
function SkillPlanet({ skill, index, isActive, onClick, isDark }) {
  const meshRef = useRef()
  const [isHovered, setIsHovered] = useState(false)
  const [rotation, setRotation] = useState(
    () => new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
  )

  // 行星材质
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: skill.color,
      emissive: skill.color,
      emissiveIntensity: isActive ? 1 : 0.5,
      metalness: 0.8,
      roughness: 0.2,
    })
  }, [skill.color, isActive])

  // 行星环材质
  const ringMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: skill.color,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    })
  }, [skill.color])

  // 动画
  useFrame((state) => {
    if (meshRef.current) {
      // 自转
      meshRef.current.rotation.y += 0.005

      // 悬停或激活状态的额外效果
      if (isHovered || isActive) {
        meshRef.current.rotation.y += 0.005

        // 脉冲缩放效果
        const scale = 1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.05
        meshRef.current.scale.set(scale, scale, scale)
      } else {
        // 恢复正常大小
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      }
    }
  })

  // 计算行星大小
  const planetSize = 0.3 + skill.level * 0.3

  return (
    <group onClick={onClick} onPointerOver={() => setIsHovered(true)} onPointerOut={() => setIsHovered(false)}>
      {/* 行星 */}
      <mesh ref={meshRef} rotation={rotation}>
        <sphereGeometry args={[planetSize, 32, 32]} />
        <primitive object={material} attach="material" />

        {/* 行星环 - 只在悬停或激活时显示 */}
        {(isHovered || isActive) && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[planetSize * 1.2, planetSize * 1.5, 32]} />
            <primitive object={ringMaterial} attach="material" />
          </mesh>
        )}
      </mesh>

      {/* 技能名称 */}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <Text
          position={[0, planetSize * 1.8, 0]}
          fontSize={0.3}
          color={isActive || isHovered ? "#ffffff" : skill.color}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.ttf"
        >
          {skill.name}
        </Text>

        {/* 技能等级 */}
        {(isActive || isHovered) && (
          <Text
            position={[0, planetSize * 1.3, 0]}
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

      {/* 技能图标 - 在行星表面 */}
      <Billboard follow={true} position={[0, 0, planetSize * 1.01]}>
        <Text fontSize={0.4} anchorX="center" anchorY="middle">
          {skill.icon}
        </Text>
      </Billboard>

      {/* 激活状态的粒子效果 */}
      {isActive && (
        <group>
          {Array(20)
            .fill(0)
            .map((_, i) => (
              <mesh
                key={i}
                position={[
                  (Math.random() - 0.5) * planetSize * 3,
                  (Math.random() - 0.5) * planetSize * 3,
                  (Math.random() - 0.5) * planetSize * 3,
                ]}
              >
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshBasicMaterial color={skill.color} transparent opacity={0.8} />
              </mesh>
            ))}
        </group>
      )}
    </group>
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
  const isMobile = useMobile()

  // 创建背景粒子 - 减少数量以提高性能
  const particles = useMemo(() => createParticleSystem(isMobile ? 300 : 500, 15), [isMobile])

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

  // 处理技能点击
  const handleSkillClick = useCallback(
    (index) => {
      // 切换激活状态
      setActiveSkill(activeSkill === index ? null : index)

      // 如果激活了技能，将相机移动到该技能
      if (activeSkill !== index) {
        const skill = skillOrbits[index]
        const targetPosition = new THREE.Vector3().copy(skill.position)

        // 计算相机目标位置 - 稍微拉远以便观察
        const cameraTarget = targetPosition.clone().normalize().multiplyScalar(12)

        // 动画移动相机
        const startPosition = camera.position.clone()
        const startTime = Date.now()
        const duration = 1000 // 1秒

        const animateCamera = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)

          // 使用缓动函数使动画更平滑
          const easeProgress = 1 - Math.pow(1 - progress, 3)

          camera.position.lerpVectors(startPosition, cameraTarget, easeProgress)
          camera.lookAt(targetPosition)

          if (progress < 1) {
            requestAnimationFrame(animateCamera)
          }
        }

        animateCamera()
      }
    },
    [activeSkill, skillOrbits, camera],
  )

  // 动画 - 优化性能
  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // 更新背景粒子 - 降低更新频率
    if (particlesRef.current && state.clock.elapsedTime % 2 < 0.1) {
      particlesRef.current.rotation.y = time * 0.01
      particlesRef.current.rotation.x = Math.sin(time * 0.005) * 0.05

      // 更新粒子位置 - 只更新部分粒子以提高性能
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const angles = particles.angles
      const orbital = particles.orbital

      for (let i = 0; i < positions.length / 3; i += 3) {
        // 每次只更新1/3的粒子
        // 更新角度
        angles[i] += 0.0005 * orbital[i]

        // 计算新位置
        const r = 15 * (0.6 + Math.sin(time * 0.05 + i * 0.01) * 0.1)
        const theta = angles[i]
        const phi = Math.acos(Math.cos(time * 0.05 + i * 0.005) * 0.5)

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

    // 更新轨道线 - 降低更新频率
    if (orbitLinesRef.current && state.clock.elapsedTime % 4 < 0.1) {
      orbitLinesRef.current.rotation.y = time * 0.005
      orbitLinesRef.current.rotation.x = Math.sin(time * 0.05) * 0.05
    }
  })

  // 创建轨道线 - 简化轨道线以提高性能
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

      // 减少点的数量以提高性能
      const points = curve.getPoints(isMobile ? 50 : 100)
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
          <lineBasicMaterial
            attach="material"
            color={skill.color}
            transparent
            opacity={activeSkill === i ? 0.5 : 0.2} // 激活时更明显
            linewidth={1}
          />
        </line>
      )
    })
  }, [skillOrbits, activeSkill, isMobile])

  return (
    <>
      {/* 中心"太阳" */}
      <mesh>
        <sphereGeometry args={[1, isMobile ? 16 : 32, isMobile ? 16 : 32]} />
        <meshStandardMaterial
          color={isDark ? "#14b8a6" : "#0891b2"}
          emissive={isDark ? "#14b8a6" : "#0891b2"}
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>

      {/* 发光光环 */}
      <mesh>
        <ringGeometry args={[1.2, 2, isMobile ? 16 : 32]} />
        <meshBasicMaterial color={isDark ? "#14b8a6" : "#0891b2"} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* 轨道线 */}
      <group ref={orbitLinesRef}>{orbitLines}</group>

      {/* 技能"行星" */}
      <group ref={skillsRef}>
        {skillOrbits.map((skill, i) => (
          <SkillPlanet
            key={i}
            skill={skill}
            index={i}
            isActive={activeSkill === i}
            onClick={() => handleSkillClick(i)}
            isDark={isDark}
          />
        ))}
      </group>

      {/* 背景粒子 - 减少数量以提高性能 */}
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
        <pointsMaterial
          size={isMobile ? 0.15 : 0.1}
          vertexColors
          transparent
          opacity={0.6}
          depthWrite={false}
          sizeAttenuation
        />
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

export default function InteractiveSkills() {
  const isMobile = useMobile()

  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        dpr={[1, isMobile ? 1.5 : 2]} // 根据设备调整分辨率
        performance={{ min: 0.5 }} // 性能优化
      >
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
