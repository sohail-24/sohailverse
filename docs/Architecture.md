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

The repository defines exactly seven physical PostgreSQL tables in `src/db/schema.pg.ts` and `drizzle/migrations-pg/`:

```
┌───────────────────┬────────────────────────────────────────────────────────────────────────┐
│ Physical Table    │ Column Definitions (PostgreSQL Dialect)                                │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ movies            │ id (integer, PK, identity), title (text, not null), genre (text,       │
│                   │ not null), rating (real, not null), trailer_url (text, nullable),       │
│                   │ poster_url (text, nullable), synopsis (text, nullable),                │
│                   │ is_featured (boolean, default false, not null)                         │
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
│                   │ default now(), not null), year (text, nullable),                       │
│                   │ event_date (text, nullable)                                            │
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
- **Entity Relationships:** No explicit foreign key (`foreignKey` or `references`) relationships are declared in `src/db/schema.pg.ts` or migration SQL files. The seven tables operate as independent domain collections.

### Migrations
- **PostgreSQL Migrations Folder:** `drizzle/migrations-pg/`
- **Active Migration History:**
  1. `0000_bouncy_prowler.sql`: Defines the initial 7 physical tables with `PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY`.
  2. `0001_breezy_plazm.sql`: Expands `movies` with `poster_url` (text), `synopsis` (text), and `is_featured` (boolean, default false, not null).
  3. `0002_dapper_timeline_events.sql`: Expands `timeline_posts` with `year` (text) and `event_date` (text) to support chronological milestone restoration and sorting.
- **Migration Scripts:**
  - `scripts/migrate-d1-to-neon.mjs`: Reads an exported SQLite dump (`d1-export.sql`), inserts rows with original IDs into Neon, and resets sequence counters via `SELECT setval(pg_get_serial_sequence(table, 'id'), max_id, true)`.

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
  - **Response:** HTTP 200 `{ data: [{ id, title, genre, rating, trailer_url, poster_url, synopsis, is_featured, movie_url }] }`.
- **`POST /api/movies`** (`functions/api/movies/index.ts`) [Auth Required]
  - **Body:** `{ title: string, genre?: string, rating?: number, trailer_url?: string, poster_url?: string, synopsis?: string, is_featured?: boolean, movie_url?: string }`
  - **Response:** HTTP 201 `{ success: true, message: string, data: Movie }`.
- **`PUT /api/movies/:id`** (`functions/api/movies/[id].ts`) [Auth Required]
  - **Database Table:** `movies`
  - **Body:** Partial fields (`title`, `genre`, `rating`, `trailer_url`, `poster_url`, `synopsis`, `is_featured`, `movie_url`).
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
  - **Sorting:** `ORDER BY year ASC, event_date ASC, id ASC` (chronological order from earliest to latest milestone)
  - **Response:** HTTP 200 `{ data: [{ id, title, category, description, created_at, year, event_date }] }`.
- **`POST /api/timeline`** (`functions/api/timeline/index.ts`) [Auth Required]
  - **Body:** `{ title: string, category?: string, description?: string, year?: string, event_date?: string, created_at?: string }`
  - **Response:** HTTP 201 `{ success: true, message: string, data: TimelinePost }`.
- **`PUT /api/timeline/:id`** (`functions/api/timeline/[id].ts`) [Auth Required]
  - **Database Table:** `timeline_posts`
  - **Body:** Partial fields (`title`, `category`, `description`, `year`, `event_date`, `created_at`).
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
                      (Neon: 9 movies)            (Strict: No Fallback)           DashboardPage.tsx
                                                                                  AdminPage.tsx

 timeline_posts       /api/timeline               fetchApi<TimelinePost>()        TimelinePage.tsx
                      (Neon: 5 milestones)        (Strict: No Fallback)           DashboardPage.tsx
                                                                                  AdminPage.tsx

 devops_projects      /api/devops                 loadUnifiedProjects()           ProjectsPage.tsx
                      (Neon: 3 projects)          fetchApi<DevOpsProject>()       DevOpsPage.tsx
                                                  (Bundled Fallback Available)    DashboardPage.tsx
                                                                                  AdminPage.tsx

 atlas_posts          /api/atlas                  fetchApi<AtlasPost>()           MissionWorldMap.tsx
                      (Neon: 4 destinations)      (Bundled Fallback Available)    (No dedicated page route)

 academy_posts        /api/academy                fetchApi<AcademyPost>()         src/lib/api.ts
                      (Neon: 6 skills)            (Bundled Fallback Available)    (No dedicated page route)

 travel_posts         [NO API ROUTE]              NOT VERIFIED IN CLIENT          NOT CONNECTED
 (D1 migration table) (No /api/travel route)      (Schema exists only)            (5 rows in Neon)
```

### Data Flow Policies
1. **Cinema Zero-Fallback Policy:** `fetchApi('/api/movies')` has zero client-side mock fallback. If the Neon database or `/api/movies` endpoint fails, an error is immediately thrown, triggering the `ErrorState` UI on `CinemaPage.tsx` with a manual retry button.
2. **Timeline Zero-Fallback Policy:** `fetchApi('/api/timeline')` has zero client-side mock fallback. If the database or endpoint fails, the error propagates to `TimelinePage.tsx`, displaying an `ErrorState` UI with retry capabilities.
3. **Resilient Domain Fallbacks:** Domain endpoints `/api/devops`, `/api/atlas`, and `/api/academy` maintain local JSON fallbacks in `src/lib/api.ts` to guarantee baseline rendering during local offline development or network degradation.

---

## 7. Media & Asset Architecture

SohailVerse enforces strict tier separation to ensure high performance and clear ownership:

1. **Single Source of Truth for Structured Data:**
   - **Neon Serverless PostgreSQL:** Holds all structured records, relational fields, status flags, timestamps, and external resource URLs.
   - **No Binary Storage in Database:** Images, audio, video files, and binary blobs are strictly prohibited from PostgreSQL.
2. **Metadata & External Destination URLs:**
   - `movies.poster_url`: Relative path to movie poster image (e.g., `/movies/interstellar.jpg`) or external artwork URL.
   - `movies.trailer_url`: Remote trailer embed link (e.g., YouTube URL) or streaming destination link.
   - `movies.synopsis`: Full narrative plot summary stored directly as structured text.
   - `movies.is_featured`: Boolean flag designating the primary highlight movie in the Cinema observatory.
   - `devops_projects.image_url`: Relative screenshot path or external image URL.
   - `devops_projects.ppt_url`: Remote presentation deck URL.
   - `devops_projects.github_url`: Remote repository link.
3. **Local Static Assets (`public/`):**
   - High-resolution movie backdrops and posters: `public/movies/*.jpg` (`interstellar.jpg`, `inception.jpg`, `oppenheimer.jpg`, `dune-part-two.jpg`, `the-dark-knight.jpg`, `gladiator.jpg`, `blade-runner-2049.jpg`, `the-matrix.jpg`, `arrival.jpg`).
   - Cinema UI visuals: `public/cinema/hero-projector.jpg`, `public/cinema/featured-favorite.jpg`.
   - Developer photography: `public/dev-real-*.jpg`, `public/real-dev-*.jpg`.
   - Three.js globe textures: `public/earth-texture-2048.jpg`, `public/earth-clouds-1024.png`.
   - Career CV: `public/resume.pdf`.
4. **Streaming & External Media Services:**
   - **JioCloud Video Streams:** Full-length movie streaming URLs preserved in `trailer_url` / `movie_url` records route users directly to verified external cloud streaming destinations.
   - **YouTube Video Embeds:** Embedded video player modal supports trailer previewing.

---

## 8. Cinema Architecture (Verified Phases 3.1 – 3.3B)

The Cinema Observatory domain has completed a full end-to-end migration from hardcoded assets to a Neon-backed architecture:

### 1. Schema Expansion (Phase 3.1 — COMPLETED)
- Defined in `src/db/schema.pg.ts` and migration `drizzle/migrations-pg/0001_breezy_plazm.sql`.
- Added columns:
  - `poster_url` (`text`): Path to movie poster visual.
  - `synopsis` (`text`): Comprehensive cinematic plot description.
  - `is_featured` (`boolean`, default `false`, not null): Flag identifying featured showcase movies.

### 2. API & Data Access Layer (Phase 3.2 — COMPLETED)
- Handlers: `functions/api/movies/index.ts` and `functions/api/movies/[id].ts`.
- `GET /api/movies`: Queries Neon via Drizzle ORM, returns all 8 movie fields ordered by `id DESC`.
- `POST /api/movies` & `PUT /api/movies/:id`: Accept and validate expanded fields (`poster_url`, `synopsis`, `is_featured`, `trailer_url`).
- Protected by `_middleware.ts` administrative authentication.

### 3. Database Content Backfill (Phase 3.3A — COMPLETED)
- Exactly 9 curated movie records verified in Neon `movies` table:
  1. *Interstellar* (Sci-Fi, 9.5, Featured, JioCloud / YouTube trailer)
  2. *Inception* (Sci-Fi / Thriller, 9.3)
  3. *Oppenheimer* (Biography / Drama, 9.2)
  4. *Dune: Part Two* (Sci-Fi / Adventure, 9.0)
  5. *The Dark Knight* (Action / Crime, 9.4)
  6. *Gladiator* (Action / Drama, 8.9)
  7. *Blade Runner 2049* (Sci-Fi / Neo-Noir, 8.8)
  8. *The Matrix* (Sci-Fi / Action, 9.1)
  9. *Arrival* (Sci-Fi / Drama, 8.7)
- JioCloud streaming destination URLs and YouTube trailer links are verified in database records.

### 4. Frontend Neon Wiring (Phase 3.3B — COMPLETED)
- `CinemaPage.tsx`: Fetches from `/api/movies` with zero fallback data.
- `CinemaFeaturedMovie.tsx`: Evaluates `is_featured` (or highest rating fallback) and renders synopsis, poster, rating, and watch modal.
- `CinemaMovieCarousel.tsx`: Displays interactive cards with poster images, genres, ratings, and modal triggers.
- `CinemaHero.tsx`: Renders observatory statistics derived directly from live database records.

---

## 9. Timeline Architecture (Restoration & Reconciliation Verified State)

The timeline milestone domain reflects a verified restoration connecting life chapters, education, career shifts, and cloud accomplishments:

### 1. Schema Expansion & Date Semantics
- Defined in `src/db/schema.pg.ts` and migration `drizzle/migrations-pg/0002_dapper_timeline_events.sql`.
- Added columns:
  - `year` (`text`): Historical calendar year of milestone occurrence (e.g., `"2023"`, `"2024"`, `"2025"`, `"2026"`).
  - `event_date` (`text`): Specific ISO date string (`YYYY-MM-DD`) representing milestone date.
- **Date Semantics Distinction:**
  - `created_at` (`timestamp`): Database record creation time (technical metadata).
  - `year` (`text`): Timeline display and sorting anchor representing historical milestone year.
  - `event_date` (`text`): Calendar date of historical occurrence.

### 2. API Sorting Logic
- In `functions/api/timeline/index.ts` and dev proxy:
  - Sorting: `ORDER BY year ASC, event_date ASC, id ASC`.
  - Ensures accurate chronological progression from earliest milestone (2023) to latest (2026).

### 3. Timeline Content Reconciliation (MANDATORY CURRENT STATE)
The Neon database `timeline_posts` table currently contains **exactly 5 records**:

| ID | Year | Event Date | Created At | Title | Category | Description | Origin / Classification |
|---|---|---|---|---|---|---|---|
| **4** | 2023 | `2023-06-20` | `2023-06-20T00:00:00Z` | Completed Engineering Degree | Education | Graduated with an Engineering degree, establishing a comprehensive foundation in algorithms and computer systems. | Verified Historical Milestone |
| **5** | 2024 | `2024-03-10` | `2024-03-10T00:00:00Z` | Saudi Arabia Journey & AWS / DevOps Genesis | Exploration & Learning | Traveled to Saudi Arabia and initiated deep-dive mastery into AWS Cloud and DevOps architecture. | Verified Historical Milestone |
| **2** | 2025 | `2025-12-20` | `2026-06-16T12:28:54Z` | Internship at Visys Company | Career & Systems | Hands-on engineering internship contributing to cloud automation, business systems, and production pipelines. | Verified Historical Milestone (Retained from D1 id:2) |
| **6** | 2026 | `2026-01-15` | `2026-01-15T00:00:00Z` | Built & Deployed Sohail-Shop | Systems & Cloud | Engineered scalable e-commerce infrastructure with multi-vendor support, Docker containers, and Kubernetes deployment. | Verified Historical Milestone ("Built & Deployed Sohail-Shop") |
| **1** | 2026 | `2026-06-16` | `2026-06-16T11:59:45Z` | Timeline CMS Created | Platform | Built a dynamic timeline powered by Cloudflare Workers and D1 Database | System / CMS Milestone (Original D1 seed record #1) |

#### Explicit Content Discrepancy Findings:
- **Missing Milestone:** The historical milestone `"Building & Creating"` (which appeared in early static About/Journey designs as an ongoing chapter) is **NOT present** in the Neon database.
- **System Milestone Present:** Record #1 (`"Timeline CMS Created"`) is a technical CMS artifact rather than a biographical life milestone, but is active in the public timeline.
- **Title Variation:** Record #6 is titled `"Built & Deployed Sohail-Shop"` rather than `"Built & Deployed Sohail-Shop / Live B2B Fruit Wholesale Platform"`.
- *Status:* In accordance with documentation-only constraints, these differences are documented without modifying database records.

### 4. Frontend Timeline Rendering
- `TimelinePage.tsx`: Fetches `/api/timeline` with zero fallback data; handles loading and error states.
- `AboutJourneyTimeline.tsx`:
  - Sorts milestones chronologically: `year ASC`, `event_date ASC`, `id ASC`.
  - Computes dynamic header chronology: `"Chronology · 2023 — 2026"`.
  - Color-coded vertical spine rail with responsive node glow and milestone icons.
  - Special highlight badge for Sohail-Shop: `"REAL USERS & LIVE ARCHITECTURE"`.
  - Continuing role badge for Visys: `"ACTIVE CLOUD ROLE"`.

### 5. Admin Integration
- `AdminPage.tsx`: Includes input fields for `Event Title`, `Category`, `Year (e.g. 2024)`, `Event Date (e.g. 2024-03-10)`, and `Description`.
- Timeline Library list displays event ID, title, year badge, event date badge, category, and delete button.

---

## 10. Admin & Authentication Architecture

- **Session Protocol:** Cookie-based session management using `sv_admin_session`.
- **Crypto Implementation:** Web Crypto API (`crypto.subtle`) supporting constant-time PBKDF2 verification (600,000 iterations with SHA-256) and HMAC-SHA256 session signatures.
- **Middleware Guard:** `functions/api/_middleware.ts` intercepts all mutating HTTP verbs (`POST`, `PUT`, `DELETE`, `PATCH`), rejecting unauthenticated calls with HTTP 401.
- **Supported Entity Managers:**
  - Movies Manager: CRUD for cinema records with trailer URLs.
  - DevOps Project Manager: CRUD for portfolio architecture records.
  - Timeline Manager: CRUD for milestones including year and event date fields.
  - *(Academy and Atlas forms are deferred and not yet mounted in Admin UI).*

---

## 11. Environment & Secrets

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

## 12. Deployment Architecture

- **Platform:** Cloudflare Pages with Pages Functions.
- **Build Command:** `npm run build` (`tsc -b && vite build`) producing static files in `dist/`.
- **Output Directory:** `dist/`.
- **Edge API:** Automatically detected by Cloudflare Pages from the root `functions/` directory.
- **Serverless Secrets:** Configured in Cloudflare Pages Dashboard under Settings > Environment Variables > Production/Preview (`DATABASE_URL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`).
- **Dedicated Cloudflare Config Files:** `wrangler.toml`, `wrangler.json`, `wrangler.jsonc`, and `_routes.json` are **NOT PRESENT IN REPOSITORY** (Cloudflare Pages conventions are relied upon).

---

## 13. Legacy / Migration Architecture

### Migration State: Cloudflare D1 → Neon PostgreSQL

- **CURRENT RUNTIME (Active):**
  - Schema: `src/db/schema.pg.ts` (7 physical PostgreSQL tables using `pgTable`).
  - Connection Adapter: `src/db/index.ts` connecting via `@neondatabase/serverless` and `drizzle-orm/neon-http`.
  - API Routes: `functions/api/*` querying PostgreSQL tables.
- **LEGACY / ROLLBACK MATERIAL:**
  - `src/db/schema.ts`: SQLite / Cloudflare D1 schema (5 tables: `movies`, `academy`, `devops`, `timeline`, `atlas`). Retained for reference and rollback safety.
- **MIGRATION ARTIFACTS:**
  - `drizzle/migrations-pg/0000_bouncy_prowler.sql`: PostgreSQL initial migration file creating the 7 physical tables.
  - `drizzle/migrations-pg/0001_breezy_plazm.sql`: PostgreSQL Cinema expansion migration (`poster_url`, `synopsis`, `is_featured`).
  - `drizzle/migrations-pg/0002_dapper_timeline_events.sql`: PostgreSQL Timeline expansion migration (`year`, `event_date`).
  - `scripts/migrate-d1-to-neon.mjs`: Row-by-row data transfer script from SQLite memory to Neon.
  - `d1-export.sql`: **NOT PRESENT IN REPOSITORY** (referenced in `scripts/migrate-d1-to-neon.mjs`, must be extracted from D1 prior to executing migration).

---

## 14. Current Implementation & Migration Status Matrix

```
┌──────────────────────────────────────────────────┬──────────────────────┬────────────────────────────────────────────────────────┐
│ Domain / Feature                                 │ Verified Status      │ Implementation Evidence & Notes                        │
├──────────────────────────────────────────────────┼──────────────────────┼────────────────────────────────────────────────────────┤
│ PostgreSQL Baseline Schema                       │ COMPLETED            │ src/db/schema.pg.ts (7 tables)                         │
│ Neon HTTP Database Adapter                       │ COMPLETED            │ src/db/index.ts (drizzle-orm/neon-http + neon)         │
│ Cinema Schema Expansion (3.1)                    │ COMPLETED            │ 0001_breezy_plazm.sql (poster_url, synopsis, featured) │
│ Cinema API & Data Access (3.2)                   │ COMPLETED            │ functions/api/movies/* (supports all 8 fields)         │
│ Cinema Content Backfill (3.3A)                   │ COMPLETED            │ 9 movies verified in Neon with JioCloud/YouTube links  │
│ Cinema Frontend Neon Wiring (3.3B)               │ COMPLETED            │ CinemaPage.tsx, FeaturedMovie, Carousel (zero fallback)│
│ Timeline Schema Expansion (Phase 4)              │ COMPLETED            │ 0002_dapper_timeline_events.sql (year, event_date)     │
│ Timeline API Chronological Sorting               │ COMPLETED            │ functions/api/timeline/* (year ASC, event_date ASC)    │
│ Timeline Milestone Restoration                   │ COMPLETED            │ 5 records verified in Neon (IDs 4, 5, 2, 6, 1)         │
│ Timeline Frontend Neon Wiring                    │ COMPLETED            │ TimelinePage.tsx, AboutJourneyTimeline (zero fallback) │
│ Admin Timeline CRUD Controls                     │ COMPLETED            │ AdminPage.tsx (year, event_date inputs & badges)       │
│ Admin Authentication (PBKDF2 + HMAC)             │ COMPLETED            │ functions/api/auth/* & functions/api/_middleware.ts    │
│ DevOps Projects Database API                     │ COMPLETED            │ functions/api/devops/* (queries devops_projects)       │
│ Portfolio Page Dynamic Projects                  │ PARTIAL / HYBRID     │ ProjectsPage.tsx merges /api/devops with local dataset │
│ Project Detail Live Data                         │ PENDING              │ ProjectDetailPage.tsx uses hardcoded blueprint modules │
│ Homepage (Mission Control) Live Data             │ PENDING              │ Uses initialProjects from data/mission-control.ts      │
│ Dashboard Metrics Live Data                      │ PARTIAL / HYBRID     │ Fetches movie/devops/timeline counts; stats hardcoded  │
│ Academy & Atlas Dedicated Routes                 │ PENDING              │ APIs exist (/api/academy, /api/atlas); routes unmapped │
│ Travel Posts API Endpoint                        │ DEFERRED             │ Table exists in Neon (5 rows); no /api/travel handler  │
│ Cloudflare D1 Full Deprecation                   │ DEFERRED             │ schema.ts preserved for rollback safety                │
│ Cloudflare Pages Production Deployment           │ PENDING VERIFICATION │ Cloudflare Pages environment secrets verification      │
│ Git Branch Verification                          │ NOT VERIFIABLE       │ No .git metadata present in runtime container          │
└──────────────────────────────────────────────────┴──────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 15. Documentation Evidence

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
- `src/components/cinema/CinemaFeaturedMovie.tsx`
- `src/components/cinema/CinemaMovieCarousel.tsx`
- `src/components/cinema/CinemaHero.tsx`
- `src/pages/DevOpsPage.tsx`
- `src/pages/ProjectsPage.tsx`
- `src/pages/ProjectDetailPage.tsx`
- `src/pages/TimelinePage.tsx`
- `src/components/about/AboutJourneyTimeline.tsx`
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
- `drizzle/migrations-pg/0001_breezy_plazm.sql`
- `drizzle/migrations-pg/0002_dapper_timeline_events.sql`

