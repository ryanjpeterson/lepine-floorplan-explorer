/* src/screens/Building3DScreen.tsx */
import React, { Suspense, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
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

const STATIC_FALLBACK_PATH = "/glb/untitled.glb";
const DISABLE_3D = import.meta.env.VITE_DISABLE_3D === "true";

const SceneContent = ({ modelUrl, cameraConfig }: { modelUrl: string, cameraConfig?: any }) => {
  const { size } = useThree();
  
  // Calculate factor to zoom out on narrow mobile screens
  const aspect = size.width / size.height;
  const responsiveFactor = aspect < 1 ? Math.max(1, 1.2 / aspect) : 1;

  const position = cameraConfig?.position || [60, 60, 60];
  const minDistance = (cameraConfig?.minDistance || 50) * responsiveFactor;
  const maxDistance = (cameraConfig?.maxDistance || 100) * responsiveFactor;

  return (
    <>
      <PerspectiveCamera 
        makeDefault 
        position={[
          position[0] * responsiveFactor, 
          position[1] * responsiveFactor, 
          position[2] * responsiveFactor
        ]} 
        fov={45} 
      />
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
        minDistance={minDistance} 
        maxDistance={maxDistance}
      />
    </>
  );
};

const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  useMemo(() => {
    scene.traverse((node: any) => {
      if (node.isMesh) {
        node.castShadow = false;
        node.receiveShadow = false;
        if (node.material) {
          node.material.precision = "lowp";
          node.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);
  return <primitive object={scene} />;
};

const Building3DScreen: React.FC = () => {
  const { data } = useBuilding();
  
  // Return null immediately if 3D is disabled to prevent asset loading
  if (DISABLE_3D) return null;

  // Look for modelUrl in config file before falling back to static string
  const modelUrl = data?.config?.modelUrl || STATIC_FALLBACK_PATH;
  const cameraConfig = data?.config?.camera;

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Background and Canvas implementation... */}
      <Suspense fallback={null}>
        <Canvas flat={false} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <SceneContent modelUrl={modelUrl} cameraConfig={cameraConfig} />
          <Preload all />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Building3DScreen;