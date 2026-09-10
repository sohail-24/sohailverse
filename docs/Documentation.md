# SohailVerse v2.0 — Developer & Operations Guide

> **Document Type:** Developer, Operational, and Administrative Manual  
> **Status:** Current Repository State (Verified September 2026)  
> **Standard:** Real Project Data Only (Zero Placeholders / Zero Speculation)

---

## 1. Project Overview

**SohailVerse v2.0** is an interactive, multidimensional digital platform and cloud engineering portfolio. It integrates six core operational domains:

1. **Mission Control (Home — `/`):** Interactive 3D Earth globe (`Three.js`), real-time telemetry strip, personal engineering philosophy, world gateways, and the responsive Favourite Projects showcase carousel.
2. **Independent Projects System (`/projects`, `/projects/:id`):** Completely decoupled from DevOps. A dedicated portfolio showcase and standalone **Project Information Pages** (`ProjectInformationPage.tsx`) providing deep technical dossiers (Overview, Video Sessions, README/Documentation, Architecture Diagrams, External Links).
3. **DevOps Laboratory (`/devops`, `/devops/:id`):** Structured around **Five Distinct Learning Pillars**:
   - **Pillar 1: Notes** — Core runbooks, conceptual guides, and attached PDF reader/viewer support.
   - **Pillar 2: Networking** — Networking fundamentals, OSI model, DNS, subnets, and video sessions masterclass.
   - **Pillar 3: AWS** — Cloud infrastructure, VPCs, compute, storage, EKS, and video sessions masterclass.
   - **Pillar 4: DevOps** — Containers, Kubernetes orchestration, Terraform IaC, and ArgoCD GitOps pipelines.
   - **Pillar 5: Learn & Test Projects** — Staging labs, architecture diagrams, and practice repositories.
4. **Cinema Observatory (`/cinema`):** Curated movie catalog backed strictly by Neon PostgreSQL (`movies` table) with zero client-side fallback data, dynamic statistics, genre filtering, and video trailer/streaming modals.
5. **Timeline & Career Milestones (`/timeline`, `/about`):** Chronological career milestones from 2023 through 2026 backed by Neon PostgreSQL (`timeline_posts` table) with zero client-side fallback data.
6. **Admin Console & CMS (`/admin`, `/console`):** Authenticated workspace (`AuthenticatedCMS.tsx`) secured with PBKDF2 Web Crypto verification and HMAC-signed session cookies. Features dedicated tabbed managers for Projects, Cinema, and DevOps.

---

## 2. Local Development

### Prerequisites
- Node.js 18+ or Bun
- npm or bun package manager

### Available Package Scripts
These scripts are defined in `package.json`:

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `vite --host 0.0.0.0 --port 3000` | Boots Vite development server on port 3000 with custom Neon API proxy middleware |
| `npm run build` | `tsc -b && vite build` | Type-checks TypeScript modules and compiles production bundle into `dist/` |
| `npm run lint` | `tsc -b` | Runs TypeScript compiler checks across all project files |
| `npm run preview` | `vite preview` | Locally serves the compiled production bundle |

### Auxiliary Operational Scripts
Located in `scripts/`:

```bash
# 1. Generate secure PBKDF2 hash for admin password
node scripts/generate-password-hash.js "<your-desired-password>"

# 2. Run data migration from D1 export SQL into Neon PostgreSQL
# (Requires DATABASE_URL environment variable and d1-export.sql file)
node scripts/migrate-d1-to-neon.mjs

# 3. Generate high-resolution project placeholder images
node scripts/generate-project-placeholders.cjs

# 4. Generate 2K deep space procedural background image
node scripts/generate-space-background.mjs
```

### Local Dev Server API Simulation
When running `npm run dev`, Vite uses custom middleware defined in `vite.config.ts`:
- If `DATABASE_URL` is configured in your environment or `.dev.vars`, the server queries Neon PostgreSQL via `@neondatabase/serverless`.
- If `DATABASE_URL` is unset or unreachable, the dev server seamlessly serves from an in-memory `mockStore` containing verified baseline records.

---

## 3. Database Development & Schema

### Neon PostgreSQL Configuration
1. Provision a serverless PostgreSQL database on [Neon](https://neon.tech).
2. Obtain your pooled connection string:
   ```
   postgresql://<user>:<password>@<neon-hostname>/<dbname>?sslmode=require
   ```
3. Set `DATABASE_URL` in `.dev.vars` (for local development) or Cloudflare Pages Dashboard (for production deployment).

### Drizzle ORM Schema & Migrations
The database configuration is controlled by `drizzle.config.ts`:
- **Active Schema:** `src/db/schema.pg.ts`
- **Dialect:** `postgresql`
- **Output Directory:** `drizzle/migrations-pg/`

```bash
# Generate new migration files from schema modifications
npx drizzle-kit generate

# Apply pending migrations to the active database
npx drizzle-kit migrate
```

### Physical PostgreSQL Tables
The active database schema (`src/db/schema.pg.ts`) defines exactly seven physical PostgreSQL tables:

| Physical Table | Column | Type | Nullable? | Purpose |
|---|---|---|---|---|
| **`movies`** | `id` | `integer` | NO (PK Identity) | Unique movie identifier |
| | `title` | `text` | NO | Movie title |
| | `genre` | `text` | NO | Movie genre (e.g., Sci-Fi, Action) |
| | `rating` | `real` | NO | Numerical rating (e.g., 9.5) |
| | `trailer_url` | `text` | YES | External video or JioCloud streaming URL |
| | `poster_url` | `text` | YES | Relative path or remote URL to poster visual |
| | `synopsis` | `text` | YES | Full plot synopsis and cinematic narrative |
| | `is_featured` | `boolean` | NO (default false) | Flag identifying primary showcase movie |
| **`devops_projects`** | `id` | `integer` | NO (PK Identity) | Unique project record identifier |
| | `title` | `text` | YES | Project display title |
| | `category` | `text` | YES | Domain category (e.g., Cloud Native) |
| | `description` | `text` | YES | Architectural summary |
| | `image_url` | `text` | YES | Visual poster or screenshot URL path |
| | `ppt_url` | `text` | YES | Architecture slide deck or PDF link |
| | `github_url` | `text` | YES | GitHub repository URL |
| | `technologies` | `text` | YES | Comma-separated list of technologies |
| | `highlights` | `text` | YES | Serialized JSON containing project content (overview, videos, docs, architecture, links) |
| | `status` | `text` | YES | Status (e.g., Ready, Active, Upcoming) |
| **`timeline_posts`** | `id` | `integer` | NO (PK Identity) | Unique milestone identifier |
| | `title` | `text` | NO | Milestone headline |
| | `category` | `text` | NO | Category (e.g., Education, Career, Systems) |
| | `description` | `text` | NO | Milestone narrative description |
| | `year` | `text` | YES | Historical milestone calendar year (e.g., "2024") |
| | `event_date` | `text` | YES | Historical event calendar date ("YYYY-MM-DD") |
| | `created_at` | `timestamp` | NO (default now()) | Record creation timestamp (technical) |
| **`atlas_posts`** | `id` | `integer` | NO (PK Identity) | Unique travel atlas record identifier |
| | `country` | `text` | NO | Country name |
| | `status` | `text` | NO | Visit status (e.g., Visited, Explored, Home) |
| | `year` | `text` | NO | Year of travel (e.g., "2024") |
| | `highlight` | `text` | NO | Key memory or achievement in location |
| | `created_at` | `timestamp` | NO (default now()) | Record creation timestamp |
| **`academy_posts`** | `id` | `integer` | NO (PK Identity) | Unique skill identifier |
| | `skill` | `text` | NO | Name of technology or skill (e.g., Kubernetes) |
| | `category` | `text` | NO | Category (e.g., Cloud Infrastructure) |
| | `level` | `text` | NO | Proficiency level (e.g., Advanced, Expert) |
| **`devops_posts`** | `id` | `integer` | NO (PK Identity) | Unique DevOps update identifier |
| | `title` | `text` | NO | Title of the DevOps post |
| | `category` | `text` | NO | System category |
| | `description` | `text` | NO | Detailed technical overview |
| | `created_at` | `timestamp` | NO (default now()) | Creation timestamp |
| **`travel_posts`** | `id` | `integer` | NO (PK Identity) | Unique destination record identifier |
| | `country` | `text` | NO | Country name |
| | `city` | `text` | NO | City name |
| | `description` | `text` | YES | Destination travel notes |

---

## 4. API Reference

All endpoints run as Cloudflare Pages Functions under `/api/*`.

### Global Protection Guard
Mutating HTTP methods (`POST`, `PUT`, `DELETE`, `PATCH`) require an authenticated admin session (`sv_admin_session` cookie). Unauthenticated mutation attempts receive HTTP `401 Unauthorized`.

```
┌─────────────────────────┬────────┬───────────────────────┬────────────────────────────────────────────────────────┐
│ Endpoint                │ Method │ Database Table        │ Purpose & Response                                     │
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/auth/login         │ POST   │ N/A (Secrets)         │ Body: { password }. Returns { authenticated: true }    │
│                         │        │                       │ and sets sv_admin_session cookie.                      │
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/auth/session       │ GET    │ N/A (Secrets)         │ Validates session cookie. Returns                      │
│                         │        │                       │ { authenticated: boolean, requiresSetup: boolean }.    │
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/auth/logout        │ POST   │ N/A                   │ Clears sv_admin_session cookie.                        │
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/movies             │ GET    │ movies                │ Returns { data: Movie[] } ordered by id DESC. Includes │
│                         │        │                       │ poster_url, synopsis, is_featured, trailer_url.       │
│ /api/movies             │ POST   │ movies                │ [Auth] Body: { title, genre, rating, trailer_url,     │
│                         │        │                       │ poster_url, synopsis, is_featured }.                   │
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/movies/:id         │ PUT    │ movies                │ [Auth] Updates movie by ID. Accepts all movie fields.  │
│ /api/movies/:id         │ DELETE │ movies                │ [Auth] Deletes movie by ID. Returns { success: true }. │
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/devops             │ GET    │ devops_projects       │ Returns { data: DevOpsProject[] } ordered by id DESC.  │
│                         │        │                       │ Supports pdf_url and serialized highlights content.   │
│ /api/devops             │ POST   │ devops_projects       │ [Auth] Body: project attributes. Returns created item. │
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/devops/:id         │ GET    │ devops_projects       │ Returns single project record by ID.                   │
│ /api/devops/:id         │ PUT    │ devops_projects       │ [Auth] Updates project by ID (highlights JSON, etc.).  │
│ /api/devops/:id         │ DELETE │ devops_projects       │ [Auth] Deletes project by ID. Returns { success: true}.│
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/timeline           │ GET    │ timeline_posts        │ Returns { data: TimelinePost[] } ordered by            │
│                         │        │                       │ year ASC, event_date ASC, id ASC (chronological).     │
│ /api/timeline           │ POST   │ timeline_posts        │ [Auth] Body: { title, category, description, year,    │
│                         │        │                       │ event_date, created_at }. Returns created post.        │
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/timeline/:id       │ PUT    │ timeline_posts        │ [Auth] Updates timeline post by ID (year, event_date). │
│ /api/timeline/:id       │ DELETE │ timeline_posts        │ [Auth] Deletes timeline post by ID.                    │
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/atlas              │ GET    │ atlas_posts           │ Returns { data: AtlasPost[] } ordered by id DESC.      │
│ /api/atlas              │ POST   │ atlas_posts           │ [Auth] Body: { country, status, year, highlight }.     │
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/atlas/:id          │ PUT    │ atlas_posts           │ [Auth] Updates atlas post by ID.                       │
│ /api/atlas/:id          │ DELETE │ atlas_posts           │ [Auth] Deletes atlas post by ID.                       │
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/academy            │ GET    │ academy_posts         │ Returns { data: AcademyPost[] } ordered by id ASC.     │
│ /api/academy            │ POST   │ academy_posts         │ [Auth] Body: { skill, category, level }.               │
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/academy/:id        │ PUT    │ academy_posts         │ [Auth] Updates academy post by ID.                     │
│ /api/academy/:id        │ DELETE │ academy_posts         │ [Auth] Deletes academy post by ID.                     │
└─────────────────────────┴────────┴───────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 5. Independent Projects System Guide

### 5.1 Core Principle: Decoupled from DevOps
A project is an independent product entity. Under no circumstances should clicking a project route users to `/devops`. 

The verified navigation flow is:
```
Navigation / Showcase  ──►  /projects  ──►  Select Project  ──►  /projects/:id (Project Information Page)
```

### 5.2 Public Projects Showcase (`src/pages/ProjectsPage.tsx`)
- Displays all portfolio initiatives loaded via `loadUnifiedProjects()` (`src/components/projects/projectData.ts`).
- **Interactive Status Filters:**
  - `ALL`: Complete portfolio view.
  - `LIVE`: Production-ready, running platforms (e.g., Sohail-Shop).
  - `BUILDING`: Systems under active engineering (e.g., Sohail Studio, Fresh Flow).
  - `UPCOMING`: Planned and next-chapter initiatives (e.g., Wedding Page, New Chapter).
- **Project Cards (`ProjectShowcaseItem.tsx`):**
  - Alternating layout (even: image left / info right; odd: info left / image right).
  - Portrait image container with mobile-optimized dimensions.
  - Technology stack badges with branded icons (`SiKubernetes`, `SiDocker`, `SiTerraform`, `SiPostgresql`, `SiReact`, etc.).
  - Direct action button: `[ View Project → ]` routing directly to `/projects/:id`.

### 5.3 Standalone Project Information Page (`src/pages/ProjectInformationPage.tsx`)
When a user opens `/projects/:id`, the dedicated Project Information Page renders a comprehensive dossier:
- **Hero & Identity:** High-resolution banner visual, category badge, status indicator (`Ready`, `Active`, `Upcoming`), title, tagline, external live demo link, and GitHub repository link.
- **Dossier Tab Navigation:**
  1. **Overview:** Executive architectural narrative, key features, and technology stack with branded icons.
  2. **Video Sessions:** Recorded walkthroughs and architecture lectures with title, duration pill, description, and an embedded modal video player.
  3. **README / Documentation:** In-depth documentation with support for attached PDF guides (with view/download actions) and markdown runbooks.
  4. **Architecture:** System diagrams and topology maps with an interactive full-screen image lightbox.
  5. **External Links:** Direct access to GitHub repositories, production deployments, and external documentation.

### 5.4 Admin Project Management (`src/components/admin/ProjectsManager.tsx`)
Located in the Admin Console under the **Projects** tab:
- **Search & Filtering:** Search by project title or description; filter by category, status, or source (`Database` vs. `Static`).
- **CRUD Actions:** Create a new project, edit baseline attributes (title, category, description, technologies, status), or delete with confirmation.
- **Deep Content Management via `ProjectContentManagerModal.tsx`:**
  - Click the **"Manage Content"** action on any project.
  - **Overview Tab:** Edit executive summary, tagline, hero image, and status.
  - **Videos Tab:** Add/edit/delete video sessions (title, YouTube/Vimeo/MP4 embed URL, duration, thumbnail).
  - **Documents Tab:** Manage technical documents, markdown runbooks, or PDF document URLs.
  - **Architecture Tab:** Add/edit system diagrams with image URLs and captions.
  - **Links Tab:** Add external resource links (GitHub, live demo, documentation).
  - **Persistence:** Submitting saves all content into the `highlights` JSON column in Neon PostgreSQL via `PUT /api/devops/:id`.

---

## 6. DevOps 5-Pillar Laboratory Guide

### 6.1 The 5 Pillars Structure
The DevOps laboratory (`src/pages/DevOpsPage.tsx`) is structured around 5 clear learning pillars:

1. **Pillar 1: Notes:** Runbooks, foundational concepts, and attached PDF documentation. Supports an inline PDF reader and download actions.
2. **Pillar 2: Networking:** Internet protocols, OSI layers, DNS resolution, subnets, and ports, featuring an interactive **Video Sessions Masterclass**.
3. **Pillar 3: AWS:** Cloud computing, VPC architecture, IAM security, S3 storage, and EKS clusters, featuring an interactive **Video Sessions Masterclass**.
4. **Pillar 4: DevOps:** Docker containerization, Kubernetes orchestration, Terraform Infrastructure as Code, and automated ArgoCD GitOps pipelines.
5. **Pillar 5: Learn & Test Projects:** Hands-on staging blueprints, test repositories, and practical labs.

### 6.2 Public Interaction & Deep Linking
- **URL Parameter Binding:** Users can deep-link directly to specific video masterclasses via query parameters:
  - `/devops?pillar=networking` — Automatically expands the Networking Video Sessions Masterclass.
  - `/devops?pillar=aws` — Automatically expands the AWS Video Sessions Masterclass.
- **Masterclass Video Player (`DevOpsPillarVideoSessions.tsx` / `DevOpsVideoSessionPlayer.tsx`):** Provides a clean video playback modal with lecture takeaways, duration, and external resources.
- **Notes Modal with PDF Support (`DevOpsNoteModal.tsx` / `NoteReaderModal.tsx`):** Reads technical notes and provides direct viewing/downloading of attached PDF documentation.
- **Mobile Sticky Navigation (`DevOpsBottomNav.tsx`):** Allows mobile users to jump directly to any of the 5 pillars.

### 6.3 Admin DevOps Management (`src/components/admin/DevOpsManager.tsx`)
Located in the Admin Console under the **DevOps** tab:
- **Pillar Filter Tabs:** Easily switch between `All`, `Notes`, `Networking`, `AWS`, `DevOps`, and `Learn & Test Projects`.
- **Resource Editor Modal (`ResourceEditorModal.tsx`):**
  - Select Pillar (`Notes`, `Networking`, `AWS`, `DevOps`, `Learn & Test Projects`).
  - Title and category.
  - Notes / Technical content.
  - Image URL.
  - Video URL and Video Duration.
  - **PDF Document URL:** Attach external or `/public/*.pdf` files to notes.
  - Custom Resource Links (GitHub, documentation, slides).
- **Integrated Viewers:** Preview resources directly inside the Admin Console:
  - `VideoPlayerModal.tsx`: Watch attached video sessions.
  - `NoteReaderModal.tsx`: Read technical notes and inspect attached PDF URLs.
  - `ImageLightboxModal.tsx`: View architecture diagrams at full scale.

---

## 7. Cinema Observatory Guide

### 7.1 Public Experience (`src/pages/CinemaPage.tsx`)
- Backed strictly by Neon PostgreSQL (`movies` table) with **zero client fallback data**.
- **Hero Statistics (`CinemaHero.tsx`):** Displays real-time database counts (total films, average rating, top genre).
- **Featured Movie (`CinemaFeaturedMovie.tsx`):** Highlights the active showcase film (`is_featured === true`) with poster visual, synopsis, rating, and watch action.
- **Movie Carousel (`CinemaMovieCarousel.tsx`):** Multi-card catalog with poster thumbnails, genre pills, ratings, and modal triggers.
- **Modal Player (`CinemaTrailerModal.tsx`):** Embedded video modal supporting YouTube trailers and direct JioCloud streaming links.

### 7.2 Admin Cinema Management (`src/components/admin/CinemaManager.tsx`)
Located in the Admin Console under the **Cinema** tab:
- **Poster Studio Thumbnail:** Live preview of poster URL with automatic fallback (`No Poster Available`) if URL is invalid.
- **Modal Editor:** Add and edit movies with full schema support:
  - Title (required)
  - Genre (required)
  - Rating (0.0 – 10.0)
  - Trailer URL (YouTube or streaming link)
  - Poster URL (path or remote URL)
  - Synopsis (narrative plot summary)
  - **Featured Movie Toggle (`is_featured`):** Highlights the primary showcase film.
- **Delete Confirmation:** Safe movie deletion via `DeleteConfirmModal`.

---

## 8. Timeline & Career Milestones Guide

### 8.1 Chronology & Date Semantics
- Defined in `src/pages/TimelinePage.tsx` and `src/components/about/AboutJourneyTimeline.tsx`.
- Strictly ordered: `year ASC, event_date ASC, id ASC`.
- **Date Semantics:**
  - `year`: Primary milestone year grouping (e.g., "2023", "2024", "2025", "2026").
  - `event_date`: Secondary calendar date ("YYYY-MM-DD").
  - `created_at`: Database timestamp metadata.

### 8.2 Verified Neon Inventory (5 Records)
1. **ID 4 (2023):** Completed Engineering Degree (Education)
2. **ID 5 (2024):** Saudi Arabia Journey & AWS / DevOps Genesis (Exploration & Learning)
3. **ID 2 (2025):** Internship at Visys Company (Career & Systems)
4. **ID 6 (2026):** Built & Deployed Sohail-Shop (Systems & Cloud)
5. **ID 1 (2026):** Timeline CMS Created (Platform)

---

## 9. Mission Control (Home) & Branding

### 9.1 Features & Layout (`src/pages/MissionControlPage.tsx`)
- **3D Interactive Earth (`CinematicEarthTransition.tsx`):** WebGL Earth canvas with city nodes (Riyadh, Dubai, Hyderabad, Mumbai, Chennai) and real orbital coordinates.
- **Live Status Bar (`LiveStatusBar.tsx`):** Current status signals (Focus, Learning, Current Movie, Current Project).
- **Favourite Projects Showcase (`ProjectsShowcase.tsx`):** Horizontal carousel with responsive dual-picture screenshots (mobile portrait on screens `<640px`, wide desktop on screens `≥640px`), status badges (`Ready`, `Active`, `Upcoming`), and **"Explore Project"** buttons routing to `/projects/:id`.
- **World Gateways (`WorldsGatewaySection.tsx`):** Visual portal cards linking to the 5 platform dimensions (`/devops`, `/cinema`, `/timeline`, etc.).

### 9.2 Brand Identity & Avatar (`src/components/ui/BrandAvatar.tsx`)
- Displayed in the sticky `Navbar.tsx` and platform headers.
- Automatically loads the developer photo from `src/data/profile.ts` (`profile.avatarUrl`).
- Features a graceful fallback to a styled lime "S" monogram inside a gradient border ring if the image is unset or fails to load.

---

## 10. Security & Administrative Operations

### Authentication Architecture
- **Route:** `/admin` or `/console` (`src/pages/AdminPage.tsx`).
- **Cryptographic Hashing:** Uses the Web Crypto API (`crypto.subtle`) supporting PBKDF2 with 600,000 iterations and SHA-256.
- **Session Cookie:** Sets an `sv_admin_session` cookie (`HttpOnly`, `Secure`, `SameSite=Strict`, `Max-Age=604800` / 7 days) signed with `SESSION_SECRET` via HMAC-SHA256.
- **Global Mutation Guard (`functions/api/_middleware.ts`):** Intercepts every non-GET request to `/api/*`, returning `401 Unauthorized` if a valid session cookie is not present.

### How to Generate an Admin Password Hash
Run the operational helper script at the repository root:
```bash
node scripts/generate-password-hash.js "YourSecurePassword123"
```
Copy the resulting output (e.g., `pbkdf2:600000:<salt>:<hash>`) and configure it as `ADMIN_PASSWORD_HASH` in `.dev.vars` (local) or Cloudflare Pages Dashboard (production).

---

## 11. Troubleshooting & FAQ

| Issue / Error | Root Cause | Resolution |
|---|---|---|
| **"Neon DATABASE_URL is not configured"** | `DATABASE_URL` environment variable is missing. | Set `DATABASE_URL` in `.dev.vars` (local) or in Cloudflare Pages Dashboard Settings > Environment Variables. |
| **Cinema or Timeline shows ErrorState / "Unavailable"** | Network or database connection failed. Zero-fallback policy actively surfaces errors. | Verify Neon PostgreSQL status and click the "Try Again" button to re-fetch. |
| **PDF link in Notes does not open** | The attached `pdf_url` is invalid or unreachable. | Verify the URL in `ResourceEditorModal` (Admin) or confirm the file exists in `public/`. |
| **Video player shows "Video unavailable"** | The URL provided is not a supported YouTube, Vimeo, or direct MP4 link. | Ensure the link matches standard YouTube watch/embed formats (e.g., `https://www.youtube.com/watch?v=...`). |
| **"Unauthorized: Valid admin session required."** | Mutating request made without `sv_admin_session` cookie. | Log in at `/admin` to obtain an active session cookie. |
| **"Invalid credentials." on login** | Password does not match `ADMIN_PASSWORD_HASH`. | Regenerate hash using `node scripts/generate-password-hash.js "<password>"` and update environment secrets. |

---

## 12. Verification & Status Matrix

```
┌───────────────────────────────────────────────┬──────────────────────┬────────────────────────────────────────────────────────┐
│ Area                                          │ Status               │ Repository Verification Evidence                       │
├───────────────────────────────────────────────┼──────────────────────┼────────────────────────────────────────────────────────┤
│ Independent Projects Architecture             │ COMPLETED            │ /projects/:id -> ProjectInformationPage (routes.tsx)   │
│ Project Information Page & Content Dossier    │ COMPLETED            │ ProjectInformationPage.tsx (Videos, Docs, Arch, Links) │
│ Admin Projects Manager + Content Modal        │ COMPLETED            │ ProjectsManager.tsx + ProjectContentManagerModal.tsx   │
│ DevOps 5-Pillar Laboratory System             │ COMPLETED            │ DevOpsPage.tsx + DevOpsLearningJourney.tsx             │
│ DevOps Notes & PDF Viewer Support             │ COMPLETED            │ DevOpsLearningJourney.tsx + NoteReaderModal.tsx        │
│ Networking & AWS Video Masterclasses          │ COMPLETED            │ DevOpsPillarVideoSessions.tsx + VideoPlayerModal.tsx   │
│ Admin DevOps 5-Pillar Manager                 │ COMPLETED            │ DevOpsManager.tsx + ResourceEditorModal.tsx            │
│ Admin Cinema Manager with Poster Studio       │ COMPLETED            │ CinemaManager.tsx with live poster fallback validation │
│ Authenticated CMS Console (Tabs Architecture) │ COMPLETED            │ AuthenticatedCMS.tsx (Projects, Cinema, DevOps tabs)   │
│ Cinema Observatory Neon Wiring (Zero Fallback)│ COMPLETED            │ CinemaPage.tsx, 9 verified records in Neon             │
│ Timeline Milestones Chronological Ordering    │ COMPLETED            │ TimelinePage.tsx, 5 verified records in Neon           │
│ Admin PBKDF2 Web Crypto Authentication        │ COMPLETED            │ functions/api/auth/* & functions/api/_middleware.ts    │
│ Mission Control Favourite Projects Carousel   │ COMPLETED            │ ProjectsShowcase.tsx (Dual picture desktop/mobile)     │
│ SohailVerse Brand Identity & Avatar           │ COMPLETED            │ BrandAvatar.tsx (profile image with monogram fallback) │
│ Mobile Responsive Layout & Dock Navigation    │ COMPLETED            │ DevOpsBottomNav.tsx, MobileMenu.tsx, responsive CSS    │
│ Cloudflare Pages Production Deployment        │ PENDING VERIFICATION │ Cloudflare Pages environment secrets verification      │
│ Academy & Atlas Dedicated Public Page Routes  │ PENDING              │ APIs exist (/api/academy, /api/atlas); routes unmapped │
│ Travel Posts API Endpoint                     │ DEFERRED             │ Table exists in Neon (5 rows); no /api/travel route    │
│ Cloudflare D1 Legacy Schema Deprecation       │ DEFERRED             │ src/db/schema.ts retained for rollback reference       │
└───────────────────────────────────────────────┴──────────────────────┴────────────────────────────────────────────────────────┘
```
