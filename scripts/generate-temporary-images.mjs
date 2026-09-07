import fs from "fs";
import path from "path";
import sharp from "sharp";

const targetDir = path.resolve("public/projects/temporary");

// Ensure directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. Copy desktop placeholders
const projects = [
  "sohail-shop",
  "sohail-studio",
  "fresh-flow",
  "wedding",
  "new-chapter",
];

for (const p of projects) {
  const oldPlaceholder = path.join(targetDir, `${p}-placeholder.jpg`);
  const desktopTarget = path.join(targetDir, `${p}-desktop.jpg`);
  if (fs.existsSync(oldPlaceholder)) {
    fs.copyFileSync(oldPlaceholder, desktopTarget);
    console.log(`Copied ${p}-placeholder.jpg -> ${p}-desktop.jpg`);
  }
}

// 2. Mobile phone UI SVG templates (800x500 16:10 format representing a phone UI in-app view)
const mobileUIs = {
  "sohail-shop": `
    <svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#090f1d"/>
          <stop offset="100%" stop-color="#060913"/>
        </linearGradient>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#14213d"/>
          <stop offset="100%" stop-color="#0d1628"/>
        </linearGradient>
        <linearGradient id="limeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#84cc16"/>
          <stop offset="100%" stop-color="#a3e635"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#bg)"/>
      <!-- Mobile Phone Status Bar -->
      <text x="50" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#94a3b8">9:41</text>
      <circle cx="710" cy="28" r="3" fill="#94a3b8"/>
      <circle cx="720" cy="28" r="3" fill="#94a3b8"/>
      <circle cx="730" cy="28" r="3" fill="#94a3b8"/>
      <rect x="745" y="22" width="22" height="12" rx="3" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="747" y="24" width="14" height="8" rx="1.5" fill="#a3e635"/>

      <!-- App Header -->
      <rect x="40" y="50" width="720" height="48" rx="12" fill="#0f172a" stroke="#1e293b"/>
      <text x="60" y="80" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#ffffff">Sohail-Shop Storefront</text>
      <rect x="670" y="60" width="70" height="28" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <text x="705" y="79" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#cbd5e1">Cart (3)</text>

      <!-- Search Bar -->
      <rect x="40" y="112" width="720" height="42" rx="10" fill="#1e293b" stroke="#334155"/>
      <text x="64" y="138" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" fill="#64748b">🔍  Search products, microservices, AWS stacks...</text>

      <!-- Promo Banner -->
      <rect x="40" y="168" width="720" height="100" rx="16" fill="url(#cardGrad)" stroke="#1e293b"/>
      <text x="60" y="215" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#ffffff">Kubernetes Multi-Vendor Store</text>
      <text x="60" y="242" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#94a3b8">AWS EKS • ArgoCD GitOps • PostgreSQL HA</text>

      <!-- Mobile Product Cards Grid -->
      <g transform="translate(40, 282)">
        <!-- Card 1 -->
        <rect x="0" y="0" width="345" height="170" rx="14" fill="#0f172a" stroke="#1e293b"/>
        <rect x="15" y="15" width="315" height="70" rx="8" fill="#1e293b"/>
        <text x="172" y="55" text-anchor="middle" font-family="monospace" font-size="13" font-weight="700" fill="#a3e635">☸️ K8s Helm Engine</text>
        <text x="15" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#ffffff">Production Cluster</text>
        <text x="15" y="132" font-family="monospace" font-size="12" fill="#38bdf8">$499 / cluster</text>
        <rect x="235" y="115" width="95" height="34" rx="8" fill="url(#limeGrad)"/>
        <text x="282" y="137" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#000000">Buy Now</text>

        <!-- Card 2 -->
        <rect x="375" y="0" width="345" height="170" rx="14" fill="#0f172a" stroke="#1e293b"/>
        <rect x="390" y="15" width="315" height="70" rx="8" fill="#1e293b"/>
        <text x="547" y="55" text-anchor="middle" font-family="monospace" font-size="13" font-weight="700" fill="#38bdf8">🏗️ Terraform Infra</text>
        <text x="390" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#ffffff">VPC &amp; IAM Modules</text>
        <text x="390" y="132" font-family="monospace" font-size="12" fill="#38bdf8">$129 / module</text>
        <rect x="610" y="115" width="95" height="34" rx="8" fill="#38bdf8"/>
        <text x="657" y="137" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#000000">Add</text>
      </g>

      <!-- Bottom Phone Indicator bar -->
      <rect x="300" y="482" width="200" height="4" rx="2" fill="#475569"/>
    </svg>
  `,

  "sohail-studio": `
    <svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#04131d"/>
          <stop offset="100%" stop-color="#020810"/>
        </linearGradient>
        <linearGradient id="cyanGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#06b6d4"/>
          <stop offset="100%" stop-color="#22d3ee"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#bg2)"/>
      <text x="50" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#94a3b8">9:41</text>
      <rect x="745" y="22" width="22" height="12" rx="3" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="747" y="24" width="14" height="8" rx="1.5" fill="#22d3ee"/>

      <!-- App Header -->
      <rect x="40" y="50" width="720" height="48" rx="12" fill="#082f49" fill-opacity="0.4" stroke="#0e7490" stroke-width="1"/>
      <text x="60" y="80" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#ffffff">Sohail Studio AI Workspace</text>
      <text x="720" y="80" text-anchor="end" font-family="monospace" font-size="11" fill="#67e8f9">v2.4.0</text>

      <!-- Terminal / Code Editor Mobile View -->
      <rect x="40" y="112" width="720" height="240" rx="14" fill="#0b1120" stroke="#1e293b"/>
      <rect x="40" y="112" width="720" height="36" rx="14" fill="#0f172a"/>
      <circle cx="65" cy="130" r="5" fill="#f43f5e"/>
      <circle cx="85" cy="130" r="5" fill="#eab308"/>
      <circle cx="105" cy="130" r="5" fill="#22c55e"/>
      <text x="400" y="135" text-anchor="middle" font-family="monospace" font-size="12" fill="#94a3b8">workspace/server.ts</text>

      <text x="60" y="175" font-family="monospace" font-size="13" fill="#38bdf8">const <tspan fill="#f1f5f9">studio</tspan> = <tspan fill="#a855f7">new</tspan> <tspan fill="#e2e8f0">EngineeringNexus({</tspan></text>
      <text x="80" y="200" font-family="monospace" font-size="13" fill="#94a3b8">aiEngine: <tspan fill="#22d3ee">"Gemini-2.5-Flash-Pro"</tspan>,</text>
      <text x="80" y="225" font-family="monospace" font-size="13" fill="#94a3b8">runtime: <tspan fill="#bef264">"Cloud Run / Multi-Region"</tspan>,</text>
      <text x="80" y="250" font-family="monospace" font-size="13" fill="#94a3b8">autoDeploy: <tspan fill="#f43f5e">true</tspan></text>
      <text x="60" y="275" font-family="monospace" font-size="13" fill="#e2e8f0">});</text>

      <rect x="60" y="295" width="680" height="42" rx="8" fill="#1e293b"/>
      <text x="80" y="322" font-family="monospace" font-size="12" fill="#22c55e">✓ Build succeeded • Deployment container healthy (Port 3000)</text>

      <!-- Bottom Mobile Controls -->
      <rect x="40" y="370" width="720" height="85" rx="14" fill="#0f172a" stroke="#1e293b"/>
      <rect x="60" y="390" width="220" height="45" rx="10" fill="url(#cyanGrad)"/>
      <text x="170" y="418" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#020817">⚡ Launch Prompt</text>
      <rect x="300" y="390" width="220" height="45" rx="10" fill="#1e293b" stroke="#334155"/>
      <text x="410" y="418" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0">View Telemetry</text>

      <rect x="300" y="482" width="200" height="4" rx="2" fill="#475569"/>
    </svg>
  `,

  "fresh-flow": `
    <svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#081520"/>
          <stop offset="100%" stop-color="#030910"/>
        </linearGradient>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#38bdf8"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#bg3)"/>
      <text x="50" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#94a3b8">9:41</text>
      <rect x="745" y="22" width="22" height="12" rx="3" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="747" y="24" width="14" height="8" rx="1.5" fill="#38bdf8"/>

      <!-- App Header & Delivery Location -->
      <rect x="40" y="50" width="720" height="55" rx="12" fill="#0c4a6e" fill-opacity="0.3" stroke="#0369a1" stroke-width="1"/>
      <text x="60" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#38bdf8">DELIVERING TO</text>
      <text x="60" y="93" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#ffffff">📍 Sector 42, Tech Hub ▾</text>
      <rect x="630" y="62" width="110" height="30" rx="8" fill="#38bdf8" fill-opacity="0.2"/>
      <text x="685" y="82" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#7dd3fc">15 MIN ETA</text>

      <!-- Active Order Tracker -->
      <rect x="40" y="120" width="720" height="135" rx="16" fill="#0f172a" stroke="#1e293b"/>
      <text x="60" y="150" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#ffffff">Active Delivery • Rider on the way</text>
      <text x="60" y="172" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#94a3b8">Order #FF-9021 • 6 fresh items arriving soon</text>

      <!-- Progress Track -->
      <rect x="60" y="195" width="680" height="8" rx="4" fill="#334155"/>
      <rect x="60" y="195" width="510" height="8" rx="4" fill="url(#skyGrad)"/>
      <circle cx="570" cy="199" r="10" fill="#38bdf8"/>
      <text x="570" y="203" text-anchor="middle" font-size="10" fill="#000">🛵</text>

      <text x="60" y="235" font-family="monospace" font-size="11" fill="#38bdf8">Packed ✓</text>
      <text x="320" y="235" font-family="monospace" font-size="11" fill="#38bdf8">Dispatched ✓</text>
      <text x="540" y="235" font-family="monospace" font-size="11" fill="#38bdf8">Out for Delivery (75%)</text>

      <!-- Categories & Items -->
      <g transform="translate(40, 275)">
        <rect x="0" y="0" width="225" height="175" rx="12" fill="#0f172a" stroke="#1e293b"/>
        <text x="112" y="65" text-anchor="middle" font-size="34">🥑</text>
        <text x="20" y="115" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">Organic Hass Avocados</text>
        <text x="20" y="145" font-family="monospace" font-size="13" fill="#38bdf8">$4.49</text>

        <rect x="245" y="0" width="225" height="175" rx="12" fill="#0f172a" stroke="#1e293b"/>
        <text x="357" y="65" text-anchor="middle" font-size="34">🥛</text>
        <text x="265" y="115" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">Farm Fresh Whole Milk</text>
        <text x="265" y="145" font-family="monospace" font-size="13" fill="#38bdf8">$3.29</text>

        <rect x="490" y="0" width="230" height="175" rx="12" fill="#0f172a" stroke="#1e293b"/>
        <text x="605" y="65" text-anchor="middle" font-size="34">🍓</text>
        <text x="510" y="115" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">Sweet Strawberries</text>
        <text x="510" y="145" font-family="monospace" font-size="13" fill="#38bdf8">$5.99</text>
      </g>

      <rect x="300" y="482" width="200" height="4" rx="2" fill="#475569"/>
    </svg>
  `,

  "wedding": `
    <svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#190914"/>
          <stop offset="100%" stop-color="#0a0307"/>
        </linearGradient>
        <linearGradient id="roseGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#e11d48"/>
          <stop offset="100%" stop-color="#fb7185"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#bg4)"/>
      <text x="50" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#94a3b8">9:41</text>
      <rect x="745" y="22" width="22" height="12" rx="3" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="747" y="24" width="14" height="8" rx="1.5" fill="#fb7185"/>

      <!-- App Header & Monogram -->
      <rect x="40" y="50" width="720" height="52" rx="12" fill="#4c0519" fill-opacity="0.3" stroke="#881337" stroke-width="1"/>
      <text x="400" y="82" text-anchor="middle" font-family="Georgia, serif" font-size="18" font-style="italic" fill="#ffe4e6">S &amp; A • A Digital Celebration</text>

      <!-- Romantic Hero & Countdown -->
      <rect x="40" y="118" width="720" height="180" rx="16" fill="#1c0714" stroke="#4c0519"/>
      <text x="400" y="165" text-anchor="middle" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#ffffff">Forever Begins Together</text>
      <text x="400" y="195" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" fill="#fda4af">Save The Date • December 2026</text>

      <!-- Countdown Blocks -->
      <g transform="translate(180, 215)">
        <rect x="0" y="0" width="90" height="60" rx="10" fill="#2e0820"/>
        <text x="45" y="35" text-anchor="middle" font-family="monospace" font-size="20" font-weight="bold" fill="#fb7185">124</text>
        <text x="45" y="52" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#fda4af">DAYS</text>

        <rect x="110" y="0" width="90" height="60" rx="10" fill="#2e0820"/>
        <text x="155" y="35" text-anchor="middle" font-family="monospace" font-size="20" font-weight="bold" fill="#fb7185">18</text>
        <text x="155" y="52" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#fda4af">HOURS</text>

        <rect x="220" y="0" width="90" height="60" rx="10" fill="#2e0820"/>
        <text x="265" y="35" text-anchor="middle" font-family="monospace" font-size="20" font-weight="bold" fill="#fb7185">45</text>
        <text x="265" y="52" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#fda4af">MINS</text>

        <rect x="330" y="0" width="90" height="60" rx="10" fill="#2e0820"/>
        <text x="375" y="35" text-anchor="middle" font-family="monospace" font-size="20" font-weight="bold" fill="#fb7185">30</text>
        <text x="375" y="52" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#fda4af">SECS</text>
      </g>

      <!-- Bottom Interactive RSVP Card -->
      <rect x="40" y="318" width="720" height="135" rx="14" fill="#180712" stroke="#4c0519"/>
      <rect x="60" y="340" width="300" height="46" rx="10" fill="url(#roseGrad)"/>
      <text x="210" y="368" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#ffffff">💌 RSVP Digital Invitation</text>
      <rect x="380" y="340" width="300" height="46" rx="10" fill="#2e0820" stroke="#881337"/>
      <text x="530" y="368" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#fda4af">✨ View Photo Story</text>

      <rect x="300" y="482" width="200" height="4" rx="2" fill="#475569"/>
    </svg>
  `,

  "new-chapter": `
    <svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg5" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#110722"/>
          <stop offset="100%" stop-color="#070210"/>
        </linearGradient>
        <linearGradient id="purpGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#7c3aed"/>
          <stop offset="100%" stop-color="#a855f7"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#bg5)"/>
      <text x="50" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#94a3b8">9:41</text>
      <rect x="745" y="22" width="22" height="12" rx="3" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="747" y="24" width="14" height="8" rx="1.5" fill="#a855f7"/>

      <!-- App Header -->
      <rect x="40" y="50" width="720" height="50" rx="12" fill="#3b0764" fill-opacity="0.3" stroke="#6b21a8" stroke-width="1"/>
      <text x="60" y="81" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#ffffff">Next-Gen Stealth Platform</text>
      <text x="720" y="81" text-anchor="end" font-family="monospace" font-size="11" fill="#c084fc">MESH NETWORK</text>

      <!-- Telemetry Hub Card -->
      <rect x="40" y="115" width="720" height="220" rx="16" fill="#17092c" stroke="#3b0764"/>
      <text x="60" y="150" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#ffffff">Autonomous Distributed AI Mesh</text>
      <text x="60" y="174" font-family="monospace" font-size="12" fill="#c084fc">Architecture: Decentralized Node Cluster • Zero-Trust Mesh</text>

      <!-- Sparkline / Node Graph Graphic -->
      <polyline points="60,260 140,240 220,270 300,210 380,230 460,180 540,210 620,160 700,190" fill="none" stroke="#c084fc" stroke-width="3"/>
      <circle cx="460" cy="180" r="6" fill="#a855f7"/>
      <circle cx="620" cy="160" r="6" fill="#38bdf8"/>

      <rect x="60" y="280" width="680" height="35" rx="8" fill="#0d041a"/>
      <text x="80" y="302" font-family="monospace" font-size="12" fill="#a855f7">&gt; Autonomous agent telemetry: latency 1.4ms • All nodes synchronized</text>

      <!-- Mobile Action Bar -->
      <rect x="40" y="355" width="720" height="100" rx="14" fill="#130724" stroke="#2e1065"/>
      <rect x="60" y="375" width="280" height="48" rx="10" fill="url(#purpGrad)"/>
      <text x="200" y="405" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">Preview Architecture</text>
      <rect x="360" y="375" width="280" height="48" rx="10" fill="#240e42" stroke="#581c87"/>
      <text x="500" y="405" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#d8b4fe">Access Roadmap</text>

      <rect x="300" y="482" width="200" height="4" rx="2" fill="#475569"/>
    </svg>
  `,
};

async function generateMobileImages() {
  for (const [id, svg] of Object.entries(mobileUIs)) {
    const mobileTarget = path.join(targetDir, `${id}-mobile.jpg`);
    const buffer = Buffer.from(svg.trim());
    await sharp(buffer)
      .jpeg({ quality: 92 })
      .toFile(mobileTarget);
    console.log(`Generated ${id}-mobile.jpg`);
  }
}

generateMobileImages().then(() => {
  console.log("All mobile placeholder images generated successfully!");
});
