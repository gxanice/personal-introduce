"use client"

import { useEffect, useState, useRef } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

// 动态导入 React-Globe.gl 组件，避免 SSR 问题
const Globe = dynamic(() => import('react-globe.gl').then(mod => mod), {
  ssr: false
})

// 特殊地点数据
const locationData = [
  {
    id: "china",
    name: "中国",
    lat: 35.8617,
    lng: 104.1954,
    color: "#f43f5e",
    description: "中华人民共和国",
    type: "country"
  },
  {
    id: "henan",
    name: "河南省",
    lat: 33.8820,
    lng: 113.6140,
    color: "#f59e42",
    description: "中国河南省",
    type: "region",
    parent: "china"
  },
  {
    id: "zhengzhou",
    name: "郑州市",
    lat: 34.7466,
    lng: 113.6254,
    color: "#3b82f6",
    description: "河南省省会，中原城市群核心城市",
    type: "city",
    parent: "henan"
  }
]

// 河南省和郑州似乎没有正确的地址信息
// 简化的河南省GeoJSON数据
const henanGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        adcode: 410000,
        name: "河南省",
        center: [113.665412, 34.757975],
        centroid: [113.756004, 33.930882],
        childrenNum: 18,
        level: "province"
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [110.358479, 34.991211],
              [110.598564, 34.999608],
              [110.701352, 34.940126],
              [110.824649, 34.948528],
              [110.962629, 35.117455],
              [111.131065, 35.144643],
              [111.171673, 35.02079],
              [111.288726, 35.021873],
              [111.408056, 34.930636],
              [111.541278, 34.925347],
              [111.548573, 34.82724],
              [111.798192, 34.800006],
              [112.042043, 34.807343],
              [112.09573, 34.907562],
              [112.257877, 34.942297],
              [112.387333, 34.918001],
              [112.456407, 34.962674],
              [112.713719, 35.046186],
              [112.819784, 35.016017],
              [112.951933, 35.12056],
              [113.030937, 35.079673],
              [113.221615, 35.094526],
              [113.409985, 35.139365],
              [113.562062, 35.054602],
              [113.657156, 35.075217],
              [113.669683, 34.915833],
              [113.917154, 34.847883],
              [114.106757, 34.836224],
              [114.173654, 34.881004],
              [114.337955, 34.824639],
              [114.46542, 34.822467],
              [114.514889, 34.889419],
              [114.682253, 34.830014],
              [114.703534, 34.878832],
              [114.988283, 34.762299],
              [115.055181, 34.686259],
              [115.268027, 34.62146],
              [115.427997, 34.651783],
              [115.547326, 34.482301],
              [115.708399, 34.370528],
              [115.87889, 34.329493],
              [115.972909, 34.252236],
              [115.95467, 34.188446],
              [116.042536, 34.060282],
              [116.063816, 33.981855],
              [115.985886, 33.851314],
              [116.145855, 33.65582],
              [116.1163, 33.530252],
              [116.034604, 33.416171],
              [115.901381, 33.441639],
              [115.888855, 33.371864],
              [115.754558, 33.317125],
              [115.79011, 33.230155],
              [115.682098, 33.155485],
              [115.731568, 32.969805],
              [115.689886, 32.852834],
              [115.824183, 32.858388],
              [115.865865, 32.796696],
              [115.972909, 32.822342],
              [116.069077, 32.757744],
              [116.044649, 32.649963],
              [116.246397, 32.564921],
              [116.166848, 32.476029],
              [116.17533, 32.297271],
              [116.230092, 32.270571],
              [116.195616, 32.162303],
              [116.086529, 32.114744],
              [116.064174, 32.029308],
              [116.151174, 31.994793],
              [116.12167, 31.912049],
              [115.994205, 31.856323],
              [115.973999, 31.792569],
              [115.841852, 31.763697],
              [115.674488, 31.852766],
              [115.490883, 31.844087],
              [115.502335, 31.897279],
              [115.369112, 31.90595],
              [115.308115, 31.823904],
              [115.245043, 31.866999],
              [115.153071, 31.855233],
              [115.049209, 31.789008],
              [114.899279, 31.824995],
              [114.843443, 31.776373],
              [114.752546, 31.813554],
              [114.677307, 31.758942],
              [114.558, 31.80718],
              [114.508531, 31.723093],
              [114.337955, 31.751991],
              [114.267806, 31.8353],
              [114.123957, 31.849206],
              [114.138557, 31.932921],
              [114.033619, 31.989044],
              [113.941648, 31.935393],
              [113.9386, 31.993684],
              [113.784986, 31.929358],
              [113.661689, 31.973524],
              [113.596867, 31.890044],
              [113.402418, 31.873574],
              [113.315626, 31.79347],
              [113.194403, 31.82877],
              [113.179804, 31.909486],
              [113.063826, 31.991606],
              [113.009065, 32.165958],
              [112.982485, 32.265857],
              [112.888466, 32.364571],
              [112.775533, 32.402476],
              [112.68052, 32.510853],
              [112.497989, 32.522013],
              [112.440078, 32.483021],
              [112.334043, 32.489671],
              [112.21282, 32.456222],
              [112.150822, 32.375532],
              [112.024431, 32.380989],
              [111.866461, 32.511943],
              [111.797386, 32.478503],
              [111.700144, 32.585084],
              [111.593035, 32.609506],
              [111.569682, 32.729961],
              [111.415069, 32.813235],
              [111.24042, 32.790049],
              [111.159797, 32.905271],
              [111.016972, 32.892963],
              [110.992545, 32.963064],
              [110.878536, 32.990682],
              [110.832858, 33.068398],
              [110.68902, 33.124264],
              [110.623123, 33.081702],
              [110.517089, 33.173654],
              [110.395866, 33.162426],
              [110.394792, 33.224304],
              [110.264262, 33.320814],
              [110.244042, 33.435864],
              [110.301953, 33.472297],
              [110.26545, 33.602895],
              [110.153592, 33.637063],
              [110.158716, 33.747392],
              [110.303028, 33.784797],
              [110.287355, 33.846313],
              [110.194309, 33.903372],
              [110.190186, 33.971418],
              [110.093963, 34.064516],
              [110.150873, 34.165072],
              [110.119217, 34.24321],
              [110.146871, 34.398193],
              [110.234737, 34.554089],
              [110.208156, 34.593796],
              [110.269153, 34.666683],
              [110.358479, 34.991211]
            ]
          ]
        ]
      }
    }
  ]
};

// 简化的郑州市GeoJSON数据
const zhengzhouGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        adcode: 410100,
        name: "郑州市",
        center: [113.665412, 34.757975],
        centroid: [113.519652, 34.675858],
        childrenNum: 12,
        level: "city"
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [113.211825, 34.460695],
              [113.291375, 34.581311],
              [113.328952, 34.555008],
              [113.523401, 34.522483],
              [113.599715, 34.558218],
              [113.736159, 34.526275],
              [113.864699, 34.538962],
              [113.946395, 34.514967],
              [114.081767, 34.516344],
              [114.166483, 34.551948],
              [114.187763, 34.480264],
              [114.090521, 34.43736],
              [114.146358, 34.324177],
              [114.03342, 34.301378],
              [113.892195, 34.296202],
              [113.776217, 34.243977],
              [113.76779, 34.17955],
              [113.680998, 34.140932],
              [113.669683, 34.224299],
              [113.574664, 34.221537],
              [113.458686, 34.258801],
              [113.270352, 34.322792],
              [113.211825, 34.460695]
            ]
          ]
        ]
      }
    }
  ]
};

export default function Earth3D() {
  const [loaded, setLoaded] = useState(false)
  const [countries, setCountries] = useState<any>(null)
  const [chinaGeoData, setChinaGeoData] = useState<any>(null)
  const [dataLoadingErrors, setDataLoadingErrors] = useState<string[]>([])
  
  const globeRef = useRef<any>(null)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [viewLevel, setViewLevel] = useState("global")
  const isMobile = useMobile()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [isClient, setIsClient] = useState(false)

  // 设置客户端渲染标志
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 加载全球国家数据
  useEffect(() => {
    if (!isClient) return
    
    // 加载全球国家数据
    fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => {
        setCountries(data)
        
        // 筛选出中国的数据
        const chinaFeature = data.features.find((f: any) => f.properties.ADMIN === "China");
        if (chinaFeature) {
          setChinaGeoData({
            type: "FeatureCollection",
            features: [chinaFeature]
          });
        }
        
        setLoaded(true); // 数据加载完成
      })
      .catch(err => {
        console.error("加载地球数据失败:", err)
        setDataLoadingErrors(prev => [...prev, "全球数据加载失败"])
        setLoaded(true); // 即使有错误也设置为加载完成，以便显示界面
      })
  }, [isClient])
  
  // 设置初始视角，使中国可见
  useEffect(() => {
    if (!globeRef.current || !loaded) return;
    
    // 用更长的延迟确保地球完全加载
    const timer = setTimeout(() => {
      globeRef.current.pointOfView({
        lat: 35,
        lng: 105,
        altitude: 2.0
      }, 0);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [loaded, globeRef.current]);

  // 增加一个组件挂载后的单次执行效果
  useEffect(() => {
    if (!isClient) return;
    
    const timers = [
      setTimeout(() => {
        if (globeRef.current) {
          globeRef.current.pointOfView({
            lat: 35, 
            lng: 105,
            altitude: 2.0
          }, 0);
        }
      }, 800),
      
      setTimeout(() => {
        if (globeRef.current) {
          globeRef.current.pointOfView({
            lat: 35, 
            lng: 105,
            altitude: 2.0
          }, 0);
        }
      }, 1500)
    ];
    
    return () => timers.forEach(clearTimeout);
  }, [isClient]);

  // 获取当前可见的地点
  const visibleLocations = locationData.filter(loc => {
    if (viewLevel === "global") return loc.type === "country";
    if (viewLevel === "country" && selectedRegion === "china") return loc.type === "region";
    if (viewLevel === "region" && selectedRegion === "henan") return loc.type === "city";
    return false;
  });

  // 根据当前视图获取正确的地理数据
  const getPolygonsData = () => {
    if (!loaded) return [];
    
    if (viewLevel === "global") {
      // 全球视图 - 显示所有国家
      return countries?.features || [];
    } 
    else if (viewLevel === "country" && selectedRegion === "china") {
      // 国家视图 - 显示中国省份数据，我们只展示河南省
      return henanGeoJSON.features;
    } 
    else if (viewLevel === "region" && selectedRegion === "henan") {
      // 省级视图 - 显示河南省内的郑州市
      return zhengzhouGeoJSON.features;
    } 
    else if (viewLevel === "city" && selectedRegion === "zhengzhou") {
      // 市级视图 - 继续使用郑州市数据
      return zhengzhouGeoJSON.features;
    }
    
    return countries?.features || [];
  };

  // 重置视图
  const resetView = () => {
    setSelectedRegion(null)
    setViewLevel("global")
    
    if (globeRef.current) {
      globeRef.current.pointOfView({
        lat: 35,
        lng: 105,
        altitude: 2.0
      }, 1000)
    }
  }

  // 处理区域点击
  const handleLocationClick = (loc: any) => {
    const location = locationData.find(l => l.id === loc.id);
    if (!location) return;
    
    setSelectedRegion(location.id);
    
    if (location.type === "country") {
      setViewLevel("country");
    } else if (location.type === "region") {
      setViewLevel("region");
    } else if (location.type === "city") {
      setViewLevel("city");
    }
    
    const zoomLevel = 
      location.type === "city" ? 0.5 : 
      location.type === "region" ? 0.8 : 
      location.type === "country" ? 1.2 : 2.0;
    
    if (globeRef.current) {
      globeRef.current.pointOfView({
        lat: location.lat,
        lng: location.lng,
        altitude: zoomLevel
      }, 1000);
    }
  }

  // 后退到上一级
  const handleBackClick = () => {
    if (viewLevel === "city") {
      const region = locationData.find(loc => loc.id === "henan");
      setSelectedRegion("henan");
      setViewLevel("region");
      
      if (globeRef.current && region) {
        globeRef.current.pointOfView({
          lat: region.lat,
          lng: region.lng,
          altitude: 0.8
        }, 1000);
      }
    } else if (viewLevel === "region") {
      const country = locationData.find(loc => loc.id === "china");
      setSelectedRegion("china");
      setViewLevel("country");
      
      if (globeRef.current && country) {
        globeRef.current.pointOfView({
          lat: country.lat,
          lng: country.lng,
          altitude: 1.2
        }, 1000);
      }
    } else {
      resetView();
    }
  }

  // 避免SSR渲染问题
  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">准备中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载地球资源中...</p>
          </div>
        </div>
      )}
      
      <div className="w-full flex justify-center">
        {loaded && countries && (
          <Globe
            ref={globeRef}
            globeImageUrl={isDark 
              ? 'https://unpkg.com/three-globe/example/img/earth-night.jpg' 
              : 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'}
            bumpImageUrl='https://unpkg.com/three-globe/example/img/earth-topology.png'
            backgroundImageUrl={isDark ? 'https://unpkg.com/three-globe/example/img/night-sky.png' : null}
            
            // 多边形数据 - 根据当前视图级别显示不同地域数据
            polygonsData={getPolygonsData()}
            polygonCapColor={(d: any) => {
              // 根据不同视图级别设置颜色
              if (viewLevel === "global" && d.properties?.ADMIN === "China") {
                return 'rgba(244, 63, 94, 0.8)'; // 全球视图中的中国
              }
              
              if (viewLevel === "country" && d.properties?.name === "河南省") {
                return 'rgba(244, 63, 94, 0.8)'; // 中国视图中的河南省
              }
              
              if (viewLevel === "region" && d.properties?.name === "郑州市") {
                return 'rgba(245, 158, 66, 0.8)'; // 河南省视图中的郑州市
              }
              
              if (viewLevel === "city") {
                return 'rgba(59, 130, 246, 0.8)'; // 郑州市视图中的区县
              }
              
              return 'rgba(200, 200, 200, 0.3)'; // 其他区域
            }}
            polygonSideColor={() => 'rgba(100, 100, 100, 0.15)'}
            polygonLabel={(d: any) => {
              const name = d.properties?.name || d.properties?.ADMIN || '';
              let extraInfo = '';
              
              if (d.properties?.POP_EST) {
                extraInfo = `<br /><span style="color: ${isDark ? '#a5f3fc' : '#e0e0e0'}">人口: ${d.properties.POP_EST.toLocaleString()}</span>`;
              }
              
              return `
                <div style="background: rgba(0,0,0,0.7); color: ${isDark ? '#7dd3fc' : 'white'}; padding: 8px; border-radius: 4px; font-family: system-ui, sans-serif;">
                  <strong>${name}</strong>
                  ${extraInfo}
                </div>
              `;
            }}
            polygonAltitude={0.01}
            
            // 使用普通点标记代替自定义图层
            pointsData={visibleLocations}
            pointLabel={(d: any) => `
              <div style="background: rgba(0,0,0,0.7); color: ${isDark ? '#7dd3fc' : 'white'}; padding: 8px; border-radius: 4px; font-family: system-ui, sans-serif;">
                <strong>${d.name}</strong>
                <br />
                <span style="color: ${isDark ? '#a5f3fc' : '#e0e0e0'}">${d.description}</span>
              </div>
            `}
            pointColor={(d: any) => d.color}
            pointAltitude={0.01}
            pointRadius={0.5}
            pointResolution={24}
            onPointClick={handleLocationClick}
            
            // 大气和其他设置
            atmosphereColor={isDark ? 'rgba(40,90,255,0.7)' : 'rgba(65,150,255,0.7)'}
            atmosphereAltitude={0.15}
            width={isMobile ? window.innerWidth * 0.95 : window.innerWidth * 0.8}
            height={isMobile ? 400 : 600}
          />
        )}
      </div>

      {/* 导航控制 */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 justify-center items-center">
        {viewLevel !== "global" && (
          <Button 
            onClick={handleBackClick}
            className={`px-4 py-2 backdrop-blur-sm border border-primary/20 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              isDark 
                ? 'bg-background/60 text-sky-300 hover:bg-sky-900/30 hover:text-sky-200' 
                : 'bg-background/80 hover:bg-primary/10'
            }`}
          >
            返回{viewLevel === "city" ? "河南省" : viewLevel === "region" ? "中国" : "全球"}
          </Button>
        )}
        
        <Button 
          onClick={resetView}
          className={`px-4 py-2 backdrop-blur-sm border border-primary/20 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            isDark 
              ? 'bg-background/60 text-sky-300 hover:bg-sky-900/30 hover:text-sky-200' 
              : 'bg-background/80 hover:bg-primary/10'
          }`}
        >
          重置视图
        </Button>
        
        {selectedRegion && (
          <div className={`px-4 py-2 backdrop-blur-sm border border-primary/20 rounded-full text-sm transition-colors ${
            isDark ? 'bg-background/60 text-sky-300' : 'bg-background/80'
          }`}>
            当前: {locationData.find(loc => loc.id === selectedRegion)?.name}
          </div>
        )}
      </div>
      
      {/* 错误提示 */}
      {dataLoadingErrors.length > 0 && (
        <div className="absolute top-4 right-4 p-2 bg-red-500/70 text-white rounded-md text-sm">
          <p className="font-bold">数据加载错误:</p>
          <ul className="list-disc pl-4">
            {dataLoadingErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
