import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import type { 
  InsertDream, 
  Dream, 
  Analysis, 
  DreamWithAnalysis 
} from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// === QUERY KEYS ===
const KEYS = {
  all: [api.dreams.list.path] as const,
  detail: (id: number) => [api.dreams.get.path, id] as const,
  search: (q: string) => [api.dreams.search.path, q] as const,
};

// === HOOKS ===

export function useDreams() {
  return useQuery({
    queryKey: KEYS.all,
    queryFn: async () => {
      const res = await fetch(api.dreams.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch dreams");
      const data = await res.json();
      return api.dreams.list.responses[200].parse(data);
    },
  });
}

export function useDream(id: number) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: async () => {
      const url = buildUrl(api.dreams.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch dream");
      const data = await res.json();
      return api.dreams.get.responses[200].parse(data);
    },
    enabled: !isNaN(id),
  });
}

export function useSearchDreams(query: string) {
  return useQuery({
    queryKey: KEYS.search(query),
    queryFn: async () => {
      if (!query) return [];
      const url = `${api.dreams.search.path}?q=${encodeURIComponent(query)}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      return api.dreams.search.responses[200].parse(data);
    },
    enabled: query.length > 2,
  });
}

export function useCreateDream() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (dream: InsertDream) => {
      const res = await fetch(api.dreams.create.path, {
        method: api.dreams.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dream),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create dream");
      }
      
      const data = await res.json();
      return api.dreams.create.responses[201].parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
      toast({ title: "Dream Recorded", description: "Your dream has been safely stored." });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useUpdateDream() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertDream>) => {
      const url = buildUrl(api.dreams.update.path, { id });
      const res = await fetch(url, {
        method: api.dreams.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update dream");
      const data = await res.json();
      return api.dreams.update.responses[200].parse(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
      queryClient.invalidateQueries({ queryKey: KEYS.detail(data.id) });
      toast({ title: "Dream Updated", description: "Changes saved successfully." });
    },
  });
}

export function useDeleteDream() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.dreams.delete.path, { id });
      const res = await fetch(url, { 
        method: api.dreams.delete.method,
        credentials: "include" 
      });
      
      if (!res.ok) throw new Error("Failed to delete dream");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
      toast({ title: "Dream Deleted", description: "The memory has been released." });
    },
  });
}

export function useAnalyzeDream() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.dreams.analyze.path, { id });
      const res = await fetch(url, {
        method: api.dreams.analyze.method,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      return api.dreams.analyze.responses[200].parse(data);
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: KEYS.detail(id) });
      toast({ title: "Analysis Complete", description: "New insights have been revealed." });
    },
    onError: () => {
      toast({ title: "Analysis Failed", description: "Could not interpret the dream at this time.", variant: "destructive" });
    }
  });
}
