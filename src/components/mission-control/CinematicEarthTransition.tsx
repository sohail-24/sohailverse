import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, User, FolderGit2, Film, Cloud } from "lucide-react";
import * as THREE from "three";

/**
 * Earth Atmospheric Limb Scatter Shader
 * Recreates the razor-thin luminous blue limb of Earth as seen in NASA photography.
 * The Fresnel glow responds physically to the Sun position:
 * glowing delicately on the sunward crescent and vanishing into the darkness of the night hemisphere.
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

    // Fresnel rim intensity (thin, subtle limb without excessive glow)
    float fresnel = pow(1.0 - nDotV, 3.2);

    // Smooth edge fade: ensures the atmospheric glow smoothly tapers to absolute ZERO
    // at the geometry silhouette (nDotV -> 0), completely eliminating faceted polygonal chord
    // line artifacts, bright slivers, and harsh geometric boundaries against cosmic space
    float edgeFade = smoothstep(0.0, 0.08, nDotV);

    // Sunlit hemisphere masking: atmosphere illuminates on the day side
    float sunDot = dot(vNormal, lightDir);
    float sunFactor = smoothstep(-0.20, 0.40, sunDot);

    // Realistic electric cyan-blue atmosphere color gradient
    vec3 atmoColor = mix(vec3(0.12, 0.55, 0.95), vec3(0.42, 0.82, 1.0), fresnel);

    float alpha = fresnel * edgeFade * sunFactor * 0.65;
    gl_FragColor = vec4(atmoColor, alpha);
  }
`;

interface NavDestination {
  id: string;
  number: string;
  title: string;
  tagline: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_DESTINATIONS: NavDestination[] = [
  {
    id: "about",
    number: "01",
    title: "About",
    tagline: "Origin, story, journey...",
    path: "/about",
    icon: User,
  },
  {
    id: "projects",
    number: "02",
    title: "Projects",
    tagline: "Things I've built, deployed, and learned...",
    path: "/projects",
    icon: FolderGit2,
  },
  {
    id: "cinema",
    number: "03",
    title: "Cinema",
    tagline: "Stories, visuals, and imagination...",
    path: "/cinema",
    icon: Film,
  },
  {
    id: "devops",
    number: "04",
    title: "DevOps",
    tagline: "Kubernetes, automation, systems...",
    path: "/devops",
    icon: Cloud,
  },
];

export default function CinematicEarthTransition() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll detection & trigger state
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isHoveredOrDragging, setIsHoveredOrDragging] = useState(false);

  // Responsive stage measurement
  const [stageSize, setStageSize] = useState({ width: 900, height: 580 });

  // Repeating one-card animation cycle state (0: About, 1: Projects, 2: Cinema, 3: DevOps)
  const [activeIndex, setActiveIndex] = useState(0);
  const [animPhase, setAnimPhase] = useState<"emerge" | "hold" | "retract">("emerge");
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isCardFocused, setIsCardFocused] = useState(false);
  const isCardActive = isCardHovered || isCardFocused;

  // Interaction tracking refs
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

  // If user prefers reduced motion, trigger immediately
  useEffect(() => {
    if (shouldReduceMotion) {
      setHasTriggered(true);
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
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
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

  // Repeating animation sequence:
  // Each destination has ~2.15s total visible cycle:
  // 1. emerge (650ms): Anchor appears, connection line extends, card emerges outward from Earth
  // 2. hold (1100ms): Steady hold for reading and interaction (pauses if hovered/focused)
  // 3. retract (400ms): Card retracts back toward Earth connection point, line retracts/fades
  // Then loops to next destination seamlessly: About -> Projects -> Cinema -> DevOps -> repeat
  useEffect(() => {
    if (!hasTriggered) return;

    if (shouldReduceMotion) {
      const timer = setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % NAV_DESTINATIONS.length);
      }, 3500);
      return () => clearTimeout(timer);
    }

    if (animPhase === "emerge") {
      const timer = setTimeout(() => {
        setAnimPhase("hold");
      }, 650);
      return () => clearTimeout(timer);
    }

    if (animPhase === "hold") {
      if (isCardActive) {
        // Paused while hovered or focused
        return;
      }
      const timer = setTimeout(() => {
        setAnimPhase("retract");
      }, 1100);
      return () => clearTimeout(timer);
    }

    if (animPhase === "retract") {
      const timer = setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % NAV_DESTINATIONS.length);
        setAnimPhase("emerge");
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [hasTriggered, animPhase, isCardActive, shouldReduceMotion]);

  // Precise geometry calculation for Earth anchor, connection line, and floating card
  const geometry = useMemo(() => {
    const { width, height } = stageSize;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isLg = width >= 1024 && width < 1280;

    const centerX = width / 2;
    const centerY = height / 2;

    // Real Earth sphere pixel radius in stage coordinates
    // Mobile Earth size is preserved; desktop Earth size is substantially enlarged
    const earthDiameter = isMobile
      ? Math.min(256, width * 0.68)
      : isTablet
      ? 440
      : isLg
      ? 520
      : Math.min(620, Math.round(width * 0.44));
    const earthRadius = (earthDiameter / 2) * 0.80;

    // Compact floating card dimensions
    const cardW = isMobile ? Math.min(236, width - 36) : 244;
    const cardH = isMobile ? 104 : 114;

    let anchorX = centerX;
    let anchorY = centerY;
    let cardX = centerX;
    let cardY = centerY;
    let targetX = centerX;
    let targetY = centerY;

    if (isMobile) {
      // Mobile Layout: Cards positioned in upper and lower corners, leaving Earth centered
      if (activeIndex === 0) {
        // 01 About: Upper-Left
        anchorX = centerX - earthRadius * 0.50;
        anchorY = centerY - earthRadius * 0.58;
        cardX = 16;
        cardY = 16;
        targetX = cardX + cardW * 0.72;
        targetY = cardY + cardH;
      } else if (activeIndex === 1) {
        // 02 Projects: Upper-Right
        anchorX = centerX + earthRadius * 0.58;
        anchorY = centerY - earthRadius * 0.48;
        cardX = width - cardW - 16;
        cardY = 16;
        targetX = cardX + cardW * 0.28;
        targetY = cardY + cardH;
      } else if (activeIndex === 2) {
        // 03 Cinema: Lower-Left
        anchorX = centerX - earthRadius * 0.78;
        anchorY = centerY + earthRadius * 0.22;
        cardX = 16;
        cardY = height - cardH - 16;
        targetX = cardX + cardW * 0.72;
        targetY = cardY;
      } else {
        // 04 DevOps: Lower-Right
        anchorX = centerX + earthRadius * 0.65;
        anchorY = centerY + earthRadius * 0.52;
        cardX = width - cardW - 16;
        cardY = height - cardH - 16;
        targetX = cardX + cardW * 0.28;
        targetY = cardY;
      }
    } else {
      // Desktop Layout: Cards float at orbital positions around Earth (matching reference image)
      if (activeIndex === 0) {
        // 01 About: Upper-Left
        anchorX = centerX - earthRadius * 0.48;
        anchorY = centerY - earthRadius * 0.58;
        cardX = Math.max(20, centerX - earthRadius - cardW - 24);
        cardY = Math.max(20, centerY - earthRadius - 20);
        targetX = cardX + cardW;
        targetY = cardY + cardH * 0.68;
      } else if (activeIndex === 1) {
        // 02 Projects: Upper-Right
        anchorX = centerX + earthRadius * 0.62;
        anchorY = centerY - earthRadius * 0.48;
        cardX = Math.min(width - cardW - 20, centerX + earthRadius + 24);
        cardY = Math.max(20, centerY - earthRadius - 20);
        targetX = cardX;
        targetY = cardY + cardH * 0.68;
      } else if (activeIndex === 2) {
        // 03 Cinema: Left / Lower-Left
        anchorX = centerX - earthRadius * 0.80;
        anchorY = centerY + earthRadius * 0.16;
        cardX = Math.max(20, centerX - earthRadius - cardW - 26);
        cardY = Math.min(height - cardH - 24, centerY - 10);
        targetX = cardX + cardW;
        targetY = cardY + cardH * 0.50;
      } else {
        // 04 DevOps: Lower-Right
        anchorX = centerX + earthRadius * 0.66;
        anchorY = centerY + earthRadius * 0.48;
        cardX = Math.min(width - cardW - 20, centerX + earthRadius + 24);
        cardY = Math.min(height - cardH - 24, centerY + 24);
        targetX = cardX;
        targetY = cardY + cardH * 0.50;
      }
    }

    // 3-Segment Geometric Technical Zig-Zag calculation (2–3 clean straight angled segments joined together)
    // Earth anchor -> Segment 1 -> Segment 2 (subtle angled/horizontal jog) -> Segment 3 -> Card Target
    let p1 = { x: anchorX, y: anchorY };
    let p2 = { x: targetX, y: targetY };

    const dx = targetX - anchorX;
    const dy = targetY - anchorY;

    if (activeIndex === 0) {
      // 01 About: Upper-Left (dx < 0, dy < 0)
      // Diagonally up-left from anchor -> horizontal jog left -> into card target
      p1 = {
        x: anchorX + dx * 0.35,
        y: anchorY + dy * 0.52,
      };
      p2 = {
        x: anchorX + dx * 0.72,
        y: p1.y + dy * 0.08,
      };
    } else if (activeIndex === 1) {
      // 02 Projects: Upper-Right (dx > 0, dy < 0)
      // Diagonally up-right from anchor -> horizontal jog right -> into card target
      p1 = {
        x: anchorX + dx * 0.35,
        y: anchorY + dy * 0.52,
      };
      p2 = {
        x: anchorX + dx * 0.72,
        y: p1.y + dy * 0.08,
      };
    } else if (activeIndex === 2) {
      // 03 Cinema: Left / Lower-Left (dx < 0)
      // Diagonally down-left from anchor -> horizontal jog left -> into card target
      const effectiveDy = Math.abs(dy) < 6 ? 16 : dy;
      p1 = {
        x: anchorX + dx * 0.35,
        y: anchorY + effectiveDy * 0.52,
      };
      p2 = {
        x: anchorX + dx * 0.72,
        y: p1.y + effectiveDy * 0.08,
      };
    } else {
      // 04 DevOps: Lower-Right (dx > 0, dy > 0)
      // Diagonally down-right from anchor -> horizontal jog right -> into card target
      p1 = {
        x: anchorX + dx * 0.35,
        y: anchorY + dy * 0.52,
      };
      p2 = {
        x: anchorX + dx * 0.72,
        y: p1.y + dy * 0.08,
      };
    }

    // Path string for SVG: 3 clean connected straight segments
    const pathD = `M ${anchorX} ${anchorY} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${targetX} ${targetY}`;

    // Vector from arrival segment (p2 -> target) for physical card emergence
    const segDx = targetX - p2.x;
    const segDy = targetY - p2.y;
    const segDist = Math.hypot(segDx, segDy);
    const normX = segDist > 0 ? (p2.x - targetX) / segDist : 0;
    const normY = segDist > 0 ? (p2.y - targetY) / segDist : 0;

    const visualEarthDiameter = Math.round(earthRadius * 2);

    return {
      earthRadius,
      earthDiameter: visualEarthDiameter,
      anchor: { x: anchorX, y: anchorY },
      p1,
      p2,
      target: { x: targetX, y: targetY },
      pathD,
      card: { x: cardX, y: cardY, width: cardW, height: cardH },
      norm: { x: normX, y: normY },
    };
  }, [stageSize, activeIndex]);

  // Three.js Photorealistic 3D Globe with cinematic deep-space solar system environment
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    // Stage dimensions
    const width = stage.clientWidth || 900;
    const height = stage.clientHeight || 580;
    const isMobile = width < 768;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera: fixed perspective looking at the center (0, 0, 0)
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 250);

    // Calculate camera distance so Earth diameter perfectly matches geometry.earthRadius on screen
    const updateCameraPosition = (w: number, h: number) => {
      const mobile = w < 768;
      const tablet = w >= 768 && w < 1024;
      const lg = w >= 1024 && w < 1280;

      const earthDiam = mobile
        ? Math.min(256, w * 0.68)
        : tablet
        ? 440
        : lg
        ? 520
        : Math.min(620, Math.round(w * 0.44));
      const earthRad = (earthDiam / 2) * 0.80;
      const desiredDiam = earthRad * 2;

      const halfFovRad = THREE.MathUtils.degToRad(camera.fov / 2);
      const camZ = h / (desiredDiam * Math.tan(halfFovRad));
      camera.position.set(0, 0, camZ);
      camera.lookAt(0, 0, 0);
    };

    updateCameraPosition(width, height);

    // 3. Renderer with transparent background
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

    // 4. Lighting: Natural astronomical sunlight illuminating Earth from upper-left
    const sunLight = new THREE.DirectionalLight(0xfffaee, 2.85);
    sunLight.position.set(-7.0, 4.2, 3.2);
    scene.add(sunLight);

    // Deep space ambient fill (preserves pitch-black astronomical night shadows)
    const ambientLight = new THREE.AmbientLight(0x070c18, 0.20);
    scene.add(ambientLight);

    // 5. Earth Group (Strictly locked at 0, 0, 0 in space)
    const earthGroup = new THREE.Group();
    earthGroup.position.set(0, 0, 0);
    earthGroup.rotation.z = THREE.MathUtils.degToRad(23.4);
    earthGroup.rotation.x = THREE.MathUtils.degToRad(8);
    scene.add(earthGroup);

    // Primary Earth Surface Mesh
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load("/earth-texture-2048.jpg");
    earthTexture.colorSpace = THREE.SRGBColorSpace;

    const earthGeometry = new THREE.SphereGeometry(1.0, 96, 96);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.04,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // Translucent Clouds Layer
    const cloudsTexture = textureLoader.load("/earth-clouds-1024.png");
    const cloudsGeometry = new THREE.SphereGeometry(1.008, 96, 96);
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      roughness: 0.9,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    earthGroup.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    // Realistic Atmospheric Limb Scattering (Subtle, photographic blue rim, no excessive glow)
    const atmosphereGeo = new THREE.SphereGeometry(1.015, 96, 96);
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

    // Resize Observer: adjusts camera aspect, recalculates cameraZ, updates canvas
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

    // Animation Loop: Earth fixed at 0, 0, 0; subtle rotation and drag friction decay
    let animationFrameId: number;
    const autoSpeed = shouldReduceMotion ? 0 : 0.00085;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Invariant: Earth center strictly at (0, 0, 0)
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

      // Dispose geometries
      earthGeometry.dispose();
      cloudsGeometry.dispose();
      atmosphereGeo.dispose();

      // Dispose materials
      earthMaterial.dispose();
      cloudsMaterial.dispose();
      atmosphereMat.dispose();

      // Dispose textures
      earthTexture.dispose();
      cloudsTexture.dispose();
    };
  }, [shouldReduceMotion]);

  // User Drag Handlers: Click + Drag (Desktop) & Touch + Drag / Swipe (Mobile)
  // Isolated specifically to the circular Earth hit area; protects normal vertical page scroll.
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Check if the click/touch falls strictly within the circular Earth sphere
    const rect = e.currentTarget.getBoundingClientRect();
    const radius = rect.width / 2;
    const clickX = e.clientX - (rect.left + radius);
    const clickY = e.clientY - (rect.top + radius);
    if (Math.hypot(clickX, clickY) > radius) {
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
      setIsHoveredOrDragging(true);
    } else {
      // Touch/pen: do not capture or rotate yet. Wait for gesture direction.
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
    const stage = stageRef.current;
    const width = stage ? stage.clientWidth : 360;

    // Desktop Mouse Drag
    if (e.pointerType === "mouse") {
      if (!isDraggingRef.current) return;

      const currentX = e.clientX;
      const deltaX = currentX - lastXRef.current;
      const now = performance.now();
      const dt = Math.max(now - lastTimeRef.current, 1);

      const rotDelta = (deltaX / width) * Math.PI * 1.5;

      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y += rotDelta;
      }
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += rotDelta * 1.02;
      }

      velocityRef.current = (rotDelta / dt) * 16;
      velocityRef.current = Math.max(-0.06, Math.min(0.06, velocityRef.current));

      lastXRef.current = currentX;
      lastTimeRef.current = now;
      return;
    }

    // Mobile / Touch Drag
    const touch = touchStateRef.current;
    if (!touch || touch.pointerId !== e.pointerId) return;

    if (touch.locked === null) {
      const dx = e.clientX - touch.startX;
      const dy = e.clientY - touch.startY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Wait until gesture exceeds threshold of 6px to disambiguate intent
      if (absDx < 6 && absDy < 6) return;

      if (absDy > absDx) {
        // Vertical movement: user wants to scroll the page!
        // Lock vertical mode, do NOT rotate Earth, let browser handle normal page scroll
        touch.locked = "vertical";
        isDraggingRef.current = false;
        setIsHoveredOrDragging(false);
        return;
      } else {
        // Horizontal movement: intentional Earth rotation!
        touch.locked = "horizontal";
        touch.lastX = e.clientX;
        touch.lastTime = performance.now();
        isDraggingRef.current = true;
        setIsHoveredOrDragging(true);
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // Ignored
        }
      }
    }

    if (touch.locked === "horizontal" && isDraggingRef.current) {
      const currentX = e.clientX;
      const deltaX = currentX - touch.lastX;
      const now = performance.now();
      const dt = Math.max(now - touch.lastTime, 1);

      const rotDelta = (deltaX / width) * Math.PI * 1.5;

      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y += rotDelta;
      }
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += rotDelta * 1.02;
      }

      velocityRef.current = (rotDelta / dt) * 16;
      velocityRef.current = Math.max(-0.06, Math.min(0.06, velocityRef.current));

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
    touchStateRef.current = null;
    isDraggingRef.current = false;
    setIsHoveredOrDragging(false);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerUp(e);
  };

  const activeDest = NAV_DESTINATIONS[activeIndex];
  const ActiveIcon = activeDest.icon;

  return (
    <section
      ref={sectionRef}
      id="cinematic-earth-transition"
      aria-label="Earth and Navigation Transition"
      className="relative w-full overflow-hidden bg-[#020409] isolate text-white pt-2 sm:pt-4 pb-10 sm:pb-14 mt-1 sm:mt-2 mb-8 sm:mb-12"
    >
      {/* ========================================================================= */}
      {/* 1. PHOTOREALISTIC DEEP-SPACE UNIVERSE BACKGROUND (Z-INDEX: 0)             */}
      {/* High-quality astronomy space scene: distant galaxies, star clusters,      */}
      {/* cosmic dust lanes, and deep void. Positioned in front of base background.  */}
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
            className="w-full h-full object-cover object-center max-sm:object-center"
          />
        </picture>

        {/* Soft, minimal top & bottom edge transition into adjacent sections */}
        <div className="absolute inset-x-0 top-0 h-6 sm:h-8 bg-gradient-to-b from-[#020409] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-6 sm:h-8 bg-gradient-to-t from-[#020409] to-transparent pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* 2. FIXED CENTERED REALISTIC EARTH + FLOATING NAVIGATION OVERLAY (Z-10)    */}
      {/* Earth remains completely fixed in center. Single card emerges via glowing */}
      {/* connection line from Earth anchor point, holds, and smoothly retracts.     */}
      {/* Sequence: About -> Projects -> Cinema -> DevOps -> repeat                */}
      {/* ========================================================================= */}
      <div
        ref={stageRef}
        id="earth-floating-navigation-stage"
        className="relative z-10 w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto min-h-[480px] sm:min-h-[520px] md:min-h-[580px] lg:min-h-[680px] xl:min-h-[740px] flex items-center justify-center select-none px-4 sm:px-6 lg:px-8"
      >
        {/* Full-Stage WebGL Canvas: purely visual 3D render layer (pointer-events-none) */}
        {/* Renders Earth centered at (0, 0, 0) inside vast cosmic deep-space environment  */}
        <canvas
          ref={canvasRef}
          id="earth-webgl-canvas"
          className="absolute inset-0 w-full h-full block select-none pointer-events-none z-10"
          aria-hidden="true"
        />

        {/* Isolated Interactive Earth Hit Surface: strictly bounds interaction to Earth sphere */}
        {/* Preserves normal page scrolling outside the Earth and on vertical swipe gestures    */}
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
            isHoveredOrDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            width: `${geometry.earthDiameter}px`,
            height: `${geometry.earthDiameter}px`,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            touchAction: "pan-y",
            WebkitTapHighlightColor: "transparent",
          }}
        />

        {/* ===================================================================== */}
        {/* 2. DYNAMIC CONNECTION LINE & ANCHOR POINT (SVG LAYER)                 */}
        {/* Pointer-events-none so drags pass straight through to the Earth       */}
        {/* ===================================================================== */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
          aria-hidden="true"
        >
          <defs>
            {/* Luminous cyan filter for connection beam */}
            <filter id="cyan-beam-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Radial gradient for anchor point surface glow */}
            <radialGradient id="anchor-surface-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#0284c7" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Connection line from Earth anchor point to the card */}
          {hasTriggered && (
            <g>
              {/* Outer soft glow line along the 3-segment zig-zag */}
              <motion.path
                d={geometry.pathD}
                stroke="#38bdf8"
                strokeWidth="2.75"
                strokeOpacity="0.28"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
                filter="url(#cyan-beam-glow)"
                initial={shouldReduceMotion ? { pathLength: 1, opacity: 0.28 } : { pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: animPhase === "retract" ? 0 : 1,
                  opacity: animPhase === "retract" ? 0 : 0.32,
                }}
                transition={{
                  duration: animPhase === "retract" ? 0.32 : 0.45,
                  ease: animPhase === "retract" ? "easeIn" : "easeOut",
                }}
              />

              {/* Crisp central beam line (thin, elegant, luminous blue-white/cyan technical zig-zag) */}
              <motion.path
                d={geometry.pathD}
                stroke="#bae6fd"
                strokeWidth="1.25"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeOpacity="0.95"
                fill="none"
                initial={shouldReduceMotion ? { pathLength: 1, opacity: 0.95 } : { pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: animPhase === "retract" ? 0 : 1,
                  opacity: animPhase === "retract" ? 0 : 0.95,
                }}
                transition={{
                  duration: animPhase === "retract" ? 0.32 : 0.45,
                  ease: animPhase === "retract" ? "easeIn" : "easeOut",
                }}
              />

              {/* Glowing anchor point on Earth surface */}
              {/* Outer halo */}
              <motion.circle
                cx={geometry.anchor.x}
                cy={geometry.anchor.y}
                r="13"
                fill="url(#anchor-surface-glow)"
                initial={shouldReduceMotion ? { scale: 1, opacity: 0.8 } : { scale: 0, opacity: 0 }}
                animate={{
                  scale: animPhase === "retract" ? 0 : [0.9, 1.15, 0.9],
                  opacity: animPhase === "retract" ? 0 : 0.85,
                }}
                transition={{
                  duration: animPhase === "retract" ? 0.25 : 1.8,
                  repeat: animPhase === "retract" ? 0 : Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Inner bright beacon marker */}
              <motion.circle
                cx={geometry.anchor.x}
                cy={geometry.anchor.y}
                r="3.5"
                fill="#38bdf8"
                stroke="#ffffff"
                strokeWidth="1.5"
                initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                animate={{
                  scale: animPhase === "retract" ? 0 : 1,
                  opacity: animPhase === "retract" ? 0 : 1,
                }}
                transition={{
                  duration: animPhase === "retract" ? 0.25 : 0.35,
                  ease: "easeOut",
                }}
              />

              {/* Pinpoint terminal connector dot touching the card */}
              <motion.circle
                cx={geometry.target.x}
                cy={geometry.target.y}
                r="2.5"
                fill="#38bdf8"
                initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                animate={{
                  scale: animPhase === "retract" ? 0 : 1,
                  opacity: animPhase === "retract" ? 0 : 1,
                }}
                transition={{
                  duration: animPhase === "retract" ? 0.2 : 0.4,
                  delay: animPhase === "retract" ? 0 : 0.2,
                }}
              />
            </g>
          )}
        </svg>

        {/* ===================================================================== */}
        {/* 3. FLOATING ACTIVE NAVIGATION CARD (ONLY ONE AT A TIME)               */}
        {/* Emerges along vector from Earth, holds for reading/hover, retracts    */}
        {/* ===================================================================== */}
        <div className="absolute inset-0 pointer-events-none z-30">
          <AnimatePresence mode="wait">
            {hasTriggered && (
              <motion.div
                key={activeDest.id}
                id={`floating-nav-${activeDest.id}`}
                className="absolute pointer-events-auto"
                style={{
                  left: geometry.card.x,
                  top: geometry.card.y,
                  width: geometry.card.width,
                }}
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.94,
                        x: geometry.norm.x * 20,
                        y: geometry.norm.y * 20,
                      }
                }
                animate={{
                  opacity: animPhase === "retract" ? 0 : 1,
                  scale: animPhase === "retract" ? 0.94 : 1,
                  x: animPhase === "retract" ? geometry.norm.x * 16 : 0,
                  y: animPhase === "retract" ? geometry.norm.y * 16 : 0,
                }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.94,
                        x: geometry.norm.x * 16,
                        y: geometry.norm.y * 16,
                      }
                }
                transition={{
                  duration: animPhase === "retract" ? 0.32 : 0.45,
                  ease: animPhase === "retract" ? [0.4, 0, 1, 1] : [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  to={activeDest.path}
                  aria-label={`Navigate to ${activeDest.title} (${activeDest.tagline})`}
                  onMouseEnter={() => setIsCardHovered(true)}
                  onMouseLeave={() => setIsCardHovered(false)}
                  onFocus={() => setIsCardFocused(true)}
                  onBlur={() => setIsCardFocused(false)}
                  className="group relative block rounded-2xl border border-sky-400/35 bg-[#09101f]/85 backdrop-blur-xl p-3.5 sm:p-4 shadow-[0_0_24px_rgba(14,165,233,0.18)] hover:border-sky-300/60 hover:shadow-[0_0_32px_rgba(56,189,248,0.32)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 select-none active:scale-[0.98]"
                >
                  {/* Ambient internal card corner highlight */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-radial from-sky-400/10 to-transparent rounded-tr-2xl pointer-events-none" />

                  {/* Top Row: Index number (01, 02, 03, 04) + Arrow in rounded box */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-slate-400 tracking-wider group-hover:text-slate-300 transition-colors">
                      {activeDest.number}
                    </span>
                    <div className="flex items-center justify-center w-5 h-5 rounded-md bg-slate-900/90 border border-slate-800 text-slate-300 group-hover:text-white group-hover:border-sky-400/50 group-hover:bg-sky-950/40 transition-colors">
                      <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Middle Row: Destination Icon + Bold Title */}
                  <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
                    <ActiveIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-sky-400 shrink-0 group-hover:text-sky-300 transition-colors" />
                    <h3 className="font-display text-base sm:text-lg font-bold tracking-wide text-white group-hover:text-cyan-300 transition-colors leading-none">
                      {activeDest.title}
                    </h3>
                  </div>

                  {/* Bottom: Subtitle / Destination Tagline */}
                  <p className="text-[11px] sm:text-xs text-slate-300 font-sans mt-1.5 leading-snug line-clamp-2 group-hover:text-slate-200 transition-colors">
                    {activeDest.tagline}
                  </p>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
