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
import PostCallAnalyzer from "./pages/PostCallAnalyzer";
import Autopilot from "./pages/Autopilot";
import AutopilotSettings from "./pages/autopilot/AutopilotSettings/AutopilotSettings";
import AutopilotReports from "./pages/autopilot/AutopilotReports/AutopilotReports";
import AutopilotConversations from "./pages/autopilot/AutopilotConversations/AutopilotConversations";
import AutopilotDashboard from "./pages/autopilot/AutopilotDashboard/AutopilotDashboard";
import CallInsight from "./pages/post-call-analyzer/call-insight/CallInsight";
import AgentPerformance from "./pages/post-call-analyzer/agent-performance/AgentPerformance";
import ContentUploader from "./pages/post-call-analyzer/content-uploader/ContentUploader";
import Reports from "./pages/post-call-analyzer/reports/Reports";
import Configuration from "./pages/post-call-analyzer/configuration/Configuration";
import PostCallDashboard from "./pages/post-call-analyzer/dashboard/Dashboard";
import AgentInsights from "./pages/post-call-analyzer/agent-insights/AgentInsights";
import CrossUpsellReport from "./pages/post-call-analyzer/cross-upsell/CrossUpsellReport";
import BadPracticeReport from "./pages/post-call-analyzer/bad-practice/BadPracticeReport";
// import CaseClassificationReport from "./pages/post-call-analyzer/case-classification/CaseClassificationReport";
import SentimentAnalysisReport from "./pages/post-call-analyzer/sentiment-analysis/SentimentAnalysisReport";
import CallResolutionReport from "./pages/post-call-analyzer/call-resolution/CallResolutionReport";
import FrequentCallersReport from "./pages/post-call-analyzer/frequent-callers/FrequentCallersReport";
import CallDurationReport from "./pages/post-call-analyzer/call-duration/CallDurationReport";
import TrafficTrendsReport from "./pages/post-call-analyzer/traffic-trends/TrafficTrendsReport";
import TrainingNeedsReport from "./pages/post-call-analyzer/training-needs/TrainingNeedsReport";
import NotFound from "./pages/NotFound";
import UnresolvedCasesReport from "./pages/post-call-analyzer/unresolved-cases/UnresolvedCasesReport";
import CategoryTrendAnalysis from "./pages/post-call-analyzer/category-trend/CategoryTrendAnalysis";
import ChurnAnalysisReport from "./pages/post-call-analyzer/churn-analysis/ChurnAnalysisReport";
import OverallRecommendations from "./pages/post-call-analyzer/overall-recommendations/OverallRecommendations";
import GeographicDistributionMap from "./pages/post-call-analyzer/geographic-map/GeographicDistributionMap";
import SilenceReport from "./pages/post-call-analyzer/silence-report/SilenceReport";
import AgentWiseComparisonReport from "./pages/post-call-analyzer/agent-comparison/AgentWiseComparisonReport";

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
            <Route path="/post-call-analyzer" element={<PostCallAnalyzer />} />
            <Route path="/autopilot" element={<Autopilot />} />
            <Route path="/autopilot/dashboard" element={<AutopilotDashboard />} />
            <Route path="/autopilot/conversations" element={<AutopilotConversations />} />
            <Route path="/autopilot/reports" element={<AutopilotReports />} />
            <Route path="/autopilot/settings" element={<AutopilotSettings />} />
            <Route path="/post-call-analyzer/dashboard" element={<PostCallDashboard />} />
            <Route path="/post-call-analyzer/call-insight" element={<CallInsight />} />
            <Route path="/post-call-analyzer/agent-performance" element={<AgentPerformance />} />
            <Route path="/post-call-analyzer/agent-performance/:agentId" element={<AgentInsights />} />
            <Route path="/post-call-analyzer/content-uploader" element={<ContentUploader />} />
            <Route path="/post-call-analyzer/reports" element={<Reports />} />
            <Route path="/post-call-analyzer/reports/cross-upsell" element={<CrossUpsellReport />} />
            <Route path="/post-call-analyzer/reports/bad-practice" element={<BadPracticeReport />} />
            {/* <Route path="/post-call-analyzer/reports/case-classification" element={<CaseClassificationReport />} /> */}
            <Route path="/post-call-analyzer/reports/sentiment-analysis" element={<SentimentAnalysisReport />} />
            <Route path="/post-call-analyzer/reports/call-resolution" element={<CallResolutionReport />} />
            <Route path="/post-call-analyzer/reports/frequent-callers" element={<FrequentCallersReport />} />
            <Route path="/post-call-analyzer/reports/call-duration" element={<CallDurationReport />} />
            <Route path="/post-call-analyzer/reports/traffic-trends" element={<TrafficTrendsReport />} />
            <Route path="/post-call-analyzer/reports/training-needs" element={<TrainingNeedsReport />} />
            <Route path="/post-call-analyzer/reports/unresolved-cases" element={<UnresolvedCasesReport />} />
            <Route path="/post-call-analyzer/reports/category-trend" element={<CategoryTrendAnalysis />} />
            <Route path="/post-call-analyzer/reports/churn-analysis" element={<ChurnAnalysisReport />} />
            <Route path="/post-call-analyzer/reports/overall-recommendations" element={<OverallRecommendations />} />
            <Route path="/post-call-analyzer/reports/geographic-distribution" element={<GeographicDistributionMap />} />
            <Route path="/post-call-analyzer/reports/silence-reason" element={<SilenceReport />} />
            <Route path="/post-call-analyzer/reports/agent-comparison" element={<AgentWiseComparisonReport />} />
            <Route path="/post-call-analyzer/configuration" element={<Configuration />} />
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
