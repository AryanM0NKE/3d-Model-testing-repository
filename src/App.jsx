import React, { useRef, useState } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Grid, Html, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// Demo floor plan texture (replace with your PDF converted to PNG)
const FLOOR_PLAN_URL = "floorplan.jpg"

function FloorPlan() {
  const texture = useLoader(THREE.TextureLoader, FLOOR_PLAN_URL)
  texture.colorSpace = THREE.SRGBColorSpace
  
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <mesh>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial 
          map={texture} 
          transparent 
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Border frame */}
      <mesh position={[0, -0.02, 0]}>
        <planeGeometry args={[16.2, 12.2]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </group>
  )
}

function ExtrudedWalls() {
  // Sample wall coordinates based on a typical floor plan layout
  const walls = [
    // Outer walls
    { pos: [0, 1.5, -5.5], size: [14, 3, 0.2] },
    { pos: [0, 1.5, 5.5], size: [14, 3, 0.2] },
    { pos: [-6.9, 1.5, 0], size: [0.2, 3, 11] },
    { pos: [6.9, 1.5, 0], size: [0.2, 3, 11] },
    // Inner walls (rooms)
    { pos: [-3, 1.5, 0], size: [0.2, 3, 6] },
    { pos: [3, 1.5, -2], size: [0.2, 3, 7] },
    { pos: [0, 1.5, 2], size: [6, 3, 0.2] },
  ]

  return (
    <group>
      {walls.map((wall, i) => (
        <mesh key={i} position={wall.pos} castShadow receiveShadow>
          <boxGeometry args={wall.size} />
          <meshStandardMaterial 
            color="#e0e0e0" 
            roughness={0.4}
            metalness={0.1}
          />
          {/* Wireframe overlay for technical look */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(...wall.size)]} />
            <lineBasicMaterial color="#666" linewidth={2} />
          </lineSegments>
        </mesh>
      ))}
      
      {/* Height indicators */}
      {[...Array(4)].map((_, i) => (
        <mesh key={`indicator-${i}`} position={[-6 + i*4, 3, -5]}>
          <cylinderGeometry args={[0.05, 0.05, 3]} />
          <meshStandardMaterial color="#00AEEF" emissive="#00AEEF" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function Measurements() {
  return (
    <group>
      {/* Dimension lines */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-7, 0.1, -6, 7, 0.1, -6])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ff6b6b" linewidth={2} />
      </line>
      
      {/* Measurement labels */}
      <Html position={[0, 0.5, -6.5]} center>
        <div style={{
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
          pointerEvents: 'none'
        }}>
          14.00 m
        </div>
      </Html>
    </group>
  )
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[15, 12, 15]} fov={45} />
      <OrbitControls 
        enablePan 
        enableZoom 
        enableRotate
        minDistance={5}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2 - 0.1}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#00AEEF" />
      
      {/* Floor grid */}
      <Grid 
        infiniteGrid 
        fadeDistance={50} 
        cellSize={1} 
        sectionSize={5}
        cellThickness={0.5}
        sectionThickness={1}
        cellColor="#444"
        sectionColor="#00AEEF"
      />
      
      {/* Architectural elements */}
      <FloorPlan />
      <ExtrudedWalls />
      <Measurements />
      
      {/* Ground plane for shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a1a1a" opacity={0.8} transparent />
      </mesh>
    </>
  )
}

export default function PDF3DViewer() {
  const [opacity, setOpacity] = useState(0.9)
  
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0a', position: 'relative' }}>
      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10,
        background: 'rgba(10, 37, 64, 0.95)',
        padding: '20px',
        borderRadius: '12px',
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '300px',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#00AEEF' }}>
          CAD PDF + 3D Overlay
        </h2>
        <p style={{ margin: '0 0 15px 0', fontSize: '14px', opacity: 0.8, lineHeight: 1.4 }}>
          Option 3 Demo: Floor plan texture with extruded walls and measurements.
        </p>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>
            Floor Plan Opacity: {Math.round(opacity * 100)}%
          </label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        
        <div style={{ fontSize: '12px', opacity: 0.7, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '10px' }}>
          <strong>Controls:</strong><br/>
          • Left Click: Rotate<br/>
          • Right Click: Pan<br/>
          • Scroll: Zoom<br/>
          • Red lines show dimensions
        </div>
      </div>

      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <Scene />
      </Canvas>
      
      {/* Instructions overlay */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '6px',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        Replace FLOOR_PLAN_URL with your PDF (converted to PNG)
      </div>
    </div>
  )
}