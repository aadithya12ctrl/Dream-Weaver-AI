import { Button } from "@/components/ui/button";
import { Moon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Panel - Branding */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-black">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <Moon className="w-8 h-8 text-primary" />
            <span className="font-display text-2xl font-bold text-white">Oneiros</span>
          </div>
          
          <h1 className="font-display text-6xl font-bold leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50">
            Explore the <br/> depths of your <br/> subconscious.
          </h1>
          <p className="text-xl text-muted-foreground max-w-md leading-relaxed">
            Record your dreams, uncover hidden patterns, and gain AI-powered insights into your inner world.
          </p>
        </div>

        <div className="relative z-10 flex gap-4 text-sm text-muted-foreground/60">
          <span>© 2024 Oneiros</span>
          <span>•</span>
          <span>Privacy</span>
          <span>•</span>
          <span>Terms</span>
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="flex flex-col items-center justify-center p-8 bg-background relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8 relative z-10"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="font-display text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to access your dream journal.</p>
          </div>

          <div className="space-y-4 pt-8">
            <Button 
              size="lg" 
              className="w-full h-12 text-base font-medium bg-white text-black hover:bg-gray-200 transition-colors"
              onClick={() => window.location.href = "/api/login"}
            >
              Continue with Replit
            </Button>
            
            <p className="text-center text-xs text-muted-foreground pt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
