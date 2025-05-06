"use client"

import { useRef, useState, useMemo, useCallback, useEffect, ReactNode, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Text, OrbitControls, Html, Billboard } from "@react-three/drei"
import { useTheme } from "next-themes"
import * as THREE from "three"

// 技能数据 - 使用固定数据，避免随机数
const skills = [
  { name: "React", level: 0.95, group: "前端", color: "#61dafb" },
  { name: "Next.js", level: 0.9, group: "前端", color: "#000000" },
  { name: "TypeScript", level: 0.9, group: "前端", color: "#3178c6" },
  { name: "Tailwind", level: 0.85, group: "前端", color: "#38bdf8" },
  { name: "Three.js", level: 0.8, group: "创意", color: "#049ef4" },
  { name: "Framer Motion", level: 0.85, group: "创意", color: "#ff00d6" },
  { name: "设计系统", level: 0.85, group: "设计", color: "#ff7262" },
  { name: "响应式设计", level: 0.9, group: "设计", color: "#f24e1e" },
  { name: "Node.js", level: 0.8, group: "后端", color: "#539e43" },
  { name: "数据可视化", level: 0.85, group: "创意", color: "#5586a4" },
]

// 从种子生成固定的伪随机数
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 使用固定的角度和距离
const orbitData = skills.map((skill, i) => {
  const angle = (i / skills.length) * Math.PI * 2;
  const radius = 3 + i * 0.5;
  return {
    ...skill,
    orbitRadius: radius,
    orbitTilt: 0.3,
    orbitPhase: angle,
    orbitSpeed: 0.1 + (i / skills.length) * 0.2,
    orbitEccentricity: 0.2,
    position: new THREE.Vector3(),
  };
});

// 创建粒子位置 - 使用固定模式而非随机
function createParticleSystem(count: number, radius: number, isDark: boolean) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const angles = new Float32Array(count);
  const orbital = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // 使用规则模式而非完全随机
    const fi = i / count;
    const angle1 = fi * Math.PI * 2;
    const angle2 = fi * Math.PI;
    
    // 计算位置 - 类似螺旋形
    const r = radius * (0.6 + 0.4 * fi);
    const theta = angle1;
    const phi = angle2;

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    // 颜色 - 基于索引而非随机
    if (isDark) {
      // 暗色模式下使用亮色粒子
      colors[i * 3] = 0.5 + (i % 5) / 10; // R
      colors[i * 3 + 1] = 0.5 + (i % 7) / 14; // G
      colors[i * 3 + 2] = 0.5 + (i % 3) / 6; // B
    } else {
      // 浅色模式下使用深色粒子
      colors[i * 3] = 0.1 + (i % 5) / 15; // R
      colors[i * 3 + 1] = 0.2 + (i % 7) / 20; // G
      colors[i * 3 + 2] = 0.5 + (i % 3) / 10; // B
    }

    // 大小 - 规则变化
    sizes[i] = 0.1 + (i % 10) / 20;

    // 角度和速度 - 有规律
    angles[i] = (i / count) * Math.PI * 2;
    orbital[i] = 0.2 + (i % 5) / 10;
  }

  return { positions, colors, sizes, angles, orbital };
}

// 基础场景组件 - 只显示中心"太阳"
function BasicScene() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  return (
    <>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={isDark ? "#14b8a6" : "#0891b2"}
          emissive={isDark ? "#14b8a6" : "#0891b2"}
          emissiveIntensity={1}
        />
      </mesh>
      <ambientLight intensity={0.5} />
    </>
  );
}

// 完整场景组件
function SkillsScene() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activeSkill, setActiveSkill] = useState<number | null>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const skillsRef = useRef<THREE.Group>(null);
  
  // 使用固定数据而非随机生成
  const [particles] = useState(() => createParticleSystem(200, 15, !!isDark));
  const [skillOrbits] = useState(() => orbitData);
  
  // 动画
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // 更新粒子旋转
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.02;
      particlesRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;
    }
    
    // 更新行星位置
    if (skillsRef.current) {
      skillOrbits.forEach((skill, i) => {
        const child = skillsRef.current?.children[i];
        if (child) {
          const angle = time * skill.orbitSpeed + skill.orbitPhase;
          const x = skill.orbitRadius * Math.cos(angle);
          const z = skill.orbitRadius * Math.sin(angle) * Math.cos(skill.orbitTilt);
          const y = skill.orbitRadius * Math.sin(angle) * Math.sin(skill.orbitTilt);
          
          child.position.set(x, y, z);
        }
      });
    }
  });

  // 处理点击
  const handleSkillClick = (index: number) => {
    setActiveSkill(activeSkill === index ? null : index);
  };

  return (
    <>
      {/* 中心"太阳" */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={isDark ? "#14b8a6" : "#0891b2"}
          emissive={isDark ? "#14b8a6" : "#0891b2"}
          emissiveIntensity={1}
        />
      </mesh>

      {/* 技能"行星" */}
      <group ref={skillsRef}>
        {skillOrbits.map((skill, i) => (
          <group key={i} onClick={() => handleSkillClick(i)}>
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
            <Billboard follow={true}>
              <Text
                position={[0, 0.8, 0]}
                fontSize={0.3}
                color={activeSkill === i ? "#ffffff" : skill.color}
                anchorX="center"
                anchorY="middle"
              >
                {skill.name}
              </Text>
              {activeSkill === i && (
                <Text
                  position={[0, 1.2, 0]}
                  fontSize={0.2}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                >
                  {`${skill.level * 100}%`}
                </Text>
              )}
            </Billboard>
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
            args={[particles.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
            args={[particles.colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particles.sizes.length}
            array={particles.sizes}
            itemSize={1}
            args={[particles.sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.1} vertexColors transparent opacity={0.8} sizeAttenuation />
      </points>

      {/* 灯光 */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={1} color="#ffffff" />
    </>
  );
}

// 导出主组件 - 尽可能精简，避免水合错误
export default function SkillsVisualization3D() {
  const [clientReady, setClientReady] = useState(false);
  
  // 仅在客户端执行
  useEffect(() => {
    setClientReady(true);
  }, []);
  
  if (!clientReady) {
    return (
      <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center bg-muted/30 rounded-lg">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">加载3D技能可视化...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <Suspense fallback={<BasicScene />}>
          <SkillsScene />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            rotateSpeed={0.5}
            zoomSpeed={0.5}
            minDistance={8}
            maxDistance={25}
            maxPolarAngle={Math.PI * 0.8}
            minPolarAngle={Math.PI * 0.2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}