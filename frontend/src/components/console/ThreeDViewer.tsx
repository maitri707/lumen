"use client";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, Html, Center, Bounds } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef } from "react";
import * as THREE from "three";

function Model({ url, structures }: { url: string; structures?: Record<string, boolean> }) {
  const { scene } = useGLTF(url);
  const clonedScene = useRef(scene.clone(true));

  useEffect(() => {
    const s = clonedScene.current;
    if (!structures) return;

    s.traverse((child: any) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();

        for (const [key, isVisible] of Object.entries(structures)) {
          const parts = key.split('_');
          const isMatch = parts.every(p => name.includes(p));
          if (isMatch) {
            child.visible = isVisible;
          }
        }
      }
    });
  }, [structures]);

  return <primitive object={clonedScene.current} />;
}

/**
 * ZoomController: Programmatically moves the camera closer/further based on the zoom prop.
 * Uses relative changes so it plays nicely with manual user scrolling.
 */
function ZoomController({ zoom }: { zoom: number }) {
  const { camera } = useThree();
  const prevZoom = useRef(zoom);

  useEffect(() => {
    if (prevZoom.current === zoom) return;

    // Calculate the relative change in zoom
    const zoomFactor = zoom / prevZoom.current; 
    
    // To zoom IN (zoom > prevZoom), we want distance to decrease.
    // So newDistance = currentDistance / zoomFactor
    const newDistance = camera.position.length() / zoomFactor;
    
    const direction = camera.position.clone().normalize();
    camera.position.copy(direction.multiplyScalar(newDistance));
    camera.updateProjectionMatrix();

    prevZoom.current = zoom;
  }, [zoom, camera]);

  return null;
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

export function ThreeDViewer({
  rotation,
  zoom = 1.0,
  structures
}: {
  rotation?: { x: number; y: number; z: number };
  zoom?: number;
  structures?: Record<string, boolean>;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const rotX = ((rotation?.x || 0) * Math.PI) / 180;
  const rotY = ((rotation?.y || 0) * Math.PI) / 180;
  const rotZ = ((rotation?.z || 0) * Math.PI) / 180;

  return (
    <div className="w-full aspect-square bg-slate-900 rounded-xl relative overflow-hidden shadow-inner border border-slate-800">
      <Canvas camera={{ position: [0, 2, 12], fov: 50, near: 0.01, far: 1000 }}>
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} />
        <Suspense fallback={<Loader />}>
          <Bounds fit clip margin={1.5}>
            <Center>
              <group rotation={[rotX, rotY, rotZ]}>
                <Model url="/lungs.glb" structures={structures} />
              </group>
            </Center>
          </Bounds>
          <Environment preset="city" />
        </Suspense>
        <ZoomController zoom={zoom} />
        <OrbitControls enablePan={true} enableZoom={true} makeDefault />
      </Canvas>
    </div>
  );
}
