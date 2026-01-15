import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/Navigation";
import { Loader2 } from "lucide-react";

import Dashboard from "@/pages/Dashboard";
import Journal from "@/pages/Journal";
import CreateDream from "@/pages/CreateDream";
import DreamDetail from "@/pages/DreamDetail";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <>
      <Navigation />
      <main className="animate-in fade-in duration-500">
        <Component />
      </main>
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/api/login" component={() => null} /> {/* Handled by backend */}
      <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/journal" component={() => <ProtectedRoute component={Journal} />} />
      <Route path="/new" component={() => <ProtectedRoute component={CreateDream} />} />
      <Route path="/dreams/:id" component={() => <ProtectedRoute component={DreamDetail} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
