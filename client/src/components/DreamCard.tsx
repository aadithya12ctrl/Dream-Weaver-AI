import { Link } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, Brain, Sparkles, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DreamWithAnalysis } from "@shared/schema";
import { cn } from "@/lib/utils";

interface DreamCardProps {
  dream: DreamWithAnalysis;
  index?: number;
}

export function DreamCard({ dream, index = 0 }: DreamCardProps) {
  // Parse JSONB fields if they come as strings, or use directly if objects
  const themes = Array.isArray(dream.analysis?.themes) 
    ? dream.analysis?.themes 
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link href={`/dreams/${dream.id}`}>
        <Card className={cn(
          "h-full group cursor-pointer overflow-hidden border-white/5 bg-card/40 hover:bg-card/60 transition-all duration-300",
          "hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1"
        )}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(dream.date), "MMMM do, yyyy")}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {dream.title}
                </h3>
              </div>
              {dream.emotion && (
                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary capitalize shrink-0">
                  {dream.emotion}
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {dream.content}
            </p>
          </CardContent>

          <CardFooter className="pt-0 flex items-center justify-between border-t border-white/5 mt-auto p-4 bg-black/20">
            <div className="flex gap-2 overflow-hidden">
              {dream.analysis ? (
                <>
                  <Badge variant="secondary" className="text-xs gap-1 bg-secondary/30">
                    <Brain className="w-3 h-3" />
                    Analyzed
                  </Badge>
                  {themes.slice(0, 2).map((theme: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs border-white/10 text-muted-foreground">
                      {theme}
                    </Badge>
                  ))}
                </>
              ) : (
                <span className="text-xs text-muted-foreground italic flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Analysis available
                </span>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
