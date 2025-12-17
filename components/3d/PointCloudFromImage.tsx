"use client";

import { Canvas, useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";

// We need to extend Three's materials to allow animated prop updates if needed,
// though direct ref manipulation works fine here.
extend({ PointsMaterial: THREE.PointsMaterial });

type Particle = {
  current: [number, number, number];
  target: [number, number, number];
  velocity: [number, number, number];
};

function ImagePointCloud() {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const [positions, setPositions] = useState<Float32Array | null>(null);
  const [colors, setColors] = useState<Float32Array | null>(null);

  const ptsRef = useRef<Particle[]>([]);
  const mouse = useRef(new THREE.Vector2(9999, 9999)); // Start mouse far away
  const hoverIntensity = useRef(0); // 0 = solid image, 1 = fully exploded

  // Constants for tuning
  const SKIP_FACTOR = 2; // Lower = higher res, more points. Try 1, 2, or 4.
  const SCALE_FACTOR = 0.0018; // Adjusts overall size of the image in 3D space
  // minSize needs to be slightly larger than grid spacing (SKIP * SCALE) to overlap solid
  const MIN_POINT_SIZE = SKIP_FACTOR * SCALE_FACTOR * 1.1; 
  const MAX_POINT_SIZE = 0.05; // The "box" size when exploded
  const TRIGGER_RADIUS = 2.5; // How close mouse needs to be to center to trigger effect

  // Track mouse in NDC
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    // Handle mouse leaving window to ensure image snaps back
    const handleLeave = () => {
        mouse.current.set(9999, 9999);
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseleave", handleLeave);
    }
  }, []);

  // Load PNG → Build dense point cloud
  useEffect(() => {
    const img = new Image();
    // Make sure this path is correct for your project
    img.src = "/logo/qube.png"; 

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      const pts: Particle[] = [];
      const colorList: number[] = [];

      const w = canvas.width * SCALE_FACTOR;
      const h = canvas.height * SCALE_FACTOR;
      const offsetX = w / 2;
      const offsetY = h / 2;

      // Use the smaller skip factor for high resolution
      for (let y = 0; y < canvas.height; y += SKIP_FACTOR) {
        for (let x = 0; x < canvas.width; x += SKIP_FACTOR) {
          const i = (y * canvas.width + x) * 4;
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          if (a < 50) continue; // Skip transparent pixels

          const tx = x * SCALE_FACTOR - offsetX;
          const ty = offsetY - y * SCALE_FACTOR;

          pts.push({
            // Start points randomly scattered, but closer to center for smoother initial assembly
            current: [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2],
            target: [tx, ty, 0],
            velocity: [0, 0, 0],
          });

          const c = new THREE.Color(`rgb(${r},${g},${b})`);
          // Slightly boost colors as point clouds can look dimmer than solid images
          c.multiplyScalar(1.1); 
          colorList.push(c.r, c.g, c.b);
        }
      }

      ptsRef.current = pts;

      const pos = new Float32Array(pts.length * 3);
      pts.forEach((p, i) => {
        const j = i * 3;
        pos[j] = p.current[0];
        pos[j + 1] = p.current[1];
        pos[j + 2] = p.current[2];
      });

      setPositions(pos);
      setColors(new Float32Array(colorList));
    };
  }, []);

  // Animation Loop
  useFrame(({ camera,}) => {
    if (!meshRef.current || !positions || !materialRef.current) return;

    const pts = ptsRef.current;

    // 1. Calculate Mouse Hit Point & Hover Intensity
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse.current, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hitPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, hitPoint);

    const mx = hitPoint.x;
    const my = hitPoint.y;

    // Calculate distance of mouse from center of image (0,0,0)
    const distFromCenter = hitPoint.length();
    
    // Target intensity: 1 if mouse is near center, 0 if far away
    const targetIntensity = distFromCenter < TRIGGER_RADIUS ? 1 : 0;
    
    // Smoothly transition current intensity towards target (Lerp)
    // The 0.1 determines how fast it transitions between states
    hoverIntensity.current = THREE.MathUtils.lerp(hoverIntensity.current, targetIntensity, 0.1);
    const intensity = hoverIntensity.current;


    // 2. Dynamically Adjust Physics Parameters based on Intensity
    // If intensity is 0 (solid), repel is tiny, return speed is fast.
    // If intensity is 1 (exploded), repel is big, return speed is slow.
    const currentRepelRadius = THREE.MathUtils.lerp(0.05, 0.4, intensity); 
    const currentForce = THREE.MathUtils.lerp(0.001, 0.025, intensity); 
    const currentReturnSpeed = THREE.MathUtils.lerp(0.2, 0.015, intensity); // Snap back fast when solid


    // 3. Dynamically Adjust Point Size
    // Smoothly interpolate between tiny dots (solid look) and big boxes (exploded look)
    materialRef.current.size = THREE.MathUtils.lerp(MIN_POINT_SIZE, MAX_POINT_SIZE, intensity);


    // 4. Run Physics Simulation
    const posAttr = meshRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    pts.forEach((p, i) => {
      const [tx, ty, tz] = p.target;
      let [cx, cy, cz] = p.current;
      let [vx, vy, vz] = p.velocity;

      const dx = cx - mx;
      const dy = cy - my;
      // Add a slight z-influence so mouse pushes them in depth too
      const dz = cz - hitPoint.z; 
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Mouse repel force
      if (dist < currentRepelRadius && intensity > 0.01) {
        const push = (currentRepelRadius - dist) * currentForce;
        // Add some noise for jittery effect when exploding
        const noise = (Math.random() - 0.5) * 0.005 * intensity;
        vx += (dx / dist) * push + noise;
        vy += (dy / dist) * push + noise;
        vz += (dz / dist) * push + noise;
      }

      // Return to target force (variable speed based on intensity)
      vx += (tx - cx) * currentReturnSpeed;
      vy += (ty - cy) * currentReturnSpeed;
      vz += (tz - cz) * currentReturnSpeed;

      // Damping (friction)
      vx *= 0.9;
      vy *= 0.9;
      vz *= 0.9;

      cx += vx;
      cy += vy;
      cz += vz;

      p.current = [cx, cy, cz];
      p.velocity = [vx, vy, vz];

      const j = i * 3;
      arr[j] = cx;
      arr[j + 1] = cy;
      arr[j + 2] = cz;
    });

    posAttr.needsUpdate = true;
  });

  if (!positions || !colors) return null;

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>

      <pointsMaterial
        ref={materialRef}
        // Initial size doesn't matter much as it's overridden in useFrame immediately
        size={MIN_POINT_SIZE} 
        vertexColors
        transparent
        opacity={1}
        // Important for point clouds to look solid when dense
        depthTest={true}
        depthWrite={true}
        // sizeAttenuation makes points smaller when further away. 
        // Keeping it true gives 3D depth feeling.
        sizeAttenuation={true} 
      />
    </points>
  );
}

export default function PointCloudFromImage() {
  return (
    // Adjust camera Z position if the image feels too large or small
    <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }} style={{ height: "100vh", background: "#111" }}>
      <ambientLight intensity={2} />
      {/* Add distinct light source to give the "boxes" definition when exploded */}
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <ImagePointCloud />
    </Canvas>
  );
}