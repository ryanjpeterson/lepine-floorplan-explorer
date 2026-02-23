import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF, Preload, Center } from "@react-three/drei";
import { useBuilding } from "../context/BuildingContext";

// Define the correct path once to avoid mismatches
const MODEL_PATH = "/glb/untitled.glb";

const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  
  // Performance: Disable all shadow logic during traversal
  scene.traverse((node: any) => {
    if (node.isMesh) {
      node.castShadow = false;
      node.receiveShadow = false;
      
      // Optimization: Use lower precision for materials to save GPU cycles
      if (node.material) {
        node.material.precision = "lowp";
      }
    }
  });

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
        Loading...
      </p>
    </div>
  </div>
);

const Building3DScreen: React.FC = () => {
const { data } = useBuilding();

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
          dpr={[1, 2]} // Lock to 1 to prevent GPU spikes on high-DPI screens. Change to [1, 2] for higher quality
          gl={{ 
            antialias: true, // Disabling antialias saves significant GPU power
            powerPreference: "high-performance",
            alpha: true,
            stencil: false,
            depth: true
          }}
        >
          <PerspectiveCamera makeDefault position={[10, 10, 15]} fov={45} />
          
          {/* Lightweight Lighting: Standard lights are much faster than <Stage /> */}
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} intensity={2} />
          <directionalLight position={[-5, 5, 5]} intensity={1} />

          <Center top>
            <Model url={MODEL_PATH} />
          </Center>

          <OrbitControls
            enableDamping 
            dampingFactor={0.1} 
            makeDefault
            // Minimum distance the camera can get to the model
            minDistance={10} 
            // Maximum distance the camera can pull away from the model
            maxDistance={100}
          />
          
          <Preload all />
        </Canvas>
      </Suspense>
      
      <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-2xl">
          <p className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em]">
            {data?.name}
          </p>
          <p className="text-white/40 text-[9px] uppercase tracking-widest mt-0.5">
            {data?.address}
          </p>
        </div>
      </div>
    </div>
  );
};

// Pre-load the GLB asset
useGLTF.preload(MODEL_PATH);

export default Building3DScreen;