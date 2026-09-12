import React from "react";
import {
  ShoppingCart,
  Store,
  ShieldCheck,
  CreditCard,
  Database,
  Workflow,
  History,
  Lock,
  Server,
  FileText,
  CheckCircle2,
  ArrowRight,
  Truck,
  Boxes,
  Users,
  Receipt,
  MapPin,
  BarChart3,
  Layers,
  KeyRound,
  FileCheck,
} from "lucide-react";
import {
  SiReact,
  SiTypescript,
  SiVite,
  SiReactrouter,
  SiTailwindcss,
  SiTrpc,
  SiReactquery,
  SiHono,
  SiNodedotjs,
  SiZod,
  SiPostgresql,
  SiDrizzle,
  SiDocker,
  SiNginx,
} from "react-icons/si";

export default function AMFruitsCaseStudy() {
  return (
    <div id="am-fruits-case-study" className="space-y-12 sm:space-y-16 pt-6">
      {/* =========================================================================
          SECTION 1: CORE IMPLEMENTED FEATURES
         ========================================================================= */}
      <section id="am-fruits-features" className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              FUNCTIONAL SCOPE
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Implemented Features
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Active and implemented capabilities connecting buyer procurement with supplier business operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Buyer Experience */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-sm space-y-4 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">Buyer Experience</h3>
                <p className="text-xs font-mono text-cyan-400">Wholesale Procurement</p>
              </div>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {[
                "Product browsing with rich specifications and pricing",
                "Product catalog search and quick lookup",
                "Category browsing for wholesale produce groups",
                "Shopping cart with real-time quantity controls",
                "Checkout with delivery zone and shipping selection",
                "Direct order placement and confirmation",
                "Order history with past transaction logs",
                "Live order tracking from placement to fulfillment",
                "Profile and business account management",
              ].map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Management */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-sm space-y-4 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">Business Management</h3>
                <p className="text-xs font-mono text-blue-400">Owner Operations & Logistics</p>
              </div>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {[
                "Product management (catalog, variants, pricing)",
                "Category management and hierarchy setup",
                "Inventory management with real-time stock counts",
                "Warehouse management and multi-facility tracking",
                "Customer management and company profiles",
                "Order management with status progression",
                "Invoice management with automated generation",
                "Delivery area management and zone coverage",
                "Shipping method configuration and rates",
                "Business reports and operational analytics",
              ].map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Payments */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-sm space-y-4 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">Payments System</h3>
                <p className="text-xs font-mono text-emerald-400">Commercial Settlement</p>
              </div>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {[
                "Cash on Delivery for physical trade settlements",
                "Razorpay online payments for electronic transfers",
                "Server-side Razorpay signature verification",
              ].map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Authentication */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-sm space-y-4 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">Authentication & RBAC</h3>
                <p className="text-xs font-mono text-purple-400">Access Control & Identity</p>
              </div>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {[
                "Password-based authentication with bcrypt hashing",
                "Secure HTTP-only session cookies",
                "Role-based access control separating buyer and owner capabilities",
              ].map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: TECHNICAL ARCHITECTURE & STACK
         ========================================================================= */}
      <section id="am-fruits-architecture" className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              ENGINEERING FOUNDATION
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Technical Architecture
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            End-to-end type safety, validation boundaries, and deployment infrastructure.
          </p>
        </div>

        {/* Development vs Production Pipelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Development Flow */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 space-y-4">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Workflow className="h-4 w-4 text-cyan-400" />
              <span>Development Pipeline</span>
            </h3>
            <div className="flex flex-col gap-2 font-mono text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span className="text-white font-semibold">Browser</span>
              </div>
              <div className="pl-3 text-slate-500">↓</div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span>React 19 + TypeScript</span>
              </div>
              <div className="pl-3 text-slate-500">↓</div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                <span>tRPC (Type-Safe Procedures)</span>
              </div>
              <div className="pl-3 text-slate-500">↓</div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                <span>Hono / Node.js</span>
              </div>
              <div className="pl-3 text-slate-500">↓</div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                <span>Drizzle ORM</span>
              </div>
              <div className="pl-3 text-slate-500">↓</div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span className="text-white font-semibold">PostgreSQL</span>
              </div>
            </div>
          </div>

          {/* Production Flow */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 space-y-4">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-400" />
              <span>Production Pipeline</span>
            </h3>
            <div className="flex flex-col gap-2 font-mono text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span className="text-white font-semibold">Browser</span>
              </div>
              <div className="pl-3 text-slate-500">↓</div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Nginx (Reverse Proxy & Security Headers)</span>
              </div>
              <div className="pl-3 text-slate-500">↓</div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                <span>Node.js / Hono</span>
              </div>
              <div className="pl-3 text-slate-500">↓</div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span className="text-white font-semibold">PostgreSQL</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              Production deployment is orchestrated via Docker Compose, running Nginx as the edge entry point, the Node.js application container, and the PostgreSQL database.
            </p>
          </div>
        </div>

        {/* Component Explanations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          <div className="p-4 rounded-xl border border-white/10 bg-slate-900/30 space-y-1.5">
            <div className="flex items-center gap-2">
              <SiReact className="h-4 w-4 text-cyan-400" />
              <h4 className="font-display text-sm font-bold text-white">Frontend</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Built with React 19, TypeScript, and Vite for reactive performance, styled using Tailwind CSS, and navigated with React Router.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-slate-900/30 space-y-1.5">
            <div className="flex items-center gap-2">
              <SiTrpc className="h-4 w-4 text-blue-400" />
              <h4 className="font-display text-sm font-bold text-white">Backend & RPC</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Hono framework running on Node.js using tRPC and TanStack Query for full-stack end-to-end type safety without manual contract authoring.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-slate-900/30 space-y-1.5">
            <div className="flex items-center gap-2">
              <SiZod className="h-4 w-4 text-blue-500" />
              <h4 className="font-display text-sm font-bold text-white">Validation</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Zod schemas enforce runtime validation at API boundaries for product catalogs, cart structures, and administrative commands.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-slate-900/30 space-y-1.5">
            <div className="flex items-center gap-2">
              <SiPostgresql className="h-4 w-4 text-sky-400" />
              <h4 className="font-display text-sm font-bold text-white">Database & ORM</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              PostgreSQL relational database paired with Drizzle ORM for type-safe schema definitions, relationships, and migration integrity.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-slate-900/30 space-y-1.5">
            <div className="flex items-center gap-2">
              <SiDocker className="h-4 w-4 text-blue-400" />
              <h4 className="font-display text-sm font-bold text-white">Production Containerization</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Docker Compose isolates services into repeatable container environments with network separation and volume persistence.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-slate-900/30 space-y-1.5">
            <div className="flex items-center gap-2">
              <SiNginx className="h-4 w-4 text-emerald-400" />
              <h4 className="font-display text-sm font-bold text-white">Edge Gateway</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Nginx provides reverse proxy routing, static asset delivery, rate limiting, and HTTP security headers in production.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: IMPORTANT BUSINESS FLOW
         ========================================================================= */}
      <section id="am-fruits-business-flow" className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              OPERATIONAL LIFECYCLE
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Important Business Flow
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Demonstrating how the different parts of the application work together from customer purchase to business fulfillment.
          </p>
        </div>

        {/* Visual Sequential Flow */}
        <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { step: "01", label: "Product", desc: "Catalog lookup & specifications" },
              { step: "02", label: "Cart", desc: "Line items & bulk quantities" },
              { step: "03", label: "Checkout", desc: "Billing & destination details" },
              { step: "04", label: "Shipping & Tax", desc: "Zone rate & GST calculation" },
              { step: "05", label: "Payment", desc: "COD or Razorpay verification" },
              { step: "06", label: "Order Creation", desc: "Atomic transaction & snapshot" },
              { step: "07", label: "Invoice", desc: "Tax invoice document generated" },
              { step: "08", label: "Inventory Update", desc: "Stock count decrement" },
              { step: "09", label: "Notification", desc: "Buyer & owner order alert" },
            ].map((node, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-white/10 bg-slate-950/70 space-y-1.5 relative group hover:border-cyan-400/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-cyan-400">{node.step}</span>
                  {idx < 8 && (
                    <ArrowRight className="h-3 w-3 text-slate-500 group-hover:text-cyan-400 transition-colors hidden md:block" />
                  )}
                </div>
                <h4 className="font-display text-xs sm:text-sm font-bold text-white">{node.label}</h4>
                <p className="text-[11px] text-slate-400 leading-tight font-light">{node.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-slate-950/40 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
            <p>
              When a buyer initiates an order, the system validates item availability, applies delivery zone rules, and calculates applicable taxes and shipping fees.
            </p>
            <p>
              Upon successful settlement (Cash on Delivery or verified Razorpay payment), the order record is created with an immutable historical snapshot. An official invoice is generated, the warehouse inventory counts are updated, and notifications are sent across both buyer and owner management dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: PAYMENT SYSTEM & SECURITY
         ========================================================================= */}
      <section id="am-fruits-payments-security" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Explanation */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">Payment Architecture</h3>
                <p className="text-xs font-mono text-emerald-400">Signature Verification</p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-300/90 leading-relaxed space-y-3 font-light">
              <p>
                AM Fruits supports <strong className="text-white font-medium">Cash on Delivery</strong> and <strong className="text-white font-medium">Razorpay online payments</strong>.
              </p>
              <p>
                For Razorpay payments, the server verifies the payment signature before accepting the payment. The verification uses <code className="text-cyan-300 font-mono text-xs px-1.5 py-0.5 rounded bg-slate-950 border border-white/10">HMAC-SHA256</code> hashing and <code className="text-cyan-300 font-mono text-xs px-1.5 py-0.5 rounded bg-slate-950 border border-white/10">timing-safe comparison</code> to prevent timing attacks.
              </p>
              <p className="text-slate-400 text-xs">
                All credentials, secret keys, and webhook secrets remain securely stored on the server environment and are never exposed to the client.
              </p>
            </div>
          </div>

          {/* Security Section */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">Security Controls</h3>
                <p className="text-xs font-mono text-purple-400">Access & Hardening</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-light">
              {[
                "Passwords are securely hashed using bcrypt prior to database storage",
                "Authentication state is maintained via secure, HTTP-only session cookies",
                "Role-based access control (RBAC) separates buyer procurement and owner/admin operations",
                "Razorpay payment signatures are validated server-side before order finalization",
                "Nginx applies security headers (X-Frame-Options, CSP, HSTS) in production environments",
              ].map((sec, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{sec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: DATABASE & ORDER DATA IMMUTABILITY
         ========================================================================= */}
      <section id="am-fruits-database-entities" className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              RELATIONAL DOMAIN MODEL
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Database & Business Entities
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            PostgreSQL relational entities mapped through Drizzle ORM to power commercial operations.
          </p>
        </div>

        {/* Business Entities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { name: "Users", icon: Users },
            { name: "Companies", icon: Store },
            { name: "Customers", icon: Users },
            { name: "Products", icon: Boxes },
            { name: "Categories", icon: Layers },
            { name: "Cart Items", icon: ShoppingCart },
            { name: "Orders", icon: FileText },
            { name: "Order Items", icon: Receipt },
            { name: "Invoices", icon: FileCheck },
            { name: "Invoice Items", icon: Receipt },
            { name: "Inventory", icon: Boxes },
            { name: "Warehouses", icon: Store },
            { name: "Delivery Zones", icon: MapPin },
            { name: "GST & Tax Data", icon: BarChart3 },
            { name: "Shipping Methods", icon: Truck },
          ].map((entity, idx) => {
            const Icon = entity.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-xl border border-white/10 bg-slate-900/40 flex items-center gap-2.5 hover:border-cyan-500/30 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-white/5 text-cyan-400 shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-mono text-xs text-slate-200 truncate">{entity.name}</span>
              </div>
            );
          })}
        </div>

        {/* Order Data / Historical Records Card */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                Order Data & Historical Records Preservation
              </h3>
              <p className="text-xs font-mono text-cyan-400">Data Immutability</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            Order items preserve important information from the time the order is created. This allows historical orders to remain accurate even if current product information changes later. Price snapshots, product descriptions, unit specifications, and applicable GST rates are permanently frozen into the order line items at checkout time.
          </p>
        </div>
      </section>
    </div>
  );
}
