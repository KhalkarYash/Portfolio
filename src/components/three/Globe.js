import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'

export default function Globe() {
  const meshRef = useRef()

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.2
  })

  return (
    <group>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <meshStandardMaterial
          color="#4834d4"
          wireframe
          transparent
          opacity={0.8}
        />
      </Sphere>
      <Sphere args={[0.98, 64, 64]}>
        <meshStandardMaterial
          color="#030014"
          transparent
          opacity={0.9}
        />
      </Sphere>
    </group>
  )
}