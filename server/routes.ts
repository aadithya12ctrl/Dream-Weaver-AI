import type { Express } from "express";
import type { Server } from "http";
import { spawn } from "child_process";
import path from "path";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { isAuthenticated, registerAuthRoutes, setupAuth } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import { registerAudioRoutes } from "./replit_integrations/audio";
import { openai } from "./replit_integrations/image/client"; // Use configured openai client

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register Integration Routes
  await setupAuth(app);
  registerAuthRoutes(app);
  registerChatRoutes(app);
  registerImageRoutes(app);
  registerAudioRoutes(app);

  // === DREAMS API ===
  
  app.get(api.dreams.list.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const dreams = await storage.getDreams(userId);
    res.json(dreams);
  });

  app.get(api.dreams.get.path, isAuthenticated, async (req, res) => {
    const dream = await storage.getDream(Number(req.params.id));
    if (!dream) return res.status(404).json({ message: "Dream not found" });
    res.json(dream);
  });

  app.post(api.dreams.create.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const input = api.dreams.create.input.parse(req.body);
      const dream = await storage.createDream(userId, input);
      res.status(201).json(dream);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.dreams.update.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const input = api.dreams.update.input.parse(req.body);
    const dream = await storage.updateDream(Number(req.params.id), input);
    res.json(dream);
  });

  app.delete(api.dreams.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteDream(Number(req.params.id));
    res.status(204).send();
  });

  // === ANALYSIS & ML PIPELINE ===
  
  app.post(api.dreams.analyze.path, isAuthenticated, async (req, res) => {
    const dreamId = Number(req.params.id);
    const dream = await storage.getDream(dreamId);
    if (!dream) return res.status(404).json({ message: "Dream not found" });

    // 1. LLM Interpretation (Node.js/Replit AI)
    // We use the OpenAI integration here for the textual interpretation
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: "You are an expert Jungian dream analyst. Interpret this dream, identifying key symbols and psychological themes. Return JSON with keys: interpretation (string), symbols (array of strings), themes (array of strings), emotion (string), sentimentScore (number -100 to 100)." },
          { role: "user", content: dream.content }
        ],
        response_format: { type: "json_object" }
      });
      
      const llmResult = JSON.parse(completion.choices[0].message.content || "{}");
      
      // 2. Python ML Pipeline (Embeddings & Structural Analysis)
      // Spawns python process to generate embedding
      const pythonProcess = spawn("python3", [path.join(process.cwd(), "ml/analyze.py")]);
      
      let pythonData = "";
      let pythonError = "";

      pythonProcess.stdin.write(JSON.stringify({ content: dream.content }));
      pythonProcess.stdin.end();

      pythonProcess.stdout.on("data", (data) => {
        pythonData += data.toString();
      });
      
      pythonProcess.stderr.on("data", (data) => {
        pythonError += data.toString();
      });

      pythonProcess.on("close", async (code) => {
        if (code !== 0) {
          console.error("Python ML script failed:", pythonError);
          // Fallback if Python fails: save LLM results only
        }

        let embedding = [];
        try {
          if (pythonData) {
            const pyResult = JSON.parse(pythonData);
            embedding = pyResult.embedding || [];
          }
        } catch (e) {
          console.error("Failed to parse Python output", e);
        }

        // 3. Save Analysis
        const analysis = await storage.createAnalysis({
          dreamId: dream.id,
          interpretation: llmResult.interpretation || "Analysis failed.",
          symbols: llmResult.symbols || [],
          themes: llmResult.themes || [],
          patterns: { embedding_generated: embedding.length > 0 }, // Store metadata
        });

        // Update dream with metadata
        await storage.updateDream(dream.id, {
          emotion: llmResult.emotion,
          sentimentScore: llmResult.sentimentScore,
          embedding: embedding // Save embedding to dream table
        });

        res.json(analysis);
      });

    } catch (error) {
      console.error("Analysis failed:", error);
      res.status(500).json({ message: "Analysis failed" });
    }
  });

  return httpServer;
}
