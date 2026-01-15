import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Moon, 
  LayoutDashboard, 
  BookOpen, 
  LogOut, 
  Plus,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/journal", label: "Journal", icon: BookOpen },
    { href: "/new", label: "Record Dream", icon: Plus },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/40 transition-all duration-500" />
            <Moon className="relative w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
          </div>
          <span className="font-display text-xl font-semibold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Oneiros
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "gap-2 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-300",
                        isActive && "text-primary bg-primary/10 hover:bg-primary/15"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium text-foreground">
                  {user.firstName || "Dreamer"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => logout()}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
