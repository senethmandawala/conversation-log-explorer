import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ArrowLeft, Filter, Calendar, User, Settings, TrendingUp, DollarSign, ArrowRight, AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { usePostCall } from "@/contexts/PostCallContext";
import { AIHelper } from "@/components/post-call/AIHelper";

// Mock data for recommendations
const mockAgentPerformanceRecommendations = [
  {
    id: "1",
    title: "Improve Authentication Process",
    description: "68% of agents struggle with the authentication process, leading to extended call times and customer frustration.",
    severity: "high",
    icon: "alert-triangle",
    recommendations: [
      "Develop specialized training modules for authentication procedures",
      "Create simplified authentication scripts with clear talking points",
      "Implement role-playing exercises for common authentication scenarios",
      "Schedule refresher training on security protocols quarterly"
    ]
  },
  {
    id: "2",
    title: "Enhance Product Knowledge",
    description: "52% of agents need training on effectively explaining promotions, which affects conversion rates.",
    severity: "medium",
    icon: "info",
    recommendations: [
      "Create comprehensive product knowledge base",
      "Develop quick reference guides for promotions",
      "Implement weekly product update sessions",
      "Establish mentorship program for new agents"
    ]
  }
];

const mockOperationalLevelRecommendations = [
  {
    id: "1",
    title: "Address Intentional Call Dropping",
    description: "63% of dropped calls are deliberately terminated by agents, particularly during complex inquiries or when call queues are high.",
    severity: "high",
    icon: "alert-triangle",
    recommendations: [
      "Implement stricter call monitoring for premature disconnections",
      "Create clear escalation paths for complex inquiries",
      "Develop better queue management strategies during peak hours",
      "Establish consequences for intentional call dropping"
    ]
  },
  {
    id: "2",
    title: "Optimize Staffing Levels",
    description: "Peak hours show 40% understaffing leading to increased wait times and agent stress.",
    severity: "medium",
    icon: "alert-circle",
    recommendations: [
      "Analyze call volume patterns to optimize shift scheduling",
      "Implement flexible staffing during peak periods",
      "Cross-train agents to handle multiple call types",
      "Consider hiring additional staff for high-volume periods"
    ]
  }
];

const mockSpecificIssuesRecommendations = [
  {
    id: "1",
    title: "Reduce Repeat Calls",
    description: "86% increase in repeat calls compared to previous quarter indicates unresolved issues on first contact.",
    severity: "high",
    icon: "alert-triangle",
    recommendations: [
      "Implement better case tracking to ensure proper follow up",
      "Develop more thorough first-call resolution procedures",
      "Create specialized teams for handling complex issues",
      "Improve knowledge base access for agents to provide better answers"
    ]
  },
  {
    id: "2",
    title: "Technical Issue Resolution",
    description: "Technical issues account for 35% of all escalations, indicating gaps in agent technical knowledge.",
    severity: "medium",
    icon: "info",
    recommendations: [
      "Provide advanced technical training for all agents",
      "Create technical troubleshooting flowcharts",
      "Establish dedicated technical support team",
      "Implement regular technical knowledge assessments"
    ]
  }
];

const mockBusinessImpactRecommendations = [
  {
    id: "1",
    title: "Improve Customer Retention",
    description: "Customer churn rate increased by 15% due to poor service quality and unresolved issues.",
    severity: "high",
    icon: "alert-triangle",
    recommendations: [
      "Implement proactive customer outreach program",
      "Develop customer satisfaction recovery procedures",
      "Create loyalty incentives for at-risk customers",
      "Establish executive escalation path for critical issues"
    ]
  },
  {
    id: "2",
    title: "Revenue Impact Analysis",
    description: "Poor call handling resulted in estimated $250K revenue loss through missed upsell opportunities.",
    severity: "high",
    icon: "alert-triangle",
    recommendations: [
      "Develop sales training program for agents",
      "Create upsell opportunity identification guidelines",
      "Implement performance incentives for successful conversions",
      "Provide real-time prompts for upsell opportunities"
    ]
  }
];

interface RecommendationCardProps {
  recommendation: {
    id: string;
    title: string;
    description: string;
    severity: string;
    icon: string;
    recommendations: string[];
  };
  index: number;
}

const RecommendationCard = ({ recommendation, index }: RecommendationCardProps) => {
  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "high":
        return {
          iconBg: "bg-red-500/10",
          iconColor: "text-red-500",
          border: "border-red-500/20"
        };
      case "medium":
        return {
          iconBg: "bg-amber-500/10",
          iconColor: "text-amber-500",
          border: "border-amber-500/20"
        };
      case "low":
        return {
          iconBg: "bg-blue-500/10",
          iconColor: "text-blue-500",
          border: "border-blue-500/20"
        };
      default:
        return {
          iconBg: "bg-gray-500/10",
          iconColor: "text-gray-500",
          border: "border-gray-500/20"
        };
    }
  };

  const config = getSeverityConfig(recommendation.severity);

  const getIcon = () => {
    switch (recommendation.severity) {
      case "high":
        return <AlertTriangle className={`h-5 w-5 ${config.iconColor}`} />;
      case "medium":
        return <AlertCircle className={`h-5 w-5 ${config.iconColor}`} />;
      case "low":
        return <Info className={`h-5 w-5 ${config.iconColor}`} />;
      default:
        return <CheckCircle className={`h-5 w-5 ${config.iconColor}`} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`border ${config.border} rounded-lg p-5 bg-card/50 backdrop-blur-sm mb-4`}
    >
      <div className="flex items-start gap-4">
        <div className={`h-10 w-10 rounded-lg ${config.iconBg} flex items-center justify-center shrink-0`}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <h6 className="font-semibold text-foreground mb-1">{recommendation.title}</h6>
          <p className="text-sm text-muted-foreground mb-4">{recommendation.description}</p>
          
          <div>
            <h6 className="text-sm font-semibold text-foreground mb-2">Recommendations:</h6>
            <ul className="space-y-2">
              {recommendation.recommendations.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function OverallRecommendations() {
  const { setSelectedTab } = usePostCall();
  const [loading, setLoading] = useState(false);
  const [panelOpenState, setPanelOpenState] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [errorLoading, setErrorLoading] = useState(false);
  const [emptyData, setEmptyData] = useState(false);

  const toggleFilters = () => {
    setPanelOpenState(!panelOpenState);
  };

  const searchFilterData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedTab("reports")}
                  className="h-9 w-9 shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-xl font-semibold">
                    Overall Recommendations Report
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Comprehensive analysis with actionable recommendations to improve agent performance and operational efficiency
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={panelOpenState ? "default" : "outline"}
                  size="icon"
                  onClick={toggleFilters}
                  className="relative h-9 w-9"
                >
                  <Filter className="h-4 w-4" />
                  {numberOfFilters > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                      {numberOfFilters}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <Collapsible open={panelOpenState} onOpenChange={setPanelOpenState}>
              <CollapsibleContent>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: panelOpenState ? 1 : 0, 
                    height: panelOpenState ? "auto" : 0 
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mb-6 p-4 border border-border/50 rounded-lg bg-muted/30"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Date Range</label>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Calendar className="h-4 w-4" />
                        Select dates
                      </Button>
                    </div>

                    <div className="flex items-end">
                      <Button
                        onClick={searchFilterData}
                        className="w-full rounded-full"
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </CollapsibleContent>
            </Collapsible>

            {/* Tab Navigation */}
            <Tabs defaultValue="agent-performance" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
                <TabsTrigger value="agent-performance" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Agent Performance</span>
                  <span className="sm:hidden">Agent</span>
                </TabsTrigger>
                <TabsTrigger value="operational-level" className="gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Operational Level</span>
                  <span className="sm:hidden">Operations</span>
                </TabsTrigger>
                <TabsTrigger value="specific-issues" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Specific Issues</span>
                  <span className="sm:hidden">Issues</span>
                </TabsTrigger>
                <TabsTrigger value="business-impact" className="gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="hidden sm:inline">Business Impact</span>
                  <span className="sm:hidden">Business</span>
                </TabsTrigger>
              </TabsList>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : errorLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg font-medium mb-2">Error loading recommendations</p>
                  <p className="text-sm">There was an error loading the recommendations data. Please try again later.</p>
                </div>
              ) : emptyData ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg font-medium mb-2">No recommendations available</p>
                  <p className="text-sm">There are no recommendations available for the selected filters.</p>
                </div>
              ) : (
                <>
                  <TabsContent value="agent-performance" className="mt-0">
                    <div className="mb-4">
                      <h6 className="text-base font-semibold mb-1">Agent Performance Recommendations</h6>
                      <p className="text-sm text-muted-foreground">Solutions to address call handling, FCR, and compliance issues</p>
                    </div>
                    {mockAgentPerformanceRecommendations.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No agent performance recommendations available.</p>
                      </div>
                    ) : (
                      <div>
                        {mockAgentPerformanceRecommendations.map((recommendation, index) => (
                          <RecommendationCard key={recommendation.id} recommendation={recommendation} index={index} />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="operational-level" className="mt-0">
                    <div className="mb-4">
                      <h6 className="text-base font-semibold mb-1">Operational Level Recommendations</h6>
                      <p className="text-sm text-muted-foreground">Solutions to address staffing, scheduling, and process inefficiencies</p>
                    </div>
                    {mockOperationalLevelRecommendations.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No operational level recommendations available.</p>
                      </div>
                    ) : (
                      <div>
                        {mockOperationalLevelRecommendations.map((recommendation, index) => (
                          <RecommendationCard key={recommendation.id} recommendation={recommendation} index={index} />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="specific-issues" className="mt-0">
                    <div className="mb-4">
                      <h6 className="text-base font-semibold mb-1">Specific Issues Recommendations</h6>
                      <p className="text-sm text-muted-foreground">Solutions to address recurring problems identified in call analysis</p>
                    </div>
                    {mockSpecificIssuesRecommendations.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No specific issues recommendations available.</p>
                      </div>
                    ) : (
                      <div>
                        {mockSpecificIssuesRecommendations.map((recommendation, index) => (
                          <RecommendationCard key={recommendation.id} recommendation={recommendation} index={index} />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="business-impact" className="mt-0">
                    <div className="mb-4">
                      <h6 className="text-base font-semibold mb-1">Business Impact Recommendations</h6>
                      <p className="text-sm text-muted-foreground">Solutions to address financial and customer satisfaction implications</p>
                    </div>
                    {mockBusinessImpactRecommendations.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No business impact recommendations available.</p>
                      </div>
                    ) : (
                      <div>
                        {mockBusinessImpactRecommendations.map((recommendation, index) => (
                          <RecommendationCard key={recommendation.id} recommendation={recommendation} index={index} />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <AIHelper />
    </>
  );
}
