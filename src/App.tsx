import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { ModuleProvider } from "./contexts/ModuleContext";
import { AutopilotProvider } from "./contexts/AutopilotContext";
import Index from "./pages/Index";
import GetStarted from "./pages/GetStarted";
import PostCallAnalyzer from "./pages/PostCallAnalyzer";
import Autopilot from "./pages/Autopilot";
import AutopilotDashboard from "./pages/autopilot/AutopilotDashboard";
import AutopilotConversations from "./pages/autopilot/AutopilotConversations";
import AutopilotReports from "./pages/autopilot/AutopilotReports";
import AutopilotSettings from "./pages/autopilot/AutopilotSettings";
import CallInsight from "./pages/post-call-analyzer/CallInsight";
import AgentPerformance from "./pages/post-call-analyzer/AgentPerformance";
import ContentUploader from "./pages/post-call-analyzer/ContentUploader";
import Reports from "./pages/post-call-analyzer/Reports";
import Configuration from "./pages/post-call-analyzer/Configuration";
import AgentInsights from "./pages/post-call-analyzer/AgentInsights";
import CrossUpsellReport from "./pages/post-call-analyzer/CrossUpsellReport";
import BadPracticeReport from "./pages/post-call-analyzer/BadPracticeReport";
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
        <MainLayout>
          <Routes>
            <Route path="/" element={<GetStarted />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/post-call-analyzer" element={<PostCallAnalyzer />} />
            <Route path="/autopilot" element={<Autopilot />} />
            <Route path="/autopilot/dashboard" element={<AutopilotDashboard />} />
            <Route path="/autopilot/conversations" element={<AutopilotConversations />} />
            <Route path="/autopilot/reports" element={<AutopilotReports />} />
            <Route path="/autopilot/settings" element={<AutopilotSettings />} />
            <Route path="/post-call-analyzer/dashboard" element={<PostCallAnalyzer />} />
            <Route path="/post-call-analyzer/call-insight" element={<CallInsight />} />
            <Route path="/post-call-analyzer/agent-performance" element={<AgentPerformance />} />
            <Route path="/post-call-analyzer/agent-performance/:agentId" element={<AgentInsights />} />
            <Route path="/post-call-analyzer/content-uploader" element={<ContentUploader />} />
            <Route path="/post-call-analyzer/reports" element={<Reports />} />
            <Route path="/post-call-analyzer/reports/cross-upsell" element={<CrossUpsellReport />} />
            <Route path="/post-call-analyzer/reports/bad-practice" element={<BadPracticeReport />} />
            <Route path="/post-call-analyzer/configuration" element={<Configuration />} />
            <Route path="/user-management" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
        </AutopilotProvider>
        </ModuleProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
