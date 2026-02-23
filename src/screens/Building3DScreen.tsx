/* src/screens/Building3DScreen.tsx */
import React, { Suspense, useMemo, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { 
  OrbitControls, 
  PerspectiveCamera, 
  useGLTF, 
  Preload, 
  Center,
  AdaptiveDpr,
  AdaptiveEvents,
  ContactShadows,
  Environment,
  useProgress
} from "@react-three/drei";
import { useBuilding } from "../context/BuildingContext";
import ContentLoader from "../components/ContentLoader";

const STATIC_FALLBACK_PATH = "/glb/untitled.glb";
const DRACO_DECODER_PATH = "https://www.gstatic.com/draco/versioned/decoders/1.5.7/";
const DISABLE_3D = import.meta.env.VITE_DISABLE_3D === "true";
const IS_DEBUG = import.meta.env.VITE_DEBUG === "true";

useGLTF.preload(STATIC_FALLBACK_PATH, DRACO_DECODER_PATH);

const SceneContent = ({ modelUrl, cameraConfig }: { modelUrl: string, cameraConfig?: any }) => {
  const { size, camera } = useThree();
  const controlsRef = useRef<any>(null);
  
  // Responsive factor to ensure the building fits on mobile screens
  const aspect = size.width / size.height;
  const responsiveFactor = aspect < 1 ? Math.max(1, 1.2 / aspect) : 1;

  // Destructure config with fallbacks
  const position = cameraConfig?.position || [60, 60, 60];
  const minDistance = (cameraConfig?.minDistance || 50) * responsiveFactor;
  const maxDistance = (cameraConfig?.maxDistance || 100) * responsiveFactor;

  useEffect(() => {
    if (!IS_DEBUG) return;
    const logCamera = () => {
      const p = camera.position;
      console.log(`%c[3D DEBUG] Camera Position:`, "color: #00dbb5; font-weight: bold;");
      console.log(`"position": [${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}]`);
    };
    const controls = controlsRef.current;
    if (controls) {
      controls.addEventListener('change', logCamera);
      return () => controls.removeEventListener('change', logCamera);
    }
  }, [camera]);

  return (
    <>
      {/* Restore PerspectiveCamera with config values */}
      <PerspectiveCamera 
        makeDefault 
        position={[
          position[0] * responsiveFactor, 
          position[1] * responsiveFactor, 
          position[2] * responsiveFactor
        ]} 
        fov={45} 
      />

      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <Center top><Model url={modelUrl} /></Center>
      
      <ContactShadows opacity={0.4} scale={100} blur={2.5} far={10} resolution={256} color="#000000" />
      
      {/* Apply minDistance and maxDistance to OrbitControls */}
      <OrbitControls 
        ref={controlsRef} 
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
  const { scene } = useGLTF(url, DRACO_DECODER_PATH);
  useMemo(() => {
    scene.traverse((node: any) => {
      if (node.isMesh && node.material) {
        node.material.precision = "lowp";
      }
    });
  }, [scene]);
  return <primitive object={scene} />;
};

const Building3DScreen: React.FC = () => {
  const { data } = useBuilding();
  const { progress, active } = useProgress();
  
  if (DISABLE_3D) return null;

  const modelUrl = data?.config?.modelUrl || STATIC_FALLBACK_PATH;
  const cameraConfig = data?.config?.camera;

  return (
    <div className="h-full w-full relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/sky.jpg" alt="Sky" className="w-full h-full object-cover opacity-80 blur-sm" />
      </div>

      <Canvas 
        flat={false} dpr={[1, 2]} 
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="relative z-10"
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <Suspense fallback={null}>
          <SceneContent modelUrl={modelUrl} cameraConfig={cameraConfig} />
        </Suspense>
        <Preload all />
      </Canvas>

      {active && (
        <ContentLoader label={`Loading ${Math.round(progress)}%`} progress={progress} />
      )}
    </div>
  );
};

export default Building3DScreen;