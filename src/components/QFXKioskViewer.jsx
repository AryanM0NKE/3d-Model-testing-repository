import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  ContactShadows,
  PerspectiveCamera,
  Box,
  Text,
  useTexture
} from '@react-three/drei'
import * as THREE from 'three'

// Material presets
const MATERIALS = {
  darkGrey: { color: '#2a2a2a', roughness: 0.3, metalness: 0.1 },
  orange: { color: '#e85d04', roughness: 0.4, metalness: 0.1 },
  glass: { 
    color: '#a8d5e5', 
    transparent: true, 
    opacity: 0.3, 
    roughness: 0.05, 
    metalness: 0.9,
    transmission: 0.9,
    thickness: 0.1
  },
  chrome: { color: '#c0c0c0', roughness: 0.1, metalness: 0.9 },
  blackMetal: { color: '#1a1a1a', roughness: 0.5, metalness: 0.6 },
  white: { color: '#f0f0f0', roughness: 0.8 },
  redGlow: { color: '#ff4500', emissive: '#ff2200', emissiveIntensity: 0.5 }
}

// QFX Signage Component
function QFXSign({ position }) {
  const group = useRef()
  
  return (
    <group ref={group} position={position}>
      {/* Backing plate */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[1.4, 0.4, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Q - Circular with tail */}
      <mesh position={[-0.45, 0, 0.02]}>
        <cylinderGeometry args={[0.12, 0.12, 0.05, 32]} />
        <meshStandardMaterial {...MATERIALS.redGlow} />
      </mesh>
      <mesh position={[-0.45, -0.08, 0.02]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.06, 0.12, 0.05]} />
        <meshStandardMaterial {...MATERIALS.redGlow} />
      </mesh>
      
      {/* F - Rectangular with bars */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.2, 0.24, 0.05]} />
        <meshStandardMaterial {...MATERIALS.redGlow} />
      </mesh>
      <mesh position={[0.02, 0.06, 0.04]}>
        <boxGeometry args={[0.16, 0.04, 0.02]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffaa00" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.02, -0.02, 0.04]}>
        <boxGeometry args={[0.16, 0.04, 0.02]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffaa00" emissiveIntensity={0.3} />
      </mesh>
      
      {/* X - Cross shape */}
      <mesh position={[0.45, 0, 0.02]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.08, 0.28, 0.05]} />
        <meshStandardMaterial {...MATERIALS.redGlow} />
      </mesh>
      <mesh position={[0.45, 0, 0.02]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.08, 0.28, 0.05]} />
        <meshStandardMaterial {...MATERIALS.redGlow} />
      </mesh>
    </group>
  )
}

// Main Kiosk Structure
function Kiosk() {
  // Dimensions based on drawing (approximate scale: 1 unit = 1 meter)
  const width = 2.2
  const depth = 2.0
  const height = 3.0
  const glassHeight = 1.8
  
  return (
    <group position={[0, 1.5, 0]}>
      {/* Main Body - Dark Grey */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial {...MATERIALS.darkGrey} />
      </mesh>
      
      {/* Orange Side Panels - Front Left */}
      <mesh position={[-width/2 + 0.15, 0, depth/2 + 0.01]}>
        <boxGeometry args={[0.3, height - 0.2, 0.02]} />
        <meshStandardMaterial {...MATERIALS.orange} />
      </mesh>
      
      {/* Orange Side Panels - Front Right */}
      <mesh position={[width/2 - 0.15, 0, depth/2 + 0.01]}>
        <boxGeometry args={[0.3, height - 0.2, 0.02]} />
        <meshStandardMaterial {...MATERIALS.orange} />
      </mesh>
      
      {/* Orange Side Panel - Right Side Full */}
      <mesh position={[width/2 + 0.01, 0, 0]}>
        <boxGeometry args={[0.02, height - 0.2, depth - 0.1]} />
        <meshStandardMaterial {...MATERIALS.orange} />
      </mesh>
      
      {/* Orange Side Panel - Left Side Full */}
      <mesh position={[-width/2 - 0.01, 0, 0]}>
        <boxGeometry args={[0.02, height - 0.2, depth - 0.1]} />
        <meshStandardMaterial {...MATERIALS.orange} />
      </mesh>
      
      {/* Glass Front Window */}
      <group position={[0, -0.3, depth/2 + 0.02]}>
        {/* Main glass */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[width - 0.8, glassHeight, 0.05]} />
          <meshPhysicalMaterial 
            color="#ffffff"
            metalness={0}
            roughness={0}
            transmission={0.95}
            thickness={0.1}
            transparent
            opacity={0.3}
            envMapIntensity={1}
          />
        </mesh>
        
        {/* Glass frame - Bottom */}
        <mesh position={[0, -0.7, 0]}>
          <boxGeometry args={[width - 0.8, 0.1, 0.08]} />
          <meshStandardMaterial {...MATERIALS.darkGrey} />
        </mesh>
        
        {/* Glass frame - Top */}
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[width - 0.8, 0.1, 0.08]} />
          <meshStandardMaterial {...MATERIALS.darkGrey} />
        </mesh>
        
        {/* Glass frame - Sides */}
        <mesh position={[-(width - 0.8)/2, 0.2, 0]}>
          <boxGeometry args={[0.1, glassHeight, 0.08]} />
          <meshStandardMaterial {...MATERIALS.darkGrey} />
        </mesh>
        <mesh position={[(width - 0.8)/2, 0.2, 0]}>
          <boxGeometry args={[0.1, glassHeight, 0.08]} />
          <meshStandardMaterial {...MATERIALS.darkGrey} />
        </mesh>
        
        {/* Transaction Counter inside */}
        <mesh position={[0, -0.4, -0.3]}>
          <boxGeometry args={[1.2, 0.05, 0.6]} />
          <meshStandardMaterial color="#8B4513" roughness={0.6} />
        </mesh>
        
        {/* Monitor/Display inside */}
        <mesh position={[0, -0.15, -0.4]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.05]} />
          <meshStandardMaterial color="#111" roughness={0.2} />
          {/* Screen glow */}
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[0.36, 0.26]} />
            <meshBasicMaterial color="#4a90e2" />
          </mesh>
        </mesh>
        
        {/* Mini LED Screen Ad (as per drawing annotation) */}
        <mesh position={[0, 0.8, 0.03]}>
          <planeGeometry args={[0.6, 0.2]} />
          <meshBasicMaterial color="#ff6600" />
        </mesh>
      </group>
      
      {/* Base/Plinth - MS Channel */}
      <mesh position={[0, -height/2 - 0.05, 0]}>
        <boxGeometry args={[width + 0.1, 0.1, depth + 0.1]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.4} />
      </mesh>
      
      {/* Base skirting - orange accent */}
      <mesh position={[0, -height/2 + 0.1, depth/2 + 0.02]}>
        <boxGeometry args={[width, 0.4, 0.02]} />
        <meshStandardMaterial {...MATERIALS.orange} />
      </mesh>
      
      {/* Roof/Cornice */}
      <mesh position={[0, height/2 + 0.05, 0]}>
        <boxGeometry args={[width + 0.2, 0.1, depth + 0.2]} />
        <meshStandardMaterial color="#1f1f1f" roughness={0.4} />
      </mesh>
      
      {/* QFX Signage on top */}
      <QFXSign position={[0, height/2 + 0.15, depth/2 + 0.05]} />
      
      {/* AC Unit / ODU on roof */}
      <mesh position={[0.5, height/2 + 0.25, 0]}>
        <boxGeometry args={[0.6, 0.3, 0.4]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.5} />
        {/* AC vents */}
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[0.5, 0.02, 0.3]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </mesh>
      
      {/* Side Door (Right side) */}
      <group position={[width/2 + 0.03, -0.2, 0]}>
        {/* Door frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.05, 2.0, 0.8]} />
          <meshStandardMaterial {...MATERIALS.darkGrey} />
        </mesh>
        {/* Door handle */}
        <mesh position={[0.03, 0.1, 0.25]}>
          <cylinderGeometry args={[0.02, 0.02, 0.15, 16]} rotation={[0, 0, Math.PI/2]} />
          <meshStandardMaterial {...MATERIALS.chrome} />
        </mesh>
        {/* Door lock */}
        <mesh position={[0.03, -0.1, 0.25]}>
          <cylinderGeometry args={[0.015, 0.015, 0.02, 16]} rotation={[0, 0, Math.PI/2]} />
          <meshStandardMaterial {...MATERIALS.blackMetal} />
        </mesh>
      </group>
      
      {/* Details: Side panels texture lines */}
      {[...Array(3)].map((_, i) => (
        <mesh key={i} position={[width/2 + 0.015, -0.5 + i*0.8, 0]}>
          <boxGeometry args={[0.025, 0.02, depth - 0.2]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
      
      {/* Interior lighting glow */}
      <pointLight position={[0, 0, 0]} intensity={0.5} distance={3} color="#ffaa77" />
    </group>
  )
}

// Environment and lighting setup
function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[4, 3, 5]} fov={35} />
      <OrbitControls 
        enablePan 
        enableZoom 
        enableRotate
        minDistance={3}
        maxDistance={10}
        target={[0, 1.5, 0]}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 10, 7]} 
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={20}
        shadow-camera-near={0.1}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#e85d04" />
      <spotLight 
        position={[0, 5, 0]} 
        angle={0.5} 
        penumbra={0.5} 
        intensity={0.8}
        castShadow
      />
      
      {/* Environment map for reflections */}
      <Environment preset="city" />
      
      {/* The Kiosk */}
      <Kiosk />
      
      {/* Ground shadow */}
      <ContactShadows 
        position={[0, 0, 0]} 
        opacity={0.4} 
        scale={6} 
        blur={2.5} 
        far={4} 
      />
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#151515" roughness={0.8} metalness={0.2} />
      </mesh>
    </>
  )
}

// Main Component
export default function QFXKioskViewer() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
      position: 'relative'
    }}>
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
        maxWidth: '320px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 174, 239, 0.3)'
      }}>
        <h1 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '20px', 
          color: '#e85d04',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          QFX Cinema Kiosk
        </h1>
        <p style={{ margin: '0 0 15px 0', fontSize: '14px', opacity: 0.9, lineHeight: 1.4 }}>
          Labim Mall, Nepal<br/>
          Box Office Structure
        </p>
        
        <div style={{ fontSize: '12px', opacity: 0.8, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '10px' }}>
          <strong style={{ color: '#00AEEF' }}>Controls:</strong><br/>
          • Left Click + Drag: Rotate<br/>
          • Right Click + Drag: Pan<br/>
          • Scroll: Zoom<br/>
          • Double Click: Reset View
        </div>
      </div>

      {/* Branding badge */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.8)',
        color: '#e85d04',
        padding: '10px 20px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 'bold',
        border: '1px solid #e85d04'
      }}>
        QFX Cinemas Nepal
      </div>

      <Canvas 
        shadows 
        dpr={[1, 2]} 
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}