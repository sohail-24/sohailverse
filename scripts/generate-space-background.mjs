import fs from "fs";
import path from "path";
import sharp from "sharp";

const WIDTH = 2560;
const HEIGHT = 1440; // 16:9 2K cinematic deep-space universe canvas

function buildDeepSpaceUniverseSvg() {
  let seed = 421337;
  function rand() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  // 1. STARFIELD GENERATION (ASTRONOMICAL POWER-LAW DISTRIBUTION)
  // Real astronomical fields have huge numbers of microscopic, faint stars,
  // with only a tiny fraction of bright anchor stars.
  const totalStars = 1600;
  const starsSvg = [];

  for (let i = 0; i < totalStars; i++) {
    const x = rand() * WIDTH;
    const y = rand() * HEIGHT;
    const p = rand();

    // Natural stellar spectral temperatures (O, B, A, F, G, K, M)
    let color = "#e2e8f0"; // White A/F
    if (p < 0.22) color = "#93c5fd"; // Blue-white O/B
    else if (p < 0.38) color = "#c7d2fe"; // Indigo-white
    else if (p < 0.48) color = "#fef3c7"; // Solar warm G
    else if (p < 0.54) color = "#fed7aa"; // Amber K
    else if (p < 0.58) color = "#fca5a5"; // M-dwarf soft red

    // Keep the center region (where Earth sits: x~1280, y~720, radius~380) clean
    // with mostly microscopic background stars so Earth has crisp contrast
    const distToCenter = Math.sqrt((x - WIDTH / 2) ** 2 + (y - HEIGHT / 2) ** 2);
    const inEarthFocalZone = distToCenter < 380;

    let r = 0.35 + rand() * 0.45; // Micro-star (0.35px - 0.8px)
    let opacity = 0.12 + rand() * 0.45;

    if (inEarthFocalZone) {
      r *= 0.75;
      opacity *= 0.5;
    }

    // A tiny handful of prominent anchor field stars outside the center
    if (i < 24 && !inEarthFocalZone) {
      r = 1.2 + rand() * 0.7;
      opacity = 0.85 + rand() * 0.15;
      // Soft radial stellar glow
      starsSvg.push(
        `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * 2.8).toFixed(1)}" fill="${color}" opacity="0.16"/>`
      );
      // Subtle 4-point diffraction spike on the brightest stars (astronomical telescope signature)
      if (i < 8) {
        const spikeLen = (r * 6.5).toFixed(1);
        starsSvg.push(
          `<line x1="${(x - spikeLen)}" y1="${y.toFixed(1)}" x2="${(x + spikeLen)}" y2="${y.toFixed(1)}" stroke="${color}" stroke-width="0.5" opacity="0.25"/>`
        );
        starsSvg.push(
          `<line x1="${x.toFixed(1)}" y1="${(y - spikeLen)}" x2="${x.toFixed(1)}" y2="${(y + spikeLen)}" stroke="${color}" stroke-width="0.5" opacity="0.25"/>`
        );
      }
    } else if (i < 120 && !inEarthFocalZone) {
      r = 0.8 + rand() * 0.35;
      opacity = 0.45 + rand() * 0.35;
    }

    starsSvg.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`
    );
  }

  // 2. GLOBULAR STAR CLUSTERS (Dense spherical swarms of microscopic stars)
  // Cluster A: In distant upper-left space (x=520, y=260)
  const clusterStars = [];
  const generateCluster = (cx, cy, starCount, radius) => {
    for (let c = 0; c < starCount; c++) {
      const u = rand();
      const theta = rand() * Math.PI * 2;
      // Gaussian-like concentration towards center
      const dist = radius * Math.pow(u, 1.8);
      const px = cx + Math.cos(theta) * dist;
      const py = cy + Math.sin(theta) * dist;
      const r = 0.3 + (1 - dist / radius) * 0.5;
      const op = 0.2 + (1 - dist / radius) * 0.6;
      clusterStars.push(
        `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r.toFixed(1)}" fill="#e0f2fe" opacity="${op.toFixed(2)}"/>`
      );
    }
  };
  generateCluster(520, 240, 90, 48); // Messier-type globular cluster
  generateCluster(2050, 1120, 75, 42); // Distant southern cluster

  // 3. INTERSTELLAR DUST LANES & COSMIC GAS RIFTS (Unresolved stellar emission clouds)
  const dustRifts = [];
  for (let d = 0; d < 70; d++) {
    const t = d / 70;
    // Spans diagonally across the background, passing well behind Earth
    const cx = WIDTH * 0.12 + t * WIDTH * 0.78 + (rand() - 0.5) * 220;
    const cy = HEIGHT * 0.88 - t * HEIGHT * 0.76 + (rand() - 0.5) * 180;
    const rx = 140 + rand() * 190;
    const ry = 65 + rand() * 95;
    const rot = -32 + (rand() - 0.5) * 15;
    const op = 0.012 + rand() * 0.022;
    // Deep interstellar palette: dark cyan, cosmic violet, deep indigo
    const col = rand() > 0.45 ? "#38bdf8" : "#818cf8";
    dustRifts.push(
      `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" transform="rotate(${rot.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})" fill="${col}" opacity="${op.toFixed(3)}" />`
    );
  }

  return `
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Base Cosmic Void Gradient -->
      <radialGradient id="deepVoid" cx="50%" cy="50%" r="75%">
        <stop offset="0%" stop-color="#040813"/>
        <stop offset="42%" stop-color="#020409"/>
        <stop offset="78%" stop-color="#010206"/>
        <stop offset="100%" stop-color="#000103"/>
      </radialGradient>

      <!-- GRAND SPIRAL GALAXY (Upper Right: cx=2020, cy=360) -->
      <!-- Galaxy Core Luminous Gradient -->
      <radialGradient id="galaxyCore" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fffbeb" stop-opacity="0.92"/>
        <stop offset="18%" stop-color="#fef3c7" stop-opacity="0.65"/>
        <stop offset="40%" stop-color="#93c5fd" stop-opacity="0.32"/>
        <stop offset="70%" stop-color="#6366f1" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="#020409" stop-opacity="0"/>
      </radialGradient>

      <!-- Galaxy Outer Arms Disk Gradient -->
      <radialGradient id="galaxyDisk" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#a5b4fc" stop-opacity="0.35"/>
        <stop offset="35%" stop-color="#38bdf8" stop-opacity="0.18"/>
        <stop offset="65%" stop-color="#1e1b4b" stop-opacity="0.06"/>
        <stop offset="100%" stop-color="#020409" stop-opacity="0"/>
      </radialGradient>

      <!-- DISTANT EDGE-ON LENTICULAR GALAXY (Upper Left: cx=380, cy=290) -->
      <radialGradient id="edgeOnCore" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fffbeb" stop-opacity="0.85"/>
        <stop offset="25%" stop-color="#fed7aa" stop-opacity="0.45"/>
        <stop offset="60%" stop-color="#60a5fa" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#020409" stop-opacity="0"/>
      </radialGradient>

      <!-- EMISSION NEBULA 1: Celestial Cyan/Blue Veil (Lower Left Quadrant) -->
      <radialGradient id="nebulaCyan" cx="22%" cy="68%" r="42%">
        <stop offset="0%" stop-color="#0284c7" stop-opacity="0.11"/>
        <stop offset="35%" stop-color="#0369a1" stop-opacity="0.06"/>
        <stop offset="70%" stop-color="#075985" stop-opacity="0.02"/>
        <stop offset="100%" stop-color="#020409" stop-opacity="0"/>
      </radialGradient>

      <!-- EMISSION NEBULA 2: Deep Indigo & Hydrogen Dust (Upper Center-Left) -->
      <radialGradient id="nebulaIndigo" cx="35%" cy="20%" r="38%">
        <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.09"/>
        <stop offset="40%" stop-color="#312e81" stop-opacity="0.045"/>
        <stop offset="75%" stop-color="#1e1b4b" stop-opacity="0.015"/>
        <stop offset="100%" stop-color="#020409" stop-opacity="0"/>
      </radialGradient>

      <!-- EMISSION NEBULA 3: Distant Hydrogen-Alpha Crimson/Violet Gas (Lower Right Quadrant) -->
      <radialGradient id="nebulaHa" cx="78%" cy="72%" r="45%">
        <stop offset="0%" stop-color="#701a75" stop-opacity="0.08"/>
        <stop offset="30%" stop-color="#4c0519" stop-opacity="0.04"/>
        <stop offset="65%" stop-color="#1e1b4b" stop-opacity="0.015"/>
        <stop offset="100%" stop-color="#020409" stop-opacity="0"/>
      </radialGradient>

      <!-- Subtle Cosmic Dawn Scatter (Far Upper Left Edge, very subtle natural astronomical lighting) -->
      <radialGradient id="cosmicDawn" cx="0%" cy="0%" r="35%">
        <stop offset="0%" stop-color="#fde047" stop-opacity="0.14"/>
        <stop offset="25%" stop-color="#38bdf8" stop-opacity="0.06"/>
        <stop offset="60%" stop-color="#1e1b4b" stop-opacity="0.015"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- 1. Deep Space Cosmic Black Canvas -->
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#deepVoid)"/>

    <!-- 2. Nebular Gas Veils & Cosmic Hydrogen Dust -->
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#nebulaCyan)"/>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#nebulaIndigo)"/>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#nebulaHa)"/>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#cosmicDawn)"/>

    <!-- 3. Interstellar Dust Lane / Faint Milky Way Belt -->
    <g id="dustLanes">
      ${dustRifts.join("\n")}
    </g>

    <!-- 4. DISTANT CELESTIAL STRUCTURES (NO PLANETS! Deep Universe Galaxies & Clusters Only) -->
    
    <!-- A. Grand Spiral Galaxy (Tilted Andromeda-like galaxy in upper-right deep perspective) -->
    <g transform="translate(1960, 340) rotate(-26)" opacity="0.88">
      <!-- Outer galactic disk -->
      <ellipse cx="0" cy="0" rx="190" ry="72" fill="url(#galaxyDisk)"/>
      <ellipse cx="0" cy="0" rx="145" ry="54" fill="url(#galaxyDisk)" opacity="0.75"/>
      
      <!-- Spiral arms structure simulation (faint luminous arcs) -->
      <path d="M -150,22 Q -80,55 0,38 Q 90,18 160,-15" fill="none" stroke="#60a5fa" stroke-width="12" stroke-linecap="round" opacity="0.10"/>
      <path d="M 150,-22 Q 80,-55 0,-38 Q -90,-18 -160,15" fill="none" stroke="#818cf8" stroke-width="12" stroke-linecap="round" opacity="0.10"/>
      <path d="M -110,14 Q -50,38 0,26 Q 60,12 110,-10" fill="none" stroke="#93c5fd" stroke-width="8" stroke-linecap="round" opacity="0.14"/>
      <path d="M 110,-10 Q 50,-38 0,-26 Q -60,-12 -110,10" fill="none" stroke="#a5b4fc" stroke-width="8" stroke-linecap="round" opacity="0.14"/>
      
      <!-- Interstellar dust absorption lane cutting across nucleus -->
      <ellipse cx="-5" cy="4" rx="90" ry="16" fill="#020409" opacity="0.45"/>
      
      <!-- Luminous Galactic Nucleus / Central Bulge -->
      <ellipse cx="0" cy="0" rx="55" ry="24" fill="url(#galaxyCore)"/>
      <circle cx="0" cy="0" r="14" fill="#ffffff" opacity="0.75"/>
      <circle cx="0" cy="0" r="6" fill="#ffffff" opacity="0.95"/>
    </g>

    <!-- B. Distant Edge-on Lenticular Galaxy (Upper-Left: cx=380, cy=290, tiny & realistic) -->
    <g transform="translate(380, 290) rotate(38)" opacity="0.75">
      <!-- Faint galactic disk halo -->
      <ellipse cx="0" cy="0" rx="70" ry="14" fill="url(#edgeOnCore)" opacity="0.55"/>
      <ellipse cx="0" cy="0" rx="42" ry="8" fill="url(#edgeOnCore)"/>
      <!-- Dust lane bisecting disk -->
      <line x1="-38" y1="0.5" x2="38" y2="0.5" stroke="#010206" stroke-width="1.8" opacity="0.65"/>
      <!-- Core bulge -->
      <ellipse cx="0" cy="0" rx="12" ry="7" fill="#fffbeb" opacity="0.85"/>
      <circle cx="0" cy="0" r="3" fill="#ffffff" opacity="0.95"/>
    </g>

    <!-- C. Distant Dwarf Elliptical Galaxy (Lower-Right: cx=1780, cy=1050) -->
    <g transform="translate(1780, 1050) rotate(-15)" opacity="0.50">
      <ellipse cx="0" cy="0" rx="36" ry="24" fill="#93c5fd" opacity="0.12"/>
      <ellipse cx="0" cy="0" rx="18" ry="12" fill="#c7d2fe" opacity="0.22"/>
      <circle cx="0" cy="0" r="4" fill="#ffffff" opacity="0.65"/>
    </g>

    <!-- D. Globular Star Clusters -->
    <g id="starClusters">
      ${clusterStars.join("\n")}
    </g>

    <!-- 5. Vast Field of Stars -->
    <g id="stars">
      ${starsSvg.join("\n")}
    </g>

    <!-- 6. Extremely subtle, long photographic light ray (deep space exposure artifact) -->
    <line x1="0" y1="0" x2="${WIDTH * 0.45}" y2="${HEIGHT * 0.45}" stroke="#38bdf8" stroke-width="0.75" opacity="0.035"/>
    <line x1="${WIDTH}" y1="0" x2="${WIDTH * 0.55}" y2="${HEIGHT * 0.45}" stroke="#818cf8" stroke-width="0.5" opacity="0.025"/>
  </svg>
  `;
}

async function run() {
  console.log("Generating photorealistic astronomical UNIVERSE & DEEP SPACE background (NO planets)...");
  const svg = buildDeepSpaceUniverseSvg();
  const svgBuffer = Buffer.from(svg.trim());

  const publicDir = path.resolve("public");

  // Output 1: High quality JPEG (/public/earth-space-background.jpg)
  const jpgPath = path.join(publicDir, "earth-space-background.jpg");
  await sharp(svgBuffer)
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(jpgPath);

  // Output 2: WebP (/public/earth-space-background.webp)
  const webpPath = path.join(publicDir, "earth-space-background.webp");
  await sharp(svgBuffer)
    .webp({ quality: 90, effort: 4 })
    .toFile(webpPath);

  const jpgStat = fs.statSync(jpgPath);
  const webpStat = fs.statSync(webpPath);
  console.log(`Successfully generated ${jpgPath}: ${(jpgStat.size / 1024).toFixed(1)} KB`);
  console.log(`Successfully generated ${webpPath}: ${(webpStat.size / 1024).toFixed(1)} KB`);
}

run().catch(console.error);
