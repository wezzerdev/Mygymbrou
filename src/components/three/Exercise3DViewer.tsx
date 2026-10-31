"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  buildAnatomicalAthlete3D,
  applyPoseToAthlete3D,
  AnatomicalAthleteRig,
} from "./AnatomicalModelBuilder";
import { buildGymEquipment3D, GymEquipmentRig3D } from "./GymEquipmentBuilder";
import {
  EXERCISE_SCENES_3D,
  interpolateJointPose3D,
  Exercise3DSpec,
} from "./ExerciseScenes3D";
import { Play, Pause, RotateCcw, Compass } from "lucide-react";

interface Exercise3DViewerProps {
  exerciseId: string;
  className?: string;
}

export function Exercise3DViewer({
  exerciseId,
  className = "",
}: Exercise3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [phaseName, setPhaseName] = useState<string>("Fase Concéntrica (Subida)");
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  // References for animation and interaction
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const currentExerciseRef = useRef(exerciseId);
  currentExerciseRef.current = exerciseId;

  // Scene state refs for interaction
  const orbitState = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    theta: 0.6,
    phi: 0.35,
    radius: 2.8,
    target: new THREE.Vector3(0, 0.9, 0),
    defaultTheta: 0.6,
    defaultPhi: 0.35,
    defaultRadius: 2.8,
    defaultTarget: new THREE.Vector3(0, 0.9, 0),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Check WebGL
    try {
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const spec: Exercise3DSpec =
      EXERCISE_SCENES_3D[exerciseId] ||
      EXERCISE_SCENES_3D["press-banca-inclinado-mancuernas"];

    // Scene & Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#09090b");
    scene.fog = new THREE.FogExp2("#09090b", 0.12);

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 300;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 25);

    // Initial camera from spec
    const defaultTarget = new THREE.Vector3(...spec.cameraTarget);
    const defaultPos = new THREE.Vector3(...spec.cameraPos);
    const offset = new THREE.Vector3().subVectors(defaultPos, defaultTarget);
    const defaultRadius = Math.max(1.8, offset.length());
    const defaultTheta = Math.atan2(offset.x, offset.z);
    const defaultPhi = Math.asin(Math.max(-0.95, Math.min(0.95, offset.y / defaultRadius)));

    orbitState.current = {
      isDragging: false,
      prevX: 0,
      prevY: 0,
      theta: defaultTheta,
      phi: defaultPhi,
      radius: defaultRadius,
      target: defaultTarget.clone(),
      defaultTheta,
      defaultPhi,
      defaultRadius,
      defaultTarget: defaultTarget.clone(),
    };

    const updateCameraPos = () => {
      const o = orbitState.current;
      const x = o.radius * Math.cos(o.phi) * Math.sin(o.theta);
      const y = o.radius * Math.sin(o.phi);
      const z = o.radius * Math.cos(o.phi) * Math.cos(o.theta);
      camera.position.set(o.target.x + x, o.target.y + y, o.target.z + z);
      camera.lookAt(o.target);
    };
    updateCameraPos();

    // Studio Lights
    const ambientLight = new THREE.AmbientLight("#3f3f46", 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight("#ffffff", 2.2);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Rim light in signature neon lime (#A3E635)
    const rimLight = new THREE.DirectionalLight("#A3E635", 1.8);
    rimLight.position.set(-3, 3.5, -3);
    scene.add(rimLight);

    // Fill light in cool cyan
    const fillLight = new THREE.PointLight("#06b6d4", 1.0, 10);
    fillLight.position.set(0, 0.5, 3);
    scene.add(fillLight);

    // Studio Floor with circular spotlight ring
    const floorGeom = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: "#121215",
      roughness: 0.85,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle grid guide
    const grid = new THREE.GridHelper(8, 16, "#27272a", "#18181b");
    grid.position.y = 0.005;
    scene.add(grid);

    // Build athlete rig & equipment station
    let athlete: AnatomicalAthleteRig | null = null;
    let equipment: GymEquipmentRig3D | null = null;

    try {
      athlete = buildAnatomicalAthlete3D();
      scene.add(athlete.root);

      if (spec.station) {
        equipment = buildGymEquipment3D(spec.station, spec.prop);
        scene.add(equipment.group);
      }
    } catch (err) {
      console.error("Error building 3D scene:", err);
    }

    // Animation loop variables
    let animId = 0;
    let cycleTime = 0;
    const CYCLE_DURATION = 3.2; // seconds per repetition
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animId = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      if (isPlayingRef.current) {
        cycleTime = (cycleTime + delta) % CYCLE_DURATION;
      }

      // Smooth cosine wave: 0 (start) -> 1 (peak contraction) -> 0 (return)
      const normalizedT = cycleTime / CYCLE_DURATION;
      const waveT = 0.5 - 0.5 * Math.cos(normalizedT * Math.PI * 2);

      // Phase caption
      if (normalizedT < 0.5) {
        setPhaseName("Fase Concéntrica (Contracción)");
      } else {
        setPhaseName("Fase Excéntrica (Descenso y Estiramiento)");
      }

      if (athlete) {
        const interpolatedPose = interpolateJointPose3D(
          spec.poseStart,
          spec.poseEnd,
          waveT
        );
        applyPoseToAthlete3D(
          athlete,
          interpolatedPose,
          spec.primaryMuscles,
          spec.secondaryMuscles,
          waveT
        );
      }

      if (equipment && athlete) {
        equipment.updateDynamicProps(athlete, waveT);
      }

      updateCameraPos();
      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // Mouse and Touch Interaction Handlers
    const onMouseDown = (e: MouseEvent) => {
      orbitState.current.isDragging = true;
      orbitState.current.prevX = e.clientX;
      orbitState.current.prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!orbitState.current.isDragging) return;
      const dx = e.clientX - orbitState.current.prevX;
      const dy = e.clientY - orbitState.current.prevY;
      orbitState.current.prevX = e.clientX;
      orbitState.current.prevY = e.clientY;

      orbitState.current.theta -= dx * 0.007;
      orbitState.current.phi = Math.max(
        -0.1,
        Math.min(1.4, orbitState.current.phi + dy * 0.007)
      );
    };

    const onMouseUp = () => {
      orbitState.current.isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      orbitState.current.radius = Math.max(
        1.2,
        Math.min(5.5, orbitState.current.radius + e.deltaY * 0.003)
      );
    };

    // Touch
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        orbitState.current.isDragging = true;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!orbitState.current.isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;

      orbitState.current.theta -= dx * 0.009;
      orbitState.current.phi = Math.max(
        -0.1,
        Math.min(1.4, orbitState.current.phi + dy * 0.009)
      );
    };

    const onTouchEnd = () => {
      orbitState.current.isDragging = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);

      renderer.dispose();
      scene.clear();
    };
  }, [exerciseId]);

  const handleResetCamera = () => {
    const o = orbitState.current;
    o.theta = o.defaultTheta;
    o.phi = o.defaultPhi;
    o.radius = o.defaultRadius;
    o.target.copy(o.defaultTarget);
  };

  if (!webglSupported) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-400 p-4 text-center">
        <Compass className="h-8 w-8 text-zinc-600 mb-2 animate-spin" />
        <p className="text-xs font-medium">Modo 3D no compatible en este navegador</p>
      </div>
    );
  }

  const spec: Exercise3DSpec =
    EXERCISE_SCENES_3D[exerciseId] ||
    EXERCISE_SCENES_3D["press-banca-inclinado-mancuernas"];

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-[#09090b] overflow-hidden select-none group ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Floating 3D Badge Overlay */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 border border-zinc-800/80 shadow-lg">
          <span className="h-2 w-2 rounded-full bg-[#A3E635] animate-pulse" />
          <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-200">
            {spec.badge}
          </span>
          <span className="rounded bg-[#A3E635]/20 text-[#A3E635] px-1 py-0.2 text-[9px] font-semibold ml-1">
            3D 360°
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 text-[10px] text-zinc-400 bg-zinc-950/60 backdrop-blur-sm px-2 py-0.5 rounded-md w-fit border border-zinc-800/50">
          <span>{phaseName}</span>
        </div>
      </div>

      {/* Muscle engagement tags */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-zinc-950/80 backdrop-blur-md px-2 py-0.5 border border-red-500/30 text-[10px] font-medium text-red-400 shadow-md">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
          <span>{spec.primaryLabel}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-md bg-zinc-950/80 backdrop-blur-md px-2 py-0.5 border border-amber-500/30 text-[10px] font-normal text-amber-300 shadow-md">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
          <span>{spec.secondaryLabel}</span>
        </div>
      </div>

      {/* Interactive Controls Overlay */}
      <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5 bg-zinc-950/80 backdrop-blur-md p-1 rounded-lg border border-zinc-800/80 shadow-xl opacity-90 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => setIsPlaying((prev) => !prev)}
          className="p-1 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          title={isPlaying ? "Pausar animación" : "Reproducir animación"}
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5 fill-current text-[#A3E635]" />
          )}
        </button>

        <button
          type="button"
          onClick={handleResetCamera}
          className="p-1 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Restablecer ángulo de cámara"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        <span className="text-[9px] text-zinc-500 px-1 border-l border-zinc-800 hidden sm:inline">
          Arrastra para rotar
        </span>
      </div>
    </div>
  );
}
