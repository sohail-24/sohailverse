import React from "react";

export default function DeveloperWorkstationVisual() {
  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/10] select-none flex items-center justify-center">
      {/* Background ambient room glow */}
      <div className="absolute inset-0 bg-radial from-cyan-900/20 via-transparent to-transparent pointer-events-none" />

      <svg
        viewBox="0 0 900 620"
        className="w-full h-full object-contain drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Wall background gradient */}
          <linearGradient id="wallBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#080c18" />
            <stop offset="50%" stopColor="#0b1120" />
            <stop offset="100%" stopColor="#05070e" />
          </linearGradient>

          {/* Window city gradient */}
          <linearGradient id="citySky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#030712" />
            <stop offset="60%" stopColor="#0c1e3d" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Screen glow gradients */}
          <linearGradient id="screenCenterGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#090e1a" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>

          <linearGradient id="screenCodeGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>

          {/* Desk surface gradient */}
          <linearGradient id="deskWood" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1814" />
            <stop offset="30%" stopColor="#2c221b" />
            <stop offset="70%" stopColor="#19130f" />
            <stop offset="100%" stopColor="#0d0a08" />
          </linearGradient>

          {/* Hoodie fabric gradient */}
          <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#181a20" />
            <stop offset="50%" stopColor="#101216" />
            <stop offset="100%" stopColor="#0a0b0e" />
          </linearGradient>

          {/* Skin tone gradient with screen light reflection */}
          <linearGradient id="skinLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5a3c" />
            <stop offset="60%" stopColor="#b47b52" />
            <stop offset="100%" stopColor="#5eead4" stopOpacity="0.8" />
          </linearGradient>

          {/* Neon Filters */}
          <filter id="neonGreenGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="neonCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="neonPinkGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="screenGlowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial soft fade out around edges so it melts seamlessly into the background */}
          <mask id="heroFadeMask">
            <radialGradient id="fadeRad" cx="55%" cy="50%" r="52%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#ffffff" />
              <stop offset="92%" stopColor="#888888" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>
            <rect width="900" height="620" fill="url(#fadeRad)" />
          </mask>
        </defs>

        <g mask="url(#heroFadeMask)">
          {/* 1. ROOM WALL & WINDOW BACKGROUND */}
          <rect width="900" height="620" fill="url(#wallBg)" />

          {/* Left / Center Window to City Skyline */}
          <rect x="50" y="30" width="480" height="340" rx="8" fill="url(#citySky)" stroke="#1e293b" strokeWidth="3" />
          {/* Window Frame Panes */}
          <line x1="210" y1="30" x2="210" y2="370" stroke="#0f172a" strokeWidth="4" />
          <line x1="370" y1="30" x2="370" y2="370" stroke="#0f172a" strokeWidth="4" />
          <line x1="50" y1="180" x2="530" y2="180" stroke="#0f172a" strokeWidth="3" />

          {/* City Skyline Buildings in the Distance */}
          {/* Tower 1 */}
          <rect x="70" y="160" width="35" height="210" fill="#091326" />
          <polygon points="70,160 87,110 105,160" fill="#091326" />
          <line x1="87" y1="110" x2="87" y2="80" stroke="#ef4444" strokeWidth="1.5" />
          <circle cx="87" cy="80" r="2" fill="#ef4444" className="animate-pulse" />
          {/* Windows on Tower 1 */}
          <g fill="#38bdf8" opacity="0.6">
            <rect x="75" y="170" width="3" height="4" />
            <rect x="83" y="170" width="3" height="4" />
            <rect x="91" y="170" width="3" height="4" />
            <rect x="75" y="190" width="3" height="4" />
            <rect x="91" y="190" width="3" height="4" />
            <rect x="83" y="210" width="3" height="4" />
            <rect x="75" y="230" width="3" height="4" />
            <rect x="83" y="250" width="3" height="4" />
            <rect x="91" y="270" width="3" height="4" />
          </g>

          {/* Tower 2 (Main City Spire) */}
          <rect x="130" y="130" width="55" height="240" fill="#0d1b33" />
          <polygon points="130,130 157,60 185,130" fill="#0d1b33" />
          <line x1="157" y1="60" x2="157" y2="35" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="157" cy="35" r="3" fill="#38bdf8" />
          <g fill="#a3e635" opacity="0.7">
            <rect x="140" y="145" width="4" height="5" />
            <rect x="150" y="145" width="4" height="5" />
            <rect x="160" y="145" width="4" height="5" />
            <rect x="170" y="145" width="4" height="5" />
            <rect x="140" y="165" width="4" height="5" />
            <rect x="160" y="165" width="4" height="5" />
            <rect x="150" y="190" width="4" height="5" />
            <rect x="170" y="190" width="4" height="5" />
            <rect x="140" y="220" width="4" height="5" />
            <rect x="150" y="220" width="4" height="5" />
            <rect x="160" y="240" width="4" height="5" />
          </g>

          {/* Tower 3 */}
          <rect x="230" y="150" width="50" height="220" fill="#081020" />
          <g fill="#f59e0b" opacity="0.6">
            <rect x="240" y="165" width="3" height="4" />
            <rect x="250" y="165" width="3" height="4" />
            <rect x="260" y="165" width="3" height="4" />
            <rect x="240" y="185" width="3" height="4" />
            <rect x="260" y="205" width="3" height="4" />
            <rect x="250" y="225" width="3" height="4" />
          </g>

          {/* Tower 4 (Cyan Neon Top Tower) */}
          <rect x="300" y="110" width="45" height="260" fill="#0b172a" />
          <rect x="300" y="106" width="45" height="4" fill="#06b6d4" filter="url(#neonCyanGlow)" />
          <g fill="#38bdf8" opacity="0.65">
            <rect x="310" y="125" width="3" height="4" />
            <rect x="320" y="125" width="3" height="4" />
            <rect x="330" y="125" width="3" height="4" />
            <rect x="310" y="150" width="3" height="4" />
            <rect x="320" y="170" width="3" height="4" />
            <rect x="330" y="190" width="3" height="4" />
          </g>

          {/* Tower 5 */}
          <rect x="390" y="140" width="60" height="230" fill="#081122" />
          <g fill="#ec4899" opacity="0.55">
            <rect x="405" y="155" width="4" height="4" />
            <rect x="420" y="155" width="4" height="4" />
            <rect x="435" y="155" width="4" height="4" />
            <rect x="405" y="180" width="4" height="4" />
            <rect x="435" y="180" width="4" height="4" />
            <rect x="420" y="210" width="4" height="4" />
          </g>

          {/* Tower 6 (Rightmost window) */}
          <rect x="470" y="170" width="50" height="200" fill="#060c18" />

          {/* Atmospheric Star Particles in Night Sky */}
          <circle cx="100" cy="50" r="1" fill="#ffffff" opacity="0.8" />
          <circle cx="280" cy="45" r="1.5" fill="#38bdf8" opacity="0.9" />
          <circle cx="430" cy="65" r="1" fill="#ffffff" opacity="0.7" />
          <circle cx="490" cy="40" r="1" fill="#a3e635" opacity="0.8" />

          {/* 2. NEON WALL SIGNS (Right Side Wall) */}
          {/* Sign 1: Green "Code is my love" */}
          <g filter="url(#neonGreenGlow)">
            <text
              x="770"
              y="90"
              textAnchor="middle"
              fill="#a3e635"
              fontFamily="Brush Script MT, cursive, sans-serif"
              fontSize="24"
              fontStyle="italic"
              letterSpacing="0.5"
            >
              Code is
            </text>
            <text
              x="770"
              y="118"
              textAnchor="middle"
              fill="#a3e635"
              fontFamily="Brush Script MT, cursive, sans-serif"
              fontSize="26"
              fontStyle="italic"
            >
              my love
            </text>
          </g>

          {/* Sign 2: Cyan "Automation is my superpower" */}
          <g filter="url(#neonCyanGlow)">
            <text
              x="770"
              y="152"
              textAnchor="middle"
              fill="#38bdf8"
              fontFamily="Brush Script MT, cursive, sans-serif"
              fontSize="23"
              fontStyle="italic"
            >
              Automation
            </text>
            <text
              x="770"
              y="178"
              textAnchor="middle"
              fill="#38bdf8"
              fontFamily="Brush Script MT, cursive, sans-serif"
              fontSize="19"
              fontStyle="italic"
            >
              is my superpower
            </text>
          </g>

          {/* Sign 3: Pink "Smooch is my life ->" + Glowing Heart */}
          <g filter="url(#neonPinkGlow)">
            <text
              x="755"
              y="215"
              textAnchor="middle"
              fill="#f43f5e"
              fontFamily="Brush Script MT, cursive, sans-serif"
              fontSize="23"
              fontStyle="italic"
            >
              Smooch is
            </text>
            <text
              x="765"
              y="242"
              textAnchor="middle"
              fill="#f43f5e"
              fontFamily="Brush Script MT, cursive, sans-serif"
              fontSize="22"
              fontStyle="italic"
            >
              my life →
            </text>
            {/* Pink Neon Heart */}
            <path
              d="M 825 210 C 825 200, 810 195, 800 205 C 790 195, 775 200, 775 210 C 775 225, 800 240, 800 240 C 800 240, 825 225, 825 210 Z"
              fill="none"
              stroke="#fb7185"
              strokeWidth="2.5"
            />
          </g>

          {/* Warm Ambient Wall Sconce Lamp */}
          <ellipse cx="850" cy="180" rx="14" ry="24" fill="#f59e0b" opacity="0.25" filter="url(#neonCyanGlow)" />
          <circle cx="850" cy="180" r="9" fill="#fde68a" />
          <path d="M 845 170 L 855 170 L 860 195 L 840 195 Z" fill="#b45309" />

          {/* 3. DESK SURFACE */}
          <polygon points="120,440 880,440 900,620 50,620" fill="url(#deskWood)" />
          {/* Desk Edge Highlight */}
          <line x1="120" y1="440" x2="880" y2="440" stroke="#451a03" strokeWidth="3" />
          <line x1="122" y1="442" x2="878" y2="442" stroke="#78350f" strokeWidth="1" opacity="0.6" />

          {/* 4. MONITORS & STANDS (Developer Setup) */}
          {/* Monitor Stands */}
          <rect x="360" y="370" width="30" height="90" fill="#1e293b" />
          <polygon points="340,455 410,455 420,465 330,465" fill="#0f172a" stroke="#334155" strokeWidth="1" />

          <rect x="680" y="370" width="26" height="90" fill="#1e293b" />
          <polygon points="660,455 725,455 735,465 650,465" fill="#0f172a" stroke="#334155" strokeWidth="1" />

          {/* LEFT/CENTER ULTRA-WIDE MONITOR */}
          <g filter="url(#screenGlowFilter)">
            {/* Monitor Bezel */}
            <rect x="230" y="195" width="290" height="195" rx="6" fill="#050811" stroke="#334155" strokeWidth="4" />
            {/* Screen Inner Display */}
            <rect x="235" y="200" width="280" height="185" rx="3" fill="url(#screenCenterGlow)" />
            {/* Top IDE Tab Bar */}
            <rect x="235" y="200" width="280" height="16" fill="#0f172a" />
            <circle cx="244" cy="208" r="3" fill="#ef4444" />
            <circle cx="253" cy="208" r="3" fill="#f59e0b" />
            <circle cx="262" cy="208" r="3" fill="#10b981" />
            <text x="274" y="211" fill="#94a3b8" fontFamily="monospace" fontSize="8">
              main.tf — terraform-cloud
            </text>

            {/* Sidebar Code Explorer */}
            <rect x="235" y="216" width="40" height="169" fill="#090d16" />
            <line x1="275" y1="216" x2="275" y2="385" stroke="#1e293b" strokeWidth="1" />
            <text x="240" y="228" fill="#64748b" fontFamily="monospace" fontSize="7">
              FILES
            </text>
            <text x="242" y="240" fill="#38bdf8" fontFamily="monospace" fontSize="6.5">
              • src/
            </text>
            <text x="242" y="252" fill="#a3e635" fontFamily="monospace" fontSize="6.5">
              • k8s/
            </text>
            <text x="242" y="264" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">
              • app.py
            </text>

            {/* Lines of Code Display */}
            <g fontFamily="monospace" fontSize="7" fontWeight="bold">
              {/* Line 1 */}
              <text x="282" y="232" fill="#64748b">
                01
              </text>
              <text x="296" y="232" fill="#f43f5e">
                module
              </text>
              <text x="328" y="232" fill="#38bdf8">
                &quot;eks_cluster&quot;
              </text>
              <text x="390" y="232" fill="#94a3b8">
                &#123;
              </text>

              {/* Line 2 */}
              <text x="282" y="244" fill="#64748b">
                02
              </text>
              <text x="306" y="244" fill="#e2e8f0">
                source
              </text>
              <text x="338" y="244" fill="#94a3b8">
                =
              </text>
              <text x="348" y="244" fill="#a3e635">
                &quot;terraform-aws-modules/eks&quot;
              </text>

              {/* Line 3 */}
              <text x="282" y="256" fill="#64748b">
                03
              </text>
              <text x="306" y="256" fill="#e2e8f0">
                cluster_name
              </text>
              <text x="368" y="256" fill="#94a3b8">
                =
              </text>
              <text x="378" y="256" fill="#38bdf8">
                &quot;sohailverse-prod&quot;
              </text>

              {/* Line 4 */}
              <text x="282" y="268" fill="#64748b">
                04
              </text>
              <text x="306" y="268" fill="#e2e8f0">
                cluster_version
              </text>
              <text x="378" y="268" fill="#94a3b8">
                =
              </text>
              <text x="388" y="268" fill="#f59e0b">
                &quot;1.30&quot;
              </text>

              {/* Line 5 */}
              <text x="282" y="280" fill="#64748b">
                05
              </text>
              <text x="306" y="280" fill="#e2e8f0">
                enable_irsa
              </text>
              <text x="362" y="280" fill="#94a3b8">
                =
              </text>
              <text x="372" y="280" fill="#f43f5e">
                true
              </text>

              {/* Line 6 */}
              <text x="282" y="292" fill="#64748b">
                06
              </text>
              <text x="306" y="292" fill="#e2e8f0">
                vpc_id
              </text>
              <text x="338" y="292" fill="#94a3b8">
                =
              </text>
              <text x="348" y="292" fill="#a3e635">
                module.vpc.vpc_id
              </text>

              {/* Line 7 */}
              <text x="282" y="304" fill="#64748b">
                07
              </text>
              <text x="296" y="304" fill="#94a3b8">
                &#125;
              </text>

              {/* Line 8 - Terminal split in bottom */}
              <rect x="275" y="318" width="240" height="67" fill="#060911" />
              <line x1="275" y1="318" x2="515" y2="318" stroke="#1e293b" strokeWidth="1" />
              <text x="282" y="330" fill="#10b981">
                sohail@devops:~$
              </text>
              <text x="362" y="330" fill="#f1f5f9">
                argocd app sync sohail-shop
              </text>
              <text x="282" y="344" fill="#38bdf8">
                TIMESTAMP: 2026-08-31 07:28:00 UTC
              </text>
              <text x="282" y="358" fill="#a3e635">
                [SUCCESS] App &apos;sohail-shop&apos; synced 100% to Healthy!
              </text>
              <text x="282" y="372" fill="#e2e8f0">
                sohail@devops:~$ <tspan fill="#a3e635">▌</tspan>
              </text>
            </g>
          </g>

          {/* RIGHT MONITOR (VERTICAL / SECONDARY DISPLAY) */}
          <g filter="url(#screenGlowFilter)">
            <rect x="540" y="185" width="210" height="215" rx="6" fill="#050811" stroke="#334155" strokeWidth="4" />
            <rect x="545" y="190" width="200" height="205" rx="3" fill="#070c18" />
            {/* Top status bar */}
            <rect x="545" y="190" width="200" height="16" fill="#0f172a" />
            <text x="554" y="201" fill="#38bdf8" fontFamily="monospace" fontSize="8">
              ☸ Kubernetes Cluster Pods (9/9 Running)
            </text>

            {/* Simulated Grafana / Dashboard Visualizer */}
            <rect x="552" y="215" width="88" height="50" rx="3" fill="#0b1322" stroke="#1e293b" strokeWidth="1" />
            <text x="556" y="226" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">
              CPU Utilization
            </text>
            <path d="M 556 255 Q 575 235 595 245 T 635 230" fill="none" stroke="#a3e635" strokeWidth="2" />

            <rect x="648" y="215" width="90" height="50" rx="3" fill="#0b1322" stroke="#1e293b" strokeWidth="1" />
            <text x="652" y="226" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">
              Network Traffic
            </text>
            <path d="M 652 250 Q 675 260 695 232 T 732 238" fill="none" stroke="#38bdf8" strokeWidth="2" />

            {/* Docker Containers Log Stream */}
            <g fontFamily="monospace" fontSize="6.5">
              <text x="552" y="280" fill="#a3e635">
                ● [shop-api-7b8f9] POST /checkout 200 OK 42ms
              </text>
              <text x="552" y="294" fill="#38bdf8">
                ● [studio-web-54cd] GET /gallery 200 OK 18ms
              </text>
              <text x="552" y="308" fill="#f59e0b">
                ● [flow-worker-12] Auto-scaled: 2 → 4 replicas
              </text>
              <text x="552" y="322" fill="#a3e635">
                ● [ingress-nginx] TLS cert auto-renewed
              </text>
              <text x="552" y="336" fill="#e2e8f0">
                ● [argo-cd] Sync Status: Healthy (Synched)
              </text>
              <text x="552" y="350" fill="#a855f7">
                ● [postgres-ha] Read replica in-sync lag: 0.2ms
              </text>
              <text x="552" y="364" fill="#10b981">
                ● [telemetry] SohailVerse Core v2.0 Online
              </text>
              <text x="552" y="378" fill="#64748b">
                ● All health probes passing gracefully...
              </text>
            </g>
          </g>

          {/* 5. DESK ITEMS (Keyboard, Mouse, Coffee Mug) */}
          {/* RGB Mechanical Keyboard */}
          <polygon points="340,468 490,468 505,515 325,515" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          {/* Glowing Keys Matrix */}
          <g fill="#38bdf8" opacity="0.8">
            <rect x="345" y="473" width="135" height="5" rx="1" fill="#a3e635" />
            <rect x="342" y="482" width="142" height="5" rx="1" fill="#38bdf8" />
            <rect x="338" y="491" width="150" height="5" rx="1" fill="#818cf8" />
            <rect x="334" y="500" width="158" height="6" rx="1" fill="#f43f5e" />
          </g>

          {/* Mouse & Mousepad */}
          <rect x="525" y="470" width="45" height="50" rx="3" fill="#090d16" stroke="#1e293b" strokeWidth="1" />
          <ellipse cx="548" cy="495" rx="10" ry="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
          <line x1="548" y1="482" x2="548" y2="495" stroke="#334155" strokeWidth="1" />

          {/* Coffee Mug with "CODE COFFEE COMMIT REPEAT" */}
          <g>
            <rect x="760" y="445" width="38" height="46" rx="4" fill="#181a20" stroke="#334155" strokeWidth="1.5" />
            {/* Mug Handle */}
            <path d="M 798 452 C 810 452, 810 478, 798 478" fill="none" stroke="#181a20" strokeWidth="4" />
            {/* Mug Text */}
            <text x="779" y="458" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="4.5" fontWeight="bold">
              CODE
            </text>
            <text x="779" y="465" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="4.5" fontWeight="bold">
              COFFEE
            </text>
            <text x="779" y="472" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="4.5" fontWeight="bold">
              COMMIT
            </text>
            <text x="779" y="479" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="4.5" fontWeight="bold">
              REPEAT
            </text>
            {/* Rising Steam */}
            <path
              d="M 772 440 Q 776 430 771 420"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              opacity="0.3"
              strokeLinecap="round"
            />
            <path
              d="M 782 438 Q 787 426 781 415"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              opacity="0.4"
              strokeLinecap="round"
            />
          </g>

          {/* 6. THE DEVELOPER PERSON SITTING AT THE COMPUTER (Over the Shoulder / Side View) */}
          {/* Modern Ergonomic Chair Backrest */}
          <ellipse cx="610" cy="450" rx="65" ry="90" fill="#080c14" stroke="#1e293b" strokeWidth="3" />
          <ellipse cx="610" cy="450" rx="55" ry="78" fill="#0f172a" opacity="0.4" />
          {/* Chair Headrest */}
          <rect x="585" y="325" width="50" height="28" rx="8" fill="#0b101c" stroke="#1e293b" strokeWidth="2" />

          {/* Developer Body / Shoulders in Black Hoodie */}
          <g>
            {/* Black Hoodie Silhouette */}
            <path
              d="M 520 620 C 520 520, 545 440, 605 425 C 665 440, 715 520, 725 620 Z"
              fill="url(#hoodieGrad)"
              stroke="#1e293b"
              strokeWidth="2"
            />

            {/* Hoodie Fold Shadows */}
            <path d="M 570 470 Q 610 500 650 465" fill="none" stroke="#000000" strokeWidth="4" opacity="0.6" />
            <path d="M 550 530 Q 610 560 670 525" fill="none" stroke="#000000" strokeWidth="4" opacity="0.6" />

            {/* Back of Hoodie Chalk Art: "BUILDING TODAY BETTER TOMORROW" */}
            <text
              x="610"
              y="500"
              textAnchor="middle"
              fill="#94a3b8"
              fontFamily="Impact, sans-serif"
              fontSize="16"
              fontStyle="italic"
              letterSpacing="1"
              opacity="0.8"
            >
              BUILDING
            </text>
            <text
              x="610"
              y="525"
              textAnchor="middle"
              fill="#cbd5e1"
              fontFamily="Impact, sans-serif"
              fontSize="20"
              fontStyle="italic"
              letterSpacing="1.5"
              opacity="0.9"
            >
              TODAY
            </text>
            <text
              x="610"
              y="550"
              textAnchor="middle"
              fill="#64748b"
              fontFamily="Impact, sans-serif"
              fontSize="14"
              fontStyle="italic"
              letterSpacing="1"
              opacity="0.75"
            >
              BETTER TOMORROW
            </text>

            {/* Developer Neck & Head with Side Profile / Back View */}
            {/* Neck */}
            <rect x="590" y="380" width="40" height="40" rx="8" fill="#8b5a3c" />

            {/* Head Silhouette */}
            <ellipse cx="610" cy="355" rx="36" ry="40" fill="url(#skinLight)" />

            {/* Dark Beard & Side Profile Feature (Looking forward-left towards the monitors) */}
            <path
              d="M 585 365 C 585 385, 600 398, 620 398 C 635 398, 642 385, 642 368 Z"
              fill="#18181b"
            />
            {/* Ear */}
            <ellipse cx="638" cy="360" rx="6" ry="9" fill="#a26844" />

            {/* Headphone Band over Head/Neck */}
            <path
              d="M 578 350 C 578 320, 642 320, 642 350"
              fill="none"
              stroke="#27272a"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <rect x="636" y="348" width="10" height="22" rx="5" fill="#3f3f46" stroke="#18181b" strokeWidth="2" />
            <rect x="574" y="348" width="10" height="22" rx="5" fill="#3f3f46" stroke="#18181b" strokeWidth="2" />

            {/* Baseball Cap (Turned slightly / Backwards / Forward Cap) */}
            <path
              d="M 574 345 C 574 315, 646 315, 646 345 Z"
              fill="#09090b"
              stroke="#27272a"
              strokeWidth="1.5"
            />
            {/* Cap Visor Bill sticking slightly to side */}
            <path
              d="M 574 345 C 555 348, 545 354, 550 360 C 560 360, 574 354, 580 348 Z"
              fill="#09090b"
            />

            {/* Cap Embroidered Badge: "KEEP BUILDING" in Lime Green */}
            <rect x="590" y="325" width="40" height="12" rx="2" fill="#18181b" stroke="#a3e635" strokeWidth="0.8" />
            <text
              x="610"
              y="333.5"
              textAnchor="middle"
              fill="#a3e635"
              fontFamily="monospace"
              fontSize="5.5"
              fontWeight="bold"
            >
              KEEP BUILDING
            </text>

            {/* Glowing Screen Reflections on Developer's Face and Shoulder */}
            <path
              d="M 574 345 C 570 360, 574 380, 580 395"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
              opacity="0.4"
              filter="url(#neonCyanGlow)"
            />
            <path
              d="M 530 460 C 545 440, 575 425, 595 422"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3.5"
              opacity="0.35"
              filter="url(#neonCyanGlow)"
            />
          </g>

          {/* 7. WARM DESK LAMP & LIGHT REFLECTION */}
          {/* Desk Lamp Base on Right */}
          <polygon points="840,430 860,430 870,445 830,445" fill="#1e293b" />
          <path d="M 850 430 L 850 360 L 820 330" fill="none" stroke="#334155" strokeWidth="4" />
          <polygon points="820,330 805,345 835,345" fill="#f59e0b" />
          {/* Cone of Warm Ambient Desk Light */}
          <polygon points="820,345 740,480 880,480" fill="#fbbf24" opacity="0.08" />
        </g>
      </svg>
    </div>
  );
}
