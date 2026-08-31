/**
 * SOHAILVERSE v2.0 — GET /api/devops
 *
 * Cloudflare Pages Function for retrieving DevOps portfolio projects.
 * Queries Cloudflare D1 database ('sohailverse-db') via Drizzle ORM.
 */
import { createDb, devops } from "../../../src/db/index";
import { desc } from "drizzle-orm";
export async function onRequestGet({ env }) {
    if (!env.DB) {
        return new Response(JSON.stringify({ error: "D1 Database binding 'DB' is not configured." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
    try {
        const db = createDb(env.DB);
        const records = await db.select().from(devops).orderBy(desc(devops.id));
        return new Response(JSON.stringify({ data: records }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    catch (error) {
        console.error("Error querying devops from D1:", error);
        return new Response(JSON.stringify({ error: "Unable to retrieve data" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
