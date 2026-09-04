import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set.");
}

const exportPath = "d1-export.sql";
const exportSql = readFileSync(exportPath, "utf8");

const sqlite = new DatabaseSync(":memory:");
sqlite.exec(exportSql);

const sql = neon(process.env.DATABASE_URL);

const tables = [
  {
    name: "movies",
    columns: ["id", "title", "genre", "rating", "trailer_url"],
  },
  {
    name: "travel_posts",
    columns: ["id", "country", "city", "description"],
  },
  {
    name: "academy_posts",
    columns: ["id", "skill", "category", "level"],
  },
  {
    name: "devops_posts",
    columns: ["id", "title", "category", "description", "created_at"],
  },
  {
    name: "timeline_posts",
    columns: ["id", "title", "category", "description", "created_at"],
  },
  {
    name: "atlas_posts",
    columns: ["id", "country", "status", "year", "highlight", "created_at"],
  },
  {
    name: "devops_projects",
    columns: [
      "id",
      "title",
      "category",
      "description",
      "image_url",
      "ppt_url",
      "github_url",
      "technologies",
      "highlights",
      "status",
    ],
  },
];

console.log("=================================================");
console.log("SOHAILVERSE D1 → NEON DATA MIGRATION");
console.log("=================================================");

console.log("\nSource: d1-export.sql");
console.log("Target: Neon PostgreSQL");
console.log("Mode: exact row migration with original IDs\n");

// Safety check: target must be empty.
for (const table of tables) {
  const result = await sql.query(
    `SELECT COUNT(*)::int AS count FROM "${table.name}"`
  );

  const count = Number(result[0].count);

  if (count !== 0) {
    throw new Error(
      `SAFETY STOP: Neon table "${table.name}" already contains ${count} rows.`
    );
  }
}

console.log("Safety check: all 7 Neon tables are empty. PASS\n");

let totalSourceRows = 0;
let totalInsertedRows = 0;

for (const table of tables) {
  const rows = sqlite
    .prepare(`SELECT * FROM "${table.name}" ORDER BY id`)
    .all();

  const sourceCount = rows.length;
  totalSourceRows += sourceCount;

  console.log(`${table.name}: ${sourceCount} source rows`);

  for (const row of rows) {
    const placeholders = table.columns.map((_, i) => `$${i + 1}`).join(", ");
    const columnSql = table.columns.map((column) => `"${column}"`).join(", ");
    const values = table.columns.map((column) => row[column]);

    await sql.query(
      `INSERT INTO "${table.name}" (${columnSql}) VALUES (${placeholders})`,
      values
    );

    totalInsertedRows++;
  }

  const targetResult = await sql.query(
    `SELECT COUNT(*)::int AS count FROM "${table.name}"`
  );

  const targetCount = Number(targetResult[0].count);

  if (targetCount !== sourceCount) {
    throw new Error(
      `VALIDATION FAILED: ${table.name}: source=${sourceCount}, target=${targetCount}`
    );
  }

  console.log(`  → Neon: ${targetCount} rows PASS`);
}

// Reset PostgreSQL identity sequences to the imported maximum IDs.
console.log("\nResetting PostgreSQL identity sequences...");

for (const table of tables) {
  const maxResult = await sql.query(
    `SELECT COALESCE(MAX(id), 0)::int AS max_id FROM "${table.name}"`
  );

  const maxId = Number(maxResult[0].max_id);

  if (maxId > 0) {
    await sql.query(
      `SELECT setval(pg_get_serial_sequence($1, 'id'), $2, true)`,
      [table.name, maxId]
    );
  }

  console.log(`  ${table.name}: sequence → ${maxId}`);
}

// Final validation.
console.log("\n=================================================");
console.log("FINAL VALIDATION");
console.log("=================================================");

let finalTargetRows = 0;

for (const table of tables) {
  const sourceRows = sqlite
    .prepare(`SELECT * FROM "${table.name}" ORDER BY id`)
    .all();

  const targetResult = await sql.query(
    `SELECT * FROM "${table.name}" ORDER BY id`
  );

  const targetRows = targetResult;

  if (sourceRows.length !== targetRows.length) {
    throw new Error(
      `FINAL COUNT MISMATCH: ${table.name}: source=${sourceRows.length}, target=${targetRows.length}`
    );
  }

  for (let i = 0; i < sourceRows.length; i++) {
    for (const column of table.columns) {
      const sourceValue = sourceRows[i][column];
      const targetValue = targetRows[i][column];

      const normalizeValue = (value) => {
        if (value instanceof Date) {
          return value.toISOString().slice(0, 19).replace("T", " ");
        }

        return String(value ?? "");
      };

      if (normalizeValue(sourceValue) !== normalizeValue(targetValue)) {
        throw new Error(
          `FINAL DATA MISMATCH: ${table.name}, row ${i + 1}, column ${column}\n` +
          `source=${sourceValue}\n` +
          `target=${targetValue}`
        );
      }
    }
  }

  finalTargetRows += targetRows.length;

  console.log(`✓ ${table.name}: ${targetRows.length}/${sourceRows.length} exact`);
}

if (totalSourceRows !== totalInsertedRows) {
  throw new Error(
    `INSERT COUNT MISMATCH: source=${totalSourceRows}, inserted=${totalInsertedRows}`
  );
}

console.log("\n=================================================");
console.log("MIGRATION COMPLETE");
console.log("=================================================");
console.log(`Source rows:   ${totalSourceRows}`);
console.log(`Inserted rows: ${totalInsertedRows}`);
console.log(`Target rows:   ${finalTargetRows}`);
console.log("Exact data validation: PASS");
console.log("Original IDs preserved: PASS");
console.log("Identity sequences reset: PASS");
