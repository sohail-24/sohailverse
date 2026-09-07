const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const outDir = path.join(process.cwd(), "public/projects/temporary");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Helper to wrap SVG in sharp and output JPEG
async function createSvgToJpeg(svgString, outputPath) {
  const buffer = Buffer.from(svgString);
  await sharp(buffer)
    .jpeg({ quality: 90, progressive: true })
    .toFile(outputPath);
  console.log("Generated:", outputPath);
}

// 1. Sohail-Shop Placeholder
const sohailShopSvg = `
<svg width="1200" height="750" viewBox="0 0 1200 750" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0f1d"/>
      <stop offset="50%" stop-color="#0d1527"/>
      <stop offset="100%" stop-color="#070b14"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#141f36" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#0e172a" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="accentLime" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#a3e635"/>
      <stop offset="100%" stop-color="#22c55e"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="750" fill="url(#bg)"/>

  <!-- Subtle grid pattern -->
  <g stroke="#ffffff" stroke-opacity="0.03" stroke-width="1">
    <line x1="0" y1="120" x2="1200" y2="120"/>
    <line x1="0" y1="240" x2="1200" y2="240"/>
    <line x1="0" y1="360" x2="1200" y2="360"/>
    <line x1="0" y1="480" x2="1200" y2="480"/>
    <line x1="0" y1="600" x2="1200" y2="600"/>
    <line x1="200" y1="0" x2="200" y2="750"/>
    <line x1="400" y1="0" x2="400" y2="750"/>
    <line x1="600" y1="0" x2="600" y2="750"/>
    <line x1="800" y1="0" x2="800" y2="750"/>
    <line x1="1000" y1="0" x2="1000" y2="750"/>
  </g>

  <!-- App Header Bar -->
  <rect x="0" y="0" width="1200" height="64" fill="#080d19" stroke="#1e293b" stroke-width="1"/>
  <!-- Window dots -->
  <circle cx="28" cy="32" r="6" fill="#ef4444" opacity="0.8"/>
  <circle cx="48" cy="32" r="6" fill="#eab308" opacity="0.8"/>
  <circle cx="68" cy="32" r="6" fill="#22c55e" opacity="0.8"/>

  <!-- Brand / Title -->
  <text x="100" y="38" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700">SOHAIL-SHOP</text>
  <rect x="225" y="22" width="135" height="24" rx="12" fill="#14532d" fill-opacity="0.4" stroke="#4ade80" stroke-opacity="0.4"/>
  <circle cx="239" cy="34" r="3.5" fill="#4ade80"/>
  <text x="249" y="38" fill="#86efac" font-family="monospace" font-size="11" font-weight="600">AWS EKS PROD</text>

  <!-- Search / Command Bar -->
  <rect x="420" y="18" width="360" height="30" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1"/>
  <text x="440" y="38" fill="#64748b" font-family="-apple-system, sans-serif" font-size="12">Search orders, inventory, vendors (⌘K)...</text>

  <!-- Status badges right -->
  <text x="1040" y="38" fill="#94a3b8" font-family="monospace" font-size="12">LATENCY: 24ms</text>
  <circle cx="1150" cy="34" r="4" fill="#a3e635"/>

  <!-- Left Navigation Rail -->
  <rect x="0" y="64" width="220" height="686" fill="#080e1b" stroke="#1e293b" stroke-width="1"/>
  <text x="28" y="105" fill="#64748b" font-family="monospace" font-size="11" font-weight="600">WORKSPACE</text>

  <!-- Nav items -->
  <rect x="16" y="125" width="188" height="36" rx="8" fill="#162238" stroke="#a3e635" stroke-opacity="0.4"/>
  <text x="48" y="148" fill="#a3e635" font-family="-apple-system, sans-serif" font-size="13" font-weight="600">Live Commerce</text>

  <text x="48" y="195" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="13">Multi-Vendor Hub</text>
  <text x="48" y="240" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="13">Orders &amp; Fulfillment</text>
  <text x="48" y="285" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="13">Inventory Matrix</text>
  <text x="48" y="330" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="13">Payment Pipelines</text>
  <text x="48" y="375" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="13">Kubernetes Nodes</text>

  <!-- Main Content Dashboard Area -->
  <text x="250" y="110" fill="#f8fafc" font-family="-apple-system, sans-serif" font-size="22" font-weight="800">Production Infrastructure &amp; Commerce Telemetry</text>
  <text x="250" y="132" fill="#64748b" font-family="monospace" font-size="12">CLUSTER: ap-south-1.eks.amazonaws.com • GITOPS: ArgoCD Sync OK</text>

  <!-- Stat Cards Row -->
  <!-- Card 1 -->
  <rect x="250" y="155" width="215" height="100" rx="12" fill="url(#cardGrad)" stroke="#1e293b"/>
  <text x="270" y="185" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="12">Daily GMV Volume</text>
  <text x="270" y="222" fill="#ffffff" font-family="-apple-system, sans-serif" font-size="28" font-weight="800">$64,820</text>
  <text x="375" y="222" fill="#4ade80" font-family="monospace" font-size="12" font-weight="600">+18.4%</text>

  <!-- Card 2 -->
  <rect x="480" y="155" width="215" height="100" rx="12" fill="url(#cardGrad)" stroke="#1e293b"/>
  <text x="500" y="185" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="12">Active Microservices</text>
  <text x="500" y="222" fill="#a3e635" font-family="-apple-system, sans-serif" font-size="28" font-weight="800">14 / 14</text>
  <text x="600" y="222" fill="#86efac" font-family="monospace" font-size="12">100% HEALTHY</text>

  <!-- Card 3 -->
  <rect x="710" y="155" width="215" height="100" rx="12" fill="url(#cardGrad)" stroke="#1e293b"/>
  <text x="730" y="185" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="12">Active Storefronts</text>
  <text x="730" y="222" fill="#ffffff" font-family="-apple-system, sans-serif" font-size="28" font-weight="800">148 Nodes</text>
  <text x="840" y="222" fill="#38bdf8" font-family="monospace" font-size="12">SYNCED</text>

  <!-- Card 4 -->
  <rect x="940" y="155" width="225" height="100" rx="12" fill="url(#cardGrad)" stroke="#1e293b"/>
  <text x="960" y="185" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="12">Database Transactions</text>
  <text x="960" y="222" fill="#38bdf8" font-family="-apple-system, sans-serif" font-size="28" font-weight="800">2,410 /s</text>
  <text x="1070" y="222" fill="#4ade80" font-family="monospace" font-size="12">POOLED</text>

  <!-- Visual Mockup Center Grid -->
  <!-- Left Panel: Live Orders Table -->
  <rect x="250" y="275" width="560" height="440" rx="12" fill="url(#cardGrad)" stroke="#1e293b"/>
  <text x="275" y="310" fill="#f8fafc" font-family="-apple-system, sans-serif" font-size="15" font-weight="700">Real-Time Transactions Stream</text>
  <line x1="250" y1="330" x2="810" y2="330" stroke="#1e293b"/>

  <!-- Row 1 -->
  <text x="275" y="365" fill="#94a3b8" font-family="monospace" font-size="13">#ORD-9824</text>
  <text x="385" y="365" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13">Enterprise Apparel Node</text>
  <text x="590" y="365" fill="#a3e635" font-family="monospace" font-size="13">$349.00</text>
  <rect x="680" y="350" width="80" height="22" rx="6" fill="#14532d" stroke="#4ade80" stroke-opacity="0.3"/>
  <text x="696" y="365" fill="#4ade80" font-family="monospace" font-size="10" font-weight="600">CONFIRMED</text>

  <!-- Row 2 -->
  <text x="275" y="415" fill="#94a3b8" font-family="monospace" font-size="13">#ORD-9823</text>
  <text x="385" y="415" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13">Direct Electronics Vendor</text>
  <text x="590" y="415" fill="#a3e635" font-family="monospace" font-size="13">$1,120.00</text>
  <rect x="680" y="400" width="80" height="22" rx="6" fill="#14532d" stroke="#4ade80" stroke-opacity="0.3"/>
  <text x="696" y="415" fill="#4ade80" font-family="monospace" font-size="10" font-weight="600">DISPATCHED</text>

  <!-- Row 3 -->
  <text x="275" y="465" fill="#94a3b8" font-family="monospace" font-size="13">#ORD-9822</text>
  <text x="385" y="465" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13">Organic Goods Distributor</text>
  <text x="590" y="465" fill="#a3e635" font-family="monospace" font-size="13">$84.50</text>
  <rect x="680" y="450" width="80" height="22" rx="6" fill="#1e3a5f" stroke="#38bdf8" stroke-opacity="0.3"/>
  <text x="696" y="465" fill="#38bdf8" font-family="monospace" font-size="10" font-weight="600">PROCESSING</text>

  <!-- Row 4 -->
  <text x="275" y="515" fill="#94a3b8" font-family="monospace" font-size="13">#ORD-9821</text>
  <text x="385" y="515" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13">Smart Home Appliances</text>
  <text x="590" y="515" fill="#a3e635" font-family="monospace" font-size="13">$499.00</text>
  <rect x="680" y="500" width="80" height="22" rx="6" fill="#14532d" stroke="#4ade80" stroke-opacity="0.3"/>
  <text x="696" y="515" fill="#4ade80" font-family="monospace" font-size="10" font-weight="600">CONFIRMED</text>

  <!-- Chart illustration in Orders -->
  <path d="M 275 660 Q 380 620, 480 640 T 680 580 T 780 550" fill="none" stroke="#a3e635" stroke-width="3"/>
  <path d="M 275 660 Q 380 620, 480 640 T 680 580 T 780 550 L 780 680 L 275 680 Z" fill="#a3e635" fill-opacity="0.08"/>

  <!-- Right Panel: Cluster Architecture &amp; Kubernetes Pods -->
  <rect x="830" y="275" width="335" height="440" rx="12" fill="url(#cardGrad)" stroke="#1e293b"/>
  <text x="855" y="310" fill="#f8fafc" font-family="-apple-system, sans-serif" font-size="15" font-weight="700">Cluster Pod Matrix (EKS)</text>
  <line x1="830" y1="330" x2="1165" y2="330" stroke="#1e293b"/>

  <!-- Pod grid preview -->
  <rect x="855" y="355" width="60" height="60" rx="8" fill="#0b172a" stroke="#22c55e" stroke-width="1.5"/>
  <text x="867" y="390" fill="#4ade80" font-family="monospace" font-size="12">API-1</text>
  <rect x="930" y="355" width="60" height="60" rx="8" fill="#0b172a" stroke="#22c55e" stroke-width="1.5"/>
  <text x="942" y="390" fill="#4ade80" font-family="monospace" font-size="12">API-2</text>
  <rect x="1005" y="355" width="60" height="60" rx="8" fill="#0b172a" stroke="#22c55e" stroke-width="1.5"/>
  <text x="1017" y="390" fill="#4ade80" font-family="monospace" font-size="12">AUTH</text>
  <rect x="1080" y="355" width="60" height="60" rx="8" fill="#0b172a" stroke="#22c55e" stroke-width="1.5"/>
  <text x="1092" y="390" fill="#4ade80" font-family="monospace" font-size="12">CART</text>

  <rect x="855" y="430" width="60" height="60" rx="8" fill="#0b172a" stroke="#22c55e" stroke-width="1.5"/>
  <text x="867" y="465" fill="#4ade80" font-family="monospace" font-size="12">PAY-1</text>
  <rect x="930" y="430" width="60" height="60" rx="8" fill="#0b172a" stroke="#22c55e" stroke-width="1.5"/>
  <text x="942" y="465" fill="#4ade80" font-family="monospace" font-size="12">PAY-2</text>
  <rect x="1005" y="430" width="60" height="60" rx="8" fill="#0b172a" stroke="#22c55e" stroke-width="1.5"/>
  <text x="1015" y="465" fill="#4ade80" font-family="monospace" font-size="12">INV-1</text>
  <rect x="1080" y="430" width="60" height="60" rx="8" fill="#0b172a" stroke="#38bdf8" stroke-width="1.5"/>
  <text x="1090" y="465" fill="#38bdf8" font-family="monospace" font-size="12">SYNC</text>

  <rect x="855" y="515" width="285" height="175" rx="8" fill="#080e1b" stroke="#1e293b"/>
  <text x="870" y="540" fill="#94a3b8" font-family="monospace" font-size="11">DEPLOYMENT METRICS</text>
  <text x="870" y="568" fill="#e2e8f0" font-family="monospace" font-size="12">Ingress: Traefik LoadBalancer</text>
  <text x="870" y="594" fill="#e2e8f0" font-family="monospace" font-size="12">ReplicaSet: 8 Desired / 8 Ready</text>
  <text x="870" y="620" fill="#e2e8f0" font-family="monospace" font-size="12">Rolling Update Strategy: 25% max</text>
  <text x="870" y="646" fill="#a3e635" font-family="monospace" font-size="12">ArgoCD Sync: Automated (Healthy)</text>
</svg>
`;

// 2. Sohail Studio Placeholder
const sohailStudioSvg = `
<svg width="1200" height="750" viewBox="0 0 1200 750" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="studioBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070d18"/>
      <stop offset="50%" stop-color="#0b1526"/>
      <stop offset="100%" stop-color="#050a14"/>
    </linearGradient>
    <linearGradient id="codeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="750" fill="url(#studioBg)"/>

  <!-- Top App Window Header -->
  <rect x="0" y="0" width="1200" height="56" fill="#060b14" stroke="#1e293b" stroke-width="1"/>
  <circle cx="28" cy="28" r="6" fill="#ef4444" opacity="0.8"/>
  <circle cx="48" cy="28" r="6" fill="#eab308" opacity="0.8"/>
  <circle cx="68" cy="28" r="6" fill="#22c55e" opacity="0.8"/>

  <text x="100" y="34" fill="#f8fafc" font-family="-apple-system, sans-serif" font-size="15" font-weight="700">SOHAIL STUDIO</text>
  <rect x="235" y="16" width="165" height="24" rx="12" fill="#083344" fill-opacity="0.6" stroke="#06b6d4" stroke-opacity="0.4"/>
  <circle cx="249" cy="28" r="3.5" fill="#06b6d4"/>
  <text x="259" y="32" fill="#67e8f9" font-family="monospace" font-size="11" font-weight="600">AI ENGINEERING V2</text>

  <rect x="440" y="14" width="380" height="28" rx="6" fill="#0b1322" stroke="#334155"/>
  <text x="460" y="33" fill="#64748b" font-family="monospace" font-size="12">src/agents/orchestrator.ts — UTF-8</text>

  <!-- Left Sidebar (Explorer) -->
  <rect x="0" y="56" width="250" height="694" fill="#080e1a" stroke="#1e293b" stroke-width="1"/>
  <text x="24" y="92" fill="#64748b" font-family="monospace" font-size="11" font-weight="700">EXPLORER</text>
  
  <text x="32" y="125" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="13">▾ src</text>
  <text x="48" y="155" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="13">▾ agents</text>
  <text x="64" y="185" fill="#38bdf8" font-family="-apple-system, sans-serif" font-size="13" font-weight="600">⚡ orchestrator.ts</text>
  <text x="64" y="215" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="13">📄 memory-layer.ts</text>
  <text x="64" y="245" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="13">📄 streaming-buffer.ts</text>
  
  <text x="48" y="280" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="13">▸ pipelines</text>
  <text x="48" y="310" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="13">▸ telemetry</text>
  <text x="48" y="340" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="13">▸ neural-models</text>

  <!-- Center Code Editor -->
  <rect x="250" y="56" width="620" height="460" fill="#0a101f"/>
  
  <!-- Line Numbers &amp; Code -->
  <g font-family="'JetBrains Mono', 'Fira Code', monospace" font-size="13">
    <!-- Line 1 -->
    <text x="270" y="95" fill="#475569">01</text>
    <text x="310" y="95" fill="#f43f5e">import</text>
    <text x="365" y="95" fill="#f8fafc">{ GoogleGenAI, AgentOrchestrator }</text>
    <text x="640" y="95" fill="#f43f5e">from</text>
    <text x="680" y="95" fill="#34d399">"@google/genai"</text>

    <!-- Line 2 -->
    <text x="270" y="125" fill="#475569">02</text>
    <text x="310" y="125" fill="#f43f5e">import</text>
    <text x="365" y="125" fill="#f8fafc">{ createSystemPipeline }</text>
    <text x="560" y="125" fill="#f43f5e">from</text>
    <text x="600" y="125" fill="#34d399">"./pipeline"</text>

    <!-- Line 4 -->
    <text x="270" y="170" fill="#475569">04</text>
    <text x="310" y="170" fill="#818cf8">export async function</text>
    <text x="485" y="170" fill="#38bdf8">executeAgentWorkflow</text>
    <text x="660" y="170" fill="#f8fafc">(context) {</text>

    <!-- Line 5 -->
    <text x="270" y="200" fill="#475569">05</text>
    <text x="330" y="200" fill="#94a3b8">// Initialize low-latency AI runtime stream</text>

    <!-- Line 6 -->
    <text x="270" y="230" fill="#475569">06</text>
    <text x="330" y="230" fill="#f43f5e">const</text>
    <text x="380" y="230" fill="#f8fafc">runtime =</text>
    <text x="460" y="230" fill="#f43f5e">await</text>
    <text x="510" y="230" fill="#38bdf8">AgentOrchestrator</text>
    <text x="660" y="230" fill="#f8fafc">.boot({</text>

    <!-- Line 7 -->
    <text x="270" y="260" fill="#475569">07</text>
    <text x="350" y="260" fill="#f8fafc">model:</text>
    <text x="410" y="260" fill="#34d399">"gemini-2.5-flash"</text>
    <text x="565" y="260" fill="#f8fafc">,</text>

    <!-- Line 8 -->
    <text x="270" y="290" fill="#475569">08</text>
    <text x="350" y="290" fill="#f8fafc">tools: [</text>
    <text x="415" y="290" fill="#38bdf8">codeAnalysis</text>
    <text x="515" y="290" fill="#f8fafc">,</text>
    <text x="530" y="290" fill="#38bdf8">systemDeployer</text>
    <text x="650" y="290" fill="#f8fafc">],</text>

    <!-- Line 9 -->
    <text x="270" y="320" fill="#475569">09</text>
    <text x="350" y="320" fill="#f8fafc">streaming:</text>
    <text x="440" y="320" fill="#fb923c">true</text>

    <!-- Line 10 -->
    <text x="270" y="350" fill="#475569">10</text>
    <text x="330" y="350" fill="#f8fafc">});</text>

    <!-- Line 12 -->
    <text x="270" y="395" fill="#475569">12</text>
    <text x="330" y="395" fill="#f43f5e">return</text>
    <text x="385" y="395" fill="#f43f5e">await</text>
    <text x="435" y="395" fill="#38bdf8">runtime</text>
    <text x="495" y="395" fill="#f8fafc">.synthesize(context.prompt);</text>

    <!-- Line 13 -->
    <text x="270" y="425" fill="#475569">13</text>
    <text x="310" y="425" fill="#f8fafc">}</text>
  </g>

  <!-- Right Telemetry Panel -->
  <rect x="870" y="56" width="330" height="460" fill="#080e1a" stroke="#1e293b" stroke-width="1"/>
  <text x="895" y="92" fill="#64748b" font-family="monospace" font-size="11" font-weight="700">AGENT METRICS &amp; TELEMETRY</text>
  
  <rect x="895" y="115" width="280" height="75" rx="8" fill="#0e172a" stroke="#1e293b"/>
  <text x="915" y="142" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="12">Tokens Processed / Sec</text>
  <text x="915" y="172" fill="#38bdf8" font-family="-apple-system, sans-serif" font-size="22" font-weight="700">142 t/s</text>
  <text x="1020" y="172" fill="#34d399" font-family="monospace" font-size="11">TURBO ACCEL</text>

  <rect x="895" y="205" width="280" height="75" rx="8" fill="#0e172a" stroke="#1e293b"/>
  <text x="915" y="232" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="12">Active Inference Loops</text>
  <text x="915" y="262" fill="#67e8f9" font-family="-apple-system, sans-serif" font-size="22" font-weight="700">6 Parallel</text>
  <text x="1035" y="262" fill="#64748b" font-family="monospace" font-size="11">DOCKER</text>

  <!-- Terminal Bottom Panel -->
  <rect x="250" y="516" width="950" height="234" fill="#050912" stroke="#1e293b" stroke-width="1"/>
  <text x="275" y="546" fill="#64748b" font-family="monospace" font-size="11" font-weight="700">INTEGRATED TERMINAL — zsh</text>
  <text x="275" y="580" fill="#34d399" font-family="monospace" font-size="13">➜ sohail-studio git:(main) $ bun run build:runtime</text>
  <text x="275" y="610" fill="#f8fafc" font-family="monospace" font-size="13">[studio-builder] Compiling TypeScript architecture modules...</text>
  <text x="275" y="635" fill="#38bdf8" font-family="monospace" font-size="13">[studio-builder] Bundling neural runtime • Output: dist/engine.cjs (412 KB)</text>
  <text x="275" y="660" fill="#4ade80" font-family="monospace" font-size="13">✔ System verified in 340ms • Ready for interaction.</text>
</svg>
`;

// 3. Fresh Flow Placeholder
const freshFlowSvg = `
<svg width="1200" height="750" viewBox="0 0 1200 750" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="flowBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#08141e"/>
      <stop offset="50%" stop-color="#0c1d2d"/>
      <stop offset="100%" stop-color="#060e17"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="750" fill="url(#flowBg)"/>
  
  <!-- Header -->
  <rect x="0" y="0" width="1200" height="60" fill="#060e17" stroke="#1e293b"/>
  <circle cx="28" cy="30" r="6" fill="#ef4444" opacity="0.8"/>
  <circle cx="48" cy="30" r="6" fill="#eab308" opacity="0.8"/>
  <circle cx="68" cy="30" r="6" fill="#22c55e" opacity="0.8"/>
  <text x="100" y="36" fill="#f8fafc" font-family="-apple-system, sans-serif" font-size="16" font-weight="700">FRESH FLOW</text>
  <rect x="220" y="18" width="150" height="24" rx="12" fill="#0c4a6e" stroke="#38bdf8" stroke-opacity="0.4"/>
  <circle cx="235" cy="30" r="3.5" fill="#38bdf8"/>
  <text x="245" y="34" fill="#7dd3fc" font-family="monospace" font-size="11" font-weight="600">DELIVERY DISPATCH</text>

  <!-- Route Map &amp; Dispatch View -->
  <rect x="50" y="90" width="700" height="600" rx="14" fill="#0a1524" stroke="#1e293b"/>
  <text x="80" y="130" fill="#f8fafc" font-family="-apple-system, sans-serif" font-size="18" font-weight="700">Live Urban Delivery Grid &amp; Couriers</text>
  
  <!-- Map routes -->
  <path d="M 120 480 Q 250 300, 420 380 T 650 250" fill="none" stroke="#38bdf8" stroke-width="4" stroke-dasharray="8 6"/>
  <path d="M 150 220 Q 300 350, 480 280 T 680 480" fill="none" stroke="#34d399" stroke-width="4"/>
  
  <!-- Hub node -->
  <circle cx="420" cy="380" r="14" fill="#0284c7" stroke="#ffffff" stroke-width="3"/>
  <text x="445" y="385" fill="#f8fafc" font-family="-apple-system, sans-serif" font-size="12" font-weight="700">Central Hub 01</text>
  
  <!-- Delivery checkpoints -->
  <circle cx="250" cy="320" r="8" fill="#34d399"/>
  <circle cx="560" cy="310" r="8" fill="#34d399"/>
  <circle cx="650" cy="250" r="10" fill="#f59e0b"/>

  <!-- Right Metrics Column -->
  <rect x="780" y="90" width="370" height="180" rx="14" fill="#0d1c2e" stroke="#1e293b"/>
  <text x="810" y="130" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="13">Average Delivery Time</text>
  <text x="810" y="175" fill="#38bdf8" font-family="-apple-system, sans-serif" font-size="36" font-weight="800">18.4 min</text>
  <text x="810" y="215" fill="#4ade80" font-family="monospace" font-size="12">⚡ FASTEST DISPATCH ZONE</text>

  <rect x="780" y="300" width="370" height="390" rx="14" fill="#0d1c2e" stroke="#1e293b"/>
  <text x="810" y="340" fill="#f8fafc" font-family="-apple-system, sans-serif" font-size="16" font-weight="700">Fulfillment Pipeline</text>
  
  <rect x="810" y="370" width="310" height="60" rx="8" fill="#081422" stroke="#1e293b"/>
  <text x="830" y="398" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13" font-weight="600">Automated Order Routing</text>
  <text x="830" y="418" fill="#4ade80" font-family="monospace" font-size="11">Status: Active • AI ETA Model v2</text>

  <rect x="810" y="450" width="310" height="60" rx="8" fill="#081422" stroke="#1e293b"/>
  <text x="830" y="478" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13" font-weight="600">Cold Chain Inventory Sensors</text>
  <text x="830" y="498" fill="#38bdf8" font-family="monospace" font-size="11">Real-time Temp: 3.8°C (Optimal)</text>

  <rect x="810" y="530" width="310" height="60" rx="8" fill="#081422" stroke="#1e293b"/>
  <text x="830" y="558" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13" font-weight="600">Fleet Dispatch Optimization</text>
  <text x="830" y="578" fill="#a78bfa" font-family="monospace" font-size="11">Connected Couriers: 42 Active</text>
</svg>
`;

// 4. Wedding Page Placeholder
const weddingSvg = `
<svg width="1200" height="750" viewBox="0 0 1200 750" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wedBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#180b1e"/>
      <stop offset="50%" stop-color="#110716"/>
      <stop offset="100%" stop-color="#08030a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="750" fill="url(#wedBg)"/>
  
  <rect x="0" y="0" width="1200" height="60" fill="#0d0411" stroke="#2d123a"/>
  <circle cx="28" cy="30" r="6" fill="#ef4444" opacity="0.8"/>
  <circle cx="48" cy="30" r="6" fill="#eab308" opacity="0.8"/>
  <circle cx="68" cy="30" r="6" fill="#22c55e" opacity="0.8"/>
  <text x="100" y="36" fill="#fce7f3" font-family="-apple-system, sans-serif" font-size="16" font-weight="700">WEDDING MEMORIES VAULT</text>
  
  <rect x="100" y="100" width="1000" height="580" rx="16" fill="#130819" stroke="#3b154c"/>
  <text x="600" y="170" text-anchor="middle" fill="#f43f5e" font-family="Georgia, serif" font-size="28" font-style="italic">Celebration of Love &amp; Beautiful Moments</text>
  <text x="600" y="205" text-anchor="middle" fill="#fbcfe8" font-family="Georgia, serif" font-size="38" font-weight="700">A Journey Etched in Time</text>

  <!-- Photo cards row -->
  <rect x="150" y="260" width="260" height="340" rx="12" fill="#220d2d" stroke="#f472b6" stroke-opacity="0.3"/>
  <rect x="170" y="280" width="220" height="240" rx="8" fill="#341344"/>
  <text x="280" y="410" text-anchor="middle" fill="#f9a8d4" font-family="Georgia, serif" font-size="18">Ceremony Gallery</text>
  <text x="280" y="565" text-anchor="middle" fill="#fbcfe8" font-family="-apple-system, sans-serif" font-size="13">High-Res Cloud Vault</text>

  <rect x="470" y="240" width="260" height="380" rx="12" fill="#2d103d" stroke="#f472b6" stroke-opacity="0.6"/>
  <rect x="490" y="260" width="220" height="270" rx="8" fill="#431859"/>
  <text x="600" y="405" text-anchor="middle" fill="#f472b6" font-family="Georgia, serif" font-size="20" font-weight="700">Special Moments</text>
  <text x="600" y="585" text-anchor="middle" fill="#f472b6" font-family="-apple-system, sans-serif" font-size="14" font-weight="600">Featured Highlight Reel</text>

  <rect x="790" y="260" width="260" height="340" rx="12" fill="#220d2d" stroke="#f472b6" stroke-opacity="0.3"/>
  <rect x="810" y="280" width="220" height="240" rx="8" fill="#341344"/>
  <text x="920" y="410" text-anchor="middle" fill="#f9a8d4" font-family="Georgia, serif" font-size="18">Guestbook &amp; Wishes</text>
  <text x="920" y="565" text-anchor="middle" fill="#fbcfe8" font-family="-apple-system, sans-serif" font-size="13">Interactive Message Ledger</text>
</svg>
`;

// 5. New Chapter Loading Placeholder
const newChapterSvg = `
<svg width="1200" height="750" viewBox="0 0 1200 750" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="chapterBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0817"/>
      <stop offset="50%" stop-color="#120c2b"/>
      <stop offset="100%" stop-color="#06040d"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="750" fill="url(#chapterBg)"/>

  <!-- Matrix and nodes -->
  <rect x="0" y="0" width="1200" height="60" fill="#080512" stroke="#1f163d"/>
  <circle cx="28" cy="30" r="6" fill="#ef4444" opacity="0.8"/>
  <circle cx="48" cy="30" r="6" fill="#eab308" opacity="0.8"/>
  <circle cx="68" cy="30" r="6" fill="#22c55e" opacity="0.8"/>
  <text x="100" y="36" fill="#f8fafc" font-family="-apple-system, sans-serif" font-size="16" font-weight="700">NEW CHAPTER LOADING...</text>
  <rect x="330" y="18" width="160" height="24" rx="12" fill="#311042" stroke="#c084fc" stroke-opacity="0.4"/>
  <text x="350" y="34" fill="#e9d5ff" font-family="monospace" font-size="11" font-weight="600">STEALTH INITIATIVE</text>

  <rect x="100" y="100" width="1000" height="580" rx="16" fill="#0f0b22" stroke="#2a1b4e"/>
  
  <text x="600" y="240" text-anchor="middle" fill="#c084fc" font-family="monospace" font-size="14" font-weight="700">NEXT-GEN AUTONOMOUS SYSTEMS &amp; CLOUD INITIATIVE</text>
  <text x="600" y="295" text-anchor="middle" fill="#ffffff" font-family="-apple-system, sans-serif" font-size="34" font-weight="800">Architecting 2026 Capabilities</text>
  <text x="600" y="340" text-anchor="middle" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="16">Intelligent self-healing distributed pipelines and multi-agent coordination.</text>

  <!-- Progress track -->
  <rect x="350" y="420" width="500" height="8" rx="4" fill="#1e163b"/>
  <rect x="350" y="420" width="340" height="8" rx="4" fill="#a855f7"/>

  <text x="600" y="480" text-anchor="middle" fill="#a855f7" font-family="monospace" font-size="14">SYNTHESIZING COMPONENT GRAPH • 68%</text>
  <text x="600" y="520" text-anchor="middle" fill="#64748b" font-family="monospace" font-size="12">AWS EKS • TERRAFORM • DISTRIBUTED WORKERS • AUTOMATION</text>
</svg>
`;

async function main() {
  await createSvgToJpeg(sohailShopSvg, path.join(outDir, "sohail-shop-placeholder.jpg"));
  await createSvgToJpeg(sohailStudioSvg, path.join(outDir, "sohail-studio-placeholder.jpg"));
  await createSvgToJpeg(freshFlowSvg, path.join(outDir, "fresh-flow-placeholder.jpg"));
  await createSvgToJpeg(weddingSvg, path.join(outDir, "wedding-placeholder.jpg"));
  await createSvgToJpeg(newChapterSvg, path.join(outDir, "new-chapter-placeholder.jpg"));
  console.log("All 5 project placeholders created successfully!");
}

main().catch(err => {
  console.error("Error generating placeholders:", err);
  process.exit(1);
});
