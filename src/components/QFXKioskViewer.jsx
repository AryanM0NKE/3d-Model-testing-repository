import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  ContactShadows,
  PerspectiveCamera,
  Box,
  Cylinder,
  RoundedBox
} from '@react-three/drei'
import * as THREE from 'three'

// Accurate QFX Logo Geometry
function QFXLogo({ position }) {
  const group = useRef()
  
  // Proper QFX letters based on actual logo
  return (
    <group ref={group} position={position}>
      {/* Dark backing panel */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[1.6, 0.5, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
      </mesh>
      
      {/* LETTER Q */}
      <group position={[-0.55, 0, 0.04]}>
        {/* Q Circle */}
        <mesh>
          <torusGeometry args={[0.14, 0.04, 16, 32]} />
          <meshStandardMaterial color="#ffffff" emissive="#ff6600" emissiveIntensity={0.2} />
        </mesh>
        {/* Q Tail */}
        <mesh position={[0.1, -0.1, 0]} rotation={[0, 0, -0.6]}>
          <boxGeometry args={[0.04, 0.14, 0.04]} />
          <meshStandardMaterial color="#ffffff" emissive="#ff6600" emissiveIntensity={0.2} />
        </mesh>
      </group>
      
      {/* LETTER F */}
      <group position={[0, 0, 0.04]}>
        {/* Vertical stem */}
        <mesh>
          <boxGeometry args={[0.06, 0.28, 0.06]} />
          <meshStandardMaterial color="#ffffff" emissive="#ff6600" emissiveIntensity={0.2} />
        </mesh>
        {/* Top bar */}
        <mesh position={[0.08, 0.1, 0]}>
          <boxGeometry args={[0.16, 0.06, 0.06]} />
          <meshStandardMaterial color="#ffffff" emissive="#ff6600" emissiveIntensity={0.2} />
        </mesh>
        {/* Middle bar */}
        <mesh position={[0.06, 0.02, 0]}>
          <boxGeometry args={[0.12, 0.05, 0.06]} />
          <meshStandardMaterial color="#ffffff" emissive="#ff6600" emissiveIntensity={0.2} />
        </mesh>
      </group>
      
      {/* LETTER X */}
      <group position={[0.55, 0, 0.04]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.06, 0.3, 0.06]} />
          <meshStandardMaterial color="#ffffff" emissive="#ff6600" emissiveIntensity={0.2} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.06, 0.3, 0.06]} />
          <meshStandardMaterial color="#ffffff" emissive="#ff6600" emissiveIntensity={0.2} />
        </mesh>
      </group>
    </group>
  )
}

// Corrugated metal sheet detail (as shown below roof)
function CorrugatedSection({ width, position }) {
  const corrugations = useMemo(() => {
    const items = []
    const count = Math.floor(width / 0.05)
    for (let i = 0; i < count; i++) {
      items.push(
        <mesh key={i} position={[(i - count/2) * 0.05, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, width/count + 0.1, 8]} rotation={[0, 0, Math.PI/2]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
        </mesh>
      )
    }
    return items
  }, [width])
  
  return (
    <group position={position}>
      {corrugations}
    </group>
  )
}

function Kiosk() {
  // Dimensions from drawing: 2000mm x 2000mm x 3000mm
  // Scale: 1 unit = 1 meter
  const width = 2.0
  const depth = 2.0
  const height = 3.0
  
  return (
    <group position={[0, height/2, 0]}>
      {/* MAIN STRUCTURE - Dark Grey ACP panels */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* ORANGE ACCENT PANELS - Corner strips */}
      {/* Front Left */}
      <mesh position={[-width/2 + 0.08, 0, depth/2 + 0.005]} castShadow>
        <boxGeometry args={[0.16, height - 0.1, 0.02]} />
        <meshStandardMaterial color="#ff6b35" roughness={0.4} />
      </mesh>
      
      {/* Front Right */}
      <mesh position={[width/2 - 0.08, 0, depth/2 + 0.005]} castShadow>
        <boxGeometry args={[0.16, height - 0.1, 0.02]} />
        <meshStandardMaterial color="#ff6b35" roughness={0.4} />
      </mesh>
      
      {/* Right Side Full */}
      <mesh position={[width/2 + 0.005, 0, 0]} castShadow>
        <boxGeometry args={[0.02, height - 0.1, depth]} />
        <meshStandardMaterial color="#ff6b35" roughness={0.4} />
      </mesh>
      
      {/* Left Side Full */}
      <mesh position={[-width/2 - 0.005, 0, 0]} castShadow>
        <boxGeometry args={[0.02, height - 0.1, depth]} />
        <meshStandardMaterial color="#ff6b35" roughness={0.4} />
      </mesh>
      
      {/* BASE/PLINTH - MS Channel */}
      <mesh position={[0, -height/2 - 0.05, 0]} castShadow>
        <boxGeometry args={[width + 0.1, 0.1, depth + 0.1]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* CORRUGATED METAL SECTION - Below roof overhang */}
      <mesh position={[0, height/2 - 0.15, depth/2 + 0.02]} castShadow>
        <boxGeometry args={[width - 0.2, 0.3, 0.05]} />
        <meshStandardMaterial color="#1f1f1f" roughness={0.6} metalness={0.4} />
      </mesh>
      
      {/* ROOF OVERHANG */}
      <mesh position={[0, height/2 + 0.05, 0]} castShadow>
        <boxGeometry args={[width + 0.2, 0.1, depth + 0.2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
      </mesh>
      
      {/* QFX SIGNAGE */}
      <QFXLogo position={[0, height/2 - 0.15, depth/2 + 0.08]} />
      
      {/* AC UNIT / ODU on roof */}
      <group position={[0.4, height/2 + 0.25, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.4, 0.5]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.3} />
        </mesh>
        {/* AC Fan grill */}
        <mesh position={[0, 0.21, 0]}>
          <boxGeometry args={[0.6, 0.02, 0.4]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
      
      {/* GLASS TRANSACTION WINDOW */}
      <group position={[0, -0.2, depth/2 + 0.02]}>
        {/* Glass panel */}
        <mesh>
          <boxGeometry args={[1.4, 1.4, 0.04]} />
          <meshPhysicalMaterial 
            color="#ffffff"
            metalness={0}
            roughness={0}
            transmission={0.9}
            thickness={0.12}
            transparent
            opacity={0.2}
            ior={1.5}
          />
        </mesh>
        
        {/* Glass Frame - Aluminum */}
        <mesh position={[0, 0, -0.03]}>
          <boxGeometry args={[1.5, 1.5, 0.02]} />
          <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Counter inside */}
        <mesh position={[0, -0.5, -0.3]} castShadow>
          <boxGeometry args={[1.2, 0.05, 0.6]} />
          <meshStandardMaterial color="#8B4513" roughness={0.6} />
        </mesh>
        
        {/* Computer monitor */}
        <mesh position={[0, -0.35, -0.4]}>
          <boxGeometry args={[0.35, 0.25, 0.04]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0, -0.35, -0.38]}>
          <planeGeometry args={[0.31, 0.21]} />
          <meshBasicMaterial color="#4169e1" />
        </mesh>
      </group>
      
      {/* SIDE DOOR (Right side) */}
      <group position={[width/2 + 0.01, -0.3, 0]}>
        {/* Door panel */}
        <mesh castShadow>
          <boxGeometry args={[0.02, 1.8, 0.8]} />
          <meshStandardMaterial color="#2d2d2d" roughness={0.4} />
        </mesh>
        {/* Door frame */}
        <mesh position={[0.01, 0, 0]}>
          <boxGeometry args={[0.01, 1.9, 0.9]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Handle */}
        <mesh position={[0.02, 0.1, 0.25]}>
          <cylinderGeometry args={[0.015, 0.015, 0.12, 16]} rotation={[0, 0, Math.PI/2]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      
      {/* LED AD SCREEN above glass */}
      <mesh position={[0, 0.6, depth/2 + 0.03]}>
        <planeGeometry args={[1.0, 0.25]} />
        <meshBasicMaterial color="#ff4500" />
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.9, 0.2]} />
          <meshBasicMaterial color="#ff6600" />
        </mesh>
      </mesh>
      
      {/* Interior glow */}
      <pointLight position={[0, 0, 0]} intensity={0.8} distance={4} color="#ffaa77" />
    </group>
  )
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[3.5, 2.5, 4]} fov={40} />
      <OrbitControls 
        enablePan 
        enableZoom 
        enableRotate
        minDistance={2.5}
        maxDistance={8}
        target={[0, 1.5, 0]}
        autoRotate
        autoRotateSpeed={0.5}
      />
      
      {/* Lighting setup */}
      <ambientLight intensity={0.3} />
      
      {/* Key light */}
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={15}
        shadow-camera-near={0.1}
        shadow-bias={-0.001}
      />
      
      {/* Fill light */}
      <directionalLight position={[-3, 4, -3]} intensity={0.4} color="#ff6b35" />
      
      {/* Rim light for edges */}
      <spotLight 
        position={[0, 5, -5]} 
        angle={0.6} 
        penumbra={0.5} 
        intensity={0.6}
        color="#ffffff"
      />
      
      <Environment preset="city" />
      
      <Kiosk />
      
      <ContactShadows 
        position={[0, 0, 0]} 
        opacity={0.5} 
        scale={8} 
        blur={3} 
        far={5} 
      />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.8} />
      </mesh>
    </>
  )
}

export default function QFXKioskAccurate() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: 'linear-gradient(to bottom, #1a1a2e, #0f0f1e)',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10,
        background: 'rgba(0, 0, 0, 0.85)',
        padding: '20px',
        borderRadius: '8px',
        color: 'white',
        fontFamily: 'Inter, system-ui, sans-serif',
        maxWidth: '300px',
        border: '1px solid #ff6b35'
      }}>
        <h1 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '24px', 
          color: '#ff6b35',
          fontWeight: '700',
          letterSpacing: '2px'
        }}>
          QFX CINEMAS
        </h1>
        <h2 style={{ 
          margin: '0 0 12px 0', 
          fontSize: '14px', 
          color: '#aaa',
          fontWeight: '400'
        }}>
          Box Office Kiosk | Labim Mall, Nepal
        </h2>
        
        <div style={{ 
          fontSize: '13px', 
          lineHeight: '1.5',
          color: '#ccc',
          borderTop: '1px solid #333',
          paddingTop: '12px'
        }}>
          <strong style={{ color: '#ff6b35' }}>Dimensions:</strong> 2000×2000×3000mm<br/>
          <strong style={{ color: '#ff6b35' }}>Materials:</strong> ACP Panels, 12mm Glass<br/>
          <strong style={{ color: '#ff6b35' }}>Features:</strong> LED Ad Screen, AC Unit
        </div>
        
        <div style={{ 
          marginTop: '12px',
          fontSize: '11px', 
          color: '#666',
          fontStyle: 'italic'
        }}>
          Left click to rotate • Scroll to zoom
        </div>
      </div>

      <Canvas 
        shadows 
        dpr={[1, 2]} 
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1
        }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}