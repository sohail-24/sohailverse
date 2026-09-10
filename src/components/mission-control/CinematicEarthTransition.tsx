import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, User, FolderGit2, Film, Cloud } from "lucide-react";
import * as THREE from "three";

/**
 * Earth Atmospheric Limb Scatter Shader
 * Subtle, photorealistic electric-cyan limb on the sunlit hemisphere.
 */
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  uniform vec3 uSunPosition;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 lightDir = normalize(uSunPosition - vWorldPosition);

    float nDotV = max(0.0, dot(vNormal, viewDir));
    float fresnel = pow(1.0 - nDotV, 3.2);
    float edgeFade = smoothstep(0.035, 0.22, nDotV);

    float sunDot = dot(vNormal, lightDir);
    float sunFactor = smoothstep(-0.15, 0.40, sunDot);

    vec3 atmoColor = mix(vec3(0.12, 0.55, 0.95), vec3(0.42, 0.82, 1.0), fresnel);
    float alpha = fresnel * edgeFade * sunFactor * 0.60;
    gl_FragColor = vec4(atmoColor, alpha);
  }
`;

export interface NavDestination {
  id: string;
  title: string;
  tagline: string;
  path: string;
  category: string;
  accentColor: string;
  glowColor: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

export const NAV_DESTINATIONS: NavDestination[] = [
  {
    id: "about",
    title: "About",
    tagline: "Origin, story, journey...",
    path: "/about",
    category: "ORIGIN & STORY",
    accentColor: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.35)",
    icon: User,
  },
  {
    id: "projects",
    title: "Projects",
    tagline: "Things I've built, deployed, and learned...",
    path: "/projects",
    category: "SYSTEMS & BUILDS",
    accentColor: "#34d399",
    glowColor: "rgba(52, 211, 153, 0.32)",
    icon: FolderGit2,
  },
  {
    id: "cinema",
    title: "Cinema",
    tagline: "Stories, visuals, and imagination...",
    path: "/cinema",
    category: "CREATIVE HORIZON",
    accentColor: "#a78bfa",
    glowColor: "rgba(167, 139, 250, 0.32)",
    icon: Film,
  },
  {
    id: "devops",
    title: "DevOps",
    tagline: "Kubernetes, automation, systems...",
    path: "/devops",
    category: "CLOUD INFRASTRUCTURE",
    accentColor: "#60a5fa",
    glowColor: "rgba(96, 165, 250, 0.35)",
    icon: Cloud,
  },
];

export default function CinematicEarthTransition() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll detection
  const [hasTriggered, setHasTriggered] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Sequential reveal state:
  // revealedPoints[i] tracks whether point i is visible
  // revealedCards[i] tracks whether card i is open
  const [revealedPoints, setRevealedPoints] = useState<boolean[]>([false, false, false, false]);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([false, false, false, false]);

  // Responsive stage measurement
  const [stageSize, setStageSize] = useState({ width: 1000, height: 680 });

  // Three.js Interaction tracking refs
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const touchStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    lastX: number;
    lastTime: number;
    locked: "horizontal" | "vertical" | null;
  } | null>(null);

  // If user prefers reduced motion, show everything immediately
  useEffect(() => {
    if (shouldReduceMotion) {
      setHasTriggered(true);
      setRevealedPoints([true, true, true, true]);
      setRevealedCards([true, true, true, true]);
    }
  }, [shouldReduceMotion]);

  // Viewport IntersectionObserver: trigger animation when section enters view
  useEffect(() => {
    if (hasTriggered || shouldReduceMotion) return;

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setHasTriggered(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [hasTriggered, shouldReduceMotion]);

  // Sequential Reveal Animation Timer Chain
  // Sequence:
  // 1. Earth is visible / rotating
  // 2. Point 0 (About) appears -> Card 0 opens -> Hold
  // 3. Point 1 (Projects) appears -> Card 1 opens -> Hold
  // 4. Point 2 (Cinema) appears -> Card 2 opens -> Hold
  // 5. Point 3 (DevOps) appears -> Card 3 opens
  // Once all are open, STOP. All 4 remain calmly visible.
  useEffect(() => {
    if (!hasTriggered || shouldReduceMotion) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Destination 0: ABOUT
    timers.push(
      setTimeout(() => {
        setRevealedPoints((prev) => [true, prev[1], prev[2], prev[3]]);
      }, 250)
    );
    timers.push(
      setTimeout(() => {
        setRevealedCards((prev) => [true, prev[1], prev[2], prev[3]]);
      }, 550)
    );

    // Destination 1: PROJECTS
    timers.push(
      setTimeout(() => {
        setRevealedPoints((prev) => [prev[0], true, prev[2], prev[3]]);
      }, 1200)
    );
    timers.push(
      setTimeout(() => {
        setRevealedCards((prev) => [prev[0], true, prev[2], prev[3]]);
      }, 1500)
    );

    // Destination 2: CINEMA
    timers.push(
      setTimeout(() => {
        setRevealedPoints((prev) => [prev[0], prev[1], true, prev[3]]);
      }, 2150)
    );
    timers.push(
      setTimeout(() => {
        setRevealedCards((prev) => [prev[0], prev[1], true, prev[3]]);
      }, 2450)
    );

    // Destination 3: DEVOPS
    timers.push(
      setTimeout(() => {
        setRevealedPoints((prev) => [prev[0], prev[1], prev[2], true]);
      }, 3100)
    );
    timers.push(
      setTimeout(() => {
        setRevealedCards((prev) => [prev[0], prev[1], prev[2], true]);
      }, 3400)
    );

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [hasTriggered, shouldReduceMotion]);

  // Measure stage dimensions in real time
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setStageSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();

    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    window.addEventListener("resize", updateSize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  // Spatial composition calculation: generous negative space around central Earth
  const layout = useMemo(() => {
    const { width, height } = stageSize;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isLg = width >= 1024 && width < 1280;

    const centerX = width / 2;
    const centerY = height / 2;

    // Earth sphere pixel diameter and radius
    const earthDiameter = isMobile
      ? Math.min(210, Math.round(width * 0.54))
      : isTablet
      ? 330
      : isLg
      ? 410
      : Math.min(460, Math.round(width * 0.36));
    const earthRadius = (earthDiameter / 2) * 0.82;

    // Spatial node dimensions
    const nodeW = isMobile
      ? Math.max(148, Math.floor((width - 32) / 2))
      : isTablet
      ? 220
      : 250;
    const nodeH = isMobile ? 96 : 110;

    if (isMobile) {
      // Mobile Layout:
      // Earth centered.
      // Top row: About (left) and Projects (right)
      // Bottom row: Cinema (left) and DevOps (right)
      const topY = 16;
      const bottomY = Math.max(height - nodeH - 16, centerY + earthRadius + 32);

      const aboutNode = { x: 12, y: topY, width: nodeW, height: nodeH };
      const projectsNode = { x: width - nodeW - 12, y: topY, width: nodeW, height: nodeH };
      const cinemaNode = { x: 12, y: bottomY, width: nodeW, height: nodeH };
      const devopsNode = { x: width - nodeW - 12, y: bottomY, width: nodeW, height: nodeH };

      // Subtle celestial beacon points floating between each destination and the Earth
      const aboutBeacon = {
        x: aboutNode.x + aboutNode.width * 0.5,
        y: aboutNode.y + aboutNode.height + 12,
      };
      const projectsBeacon = {
        x: projectsNode.x + projectsNode.width * 0.5,
        y: projectsNode.y + projectsNode.height + 12,
      };
      const cinemaBeacon = {
        x: cinemaNode.x + cinemaNode.width * 0.5,
        y: cinemaNode.y - 12,
      };
      const devopsBeacon = {
        x: devopsNode.x + devopsNode.width * 0.5,
        y: devopsNode.y - 12,
      };

      return {
        earthRadius,
        earthDiameter,
        centerX,
        centerY,
        isMobile: true,
        destinations: [
          {
            ...NAV_DESTINATIONS[0],
            node: aboutNode,
            beacon: aboutBeacon,
            initialYOffset: -10,
          },
          {
            ...NAV_DESTINATIONS[1],
            node: projectsNode,
            beacon: projectsBeacon,
            initialYOffset: -10,
          },
          {
            ...NAV_DESTINATIONS[2],
            node: cinemaNode,
            beacon: cinemaBeacon,
            initialYOffset: 10,
          },
          {
            ...NAV_DESTINATIONS[3],
            node: devopsNode,
            beacon: devopsBeacon,
            initialYOffset: 10,
          },
        ],
      };
    }

    // Desktop / Tablet Layout:
    // Earth as the large visual centerpiece.
    // 4 orbital quadrants with generous spatial negative space.
    const sideMargin = isTablet ? 24 : Math.max(36, Math.round(width * 0.04));
    const leftX = sideMargin;
    const rightX = width - nodeW - sideMargin;

    const topY = Math.max(28, Math.round(centerY - earthRadius * 0.72 - nodeH * 0.5));
    const bottomY = Math.min(height - nodeH - 28, Math.round(centerY + earthRadius * 0.72 - nodeH * 0.5));

    const aboutNode = { x: leftX, y: topY, width: nodeW, height: nodeH };
    const projectsNode = { x: rightX, y: topY, width: nodeW, height: nodeH };
    const cinemaNode = { x: leftX, y: bottomY, width: nodeW, height: nodeH };
    const devopsNode = { x: rightX, y: bottomY, width: nodeW, height: nodeH };

    // Beacon Points float just inside toward the space around Earth:
    // About (top-left) -> beacon on right
    // Projects (top-right) -> beacon on left
    // Cinema (bottom-left) -> beacon on right
    // DevOps (bottom-right) -> beacon on left
    const beaconGap = 20;
    const aboutBeacon = {
      x: aboutNode.x + aboutNode.width + beaconGap,
      y: aboutNode.y + aboutNode.height * 0.5,
    };
    const projectsBeacon = {
      x: projectsNode.x - beaconGap,
      y: projectsNode.y + projectsNode.height * 0.5,
    };
    const cinemaBeacon = {
      x: cinemaNode.x + cinemaNode.width + beaconGap,
      y: cinemaNode.y + cinemaNode.height * 0.5,
    };
    const devopsBeacon = {
      x: devopsNode.x - beaconGap,
      y: devopsNode.y + devopsNode.height * 0.5,
    };

    return {
      earthRadius,
      earthDiameter,
      centerX,
      centerY,
      isMobile: false,
      destinations: [
        {
          ...NAV_DESTINATIONS[0],
          node: aboutNode,
          beacon: aboutBeacon,
          initialYOffset: -8,
        },
        {
          ...NAV_DESTINATIONS[1],
          node: projectsNode,
          beacon: projectsBeacon,
          initialYOffset: -8,
        },
        {
          ...NAV_DESTINATIONS[2],
          node: cinemaNode,
          beacon: cinemaBeacon,
          initialYOffset: 8,
        },
        {
          ...NAV_DESTINATIONS[3],
          node: devopsNode,
          beacon: devopsBeacon,
          initialYOffset: 8,
        },
      ],
    };
  }, [stageSize]);

  // Three.js Photorealistic 3D Globe with cinematic lighting & drag rotation
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    const width = stage.clientWidth || 1000;
    const height = stage.clientHeight || 680;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 250);

    const updateCameraPosition = (w: number, h: number) => {
      const mobile = w < 768;
      const tablet = w >= 768 && w < 1024;
      const lg = w >= 1024 && w < 1280;

      const earthDiam = mobile
        ? Math.min(210, Math.round(w * 0.54))
        : tablet
        ? 330
        : lg
        ? 410
        : Math.min(460, Math.round(w * 0.36));
      const earthRad = (earthDiam / 2) * 0.82;
      const desiredDiam = earthRad * 2;

      const halfFovRad = THREE.MathUtils.degToRad(camera.fov / 2);
      const camZ = h / (desiredDiam * Math.tan(halfFovRad));
      camera.position.set(0, 0, camZ);
      camera.lookAt(0, 0, 0);
    };

    updateCameraPosition(width, height);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Natural sunlight illuminating Earth from upper-left
    const sunLight = new THREE.DirectionalLight(0xfffaee, 2.85);
    sunLight.position.set(-7.0, 4.2, 3.2);
    scene.add(sunLight);

    // Ambient space fill
    const ambientLight = new THREE.AmbientLight(0x070c18, 0.20);
    scene.add(ambientLight);

    // Earth Group
    const earthGroup = new THREE.Group();
    earthGroup.position.set(0, 0, 0);
    earthGroup.rotation.z = THREE.MathUtils.degToRad(23.4);
    earthGroup.rotation.x = THREE.MathUtils.degToRad(8);
    scene.add(earthGroup);

    // Earth Surface
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load("/earth-texture-2048.jpg");
    earthTexture.colorSpace = THREE.SRGBColorSpace;

    const earthGeometry = new THREE.SphereGeometry(1.0, 128, 128);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.04,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // Translucent Clouds
    const cloudsTexture = textureLoader.load("/earth-clouds-1024.png");
    cloudsTexture.colorSpace = THREE.SRGBColorSpace;
    const cloudsGeometry = new THREE.SphereGeometry(1.008, 128, 128);
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.40,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      roughness: 0.9,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    earthGroup.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    // Atmosphere Shader
    const atmosphereGeo = new THREE.SphereGeometry(1.015, 128, 128);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        uSunPosition: { value: sunLight.position },
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    earthGroup.add(atmosphereMesh);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          updateCameraPosition(newWidth, newHeight);
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(stage);

    // Animation Loop
    let animationFrameId: number;
    const autoSpeed = shouldReduceMotion ? 0 : 0.00085;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      earthGroup.position.set(0, 0, 0);

      if (!isDraggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.0001) {
          if (earthMeshRef.current) {
            earthMeshRef.current.rotation.y += velocityRef.current;
          }
          if (cloudsMeshRef.current) {
            cloudsMeshRef.current.rotation.y += velocityRef.current * 1.02;
          }
          velocityRef.current *= 0.93;
        } else {
          velocityRef.current = 0;
          if (earthMeshRef.current) {
            earthMeshRef.current.rotation.y += autoSpeed;
          }
          if (cloudsMeshRef.current) {
            cloudsMeshRef.current.rotation.y += autoSpeed * 1.08;
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();

      earthGeometry.dispose();
      cloudsGeometry.dispose();
      atmosphereGeo.dispose();

      earthMaterial.dispose();
      cloudsMaterial.dispose();
      atmosphereMat.dispose();

      earthTexture.dispose();
      cloudsTexture.dispose();
    };
  }, [shouldReduceMotion]);

  // Pointer drag handlers for Earth rotation
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const radius = rect.width / 2;
    const clickX = e.clientX - (rect.left + radius);
    const clickY = e.clientY - (rect.top + radius);
    const maxRadius = e.pointerType === "mouse" ? radius : radius + 8;
    if (Math.hypot(clickX, clickY) > maxRadius) {
      return;
    }

    setHasTriggered(true);

    if (e.pointerType === "mouse") {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignored if capture unsupported
      }
      isDraggingRef.current = true;
      lastXRef.current = e.clientX;
      lastTimeRef.current = performance.now();
      velocityRef.current = 0;
      setIsDragging(true);
    } else {
      touchStateRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastTime: performance.now(),
        locked: null,
      };
      velocityRef.current = 0;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const radius = layout.earthRadius || 120;

    if (e.pointerType === "mouse") {
      if (!isDraggingRef.current) return;

      const currentX = e.clientX;
      const deltaX = currentX - lastXRef.current;
      const now = performance.now();
      const dt = Math.max(now - lastTimeRef.current, 1);

      const rotDelta = (deltaX / radius) * 1.05;

      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y += rotDelta;
      }
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += rotDelta * 1.02;
      }

      const instantVel = (rotDelta / dt) * 16;
      velocityRef.current = velocityRef.current * 0.4 + instantVel * 0.6;
      velocityRef.current = Math.max(-0.035, Math.min(0.035, velocityRef.current));

      lastXRef.current = currentX;
      lastTimeRef.current = now;
      return;
    }

    const touch = touchStateRef.current;
    if (!touch || touch.pointerId !== e.pointerId) return;

    if (touch.locked === null) {
      const dx = e.clientX - touch.startX;
      const dy = e.clientY - touch.startY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (absDx < 4 && absDy < 4) return;

      if (absDy > absDx) {
        touch.locked = "vertical";
        isDraggingRef.current = false;
        setIsDragging(false);
        return;
      } else {
        touch.locked = "horizontal";
        isDraggingRef.current = true;
        setIsDragging(true);
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // Ignored
        }

        const now = performance.now();
        const initialDeltaX = e.clientX - touch.lastX;
        const dt = Math.max(now - touch.lastTime, 1);
        const rotDelta = (initialDeltaX / radius) * 1.05;

        if (earthMeshRef.current) {
          earthMeshRef.current.rotation.y += rotDelta;
        }
        if (cloudsMeshRef.current) {
          cloudsMeshRef.current.rotation.y += rotDelta * 1.02;
        }

        const instantVel = (rotDelta / dt) * 16;
        velocityRef.current = Math.max(-0.035, Math.min(0.035, instantVel));

        touch.lastX = e.clientX;
        touch.lastTime = now;
        return;
      }
    }

    if (touch.locked === "horizontal" && isDraggingRef.current) {
      const currentX = e.clientX;
      const deltaX = currentX - touch.lastX;
      const now = performance.now();
      const dt = Math.max(now - touch.lastTime, 1);

      const rotDelta = (deltaX / radius) * 1.05;

      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y += rotDelta;
      }
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += rotDelta * 1.02;
      }

      const instantVel = (rotDelta / dt) * 16;
      velocityRef.current = velocityRef.current * 0.4 + instantVel * 0.6;
      velocityRef.current = Math.max(-0.035, Math.min(0.035, velocityRef.current));

      touch.lastX = currentX;
      touch.lastTime = now;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignored
    }

    const now = performance.now();
    if (e.pointerType === "mouse") {
      if (now - lastTimeRef.current > 70) {
        velocityRef.current = 0;
      }
    } else if (touchStateRef.current) {
      if (now - touchStateRef.current.lastTime > 70 || touchStateRef.current.locked !== "horizontal") {
        velocityRef.current = 0;
      }
    }

    touchStateRef.current = null;
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerUp(e);
  };

  return (
    <section
      ref={sectionRef}
      id="cinematic-earth-transition"
      aria-label="Earth and Navigation Destinations"
      className="relative w-full overflow-hidden bg-[#020409] isolate text-white py-6 sm:py-10 my-4 sm:my-8"
    >
      {/* ========================================================================= */}
      {/* 1. CINEMATIC DEEP-SPACE WALLPAPER BACKGROUND                              */}
      {/* ========================================================================= */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/earth-space-background.webp'), url('/earth-space-background.jpg')",
        }}
      >
        <picture className="w-full h-full block">
          <source srcSet="/earth-space-background.webp" type="image/webp" />
          <img
            src="/earth-space-background.jpg"
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
        </picture>

        {/* Soft edge fade into adjacent sections */}
        <div className="absolute inset-x-0 top-0 h-10 sm:h-16 bg-gradient-to-b from-[#020409] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-10 sm:h-16 bg-gradient-to-t from-[#020409] to-transparent pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* 2. EARTH & SPACIOUS CELESTIAL STAGE                                       */}
      {/* ========================================================================= */}
      <div
        ref={stageRef}
        id="earth-floating-navigation-stage"
        className="relative z-10 w-full max-w-6xl xl:max-w-7xl mx-auto min-h-[560px] sm:min-h-[620px] md:min-h-[660px] lg:min-h-[700px] xl:min-h-[720px] flex items-center justify-center select-none px-3 sm:px-6 lg:px-8"
      >
        {/* Full-Stage WebGL Canvas: 3D Earth render layer */}
        <canvas
          ref={canvasRef}
          id="earth-webgl-canvas"
          className="absolute inset-0 w-full h-full block select-none pointer-events-none z-10"
          aria-hidden="true"
        />

        {/* Interactive Earth Drag Hit Surface */}
        <div
          id="earth-interactive-surface"
          role="region"
          aria-label="Interactive 3D realistic Earth. Drag left or right to rotate."
          title="Drag left or right to rotate the Earth"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className={`absolute rounded-full z-20 select-none outline-none focus:outline-none focus-visible:outline-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            width: `${layout.earthDiameter}px`,
            height: `${layout.earthDiameter}px`,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            touchAction: "pan-y",
            WebkitTapHighlightColor: "transparent",
          }}
        />

        {/* ===================================================================== */}
        {/* 3. SUBTLE GLOWING CELESTIAL BEACON POINTS (NO CONNECTOR LINES)        */}
        {/* Small, luminous markers floating peacefully in space near each node. */}
        {/* ===================================================================== */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {layout.destinations.map((dest, idx) => {
            const isPointVisible = revealedPoints[idx];
            const isHovered = hoveredNodeId === dest.id;

            return (
              <motion.div
                key={`beacon-${dest.id}`}
                id={`beacon-${dest.id}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: dest.beacon.x,
                  top: dest.beacon.y,
                }}
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.3 }
                }
                animate={{
                  opacity: isPointVisible ? (isHovered ? 1 : 0.85) : 0,
                  scale: isPointVisible ? (isHovered ? 1.3 : 1.0) : 0.3,
                }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                }}
              >
                {/* Luminous outer aura */}
                <div
                  className="absolute -inset-2.5 rounded-full transition-all duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${dest.accentColor} 0%, transparent 70%)`,
                    opacity: isHovered ? 0.9 : 0.45,
                    filter: "blur(4px)",
                  }}
                />

                {/* Core luminous point */}
                <div
                  className="relative w-2.5 h-2.5 rounded-full transition-transform duration-300 shadow-[0_0_12px_currentColor]"
                  style={{
                    backgroundColor: "#ffffff",
                    border: `1.5px solid ${dest.accentColor}`,
                    boxShadow: isHovered
                      ? `0 0 16px ${dest.accentColor}, 0 0 28px ${dest.accentColor}`
                      : `0 0 10px ${dest.accentColor}`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* ===================================================================== */}
        {/* 4. BORDERLESS NAVIGATION DESTINATIONS (SEQUENTIAL REVEAL)              */}
        {/* Zero rectangular borders, zero numbers (no 01/02/03/04), generous    */}
        {/* breathing room, clean typography, translucent atmospheric glass.      */}
        {/* ===================================================================== */}
        <div className="absolute inset-0 pointer-events-none z-30">
          {layout.destinations.map((dest, idx) => {
            const isCardVisible = revealedCards[idx];
            const isHovered = hoveredNodeId === dest.id;
            const Icon = dest.icon;

            return (
              <motion.div
                key={`dest-${dest.id}`}
                id={`dest-${dest.id}`}
                className="absolute pointer-events-auto"
                style={{
                  left: dest.node.x,
                  top: dest.node.y,
                  width: dest.node.width,
                }}
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
                    : {
                        opacity: 0,
                        scale: 0.96,
                        y: dest.initialYOffset,
                        filter: "blur(8px)",
                      }
                }
                animate={{
                  opacity: isCardVisible ? 1 : 0,
                  scale: isCardVisible ? (isHovered ? 1.02 : 1) : 0.96,
                  y: isCardVisible ? (isHovered ? -3 : 0) : dest.initialYOffset,
                  filter: isCardVisible ? "blur(0px)" : "blur(8px)",
                }}
                transition={{
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1], // refined easeOutExpo
                }}
              >
                <Link
                  to={dest.path}
                  aria-label={`Navigate to ${dest.title} — ${dest.tagline}`}
                  onMouseEnter={() => setHoveredNodeId(dest.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onFocus={() => setHoveredNodeId(dest.id)}
                  onBlur={() => setHoveredNodeId(null)}
                  className="group relative block rounded-2xl p-3 sm:p-3.5 md:p-4 bg-slate-950/40 hover:bg-slate-900/50 backdrop-blur-md transition-all duration-300 select-none shadow-[0_4px_24px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  style={{
                    boxShadow: isHovered
                      ? `0 0 32px ${dest.glowColor}, 0 8px 32px rgba(0, 0, 0, 0.5)`
                      : "0 4px 24px rgba(0, 0, 0, 0.35)",
                  }}
                >
                  {/* Subtle ambient diffuse glow on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(ellipse at center, ${dest.glowColor} 0%, transparent 70%)`,
                      opacity: isHovered ? 0.25 : 0,
                    }}
                  />

                  {/* Top Row: Category domain indicator + Arrow Glyph */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] font-semibold tracking-wider text-slate-400 group-hover:text-slate-300 uppercase transition-colors">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: dest.accentColor }}
                      />
                      <span>{dest.category}</span>
                    </span>

                    <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-sky-500/20 transition-all duration-200">
                      <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Middle Row: Domain Icon + Destination Title */}
                  <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
                    <Icon
                      className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-colors"
                      style={{ color: dest.accentColor }}
                    />
                    <h3 className="font-display text-base sm:text-lg md:text-xl font-bold tracking-wide text-white group-hover:text-sky-200 transition-colors leading-tight">
                      {dest.title}
                    </h3>
                  </div>

                  {/* Bottom: Subtitle / Destination Tagline */}
                  <p className="text-[11px] sm:text-xs text-slate-300/90 font-sans mt-1 sm:mt-1.5 leading-snug line-clamp-2 group-hover:text-slate-100 transition-colors">
                    {dest.tagline}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
