"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { TechnologyNode as TechNodeType } from "./types";
import TechIcon from "./TechIcon";

function makeGlowTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,0.85)");
  gradient.addColorStop(0.25, "rgba(255,255,255,0.35)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

let cachedGlow: THREE.Texture | null = null;
export function getGlowTexture(): THREE.Texture {
  if (!cachedGlow) cachedGlow = makeGlowTexture();
  return cachedGlow;
}

const DRAG_PLANE_NORMAL = new THREE.Vector3(0, 1, 0);

type Props = {
  node: TechNodeType;
  position: [number, number, number];
  active: boolean;
  compactLabels?: boolean;
  reducedMotion?: boolean;
  draggable?: boolean;
  onSelect: (id: string) => void;
  onMoveWorld?: (id: string, worldPosition: THREE.Vector3) => void;
  onDraggingChange?: (dragging: boolean) => void;
};

export default function TechnologyNodeMesh({
  node,
  position,
  active,
  compactLabels = false,
  reducedMotion = false,
  draggable = false,
  onSelect,
  onMoveWorld,
  onDraggingChange,
}: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.LineSegments>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const spriteRef = useRef<THREE.Sprite>(null);
  const [hovered, setHovered] = useState(false);

  const basePosition = useMemo(
    () => new THREE.Vector3(...position),
    [position]
  );
  const spinSpeed = useRef(0.35);
  const floatAmp = useRef(0);

  // drag state
  const dragging = useRef(false);
  const dragPlane = useMemo(() => new THREE.Plane(), []);
  const dragOffset = useMemo(() => new THREE.Vector3(), []);
  const hitPoint = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (dragging.current) return; // freeze animation while the user steers it

    // Spin ramps up hard when the scanner locks onto / hovers this node.
    const targetSpin = reducedMotion
      ? 0
      : active
        ? 2.8
        : hovered
          ? 1.1
          : 0.35;
    spinSpeed.current = THREE.MathUtils.damp(spinSpeed.current, targetSpin, 4, delta);
    const spin = spinSpeed.current;

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * spin;
      coreRef.current.rotation.x += delta * spin * 0.45;
    }
    if (shellRef.current) {
      shellRef.current.rotation.y -= delta * spin * 0.6;
      shellRef.current.rotation.z += delta * spin * 0.3;
    }

    // Focused node drifts on a small orbit so it visibly "moves on focus".
    const targetFloat = reducedMotion ? 0 : active ? 0.16 : hovered ? 0.05 : 0;
    floatAmp.current = THREE.MathUtils.damp(floatAmp.current, targetFloat, 4, delta);
    const amp = floatAmp.current;
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.position.set(
        basePosition.x + Math.cos(t * 1.3) * amp * 0.7,
        basePosition.y + Math.sin(t * 2.0) * amp,
        basePosition.z + Math.sin(t * 1.6) * amp * 0.7
      );

      const base = active ? 1.45 : hovered ? 1.2 : 1;
      const cur = groupRef.current.scale.x;
      const next = THREE.MathUtils.damp(cur, base, 6, delta);
      groupRef.current.scale.setScalar(next);
    }
    if (spriteRef.current) {
      const mat = spriteRef.current.material as THREE.SpriteMaterial;
      const targetOpacity = active ? 0.85 : hovered ? 0.55 : 0.3;
      mat.opacity = THREE.MathUtils.damp(mat.opacity, targetOpacity, 5, delta);
    }
  });

  const startDrag = (e: ThreeEvent<PointerEvent>) => {
    if (!draggable || !groupRef.current) return;
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragging.current = true;
    onDraggingChange?.(true);
    document.body.style.cursor = "grabbing";

    const worldPos = groupRef.current.getWorldPosition(new THREE.Vector3());
    dragPlane.setFromNormalAndCoplanarPoint(DRAG_PLANE_NORMAL, worldPos);
    if (e.ray.intersectPlane(dragPlane, hitPoint)) {
      dragOffset.copy(worldPos).sub(hitPoint);
    }
  };

  const moveDrag = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging.current) return;
    e.stopPropagation();
    if (e.ray.intersectPlane(dragPlane, hitPoint)) {
      onMoveWorld?.(node.id, hitPoint.clone().add(dragOffset));
    }
  };

  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    document.body.style.cursor = "auto";
    onDraggingChange?.(false);
  };

  const color = node.color ?? "#00F5A0";

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => {
        if (dragging.current) return;
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = draggable ? "grab" : "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        if (!dragging.current) document.body.style.cursor = "auto";
      }}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
    >
      {/* glow halo */}
      <sprite ref={spriteRef} scale={[1.4, 1.4, 1]}>
        <spriteMaterial
          map={getGlowTexture()}
          color={color}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      {/* core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.13, 0]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* wireframe shell */}
      <lineSegments ref={shellRef}>
        <octahedronGeometry args={[0.3, 0]} />
        <lineBasicMaterial color={color} transparent opacity={0.45} />
      </lineSegments>

      {/* active pulse ring */}
      {active && (
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.008, 8, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} depthWrite={false} />
        </mesh>
      )}

      {/* label — icon-only mark, fixed pixel size so it stays crisp on the flat map */}
      <Html center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        <div className="select-none whitespace-nowrap text-center font-mono">
          <div
            className="relative inline-flex items-center justify-center rounded-sm p-2 backdrop-blur-sm transition-colors duration-300"
            title={node.name}
            aria-label={node.name}
            role="img"
            style={{
              border: `1px solid ${active ? color : `${color}44`}`,
              background: "rgba(3,5,8,.72)",
              boxShadow: active ? `0 0 18px ${color}66` : "none",
            }}
          >
            {active && (
              <>
                <span className="absolute -top-px -left-px h-1.5 w-1.5 border-t border-l" style={{ borderColor: color }} />
                <span className="absolute -top-px -right-px h-1.5 w-1.5 border-t border-r" style={{ borderColor: color }} />
                <span className="absolute -bottom-px -left-px h-1.5 w-1.5 border-b border-l" style={{ borderColor: color }} />
                <span className="absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r" style={{ borderColor: color }} />
              </>
            )}
            <TechIcon id={node.id} size={compactLabels ? 16 : 22} color={active || hovered ? color : "#E8F1F5"} />
          </div>
          {hovered && !compactLabels && (
            <div className="mx-auto mt-1 max-w-[160px] border border-neon/30 bg-black/85 px-2 py-1 text-[6px] normal-case leading-relaxed tracking-normal text-frost">
              <span className="mb-0.5 block text-[8px] font-bold uppercase tracking-[0.25em]" style={{ color }}>
                {node.name}
              </span>
              {node.description}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
