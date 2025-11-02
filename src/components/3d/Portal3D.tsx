import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const codeSymbols = ['{ }', '< >', '( )', 'fn', 'const', 'let', 'if', '==', '=>', '&&', '[]', '||'];

export function Portal3D() {
  const torusRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  // Create flowing particles toward center
  const particleData = useMemo(() => {
    const positions: number[] = [];
    const velocities: number[] = [];
    const particleCount = 500;

    for (let i = 0; i < particleCount; i++) {
      // Spawn particles in a wider area
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 4;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (Math.random() - 0.5) * 2;

      positions.push(x, y, z);
      velocities.push(-x * 0.02, -y * 0.02, 0);
    }

    return { positions: new Float32Array(positions), velocities };
  }, []);

  useFrame((state) => {
    if (torusRef.current) {
      torusRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
      torusRef.current.rotation.y += 0.01;
      torusRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.15) * 0.2;
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.2;
      outerRingRef.current.rotation.y -= 0.008;
    }

    // Animate particles flowing toward center
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += particleData.velocities[i];
        positions[i + 1] += particleData.velocities[i + 1];

        // Reset particle if it reaches center
        const distFromCenter = Math.sqrt(
          positions[i] ** 2 + positions[i + 1] ** 2
        );

        if (distFromCenter < 0.5) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 3 + Math.random() * 4;
          positions[i] = Math.cos(angle) * radius;
          positions[i + 1] = Math.sin(angle) * radius;
          positions[i + 2] = (Math.random() - 0.5) * 2;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, -5]}>
      {/* Outer ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[2.5, 0.03, 16, 100]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Main portal torus */}
      <mesh ref={torusRef}>
        <torusGeometry args={[2, 0.1, 32, 100]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <ringGeometry args={[1.5, 2, 64]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Flowing particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleData.positions.length / 3}
            array={particleData.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#00d4ff"
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Pulsing light */}
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        color="#00d4ff"
        distance={8}
      />
    </group>
  );
}
