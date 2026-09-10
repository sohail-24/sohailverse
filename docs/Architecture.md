# SohailVerse v2.0 — System Architecture

> **Document Type:** Technical System Architecture Specification  
> **Status:** Current Repository State (Verified September 2026)  
> **Standard:** Strict Empirical Codebase Truth (Zero Placeholders / Zero Unverified Assumptions)

---

## 1. System Overview

**SohailVerse v2.0** is an interactive, multidimensional digital platform and cloud engineering portfolio. The platform is architected around independent functional domains:

1. **Mission Control (Home — `/`):** High-impact interactive gateway featuring a 3D Earth globe visualization (`Three.js`), live telemetry strips, personal philosophy, brand avatar identity, world gateways, and the Favourite Projects showcase carousel.
2. **Projects System (`/projects`, `/projects/:id`):** Completely decoupled from DevOps. An independent portfolio and content-management system providing high-level project showcases and deep, standalone **Project Information Pages** (`ProjectInformationPage.tsx`) covering project overviews, video sessions, README/documentation, architecture diagrams, and repository/demo links.
3. **DevOps Laboratory (`/devops`, `/devops/:id`):** An educational cloud-native laboratory structured around **Five Distinct Learning Pillars**:
   - **Pillar 1: Notes** — Runbooks, foundational concepts, and PDF cheatsheets/documentation with inline reader support.
   - **Pillar 2: Networking** — Internet protocols, OSI layers, DNS, subnets, and video sessions masterclass.
   - **Pillar 3: AWS** — Cloud architecture, VPCs, compute, storage, EKS, and video sessions masterclass.
   - **Pillar 4: DevOps** — Containers, Kubernetes orchestration, Terraform IaC, and ArgoCD GitOps pipelines.
   - **Pillar 5: Learn & Test Projects** — Staging systems, hands-on architectural blueprints, and practice labs.
4. **Cinema Observatory (`/cinema`):** Dedicated film appreciation observatory backed strictly by Neon PostgreSQL (`movies` table) with zero client-side fallback data, genre filtering, statistics, and embedded video trailer and streaming playback.
5. **Timeline & Career Journey (`/timeline`, `/about`):** Verified chronological milestone progression spanning academic graduation (2023), AWS & DevOps exploration (2024), engineering internship (2025), and production platform deployments (2026).
6. **Admin Console & CMS (`/admin`, `/console`):** Authenticated administrative control center (`AuthenticatedCMS.tsx`) secured with Web Crypto PBKDF2 verification and HMAC-signed session cookies (`sv_admin_session`). Provides dedicated tabbed managers for Projects (with deep content editing), Cinema, and DevOps (5 pillars with resource editor and media viewers).

---

## 2. High-Level Architecture Diagram

```
                              ┌────────────────────────┐
                              │     Browser Client     │
                              └───────────┬────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  │ (1) HTTP GET static assets                    │ (2) HTTP /api/* requests
                  ▼                                               ▼
      ┌───────────────────────┐                       ┌───────────────────────┐
      │  Cloudflare Pages CDN │                       │ Pages Functions Edge  │
      │  (Compiled dist/)     │                       │ (V8 Worker Runtime)   │
      └───────────────────────┘                       └───────────┬───────────┘
                                                                  │
                                                      ┌───────────▼───────────┐
                                                      │ functions/api/        │
                                                      │ _middleware.ts        │
                                                      │ (Cookie Auth Guard)   │
                                                      └───────────┬───────────┘
                                                                  │
                                      ┌───────────────────────────┴───────────────────────────┐
                                      │                                                       │
                           [GET /api/movies, devops, ...]                       [POST/PUT/DELETE mutations]
                                      │                                                       │
                                      ▼                                                       ▼
                          ┌───────────────────────────┐                       ┌───────────────────────────┐
                          │   Route Handlers          │                       │ Authenticated Handlers    │
                          │   functions/api/*         │                       │ functions/api/*           │
                          └─────────────┬─────────────┘                       └─────────────┬─────────────┘
                                        │                                                   │
                                        └─────────────────────┬─────────────────────────────┘
                                                              │
                                                              ▼
                                                  ┌───────────────────────┐
                                                  │ src/db/index.ts       │
                                                  │ Drizzle ORM + Neon    │
                                                  │ HTTP Serverless       │
                                                  └───────────┬───────────┘
                                                              │
                                                              ▼
                                                  ┌───────────────────────┐
                                                  │ Neon PostgreSQL       │
                                                  │ (Serverless Database) │
                                                  └───────────────────────┘
```

---

## 3. Decoupled Projects Architecture

### 3.1 Fundamental Product Rule
**A PROJECT IS COMPLETELY INDEPENDENT FROM DEVOPS.**

Historically, clicking a project on the Projects page routed users into `/devops`. This connection has been severed:

```
[Legacy Flow — WRONG]
Projects Page  ──►  Click Project  ──►  Opens DevOps Page (/devops)

[Current Flow — IMPLEMENTED]
Projects Page (/projects)  ──►  Select Project  ──►  PROJECT INFORMATION PAGE (/projects/:id)
                                                      ├── Project Hero & Live Links
                                                      ├── Overview & Tech Arsenal
                                                      ├── Video Sessions Masterclass
                                                      ├── README / Documentation & PDFs
                                                      ├── Architecture & System Diagrams
                                                      └── External Repository Links
```

### 3.2 Routing & Component Separation
- **`/projects`:** Managed by `src/pages/ProjectsPage.tsx`. Fetches portfolio items via `loadUnifiedProjects()` (`src/components/projects/projectData.ts`), supporting status filters (`ALL`, `LIVE`, `BUILDING`, `UPCOMING`).
- **`/projects/:id`:** Handled by `src/pages/ProjectInformationPage.tsx`. Resolves either dynamic database IDs (numeric) or canonical slugs (`sohail-shop`, `sohail-studio`, `fresh-flow`, `wedding`, `new-chapter`).
- **`/devops`:** Handled by `src/pages/DevOpsPage.tsx`. Houses the 5-Pillar DevOps Learning Journey.
- **`/devops/:id`:** Handled by `src/pages/ProjectDetailPage.tsx`. Dedicated strictly to DevOps technical blueprints and incident retrospectives.

### 3.3 Project Content Model (`src/lib/projectContent.ts`)
The project content engine provides a typed schema for deep project documentation:

```typescript
export interface FullProjectData {
  id: string;
  numericId?: number;
  title: string;
  category: string;
  description: string;
  tagline?: string;
  status: "Ready" | "Active" | "Upcoming";
  statusLabel: "Ready" | "Active" | "Upcoming";
  technologies: string[];
  hero_image: string;
  content: ProjectContentDetails;
  isDatabaseBacked: boolean;
  githubUrl?: string;
  liveUrl?: string;
}

export interface ProjectContentDetails {
  overview?: string;
  hero_image?: string;
  videos: ProjectVideoSession[];       // id, title, video_url, duration, thumbnail_url, description
  documents: ProjectDocument[];         // id, title, type (pdf|readme|doc|link), url, content
  architecture: ProjectArchitectureDiagram[]; // id, title, image_url, caption, description
  links: ProjectLinkItem[];             // id, title, url, type (github|demo|docs|deploy|other)
  highlightsList?: string[];
}
```

### 3.4 Persistence Strategy
1. **Neon PostgreSQL Storage:** Projects are persisted in the `devops_projects` table. Structured content (videos, documents, diagrams, links, overview) is serialized as JSON in the `highlights` column.
2. **Dual-Hydration Adapter (`fetchProjectDetailsById`):**
   - First queries Neon via `fetchApi<DevOpsProject>('/api/devops')`.
   - If a matching database record exists, parses `highlights` JSON into `ProjectContentDetails`.
   - If no database record exists, falls back to the static curated dossier in `DEFAULT_PROJECT_CONTENTS` to guarantee zero broken routes.
3. **Admin Mutation:** `saveProjectContentToDatabase(dbId, payload)` issues a `PUT /api/devops/:id` request with `{ highlights: JSON.stringify(payload.content), ...fields }`, seamlessly storing rich content without requiring schema alterations.

---

## 4. DevOps 5-Pillar Laboratory Architecture

The DevOps domain (`src/pages/DevOpsPage.tsx` and `src/components/devops/DevOpsLearningJourney.tsx`) is structured around 5 clear, progressive learning pillars:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        THE 5 DEVOPS LEARNING PILLARS                                  │
├──────────────┬─────────────────┬─────────────────┬─────────────────┬───────────────────┤
│ 1. Notes     │ 2. Networking   │ 3. AWS          │ 4. DevOps       │ 5. Learn & Test   │
│ Concepts,    │ Internet, DNS,  │ Cloud Compute,  │ Docker, K8s,    │ Hands-on Staging  │
│ Runbooks,    │ Subnets, Ports  │ VPC, S3, EKS    │ Terraform,      │ Labs & Staging    │
│ PDF Support  │ Video Sessions  │ Video Sessions  │ ArgoCD GitOps   │ Blueprints        │
└──────────────┴─────────────────┴─────────────────┴─────────────────┴───────────────────┘
```

### 4.1 Pillar Content Engine (`src/lib/pillarContent.ts`)
- **Pillar Enum:** `"Notes" | "Networking" | "AWS" | "DevOps" | "Learn & Test Projects"`.
- **Parsing & Detection:** `detectPillar(category, title)` deterministically classifies incoming database records or fallback items into one of the 5 pillars.
- **PillarResource Interface:**
  - `id`: Unique numeric identifier.
  - `title`: Resource headline.
  - `pillar`: Bound learning pillar.
  - `description`: Technical narrative or cheat-sheet runbook.
  - `video_url` & `video_duration`: Embeddable video URL for masterclass lectures.
  - `pdf_url`: Direct URL to downloadable/viewable PDF documentation.
  - `links`: Array of external resources (`github`, `docs`, `slides`, `video`, `demo`).

### 4.2 Interactive Viewers & Modals
- **PDF Viewer Support:** `DevOpsLearningJourney.tsx` inspects database records for `pdf_url` (or falls back to curated static notes) and provides inline PDF reading and downloading.
- **Pillar Video Sessions Player (`DevOpsPillarVideoSessions.tsx` / `DevOpsVideoSessionPlayer.tsx`):**
  - Activated via UI cards or deep-linked URL parameters (`?pillar=networking` or `?pillar=aws`).
  - Provides video playlist switching, progress indicators, takeaway bullet points, and related resource links.
- **Mobile Sticky Navigation (`DevOpsBottomNav.tsx`):** Docked mobile navigation bar enabling direct scrolling to the 5 pillars.

---

## 5. Cinema Observatory Architecture

### 5.1 Architecture & End-to-End Flow
- **Data Source:** Neon PostgreSQL `movies` table exclusively (`GET /api/movies`).
- **Zero-Fallback Policy:** `CinemaPage.tsx` and `fetchApi<Movie>('/api/movies')` maintain **zero mock fallback data**. If the database is unreachable, the UI surfaces an explicit `ErrorState` with a "Try Again" retry trigger.
- **Curated Inventory:** Exactly 9 curated movie records verified in Neon (`Interstellar`, `Inception`, `Oppenheimer`, `Dune: Part Two`, `The Dark Knight`, `Gladiator`, `Blade Runner 2049`, `The Matrix`, `Arrival`).

### 5.2 Presentation Components
- `CinemaHero.tsx`: Computes total films, average rating, and top genre dynamically from live records.
- `CinemaFeaturedMovie.tsx`: Evaluates `is_featured === true` (or falls back to the highest rating) to render the showcase movie with poster art, synopsis, rating, and watch modal triggers.
- `CinemaMovieCarousel.tsx`: Horizontal multi-item card carousel with poster thumbnails, genre badges, ratings, and video trailer modal triggers.
- `CinemaTrailerModal.tsx`: Web-accessible modal player supporting YouTube trailer embeds and direct JioCloud streaming URLs.

---

## 6. Timeline & Career Milestones Architecture

### 6.1 Schema & Date Semantics
- **Database Table:** `timeline_posts` in Neon PostgreSQL.
- **Date Separation:**
  - `created_at` (`timestamp`): Database creation time.
  - `year` (`text`): Primary historical milestone grouping anchor (e.g., `"2023"`, `"2024"`, `"2025"`, `"2026"`).
  - `event_date` (`text`): Specific ISO date (`YYYY-MM-DD`) for secondary ordering.
- **Sorting Logic:** `ORDER BY year ASC, event_date ASC, id ASC` enforced at both the API layer (`functions/api/timeline/index.ts`) and frontend layer (`AboutJourneyTimeline.tsx`).

### 6.2 Verified Database State (5 Records)
1. **ID 4 (2023):** Completed Engineering Degree (Education)
2. **ID 5 (2024):** Saudi Arabia Journey & AWS / DevOps Genesis (Exploration & Learning)
3. **ID 2 (2025):** Internship at Visys Company (Career & Systems)
4. **ID 6 (2026):** Built & Deployed Sohail-Shop (Systems & Cloud)
5. **ID 1 (2026):** Timeline CMS Created (Platform)

---

## 7. Admin Console & CMS Architecture

The administrative control plane is accessed via `/admin` or `/console` (`src/pages/AdminPage.tsx`).

### 7.1 Authentication & Security Guard
1. **PBKDF2 Web Crypto:** `functions/api/auth/login.ts` uses constant-time comparisons against `ADMIN_PASSWORD_HASH` (PBKDF2, 600,000 iterations, SHA-256) or plaintext fallback `ADMIN_PASSWORD`.
2. **Session Cookie:** Sets `sv_admin_session` (`HttpOnly`, `Secure`, `SameSite=Strict`, `Max-Age=604800` / 7 days) signed with `SESSION_SECRET` via HMAC-SHA256.
3. **Mutation Guard (`functions/api/_middleware.ts`):** Intercepts every `POST`, `PUT`, `DELETE`, and `PATCH` request under `/api/*`. Requests lacking a valid session receive `HTTP 401 Unauthorized`.

### 7.2 Authenticated CMS Subsystems (`src/components/admin/AuthenticatedCMS.tsx`)
The authenticated workspace provides three primary operational managers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATED CMS CONSOLE                          │
├──────────────────────┬──────────────────────┬──────────────────────────┤
│ 1. Projects Manager  │ 2. Cinema Manager    │ 3. DevOps Manager        │
│ CRUD + Content Modal │ CRUD + Poster Studio │ 5-Pillar Resource Studio │
└──────────────────────┴──────────────────────┴──────────────────────────┘
```

#### A. Projects Manager (`src/components/admin/ProjectsManager.tsx`)
- **Filtering & Search:** Real-time search across title, description, and technologies. Filters for Category, Status (`Ready`, `Active`, `Upcoming`), and Source (`Database`, `Static`).
- **Core CRUD:** Create new project, edit metadata, delete project with `DeleteConfirmModal`.
- **Deep Content Management (`ProjectContentManagerModal.tsx`):**
  - **Overview Tab:** Edit executive summary, tagline, hero image, status.
  - **Videos Tab:** Add, edit, and reorder video sessions (title, embed URL, duration, thumbnail).
  - **Documents Tab:** Manage technical documentation, runbooks, markdown content, and attached PDF URLs.
  - **Architecture Tab:** Upload/link architecture diagrams with captions.
  - **Links Tab:** Manage repository, demo, documentation, and external links.

#### B. Cinema Manager (`src/components/admin/CinemaManager.tsx`)
- **Poster Studio & Validation:** Live poster thumbnail preview with graceful fallback (`No Poster Available`).
- **Modal Editor:** Add and edit movies with full schema support: Title, Genre, Rating (0.0–10.0), Trailer URL, Poster URL, Synopsis narrative, and `is_featured` showcase toggle.
- **Card Library:** Responsive movie library grid with quick actions (Watch trailer, Edit, Delete).

#### C. DevOps Manager (`src/components/admin/DevOpsManager.tsx`)
- **5-Pillar Segmentation:** Filter by pillar (`Notes`, `Networking`, `AWS`, `DevOps`, `Learn & Test Projects`).
- **Resource Editor Modal (`ResourceEditorModal.tsx`):** Add and edit pillar resources with title, pillar selector, category, notes, image URL, video URL, video duration, PDF document URL, and external links.
- **Integrated Viewers:**
  - `VideoPlayerModal.tsx`: Watch attached masterclass video sessions.
  - `NoteReaderModal.tsx`: Read technical notes and inspect attached PDF URLs.
  - `ImageLightboxModal.tsx`: Zoom and inspect architecture diagrams.

---

## 8. Frontend Routing & Navigation Architecture

Declared in `src/app/routes.tsx` using React Router DOM:

| Route | Component | Purpose | Data Source |
|---|---|---|---|
| `/` | `MissionControlPage.tsx` | Platform home page, 3D Earth, telemetry, gateways | `data/mission-control.ts` |
| `/projects` | `ProjectsPage.tsx` | Decoupled project portfolio with status filters | `loadUnifiedProjects()` (`/api/devops` + static) |
| `/projects/:id` | `ProjectInformationPage.tsx` | Independent deep project dossier (Overview, Videos, Docs, Architecture, Links) | `fetchProjectDetailsById()` (`/api/devops` + content) |
| `/devops` | `DevOpsPage.tsx` | DevOps Laboratory (5 Pillars, Masterclasses, Notes) | `fetchApi('/api/devops')` |
| `/devops/:id` | `ProjectDetailPage.tsx` | Technical blueprint & incident retrospective | `src/components/projects/*` |
| `/cinema` | `CinemaPage.tsx` | Cinema Observatory catalog & player | `fetchApi('/api/movies')` (Zero fallback) |
| `/timeline` | `TimelinePage.tsx` | Chronological career progression | `fetchApi('/api/timeline')` (Zero fallback) |
| `/about` | `TimelinePage.tsx` | Alias for Timeline / Journey | `fetchApi('/api/timeline')` (Zero fallback) |
| `/dashboard` | `DashboardPage.tsx` | Aggregated platform metrics & counts | `/api/movies`, `/api/devops`, `/api/timeline` |
| `/admin` | `AdminPage.tsx` | Authenticated CMS Console | `/api/auth/*` + Domain APIs |
| `/console` | `AdminPage.tsx` | Alias for Admin Console | `/api/auth/*` + Domain APIs |

### Navigation & Brand Components
- **Navbar (`src/components/navigation/Navbar.tsx`):** Sticky navigation bar featuring `BrandAvatar` (profile image with fallback monogram) and active route indicator pills.
- **Mobile Menu (`src/components/navigation/MobileMenu.tsx`):** Accessible mobile drawer.
- **Worlds Gateway (`WorldsGatewaySection.tsx`):** 5 dimension cards routing to `/devops`, `/cinema`, `/timeline`, etc.

---

## 9. Database Architecture & Physical Tables

- **Database Engine:** Neon Serverless PostgreSQL.
- **Connection Transport:** `@neondatabase/serverless` via `drizzle-orm/neon-http`.
- **Drizzle Schema:** `src/db/schema.pg.ts`.
- **Active Migrations (`drizzle/migrations-pg/`):**
  - `0000_bouncy_prowler.sql`: Base tables.
  - `0001_breezy_plazm.sql`: Cinema expansion (`poster_url`, `synopsis`, `is_featured`).
  - `0002_dapper_timeline_events.sql`: Timeline expansion (`year`, `event_date`).

### Physical Tables Specification
```
┌───────────────────┬────────────────────────────────────────────────────────────────────────┐
│ Physical Table    │ Columns (PostgreSQL Dialect)                                           │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ movies            │ id (int, PK, identity), title (text), genre (text), rating (real),      │
│                   │ trailer_url (text), poster_url (text), synopsis (text),                │
│                   │ is_featured (boolean, default false)                                   │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ devops_projects   │ id (int, PK, identity), title (text), category (text),                  │
│                   │ description (text), image_url (text), ppt_url (text),                  │
│                   │ github_url (text), technologies (text), highlights (text),             │
│                   │ status (text)                                                          │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ timeline_posts    │ id (int, PK, identity), title (text), category (text),                  │
│                   │ description (text), year (text), event_date (text),                    │
│                   │ created_at (timestamp, default now())                                  │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ atlas_posts       │ id (int, PK, identity), country (text), status (text), year (text),    │
│                   │ highlight (text), created_at (timestamp, default now())                │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ academy_posts     │ id (int, PK, identity), skill (text), category (text), level (text)    │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ devops_posts      │ id (int, PK, identity), title (text), category (text),                  │
│                   │ description (text), created_at (timestamp, default now())              │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ travel_posts      │ id (int, PK, identity), country (text), city (text), description (text)│
└───────────────────┴────────────────────────────────────────────────────────────────────────┘
```

---

## 10. API Architecture & Contracts

All endpoints run as Cloudflare Pages Functions under `functions/api/`:

| Endpoint | Methods | Auth? | Database Table | Purpose |
|---|---|---|---|---|
| `/api/auth/login` | POST | No | N/A | Authenticates password, sets `sv_admin_session` cookie |
| `/api/auth/session` | GET | No | N/A | Validates session token validity |
| `/api/auth/logout` | POST | No | N/A | Clears session cookie |
| `/api/movies` | GET, POST | POST: Yes | `movies` | List movies (`id DESC`) / Create movie |
| `/api/movies/:id` | PUT, DELETE | Yes | `movies` | Update movie / Delete movie |
| `/api/devops` | GET, POST | POST: Yes | `devops_projects` | List projects (`id DESC`) / Create project |
| `/api/devops/:id` | GET, PUT, DELETE | PUT/DEL: Yes | `devops_projects` | Fetch single / Update project / Delete project |
| `/api/timeline` | GET, POST | POST: Yes | `timeline_posts` | List milestones (`year ASC, event_date ASC`) |
| `/api/timeline/:id`| PUT, DELETE | Yes | `timeline_posts` | Update / Delete milestone |
| `/api/atlas` | GET, POST | POST: Yes | `atlas_posts` | List destinations / Create destination |
| `/api/atlas/:id` | PUT, DELETE | Yes | `atlas_posts` | Update / Delete destination |
| `/api/academy` | GET, POST | POST: Yes | `academy_posts` | List skills / Create skill |
| `/api/academy/:id` | PUT, DELETE | Yes | `academy_posts` | Update / Delete skill |

---

## 11. Current Implementation & Verification Status Matrix

```
┌──────────────────────────────────────────────────┬──────────────────────┬────────────────────────────────────────────────────────┐
│ Domain / Feature                                 │ Verified Status      │ Implementation Evidence & Notes                        │
├──────────────────────────────────────────────────┼──────────────────────┼────────────────────────────────────────────────────────┤
│ Decoupled Projects Architecture                  │ COMPLETED            │ /projects/:id -> ProjectInformationPage (routes.tsx)   │
│ Project Information Dossier Page                 │ COMPLETED            │ ProjectInformationPage.tsx (Videos, Docs, Arch, Links) │
│ Project Content Engine & Models                  │ COMPLETED            │ src/lib/projectContent.ts (Highlights JSON persistence)│
│ Admin Projects Manager + Content Modal           │ COMPLETED            │ ProjectsManager.tsx + ProjectContentManagerModal.tsx   │
│ DevOps 5-Pillar Laboratory System                │ COMPLETED            │ DevOpsPage.tsx + DevOpsLearningJourney.tsx             │
│ DevOps Notes & Attached PDF Support              │ COMPLETED            │ DevOpsLearningJourney.tsx + NoteReaderModal.tsx        │
│ Networking & AWS Video Sessions Masterclasses    │ COMPLETED            │ DevOpsPillarVideoSessions.tsx + VideoPlayerModal.tsx   │
│ Admin DevOps 5-Pillar Manager                    │ COMPLETED            │ DevOpsManager.tsx + ResourceEditorModal.tsx            │
│ Admin Cinema Manager with Poster Studio          │ COMPLETED            │ CinemaManager.tsx with live poster fallback validation │
│ Authenticated CMS Console (Tabs Architecture)    │ COMPLETED            │ AuthenticatedCMS.tsx (Projects, Cinema, DevOps tabs)   │
│ Cinema Observatory Neon Wiring (Zero Fallback)   │ COMPLETED            │ CinemaPage.tsx, 9 verified records in Neon             │
│ Timeline Milestones Chronological Ordering       │ COMPLETED            │ TimelinePage.tsx, 5 verified records in Neon           │
│ Admin PBKDF2 Web Crypto Authentication           │ COMPLETED            │ functions/api/auth/* & functions/api/_middleware.ts    │
│ Mission Control Favourite Projects Carousel      │ COMPLETED            │ ProjectsShowcase.tsx (Dual picture desktop/mobile)     │
│ SohailVerse Brand Identity & Avatar              │ COMPLETED            │ BrandAvatar.tsx (profile image with monogram fallback) │
│ Mobile Responsive Layout & Dock Navigation       │ COMPLETED            │ DevOpsBottomNav.tsx, MobileMenu.tsx, responsive CSS    │
│ Cloudflare Pages Production Deployment           │ PENDING VERIFICATION │ Cloudflare Pages environment secrets verification      │
│ Academy & Atlas Dedicated Public Page Routes     │ PENDING              │ APIs exist (/api/academy, /api/atlas); routes unmapped │
│ Travel Posts API Endpoint                        │ DEFERRED             │ Table exists in Neon (5 rows); no /api/travel route    │
│ Cloudflare D1 Legacy Schema Deprecation          │ DEFERRED             │ src/db/schema.ts retained for rollback reference       │
└──────────────────────────────────────────────────┴──────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 12. Architectural Evidence & Verified References

This architecture document was compiled directly from empirical repository inspection:
- Application Entry & Routing: `src/app/routes.tsx`, `src/app/router.tsx`, `src/App.tsx`
- Project Architecture: `src/pages/ProjectsPage.tsx`, `src/pages/ProjectInformationPage.tsx`, `src/lib/projectContent.ts`, `src/components/projects/*`
- DevOps Architecture: `src/pages/DevOpsPage.tsx`, `src/components/devops/*`, `src/lib/pillarContent.ts`
- Admin Console Architecture: `src/pages/AdminPage.tsx`, `src/components/admin/*`, `src/components/admin/devops/*`
- Cinema Observatory: `src/pages/CinemaPage.tsx`, `src/components/cinema/*`
- Timeline Milestones: `src/pages/TimelinePage.tsx`, `src/components/about/*`
- Mission Control & Navigation: `src/pages/MissionControlPage.tsx`, `src/components/mission-control/*`, `src/components/navigation/*`, `src/components/ui/BrandAvatar.tsx`
- Database & Schemas: `src/db/schema.pg.ts`, `src/db/index.ts`, `drizzle.config.ts`, `drizzle/migrations-pg/*`
- Edge API Handlers: `functions/api/*`, `functions/api/_middleware.ts`, `functions/api/auth/*`
