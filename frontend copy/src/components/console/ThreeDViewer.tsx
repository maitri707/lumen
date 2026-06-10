"use client";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, Html } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  
  // Scale increased significantly to make the lung model fill the screen
  return <primitive object={scene} scale={15} position={[0, -2, 0]} />;
}

function Loader() {
  return (
    <Html center>
      <div className="text-sky-400 font-mono text-[10px] tracking-widest whitespace-nowrap animate-pulse flex flex-col items-center gap-2">
        <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        LOADING 3D ASSET
      </div>
    </Html>
  );
}

export function ThreeDViewer({ rotation }: { rotation?: { x: number; y: number; z: number } }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;

  // Convert degrees from backend to radians
  const rotX = ((rotation?.x || 0) * Math.PI) / 180;
  const rotY = ((rotation?.y || 0) * Math.PI) / 180;
  const rotZ = ((rotation?.z || 0) * Math.PI) / 180;

  return (
    <div className="w-full aspect-square bg-slate-900 rounded-xl relative overflow-hidden shadow-inner border border-slate-800">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={1} />
        <Suspense fallback={<Loader />}>
          <group rotation={[rotX, rotY, rotZ]}>
            <Model url="/lungs.glb" />
          </group>
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} />
      </Canvas>
    </div>
  );
}
