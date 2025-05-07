"use client"

import { useEffect, useRef } from 'react'

export default function GlobeClient({ 
  globeRef, 
  countries, 
  isDark, 
  selectedCountry, 
  setSelectedCountry, 
  viewState, 
  setViewState,
  isMobile
}) {
  const containerRef = useRef(null)
  
  useEffect(() => {
    if (!containerRef.current || !countries) return
    
    // 动态导入globe.gl以确保它仅在客户端加载
    import('globe.gl').then(({ default: GlobeGL }) => {
      // 清除容器中的旧内容
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild)
      }
      
      // 创建globe实例
      const Globe = GlobeGL()
      
      // 配置globe
      Globe
        .globeImageUrl(isDark 
          ? '//unpkg.com/three-globe/example/img/earth-night.jpg' 
          : '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl(isDark
          ? '//unpkg.com/three-globe/example/img/night-sky.png'
          : null)
        .atmosphereColor(isDark ? 'rgba(40,90,255,0.7)' : 'rgba(65,150,255,0.7)')
        .atmosphereAltitude(0.15)
        .polygonsData(countries.features || [])
        .polygonCapColor(feat => (selectedCountry === feat.properties.ISO_A3) 
          ? 'rgba(255,100,100,0.8)' 
          : 'rgba(200,200,200,0.3)')
        .polygonSideColor(() => 'rgba(100,100,100,0.15)')
        .polygonLabel(({ properties: p }) => `
          <div class="glass-effect p-2 rounded-lg">
            <b>${p.ADMIN}</b> (${p.ISO_A3})
            <br />
            <span class="text-xs text-muted-foreground">
              人口: ${p.POP_EST.toLocaleString()}
            </span>
          </div>
        `)
        .onPolygonClick(({ properties }) => {
          if (viewState === 'global') {
            setSelectedCountry(properties.ISO_A3)
            setViewState('country')
            
            // 获取国家的地理中心并定位
            const lat = properties.LATITUDE || 0
            const lng = properties.LONGITUDE || 0
            
            Globe.pointOfView({
              lat, 
              lng, 
              altitude: 1.5
            }, 1000)
          }
        })
        .polygonAltitude(0.01)
        .polygonStrokeColor(() => '#111')
        .polygonStrokeWidth(0.5)
        .polygonsTransitionDuration(1000)
        .width(window.innerWidth)
        .height(window.innerHeight)
        
      // 挂载到容器
      Globe(containerRef.current)
      
      // 缩放适配移动设备
      if (isMobile) {
        Globe.pointOfView({ altitude: 3 })
      }
      
      // 暴露给父组件
      globeRef.current = Globe
    })
    
    // 清理
    return () => {
      if (containerRef.current) {
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild)
        }
      }
    }
  }, [countries, isDark, selectedCountry, viewState, setSelectedCountry, setViewState, globeRef, isMobile])
  
  return <div ref={containerRef} className="w-full h-full"></div>
}