import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import CreateApp from "@/pages/create-app";
import Marketplace from "@/pages/marketplace";
import Community from "@/pages/community";
import MyApps from "@/pages/my-apps";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Authentication routes - always available */}
      <Route path="/auth" component={AuthPage} />
      
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/create-app" component={CreateApp} />
          <Route path="/create-app/:id" component={CreateApp} />
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/create-app" component={CreateApp} />
          <Route path="/create-app/:id" component={CreateApp} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/community" component={Community} />
          <Route path="/my-apps" component={MyApps} />
          <Route path="/settings" component={Settings} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
