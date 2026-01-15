import { useDreams } from "@/hooks/use-dreams";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { DreamCard } from "@/components/DreamCard";
import { EmotionChart } from "@/components/EmotionChart";
import { Plus, Sparkles, Brain, ArrowRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: dreams, isLoading } = useDreams();
  
  const { data: weeklyAnalysis, isLoading: isLoadingWeekly } = useQuery({
    queryKey: ["/api/dreams/analysis/weekly"],
    enabled: !!dreams,
  });

  if (isLoading) {
    return (
      <div className="container px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse">Summoning your dreams...</p>
        </div>
      </div>
    );
  }

  const recentDreams = dreams?.slice(0, 3) || [];
  const totalDreams = dreams?.length || 0;
  const analyzedCount = dreams?.filter(d => d.analysis).length || 0;

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              Welcome back, <span className="text-gradient">{user?.firstName || 'Dreamer'}</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-xl mb-8"
            >
              Your subconscious has been busy. You have recorded <span className="text-white font-medium">{totalDreams} dreams</span> and uncovered insights in <span className="text-white font-medium">{analyzedCount}</span> of them.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-4"
            >
              <Link href="/new">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                  <Plus className="mr-2 w-5 h-5" />
                  Record New Dream
                </Button>
              </Link>
              <Link href="/journal">
                <Button size="lg" variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
                  View Journal
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Recent Dreams */}
        <div className="lg:col-span-2 space-y-8">
          {/* Weekly Insights Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 rounded-3xl border-primary/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Brain className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold">Weekly Psychological Synthesis</h2>
            </div>
            
            {isLoadingWeekly ? (
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-4 h-4 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                Aggregating subconscious patterns...
              </div>
            ) : weeklyAnalysis?.synthesis ? (
              <div className="space-y-6">
                <p className="text-lg leading-relaxed text-muted-foreground italic">
                  "{weeklyAnalysis.synthesis}"
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-primary/70">Recurring Archetypes</h4>
                    <div className="flex flex-wrap gap-2">
                      {weeklyAnalysis.archetypes?.map((a: string) => (
                        <span key={a} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-400/70">Emotional Climate</h4>
                    <p className="text-sm text-muted-foreground">{weeklyAnalysis.emotional_climate}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Record more dreams this week to unlock deeper psychological patterns.</p>
            )}
          </motion.div>

          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Recent Dreams
            </h2>
            <Link href="/journal" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid gap-6">
            {recentDreams.length > 0 ? (
              recentDreams.map((dream, i) => (
                <DreamCard key={dream.id} dream={dream} index={i} />
              ))
            ) : (
              <div className="p-8 border border-dashed border-white/10 rounded-2xl bg-white/5 text-center">
                <p className="text-muted-foreground mb-4">No dreams recorded yet.</p>
                <Link href="/new">
                  <Button variant="secondary">Start Your Journal</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Stats & Trends */}
        <div className="space-y-8">
          {/* Trends Card */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="w-5 h-5 text-blue-400" />
              <h3 className="font-display font-semibold text-lg">Emotional Landscape</h3>
            </div>
            <EmotionChart dreams={dreams || []} />
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Sentiment analysis over your last recorded dreams.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel rounded-xl p-4 text-center">
              <div className="text-3xl font-display font-bold text-white mb-1">{totalDreams}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Dreams</div>
            </div>
            <div className="glass-panel rounded-xl p-4 text-center">
              <div className="text-3xl font-display font-bold text-primary mb-1">{analyzedCount}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Analyzed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
