import React from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import BoxOfficeModel from "../models/BoxOfficeModel"

export default function BoxOfficeViewer() {

  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>

      {/* lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} />

      {/* environment reflections */}
      <Environment preset="city" />

      {/* model */}
      <BoxOfficeModel />

      {/* controls */}
      <OrbitControls />

    </Canvas>
  )
}