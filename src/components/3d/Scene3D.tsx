import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, PerformanceMonitor } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { CodeHelix } from './CodeHelix';
import { InteractiveParticles } from './InteractiveParticles';

export function Scene3D() {
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
          <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={75} />
          
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            color="#00d4ff"
          />
          
          {/* 3D Elements */}
          <Suspense fallback={null}>
            <CodeHelix />
            <InteractiveParticles />
          </Suspense>
          
          {/* Controls - subtle, won't interfere with UI */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            rotateSpeed={0.3}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
