import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { InstanceSelector } from "@/components/post-call/InstanceSelector";
import { PostCallDashboard } from "@/components/post-call/PostCallDashboard";
import { AIHelper } from "@/components/post-call/AIHelper";
import { useModule } from "@/contexts/ModuleContext";
import { usePostCall, PostCallInstance } from "@/contexts/PostCallContext";
import CallInsight from "./post-call-analyzer/call-insight/CallInsight";
import AgentPerformance from "./post-call-analyzer/agent-performance/AgentPerformance";
import AgentInsights from "./post-call-analyzer/agent-insights/AgentInsights";
import ContentUploader from "./post-call-analyzer/content-uploader/ContentUploader";
import Reports from "./post-call-analyzer/reports/Reports";
import Configuration from "./post-call-analyzer/configuration/Configuration";
import CrossUpsellReport from "./post-call-analyzer/cross-upsell/CrossUpsellReport";
import BadPracticeReport from "./post-call-analyzer/bad-practice/BadPracticeReport";
import SentimentAnalysisReport from "./post-call-analyzer/sentiment-analysis/SentimentAnalysisReport";
import CallResolutionReport from "./post-call-analyzer/call-resolution/CallResolutionReport";
import FrequentCallersReport from "./post-call-analyzer/frequent-callers/FrequentCallersReport";
import CallDurationReport from "./post-call-analyzer/call-duration/CallDurationReport";
import TrafficTrendsReport from "./post-call-analyzer/traffic-trends/TrafficTrendsReport";
import TrainingNeedsReport from "./post-call-analyzer/training-needs/TrainingNeedsReport";
import UnresolvedCasesReport from "./post-call-analyzer/unresolved-cases/UnresolvedCasesReport";
import CategoryTrendAnalysis from "./post-call-analyzer/category-trend/CategoryTrendAnalysis";
import ChurnAnalysisReport from "./post-call-analyzer/churn-analysis/ChurnAnalysisReport";
import OverallRecommendations from "./post-call-analyzer/overall-recommendations/OverallRecommendations";
import GeographicDistributionMap from "./post-call-analyzer/geographic-map/GeographicDistributionMap";
import SilenceReport from "./post-call-analyzer/silence-report/SilenceReport";
import AgentWiseComparisonReport from "./post-call-analyzer/agent-comparison/AgentWiseComparisonReport";

export interface Instance {
  id: string;
  name: string;
}

const mockInstances: Instance[] = [
  { id: "1", name: "pca_qa" },
  { id: "2", name: "pca_demo" },
  { id: "3", name: "pca_qa2" },
  { id: "4", name: "pca_qa4" },
  { id: "5", name: "pca_po" },
  { id: "6", name: "pca_qa5" },
  { id: "7", name: "pca_qa7" },
  { id: "8", name: "pca_qa8" },
  { id: "9", name: "Claro Contact Center" },
  { id: "10", name: "pca_qa9" },
  { id: "11", name: "test_department1" },
  { id: "12", name: "TigoBolivia" },
];

const PostCallAnalyzer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    selectedInstance, setSelectedInstance, 
    selectedTab, setSelectedTab,
    selectedAgentId, setSelectedAgentId,
    selectedReportId, setSelectedReportId
  } = usePostCall();
  const { setShowModuleTabs } = useModule();

  // Get project_id from URL params
  const projectId = searchParams.get("project_id");

  useEffect(() => {
    // Show ModuleTabs only when an instance is selected (has project_id)
    setShowModuleTabs(!!projectId && !!selectedInstance);
    return () => setShowModuleTabs(false);
  }, [setShowModuleTabs, projectId, selectedInstance]);

  const handleSelectInstance = (instance: PostCallInstance) => {
    setSelectedInstance(instance);
    setSelectedTab("dashboard");
    // Navigate with project_id query param
    setSearchParams({ project_id: instance.id });
  };

  // If no project_id in URL, show instance selector
  if (!projectId || !selectedInstance) {
    return (
      <div className="min-h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key="selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <InstanceSelector
              instances={mockInstances}
              onSelectInstance={handleSelectInstance}
            />
          </motion.div>
        </AnimatePresence>
        <AIHelper />
      </div>
    );
  }

  // Render report detail based on selectedReportId
  const renderReportDetail = () => {
    switch (selectedReportId) {
      case "cross-upsell":
        return <CrossUpsellReport />;
      case "bad-practice":
        return <BadPracticeReport />;
      case "sentiment-analysis":
        return <SentimentAnalysisReport />;
      case "call-resolution":
        return <CallResolutionReport />;
      case "frequent-callers":
        return <FrequentCallersReport />;
      case "call-duration":
        return <CallDurationReport />;
      case "traffic-trends":
        return <TrafficTrendsReport />;
      case "training-needs":
        return <TrainingNeedsReport />;
      case "unresolved-cases":
        return <UnresolvedCasesReport />;
      case "category-trend":
        return <CategoryTrendAnalysis />;
      case "churn-analysis":
        return <ChurnAnalysisReport />;
      case "overall-recommendations":
        return <OverallRecommendations />;
      case "geographic-distribution":
        return <GeographicDistributionMap />;
      case "silence-reason":
        return <SilenceReport />;
      case "agent-comparison":
        return <AgentWiseComparisonReport />;
      default:
        return <Reports />;
    }
  };

  // Render the selected tab content
  const renderTabContent = () => {
    switch (selectedTab) {
      case "dashboard":
        return (
          <PostCallDashboard
            instance={selectedInstance}
            onBack={() => {
              setSelectedInstance(null);
              setSearchParams({});
            }}
          />
        );
      case "call-insight":
        return <CallInsight />;
      case "agent-performance":
        return <AgentPerformance />;
      case "agent-insights":
        return <AgentInsights />;
      case "content-uploader":
        return <ContentUploader />;
      case "reports":
        return <Reports />;
      case "report-detail":
        return renderReportDetail();
      case "configuration":
        return <Configuration />;
      default:
        return (
          <PostCallDashboard
            instance={selectedInstance}
            onBack={() => {
              setSelectedInstance(null);
              setSearchParams({});
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
      <AIHelper />
    </div>
  );
};

export default PostCallAnalyzer;
