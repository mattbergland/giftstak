"use client";

import { useRef, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useRevealStore } from "@/lib/reveal-store";
import { CAMERA_CONFIG, ANIMATION_CONFIG } from "@/lib/animation-config";

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

/** GLB model loader */
function GiftBoxModel({ url }: { url: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const { stage } = useRevealStore();

  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const mixer = useMemo(() => {
    if (animations.length > 0) {
      return new THREE.AnimationMixer(clonedScene);
    }
    return null;
  }, [clonedScene, animations]);

  useEffect(() => {
    if (mixer && animations.length > 0) {
      if (stage === "lid-open" || stage === "revealing" || stage === "complete") {
        const action = mixer.clipAction(animations[0]);
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();
      }
    }
  }, [stage, mixer, animations]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    mixer?.update(delta);

    if (stage === "complete" || stage === "box-appear") {
      groupRef.current.rotation.y += ANIMATION_CONFIG.idleRotationSpeed * delta;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} scale={1} />
    </group>
  );
}

/** Camera controller for cinematic movements */
function CameraController() {
  const { camera } = useThree();
  const { stage } = useRevealStore();
  const targetPos = useRef(new THREE.Vector3(...CAMERA_CONFIG.initialPosition));

  useEffect(() => {
    camera.position.set(...CAMERA_CONFIG.initialPosition);
    camera.lookAt(...CAMERA_CONFIG.target);
  }, [camera]);

  useEffect(() => {
    if (stage === "lid-open" || stage === "revealing" || stage === "complete") {
      targetPos.current.set(...CAMERA_CONFIG.revealPosition);
    } else {
      targetPos.current.set(...CAMERA_CONFIG.initialPosition);
    }
  }, [stage]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.02);
    camera.lookAt(...CAMERA_CONFIG.target);
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

interface BasketRevealSceneProps {
  glbUrl?: string;
  anchors: Record<string, [number, number, number]>;
  onAnchorPositionsUpdate?: (positions: Record<string, { x: number; y: number }>) => void;
}

/** Projects 3D anchor points to screen space each frame */
function AnchorProjector({
  anchors,
  onUpdate,
}: {
  anchors: Record<string, [number, number, number]>;
  onUpdate: (positions: Record<string, { x: number; y: number }>) => void;
}) {
  const { camera, size } = useThree();

  useFrame(() => {
    const projected: Record<string, { x: number; y: number }> = {};
    const vec = new THREE.Vector3();

    for (const [zoneId, pos] of Object.entries(anchors)) {
      vec.set(pos[0], pos[1], pos[2]);
      vec.project(camera);

      projected[zoneId] = {
        x: ((vec.x + 1) / 2) * size.width,
        y: ((-vec.y + 1) / 2) * size.height,
      };
    }

    onUpdate(projected);
  });

  return null;
}

export default function BasketRevealScene({
  glbUrl,
  anchors,
  onAnchorPositionsUpdate,
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

        {/* The gift box */}
        <Suspense fallback={null}>
          {glbUrl ? (
            <GiftBoxModel url={glbUrl} />
          ) : (
            <FallbackBox />
          )}
        </Suspense>

        {/* Zone highlight markers */}
        <ZoneHighlights anchors={anchors} />

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
          enableDamping
          dampingFactor={0.05}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
