/* src/screens/Building3DScreen.tsx */
import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { 
  OrbitControls, 
  PerspectiveCamera, 
  useGLTF, 
  Preload, 
  Center,
  AdaptiveDpr,
  AdaptiveEvents
} from "@react-three/drei";
import { useBuilding } from "../context/BuildingContext";

// Define the correct path once to avoid mismatches
const MODEL_PATH = "/glb/untitled.glb";

const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  
  // Performance: Memoize scene traversal to prevent re-processing on every render
  useMemo(() => {
    scene.traverse((node: any) => {
      if (node.isMesh) {
        node.castShadow = false;
        node.receiveShadow = false;
        
        // Optimization: Use lower precision for materials to save GPU cycles
        if (node.material) {
          node.material.precision = "lowp";
          node.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
};

const LoadingOverlay = () => (
  <div 
    className="absolute inset-0 flex items-center justify-center text-white font-bold z-50 overflow-hidden"
  >
    {/* Blurred background image for the loader */}
    <div 
      className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-50" 
      style={{ backgroundImage: 'url(/sky.jpg)' }} 
    />
    
    <div className="relative flex flex-col items-center gap-3 bg-black/30 backdrop-blur-md p-10 rounded-3xl border border-white/10">
      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      <p className="text-sm tracking-widest uppercase opacity-80 text-center">
        Loading 3D Model...
      </p>
    </div>
  </div>
);

const Building3DScreen: React.FC = () => {
  const { data } = useBuilding();
  
  // Use modelUrl from context if available, otherwise fallback to local asset
  const modelUrl = data?.config?.modelUrl || MODEL_PATH;

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Blurred Background Image Container */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-md scale-105"
        style={{ backgroundImage: 'url(/sky.jpg)' }}
      />

      <Suspense fallback={<LoadingOverlay />}>
        <Canvas 
          flat={false} // Disables complex tone mapping for faster rendering
          dpr={[1, 2]} // Quality scaling: 1 for performance, 2 for high-DPI
          gl={{ 
            antialias: true,
            powerPreference: "high-performance",
            alpha: true,
            stencil: false,
            depth: true
          }}
        >
          {/* Performance: Drop pixel ratio and disable events during camera movement */}
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />

          {/* Camera starts at ~100 units distance to match requested default zoom */}
          <PerspectiveCamera makeDefault position={[60, 60, 60]} fov={45} />
          
          {/* Lightweight Lighting: Standard lights are much faster than <Stage /> */}
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} intensity={2} />
          <directionalLight position={[-5, 5, 5]} intensity={1} />

          <Center top>
            <Model url={modelUrl} />
          </Center>

          <OrbitControls
            enableDamping 
            dampingFactor={0.1} 
            makeDefault
            // Zoom range: start at 100, allow zoom in to 50
            minDistance={50} 
            maxDistance={100}
          />
          
          <Preload all />
        </Canvas>
      </Suspense>
    </div>
  );
};

// Pre-load the GLB asset
useGLTF.preload(MODEL_PATH);

export default Building3DScreen;