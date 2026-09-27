import React from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Database,
  ExternalLink,
  FileCheck,
  HardDrive,
  Info,
  Layers,
  Phone,
  Receipt,
  Server,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Store,
  Terminal,
  Utensils,
  Workflow,
  GitBranch,
} from "lucide-react";
import {
  SiReact,
  SiVite,
  SiTypescript,
  SiHono,
  SiTrpc,
  SiDrizzle,
  SiPostgresql,
  SiTailwindcss,
} from "react-icons/si";
import { FaGithub } from "react-icons/fa";

export default function SmartOrderProjectDetails() {
  return (
    <div id="smartorder-project-details" className="pt-6 sm:pt-8 border-t border-white/10 space-y-8 sm:space-y-12">
      {/* =========================================================================
          1. PROJECT DETAILS HERO
         ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
            CASE STUDY & ARCHITECTURE
          </span>
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Info className="h-5 w-5 text-cyan-400 shrink-0" />
          <span>Project Details</span>
        </h3>
        <div className="p-4 sm:p-5 rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm space-y-2">
          <p className="text-[14px] sm:text-[15px] md:text-base text-slate-200 font-medium leading-[1.55] sm:leading-[1.6]">
            SmartOrder is a self-service restaurant ordering system built around a real restaurant commerce workflow for Tex’s Chicken & Burgers.
          </p>
          <p className="text-[13px] sm:text-[14px] md:text-[15px] text-slate-400 font-light leading-[1.55] sm:leading-[1.6]">
            From digital menu browsing to product customization, checkout, payment selection, and order management, the system connects the customer ordering experience with restaurant-side administration.
          </p>
        </div>
      </section>

      {/* =========================================================================
          2. THE CUSTOMER EXPERIENCE
         ========================================================================= */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              STEP-BY-STEP FLOW
            </span>
          </div>
          <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
            Customer Experience
          </h4>
        </div>

        {/* 9-Step Responsive Grid Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-2 sm:gap-2.5">
          {[
            { num: "01", name: "Home" },
            { num: "02", name: "Products" },
            { num: "03", name: "Product Details" },
            { num: "04", name: "Customization" },
            { num: "05", name: "Cart" },
            { num: "06", name: "Checkout" },
            { num: "07", name: "Phone Number" },
            { num: "08", name: "Payment" },
            { num: "09", name: "Order" },
          ].map((step, idx) => (
            <div
              key={step.num}
              className="relative p-2.5 sm:p-3 rounded-xl border border-white/10 bg-slate-900/60 flex flex-col justify-between hover:border-cyan-500/40 transition-colors group"
            >
              <div className="text-[10px] sm:text-[11px] font-mono font-semibold text-cyan-400">
                {step.num}
              </div>
              <div className="text-xs sm:text-[13px] font-bold text-white mt-1 group-hover:text-cyan-200 transition-colors">
                {step.name}
              </div>
              {idx < 8 && (
                <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-cyan-400/50">
                  <ChevronRight className="h-3 w-3" />
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-[13px] sm:text-[14px] text-slate-300 font-light leading-relaxed">
          The customer can move from browsing the menu to placing an order through a simple guided experience designed for touchscreen interaction.
        </p>
      </section>

      {/* =========================================================================
          3. DYNAMIC PRODUCT CONFIGURATION
         ========================================================================= */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              DATA-DRIVEN CUSTOMIZATION
            </span>
          </div>
          <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
            Dynamic Product Configuration
          </h4>
          <p className="text-[13px] sm:text-[14px] text-slate-300 font-light leading-relaxed">
            The main engineering focus was making product configuration dynamic rather than hard-coded.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {/* Configurable Product Options Card */}
          <div className="p-4 sm:p-5 rounded-xl border border-white/10 bg-slate-900/60 space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-display text-sm sm:text-base font-bold text-white">
                Chicken Sandwich
              </span>
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                Configurable Options
              </span>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  Variant
                </span>
                <div className="flex flex-wrap gap-1.5 font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">Classic</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-semibold">Deluxe</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">Grilled</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  Meal Option
                </span>
                <div className="flex flex-wrap gap-1.5 font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">Meal</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-semibold">Large Meals</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  Choice
                </span>
                <div className="flex flex-wrap gap-1.5 font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">Mild</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-semibold">Spicy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Configuration Result Card */}
          <div className="p-4 sm:p-5 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-slate-900/80 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-1 border-b border-cyan-500/20 pb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
                Resulting Payload
              </span>
              <div className="font-display text-sm sm:text-base font-bold text-white">
                Selected Configuration
              </div>
            </div>

            <div className="p-3 rounded-lg border border-cyan-500/30 bg-cyan-950/30 space-y-1.5 text-center">
              <div className="text-sm sm:text-base font-bold text-cyan-200">
                Deluxe
              </div>
              <div className="text-xs font-mono text-cyan-400/80">
                + Large Meals + Spicy
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-300 font-light pt-1">
              <p>
                These selections are independent option groups. The selected configuration is maintained when the customer adds the product to the cart.
              </p>
              <p className="text-slate-400 font-mono text-[11px] pt-1">
                Each product variant can have its own image and pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CART & ORDER CONFIGURATION
         ========================================================================= */}
      <section className="space-y-3.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              PRESERVED CART SNAPSHOT
            </span>
          </div>
          <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
            Configuration → Cart → Order
          </h4>
        </div>

        {/* Visual Flow Pipeline */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-white/10 bg-slate-900/50">
          <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-[13px] font-mono text-slate-200">
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-white/10 text-white font-medium">Product</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-white/10 text-cyan-300">Selected Variant</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-white/10 text-cyan-300">Selected Options</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-white/10 text-white">Quantity</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-white/10 text-emerald-300">Calculated Price</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 font-semibold">Cart</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 font-semibold">Order</span>
          </div>
        </div>

        <p className="text-[13px] sm:text-[14px] text-slate-300 font-light leading-relaxed">
          The cart preserves the selected product configuration, including the product, variant, options, quantity, and calculated price.
        </p>
      </section>

      {/* =========================================================================
          5. RESTAURANT ORDERING FLOW
         ========================================================================= */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              END-TO-END FLOW
            </span>
          </div>
          <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
            Restaurant Ordering Flow
          </h4>
        </div>

        <div className="p-4 sm:p-5 rounded-xl border border-white/10 bg-slate-900/60 space-y-4">
          <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-[13px] font-mono text-slate-200">
            <span className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-200 font-semibold">CUSTOMER</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10">Browse Menu</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10">Configure Product</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10">Add to Cart</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10">Checkout</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10">Phone Number</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10">Payment Selection</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 font-semibold">ORDER CREATED</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2.5 py-1 rounded bg-purple-950/80 border border-purple-500/40 text-purple-200 font-semibold">RESTAURANT ADMIN</span>
          </div>

          {/* Highlighted Order Identifier Callout */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/30 flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
                Generated Order Identifier
              </span>
              <div className="text-xs sm:text-sm text-slate-300 font-light">
                Example: Customer phone ending in 2390
              </div>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg border border-cyan-400 bg-cyan-500/10 font-mono text-base sm:text-lg font-bold text-cyan-200 tracking-wider">
              T 2390
            </div>
          </div>

          <div className="space-y-1.5 text-[13px] sm:text-[14px] text-slate-300 font-light leading-relaxed">
            <p>
              After checkout, the system creates an order identifier using the last four digits of the customer's phone number with a T prefix. For example, <span className="font-mono text-cyan-300 font-semibold">T 2390</span>.
            </p>
            <p className="text-slate-400">
              This gives restaurant staff a simple way to identify and call an order without displaying the complete phone number.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. PAYMENT SYSTEM
         ========================================================================= */}
      <section className="space-y-3.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              SETTLEMENT & EXTENSIBILITY
            </span>
          </div>
          <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
            Payment System
          </h4>
        </div>

        <div className="p-4 sm:p-5 rounded-xl border border-white/10 bg-slate-900/60 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Store className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Current Method
                </span>
                <span className="text-sm sm:text-base font-bold text-white">
                  Pay at Counter
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-[11px] font-mono text-cyan-300 font-medium">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span>Ready for Future Payment Integration</span>
            </span>
          </div>

          <p className="text-[13px] sm:text-[14px] text-slate-300 font-light leading-relaxed">
            The current payment flow supports in-person counter settlement. The architecture can be extended later with integrated payment methods.
          </p>
        </div>
      </section>

      {/* =========================================================================
          7. RESTAURANT ADMINISTRATION
         ========================================================================= */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              OPERATIONS BACKOFFICE
            </span>
          </div>
          <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
            Restaurant Administration
          </h4>
          <p className="text-[13px] sm:text-[14px] text-cyan-200/90 font-light">
            One system for managing the menu and the resulting orders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Product Catalog */}
          <div className="p-4 sm:p-5 rounded-xl border border-white/10 bg-slate-900/60 space-y-3 hover:border-cyan-500/30 transition-colors">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Utensils className="h-4 w-4" />
              </div>
              <h5 className="font-display text-sm sm:text-base font-bold text-white">
                Product Catalog
              </h5>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-[13px] text-slate-300 font-light">
              {[
                "Products",
                "Categories",
                "Product Variants",
                "Product Images",
                "Pricing",
                "Product Options",
                "Meal Options",
                "Customer-facing Configuration",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2: Order Management */}
          <div className="p-4 sm:p-5 rounded-xl border border-white/10 bg-slate-900/60 space-y-3 hover:border-emerald-500/30 transition-colors">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Receipt className="h-4 w-4" />
              </div>
              <h5 className="font-display text-sm sm:text-base font-bold text-white">
                Order Management
              </h5>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-[13px] text-slate-300 font-light">
              {[
                "Order Identifier",
                "Customer Information",
                "Ordered Items",
                "Selected Configuration",
                "Quantities",
                "Total Amount",
                "Order Status",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-[13px] sm:text-[14px] text-slate-300 font-light leading-relaxed">
          The administration system allows restaurant staff to control the menu configuration while the customer-facing ordering experience uses those configured values dynamically.
        </p>
      </section>

      {/* =========================================================================
          8. ADMIN → CUSTOMER CONNECTION
         ========================================================================= */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              UNIFIED CONFIGURATION ARCHITECTURE
            </span>
          </div>
          <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
            One Configuration. Two Experiences.
          </h4>
        </div>

        <div className="p-4 sm:p-6 rounded-xl border border-white/10 bg-slate-900/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Admin Experience */}
            <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 space-y-3">
              <div className="flex items-center justify-between border-b border-purple-500/30 pb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold">
                  Admin Experience
                </span>
                <span className="text-[10px] font-mono text-slate-400">Menu & Store Control</span>
              </div>
              <div className="flex flex-col gap-1.5 text-xs font-mono text-purple-200">
                <div className="p-2 rounded bg-purple-950/40 border border-purple-500/20 text-center">Configure Product</div>
                <div className="text-center text-purple-400 text-[10px]">↓</div>
                <div className="p-2 rounded bg-purple-950/40 border border-purple-500/20 text-center">Variant</div>
                <div className="text-center text-purple-400 text-[10px]">↓</div>
                <div className="p-2 rounded bg-purple-950/40 border border-purple-500/20 text-center">Options</div>
                <div className="text-center text-purple-400 text-[10px]">↓</div>
                <div className="p-2 rounded bg-purple-950/40 border border-purple-500/20 text-center">Pricing</div>
              </div>
            </div>

            {/* Customer Experience */}
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-3">
              <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                  Customer Experience
                </span>
                <span className="text-[10px] font-mono text-slate-400">Touchscreen Ordering</span>
              </div>
              <div className="flex flex-col gap-1.5 text-xs font-mono text-cyan-200">
                <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 text-center">Browse Product</div>
                <div className="text-center text-cyan-400 text-[10px]">↓</div>
                <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 text-center">Select Variant</div>
                <div className="text-center text-cyan-400 text-[10px]">↓</div>
                <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 text-center">Select Options</div>
                <div className="text-center text-cyan-400 text-[10px]">↓</div>
                <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 text-center">Add to Cart</div>
                <div className="text-center text-cyan-400 text-[10px]">↓</div>
                <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 text-center">Place Order</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[13px] sm:text-[14px] text-slate-300 font-light leading-relaxed">
          The key design principle is that restaurant configuration drives the customer experience instead of requiring every product combination to be hard-coded into the frontend.
        </p>
      </section>

      {/* =========================================================================
          9. PRODUCT VARIANT EXAMPLE
         ========================================================================= */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              MENU CATALOG MODELING
            </span>
          </div>
          <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
            Real Product Configuration Example
          </h4>
          <span className="text-xs font-mono text-slate-400">Chicken Sandwich Variants</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              name: "CLASSIC",
              desc: "Crispy fried chicken breast, pickles, signature sauce",
              img: "Variant image",
              pricing: "Variant pricing",
            },
            {
              name: "DELUXE",
              desc: "Lettuce, tomatoes, melted cheese, premium sauce",
              img: "Variant image",
              pricing: "Variant pricing",
            },
            {
              name: "GRILLED",
              desc: "Flame-grilled chicken fillet, fresh greens, herb mayo",
              img: "Variant image",
              pricing: "Variant pricing",
            },
          ].map((v) => (
            <div
              key={v.name}
              className="p-3.5 sm:p-4 rounded-xl border border-white/10 bg-slate-900/60 space-y-2 hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <span className="font-display text-sm font-bold text-white tracking-wide">
                  {v.name}
                </span>
                <span className="text-[10px] font-mono text-cyan-400">Variant</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-light">
                {v.desc}
              </p>
              <div className="pt-1.5 flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span className="text-cyan-300">✓ {v.img}</span>
                <span className="text-emerald-300">✓ {v.pricing}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[13px] sm:text-[14px] text-slate-300 font-light leading-relaxed">
          Each variant can be independently configured with its own image and pricing.
        </p>
      </section>

      {/* =========================================================================
          10. RESPONSIVE / TOUCHSCREEN DESIGN
         ========================================================================= */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              HUMAN-COMPUTER INTERACTION
            </span>
          </div>
          <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
            Built for Real Interaction
          </h4>
          <p className="text-[13px] sm:text-[14px] text-slate-300 font-light leading-relaxed">
            The customer experience was designed around touchscreen interaction while remaining responsive for mobile devices.
          </p>
        </div>

        {/* 3 Interaction Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 sm:p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 text-center space-y-1">
            <div className="text-xs sm:text-sm font-mono font-bold text-cyan-300 uppercase tracking-wider">
              Touchscreen First
            </div>
            <div className="text-[11px] text-slate-400 font-light">
              High-contrast tap targets & direct selection
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl border border-sky-500/30 bg-sky-950/20 text-center space-y-1">
            <div className="text-xs sm:text-sm font-mono font-bold text-sky-300 uppercase tracking-wider">
              Responsive Web
            </div>
            <div className="text-[11px] text-slate-400 font-light">
              Fluid multi-device layout & mobile ordering
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-center space-y-1">
            <div className="text-xs sm:text-sm font-mono font-bold text-emerald-300 uppercase tracking-wider">
              Simple Customer Flow
            </div>
            <div className="text-[11px] text-slate-400 font-light">
              Minimal friction from selection to order ID
            </div>
          </div>
        </div>

        <p className="text-[13px] sm:text-[14px] text-slate-300 font-light leading-relaxed">
          The interface is designed to keep product selection and ordering straightforward while supporting the same underlying product configuration across the experience.
        </p>
      </section>

      {/* =========================================================================
          11. DATA & ORDER LIFECYCLE
         ========================================================================= */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              TRANSACTION PIPELINE
            </span>
          </div>
          <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
            Order Data Lifecycle
          </h4>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl border border-white/10 bg-slate-900/60">
          <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-[13px] font-mono text-slate-200">
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10">Product Configuration</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10 text-cyan-300">Cart State</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10">Checkout</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10 text-cyan-300">Customer Phone</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10">Payment Selection</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 font-semibold">Order</span>
            <span className="text-cyan-400">→</span>
            <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/40 text-purple-200 font-semibold">Restaurant Orders</span>
          </div>
        </div>

        <p className="text-[13px] sm:text-[14px] text-slate-300 font-light leading-relaxed">
          The selected product configuration, quantity, pricing information, customer phone information, and order identifier are carried through the ordering workflow so the restaurant can view the resulting order.
        </p>
      </section>

      {/* =========================================================================
          12. TECHNICAL ARCHITECTURE
         ========================================================================= */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              FULL-STACK ARCHITECTURE
            </span>
          </div>
          <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
            Technical Architecture
          </h4>
        </div>

        {/* Clean Stacked Diagram */}
        <div className="max-w-md mx-auto space-y-1.5 py-1 w-full text-center font-mono">
          {[
            { label: "CUSTOMER / TOUCHSCREEN", desc: "Interactive kiosk & client ordering", color: "border-cyan-500/30 bg-cyan-950/20 text-cyan-200" },
            { label: "REACT + VITE", desc: "Single-page application with instant rendering", color: "border-blue-500/30 bg-blue-950/20 text-blue-200" },
            { label: "TYPESCRIPT", desc: "Strict end-to-end typing for variants & orders", color: "border-sky-500/30 bg-sky-950/20 text-sky-200" },
            { label: "HONO + tRPC", desc: "High-performance backend API & RPC procedures", color: "border-orange-500/30 bg-orange-950/20 text-orange-200" },
            { label: "DRIZZLE ORM", desc: "Type-safe database queries & migrations", color: "border-lime-500/30 bg-lime-950/20 text-lime-200" },
            { label: "NEON POSTGRESQL", desc: "Serverless relational cloud database", color: "border-emerald-500/30 bg-emerald-950/20 text-emerald-200" },
            { label: "PERSISTENT APPLICATION DATA", desc: "Immutable menu catalog & order records", color: "border-purple-500/30 bg-purple-950/20 text-purple-200" },
          ].map((tier, idx, arr) => (
            <React.Fragment key={tier.label}>
              <div className={`p-2.5 rounded-xl border text-center space-y-0.5 ${tier.color}`}>
                <div className="text-xs sm:text-sm font-bold">{tier.label}</div>
                <div className="text-[10px] sm:text-[11px] font-light opacity-80">{tier.desc}</div>
              </div>
              {idx < arr.length - 1 && (
                <div className="flex justify-center text-cyan-400/60 py-0.5">
                  <ArrowDown className="h-3.5 w-3.5" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <p className="text-[13px] sm:text-[14px] text-slate-300 font-light leading-relaxed">
          The frontend provides the customer and administration interfaces. Hono and tRPC provide the application API layer, Drizzle ORM handles database access, and Neon PostgreSQL provides persistent application data.
        </p>
      </section>

      {/* =========================================================================
          13. TECHNOLOGY STACK
         ========================================================================= */}
      <section className="space-y-3.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              ENGINEERING TOOLKIT
            </span>
          </div>
          <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
            Technology Stack
          </h4>
        </div>

        {/* Proper Branded Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {[
            { name: "React", icon: <SiReact className="text-cyan-400" /> },
            { name: "Vite", icon: <SiVite className="text-purple-400" /> },
            { name: "TypeScript", icon: <SiTypescript className="text-blue-400" /> },
            { name: "Hono", icon: <SiHono className="text-orange-400" /> },
            { name: "tRPC", icon: <SiTrpc className="text-blue-400" /> },
            { name: "Drizzle ORM", icon: <SiDrizzle className="text-lime-400" /> },
            { name: "PostgreSQL", icon: <SiPostgresql className="text-sky-400" /> },
            { name: "Neon PostgreSQL", icon: <SiPostgresql className="text-emerald-400" /> },
            { name: "Responsive Web UI", icon: <Smartphone className="text-cyan-300" /> },
            { name: "REST / API Integrations", icon: <Server className="text-emerald-300" /> },
            { name: "Git", icon: <GitBranch className="text-orange-400" /> },
            { name: "GitHub", icon: <FaGithub className="text-slate-200" /> },
          ].map((tech) => (
            <div
              key={tech.name}
              className="flex items-center gap-2.5 p-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:border-cyan-500/40 transition-colors"
            >
              <div className="text-base shrink-0">{tech.icon}</div>
              <span className="text-xs sm:text-[13px] font-mono text-slate-200 font-medium truncate">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          14. ENGINEERING HIGHLIGHTS
         ========================================================================= */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              CORE HIGHLIGHTS
            </span>
          </div>
          <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
            Engineering Highlights
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            {
              num: "01",
              title: "Dynamic Configuration",
              desc: "Product variants and options are configurable rather than hard-coded.",
            },
            {
              num: "02",
              title: "Variant-Aware Products",
              desc: "Variants can have their own images and pricing.",
            },
            {
              num: "03",
              title: "Connected Order Flow",
              desc: "Product configuration is preserved through cart and checkout.",
            },
            {
              num: "04",
              title: "Restaurant Admin",
              desc: "Menu configuration and resulting orders are managed from the administration system.",
            },
            {
              num: "05",
              title: "Touchscreen-First UX",
              desc: "The customer journey is designed around simple self-service interaction.",
            },
            {
              num: "06",
              title: "Persistent Data",
              desc: "Restaurant and order data are backed by PostgreSQL.",
            },
          ].map((h) => (
            <div
              key={h.num}
              className="p-3.5 sm:p-4 rounded-xl border border-white/10 bg-slate-900/60 space-y-1.5 hover:border-cyan-500/40 transition-colors"
            >
              <span className="text-[11px] font-mono font-semibold text-cyan-400 block">
                {h.num}
              </span>
              <h5 className="font-display text-sm font-bold text-white">
                {h.title}
              </h5>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                {h.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          15. REAL-WORLD PROJECT CONTEXT
         ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-cyan-400 font-semibold">
            CONTEXT & PROVENANCE
          </span>
        </div>
        <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
          Real-World Project Context
        </h4>
        <div className="p-4 sm:p-5 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-slate-900/40 space-y-2">
          <p className="text-[13px] sm:text-[14px] md:text-[15px] text-slate-200 font-medium leading-relaxed">
            SmartOrder is the portfolio presentation of a real restaurant commerce application developed around the Tex’s Chicken & Burgers use case.
          </p>
          <p className="text-[13px] sm:text-[14px] text-slate-400 font-light leading-relaxed">
            The portfolio name SmartOrder is used to present the engineering system independently as a reusable self-service restaurant ordering concept.
          </p>
          <p className="text-[12px] sm:text-[13px] text-slate-400 font-light italic pt-1 border-t border-white/10">
            The screenshots and interface shown in this project represent the actual work developed for the restaurant ordering experience.
          </p>
        </div>
      </section>

      {/* =========================================================================
          16. BUSINESS VALUE
         ========================================================================= */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              COMMERCIAL RATIONALE
            </span>
          </div>
          <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
            Why This System Matters
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              title: "Simpler Customer Ordering",
              desc: "Customers can browse and configure products through a guided touchscreen flow.",
            },
            {
              title: "Flexible Menu Configuration",
              desc: "Restaurant administrators can manage products, variants, images, pricing, and options.",
            },
            {
              title: "Fewer Hard-Coded Product Flows",
              desc: "The customer experience can respond to configured product options.",
            },
            {
              title: "Connected Operations",
              desc: "The customer order flows into the restaurant's administration system.",
            },
            {
              title: "Ready for Extension",
              desc: "The architecture can be extended with additional payment methods and future restaurant capabilities.",
            },
          ].map((val) => (
            <div
              key={val.title}
              className="p-3.5 sm:p-4 rounded-xl border border-white/10 bg-slate-900/60 space-y-1 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <h5 className="font-display text-sm font-bold text-white">
                  {val.title}
                </h5>
              </div>
              <p className="text-xs text-slate-400 font-light leading-relaxed pl-6">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          17. FINAL PROJECT FLOW
         ========================================================================= */}
      <section className="p-5 sm:p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-900/60 space-y-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="font-mono text-xs font-semibold text-cyan-400 uppercase tracking-widest">
            SMARTORDER
          </div>
          <h4 className="font-display text-base sm:text-lg font-bold text-white">
            Self-Service Restaurant Ordering System
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Customer Pipeline */}
          <div className="p-3.5 rounded-xl border border-cyan-500/20 bg-slate-900/60 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-semibold block">
              Customer Pipeline
            </span>
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-slate-200">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10">Browse</span>
              <span className="text-cyan-400">→</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10">Configure</span>
              <span className="text-cyan-400">→</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10">Cart</span>
              <span className="text-cyan-400">→</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10">Checkout</span>
              <span className="text-cyan-400">→</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-200">Order</span>
            </div>
          </div>

          {/* Restaurant Pipeline */}
          <div className="p-3.5 rounded-xl border border-purple-500/20 bg-slate-900/60 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-purple-300 font-semibold block">
              Restaurant Pipeline
            </span>
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-slate-200">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10">Configure Menu</span>
              <span className="text-purple-400">→</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10">Receive Orders</span>
              <span className="text-purple-400">→</span>
              <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-200">Manage Orders</span>
            </div>
          </div>
        </div>

        <div className="pt-2 text-center text-xs sm:text-sm text-cyan-100/90 font-light italic">
          &ldquo;One connected ordering experience — from the customer&apos;s first tap to the restaurant&apos;s order management.&rdquo;
        </div>
      </section>
    </div>
  );
}
