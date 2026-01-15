import { pgTable, text, serial, integer, boolean, timestamp, jsonb, vector } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Import Auth and Chat models
export * from "./models/auth";
export * from "./models/chat";

import { users } from "./models/auth";

// === DREAMS TABLE ===
export const dreams = pgTable("dreams", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // References auth.users.id (which is varchar)
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: timestamp("date").notNull(),
  emotion: text("emotion"), // Primary emotion
  sentimentScore: integer("sentiment_score"), // -100 to 100
  embedding: jsonb("embedding"), // Store as JSON array for compatibility
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// === ANALYSIS TABLE ===
export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  dreamId: integer("dream_id").notNull().references(() => dreams.id),
  interpretation: text("interpretation").notNull(), // LLM generated
  symbols: jsonb("symbols"), // Extracted entities/symbols
  themes: jsonb("themes"), // Detected themes
  patterns: jsonb("patterns"), // Temporal/recurrence data
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===
export const dreamsRelations = relations(dreams, ({ one, many }) => ({
  user: one(users, {
    fields: [dreams.userId],
    references: [users.id],
  }),
  analysis: one(analyses, {
    fields: [dreams.id],
    references: [analyses.dreamId],
  }),
}));

export const analysesRelations = relations(analyses, ({ one }) => ({
  dream: one(dreams, {
    fields: [analyses.dreamId],
    references: [dreams.id],
  }),
}));

// === SCHEMAS ===
export const insertDreamSchema = createInsertSchema(dreams, {
  date: z.string().transform((str) => new Date(str)),
}).omit({ 
  id: true, 
  createdAt: true, 
  userId: true,
  embedding: true,
  sentimentScore: true 
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({ 
  id: true, 
  createdAt: true 
});

// === TYPES ===
export type Dream = typeof dreams.$inferSelect;
export type InsertDream = z.infer<typeof insertDreamSchema>;
export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;

// Request Types
export type CreateDreamRequest = InsertDream;
export type UpdateDreamRequest = Partial<InsertDream>;

// Response Types
export type DreamWithAnalysis = Dream & { analysis?: Analysis | null };
