import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import React, { Suspense, useState, useEffect, useCallback } from "react";
import { LanguageProvider } from "@/hooks/use-language";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/auth/LoginPage";

const queryClient = new QueryClient();
const DesignSystem = React.lazy(() => import("./pages/DesignSystem"));
const EquipmentRegistry = React.lazy(() => import("./pages/EquipmentRegistry"));
const ComplianceDashboard = React.lazy(
  () => import("./pages/ComplianceDashboard")
);
const VendorManagement = React.lazy(() => import("./pages/VendorManagement"));
const NotificationPreferences = React.lazy(
  () => import("./pages/NotificationPreferences")
);
const AnalyticsDashboard = React.lazy(
  () => import("./pages/AnalyticsDashboard")
);
const MobileDataCollection = React.lazy(
  () => import("./pages/MobileDataCollection")
);
const ApiIntegration = React.lazy(() => import("./pages/ApiIntegration"));
const HowItWorks = React.lazy(() => import("./pages/HowItWorks"));
const Certifications = React.lazy(() => import("./pages/Certifications"));
const Maintenance = React.lazy(() => import("./pages/Maintenance"));
const Scheduling = React.lazy(() => import("./pages/Scheduling"));
const Users = React.lazy(() => import("./pages/Users"));
const Documents = React.lazy(() => import("./pages/Documents"));
const Settings = React.lazy(() => import("./pages/Settings"));
const OperatorManagement = React.lazy(() => import("./pages/OperatorManagement"));
const PowerTools = React.lazy(() => import("./pages/PowerTools"));
const LiftingTools = React.lazy(() => import("./pages/LiftingTools"));
const Projects = React.lazy(() => import("./pages/Projects"));

const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  const checkAuth = useCallback(() => {
    // Check if we're in the logout process
    if (localStorage.getItem("loggingOut") === "true") {
      // Clear the logout flag
      localStorage.removeItem("loggingOut");
      setIsAuthenticated(false);
      return;
    }

    const userRole = localStorage.getItem("userRole");
    setIsAuthenticated(!!userRole);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth, location.pathname]); // Add location.pathname to dependencies

  if (isAuthenticated === null) {
    return <Loading />;
  }


  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return (
        <Navigate to="/login" state={{ from: location.pathname }} replace />
      );
    }
    return <>{children}</>;
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />

      <Route
        path="/design-system"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <DesignSystem />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/equipment"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <EquipmentRegistry />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/compliance"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <ComplianceDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendors"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <VendorManagement />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/notification-preferences"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <NotificationPreferences />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <AnalyticsDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/mobile-collection"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <MobileDataCollection />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/api-integration"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <ApiIntegration />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/how-it-works"
        element={
          <Suspense fallback={<Loading />}>
            <HowItWorks />
          </Suspense>
        }
      />

      <Route
        path="/certifications"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <Certifications />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/maintenance"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <Maintenance />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/scheduling"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <Scheduling />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <Users />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <Documents />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <Settings />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/operators"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <OperatorManagement />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/power-tools"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <PowerTools />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/lifting-tools"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <LiftingTools />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <Projects />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
