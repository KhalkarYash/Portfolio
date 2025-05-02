'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'

function ParticleField() {
  const ref = useRef()
  const particles = useMemo(() => {
    const positions = new Float32Array(2000 * 3)
    random.inSphere(positions, { radius: 8 })
    return positions
  }, [])

  useFrame((state) => {
    const { clock } = state
    ref.current.rotation.x = Math.sin(clock.elapsedTime / 20) * 0.3
    ref.current.rotation.y = Math.sin(clock.elapsedTime / 15) * 0.3
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#fff"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </Points>
    </group>
  )
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ParticleField />
      </Canvas>
    </div>
  )
}