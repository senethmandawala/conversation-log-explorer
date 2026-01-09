import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { ModuleProvider } from "./contexts/ModuleContext";
import { AutopilotProvider } from "./contexts/AutopilotContext";
import { PostCallProvider } from "./contexts/PostCallContext";
import Index from "./pages/Index";
import GetStarted from "./pages/GetStarted";
import Instances from "./pages/Instances";
import PostCallAnalyzer from "./pages/PostCallAnalyzer";
import Autopilot from "./pages/autopilot/Autopilot";
import Copilot from "./pages/Copilot";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ModuleProvider>
        <AutopilotProvider>
        <PostCallProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<GetStarted />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/instances" element={<Instances />} />
            <Route path="/pca" element={<PostCallAnalyzer />} />
            <Route path="/autopilot" element={<Autopilot />} />
            <Route path="/copilot" element={<Copilot />} />
            <Route path="/user-management" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
        </PostCallProvider>
        </AutopilotProvider>
        </ModuleProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
