import React from "react";

export default function DeveloperWorkstationVisual() {
  return (
    <div className="relative w-full max-w-[760px] mx-auto select-none">
      {/* Ambient background bloom matching target dark room illumination */}
      <div className="absolute -inset-6 bg-gradient-to-tr from-cyan-500/15 via-lime-500/10 to-rose-500/15 rounded-3xl blur-3xl opacity-90 pointer-events-none" />

      {/* Visual Canvas Container */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#04060d] shadow-[0_30px_70px_rgba(0,0,0,0.95)]">
        <svg
          viewBox="0 0 920 690"
          className="w-full h-auto block"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Global Gradients */}
            <linearGradient id="bgStudioGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#080c18" />
              <stop offset="40%" stopColor="#04060c" />
              <stop offset="85%" stopColor="#020306" />
              <stop offset="100%" stopColor="#010204" />
            </linearGradient>

            <linearGradient id="cityWindowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0b162b" />
              <stop offset="60%" stopColor="#070e1d" />
              <stop offset="100%" stopColor="#03060f" />
            </linearGradient>

            <linearGradient id="woodDeskTopGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#18110a" />
              <stop offset="25%" stopColor="#2c1e13" />
              <stop offset="55%" stopColor="#22160d" />
              <stop offset="85%" stopColor="#2c1e13" />
              <stop offset="100%" stopColor="#130b05" />
            </linearGradient>

            <linearGradient id="hoodieMatteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1f2430" />
              <stop offset="35%" stopColor="#13161f" />
              <stop offset="70%" stopColor="#0a0c11" />
              <stop offset="100%" stopColor="#050608" />
            </linearGradient>

            <linearGradient id="hoodieLeftCyanRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
              <stop offset="40%" stopColor="#22c55e" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            <linearGradient id="hoodieRightAmberRim" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#d97706" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            <linearGradient id="skinToneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c58e6d" />
              <stop offset="50%" stopColor="#a77353" />
              <stop offset="100%" stopColor="#825236" />
            </linearGradient>

            <linearGradient id="lampConeGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
              <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            <linearGradient id="chairMeshGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#191f2b" />
              <stop offset="50%" stopColor="#283244" />
              <stop offset="100%" stopColor="#111620" />
            </linearGradient>

            {/* Neon Glow Filters */}
            <filter id="neonGreenGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur3" />
              <feMerge>
                <feMergeNode in="blur3" />
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="neonCyanGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur3" />
              <feMerge>
                <feMergeNode in="blur3" />
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="neonPinkGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur3" />
              <feMerge>
                <feMergeNode in="blur3" />
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="softDiffusionBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="35" />
            </filter>

            {/* Subtle Fabric Grain */}
            <pattern id="brickPattern" width="40" height="20" patternUnits="userSpaceOnUse">
              <rect width="40" height="20" fill="none" />
              <path d="M 0 10 L 40 10 M 20 0 L 20 10 M 0 20 L 40 20 M 40 10 L 40 20 M 0 10 L 0 20" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* 1. ROOM ENVIRONMENT CANVAS */}
          <rect width="920" height="690" fill="url(#bgStudioGrad)" />
          {/* Subtle Brick Wall Texture on Right */}
          <rect x="520" y="0" width="400" height="420" fill="url(#brickPattern)" opacity="0.7" />

          {/* Ambient Lighting Spheres */}
          <circle cx="260" cy="180" r="180" fill="#06b6d4" opacity="0.14" filter="url(#softDiffusionBlur)" />
          <circle cx="780" cy="120" r="150" fill="#f43f5e" opacity="0.12" filter="url(#softDiffusionBlur)" />
          <circle cx="690" cy="70" r="130" fill="#a3e635" opacity="0.12" filter="url(#softDiffusionBlur)" />
          <circle cx="850" cy="360" r="120" fill="#f59e0b" opacity="0.18" filter="url(#softDiffusionBlur)" />

          {/* 2. BACKGROUND CITY SKYLINE WINDOW (Left & Mid Background) */}
          <g opacity="0.9">
            {/* Window Pane Frame */}
            <rect x="40" y="30" width="490" height="360" rx="14" fill="url(#cityWindowGrad)" />
            <rect x="40" y="30" width="490" height="360" rx="14" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
            {/* Window Glass Mullions */}
            <line x1="280" y1="30" x2="280" y2="390" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
            <line x1="40" y1="210" x2="530" y2="210" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />

            {/* Skyscraper Silhouettes */}
            <rect x="60" y="160" width="48" height="230" fill="#081020" />
            <rect x="118" y="100" width="60" height="290" fill="#0a152a" />
            {/* Tower Spire */}
            <polygon points="148,60 146,100 150,100" fill="#38bdf8" opacity="0.85" />
            <circle cx="148" cy="58" r="2.5" fill="#ef4444" />

            <rect x="188" y="170" width="55" height="220" fill="#060c18" />
            <rect x="250" y="120" width="70" height="270" fill="#0b1730" />
            <polygon points="285,80 283,120 287,120" fill="#38bdf8" opacity="0.85" />
            <circle cx="285" cy="78" r="2.5" fill="#ef4444" />

            <rect x="330" y="165" width="48" height="225" fill="#070e1c" />
            <rect x="388" y="130" width="56" height="260" fill="#0c1932" />
            <rect x="454" y="195" width="58" height="195" fill="#060d1b" />

            {/* Glowing Office Windows (Cyan / Emerald / Amber) */}
            <g fill="#38bdf8" opacity="0.65">
              <rect x="128" y="120" width="4" height="6" />
              <rect x="138" y="120" width="4" height="6" />
              <rect x="148" y="120" width="4" height="6" />
              <rect x="160" y="120" width="4" height="6" />
              <rect x="128" y="145" width="4" height="6" />
              <rect x="148" y="145" width="4" height="6" />
              <rect x="128" y="175" width="4" height="6" />
              <rect x="160" y="175" width="4" height="6" />
              <rect x="262" y="140" width="5" height="7" />
              <rect x="278" y="140" width="5" height="7" />
              <rect x="294" y="140" width="5" height="7" />
              <rect x="262" y="170" width="5" height="7" />
              <rect x="294" y="170" width="5" height="7" />
              <rect x="398" y="150" width="4" height="6" />
              <rect x="414" y="150" width="4" height="6" />
              <rect x="398" y="180" width="4" height="6" />
            </g>

            <g fill="#fbbf24" opacity="0.55">
              <rect x="72" y="180" width="4" height="6" />
              <rect x="86" y="180" width="4" height="6" />
              <rect x="72" y="210" width="4" height="6" />
              <rect x="138" y="200" width="4" height="6" />
              <rect x="160" y="200" width="4" height="6" />
              <rect x="198" y="190" width="4" height="6" />
              <rect x="214" y="190" width="4" height="6" />
              <rect x="278" y="160" width="5" height="7" />
              <rect x="345" y="180" width="4" height="6" />
              <rect x="425" y="170" width="4" height="6" />
            </g>

            {/* City Atmosphere Night Mist */}
            <rect x="40" y="270" width="490" height="120" fill="url(#cityWindowGrad)" opacity="0.75" />
          </g>

          {/* 3. NEON WALL SIGNS (Top Right Matching IMAGE 2) */}
          <g id="neonSignsGroup" transform="translate(635, 40)">
            {/* Sign 1: Green "Code is my love" with Heart */}
            <g filter="url(#neonGreenGlow)">
              <text
                x="120"
                y="35"
                textAnchor="middle"
                fill="#4ade80"
                stroke="#22c55e"
                strokeWidth="0.8"
                fontFamily="'Caveat', 'Segoe Script', 'Brush Script MT', cursive, sans-serif"
                fontSize="33"
                fontWeight="bold"
                letterSpacing="1"
              >
                Code is
              </text>
              <text
                x="115"
                y="70"
                textAnchor="middle"
                fill="#4ade80"
                stroke="#22c55e"
                strokeWidth="0.8"
                fontFamily="'Caveat', 'Segoe Script', 'Brush Script MT', cursive, sans-serif"
                fontSize="31"
                fontWeight="bold"
              >
                my love
              </text>
              {/* Neon Green Heart */}
              <path
                d="M 198 42 C 198 33, 209 29, 216 37 C 223 29, 234 33, 234 42 C 234 55, 216 66, 216 69 C 216 66, 198 55, 198 42 Z"
                fill="none"
                stroke="#4ade80"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* Sign 2: Cyan "Automation is my superpower" */}
            <g filter="url(#neonCyanGlow)">
              <text
                x="110"
                y="122"
                textAnchor="middle"
                fill="#38bdf8"
                stroke="#0284c7"
                strokeWidth="0.7"
                fontFamily="'Caveat', 'Segoe Script', 'Brush Script MT', cursive, sans-serif"
                fontSize="32"
                fontWeight="bold"
                letterSpacing="1"
              >
                Automation
              </text>
              <text
                x="110"
                y="152"
                textAnchor="middle"
                fill="#38bdf8"
                stroke="#0284c7"
                strokeWidth="0.6"
                fontFamily="'Caveat', 'Segoe Script', 'Brush Script MT', cursive, sans-serif"
                fontSize="23"
                fontWeight="bold"
              >
                is my superpower
              </text>
            </g>

            {/* Sign 3: Pink "Smooch is my life ->" with Heart */}
            <g filter="url(#neonPinkGlow)">
              <text
                x="85"
                y="202"
                textAnchor="middle"
                fill="#fb7185"
                stroke="#e11d48"
                strokeWidth="0.8"
                fontFamily="'Caveat', 'Segoe Script', 'Brush Script MT', cursive, sans-serif"
                fontSize="31"
                fontWeight="bold"
                letterSpacing="1"
              >
                Smooch is
              </text>
              <text
                x="70"
                y="233"
                textAnchor="middle"
                fill="#fb7185"
                stroke="#e11d48"
                strokeWidth="0.8"
                fontFamily="'Caveat', 'Segoe Script', 'Brush Script MT', cursive, sans-serif"
                fontSize="29"
                fontWeight="bold"
              >
                my life
              </text>
              {/* Arrow and Pink Heart */}
              <path
                d="M 125 227 L 160 227 M 150 219 L 163 227 L 150 235"
                fill="none"
                stroke="#fb7185"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 178 212 C 178 203, 189 199, 197 207 C 205 199, 216 203, 216 212 C 216 226, 197 238, 197 242 C 197 238, 178 226, 178 212 Z"
                fill="none"
                stroke="#fb7185"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>

          {/* 4. SOLID WOOD WORKSTATION DESK SURFACE */}
          <g id="deskGroup">
            {/* Deep Desk Ground Shadow */}
            <path d="M 0 460 L 920 460 L 920 690 L 0 690 Z" fill="#020306" />

            {/* Dark Walnut Desk Surface with 3D Beveled Perspective */}
            <polygon points="30,430 890,430 920,485 10,485" fill="url(#woodDeskTopGrad)" />
            {/* Front Desk Edge Highlight Line */}
            <line x1="10" y1="485" x2="920" y2="485" stroke="#4a3627" strokeWidth="3.5" />
            <polygon points="10,485 920,485 920,510 10,510" fill="#140c07" />

            {/* Large Stitched Desk Mat / Keyboard Pad */}
            <rect x="230" y="440" width="580" height="160" rx="12" fill="#0b0e16" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
          </g>

          {/* 5. DUAL GLOWING MONITORS & CODE REFLECTIONS */}
          <g id="monitorsGroup">
            {/* Monitor Arm Mounts */}
            <rect x="360" y="360" width="32" height="90" rx="4" fill="#1b202c" />
            <polygon points="325,445 425,445 405,455 345,455" fill="#0f121a" />

            {/* Left Primary Monitor (Angled IDE & Terminal) */}
            <g transform="translate(195, 160)">
              {/* Monitor Bezel Frame */}
              <rect x="0" y="0" width="305" height="220" rx="8" fill="#1a1f2c" stroke="#2b3345" strokeWidth="2" />
              {/* Screen Area with VS Code Dark Theme */}
              <rect x="8" y="8" width="289" height="204" rx="4" fill="#0b0e14" />

              {/* IDE Header Bar */}
              <rect x="8" y="8" width="289" height="18" fill="#141822" />
              <circle cx="18" cy="17" r="3" fill="#ef4444" />
              <circle cx="28" cy="17" r="3" fill="#f59e0b" />
              <circle cx="38" cy="17" r="3" fill="#10b981" />
              <text x="150" y="21" textAnchor="middle" fill="#64748b" fontFamily="monospace" fontSize="8.5">infrastructure/main.tf — SohailVerse</text>

              {/* Glowing Syntax Code Lines */}
              <g fontFamily="monospace" fontSize="8.5" fontWeight="bold">
                <text x="18" y="42" fill="#64748b">01</text>
                <text x="35" y="42" fill="#c084fc">module</text>
                <text x="75" y="42" fill="#fde047">&quot;sohail_core&quot;</text>
                <text x="165" y="42" fill="#94a3b8">&#123;</text>

                <text x="18" y="56" fill="#64748b">02</text>
                <text x="45" y="56" fill="#38bdf8">source</text>
                <text x="82" y="56" fill="#94a3b8">=</text>
                <text x="94" y="56" fill="#86efac">&quot;terraform-aws/eks&quot;</text>

                <text x="18" y="70" fill="#64748b">03</text>
                <text x="45" y="70" fill="#38bdf8">cluster_version</text>
                <text x="140" y="70" fill="#94a3b8">=</text>
                <text x="152" y="70" fill="#86efac">&quot;1.30&quot;</text>

                <text x="18" y="84" fill="#64748b">04</text>
                <text x="45" y="84" fill="#38bdf8">auto_scale_min</text>
                <text x="140" y="84" fill="#94a3b8">=</text>
                <text x="152" y="84" fill="#f97316">3</text>

                <text x="18" y="98" fill="#64748b">05</text>
                <text x="45" y="98" fill="#38bdf8">auto_scale_max</text>
                <text x="140" y="98" fill="#94a3b8">=</text>
                <text x="152" y="98" fill="#f97316">16</text>

                <text x="18" y="112" fill="#64748b">06</text>
                <text x="45" y="112" fill="#38bdf8">enable_argocd</text>
                <text x="140" y="112" fill="#94a3b8">=</text>
                <text x="152" y="112" fill="#4ade80">true</text>

                <text x="18" y="126" fill="#64748b">07</text>
                <text x="35" y="126" fill="#94a3b8">&#125;</text>

                {/* Terminal Window Pane inside IDE */}
                <rect x="14" y="138" width="277" height="66" rx="3" fill="#06090e" stroke="#1e293b" strokeWidth="1" />
                <text x="22" y="154" fill="#22c55e">$ argocd app sync sohail-core --prune</text>
                <text x="22" y="168" fill="#38bdf8">[STATUS] Synced to rev 9b0b40 | Healthy</text>
                <text x="22" y="182" fill="#a3e635">✔ 16/16 Pods Running [Zero Downtime]</text>
                <text x="22" y="196" fill="#f43f5e">♥ Smooch production pipeline active</text>
              </g>

              {/* Glass Diagonal Reflection */}
              <path d="M 10 10 L 190 10 L 30 200 L 10 200 Z" fill="white" opacity="0.025" />
            </g>

            {/* Right Secondary Monitor (Grafana Metrics & Live Stream) */}
            <g transform="translate(518, 165)">
              <rect x="0" y="0" width="270" height="215" rx="8" fill="#1a1f2c" stroke="#2b3345" strokeWidth="2" />
              <rect x="8" y="8" width="254" height="199" rx="4" fill="#080b12" />

              {/* Window Header */}
              <rect x="8" y="8" width="254" height="18" fill="#131722" />
              <circle cx="18" cy="17" r="3" fill="#ef4444" />
              <circle cx="28" cy="17" r="3" fill="#f59e0b" />
              <circle cx="38" cy="17" r="3" fill="#10b981" />
              <text x="135" y="21" textAnchor="middle" fill="#64748b" fontFamily="monospace" fontSize="8.5">grafana-metrics :: k8s-cluster</text>

              {/* Telemetry Charts */}
              <g transform="translate(18, 38)">
                {/* Metric Card 1 */}
                <rect x="0" y="0" width="110" height="42" rx="4" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
                <text x="8" y="14" fill="#64748b" fontFamily="monospace" fontSize="7.5">CPU LOAD</text>
                <text x="8" y="32" fill="#38bdf8" fontFamily="monospace" fontSize="14" fontWeight="bold">24.8%</text>
                <path d="M 65 32 Q 78 18 90 26 T 106 18" fill="none" stroke="#38bdf8" strokeWidth="1.8" />

                {/* Metric Card 2 */}
                <rect x="120" y="0" width="110" height="42" rx="4" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
                <text x="128" y="14" fill="#64748b" fontFamily="monospace" fontSize="7.5">LATENCY</text>
                <text x="128" y="32" fill="#4ade80" fontFamily="monospace" fontSize="14" fontWeight="bold">12ms</text>
                <path d="M 185 30 Q 197 22 209 26 T 225 16" fill="none" stroke="#4ade80" strokeWidth="1.8" />

                {/* Terminal Stream Output */}
                <rect x="0" y="52" width="230" height="102" rx="4" fill="#04060b" stroke="#1e293b" strokeWidth="1" />
                <text x="8" y="68" fill="#a855f7" fontFamily="monospace" fontSize="8.5">[INFO] FastAPI worker node online</text>
                <text x="8" y="83" fill="#38bdf8" fontFamily="monospace" fontSize="8.5">[200 OK] GET /api/v1/telemetry 3.2ms</text>
                <text x="8" y="98" fill="#22c55e" fontFamily="monospace" fontSize="8.5">[200 OK] POST /api/v1/builds/sohail</text>
                <text x="8" y="113" fill="#fbbf24" fontFamily="monospace" fontSize="8.5">[DB] PostgreSQL HA cluster in-sync</text>
                <text x="8" y="128" fill="#f43f5e" fontFamily="monospace" fontSize="8.5">[LOVE] Life to Smooch connected 100%</text>
                <text x="8" y="143" fill="#38bdf8" fontFamily="monospace" fontSize="8.5">root@sohailverse:~# _</text>
              </g>
            </g>
          </g>

          {/* 6. DESK HARDWARE & ACCESSORIES */}
          <g id="deskAccessoriesGroup">
            {/* RGB Mechanical Keyboard with Keycaps */}
            <g transform="translate(330, 465)">
              <rect x="0" y="0" width="225" height="60" rx="6" fill="#111520" stroke="#222838" strokeWidth="1.5" />
              <g fill="#1b212f" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="0.5">
                <rect x="6" y="6" width="15" height="9" rx="2" />
                <rect x="25" y="6" width="13" height="9" rx="2" />
                <rect x="42" y="6" width="13" height="9" rx="2" />
                <rect x="59" y="6" width="13" height="9" rx="2" />
                <rect x="76" y="6" width="13" height="9" rx="2" />
                <rect x="93" y="6" width="13" height="9" rx="2" />
                <rect x="110" y="6" width="13" height="9" rx="2" />
                <rect x="127" y="6" width="13" height="9" rx="2" />
                <rect x="144" y="6" width="13" height="9" rx="2" />
                <rect x="161" y="6" width="13" height="9" rx="2" />
                <rect x="178" y="6" width="13" height="9" rx="2" />
                <rect x="195" y="6" width="22" height="9" rx="2" fill="#f43f5e" />

                <rect x="6" y="19" width="19" height="9" rx="2" fill="#38bdf8" />
                <rect x="29" y="19" width="13" height="9" rx="2" />
                <rect x="46" y="19" width="13" height="9" rx="2" />
                <rect x="63" y="19" width="13" height="9" rx="2" />
                <rect x="80" y="19" width="13" height="9" rx="2" />
                <rect x="97" y="19" width="13" height="9" rx="2" />
                <rect x="114" y="19" width="13" height="9" rx="2" />
                <rect x="131" y="19" width="13" height="9" rx="2" />
                <rect x="148" y="19" width="13" height="9" rx="2" />
                <rect x="165" y="19" width="13" height="9" rx="2" />
                <rect x="182" y="19" width="35" height="9" rx="2" />

                <rect x="6" y="33" width="26" height="13" rx="2" />
                <rect x="36" y="33" width="19" height="13" rx="2" />
                <rect x="59" y="33" width="95" height="13" rx="2" fill="#22c55e" />
                <rect x="158" y="33" width="19" height="13" rx="2" />
                <rect x="181" y="33" width="36" height="13" rx="2" />
              </g>
            </g>

            {/* Ergonomic Optical Gaming Mouse */}
            <g transform="translate(590, 475)">
              <ellipse cx="22" cy="26" rx="15" ry="24" fill="#141822" stroke="#283042" strokeWidth="1.5" />
              <line x1="22" y1="4" x2="22" y2="22" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="20" y="11" width="4" height="9" rx="1" fill="#38bdf8" />
            </g>

            {/* Black Ceramic Coffee Mug Matching IMAGE 2 */}
            <g transform="translate(805, 305)">
              {/* Mug Shadow */}
              <ellipse cx="38" cy="78" rx="28" ry="7" fill="#020306" />
              {/* Mug Body */}
              <rect x="10" y="18" width="52" height="64" rx="6" fill="#0d1017" stroke="#222836" strokeWidth="1.5" />
              {/* Mug Handle */}
              <path d="M 62 30 C 78 30, 78 60, 62 60" fill="none" stroke="#0d1017" strokeWidth="7" strokeLinecap="round" />
              <path d="M 62 30 C 78 30, 78 60, 62 60" fill="none" stroke="#222836" strokeWidth="1.5" strokeLinecap="round" />
              {/* Coffee Surface */}
              <ellipse cx="36" cy="18" rx="26" ry="8" fill="#180f08" stroke="#331e10" strokeWidth="1.5" />
              {/* Rising Steam */}
              <path d="M 30 10 Q 25 2 32 -6 Q 39 -14 32 -22" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M 43 10 Q 48 2 41 -6 Q 34 -14 41 -22" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.8" strokeLinecap="round" />

              {/* Exact Mug Text: CODE COFFEE COMMIT REPEAT */}
              <text x="36" y="36" textAnchor="middle" fill="#f1f5f9" fontFamily="sans-serif" fontSize="7.5" fontWeight="900" letterSpacing="0.8">CODE</text>
              <text x="36" y="46" textAnchor="middle" fill="#f1f5f9" fontFamily="sans-serif" fontSize="7" fontWeight="900" letterSpacing="0.8">COFFEE</text>
              <text x="36" y="56" textAnchor="middle" fill="#f1f5f9" fontFamily="sans-serif" fontSize="7" fontWeight="900" letterSpacing="0.8">COMMIT</text>
              <text x="36" y="66" textAnchor="middle" fill="#f1f5f9" fontFamily="sans-serif" fontSize="7" fontWeight="900" letterSpacing="0.8">REPEAT</text>
            </g>

            {/* Warm Amber Vintage Edison Bulb Desk Lamp (Top Right) */}
            <g transform="translate(875, 195)">
              {/* Warm Cone Light Beam */}
              <polygon points="10,40 -130,250 50,250" fill="url(#lampConeGrad)" />
              {/* Brass Gooseneck Arm */}
              <path d="M 10 170 L 10 30 Q 10 0 -18 15" fill="none" stroke="#713f12" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M 10 170 L 10 30 Q 10 0 -18 15" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
              {/* Vintage Shade */}
              <polygon points="-28,10 6,22 -16,42" fill="#92400e" stroke="#f59e0b" strokeWidth="1.5" />
              {/* Glowing Warm Filament */}
              <circle cx="-14" cy="32" r="11" fill="#fbbf24" opacity="0.95" filter="url(#neonGreenGlow)" />
              <circle cx="-14" cy="32" r="4.5" fill="#fff" />
            </g>
          </g>

          {/* 7. HIGH-END ERGONOMIC MESH GAMING / OFFICE CHAIR */}
          <g id="chairGroup">
            {/* Chair Headrest */}
            <rect x="525" y="155" width="75" height="38" rx="12" fill="url(#chairMeshGrad)" stroke="#334155" strokeWidth="2" />
            {/* Spine & Vertical Piston */}
            <path d="M 562 193 L 562 385" stroke="#0b0e14" strokeWidth="20" strokeLinecap="round" />
            <path d="M 562 193 L 562 385" stroke="#1e2638" strokeWidth="8" strokeLinecap="round" />

            {/* Contoured Mesh High-Back & Lumbar Wings */}
            <path
              d="M 495 205 Q 562 195 628 205 Q 650 280 635 365 Q 562 380 490 365 Q 475 280 495 205 Z"
              fill="url(#chairMeshGrad)"
              stroke="#2c3649"
              strokeWidth="2.5"
            />
            {/* Seat Base */}
            <path d="M 465 380 Q 562 370 658 380 Q 668 450 648 485 Q 562 495 475 485 Q 455 450 465 380 Z" fill="#0d111a" stroke="#1b2332" strokeWidth="3" />
            {/* Ergonomic Armrests */}
            <rect x="435" y="340" width="38" height="14" rx="4" fill="#1b2230" />
            <rect x="650" y="340" width="38" height="14" rx="4" fill="#1b2230" />
          </g>

          {/* 8. THE BELIEVABLE HUMAN DEVELOPER (SOHAIL) SEATED & CODING */}
          {/* Detailed 3/4 over-the-shoulder view matching IMAGE 2 */}
          <g id="humanDeveloperGroup">
            {/* Left Arm & Forearm reaching towards Keyboard */}
            <path
              d="M 435 285 Q 405 330 375 380 Q 355 410 385 440 Q 428 452 458 420 Q 468 370 478 320 Z"
              fill="url(#hoodieMatteGrad)"
              stroke="#2a3344"
              strokeWidth="1.5"
            />
            {/* Left Hand on Mechanical Keycaps */}
            <path d="M 365 435 Q 355 446 372 456 Q 398 456 408 445 Z" fill="#b98564" />

            {/* Right Arm & Forearm reaching to Mouse */}
            <path
              d="M 645 285 Q 688 335 712 390 Q 728 430 688 456 Q 648 462 622 436 Q 615 380 605 320 Z"
              fill="url(#hoodieMatteGrad)"
              stroke="#2a3344"
              strokeWidth="1.5"
            />
            {/* Right Hand resting over Ergonomic Mouse */}
            <path d="M 685 442 Q 706 446 700 462 Q 680 468 664 456 Z" fill="#b17c5a" />

            {/* Main Upper Torso & Broad Back Wearing Heavy Black Hoodie */}
            <path
              d="M 445 245 Q 555 225 660 245 Q 685 320 670 425 Q 555 445 435 425 Q 420 320 445 245 Z"
              fill="url(#hoodieMatteGrad)"
              stroke="#242c3d"
              strokeWidth="2"
            />

            {/* Left Side Hoodie Highlight from Dual Monitors (Cyan / Emerald Glow) */}
            <path
              d="M 445 245 Q 420 320 435 425 Q 465 430 475 385 Q 465 290 445 245 Z"
              fill="url(#hoodieLeftCyanRim)"
            />

            {/* Right Side Hoodie Highlight from Edison Lamp (Warm Amber Glow) */}
            <path
              d="M 660 245 Q 685 320 670 425 Q 638 430 628 385 Q 638 290 660 245 Z"
              fill="url(#hoodieRightAmberRim)"
            />

            {/* Distressed Typography on Back of Hoodie: "BUILDING TODAY BETTER TOMORROW" */}
            <g transform="translate(555, 305) rotate(-2)">
              {/* Line 1: BUILDING */}
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fill="#94a3b8"
                fontFamily="'Impact', 'Arial Black', sans-serif"
                fontSize="26"
                fontWeight="900"
                letterSpacing="2.5"
                opacity="0.88"
              >
                BUILDING
              </text>
              {/* Line 2: TODAY (Neon Lime Brush Style) */}
              <text
                x="0"
                y="28"
                textAnchor="middle"
                fill="#a3e635"
                fontFamily="'Impact', 'Arial Black', sans-serif"
                fontSize="27"
                fontWeight="900"
                letterSpacing="3"
                opacity="0.95"
              >
                TODAY
              </text>
              {/* Line 3: BETTER */}
              <text
                x="0"
                y="55"
                textAnchor="middle"
                fill="#94a3b8"
                fontFamily="'Impact', 'Arial Black', sans-serif"
                fontSize="25"
                fontWeight="900"
                letterSpacing="2.5"
                opacity="0.88"
              >
                BETTER
              </text>
              {/* Line 4: TOMORROW with Lime Underline */}
              <text
                x="0"
                y="82"
                textAnchor="middle"
                fill="#f1f5f9"
                fontFamily="'Impact', 'Arial Black', sans-serif"
                fontSize="24"
                fontWeight="900"
                letterSpacing="2"
                opacity="0.92"
              >
                TOMORROW
              </text>
              <path d="M -60 92 Q 0 96 60 92" stroke="#a3e635" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>

            {/* Realistic Neck & Head Anatomy */}
            {/* Neck */}
            <path d="M 522 175 L 528 238 Q 558 244 588 238 L 588 175 Z" fill="url(#skinToneGrad)" />

            {/* Head Contour (Profile / 3/4 angle facing screens) */}
            <path
              d="M 530 105 Q 562 80 600 95 Q 635 120 630 165 Q 625 200 595 218 Q 552 222 530 188 Q 515 145 530 105 Z"
              fill="url(#skinToneGrad)"
            />

            {/* Trimmed Dark Beard & Mustache Profile */}
            <path
              d="M 590 155 Q 622 165 616 195 Q 590 215 565 210 Q 580 185 590 155 Z"
              fill="#140f0c"
            />
            <path d="M 602 170 Q 615 175 610 184 Q 598 181 602 170 Z" fill="#140f0c" />

            {/* Black Baseball Cap Turned Backwards Matching IMAGE 2 */}
            {/* Cap Crown */}
            <path
              d="M 524 105 Q 560 65 610 80 Q 640 100 630 135 Q 572 140 524 120 Z"
              fill="#0d1017"
              stroke="#212838"
              strokeWidth="1.5"
            />
            {/* Cap Back Strap */}
            <path
              d="M 520 115 Q 558 126 595 120 Q 590 142 530 136 Z"
              fill="#171d2b"
              stroke="#2a3449"
              strokeWidth="1"
            />

            {/* Text on Back of Cap: "KEEP BUILDING" in Neon Green */}
            <text
              x="558"
              y="130"
              textAnchor="middle"
              fill="#a3e635"
              fontFamily="monospace"
              fontSize="8.5"
              fontWeight="900"
              letterSpacing="1.2"
            >
              KEEP BUILDING
            </text>

            {/* Professional Studio Over-Ear Headphones */}
            {/* Padded Headband */}
            <path
              d="M 538 80 Q 575 70 615 90"
              fill="none"
              stroke="#0b0e14"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <path
              d="M 538 80 Q 575 70 615 90"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Ear Cup with Glowing Cyan Status Ring */}
            <g transform="translate(545, 120)">
              <ellipse cx="0" cy="0" rx="15" ry="22" fill="#141924" stroke="#2d3748" strokeWidth="2" />
              <ellipse cx="0" cy="0" rx="10" ry="15" fill="#0b0e14" />
              <circle cx="0" cy="0" r="4.5" fill="#06b6d4" filter="url(#neonCyanGlow)" />
            </g>
          </g>

          {/* 9. SEAMLESS GRADIENT BLENDS INTO DARK PAGE */}
          {/* Bottom Edge Fade */}
          <rect x="0" y="630" width="920" height="60" fill="url(#bgStudioGrad)" opacity="0.95" />
          {/* Left Edge Fade to seamlessly blend behind left-side text column */}
          <rect x="0" y="0" width="70" height="690" fill="url(#bgStudioGrad)" opacity="0.85" />
        </svg>
      </div>
    </div>
  );
}
