"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { technologyNodes } from "@/data/technologies";
import TechnologyNodeMesh from "./TechnologyNode";

export type NodePositions = Record<string, [number, number, number]>;

const EDGES: [string, string][] = [
  ["php", "laravel"],
  ["laravel", "postgresql"],
  ["postgresql", "redis"],
  ["redis", "docker"],
  ["docker", "go"],
  ["go", "nextjs"],
  ["nextjs", "react"],
  ["react", "javascript"],
  ["javascript", "typescript"],
  ["typescript", "restapi"],
  ["restapi", "websocket"],
  ["websocket", "nginx"],
  ["nginx", "linux"],
  ["linux", "docker"],
  ["git", "cicd"],
  ["cicd", "docker"],
  ["go", "restapi"],
  ["laravel", "redis"],
  ["git", "typescript"],
];

/**
 * Connection paths between nodes. Each link is a quadratic curve whose bow
 * amount breathes over time — so every path automatically swings between a
 * short (nearly straight) and long (strongly bowed) route. Geometry is one
 * preallocated buffer rewritten in place each frame.
 */
const CURVE_SEGMENTS = 22;

function ConnectionLines({
  activeId,
  positions,
  reducedMotion,
}: {
  activeId: string | null;
  positions: NodePositions;
  reducedMotion: boolean;
}) {
  const byId = useMemo(
    () => new Map(technologyNodes.map((n) => [n.id, n])),
    []
  );
  const posOf = (id: string): [number, number, number] | null =>
    positions[id] ?? byId.get(id)?.position ?? null;

  const makeGeometry = () => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(EDGES.length * CURVE_SEGMENTS * 2 * 3), 3)
    );
    geo.setDrawRange(0, 0);
    return geo;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const baseGeometry = useMemo(makeGeometry, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const activeGeometry = useMemo(makeGeometry, []);

  useEffect(() => {
    return () => {
      baseGeometry.dispose();
      activeGeometry.dispose();
    };
  }, [baseGeometry, activeGeometry]);

  const vec = useMemo(
    () => ({
      a: new THREE.Vector3(),
      b: new THREE.Vector3(),
      ctrl: new THREE.Vector3(),
      p0: new THREE.Vector3(),
      p1: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      perp: new THREE.Vector3(),
    }),
    []
  );

  useFrame((state) => {
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const base = baseGeometry.attributes.position.array as Float32Array;
    const active = activeGeometry.attributes.position.array as Float32Array;
    let vi = 0;
    let va = 0;

    EDGES.forEach(([aId, bId], i) => {
      const pa = posOf(aId);
      const pb = posOf(bId);
      if (!pa || !pb) return;

      vec.a.set(...pa);
      vec.b.set(...pb);
      vec.dir.subVectors(vec.b, vec.a);
      // perpendicular in the ground plane gives the bow its direction
      vec.perp.set(-vec.dir.z, 0, vec.dir.x).normalize();

      // layered sines per edge -> each path independently stretches/relaxes
      const amp =
        Math.sin(t * 0.55 + i * 1.93) * 0.6 +
        Math.sin(t * 0.27 + i * 0.71) * 0.45;
      vec.ctrl
        .addVectors(vec.a, vec.b)
        .multiplyScalar(0.5)
        .addScaledVector(vec.perp, amp);

      for (let s = 0; s < CURVE_SEGMENTS; s++) {
        const u0 = s / CURVE_SEGMENTS;
        const u1 = (s + 1) / CURVE_SEGMENTS;
        const w00 = (1 - u0) * (1 - u0);
        const w01 = 2 * (1 - u0) * u0;
        const w02 = u0 * u0;
        vec.p0.set(
          w00 * vec.a.x + w01 * vec.ctrl.x + w02 * vec.b.x,
          w00 * vec.a.y + w01 * vec.ctrl.y + w02 * vec.b.y,
          w00 * vec.a.z + w01 * vec.ctrl.z + w02 * vec.b.z
        );
        const w10 = (1 - u1) * (1 - u1);
        const w11 = 2 * (1 - u1) * u1;
        const w12 = u1 * u1;
        vec.p1.set(
          w10 * vec.a.x + w11 * vec.ctrl.x + w12 * vec.b.x,
          w10 * vec.a.y + w11 * vec.ctrl.y + w12 * vec.b.y,
          w10 * vec.a.z + w11 * vec.ctrl.z + w12 * vec.b.z
        );

        base[vi++] = vec.p0.x; base[vi++] = vec.p0.y; base[vi++] = vec.p0.z;
        base[vi++] = vec.p1.x; base[vi++] = vec.p1.y; base[vi++] = vec.p1.z;

        const isActiveEdge = activeId !== null && (aId === activeId || bId === activeId);
        if (isActiveEdge) {
          active[va++] = vec.p0.x; active[va++] = vec.p0.y; active[va++] = vec.p0.z;
          active[va++] = vec.p1.x; active[va++] = vec.p1.y; active[va++] = vec.p1.z;
        }
      }
    });

    baseGeometry.setDrawRange(0, vi / 3);
    baseGeometry.attributes.position.needsUpdate = true;
    activeGeometry.setDrawRange(0, va / 3);
    activeGeometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <lineSegments geometry={baseGeometry} frustumCulled={false}>
        <lineBasicMaterial color="#f80419" transparent opacity={0.5} />
      </lineSegments>
      <lineSegments geometry={activeGeometry} frustumCulled={false}>
        <lineBasicMaterial color="#00f514" transparent opacity={0.85} />
      </lineSegments>
    </>
  );
}

function Particles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 34;
      positions[i * 3 + 1] = Math.random() * 9 + 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 34;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        sizeAttenuation
        color="#00D9FF"
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function DataMarkers() {
  const markers = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        position: [
          (Math.random() - 0.5) * 22,
          Math.random() * 5 + 1,
          (Math.random() - 0.5) * 22,
        ] as [number, number, number],
        id: i,
      })),
    []
  );
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((m, i) => {
        m.position.y += Math.sin(state.clock.elapsedTime * 0.8 + i * 2.1) * 0.0015;
        m.rotation.y += 0.002;
      });
    }
  });
  return (
    <group ref={groupRef}>
      {markers.map((m) => (
        <mesh key={m.id} position={m.position}>
          <tetrahedronGeometry args={[0.07, 0]} />
          <meshBasicMaterial color="#00D9FF" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * The whole map lives in this group so it rotates slowly like a radar dish and
 * keeps a gentle drift — the world is always moving. Spin eases to zero while a
 * node is being dragged and stays off entirely for reduced-motion users.
 */
function WorldGroup({
  groupRef,
  paused,
  reducedMotion,
  children,
}: {
  groupRef: React.RefObject<THREE.Group>;
  paused: boolean;
  reducedMotion: boolean;
  children: React.ReactNode;
}) {
  const speed = useRef(0);
  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const target = !reducedMotion && !paused ? 0.055 : 0;
    speed.current = THREE.MathUtils.damp(speed.current, target, 3, delta);
    g.rotation.y += delta * speed.current;
    if (!reducedMotion) {
      const t = state.clock.elapsedTime;
      g.position.x = Math.sin(t * 0.05) * 0.35;
      g.position.z = Math.cos(t * 0.04) * 0.3;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

/**
 * Fly-to camera. When a node gains focus (scan sequence or pinned) the
 * orthographic camera glides over and zooms in, framing the node right of the
 * screen centre so the hero headline column stays clear. Without a target it
 * pulls back to the full-map overview.
 */
function CameraRig({
  targetId,
  positionsRef,
  worldRef,
  compact,
  reducedMotion,
}: {
  targetId: string | null;
  positionsRef: React.RefObject<NodePositions>;
  worldRef: React.RefObject<THREE.Group>;
  compact: boolean;
  reducedMotion: boolean;
}) {
  const camera = useThree((s) => s.camera) as THREE.OrthographicCamera;
  const size = useThree((s) => s.size);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const overviewZoom = Math.max(compact ? 20 : 28, Math.min(64, size.width / 15));
  const focusZoom = Math.min(120, overviewZoom * (compact ? 1.5 : 1.9));

  useFrame((_, delta) => {
    let tx = 0;
    let tz = 0;
    let zoom = overviewZoom;

    const group = worldRef.current;
    const p = targetId ? positionsRef.current?.[targetId] : null;
    if (p && group) {
      tmp.set(p[0], p[1], p[2]);
      group.localToWorld(tmp);
      // Frame the node at 63% screen width / mid height — out of the text lane.
      const visW = size.width / focusZoom;
      tx = tmp.x - 0.13 * visW;
      tz = tmp.z;
      zoom = focusZoom;
    }

    const lambda = reducedMotion ? 80 : 2.4;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, tx, lambda, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, tz, lambda, delta);
    if (Math.abs(camera.zoom - zoom) > 1e-4) {
      camera.zoom = THREE.MathUtils.damp(camera.zoom, zoom, lambda, delta);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

type Props = {
  activeNodeId: string | null;
  positions: NodePositions;
  onNodeSelect: (id: string) => void;
  onNodeMove?: (id: string, position: [number, number, number]) => void;
  onDraggingChange?: (dragging: boolean) => void;
  reducedMotion?: boolean;
  compactLabels?: boolean;
};

export default function TechnologyWorld({
  activeNodeId,
  positions,
  onNodeSelect,
  onNodeMove,
  onDraggingChange,
  reducedMotion = false,
  compactLabels = false,
}: Props) {
  const worldRef = useRef<THREE.Group>(null);
  const positionsRef = useRef<NodePositions>(positions);
  positionsRef.current = positions;
  const [dragging, setDragging] = useState(false);

  const particleCount = compactLabels ? 220 : 650;

  const handleDragMove = (id: string, world: THREE.Vector3) => {
    const group = worldRef.current;
    const base = technologyNodes.find((n) => n.id === id);
    if (!group || !base) return;
    const local = group.worldToLocal(world.clone());
    onNodeMove?.(id, [
      THREE.MathUtils.clamp(local.x, -8, 8),
      base.position[1],
      THREE.MathUtils.clamp(local.z, -6, 6),
    ]);
  };

  const handleDraggingChange = (next: boolean) => {
    setDragging(next);
    onDraggingChange?.(next);
  };

  return (
    <Canvas
      className="!absolute inset-0"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, compactLabels ? 1.5 : 1.75]}
      aria-hidden="true"
    >
      <ambientLight intensity={0.35} />
      <OrthographicCamera
        makeDefault
        position={[0, 20, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        near={0.1}
        far={60}
      />
      <CameraRig
        targetId={activeNodeId}
        positionsRef={positionsRef}
        worldRef={worldRef}
        compact={compactLabels}
        reducedMotion={reducedMotion}
      />

      <WorldGroup
        groupRef={worldRef}
        paused={dragging}
        reducedMotion={reducedMotion}
      >
        <Grid
          infiniteGrid
          cellSize={0.9}
          sectionSize={0.5}
          cellColor="#0B1E26"
          sectionColor="#00F5A0"
          cellThickness={0.1}
          sectionThickness={0.5}
          fadeDistance={40}
          fadeStrength={1.4}
          position={[0, 0, 0]}
        />

        <DataMarkers />
        <ConnectionLines activeId={activeNodeId} positions={positions} reducedMotion={reducedMotion} />

        {technologyNodes.map((node) => (
          <TechnologyNodeMesh
            key={node.id}
            node={node}
            position={positions[node.id] ?? node.position}
            active={node.id === activeNodeId}
            compactLabels={compactLabels}
            reducedMotion={reducedMotion}
            draggable={!compactLabels && !reducedMotion}
            onSelect={onNodeSelect}
            onMoveWorld={handleDragMove}
            onDraggingChange={handleDraggingChange}
          />
        ))}
      </WorldGroup>

      <Particles count={particleCount} />
    </Canvas>
  );
}
