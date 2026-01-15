import { db } from "./db";
import { 
  dreams, analyses, 
  type Dream, type InsertDream, type UpdateDreamRequest,
  type Analysis, type InsertAnalysis
} from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Dreams
  getDreams(userId: string): Promise<(Dream & { analysis?: Analysis | null })[]>;
  getDream(id: number): Promise<(Dream & { analysis?: Analysis | null }) | undefined>;
  createDream(userId: string, dream: InsertDream): Promise<Dream>;
  updateDream(id: number, updates: UpdateDreamRequest): Promise<Dream>;
  deleteDream(id: number): Promise<void>;
  
  // Analysis
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysis(dreamId: number): Promise<Analysis | undefined>;
  
  // Vector/Similarity (Simple placeholder or pgvector if enabled)
  // We will handle similarity in Python or via raw SQL if pgvector exists
}

export class DatabaseStorage implements IStorage {
  async getDreams(userId: string) {
    // Join with analysis
    const results = await db.query.dreams.findMany({
      where: eq(dreams.userId, userId),
      orderBy: [desc(dreams.date)],
      with: {
        analysis: true
      }
    });
    return results;
  }

  async getDream(id: number) {
    return db.query.dreams.findFirst({
      where: eq(dreams.id, id),
      with: {
        analysis: true
      }
    });
  }

  async createDream(userId: string, dream: InsertDream) {
    const [newDream] = await db.insert(dreams).values({ ...dream, userId }).returning();
    return newDream;
  }

  async updateDream(id: number, updates: UpdateDreamRequest) {
    const [updated] = await db.update(dreams)
      .set(updates)
      .where(eq(dreams.id, id))
      .returning();
    return updated;
  }

  async deleteDream(id: number) {
    await db.delete(dreams).where(eq(dreams.id, id));
  }

  async createAnalysis(analysis: InsertAnalysis) {
    const [newAnalysis] = await db.insert(analyses).values(analysis).returning();
    return newAnalysis;
  }

  async getAnalysis(dreamId: number) {
    return db.query.analyses.findFirst({
      where: eq(analyses.dreamId, dreamId)
    });
  }
}

export const storage = new DatabaseStorage();
