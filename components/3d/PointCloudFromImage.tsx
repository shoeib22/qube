"use client";

import { Canvas, useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react"; // Removed useMemo

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
  const mouse = useRef(new THREE.Vector2(9999, 9999));
  const hoverIntensity = useRef(0);

  // OPTIMIZATION: Determine Mobile vs Desktop for performance tuning
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // TUNING
  const SKIP_FACTOR = isMobile ? 4 : 2; 
  const SCALE_FACTOR = 0.0018; 
  const MIN_POINT_SIZE = SKIP_FACTOR * SCALE_FACTOR * 1.1; 
  const MAX_POINT_SIZE = isMobile ? 0.08 : 0.05; 
  const TRIGGER_RADIUS = isMobile ? 3.0 : 2.5; 

  useEffect(() => {
    // Mouse Handlers
    const handleMove = (e: MouseEvent) => {
      mouse.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };

    // Touch Handlers
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouse.current.set(
            (touch.clientX / window.innerWidth) * 2 - 1,
            -(touch.clientY / window.innerHeight) * 2 + 1
        );
      }
    };

    const handleEnd = () => {
       mouse.current.set(9999, 9999);
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleEnd);
    
    window.addEventListener("touchmove", handleTouch, { passive: false });
    window.addEventListener("touchstart", handleTouch, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseleave", handleEnd);
        window.removeEventListener("touchmove", handleTouch);
        window.removeEventListener("touchstart", handleTouch);
        window.removeEventListener("touchend", handleEnd);
    }
  }, []);

  useEffect(() => {
    const img = new Image();
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

      for (let y = 0; y < canvas.height; y += SKIP_FACTOR) {
        for (let x = 0; x < canvas.width; x += SKIP_FACTOR) {
          const i = (y * canvas.width + x) * 4;
          const a = pixels[i + 3];

          if (a < 50) continue; 

          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];

          const tx = x * SCALE_FACTOR - offsetX;
          const ty = offsetY - y * SCALE_FACTOR;

          pts.push({
            current: [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2],
            target: [tx, ty, 0],
            velocity: [0, 0, 0],
          });

          const c = new THREE.Color(`rgb(${r},${g},${b})`);
          c.multiplyScalar(1.2); 
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
  }, [SKIP_FACTOR]); 

  useFrame(({ camera }) => {
    if (!meshRef.current || !positions || !materialRef.current) return;

    const pts = ptsRef.current;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse.current, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hitPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, hitPoint);

    const mx = hitPoint.x;
    const my = hitPoint.y;
    const distFromCenter = hitPoint.length();
    
    const targetIntensity = distFromCenter < TRIGGER_RADIUS ? 1 : 0;
    hoverIntensity.current = THREE.MathUtils.lerp(hoverIntensity.current, targetIntensity, 0.1);
    const intensity = hoverIntensity.current;

    if (intensity < 0.001 && distFromCenter > TRIGGER_RADIUS + 1) return;

    const currentRepelRadius = THREE.MathUtils.lerp(0.05, 0.4, intensity); 
    const currentForce = THREE.MathUtils.lerp(0.001, 0.025, intensity); 
    const currentReturnSpeed = THREE.MathUtils.lerp(0.2, 0.015, intensity);

    materialRef.current.size = THREE.MathUtils.lerp(MIN_POINT_SIZE, MAX_POINT_SIZE, intensity);

    const posAttr = meshRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const [tx, ty, tz] = p.target;
        let [cx, cy, cz] = p.current;
        let [vx, vy, vz] = p.velocity;
  
        const dx = cx - mx;
        const dy = cy - my;
        const dz = cz - hitPoint.z; 
        
        const distSq = dx*dx + dy*dy + dz*dz;

        if (intensity > 0.01 && distSq < (currentRepelRadius * currentRepelRadius)) {
             const dist = Math.sqrt(distSq);
             if (dist > 0.0001) { 
                 const push = (currentRepelRadius - dist) * currentForce;
                 const noise = (Math.random() - 0.5) * 0.005 * intensity;
                 vx += (dx / dist) * push + noise;
                 vy += (dy / dist) * push + noise;
                 vz += (dz / dist) * push + noise;
             }
        }
  
        vx += (tx - cx) * currentReturnSpeed;
        vy += (ty - cy) * currentReturnSpeed;
        vz += (tz - cz) * currentReturnSpeed;
  
        vx *= 0.9;
        vy *= 0.9;
        vz *= 0.9;
  
        cx += vx;
        cy += vy;
        cz += vz;
  
        p.current[0] = cx; p.current[1] = cy; p.current[2] = cz;
        p.velocity[0] = vx; p.velocity[1] = vy; p.velocity[2] = vz;
  
        const j = i * 3;
        arr[j] = cx;
        arr[j + 1] = cy;
        arr[j + 2] = cz;
    };

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
        size={MIN_POINT_SIZE} 
        vertexColors
        transparent
        opacity={1}
        depthTest={true}
        depthWrite={true}
        sizeAttenuation={true} 
      />
    </points>
  );
}

export default function PointCloudFromImage() {
  return (
    <Canvas 
        dpr={[1, 2]} 
        camera={{ position: [0, 0, 3.5], fov: 50 }} 
        style={{ height: "100vh", background: "#111", touchAction: 'pan-y' }}
    >
      <ambientLight intensity={2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <ImagePointCloud />
    </Canvas>
  );
}