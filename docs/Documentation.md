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

The active database schema (`src/db/schema.pg.ts`) and Drizzle migration (`drizzle/migrations-pg/0000_bouncy_prowler.sql`) define exactly seven physical tables:

| Physical Table | Column | Type | Nullable? | Purpose |
|---|---|---|---|---|
| **`movies`** | `id` | `integer` | NO (PK Identity) | Unique movie identifier |
| | `title` | `text` | NO | Movie title |
| | `genre` | `text` | NO | Movie category/genre (e.g., Sci-Fi, Drama) |
| | `rating` | `real` | NO | Numerical rating (e.g., 9.5) |
| | `trailer_url` | `text` | YES | External video or trailer URL (e.g., YouTube) |
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
| | `description` | `text` | NO | Milestone summary description |
| | `created_at` | `timestamp` | NO (default now()) | Timestamp of occurrence |
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
│ /api/movies             │ GET    │ movies                │ Returns { data: Movie[] } ordered by id DESC.          │
│ /api/movies             │ POST   │ movies                │ [Auth] Body: { title, genre, rating, trailer_url }.   │
│                         │        │                       │ Returns { success: true, data: Movie }.                │
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/movies/:id         │ PUT    │ movies                │ [Auth] Updates movie by ID. Returns updated Movie.     │
│ /api/movies/:id         │ DELETE │ movies                │ [Auth] Deletes movie by ID. Returns { success: true }. │
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/devops             │ GET    │ devops_projects       │ Returns { data: DevOpsProject[] } ordered by id DESC.  │
│ /api/devops             │ POST   │ devops_projects       │ [Auth] Body: project attributes. Returns created item. │
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/devops/:id         │ PUT    │ devops_projects       │ [Auth] Updates project by ID. Returns updated item.    │
│ /api/devops/:id         │ DELETE │ devops_projects       │ [Auth] Deletes project by ID. Returns { success: true}.│
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/timeline           │ GET    │ timeline_posts        │ Returns { data: TimelinePost[] } ordered by id DESC.   │
│ /api/timeline           │ POST   │ timeline_posts        │ [Auth] Body: { title, category, description }.         │
├─────────────────────────┼────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ /api/timeline/:id       │ PUT    │ timeline_posts        │ [Auth] Updates timeline post by ID.                    │
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
1. **Movies:**
   - Add new movie (Title, Genre, Rating, Trailer URL).
   - View live list with ID, Title, Rating, and Trailer link.
   - Delete movie with confirmation prompt.
2. **DevOps Posts / Projects:**
   - Add new project/post (Title, Category, Description).
   - View live list of registered DevOps entries.
   - Delete project with confirmation prompt.
3. **Timeline Posts:**
   - Add new milestone (Title, Category, Description).
   - View chronological history list.
   - Delete milestone with confirmation prompt.

*(Note: While `/api/academy` and `/api/atlas` endpoints exist, their forms are currently not rendered in `AdminPage.tsx`.)*

---

## 7. Frontend Pages & Routes

The application routing is declared in `src/app/routes.tsx` using `createBrowserRouter`:

| Route Path | Component File | Primary Purpose | Data Source |
|---|---|---|---|
| `/` | `src/pages/MissionControlPage.tsx` | Platform home page, 3D Earth, telemetry, and project carousel | `src/data/mission-control.ts` |
| `/cinema` | `src/pages/CinemaPage.tsx` | Cinema Observatory catalog with video player | `GET /api/movies` (fallback: `src/lib/api.ts`) |
| `/devops` | `src/pages/DevOpsPage.tsx` | Engineering laboratory & DevOps project directory | `GET /api/devops` (fallback: `src/lib/api.ts`) |
| `/devops/:id` | `src/pages/ProjectDetailPage.tsx` | Architectural blueprints, incident logs, and metrics | `src/components/projects/*` |
| `/timeline` | `src/pages/TimelinePage.tsx` | Chronological career progression and milestones | `GET /api/timeline` (fallback: `src/lib/api.ts`) |
| `/about` | `src/pages/TimelinePage.tsx` | Alias pointing to `TimelinePage` | `GET /api/timeline` |
| `/projects` | `src/pages/ProjectsPage.tsx` | Unified portfolio showcase with status filters | `loadUnifiedProjects()` (`src/components/projects/projectData.ts`) |
| `/projects/:id`| `src/pages/ProjectDetailPage.tsx` | Deep architectural view for selected project | `src/components/projects/*` |
| `/dashboard` | `src/pages/DashboardPage.tsx` | Aggregated telemetry, metric charts, and data counts | `GET /api/movies`, `GET /api/devops`, `GET /api/timeline` |
| `/admin` | `src/pages/AdminPage.tsx` | Content management console | `/api/auth/*`, `/api/movies`, `/api/devops`, `/api/timeline` |
| `/console` | `src/pages/AdminPage.tsx` | Alias pointing to `AdminPage` | `/api/auth/*` |

---

## 8. Media & Content

### Database vs. Storage Tiers
- **PostgreSQL Database:** Holds only relational records, metadata, text strings, and remote URLs (`trailer_url`, `image_url`, `ppt_url`, `github_url`). **No binary files or base64 images are stored in PostgreSQL.**
- **Physical Assets in `public/`:**
  - `public/movies/`: High-resolution movie backdrops.
  - `public/cinema/`: Projector hero imagery and genre backgrounds.
  - `public/projects/temporary/`: Vector-derived project mockups.
  - `public/dev-real-*.jpg` & `public/real-dev-*.jpg`: Production engineering photography.
  - `public/resume.pdf`: Career documentation.
- **External Video & Repositories:** Video playback is powered by external YouTube embeds; source code links route to GitHub.

---

## 9. Naming & API Contract

### Field Name Mapping
- **Database Column (PostgreSQL):** Uses standard SQL `snake_case` (e.g., `image_url`, `ppt_url`, `github_url`, `trailer_url`, `created_at`).
- **Drizzle Schema Mapping (`src/db/schema.pg.ts`):** Maps SQL columns to TypeScript properties:
  - `imageUrl: text("image_url")`
  - `pptUrl: text("ppt_url")`
  - `githubUrl: text("github_url")`
  - `trailerUrl: text("trailer_url")`
  - `createdAt: timestamp("created_at")`
- **API Payload Contract (`functions/api/*`):** Consistently outputs and accepts `snake_case` JSON properties (`image_url`, `trailer_url`, etc.) to maintain parity with PostgreSQL columns and prevent frontend serialization bugs.

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
| **Fallback data displays in UI** | The frontend `fetchApi` function encountered an error or unconfigured API and activated client-side fallback data. | Verify database connectivity and ensure API endpoints return HTTP 200 with `{ data: [...] }`. |
| **"Unauthorized: Valid admin session required."** | A mutating request (POST, PUT, DELETE) was made without a valid `sv_admin_session` cookie. | Log in via `/admin` first to establish a session before making mutations. |
| **"Invalid credentials." on login** | The submitted password does not match `ADMIN_PASSWORD_HASH` or `ADMIN_PASSWORD`. | Check `ADMIN_PASSWORD_HASH` in `.dev.vars` or regenerate a hash using `scripts/generate-password-hash.js`. |
| **`scripts/migrate-d1-to-neon.mjs` fails: "Cannot find d1-export.sql"** | The SQLite export dump was not exported from Cloudflare D1 before running the migration script. | Export your D1 database using `npx wrangler d1 execute <db-name> --command=".dump" > d1-export.sql` at project root. |

---

## 12. Migration Status Matrix

```
┌───────────────────────────────────────────────┬──────────────────────┬────────────────────────────────────────────────────────┐
│ Area                                          │ Status               │ Repository Verification Evidence                       │
├───────────────────────────────────────────────┼──────────────────────┼────────────────────────────────────────────────────────┤
│ PostgreSQL Schema Definition                  │ COMPLETED            │ src/db/schema.pg.ts (7 physical tables)                │
│ Drizzle PostgreSQL Migration File             │ COMPLETED            │ drizzle/migrations-pg/0000_bouncy_prowler.sql          │
│ Database Adapter (Neon HTTP Client)           │ COMPLETED            │ src/db/index.ts (drizzle-orm/neon-http + neon)         │
│ Pages Functions PostgreSQL API Handlers       │ COMPLETED            │ functions/api/* (queries schema.pg.ts tables)          │
│ Local Dev Server API Proxy Middleware         │ COMPLETED            │ vite.config.ts (neon client + mockStore fallback)      │
│ Admin Authentication (PBKDF2 + HMAC Cookies)  │ COMPLETED            │ functions/api/auth/* & functions/api/_middleware.ts    │
│ Production Neon Cutover                       │ IN PROGRESS          │ Cloudflare Pages DATABASE_URL configuration pending    │
│ Remote D1 SQL Data Dump (d1-export.sql)       │ NOT IN REPOSITORY    │ Referenced in migration script, not committed          │
│ Legacy Cloudflare D1 / SQLite Schema          │ PRESERVED (LEGACY)   │ src/db/schema.ts retained for rollback reference       │
│ Git Branch State                              │ NOT VERIFIED         │ No .git directory present in runtime container         │
└───────────────────────────────────────────────┴──────────────────────┴────────────────────────────────────────────────────────┘
```

---

## Documentation Evidence

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
