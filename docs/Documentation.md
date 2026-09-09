# SohailVerse v2.0 — Developer & Operations Guide

> **Document Type:** Developer, Operational, and Administrative Manual  
> **Status:** Evidence-Based Current State  
> **Repository Inspection Date:** September 2026  
> **Standard:** Real Project Data Only (Zero Placeholders / Zero Speculation)

---

## 1. Project Overview

**SohailVerse v2.0** is an interactive, multidimensional digital platform and engineering universe. It integrates five core domains into a cohesive user experience:

1. **Mission Control (Home):** Interactive 3D Earth visualization, live platform telemetry, engineering philosophy, and featured projects rail.
2. **Projects & DevOps Laboratory:** Cloud-native architecture blueprints, Kubernetes cluster labs, Terraform infrastructure, and deep incident retrospectives.
3. **Cinema Observatory:** Curated collection of movies with genre filtering, ratings, and embedded video trailer modals.
4. **Timeline & Career Milestones:** Chronological progression spanning engineering degree completion, international travels, and cloud accomplishments.
5. **Admin Console (`/admin`, `/console`):** Authenticated management interface with PBKDF2 verification, allowing CRUD operations on system collections.

---

## 2. Local Development

### Prerequisites
- Node.js 18+ or Bun
- npm or bun package manager

### Available Package Scripts
These scripts are defined in `package.json`:

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `vite --host 0.0.0.0 --port 3000` | Boots Vite development server on port 3000 with custom API proxy middleware |
| `npm run build` | `tsc -b && vite build` | Type-checks the TypeScript project and compiles the production bundle into `dist/` |
| `npm run lint` | `tsc -b` | Runs TypeScript compiler checks across all project references |
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
When running `npm run dev`, Vite utilizes a custom middleware defined in `vite.config.ts`:
- If `DATABASE_URL` is configured in your local environment or `.dev.vars`, the dev server connects directly to Neon PostgreSQL via `@neondatabase/serverless`.
- If `DATABASE_URL` is unset or unreachable, the dev server seamlessly serves from an in-memory `mockStore` containing verified initial data records.

---

## 3. Database Development

### Neon PostgreSQL Configuration
1. Provision a serverless PostgreSQL database on [Neon](https://neon.tech).
2. Obtain your pooled connection string:
   ```
   postgresql://<user>:<password>@<neon-hostname>/<dbname>?sslmode=require
   ```
3. Set `DATABASE_URL` in `.dev.vars` (for Cloudflare Pages local simulation) or the Cloudflare Pages dashboard (for production deployment).

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

*Note: Never commit database connection strings or secret credentials to source control.*

---

## 4. Database Tables

The active database schema (`src/db/schema.pg.ts`) and Drizzle migrations (`drizzle/migrations-pg/`) define exactly seven physical PostgreSQL tables:

| Physical Table | Column | Type | Nullable? | Purpose |
|---|---|---|---|---|
| **`movies`** | `id` | `integer` | NO (PK Identity) | Unique movie identifier |
| | `title` | `text` | NO | Movie title |
| | `genre` | `text` | NO | Movie category/genre (e.g., Sci-Fi, Action) |
| | `rating` | `real` | NO | Numerical rating (e.g., 9.5) |
| | `trailer_url` | `text` | YES | External video or JioCloud streaming URL |
| | `poster_url` | `text` | YES | Relative path or remote URL to poster visual |
| | `synopsis` | `text` | YES | Full plot synopsis and cinematic overview |
| | `is_featured` | `boolean` | NO (default false) | Highlights primary showcase movie |
| **`travel_posts`** | `id` | `integer` | NO (PK Identity) | Unique destination record identifier |
| | `country` | `text` | NO | Country name |
| | `city` | `text` | NO | City name |
| | `description` | `text` | YES | Destination travel notes |
| **`academy_posts`** | `id` | `integer` | NO (PK Identity) | Unique skill identifier |
| | `skill` | `text` | NO | Name of technology or skill (e.g., Kubernetes) |
| | `category` | `text` | NO | Category (e.g., Cloud Infrastructure) |
| | `level` | `text` | NO | Proficiency level (e.g., Advanced, Expert) |
| **`devops_posts`** | `id` | `integer` | NO (PK Identity) | Unique DevOps update identifier |
| | `title` | `text` | NO | Title of the DevOps post |
| | `category` | `text` | NO | System category |
| | `description` | `text` | NO | Detailed technical overview |
| | `created_at` | `timestamp` | NO (default now()) | Creation timestamp |
| **`timeline_posts`** | `id` | `integer` | NO (PK Identity) | Unique timeline milestone identifier |
| | `title` | `text` | NO | Milestone headline |
| | `category` | `text` | NO | Category (e.g., Career, Education, Cloud) |
| | `description` | `text` | NO | Milestone narrative description |
| | `created_at` | `timestamp` | NO (default now()) | Record creation timestamp (technical) |
| | `year` | `text` | YES | Historical milestone calendar year (e.g., 2024) |
| | `event_date` | `text` | YES | Historical event calendar date (YYYY-MM-DD) |
| **`atlas_posts`** | `id` | `integer` | NO (PK Identity) | Unique travel atlas record identifier |
| | `country` | `text` | NO | Country name |
| | `status` | `text` | NO | Visit status (e.g., Visited, Explored, Home) |
| | `year` | `text` | NO | Year of travel (e.g., 2024) |
| | `highlight` | `text` | NO | Key memory or achievement in location |
| | `created_at` | `timestamp` | NO (default now()) | Record creation timestamp |
| **`devops_projects`** | `id` | `integer` | NO (PK Identity) | Unique portfolio project identifier |
| | `title` | `text` | YES | Project display title |
| | `category` | `text` | YES | Project domain category |
| | `description` | `text` | YES | Architectural summary |
| | `image_url` | `text` | YES | Visual poster or screenshot URL path |
| | `ppt_url` | `text` | YES | Architecture slide deck or presentation link |
| | `github_url` | `text` | YES | GitHub repository URL |
| | `technologies` | `text` | YES | Comma-separated list of technologies |
| | `highlights` | `text` | YES | Key engineering accomplishments |
| | `status` | `text` | YES | Lifecycle status (e.g., Production Ready) |

---

## 5. API Reference

All API routes run as Cloudflare Pages Functions under `/api/*`.

### Global Protection
All requests using methods `POST`, `PUT`, `DELETE`, or `PATCH` require an authenticated admin session (`sv_admin_session` cookie). Unauthenticated mutation attempts receive `401 Unauthorized`.

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
│                         │        │                       │ Returns { success: true, data: Movie }.                │
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/movies/:id         │ PUT    │ movies                │ [Auth] Updates movie by ID. Accepts expanded fields.   │
│ /api/movies/:id         │ DELETE │ movies                │ [Auth] Deletes movie by ID. Returns { success: true }. │
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/devops             │ GET    │ devops_projects       │ Returns { data: DevOpsProject[] } ordered by id DESC.  │
│ /api/devops             │ POST   │ devops_projects       │ [Auth] Body: project attributes. Returns created item. │
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/devops/:id         │ PUT    │ devops_projects       │ [Auth] Updates project by ID. Returns updated item.    │
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

## 6. Content Management & Admin

### Authenticated Admin Console
- Accessible at routes: `/admin` and `/console` (`src/pages/AdminPage.tsx`).
- **Authentication Lifecycle:**
  1. On mount, calls `GET /api/auth/session` to inspect the `sv_admin_session` cookie.
  2. If unauthenticated, displays the login form with password input.
  3. Form submission calls `POST /api/auth/login`. On success, the cookie is set, and the console unlocks.
  4. Logout calls `POST /api/auth/logout`, clearing the cookie and returning the UI to the locked state.

### Managed Content Types in the Admin UI
The `AdminPage.tsx` interface implements dedicated CRUD workflows for:
1. **Movies Manager:**
   - Add new movie (Title, Genre, Rating, Trailer URL).
   - View live list with ID, Title, Rating, and Trailer link.
   - Delete movie with confirmation prompt.
   - *(Note: Expanded fields `poster_url`, `synopsis`, and `is_featured` are fully supported by the database schema and API; Admin UI currently provides direct inputs for Title, Genre, Rating, and Trailer URL.)*
2. **DevOps Posts / Projects Manager:**
   - Add new project/post (Title, Category, Description).
   - View live list of registered DevOps entries.
   - Delete project with confirmation prompt.
3. **Timeline Posts Manager:**
   - Add new milestone with inputs:
     - `Event Title` (required text)
     - `Category` (required text, e.g., Education, Career, Systems, Platform)
     - `Year` (e.g., 2024, optional milestone anchor)
     - `Event Date` (e.g., 2024-03-10, optional ISO calendar date)
     - `Description` (required detailed overview)
   - View live timeline list displaying event ID, title, year pill, event date pill, category badge, and delete button.
   - Delete milestone with confirmation prompt.

*(Note: While `/api/academy` and `/api/atlas` endpoints exist, their forms are currently not rendered in `AdminPage.tsx`.)*

---

## 7. Frontend Pages & Routes

The application routing is declared in `src/app/routes.tsx` using `createBrowserRouter`:

| Route Path | Component File | Primary Purpose | Data Source & Fallback Policy |
|---|---|---|---|
| `/` | `src/pages/MissionControlPage.tsx` | Platform home page, 3D Earth, telemetry, and project carousel | `src/data/mission-control.ts` (Static / hardcoded dataset) |
| `/cinema` | `src/pages/CinemaPage.tsx` | Cinema Observatory catalog with video player | `GET /api/movies` (**STRICT ZERO-FALLBACK**: fails loud with `ErrorState` and retry button if API fails) |
| `/devops` | `src/pages/DevOpsPage.tsx` | Engineering laboratory & DevOps project directory | `GET /api/devops` (Fallback: bundled records in `src/lib/api.ts`) |
| `/devops/:id` | `src/pages/ProjectDetailPage.tsx` | Architectural blueprints, incident logs, and metrics | `src/components/projects/*` (Local blueprint modules) |
| `/timeline` | `src/pages/TimelinePage.tsx` | Chronological career progression and milestones | `GET /api/timeline` (**STRICT ZERO-FALLBACK**: ordered by `year ASC, event_date ASC, id ASC`; fails loud with `ErrorState`) |
| `/about` | `src/pages/TimelinePage.tsx` | Alias pointing to `TimelinePage` | `GET /api/timeline` (**STRICT ZERO-FALLBACK**) |
| `/projects` | `src/pages/ProjectsPage.tsx` | Unified portfolio showcase with status filters | `loadUnifiedProjects()` (`src/components/projects/projectData.ts` merges `/api/devops` with static items) |
| `/projects/:id`| `src/pages/ProjectDetailPage.tsx` | Deep architectural view for selected project | `src/components/projects/*` (Local blueprint modules) |
| `/dashboard` | `src/pages/DashboardPage.tsx` | Aggregated telemetry, metric charts, and data counts | `GET /api/movies`, `GET /api/devops`, `GET /api/timeline` (Live counts; charts hardcoded) |
| `/admin` | `src/pages/AdminPage.tsx` | Content management console | `/api/auth/*`, `/api/movies`, `/api/devops`, `/api/timeline` |
| `/console` | `src/pages/AdminPage.tsx` | Alias pointing to `AdminPage` | `/api/auth/*` |

---

## 8. Media & Content Architecture

### Database vs. Storage Tiers
- **PostgreSQL Database:** Holds only relational records, metadata, text strings, and remote URLs (`trailer_url`, `poster_url`, `image_url`, `ppt_url`, `github_url`). **No binary files or base64 images are stored in PostgreSQL.**
- **Physical Assets in `public/`:**
  - `public/movies/`: High-resolution movie backdrops and posters (`interstellar.jpg`, `inception.jpg`, `oppenheimer.jpg`, `dune-part-two.jpg`, `the-dark-knight.jpg`, `gladiator.jpg`, `blade-runner-2049.jpg`, `the-matrix.jpg`, `arrival.jpg`).
  - `public/cinema/`: Projector hero imagery and genre backgrounds (`hero-projector.jpg`, `featured-favorite.jpg`).
  - `public/projects/temporary/`: Vector-derived project mockups.
  - `public/dev-real-*.jpg` & `public/real-dev-*.jpg`: Production engineering photography.
  - `public/resume.pdf`: Career documentation.
- **External Video & Streaming Services:**
  - Full-length movie streams: External JioCloud URLs preserved in `trailer_url` / `movie_url`.
  - Trailers: YouTube video modal embed player.
  - Source code links: External GitHub repositories.

---

## 9. Naming & API Contract

### Field Name Mapping
- **Database Column (PostgreSQL):** Uses standard SQL `snake_case` (e.g., `poster_url`, `trailer_url`, `synopsis`, `is_featured`, `year`, `event_date`, `created_at`).
- **Drizzle Schema Mapping (`src/db/schema.pg.ts`):** Maps SQL columns to TypeScript properties:
  - `posterUrl: text("poster_url")`
  - `trailerUrl: text("trailer_url")`
  - `synopsis: text("synopsis")`
  - `isFeatured: boolean("is_featured")`
  - `year: text("year")`
  - `eventDate: text("event_date")`
  - `createdAt: timestamp("created_at")`
  - `imageUrl: text("image_url")`
  - `pptUrl: text("ppt_url")`
  - `githubUrl: text("github_url")`
- **API Payload Contract (`functions/api/*`):** Consistently outputs and accepts `snake_case` JSON properties (`poster_url`, `trailer_url`, `synopsis`, `is_featured`, `year`, `event_date`, `created_at`) to maintain parity with PostgreSQL columns and prevent frontend serialization bugs.

---

## 10. Security Rules

1. **Zero Committed Secrets:** Never commit `.env` or `.dev.vars` containing live connection strings or keys.
2. **Password Hashing:** Always generate and configure `ADMIN_PASSWORD_HASH` using `node scripts/generate-password-hash.js`. Plaintext passwords (`ADMIN_PASSWORD`) are supported for dev fallback only.
3. **Session Cookie Integrity:**
   - Name: `sv_admin_session`
   - Attributes: `Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=604800` (7 days)
   - Signature: HMAC-SHA256 calculated over payload using `SESSION_SECRET`.
4. **Parameterized Queries:** All database queries utilize Drizzle ORM query builders or tagged SQL templates (`sql` from `@neondatabase/serverless`) to prevent SQL injection vulnerabilities.
5. **Mutation Guard:** `functions/api/_middleware.ts` rejects any non-GET request lacking an authenticated session with a 401 response code.

---

## 11. Troubleshooting

| Issue / Error | Root Cause | Resolution |
|---|---|---|
| **"Neon DATABASE_URL is not configured"** | The `DATABASE_URL` environment variable is not passed into the execution environment. | Set `DATABASE_URL` in `.dev.vars` locally or in Cloudflare Pages Settings > Environment Variables in production. |
| **Cinema or Timeline shows ErrorState / "Timeline Unavailable"** | The frontend `fetchApi` function encountered a network or database error. Zero-fallback policy actively surfaces errors to avoid masking stale data. | Check database status, verify `DATABASE_URL` connection, or use the "Try Again" button to re-fetch. |
| **DevOps or Atlas displays static fallback data** | The frontend `fetchApi` function encountered an error and fell back to local dataset in `src/lib/api.ts`. | Verify database connectivity and ensure `/api/devops` returns HTTP 200 with `{ data: [...] }`. |
| **"Unauthorized: Valid admin session required."** | A mutating request (POST, PUT, DELETE) was made without a valid `sv_admin_session` cookie. | Log in via `/admin` first to establish a session before making mutations. |
| **"Invalid credentials." on login** | The submitted password does not match `ADMIN_PASSWORD_HASH` or `ADMIN_PASSWORD`. | Check `ADMIN_PASSWORD_HASH` in `.dev.vars` or regenerate a hash using `scripts/generate-password-hash.js`. |
| **`scripts/migrate-d1-to-neon.mjs` fails: "Cannot find d1-export.sql"** | The SQLite export dump was not exported from Cloudflare D1 before running the migration script. | Export your D1 database using `npx wrangler d1 execute <db-name> --command=".dump" > d1-export.sql` at project root. |

---

## 12. Cinema Operations & Streaming Architecture

### Phases 3.1 – 3.3B Verified State
- **Phase 3.1 (Schema Expansion):** Completed via `0001_breezy_plazm.sql`. `movies` table includes `poster_url`, `synopsis`, and `is_featured`.
- **Phase 3.2 (API & Data Access):** Completed via `functions/api/movies/index.ts` and `[id].ts`.
- **Phase 3.3A (Database Content Backfill):** Completed with exactly 9 verified movie records in Neon:
  1. *Interstellar* (Sci-Fi, 9.5, Featured: true, JioCloud / YouTube trailer)
  2. *Inception* (Sci-Fi / Thriller, 9.3)
  3. *Oppenheimer* (Biography / Drama, 9.2)
  4. *Dune: Part Two* (Sci-Fi / Adventure, 9.0)
  5. *The Dark Knight* (Action / Crime, 9.4)
  6. *Gladiator* (Action / Drama, 8.9)
  7. *Blade Runner 2049* (Sci-Fi / Neo-Noir, 8.8)
  8. *The Matrix* (Sci-Fi / Action, 9.1)
  9. *Arrival* (Sci-Fi / Drama, 8.7)
- **Phase 3.3B (Frontend Neon Wiring):** Completed in `CinemaPage.tsx`, `CinemaFeaturedMovie.tsx`, and `CinemaMovieCarousel.tsx`. Fallbacks removed.
- **JioCloud Streaming Links:** Preserved in `trailer_url` / `movie_url` database columns, providing live routes to external cloud streams.

---

## 13. Timeline Operations, Milestones & Date Semantics

### Chronological Sorting & Date Architecture
- **Schema Columns:** `year` (text, milestone year anchor) and `event_date` (text, ISO format `YYYY-MM-DD`).
- **Semantic Separation:**
  - `created_at`: Technical PostgreSQL record creation timestamp.
  - `year`: Historical milestone calendar year used for primary grouping and chronological sorting.
  - `event_date`: Precise historical event date used for secondary chronological sorting.
- **API Ordering:** `functions/api/timeline/index.ts` enforces `ORDER BY year ASC, event_date ASC, id ASC`.
- **Visual Presentation:** `AboutJourneyTimeline.tsx` renders a continuous vertical spine with responsive glowing nodes, year markers, and role highlight pills.

---

## 14. Timeline Content Reconciliation (Live State vs. Historical Intent)

### Verified Neon Inventory (5 Records)
Direct query inspection of the live Neon PostgreSQL database confirms the presence of **exactly 5 records**:

| ID | Year | Event Date | Created At | Title | Category | Description | Origin / Classification |
|---|---|---|---|---|---|---|---|
| **4** | 2023 | `2023-06-20` | `2023-06-20T00:00:00Z` | Completed Engineering Degree | Education | Graduated with an Engineering degree, establishing a comprehensive foundation in algorithms and computer systems. | Verified Historical Milestone |
| **5** | 2024 | `2024-03-10` | `2024-03-10T00:00:00Z` | Saudi Arabia Journey & AWS / DevOps Genesis | Exploration & Learning | Traveled to Saudi Arabia and initiated deep-dive mastery into AWS Cloud and DevOps architecture. | Verified Historical Milestone |
| **2** | 2025 | `2025-12-20` | `2026-06-16T12:28:54Z` | Internship at Visys Company | Career & Systems | Hands-on engineering internship contributing to cloud automation, business systems, and production pipelines. | Verified Historical Milestone (Retained from D1 id:2) |
| **6** | 2026 | `2026-01-15` | `2026-01-15T00:00:00Z` | Built & Deployed Sohail-Shop | Systems & Cloud | Engineered scalable e-commerce infrastructure with multi-vendor support, Docker containers, and Kubernetes deployment. | Verified Historical Milestone ("Built & Deployed Sohail-Shop") |
| **1** | 2026 | `2026-06-16` | `2026-06-16T11:59:45Z` | Timeline CMS Created | Platform | Built a dynamic timeline powered by Cloudflare Workers and D1 Database | System / CMS Milestone (Original D1 seed record #1) |

### Explicit Discrepancy Findings
1. **Missing Milestone ("Building & Creating"):** The milestone `"Building & Creating"` (which appeared in early static About/Journey designs) is **NOT present** in the Neon database.
2. **System Milestone Present (ID #1):** Record #1 (`"Timeline CMS Created"`) is an operational CMS deployment marker rather than a biographical career milestone, but is active in the live timeline.
3. **Title Variation (ID #6):** Record #6 is titled `"Built & Deployed Sohail-Shop"` rather than `"Built & Deployed Sohail-Shop / Live B2B Fruit Wholesale Platform"`.
4. *Documentation-Only Discipline:* Per system constraints, these discrepancies are formally documented here without performing out-of-scope database alterations.

---

## 15. Pending & Deferred Work Breakdown

To prevent confusion between implemented architecture and future roadmaps, all uncompleted items are explicitly classified below:

| Feature / Task | Classification | Current State & Reason |
|---|---|---|
| **ProjectDetailPage Dynamic Neon Binding** | **PENDING** | Currently consumes hardcoded blueprint modules in `src/components/projects/*`; needs route param binding to `/api/devops/:id`. |
| **Homepage (Mission Control) Live Data** | **PENDING** | Uses `initialProjects` from `src/data/mission-control.ts`; needs binding to `/api/devops`. |
| **Academy & Atlas Dedicated Page Routes** | **PENDING** | Backend tables and `/api/*` handlers exist in Neon; frontend has no dedicated navigable page views. |
| **Admin UI Forms for Academy & Atlas** | **PLANNED** | Endpoints exist, but input forms in `AdminPage.tsx` are not yet implemented. |
| **Travel Posts API Endpoint (`/api/travel`)** | **DEFERRED** | Table `travel_posts` exists in Neon (migrated with 5 rows), but no Pages Function route is mounted. |
| **Cloudflare D1 Full Removal** | **DEFERRED** | `src/db/schema.ts` (SQLite) retained for rollback reference until production cutover is complete. |
| **Cloudflare Pages Production Deployment** | **PENDING VERIFICATION** | Requires configuring `DATABASE_URL`, `ADMIN_PASSWORD_HASH`, and `SESSION_SECRET` in Cloudflare Pages dashboard. |

---

## 16. Migration Status Matrix

```
┌───────────────────────────────────────────────┬──────────────────────┬────────────────────────────────────────────────────────┐
│ Area                                          │ Status               │ Repository Verification Evidence                       │
├───────────────────────────────────────────────┼──────────────────────┼────────────────────────────────────────────────────────┤
│ PostgreSQL Baseline Schema                    │ COMPLETED            │ src/db/schema.pg.ts (7 physical tables)                │
│ Drizzle Baseline Migration File               │ COMPLETED            │ drizzle/migrations-pg/0000_bouncy_prowler.sql          │
│ Cinema Schema Expansion (3.1)                 │ COMPLETED            │ drizzle/migrations-pg/0001_breezy_plazm.sql            │
│ Cinema API & Data Access (3.2)                │ COMPLETED            │ functions/api/movies/* (supports all 8 fields)         │
│ Cinema Content Backfill (3.3A)                │ COMPLETED            │ 9 movies verified in Neon with JioCloud/YouTube links  │
│ Cinema Frontend Wiring (3.3B)                 │ COMPLETED            │ CinemaPage.tsx, FeaturedMovie (zero fallback)          │
│ Timeline Schema Expansion                     │ COMPLETED            │ drizzle/migrations-pg/0002_dapper_timeline_events.sql  │
│ Timeline API Chronological Sorting            │ COMPLETED            │ functions/api/timeline/* (year ASC, event_date ASC)    │
│ Timeline Milestone Restoration                │ COMPLETED            │ 5 records verified in Neon (IDs 4, 5, 2, 6, 1)         │
│ Timeline Frontend Wiring                      │ COMPLETED            │ TimelinePage.tsx, AboutJourneyTimeline (zero fallback) │
│ Database Adapter (Neon HTTP Client)           │ COMPLETED            │ src/db/index.ts (drizzle-orm/neon-http + neon)         │
│ Local Dev Server API Proxy Middleware         │ COMPLETED            │ vite.config.ts (neon client + mockStore fallback)      │
│ Admin Authentication (PBKDF2 + HMAC Cookies)  │ COMPLETED            │ functions/api/auth/* & functions/api/_middleware.ts    │
│ Production Neon Cutover                       │ PENDING VERIFICATION │ Cloudflare Pages DATABASE_URL configuration pending    │
│ Remote D1 SQL Data Dump (d1-export.sql)       │ NOT IN REPOSITORY    │ Referenced in migration script, not committed          │
│ Legacy Cloudflare D1 / SQLite Schema          │ PRESERVED (LEGACY)   │ src/db/schema.ts retained for rollback reference       │
│ Git Branch State                              │ NOT VERIFIED         │ No .git directory present in runtime container         │
└───────────────────────────────────────────────┴──────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 17. Documentation Evidence

Every operational command, endpoint signature, and configuration requirement documented above was verified by inspecting:
- `package.json`
- `drizzle.config.ts`
- `vite.config.ts`
- `.dev.vars.example`
- `.env.example`
- `src/db/schema.pg.ts`
- `src/db/schema.ts`
- `src/db/index.ts`
- `src/lib/api.ts`
- `src/app/routes.tsx`
- `src/pages/AdminPage.tsx`
- `src/pages/CinemaPage.tsx`
- `src/components/cinema/CinemaFeaturedMovie.tsx`
- `src/components/cinema/CinemaMovieCarousel.tsx`
- `src/components/cinema/CinemaHero.tsx`
- `src/pages/TimelinePage.tsx`
- `src/components/about/AboutJourneyTimeline.tsx`
- `src/pages/ProjectsPage.tsx`
- `src/pages/ProjectDetailPage.tsx`
- `src/pages/DashboardPage.tsx`
- `src/pages/MissionControlPage.tsx`
- `functions/api/_middleware.ts`
- `functions/api/auth/login.ts`
- `functions/api/auth/logout.ts`
- `functions/api/auth/session.ts`
- `functions/api/auth/_utils.ts`
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

