import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDreamSchema, type InsertDream } from "@shared/schema";
import { useCreateDream } from "@/hooks/use-dreams";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function CreateDream() {
  const [, navigate] = useLocation();
  const createDream = useCreateDream();
  
  const form = useForm<InsertDream>({
    resolver: zodResolver(insertDreamSchema),
    defaultValues: {
      title: "",
      content: "",
      date: new Date().toISOString().split('T')[0] as any, // Simple date string for input
      emotion: "",
      isFavorite: false,
    },
  });

  async function onSubmit(data: InsertDream) {
    // Ensure date is ISO string for backend
    const submissionData = {
      ...data,
      date: new Date(data.date).toISOString(), 
    };
    
    await createDream.mutateAsync(submissionData);
    navigate("/journal");
  }

  return (
    <div className="min-h-screen container max-w-3xl px-4 py-8 md:py-12">
      <Link href="/journal" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Journal
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-3xl"
      >
        <div className="mb-8 border-b border-white/5 pb-6">
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            Record a Dream
          </h1>
          <p className="text-muted-foreground mt-2">
            Capture the details while they are fresh. The more you write, the deeper the analysis.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dream Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Flying over the ocean" {...field} className="bg-black/20 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Dream</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="bg-black/20 border-white/10" value={field.value ? String(field.value).split('T')[0] : ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="I was walking through a forest made of glass..." 
                      className="min-h-[300px] bg-black/20 border-white/10 text-lg leading-relaxed resize-none p-6" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emotion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Emotion (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Wonder, Anxiety, Joy" {...field} value={field.value || ''} className="bg-black/20 border-white/10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                size="lg"
                disabled={createDream.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[150px]"
              >
                {createDream.isPending ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Entry
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
