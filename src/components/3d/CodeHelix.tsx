import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const codeSymbols = ['{ }', '< >', '( )', 'fn', 'const', 'let', 'if', '==', '=>', '&&'];

export function CodeHelix() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate helix points
  const helixData = useMemo(() => {
    const points: Array<{ position: [number, number, number]; symbol: string; rotation: number }> = [];
    const radius = 2;
    const height = 8;
    const turns = 3;
    const pointsPerTurn = 20;
    const totalPoints = turns * pointsPerTurn;
    
    for (let i = 0; i < totalPoints; i++) {
      const angle = (i / pointsPerTurn) * Math.PI * 2;
      const y = (i / totalPoints) * height - height / 2;
      const x = Math.cos(angle + (i % 2) * Math.PI) * radius;
      const z = Math.sin(angle + (i % 2) * Math.PI) * radius;
      
      points.push({
        position: [x, y, z],
        symbol: codeSymbols[i % codeSymbols.length],
        rotation: angle,
      });
    }
    return points;
  }, []);

  // Create connecting lines
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    
    for (let i = 0; i < helixData.length - 1; i++) {
      positions.push(...helixData[i].position);
      positions.push(...helixData[i + 1].position);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [helixData]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Connecting lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#00d4ff" transparent opacity={0.3} />
      </lineSegments>
      
      {/* Code symbols */}
      {helixData.map((point, i) => (
        <group key={i} position={point.position}>
          <Text
            fontSize={0.3}
            color={i % 2 === 0 ? '#00d4ff' : '#ff00ff'}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {point.symbol}
          </Text>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#00d4ff' : '#ff00ff'}
              emissive={i % 2 === 0 ? '#00d4ff' : '#ff00ff'}
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
