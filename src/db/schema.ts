import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

/**
 * ==============================================================================
 * SOHAILVERSE v2.0 — DRIZZLE SCHEMA (Cloudflare D1 / SQLite Engine)
 * ==============================================================================
 * 
 * Target Database: Cloudflare D1 ("sohailverse-db")
 * Physical tables strictly match existing D1 tables to preserve 100% data integrity.
 */

// 1. MOVIES (Cinema Observatory Collection)
export const movies = sqliteTable("movies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  genre: text("genre"),
  rating: real("rating"),
  trailer_url: text("trailer_url"),
});

export type Movie = InferSelectModel<typeof movies>;
export type NewMovie = InferInsertModel<typeof movies>;

// 2. ACADEMY (Skills & Technology Mastery)
export const academy = sqliteTable("academy", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  skill: text("skill").notNull(),
  category: text("category"),
  level: text("level"),
});

export type AcademyItem = InferSelectModel<typeof academy>;
export type NewAcademyItem = InferInsertModel<typeof academy>;

// 3. DEVOPS (Portfolio Projects & Architecture Systems)
export const devops = sqliteTable("devops", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  category: text("category"),
  description: text("description"),
  image_url: text("image_url"),
  ppt_url: text("ppt_url"),
  github_url: text("github_url"),
  technologies: text("technologies"),
  highlights: text("highlights"),
  status: text("status"),
});

export type DevOpsProject = InferSelectModel<typeof devops>;
export type NewDevOpsProject = InferInsertModel<typeof devops>;

// 4. TIMELINE (Platform & Career Milestone History)
export const timeline = sqliteTable("timeline", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  category: text("category"),
  description: text("description"),
  created_at: text("created_at"),
});

export type TimelineEvent = InferSelectModel<typeof timeline>;
export type NewTimelineEvent = InferInsertModel<typeof timeline>;

// 5. ATLAS (World Travel Pins & Destinations)
export const atlas = sqliteTable("atlas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  country: text("country").notNull(),
  status: text("status"),
  year: text("year"),
  highlight: text("highlight"),
  created_at: text("created_at"),
});

export type Destination = InferSelectModel<typeof atlas>;
export type NewDestination = InferInsertModel<typeof atlas>;

/**
 * Semantic Application-Level Aliases (Without renaming physical D1 tables)
 */
export const destinations = atlas;
export const projects = devops;
export const academyTopics = academy;
export const timelineEvents = timeline;
