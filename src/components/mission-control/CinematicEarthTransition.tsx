import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, User, FolderGit2, Film, Cloud } from "lucide-react";
import * as THREE from "three";

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
  const containerRef = useRef<HTMLDivElement | null>(null);
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

    return {
      anchor: { x: anchorX, y: anchorY },
      p1,
      p2,
      target: { x: targetX, y: targetY },
      pathD,
      card: { x: cardX, y: cardY, width: cardW, height: cardH },
      norm: { x: normX, y: normY },
    };
  }, [stageSize, activeIndex]);

  // Three.js Photorealistic 3D Globe with fixed center position & longitude rotation
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Dimensions
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // Scene
    const scene = new THREE.Scene();

    // Camera: fixed viewport looking directly at the center (0, 0, 0)
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.25);
    camera.lookAt(0, 0, 0);

    // Renderer with transparent canvas
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

    // Earth Group (strictly locked at 0, 0, 0 in space)
    const earthGroup = new THREE.Group();
    earthGroup.position.set(0, 0, 0);
    // Subtle realistic axial tilt of 23.4 degrees
    earthGroup.rotation.z = THREE.MathUtils.degToRad(23.4);
    earthGroup.rotation.x = THREE.MathUtils.degToRad(8);
    scene.add(earthGroup);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // 1. Primary Earth Surface Mesh
    const earthTexture = textureLoader.load("/earth-texture-2048.jpg");
    earthTexture.colorSpace = THREE.SRGBColorSpace;

    const earthGeometry = new THREE.SphereGeometry(1.0, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.04,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // 2. Translucent Clouds Layer
    const cloudsTexture = textureLoader.load("/earth-clouds-1024.png");
    // Cloud layer closely hugging the planet surface naturally
    const cloudsGeometry = new THREE.SphereGeometry(1.008, 64, 64);
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      roughness: 0.9,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    earthGroup.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    // Note: All artificial blue outline meshes, glowing rings, and fake atmospheric borders
    // are completely removed. The Earth's natural limb and clouds define the edge against space.

    // Realistic Planetary Lighting:
    // Main Sun directional light (illuminates the daylit hemisphere with a sharp, natural terminator)
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(4.6, 1.8, 3.4);
    scene.add(sunLight);

    // Deep space dark ambient fill (keeps night hemisphere in authentic, deep astronomical shadow)
    const ambientLight = new THREE.AmbientLight(0x0a101f, 0.16);
    scene.add(ambientLight);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop: STRICTLY FIXED POSITION, ONLY SURFACE ROTATES
    let animationFrameId: number;
    // Automatic rotation slowed down (~47% slower than previous) for a calm, cinematic planetary feel
    const autoSpeed = shouldReduceMotion ? 0 : 0.00085;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Invariant checks: The globe center never moves!
      earthGroup.position.set(0, 0, 0);
      camera.position.set(0, 0, 3.25);

      if (isDraggingRef.current) {
        // User manual drag is active: auto-rotation is paused
      } else {
        // Momentum decay or calm automatic rotation in place
        if (Math.abs(velocityRef.current) > 0.0001) {
          if (earthMeshRef.current) {
            earthMeshRef.current.rotation.y += velocityRef.current;
          }
          if (cloudsMeshRef.current) {
            cloudsMeshRef.current.rotation.y += velocityRef.current * 1.02;
          }
          // Smooth physical friction decay
          velocityRef.current *= 0.93;
        } else {
          velocityRef.current = 0;
          // Calm, slow automatic rotation in place
          if (earthMeshRef.current) {
            earthMeshRef.current.rotation.y += autoSpeed;
          }
          if (cloudsMeshRef.current) {
            // Clouds slowly drift at a realistic differential speed
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
      earthMaterial.dispose();
      cloudsGeometry.dispose();
      cloudsMaterial.dispose();
      earthTexture.dispose();
      cloudsTexture.dispose();
    };
  }, [shouldReduceMotion]);

  // User Drag Handlers: Click + Drag (Desktop) & Touch + Drag / Swipe (Mobile)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // Ignored if capture unsupported
    }

    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    setIsHoveredOrDragging(true);

    // Any user interaction immediately ensures navigation animation is triggered
    setHasTriggered(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;

    const currentX = e.clientX;
    const deltaX = currentX - lastXRef.current;
    const now = performance.now();
    const dt = Math.max(now - lastTimeRef.current, 1);

    const canvas = canvasRef.current;
    const width = canvas ? canvas.clientWidth : 360;

    // Responsive and direct:
    // Dragging LEFT (deltaX < 0) rotates surface toward the left
    // Dragging RIGHT (deltaX > 0) rotates surface toward the right
    const rotDelta = (deltaX / width) * Math.PI * 1.5;

    if (earthMeshRef.current) {
      earthMeshRef.current.rotation.y += rotDelta;
    }
    if (cloudsMeshRef.current) {
      cloudsMeshRef.current.rotation.y += rotDelta * 1.02;
    }

    // Velocity calculation for release momentum (normalized to ~16ms frame)
    velocityRef.current = (rotDelta / dt) * 16;
    velocityRef.current = Math.max(-0.06, Math.min(0.06, velocityRef.current));

    lastXRef.current = currentX;
    lastTimeRef.current = now;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas && canvas.hasPointerCapture(e.pointerId)) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    }
    isDraggingRef.current = false;
    setIsHoveredOrDragging(false);
  };

  // Multi-depth astronomical star field:
  // Layered into deep-field micro pinpoints, mid-field stars, and prominent anchor stars.
  // Natural variation in size (0.75px–1.8px), opacity (0.1–0.85), and stellar color temperatures.
  // Mostly static (only ~7% have slow, subtle astronomical shimmer) to avoid distraction.
  const stars = useMemo(() => {
    const starList = [];
    const count = 112;

    for (let i = 0; i < count; i++) {
      // Deterministic non-uniform pseudo-random distribution
      const rawX = (i * 37 + 13) % 100;
      const rawY = (i * 59 + 29) % 100;

      // Keep the immediate center behind the Earth slightly clearer
      const distFromCenter = Math.hypot(rawX - 50, (rawY - 38) * 1.3);
      if (distFromCenter < 12 && i % 3 !== 0) {
        continue;
      }

      let size = 1.0;
      let opacity = 0.25;
      let color = "#cbd5e1"; // Neutral cool starlight
      let glow: string | undefined = undefined;
      let hasTwinkle = false;
      let twinkleDuration = "6.5";
      let twinkleDelay = "0";

      if (i % 11 === 0) {
        // Prominent navigation stars (1.5px - 1.8px)
        size = 1.5 + (i % 4) * 0.1;
        opacity = 0.72 + (i % 5) * 0.03;
        color = i % 22 === 0 ? "#e0f2fe" : "#ffffff";
        glow = "0 0 2.5px 0.5px rgba(224, 242, 254, 0.4)";
        hasTwinkle = i % 33 === 0;
        twinkleDuration = (6.0 + (i % 3)).toFixed(1);
        twinkleDelay = ((i * 0.9) % 4).toFixed(1);
      } else if (i % 3 === 0) {
        // Mid-field stars (1.1px - 1.4px)
        size = 1.1 + (i % 3) * 0.1;
        opacity = 0.38 + (i % 6) * 0.05;
        color = i % 6 === 0 ? "#e0f2fe" : i % 9 === 0 ? "#fef3c7" : "#f1f5f9";
        hasTwinkle = i % 18 === 0;
        twinkleDuration = (5.5 + (i % 4)).toFixed(1);
        twinkleDelay = ((i * 1.1) % 3).toFixed(1);
      } else {
        // Distant deep-field micro pinpoints (0.75px - 1.0px)
        size = 0.8 + (i % 3) * 0.1;
        opacity = 0.12 + (i % 7) * 0.03;
        color = "#94a3b8";
        hasTwinkle = false; // Strictly static
      }

      starList.push({
        id: i,
        x: rawX.toFixed(1),
        y: rawY.toFixed(1),
        size,
        opacity,
        color,
        glow,
        hasTwinkle,
        twinkleDuration,
        twinkleDelay,
      });
    }

    return starList;
  }, []);

  const activeDest = NAV_DESTINATIONS[activeIndex];
  const ActiveIcon = activeDest.icon;

  return (
    <section
      ref={sectionRef}
      id="cinematic-earth-transition"
      aria-label="Earth and Navigation Transition"
      className="relative w-full overflow-hidden bg-transparent text-white pt-2 sm:pt-4 pb-10 sm:pb-14 mt-1 sm:mt-2 mb-8 sm:mb-12"
    >
      {/* Inline styles for subtle, slow astronomical shimmer */}
      <style>{`
        @keyframes deepSpaceShimmer {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.75; }
        }
      `}</style>

      {/* ========================================================================= */}
      {/* REALISTIC CINEMATIC DEEP-SPACE & GALAXY ENVIRONMENT                      */}
      {/* Restrained astronomical dust lane, cosmic haze, and multi-depth stars     */}
      {/* Dark, subtle, seamlessly blending into the page with zero visible box      */}
      {/* ========================================================================= */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none">
        
        {/* 1. Deep Space Galactic Plane (Tilted astronomical Milky Way dust band) */}
        <div
          className="absolute -inset-x-24 -inset-y-32 opacity-70"
          style={{
            transform: "rotate(-21deg)",
            transformOrigin: "center center",
          }}
        >
          {/* Faint unresolved starlight lane */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_36%_at_50%_50%,rgba(148,163,184,0.038)_0%,rgba(56,189,248,0.016)_38%,rgba(99,102,241,0.012)_62%,transparent_82%)]" />

          {/* Interstellar dust rifts (dark molecular clouds splitting the starlight) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_18%_at_48%_52%,rgba(2,6,23,0.5)_0%,transparent_75%)]" />
        </div>

        {/* 2. Asymmetrical Deep Space Nebula Clouds (Very faint astronomical emission & dust) */}
        {/* Upper-left quadrant: cold cosmic indigo dust */}
        <div className="absolute -top-12 -left-12 w-96 h-96 sm:w-[520px] sm:h-[520px] rounded-full bg-[radial-gradient(circle,rgba(30,58,138,0.045)_0%,rgba(14,116,144,0.02)_42%,transparent_72%)] blur-2xl" />

        {/* Lower-right quadrant: deep interstellar slate-violet dust */}
        <div className="absolute -bottom-16 -right-16 w-96 h-96 sm:w-[560px] sm:h-[560px] rounded-full bg-[radial-gradient(circle,rgba(67,56,202,0.032)_0%,rgba(15,23,42,0.02)_46%,transparent_75%)] blur-2xl" />

        {/* Distant celestial haze patch in upper right */}
        <div className="absolute top-8 right-[10%] w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.022)_0%,transparent_65%)] blur-xl" />

        {/* 3. Calm Central Dark Zone: Ensures Earth is the undisputed hero with high contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_260px_at_50%_38%,rgba(2,6,23,0.92)_0%,rgba(2,6,23,0.55)_50%,transparent_85%)]" />

        {/* 4. Astronomical Multi-Depth Star Field */}
        {stars.map((s) => (
          <span
            key={s.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              backgroundColor: s.color,
              opacity: s.opacity,
              boxShadow: s.glow,
              animation: s.hasTwinkle && !shouldReduceMotion
                ? `deepSpaceShimmer ${s.twinkleDuration}s ease-in-out infinite ${s.twinkleDelay}s`
                : undefined,
            }}
          />
        ))}

        {/* 5. Smooth Top & Bottom Page Edge Blending (Zero hard boundaries) */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#020409]/90 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#020409]/90 to-transparent" />
      </div>

      {/* ========================================================================= */}
      {/* 1. FIXED CENTERED REALISTIC EARTH + FLOATING NAVIGATION OVERLAY           */}
      {/* Earth remains completely fixed in center. Single card emerges via glowing */}
      {/* connection line from Earth anchor point, holds, and smoothly retracts.     */}
      {/* Sequence: About -> Projects -> Cinema -> DevOps -> repeat                */}
      {/* ========================================================================= */}
      <div
        ref={stageRef}
        id="earth-floating-navigation-stage"
        className="relative w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto min-h-[480px] sm:min-h-[520px] md:min-h-[580px] lg:min-h-[680px] xl:min-h-[740px] flex items-center justify-center select-none px-4 sm:px-6 lg:px-8"
      >
        {/* Stationary Earth Viewport (Completely fixed, centered, draggable/swipeable) */}
        {/* Mobile Earth diameter is preserved exactly; Desktop Earth is substantially enlarged & cinematic */}
        <div
          ref={containerRef}
          id="fixed-earth-container"
          className="relative shrink-0 w-60 h-60 sm:w-76 sm:h-76 md:w-[440px] md:h-[440px] lg:w-[520px] lg:h-[520px] xl:w-[580px] xl:h-[580px] 2xl:w-[620px] 2xl:h-[620px] flex items-center justify-center mx-auto select-none z-10"
        >
          {/* Transparent WebGL Canvas: captures pointer drag & touch swipe with touch-action: none */}
          <canvas
            ref={canvasRef}
            id="earth-webgl-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`w-full h-full block select-none ${
              isHoveredOrDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              touchAction: "none",
            }}
            title="Drag left or right to rotate the Earth"
            aria-label="Interactive 3D realistic globe. Drag left or right to rotate planetary longitude."
          />
        </div>

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
