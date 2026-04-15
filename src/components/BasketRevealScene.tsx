"use client";

import React, { useRef, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";
import { useRevealStore } from "@/lib/reveal-store";
import { CAMERA_CONFIG, ANIMATION_CONFIG } from "@/lib/animation-config";
import { ZONE_COLORS } from "@/components/DebugAnchorPanel";

/** ErrorBoundary that catches GLB load failures and renders FallbackBox instead */
class ModelErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/** Fallback box when GLB is not available */
function FallbackBox() {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const { stage } = useRevealStore();

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Subtle idle rotation
    if (stage === "complete" || stage === "box-appear") {
      groupRef.current.rotation.y += ANIMATION_CONFIG.idleRotationSpeed * delta;
    }
  });

  useFrame(() => {
    if (!lidRef.current) return;

    const targetAngle =
      stage === "lid-open" || stage === "revealing" || stage === "complete"
        ? -Math.PI / 2.5
        : 0;

    lidRef.current.rotation.x = THREE.MathUtils.lerp(
      lidRef.current.rotation.x,
      targetAngle,
      0.04
    );
  });

  return (
    <group ref={groupRef}>
      {/* Base box */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[1.6, 0.5, 1.2]} />
        <meshStandardMaterial color="#E8E2DA" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Inner compartment lines */}
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[1.58, 0.48, 1.18]} />
        <meshStandardMaterial
          color="#F5F0EB"
          roughness={0.5}
          metalness={0.0}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Lid - pivot from back edge */}
      <group position={[0, 0.5, -0.6]} ref={lidRef}>
        <mesh position={[0, 0.04, 0.6]}>
          <boxGeometry args={[1.64, 0.08, 1.24]} />
          <meshStandardMaterial color="#D4CCC2" roughness={0.3} metalness={0.15} />
        </mesh>
        {/* Ribbon on top */}
        <mesh position={[0, 0.09, 0.6]}>
          <boxGeometry args={[0.12, 0.02, 1.24]} />
          <meshStandardMaterial color="#C4A35A" roughness={0.3} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.09, 0.6]}>
          <boxGeometry args={[1.64, 0.02, 0.12]} />
          <meshStandardMaterial color="#C4A35A" roughness={0.3} metalness={0.3} />
        </mesh>
      </group>

      {/* Dividers inside the box */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.02, 0.46, 1.16]} />
        <meshStandardMaterial color="#D4CCC2" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.25, 0.2]}>
        <boxGeometry args={[1.56, 0.46, 0.02]} />
        <meshStandardMaterial color="#D4CCC2" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.25, -0.2]}>
        <boxGeometry args={[1.56, 0.46, 0.02]} />
        <meshStandardMaterial color="#D4CCC2" roughness={0.5} />
      </mesh>
    </group>
  );
}

/** Logs the full GLB scene graph to the console for mesh identification */
function logSceneGraph(obj: THREE.Object3D, depth = 0) {
  const indent = "  ".repeat(depth);
  const type = (obj as THREE.Mesh).isMesh
    ? "Mesh"
    : (obj as THREE.Group).isGroup
      ? "Group"
      : obj.type;
  const geo = (obj as THREE.Mesh).geometry;
  const geoInfo = geo
    ? ` [vertices: ${geo.attributes?.position?.count ?? "?"}]`
    : "";
  const mat = (obj as THREE.Mesh).material;
  const matName = mat && !Array.isArray(mat) ? ` mat:"${(mat as THREE.Material).name || mat.type}"` : "";
  console.log(
    `${indent}${type} "${obj.name || "(unnamed)"}"${geoInfo}${matName}` +
      ` pos:(${obj.position.x.toFixed(2)}, ${obj.position.y.toFixed(2)}, ${obj.position.z.toFixed(2)})` +
      ` scale:(${obj.scale.x.toFixed(2)}, ${obj.scale.y.toFixed(2)}, ${obj.scale.z.toFixed(2)})`
  );
  obj.children.forEach((child) => logSceneGraph(child, depth + 1));
}

/** GLB model loader — renders model as base with a procedural animated lid */
function GiftBoxModel({ url }: { url: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);
  const { stage } = useRevealStore();

  // Log scene graph on first load
  useEffect(() => {
    console.group("=== GLB Scene Graph ===");
    console.log(`URL: ${url}`);
    logSceneGraph(scene);
    // Identify likely mesh roles
    const meshes: { name: string; vertices: number }[] = [];
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const m = obj as THREE.Mesh;
        meshes.push({
          name: m.name || "(unnamed)",
          vertices: m.geometry?.attributes?.position?.count ?? 0,
        });
      }
    });
    console.log("\nMesh summary:", meshes);
    console.log(
      "\nNote: This GLB is a single monolithic mesh with no separate lid/base/tray nodes."
    );
    console.log(
      "The procedural lid pivot-group approach is the correct workaround."
    );
    console.groupEnd();
  }, [scene, url]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    // Compute bounding box to determine model size for lid placement
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    // Store dimensions on the clone's userData for lid sizing
    clone.userData.boxSize = size;
    clone.userData.boxCenter = center;
    clone.userData.boxMin = box.min.clone();
    clone.userData.boxMax = box.max.clone();
    return clone;
  }, [scene]);

  // Get model dimensions for lid
  const { lidWidth, lidDepth, lidY, lidPivotZ } = useMemo(() => {
    const size = clonedScene.userData.boxSize as THREE.Vector3;
    const max = clonedScene.userData.boxMax as THREE.Vector3;
    const min = clonedScene.userData.boxMin as THREE.Vector3;
    return {
      lidWidth: size.x * 1.02,
      lidDepth: size.z * 1.02,
      lidY: max.y,
      lidPivotZ: min.z,
    };
  }, [clonedScene]);

  // Animate lid opening
  useFrame(() => {
    if (!lidRef.current) return;
    const targetAngle =
      stage === "lid-open" || stage === "revealing" || stage === "complete"
        ? -Math.PI / 2.2
        : 0;
    lidRef.current.rotation.x = THREE.MathUtils.lerp(
      lidRef.current.rotation.x,
      targetAngle,
      0.04
    );
  });

  // Idle rotation
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (stage === "complete" || stage === "box-appear") {
      groupRef.current.rotation.y += ANIMATION_CONFIG.idleRotationSpeed * delta;
    }
  });

  return (
    <group ref={groupRef}>
      {/* GLB model as the base box */}
      <primitive object={clonedScene} scale={1.8} />

      {/* Procedural lid — pivots from back edge */}
      <group position={[0, lidY * 1.8, lidPivotZ * 1.8]} ref={lidRef}>
        {/* Lid panel */}
        <mesh position={[0, 0.03, (-lidPivotZ * 1.8) + (lidDepth * 1.8 * 0.5)]}>
          <boxGeometry args={[lidWidth * 1.8, 0.06, lidDepth * 1.8]} />
          <meshStandardMaterial color="#D4CCC2" roughness={0.3} metalness={0.15} />
        </mesh>
        {/* Gold ribbon cross on lid */}
        <mesh position={[0, 0.07, (-lidPivotZ * 1.8) + (lidDepth * 1.8 * 0.5)]}>
          <boxGeometry args={[0.1, 0.02, lidDepth * 1.8]} />
          <meshStandardMaterial color="#C4A35A" roughness={0.3} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.07, (-lidPivotZ * 1.8) + (lidDepth * 1.8 * 0.5)]}>
          <boxGeometry args={[lidWidth * 1.8, 0.02, 0.1]} />
          <meshStandardMaterial color="#C4A35A" roughness={0.3} metalness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

/** Camera controller for cinematic movements.
 *  Drives the camera during animation stages, then yields to OrbitControls
 *  once the reveal is complete and the camera has converged. */
function CameraController() {
  const { camera } = useThree();
  const { stage } = useRevealStore();
  const targetPos = useRef(new THREE.Vector3(...CAMERA_CONFIG.initialPosition));
  const converged = useRef(false);

  useEffect(() => {
    camera.position.set(...CAMERA_CONFIG.initialPosition);
    camera.lookAt(...CAMERA_CONFIG.target);
  }, [camera]);

  useEffect(() => {
    converged.current = false; // reset on stage change so animation drives again
    if (stage === "lid-open" || stage === "revealing" || stage === "complete") {
      targetPos.current.set(...CAMERA_CONFIG.revealPosition);
    } else {
      targetPos.current.set(...CAMERA_CONFIG.initialPosition);
    }
  }, [stage]);

  useFrame(() => {
    // Once converged in the complete stage, stop overriding so OrbitControls works
    if (converged.current) return;

    camera.position.lerp(targetPos.current, 0.02);
    camera.lookAt(...CAMERA_CONFIG.target);

    // Check convergence: if close enough to target in complete stage, hand off to OrbitControls
    if (stage === "complete" && camera.position.distanceTo(targetPos.current) < 0.01) {
      converged.current = true;
    }
  });

  return null;
}

/** Zone highlight spheres for visual feedback */
function ZoneHighlights({ anchors }: { anchors: Record<string, [number, number, number]> }) {
  const { revealedZones, hoveredZoneId, activeRevealIndex } = useRevealStore();

  return (
    <>
      {Object.entries(anchors).map(([zoneId, position], index) => {
        const isRevealed = revealedZones.includes(index);
        const isActive = activeRevealIndex === index;
        const isHovered = hoveredZoneId === zoneId;
        const visible = isRevealed || isActive;

        return (
          <mesh
            key={zoneId}
            position={position}
            visible={visible}
            onPointerOver={() => useRevealStore.getState().setHoveredZone(zoneId)}
            onPointerOut={() => useRevealStore.getState().setHoveredZone(null)}
          >
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial
              color={isHovered ? "#C4A35A" : "#B8AFA4"}
              emissive={isActive ? "#C4A35A" : "#000000"}
              emissiveIntensity={isActive ? 0.5 : 0}
              transparent
              opacity={isHovered ? 0.9 : 0.6}
            />
          </mesh>
        );
      })}
    </>
  );
}

/** Debug anchor spheres with colored labels rendered inside the Canvas */
function DebugAnchors({
  anchors,
}: {
  anchors: Record<string, [number, number, number]>;
}) {
  return (
    <>
      {Object.entries(anchors).map(([zoneId, position]) => {
        const color = ZONE_COLORS[zoneId] ?? "#ffffff";
        return (
          <group key={zoneId} position={position}>
            {/* Colored sphere */}
            <mesh>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.4}
                transparent
                opacity={0.85}
              />
            </mesh>
            {/* Zone label */}
            <Html
              center
              distanceFactor={4}
              style={{
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              <div
                className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap"
                style={{
                  backgroundColor: color,
                  color: "#fff",
                  textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  transform: "translateY(-18px)",
                }}
              >
                {zoneId}
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
}

interface BasketRevealSceneProps {
  glbUrl?: string;
  anchors: Record<string, [number, number, number]>;
  onAnchorPositionsUpdate?: (positions: Record<string, { x: number; y: number }>) => void;
  debugMode?: boolean;
}

/** Projects 3D anchor points to screen space.
 *  Only triggers a React state update when positions shift by more than 1px
 *  to avoid re-rendering the entire page tree at 60fps. */
function AnchorProjector({
  anchors,
  onUpdate,
}: {
  anchors: Record<string, [number, number, number]>;
  onUpdate: (positions: Record<string, { x: number; y: number }>) => void;
}) {
  const { camera, size } = useThree();
  const prevPositions = useRef<Record<string, { x: number; y: number }>>({});

  useFrame(() => {
    const projected: Record<string, { x: number; y: number }> = {};
    const vec = new THREE.Vector3();
    let changed = false;

    for (const [zoneId, pos] of Object.entries(anchors)) {
      vec.set(pos[0], pos[1], pos[2]);
      vec.project(camera);

      const x = ((vec.x + 1) / 2) * size.width;
      const y = ((-vec.y + 1) / 2) * size.height;
      projected[zoneId] = { x, y };

      const prev = prevPositions.current[zoneId];
      if (!prev || Math.abs(prev.x - x) > 1 || Math.abs(prev.y - y) > 1) {
        changed = true;
      }
    }

    if (changed) {
      prevPositions.current = projected;
      onUpdate(projected);
    }
  });

  return null;
}

export default function BasketRevealScene({
  glbUrl,
  anchors,
  onAnchorPositionsUpdate,
  debugMode = false,
}: BasketRevealSceneProps) {
  const { stage } = useRevealStore();
  const visible = stage !== "loading";

  return (
    <div
      className={`reveal-canvas w-full h-full transition-opacity duration-1000 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Canvas
        camera={{
          position: CAMERA_CONFIG.initialPosition,
          fov: CAMERA_CONFIG.fov,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <CameraController />

        {/* Lighting */}
        <ambientLight intensity={0.5} color="#FFF8F0" />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          color="#FFF5E6"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight
          position={[-3, 4, -2]}
          intensity={0.4}
          color="#E8E2FF"
        />
        <pointLight position={[0, 3, 0]} intensity={0.3} color="#FFF8F0" />

        {/* Environment */}
        <Environment preset="apartment" />

        {/* Contact shadows for grounding */}
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.25}
          scale={5}
          blur={2}
          far={4}
          color="#3E3935"
        />

        {/* The gift box — ErrorBoundary catches GLB load failures */}
        <Suspense fallback={null}>
          <ModelErrorBoundary fallback={<FallbackBox />}>
            {glbUrl ? (
              <GiftBoxModel url={glbUrl} />
            ) : (
              <FallbackBox />
            )}
          </ModelErrorBoundary>
        </Suspense>

        {/* Zone highlight markers */}
        {debugMode ? (
          <DebugAnchors anchors={anchors} />
        ) : (
          <ZoneHighlights anchors={anchors} />
        )}

        {/* Project anchors to screen space */}
        {onAnchorPositionsUpdate && (
          <AnchorProjector
            anchors={anchors}
            onUpdate={onAnchorPositionsUpdate}
          />
        )}

        {/* Controls */}
        <OrbitControls
          enablePan={CAMERA_CONFIG.enablePan}
          minPolarAngle={CAMERA_CONFIG.minPolarAngle}
          maxPolarAngle={CAMERA_CONFIG.maxPolarAngle}
          minDistance={CAMERA_CONFIG.minDistance}
          maxDistance={CAMERA_CONFIG.maxDistance}
          target={CAMERA_CONFIG.target}
          enableDamping
          dampingFactor={0.05}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
