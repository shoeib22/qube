"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import { ThreeElements } from '@react-three/fiber'

// Explicitly extend JSX.IntrinsicElements to fix type errors
declare global {
    namespace JSX {
        interface IntrinsicElements extends ThreeElements { }
    }
}

function Model() {
    const { scene } = useGLTF("/models/modern_villa.glb");
    return <primitive object={scene} scale={0.5} position={[0, -2, 0]} />;
}

export default function Scene() {
    return (
        <div className="w-full h-full">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[10, 5, 10]} fov={50} />
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                />
                <Suspense fallback={null}>
                    <Model />
                    <Environment preset="sunset" />
                </Suspense>
                <OrbitControls
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                    maxPolarAngle={Math.PI / 2}
                />
            </Canvas>
        </div>
    );
}

useGLTF.preload("/models/modern_villa.glb");
