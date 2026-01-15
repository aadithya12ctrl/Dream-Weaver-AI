import { useDream, useAnalyzeDream, useDeleteDream } from "@/hooks/use-dreams";
import { useParams, useLocation } from "wouter";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Brain, 
  Trash2, 
  Calendar, 
  Sparkles,
  Layers,
  Fingerprint
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "wouter";

export default function DreamDetail() {
  const params = useParams();
  const id = Number(params.id);
  const [, navigate] = useLocation();
  
  const { data: dream, isLoading } = useDream(id);
  const analyzeDream = useAnalyzeDream();
  const deleteDream = useDeleteDream();

  if (isLoading) {
    return (
      <div className="container px-4 py-20 flex justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!dream) {
    return (
      <div className="container px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Dream not found</h1>
        <Link href="/journal">
          <Button>Return to Journal</Button>
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    await deleteDream.mutateAsync(id);
    navigate("/journal");
  };

  const handleAnalyze = () => {
    analyzeDream.mutate(id);
  };

  const symbols = (dream.analysis?.symbols as string[]) || [];
  const themes = (dream.analysis?.themes as string[]) || [];

  return (
    <div className="min-h-screen container max-w-4xl px-4 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <Link href="/journal" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Journal
        </Link>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Dream
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-card border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This dream will be permanently erased from your journal.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-white/10 hover:bg-white/5">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-8"
        >
          <div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(dream.date), "EEEE, MMMM do, yyyy")}
              </span>
              {dream.emotion && (
                <Badge variant="secondary" className="bg-primary/10 text-primary capitalize">
                  {dream.emotion}
                </Badge>
              )}
            </div>
            <h1 className="font-display text-4xl font-bold text-white leading-tight mb-6">
              {dream.title}
            </h1>
            <div className="glass-panel p-8 rounded-2xl text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {dream.content}
            </div>
          </div>
        </motion.div>

        {/* Sidebar - Analysis */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="glass-panel p-6 rounded-2xl sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="w-5 h-5 text-primary" />
              <h2 className="font-display text-xl font-bold">AI Analysis</h2>
            </div>

            {dream.analysis ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Interpretation
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {dream.analysis.interpretation}
                  </p>
                </div>

                <Separator className="bg-white/5" />

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Fingerprint className="w-3 h-3" />
                    Key Symbols
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {symbols.map((symbol, i) => (
                      <Badge key={i} variant="outline" className="border-white/10 bg-white/5">
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-3 h-3" />
                    Themes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {themes.map((theme, i) => (
                      <Badge key={i} className="bg-primary/20 hover:bg-primary/30 text-primary-foreground border-transparent">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Re-analyze button (optional, maybe hidden if done) */}
                <Button 
                  onClick={handleAnalyze} 
                  variant="ghost" 
                  size="sm"
                  className="w-full mt-4 text-xs text-muted-foreground hover:text-primary"
                  disabled={analyzeDream.isPending}
                >
                  Regenerate Analysis
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-6">
                  Unlock the hidden meanings within your dream using our AI interpretation engine.
                </p>
                <Button 
                  onClick={handleAnalyze} 
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity"
                  disabled={analyzeDream.isPending}
                >
                  {analyzeDream.isPending ? "Analyzing..." : "Analyze Dream"}
                  {!analyzeDream.isPending && <Sparkles className="ml-2 w-4 h-4" />}
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
