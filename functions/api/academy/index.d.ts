/**
 * SOHAILVERSE v2.0 — GET /api/academy
 *
 * Cloudflare Pages Function for retrieving Academy skills and certifications.
 * Queries Cloudflare D1 database ('sohailverse-db') via Drizzle ORM.
 */
import { D1Database } from "../../../src/db/index";
interface Env {
    DB?: D1Database;
}
interface PagesContext {
    request: Request;
    env: Env;
}
export declare function onRequestGet({ env }: PagesContext): Promise<Response>;
export {};
