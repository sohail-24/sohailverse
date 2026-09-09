# SohailVerse v2.0 — Technical Architecture

> **Document Type:** System Architecture Specification  
> **Status:** Evidence-Based Current State  
> **Repository Inspection Date:** September 2026  
> **Standard:** Real Project Data Only (Zero Placeholders / Zero Speculation)

---

## 1. Project Identity

| Property | Value | Evidence Source |
|---|---|---|
| **Project Name** | SohailVerse v2.0 (`sohailverse`) | `metadata.json` line 2, `package.json` line 2 |
| **Description** | A personal digital universe for travel, systems, and learning | `metadata.json` line 3 |
| **Current Architecture** | Hybrid Single-Page Application (SPA) with Serverless Edge API Functions | `package.json`, `functions/api/`, `vite.config.ts` |
| **Frontend Framework** | React 18.2.0 with React Router DOM 6.30.1 | `package.json` lines 18, 21 |
| **Styling Engine** | Tailwind CSS 3.4.17 with PostCSS 8.4.49 & Autoprefixer 10.4.20 | `package.json` lines 33-36, `tailwind.config.ts` |
| **Animation & Graphics** | Framer Motion 13.1.1, Three.js 0.185.1, React Simple Maps 3.0.0 | `package.json` lines 16, 22, 23 |
| **Iconography** | Lucide React 1.21.0, React Icons 5.6.0 | `package.json` lines 17, 20 |
| **Backend / API Engine** | Cloudflare Pages Functions (V8 Worker runtime with Web Crypto API) | `functions/api/*`, `functions/api/_middleware.ts` |
| **Database Technology** | Neon Serverless PostgreSQL (`@neondatabase/serverless` v1.1.0) | `package.json` line 13, `src/db/index.ts` line 2 |
| **ORM & Schema Toolkit** | Drizzle ORM v0.45.2 (`drizzle-orm/neon-http`, `drizzle-orm/pg-core`) & Drizzle Kit v0.31.10 | `package.json` lines 14-15, `drizzle.config.ts` |
| **Target Deployment Platform** | Cloudflare Pages (Static SPA + Pages Functions API) | `functions/api/`, `.dev.vars.example` |
| **Local Dev Server** | Vite 5.4.10 with custom dev server API proxy middleware | `package.json` line 38, `vite.config.ts` lines 212-450 |
| **Node.js Package Type** | ECMAScript Module (`"type": "module"`) | `package.json` line 5 |
| **Current Git Branch** | **NOT VERIFIED FROM REPOSITORY** (no `.git` metadata present in runtime container) | Container environment inspection |

---

## 2. Repository Structure

The physical directory tree and architectural responsibilities of each area are verified as follows:

```
sohailverse/
├── .dev.vars.example            # Cloudflare Pages Functions server secrets template
├── .env.example                 # Application environment variable reference
├── bun.lock                     # Bun dependency lockfile
├── drizzle.config.ts            # Drizzle Kit configuration targeting Neon PostgreSQL
├── functions/                   # Cloudflare Pages Functions (Serverless Edge API)
│   └── api/
│       ├── _middleware.ts       # Global route interceptor & admin session auth guard
│       ├── academy/             # Skills & certification endpoints (GET, POST, PUT, DELETE)
│       ├── atlas/               # Travel & destination log endpoints (GET, POST, PUT, DELETE)
│       ├── auth/                # PBKDF2 authentication & HMAC-SHA256 session handlers
│       ├── devops/              # Portfolio systems & projects endpoints (GET, POST, PUT, DELETE)
│       ├── movies/              # Cinema Observatory endpoints (GET, POST, PUT, DELETE)
│       └── timeline/            # Career & platform milestone endpoints (GET, POST, PUT, DELETE)
├── drizzle/
│   └── migrations-pg/           # PostgreSQL migration outputs and snapshot meta
│       ├── 0000_bouncy_prowler.sql
│       └── meta/
├── index.html                   # HTML entry point (title: "SohailVerse v2.0")
├── metadata.json                # AI Studio platform capabilities & permissions
├── package.json                 # Project dependencies, scripts, and runtime engine
├── public/                      # Static assets served at root
│   ├── cinema/                  # Cinema observatory imagery and genre banners
│   ├── movies/                  # Movie poster backdrops
│   ├── projects/temporary/      # SVG/JPEG generated project previews
│   ├── earth-*.jpg / .webp      # Globe textures and astronomical space backdrops
│   ├── dev-real-*.jpg           # Engineering photography
│   └── resume.pdf               # Career resume document
├── scripts/                     # Operational, generation, and migration scripts
│   ├── generate-password-hash.js       # CLI tool for PBKDF2 admin password hashing
│   ├── generate-project-placeholders.cjs # Sharp vector-to-JPEG project renderer
│   ├── generate-space-background.mjs   # Procedural deep-space background generator
│   ├── generate-temporary-images.mjs   # Sharp temporary project image generator
│   └── migrate-d1-to-neon.mjs          # Data migration runner from D1 SQL into Neon
├── src/
│   ├── app/                     # Application bootstrapping & router definitions
│   │   ├── App.tsx              # Root component rendering RouterProvider
│   │   ├── router.tsx           # React Router DOM browser router instance
│   │   └── routes.tsx           # Route mapping definitions
│   ├── assets/                  # Bundled assets (images, icons)
│   ├── components/              # Modular UI components
│   │   ├── about/               # About & career journey cards
│   │   ├── cards/               # Card visual primitives
│   │   ├── cinema/              # Cinema carousel, movie player, filter controls
│   │   ├── devops/              # DevOps architecture displays & lab widgets
│   │   ├── layout/              # RootLayout, Navbar, Footer, PageShell
│   │   ├── map/                 # Interactive SVG world map (react-simple-maps)
│   │   ├── mission-control/     # Hero, 3D Earth, telemetry strip, project carousel
│   │   ├── navigation/          # Navigation bars and header links
│   │   ├── projects/            # Project showcase cards, data adapters, detail panels
│   │   └── ui/                  # GlassPanel, buttons, badges
│   ├── data/                    # Static initial data and telemetry definitions
│   │   ├── devopsData.ts        # DevOps project metrics and infrastructure blueprints
│   │   ├── mission-control.ts   # Flagship project registry and orbit telemetry
│   │   ├── navigation.ts        # Global navigation links
│   │   └── profile.ts           # Author bio, certifications, and contacts
│   ├── db/                      # Database layer
│   │   ├── index.ts             # Database connection factory (`createDb`) via Neon HTTP
│   │   ├── schema.pg.ts         # Active PostgreSQL / Neon schema (7 physical tables)
│   │   └── schema.ts            # Legacy Cloudflare D1 / SQLite schema (preserved)
│   ├── lib/                     # Utilities
│   │   ├── api.ts               # Typed client (`fetchApi`), response validators, fallbacks
│   │   └── utils.ts             # Tailwind classnames merger (`cn`)
│   ├── pages/                   # Routed page views
│   │   ├── AdminPage.tsx        # Authenticated Admin Console for CRUD management
│   │   ├── CinemaPage.tsx       # Cinema Observatory catalog
│   │   ├── DashboardPage.tsx    # Telemetry and collection analytics dashboard
│   │   ├── DevOpsPage.tsx       # DevOps Engineering laboratory & systems
│   │   ├── MissionControlPage.tsx # Platform home page and 3D planetary interface
│   │   ├── ProjectDetailPage.tsx  # Architectural deep-dive for flagship systems
│   │   ├── ProjectsPage.tsx     # Unified portfolio project showcase
│   │   └── TimelinePage.tsx     # Milestones and career chronology
│   ├── styles/                  # Global styles
│   │   ├── globals.css          # Base Tailwind imports and utility classes
│   │   └── tokens.css           # Custom design token variables
│   └── types/                   # Shared TypeScript interfaces
│       ├── devops.ts
│       ├── mission-control.ts
│       └── shared.ts
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # Project TypeScript references configuration
├── tsconfig.app.json            # Client TypeScript compilation settings
├── tsconfig.node.json           # Node / Vite configuration settings
└── vite.config.ts               # Vite build configuration with embedded dev API middleware
```

---

## 3. Runtime Architecture

SohailVerse operates under two distinct runtime environments: **Production (Cloudflare Pages)** and **Local Development (Vite Dev Server)**.

### Production Runtime Flow (Cloudflare Pages)

```
[Browser Client]
       │
       ├─────────────────────────────────────────┐
       │ (1) HTTP GET static assets               │ (2) HTTP /api/* requests
       ▼                                         ▼
[Cloudflare Pages CDN Edge]           [Pages Functions V8 Worker]
(Serves compiled dist/ assets)                   │
                                      [functions/api/_middleware.ts]
                                      (Validates auth on POST/PUT/DELETE)
                                                 │
                                      [Route Handler: functions/api/*]
                                                 │
                                      [src/db/index.ts (createDb)]
                                      (Drizzle ORM + Neon HTTP Client)
                                                 │
                                                 ▼
                                     [Neon Serverless PostgreSQL]
                                     (Tables: movies, academy_posts, etc.)
```

### Local Development Flow (Vite Dev Server)

```
[Browser Client]
       │
       ▼
[Vite Dev Server (Port 3000)] (vite.config.ts)
       │
       ├── Non-API routes ──► Serves Vite HMR client & TypeScript modules
       │
       └── /api/* routes  ──► apiMiddleware in vite.config.ts
                                  │
                                  ├── If DATABASE_URL configured:
                                  │     neon(DATABASE_URL) ──► Live Neon PostgreSQL
                                  │
                                  └── If DATABASE_URL missing / fails:
                                        mockStore (In-memory fallback data)
```

---

## 4. Database Architecture

### Engine & Connection
- **Database Engine:** Neon Serverless PostgreSQL.
- **Connection Transport:** HTTP serverless queries via `@neondatabase/serverless` using `drizzle-orm/neon-http`.
- **Environment Variable:** `DATABASE_URL` (supplied via Cloudflare Pages environment variables, `.dev.vars`, or local shell).
- **Configuration File:** `drizzle.config.ts`:
  - `schema: "./src/db/schema.pg.ts"`
  - `out: "./drizzle/migrations-pg"`
  - `dialect: "postgresql"`
  - `dbCredentials.url: process.env.DATABASE_URL || ""`
- **Database Adapter:** `src/db/index.ts` exports `createDb(databaseUrl?: string)`. If `DATABASE_URL` is undefined or fails, it returns a proxy that prevents runtime crashes while logging a console warning.

### Physical PostgreSQL Tables

The repository defines exactly seven physical PostgreSQL tables in `src/db/schema.pg.ts` and `drizzle/migrations-pg/0000_bouncy_prowler.sql`:

```
┌───────────────────┬────────────────────────────────────────────────────────────────────────┐
│ Physical Table    │ Column Definitions (PostgreSQL Dialect)                                │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ movies            │ id (integer, PK, identity), title (text, not null), genre (text,       │
│                   │ not null), rating (real, not null), trailer_url (text, nullable)       │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ travel_posts      │ id (integer, PK, identity), country (text, not null), city (text,      │
│                   │ not null), description (text, nullable)                                │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ academy_posts     │ id (integer, PK, identity), skill (text, not null), category (text,    │
│                   │ not null), level (text, not null)                                      │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ devops_posts      │ id (integer, PK, identity), title (text, not null), category (text,    │
│                   │ not null), description (text, not null), created_at (timestamp,        │
│                   │ default now(), not null)                                               │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ timeline_posts    │ id (integer, PK, identity), title (text, not null), category (text,    │
│                   │ not null), description (text, not null), created_at (timestamp,        │
│                   │ default now(), not null)                                               │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ atlas_posts       │ id (integer, PK, identity), country (text, not null), status (text,   │
│                   │ not null), year (text, not null), highlight (text, not null),          │
│                   │ created_at (timestamp, default now(), not null)                        │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ devops_projects   │ id (integer, PK, identity), title (text, nullable), category (text,    │
│                   │ nullable), description (text, nullable), image_url (text, nullable),   │
│                   │ ppt_url (text, nullable), github_url (text, nullable),                 │
│                   │ technologies (text, nullable), highlights (text, nullable),            │
│                   │ status (text, nullable)                                                │
└───────────────────┴────────────────────────────────────────────────────────────────────────┘
```

### Application-Level Aliases
In `src/db/schema.pg.ts`, semantic aliases are exported to maintain backwards compatibility without altering physical database table names:
- `academy = academyPosts`
- `devops = devopsProjects`
- `timeline = timelinePosts`
- `atlas = atlasPosts`
- `destinations = atlasPosts`
- `projects = devopsProjects`
- `academyTopics = academyPosts`
- `timelineEvents = timelinePosts`

### Relationships
- **Entity Relationships:** No explicit foreign key (`foreignKey` or `references`) relationships are declared in `src/db/schema.pg.ts` or `0000_bouncy_prowler.sql`. The seven tables operate as independent domain collections.

### Migrations
- **PostgreSQL Migrations Folder:** `drizzle/migrations-pg/`
- **Active Migration SQL:** `drizzle/migrations-pg/0000_bouncy_prowler.sql` (defines the 7 tables with `PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY`).
- **Migration Scripts:**
  - `scripts/migrate-d1-to-neon.mjs`: Reads an exported SQLite dump (`d1-export.sql`), inserts all rows with original IDs into Neon, and resets sequence counters via `SELECT setval(pg_get_serial_sequence(table, 'id'), max_id, true)`.

---

## 5. API Architecture

All endpoints are hosted as Cloudflare Pages Functions under `functions/api/`.

### Middleware Security Guard (`functions/api/_middleware.ts`)
- **Scope:** Intercepts every incoming request under `/api/*`.
- **Public Routes:** Allows `GET`, `HEAD`, `OPTIONS`, and all paths beginning with `/api/auth/` without authentication.
- **Protected Methods:** Requests using `POST`, `PUT`, `DELETE`, or `PATCH` to data endpoints require a valid administrative session token (`sv_admin_session` cookie).
- **Unauthorized Handling:** Returns HTTP 401 with JSON `{ authenticated: false, error: "Unauthorized: Valid admin session required." }`.

### Verified API Endpoints

#### 1. Authentication Endpoints
- **`POST /api/auth/login`** (`functions/api/auth/login.ts`)
  - **Purpose:** Authenticates the administrator and issues a session cookie.
  - **Body:** `{ password: string }`
  - **Verification:** Constant-time comparison against `ADMIN_PASSWORD_HASH` (PBKDF2) or plaintext `ADMIN_PASSWORD`.
  - **Response:** HTTP 200 `{ authenticated: true }` with `Set-Cookie: sv_admin_session=<hmac_token>; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`.
- **`GET /api/auth/session`** (`functions/api/auth/session.ts`)
  - **Purpose:** Verifies current admin session cookie validity.
  - **Response:** HTTP 200 `{ authenticated: boolean, requiresSetup: boolean }`.
- **`POST /api/auth/logout`** (`functions/api/auth/logout.ts`)
  - **Purpose:** Invalidates the admin session cookie.
  - **Response:** HTTP 200 `{ authenticated: false }` with `Set-Cookie: sv_admin_session=; Max-Age=0`.

#### 2. Movies Endpoints
- **`GET /api/movies`** (`functions/api/movies/index.ts`)
  - **Database Table:** `movies`
  - **Sorting:** `ORDER BY id DESC`
  - **Response:** HTTP 200 `{ data: [{ id, title, genre, rating, trailer_url, movie_url }] }`.
- **`POST /api/movies`** (`functions/api/movies/index.ts`) [Auth Required]
  - **Body:** `{ title: string, genre?: string, rating?: number, trailer_url?: string, movie_url?: string }`
  - **Response:** HTTP 201 `{ success: true, message: string, data: Movie }`.
- **`PUT /api/movies/:id`** (`functions/api/movies/[id].ts`) [Auth Required]
  - **Database Table:** `movies`
  - **Body:** Partial fields (`title`, `genre`, `rating`, `trailer_url`, `movie_url`).
  - **Response:** HTTP 200 `{ success: true, message: string, data: Movie }`.
- **`DELETE /api/movies/:id`** (`functions/api/movies/[id].ts`) [Auth Required]
  - **Database Table:** `movies`
  - **Response:** HTTP 200 `{ success: true, message: string, deletedCount: number }`.

#### 3. DevOps Projects Endpoints
- **`GET /api/devops`** (`functions/api/devops/index.ts`)
  - **Database Table:** `devops_projects` (via alias `devops`)
  - **Sorting:** `ORDER BY id DESC`
  - **Transformation:** Maps Drizzle columns (`imageUrl`, `pptUrl`, `githubUrl`) to snake_case API fields (`image_url`, `ppt_url`, `github_url`).
  - **Response:** HTTP 200 `{ data: [{ id, title, category, description, image_url, ppt_url, github_url, technologies, highlights, status }] }`.
- **`POST /api/devops`** (`functions/api/devops/index.ts`) [Auth Required]
  - **Body:** `{ title, category, description, image_url, ppt_url, github_url, technologies, highlights, status }`
  - **Response:** HTTP 201 `{ success: true, message: string, data: DevOpsProject }`.
- **`PUT /api/devops/:id`** (`functions/api/devops/[id].ts`) [Auth Required]
  - **Database Table:** `devops_projects`
  - **Response:** HTTP 200 `{ success: true, message: string, data: DevOpsProject }`.
- **`DELETE /api/devops/:id`** (`functions/api/devops/[id].ts`) [Auth Required]
  - **Database Table:** `devops_projects`
  - **Response:** HTTP 200 `{ success: true, message: string, deletedCount: number }`.

#### 4. Timeline Endpoints
- **`GET /api/timeline`** (`functions/api/timeline/index.ts`)
  - **Database Table:** `timeline_posts` (via alias `timeline`)
  - **Sorting:** `ORDER BY id DESC`
  - **Response:** HTTP 200 `{ data: [{ id, title, category, description, created_at }] }`.
- **`POST /api/timeline`** (`functions/api/timeline/index.ts`) [Auth Required]
  - **Body:** `{ title, category, description, created_at? }`
  - **Response:** HTTP 201 `{ success: true, message: string, data: TimelinePost }`.
- **`PUT /api/timeline/:id`** (`functions/api/timeline/[id].ts`) [Auth Required]
  - **Database Table:** `timeline_posts`
  - **Response:** HTTP 200 `{ success: true, message: string, data: TimelinePost }`.
- **`DELETE /api/timeline/:id`** (`functions/api/timeline/[id].ts`) [Auth Required]
  - **Database Table:** `timeline_posts`
  - **Response:** HTTP 200 `{ success: true, message: string, deletedCount: number }`.

#### 5. Atlas Endpoints
- **`GET /api/atlas`** (`functions/api/atlas/index.ts`)
  - **Database Table:** `atlas_posts` (via alias `atlas`)
  - **Sorting:** `ORDER BY id DESC`
  - **Response:** HTTP 200 `{ data: [{ id, country, status, year, highlight, created_at }] }`.
- **`POST /api/atlas`** (`functions/api/atlas/index.ts`) [Auth Required]
  - **Body:** `{ country, status, year, highlight, created_at? }`
  - **Response:** HTTP 201 `{ success: true, message: string, data: AtlasPost }`.
- **`PUT /api/atlas/:id`** (`functions/api/atlas/[id].ts`) [Auth Required]
  - **Database Table:** `atlas_posts`
  - **Response:** HTTP 200 `{ success: true, message: string, data: AtlasPost }`.
- **`DELETE /api/atlas/:id`** (`functions/api/atlas/[id].ts`) [Auth Required]
  - **Database Table:** `atlas_posts`
  - **Response:** HTTP 200 `{ success: true, message: string, deletedCount: number }`.

#### 6. Academy Endpoints
- **`GET /api/academy`** (`functions/api/academy/index.ts`)
  - **Database Table:** `academy_posts` (via alias `academy`)
  - **Sorting:** `ORDER BY id ASC`
  - **Response:** HTTP 200 `{ data: [{ id, skill, category, level }] }`.
- **`POST /api/academy`** (`functions/api/academy/index.ts`) [Auth Required]
  - **Body:** `{ skill, category, level }`
  - **Response:** HTTP 201 `{ success: true, message: string, data: AcademyPost }`.
- **`PUT /api/academy/:id`** (`functions/api/academy/[id].ts`) [Auth Required]
  - **Database Table:** `academy_posts`
  - **Response:** HTTP 200 `{ success: true, message: string, data: AcademyPost }`.
- **`DELETE /api/academy/:id`** (`functions/api/academy/[id].ts`) [Auth Required]
  - **Database Table:** `academy_posts`
  - **Response:** HTTP 200 `{ success: true, message: string, deletedCount: number }`.

---

## 6. End-to-End Data Flow

```
┌──────────────┐      ┌────────────────────┐      ┌────────────────────────┐      ┌───────────────────────┐
│ Database     │ ───► │ Pages Functions    │ ───► │ Frontend API Client    │ ───► │ Page / Component      │
└──────────────┘      └────────────────────┘      └────────────────────────┘      └───────────────────────┘
 movies               /api/movies                 fetchApi<Movie>()               CinemaPage.tsx
                                                  (src/lib/api.ts)                DashboardPage.tsx
                                                                                  AdminPage.tsx

 devops_projects      /api/devops                 loadUnifiedProjects()           ProjectsPage.tsx
                                                  fetchApi<DevOpsProject>()       DevOpsPage.tsx
                                                  (src/lib/api.ts)                DashboardPage.tsx
                                                                                  AdminPage.tsx

 timeline_posts       /api/timeline               fetchApi<TimelinePost>()        TimelinePage.tsx
                                                  (src/lib/api.ts)                DashboardPage.tsx
                                                                                  AdminPage.tsx

 atlas_posts          /api/atlas                  fetchApi<AtlasPost>()           MissionWorldMap.tsx
                                                  (src/lib/api.ts)                (lib/api.ts fallback)

 academy_posts        /api/academy                fetchApi<AcademyPost>()         src/lib/api.ts
                                                  (src/lib/api.ts)                (lib/api.ts fallback)

 travel_posts         [NO API ROUTE]              NOT VERIFIED IN CLIENT          NOT CONNECTED
 (D1 migration table) (No /api/travel route)      (Schema exists only)
```

---

## 7. Media & Asset Architecture

SohailVerse handles media through strict tier separation:

1. **Directly in PostgreSQL:** Text strings, numbers, status codes, and timestamps. **No binary blobs or files are stored in PostgreSQL.**
2. **Metadata / URLs in PostgreSQL:**
   - `movies.trailer_url`: Remote external streaming URLs (e.g., YouTube video links).
   - `devops_projects.image_url`: Relative URLs (e.g. `/dev-real-1779487.jpg`) or external image URLs.
   - `devops_projects.ppt_url`: Presentation and architecture deck links.
   - `devops_projects.github_url`: Source code repository URLs (e.g., `https://github.com/sohail-24`).
3. **Static Assets in `public/`:**
   - Cinema backdrops: `public/movies/*.jpg` (`sanam-teri-kasam.jpg`, `kgf-chapter-1.jpg`, etc.)
   - Cinema UI visuals: `public/cinema/hero-projector.jpg`, `public/cinema/featured-favorite.jpg`
   - Temporary project mocks: `public/projects/temporary/*.jpg`
   - Three.js globe textures: `public/earth-texture-2048.jpg`, `public/earth-clouds-1024.png`
   - High-res developer photography: `public/dev-real-*.jpg`, `public/real-dev-*.jpg`
   - Career CV: `public/resume.pdf`
4. **External Hosted Resources:** YouTube video players embedded inside the Cinema trailer modal; external GitHub repositories.

---

## 8. Environment & Secrets

Environment variables verified through code inspection:

| Variable Name | Role | Secret? | Code References |
|---|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL pooled connection string | **YES** | `src/db/index.ts`, `drizzle.config.ts`, `scripts/migrate-d1-to-neon.mjs`, `functions/api/*`, `vite.config.ts` |
| `ADMIN_PASSWORD_HASH` | PBKDF2 salt and hash (`pbkdf2:600000:salt:hash`) | **YES** | `functions/api/auth/_utils.ts`, `.dev.vars.example`, `scripts/generate-password-hash.js` |
| `ADMIN_PASSWORD` | Fallback plaintext admin password | **YES** | `.env.example`, `functions/api/auth/_utils.ts`, `vite.config.ts` |
| `SESSION_SECRET` | 32-byte secret key for HMAC-SHA256 session signatures | **YES** | `functions/api/auth/_utils.ts`, `.dev.vars.example`, `.env.example`, `vite.config.ts` |
| `GEMINI_API_KEY` | Google Gemini API key for server-side generative AI | **YES** | `.env.example`, `package.json` (`@google/genai`) |

*Security invariant: No secret values or credentials are committed to the repository.*

---

## 9. Deployment Architecture

- **Platform:** Cloudflare Pages with Pages Functions.
- **Build Command:** `npm run build` (`tsc -b && vite build`) producing static files in `dist/`.
- **Output Directory:** `dist/`.
- **Edge API:** Automatically detected by Cloudflare Pages from the root `functions/` directory.
- **Serverless Secrets:** Configured in Cloudflare Pages Dashboard under Settings > Environment Variables > Production/Preview (`DATABASE_URL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`).
- **Dedicated Cloudflare Config Files:** `wrangler.toml`, `wrangler.json`, `wrangler.jsonc`, and `_routes.json` are **NOT PRESENT IN REPOSITORY** (Cloudflare Pages conventions are relied upon).

---

## 10. Legacy / Migration Architecture

### Migration State: Cloudflare D1 → Neon PostgreSQL

- **CURRENT RUNTIME (Active):**
  - Schema: `src/db/schema.pg.ts` (7 physical PostgreSQL tables using `pgTable`).
  - Connection Adapter: `src/db/index.ts` connecting via `@neondatabase/serverless` and `drizzle-orm/neon-http`.
  - API Routes: `functions/api/*` querying PostgreSQL tables.
- **LEGACY / ROLLBACK MATERIAL:**
  - `src/db/schema.ts`: SQLite / Cloudflare D1 schema (5 tables: `movies`, `academy`, `devops`, `timeline`, `atlas`). Retained for reference and rollback safety.
- **MIGRATION ARTIFACTS:**
  - `drizzle/migrations-pg/0000_bouncy_prowler.sql`: PostgreSQL initial migration file creating the 7 physical tables.
  - `scripts/migrate-d1-to-neon.mjs`: Row-by-row data transfer script from SQLite memory to Neon.
  - `d1-export.sql`: **NOT PRESENT IN REPOSITORY** (referenced in `scripts/migrate-d1-to-neon.mjs`, must be extracted from D1 prior to executing migration).

---

## Documentation Evidence

The architectural facts in this document were verified from:
- `package.json`
- `drizzle.config.ts`
- `metadata.json`
- `.dev.vars.example`
- `.env.example`
- `vite.config.ts`
- `src/db/schema.pg.ts`
- `src/db/schema.ts`
- `src/db/index.ts`
- `src/lib/api.ts`
- `src/app/routes.tsx`
- `src/app/router.tsx`
- `src/pages/AdminPage.tsx`
- `src/pages/CinemaPage.tsx`
- `src/pages/DevOpsPage.tsx`
- `src/pages/ProjectsPage.tsx`
- `src/pages/ProjectDetailPage.tsx`
- `src/pages/TimelinePage.tsx`
- `src/pages/DashboardPage.tsx`
- `src/pages/MissionControlPage.tsx`
- `functions/api/_middleware.ts`
- `functions/api/auth/_utils.ts`
- `functions/api/auth/login.ts`
- `functions/api/auth/logout.ts`
- `functions/api/auth/session.ts`
- `functions/api/movies/index.ts`
- `functions/api/movies/[id].ts`
- `functions/api/devops/index.ts`
- `functions/api/devops/[id].ts`
- `functions/api/timeline/index.ts`
- `functions/api/timeline/[id].ts`
- `functions/api/atlas/index.ts`
- `functions/api/atlas/[id].ts`
- `functions/api/academy/index.ts`
- `functions/api/academy/[id].ts`
- `scripts/migrate-d1-to-neon.mjs`
- `scripts/generate-password-hash.js`
- `scripts/generate-project-placeholders.cjs`
- `scripts/generate-space-background.mjs`
- `drizzle/migrations-pg/0000_bouncy_prowler.sql`
