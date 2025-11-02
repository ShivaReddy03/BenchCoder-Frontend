import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, PerformanceMonitor } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { Portal3D } from './Portal3D';
import { InteractiveParticles } from './InteractiveParticles';
import { FloatingShapes } from './FloatingShapes';

export function AuthScene3D() {
  const [dpr, setDpr] = useState(1.5);

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        dpr={dpr}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <PerformanceMonitor
          onIncline={() => setDpr(2)}
          onDecline={() => setDpr(1)}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />
          
          {/* Lighting */}
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#00d4ff" />
          <pointLight position={[-10, -10, -10]} intensity={0.4} color="#ff00ff" />
          <spotLight
            position={[0, 10, 5]}
            angle={0.4}
            penumbra={1}
            intensity={0.8}
            color="#00d4ff"
          />
          
          {/* 3D Elements */}
          <Suspense fallback={null}>
            <Portal3D />
            <InteractiveParticles />
            <FloatingShapes />
          </Suspense>
          
          {/* Subtle controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            rotateSpeed={0.2}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
