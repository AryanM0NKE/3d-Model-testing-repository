import React from "react"
import { useGLTF } from "@react-three/drei"

export default function BoxOfficeModel(props) {

  // load model from public folder
  const { scene } = useGLTF("/BOX-OFFICE.glb")

  return (
    <primitive
      object={scene}
      scale={1}
      position={[0, 0, 0]}
      {...props}
    />
  )
}

// preload for better performance
useGLTF.preload("/BOX-OFFICE.glb")