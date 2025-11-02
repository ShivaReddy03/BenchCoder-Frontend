import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function FloatingShapes() {
  const cubeRef1 = useRef<THREE.Mesh>(null);
  const cubeRef2 = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const octahedronRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (cubeRef1.current) {
      cubeRef1.current.rotation.x = time * 0.2;
      cubeRef1.current.rotation.y = time * 0.3;
      cubeRef1.current.position.y = Math.sin(time * 0.5) * 0.5 - 2;
    }

    if (cubeRef2.current) {
      cubeRef2.current.rotation.x = time * -0.15;
      cubeRef2.current.rotation.z = time * 0.25;
      cubeRef2.current.position.y = Math.cos(time * 0.4) * 0.5 + 2;
    }

    if (sphereRef.current) {
      sphereRef.current.rotation.y = time * 0.3;
      sphereRef.current.position.x = Math.sin(time * 0.3) * 0.3 - 5;
      sphereRef.current.position.y = Math.cos(time * 0.3) * 0.3;
    }

    if (octahedronRef.current) {
      octahedronRef.current.rotation.x = time * 0.25;
      octahedronRef.current.rotation.y = time * -0.2;
      octahedronRef.current.position.x = Math.cos(time * 0.35) * 0.3 + 5;
      octahedronRef.current.position.y = Math.sin(time * 0.35) * 0.3;
    }
  });

  const wireframeMaterial = (
    <meshBasicMaterial
      color="#00d4ff"
      wireframe
      transparent
      opacity={0.15}
    />
  );

  return (
    <group>
      {/* Cube 1 - top left */}
      <mesh ref={cubeRef1} position={[-6, -2, -8]}>
        <boxGeometry args={[1, 1, 1]} />
        {wireframeMaterial}
      </mesh>

      {/* Cube 2 - top right */}
      <mesh ref={cubeRef2} position={[6, 2, -8]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshBasicMaterial
          color="#ff00ff"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Sphere - left */}
      <mesh ref={sphereRef} position={[-5, 0, -7]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        {wireframeMaterial}
      </mesh>

      {/* Octahedron - right */}
      <mesh ref={octahedronRef} position={[5, 0, -7]}>
        <octahedronGeometry args={[0.6]} />
        <meshBasicMaterial
          color="#ff00ff"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}
