import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull().default("gen_random_uuid()"),
  email: varchar("email").unique().notNull(),
  password: varchar("password"), // For email/password auth
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  googleId: varchar("google_id").unique(), // For Google OAuth
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Apps table
export const apps = pgTable("apps", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  slug: varchar("slug").unique(),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  templateId: integer("template_id").references(() => templates.id),
  status: varchar("status").notNull().default("draft"), // draft, published, archived
  config: jsonb("config"), // App configuration and workflow
  isPublic: boolean("is_public").default(false),
  price: real("price").default(0),
  downloads: integer("downloads").default(0),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Templates table
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  icon: varchar("icon").notNull(),
  config: jsonb("config"), // Template configuration
  usage: integer("usage").default(0),
  rating: real("rating").default(0),
  isPopular: boolean("is_popular").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community Posts table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  content: text("content"),
  userId: varchar("user_id").notNull().references(() => users.id),
  category: varchar("category").notNull(),
  replies: integer("replies").default(0),
  likes: integer("likes").default(0),
  isHighlighted: boolean("is_highlighted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // app_review, community_follow, revenue, etc.
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// User stats table
export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  appsCreated: integer("apps_created").default(0),
  totalDownloads: integer("total_downloads").default(0),
  totalRevenue: real("total_revenue").default(0),
  credits: real("credits").default(0),
  rank: integer("rank").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertApp = typeof apps.$inferInsert;
export type App = typeof apps.$inferSelect;

export type Template = typeof templates.$inferSelect;

export type Post = typeof posts.$inferSelect;

export type Notification = typeof notifications.$inferSelect;

export type UserStats = typeof userStats.$inferSelect;

// Insert schemas
export const insertAppSchema = createInsertSchema(apps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
