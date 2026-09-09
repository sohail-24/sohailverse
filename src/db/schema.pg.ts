import {
  pgTable,
  integer,
  text,
  real,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

import {
  type InferSelectModel,
  type InferInsertModel,
} from "drizzle-orm";

/**
 * ==============================================================================
 * SOHAILVERSE v2.0 — POSTGRESQL / NEON SCHEMA
 * ==============================================================================
 *
 * Source of truth:
 *   Production Cloudflare D1 export: d1-export.sql
 *
 * Migration principle:
 *   Preserve the existing production D1 physical table names and column
 *   semantics. Do not merge, rename, or invent tables during migration.
 *
 * PostgreSQL target:
 *   Neon PostgreSQL
 *
 * IMPORTANT:
 *   This schema is intentionally separate from src/db/schema.ts.
 *   The existing D1 implementation remains untouched until PostgreSQL
 *   migration and validation are complete.
 */

// 1. MOVIES
export const movies = pgTable("movies", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: text("title").notNull(),
  genre: text("genre").notNull(),
  rating: real("rating").notNull(),
  trailerUrl: text("trailer_url"),
  posterUrl: text("poster_url"),
  synopsis: text("synopsis"),
  isFeatured: boolean("is_featured").default(false),
});

export type Movie = InferSelectModel<typeof movies>;
export type NewMovie = InferInsertModel<typeof movies>;

// 2. TRAVEL POSTS
export const travelPosts = pgTable("travel_posts", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  description: text("description"),
});

export type TravelPost = InferSelectModel<typeof travelPosts>;
export type NewTravelPost = InferInsertModel<typeof travelPosts>;

// 3. ACADEMY POSTS
export const academyPosts = pgTable("academy_posts", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  skill: text("skill").notNull(),
  category: text("category").notNull(),
  level: text("level").notNull(),
});

export type AcademyPost = InferSelectModel<typeof academyPosts>;
export type NewAcademyPost = InferInsertModel<typeof academyPosts>;

// 4. DEVOPS POSTS
export const devopsPosts = pgTable("devops_posts", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: false,
    mode: "string",
  })
    .notNull()
    .defaultNow(),
});

export type DevOpsPost = InferSelectModel<typeof devopsPosts>;
export type NewDevOpsPost = InferInsertModel<typeof devopsPosts>;

// 5. TIMELINE POSTS
export const timelinePosts = pgTable("timeline_posts", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  year: text("year"),
  eventDate: text("event_date"),
  createdAt: timestamp("created_at", {
    withTimezone: false,
    mode: "string",
  })
    .notNull()
    .defaultNow(),
});

export type TimelinePost = InferSelectModel<typeof timelinePosts>;
export type NewTimelinePost = InferInsertModel<typeof timelinePosts>;

// 6. ATLAS POSTS
export const atlasPosts = pgTable("atlas_posts", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  country: text("country").notNull(),
  status: text("status").notNull(),
  year: text("year").notNull(),
  highlight: text("highlight").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: false,
    mode: "string",
  })
    .notNull()
    .defaultNow(),
});

export type AtlasPost = InferSelectModel<typeof atlasPosts>;
export type NewAtlasPost = InferInsertModel<typeof atlasPosts>;

// 7. DEVOPS PROJECTS
export const devopsProjects = pgTable("devops_projects", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: text("title"),
  category: text("category"),
  description: text("description"),
  imageUrl: text("image_url"),
  pptUrl: text("ppt_url"),
  githubUrl: text("github_url"),
  technologies: text("technologies"),
  highlights: text("highlights"),
  status: text("status"),
});

export type DevOpsProject = InferSelectModel<typeof devopsProjects>;
export type NewDevOpsProject = InferInsertModel<typeof devopsProjects>;

/**
 * Application-level aliases.
 *
 * These aliases are intentionally semantic and do NOT rename the physical
 * PostgreSQL tables.
 */
export const academy = academyPosts;
export const devops = devopsProjects;
export const timeline = timelinePosts;
export const atlas = atlasPosts;
export const destinations = atlasPosts;
export const projects = devopsProjects;
export const academyTopics = academyPosts;
export const timelineEvents = timelinePosts;
