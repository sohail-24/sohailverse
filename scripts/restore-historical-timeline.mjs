/**
 * SOHAILVERSE v2.0 — Phase 3.4B: Restore Historical Timeline into Neon
 * Idempotent restoration script for timeline_posts in Neon PostgreSQL.
 */

import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not defined.");
}

const sql = neon(process.env.DATABASE_URL);

async function restoreTimeline() {
  console.log("==================================================");
  console.log("PHASE 3.4B: RESTORE HISTORICAL TIMELINE INTO NEON");
  console.log("==================================================");

  // 1. Ensure columns exist
  await sql`ALTER TABLE "timeline_posts" ADD COLUMN IF NOT EXISTS "year" text`;
  await sql`ALTER TABLE "timeline_posts" ADD COLUMN IF NOT EXISTS "event_date" text`;
  console.log("✓ Verified schema columns: year, event_date");

  // 2. Reconcile Record 1: "Timeline CMS Created"
  await sql`
    UPDATE "timeline_posts"
    SET
      "year" = '2026',
      "event_date" = '2026-06-16'
    WHERE "id" = 1
  `;
  console.log("✓ Reconciled Record 1: Timeline CMS Created (2026)");

  // 3. Reconcile Record 2: "Internship at Visys Company" (reconciled with Job in Visys)
  await sql`
    UPDATE "timeline_posts"
    SET
      "title" = 'Internship at Visys Company',
      "category" = 'Career & Systems',
      "description" = 'Hands-on engineering internship contributing to cloud automation, business systems, and production pipelines.',
      "year" = '2025',
      "event_date" = '2025-12-20'
    WHERE "id" = 2
  `;
  console.log("✓ Reconciled Record 2: Internship at Visys Company (2025)");

  // 4. Ensure 2023 milestone: "Completed Engineering Degree"
  const existing2023 = await sql`
    SELECT id FROM "timeline_posts"
    WHERE "title" ILIKE '%Engineering Degree%' OR "title" ILIKE '%Completed Engineering%'
  `;
  if (existing2023.length === 0) {
    await sql`
      INSERT INTO "timeline_posts" ("title", "category", "description", "year", "event_date", "created_at")
      VALUES (
        'Completed Engineering Degree',
        'Education',
        'Graduated with an Engineering degree, establishing a comprehensive foundation in algorithms and computer systems.',
        '2023',
        '2023-06-20',
        '2023-06-20 00:00:00'
      )
    `;
    console.log("✓ Inserted 2023 milestone: Completed Engineering Degree");
  } else {
    await sql`
      UPDATE "timeline_posts"
      SET
        "title" = 'Completed Engineering Degree',
        "category" = 'Education',
        "description" = 'Graduated with an Engineering degree, establishing a comprehensive foundation in algorithms and computer systems.',
        "year" = '2023',
        "event_date" = '2023-06-20'
      WHERE "id" = ${existing2023[0].id}
    `;
    console.log(`✓ Updated existing 2023 milestone (ID ${existing2023[0].id})`);
  }

  // 5. Ensure 2024 milestone: "Saudi Arabia Journey & AWS / DevOps Genesis"
  const existing2024 = await sql`
    SELECT id FROM "timeline_posts"
    WHERE "title" ILIKE '%Saudi Arabia%'
  `;
  if (existing2024.length === 0) {
    await sql`
      INSERT INTO "timeline_posts" ("title", "category", "description", "year", "event_date", "created_at")
      VALUES (
        'Saudi Arabia Journey & AWS / DevOps Genesis',
        'Exploration & Learning',
        'Traveled to Saudi Arabia and initiated deep-dive mastery into AWS Cloud and DevOps architecture.',
        '2024',
        '2024-03-10',
        '2024-03-10 00:00:00'
      )
    `;
    console.log("✓ Inserted 2024 milestone: Saudi Arabia Journey & AWS / DevOps Genesis");
  } else {
    await sql`
      UPDATE "timeline_posts"
      SET
        "title" = 'Saudi Arabia Journey & AWS / DevOps Genesis',
        "category" = 'Exploration & Learning',
        "description" = 'Traveled to Saudi Arabia and initiated deep-dive mastery into AWS Cloud and DevOps architecture.',
        "year" = '2024',
        "event_date" = '2024-03-10'
      WHERE "id" = ${existing2024[0].id}
    `;
    console.log(`✓ Updated existing 2024 milestone (ID ${existing2024[0].id})`);
  }

  // 6. Ensure 2026 milestone: "Built & Deployed Sohail-Shop"
  const existingShop = await sql`
    SELECT id FROM "timeline_posts"
    WHERE "title" ILIKE '%Sohail-Shop%'
  `;
  if (existingShop.length === 0) {
    await sql`
      INSERT INTO "timeline_posts" ("title", "category", "description", "year", "event_date", "created_at")
      VALUES (
        'Built & Deployed Sohail-Shop',
        'Systems & Cloud',
        'Engineered scalable e-commerce infrastructure with multi-vendor support, Docker containers, and Kubernetes deployment.',
        '2026',
        '2026-01-15',
        '2026-01-15 00:00:00'
      )
    `;
    console.log("✓ Inserted 2026 milestone: Built & Deployed Sohail-Shop");
  } else {
    await sql`
      UPDATE "timeline_posts"
      SET
        "title" = 'Built & Deployed Sohail-Shop',
        "category" = 'Systems & Cloud',
        "description" = 'Engineered scalable e-commerce infrastructure with multi-vendor support, Docker containers, and Kubernetes deployment.',
        "year" = '2026',
        "event_date" = '2026-01-15'
      WHERE "id" = ${existingShop[0].id}
    `;
    console.log(`✓ Updated existing 2026 milestone (ID ${existingShop[0].id})`);
  }

  // 7. Reset sequence to MAX(id)
  await sql`
    SELECT setval(pg_get_serial_sequence('timeline_posts', 'id'), COALESCE((SELECT MAX(id) FROM "timeline_posts"), 1), true)
  `;
  console.log("✓ Reset PostgreSQL identity sequence timeline_posts_id_seq to MAX(id)");

  // 8. Validate all rows in Neon
  const rows = await sql`
    SELECT id, title, category, year, event_date, created_at, description
    FROM "timeline_posts"
    ORDER BY COALESCE(year, '2026') ASC, COALESCE(event_date, created_at::text) ASC, id ASC
  `;

  console.log("\n==================================================");
  console.log(`CURRENT NEON TIMELINE RECORDS (Total: ${rows.length})`);
  console.log("==================================================");
  rows.forEach((r) => {
    console.log(`[ID ${r.id}] ${r.year} (${r.event_date}) - [${r.category}] ${r.title}`);
    console.log(`       ${r.description}`);
  });
}

restoreTimeline()
  .then(() => {
    console.log("\nRestoration successfully finished!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Restoration failed:", err);
    process.exit(1);
  });
