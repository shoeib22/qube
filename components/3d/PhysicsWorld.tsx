"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// --- HOOKS ---
function usePlayerControls() {
    const [movement, setMovement] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.code) {
                case "KeyW":
                case "ArrowUp":
                    setMovement((m) => ({ ...m, forward: true }));
                    break;
                case "KeyS":
                case "ArrowDown":
                    setMovement((m) => ({ ...m, backward: true }));
                    break;
                case "KeyA":
                case "ArrowLeft":
                    setMovement((m) => ({ ...m, left: true }));
                    break;
                case "KeyD":
                case "ArrowRight":
                    setMovement((m) => ({ ...m, right: true }));
                    break;
                case "Space":
                    setMovement((m) => ({ ...m, jump: true }));
                    break;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            switch (e.code) {
                case "KeyW":
                case "ArrowUp":
                    setMovement((m) => ({ ...m, forward: false }));
                    break;
                case "KeyS":
                case "ArrowDown":
                    setMovement((m) => ({ ...m, backward: false }));
                    break;
                case "KeyA":
                case "ArrowLeft":
                    setMovement((m) => ({ ...m, left: false }));
                    break;
                case "KeyD":
                case "ArrowRight":
                    setMovement((m) => ({ ...m, right: false }));
                    break;
                case "Space":
                    setMovement((m) => ({ ...m, jump: false }));
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return movement;
}

// --- COMPONENTS ---

// 1. The Player Cube (with manual physics)
function Player() {
    const { forward, backward, left, right, jump } = usePlayerControls();
    const meshRef = useRef<THREE.Mesh>(null);
    const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
    const { camera } = useThree();

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        const speed = 8;
        const jumpForce = 10;
        const gravity = -20;

        // Movement direction
        const direction = new THREE.Vector3();
        const frontVector = new THREE.Vector3(
            0,
            0,
            (backward ? 1 : 0) - (forward ? 1 : 0)
        );
        const sideVector = new THREE.Vector3(
            (left ? 1 : 0) - (right ? 1 : 0),
            0,
            0
        );

        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(speed);

        // Apply movement
        velocityRef.current.x = direction.x;
        velocityRef.current.z = direction.z;

        // Apply gravity
        velocityRef.current.y += gravity * delta;

        // Ground collision (simple floor at y = 0.5)
        const nextY = meshRef.current.position.y + velocityRef.current.y * delta;
        if (nextY <= 0.5) {
            meshRef.current.position.y = 0.5;
            velocityRef.current.y = 0;

            // Jump only when on ground
            if (jump) {
                velocityRef.current.y = jumpForce;
            }
        } else {
            meshRef.current.position.y = nextY;
        }

        // Update position
        meshRef.current.position.x += velocityRef.current.x * delta;
        meshRef.current.position.z += velocityRef.current.z * delta;

        // Camera follow (smooth)
        camera.position.x = THREE.MathUtils.lerp(
            camera.position.x,
            meshRef.current.position.x,
            0.1
        );
        camera.position.z = THREE.MathUtils.lerp(
            camera.position.z,
            meshRef.current.position.z + 10,
            0.1
        );
        camera.position.y = THREE.MathUtils.lerp(
            camera.position.y,
            meshRef.current.position.y + 5,
            0.1
        );
        camera.lookAt(meshRef.current.position);
    });

    return (
        <mesh ref={meshRef} position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#00ff00" emissive="#00aa00" emissiveIntensity={0.3} />
        </mesh>
    );
}

// 2. The Floor
function Floor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.7} />
        </mesh>
    );
}

// 3. Obstacles (Static Cubes with rotation animation)
function Box({ position, color }: { position: [number, number, number]; color: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
        meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
    });

    return (
        <mesh ref={meshRef} position={position} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
        </mesh>
    );
}

// 4. Sphere obstacle
function Sphere({ position, color }: { position: [number, number, number]; color: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    });

    return (
        <mesh ref={meshRef} position={position} castShadow>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
        </mesh>
    );
}

// 5. Main Scene
export default function PhysicsWorld() {
    return (
        <div className="w-full h-screen bg-black">
            <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
                <ambientLight intensity={0.3} />
                <directionalLight
                    position={[10, 15, 10]}
                    intensity={1}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                />
                <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4080ff" />

                <Player />
                <Floor />

                {/* Add some decorative obstacles */}
                <Box position={[3, 0.5, -3]} color={0xff6b6b} />
                <Box position={[-3, 0.5, -3]} color={0x4ecdc4} />
                <Box position={[0, 0.5, -6]} color={0xffe66d} />
                <Sphere position={[5, 2, 2]} color={0x95e1d3} />
                <Sphere position={[-5, 2, 2]} color={0xf38181} />
                <Box position={[2, 0.5, 4]} color={0xaa96da} />
                <Box position={[-2, 0.5, 4]} color={0xfcbad3} />

                {/* Grid helper for spatial reference */}
                <gridHelper args={[100, 100, 0x333333, 0x222222]} position={[0, 0.01, 0]} />
            </Canvas>

            {/* Instructions Overlay */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-white text-center pointer-events-none select-none z-10 glass-panel p-6 rounded-xl max-w-md">
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    3D Playground
                </h1>
                <p className="text-sm text-gray-300 mb-2">Use <kbd className="kbd">WASD</kbd> or <kbd className="kbd">Arrow Keys</kbd> to Move</p>
                <p className="text-sm text-gray-300">Press <kbd className="kbd">Space</kbd> to Jump</p>
                <p className="text-xs text-gray-400 mt-3">Explore the colorful world!</p>
            </div>

            <style jsx>{`
        .glass-panel {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .kbd {
          display: inline-block;
          padding: 2px 6px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
          margin: 0 2px;
        }
      `}</style>
        </div>
    );
}
