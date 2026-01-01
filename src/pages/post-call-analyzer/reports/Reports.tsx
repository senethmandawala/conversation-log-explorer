import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  TrendingDown,
  AlertTriangle,
  GraduationCap,
  Info,
  PieChart,
  Users,
  ArrowRight,
  Shield,
  Map,
  MicOff,
  FileBarChart
} from "lucide-react";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { motion } from "framer-motion";
import { CaseClassificationReport } from "@/pages/post-call-analyzer/case-classification/CaseClassificationReport";

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  available: boolean;
}

const reportCards: ReportCard[] = [
  {
    id: "training-needs",
    title: "Training Needs Analysis Report",
    description: "Identify areas where agents require additional training and development",
    icon: GraduationCap,
    color: "text-purple-500",
    bgGradient: "from-purple-500/20 to-purple-600/5",
    available: true,
  },
  {
    id: "unresolved-cases",
    title: "Unresolved Cases Analysis Report",
    description: "Monitor and analyze calls requiring escalation or remaining unresolved",
    icon: Info,
    color: "text-amber-500",
    bgGradient: "from-amber-500/20 to-amber-600/5",
    available: true,
  },
  {
    id: "bad-practice",
    title: "Bad Practice Analysis",
    description: "Identify non-compliance with standard procedures and quality guidelines",
    icon: AlertTriangle,
    color: "text-red-500",
    bgGradient: "from-red-500/20 to-red-600/5",
    available: true,
  },
  {
    id: "category-trend",
    title: "Category Trend Analysis",
    description: "Track how customer inquiry categories change over time. This report helps spot trends in call volumes.",
    icon: PieChart,
    color: "text-blue-500",
    bgGradient: "from-blue-500/20 to-blue-600/5",
    available: true,
  },
  {
    id: "churn-analysis",
    title: "Churn Analysis",
    description: "Track how customer inquiry categories change over time. This report helps spot trends in call volumes.",
    icon: TrendingDown,
    color: "text-rose-500",
    bgGradient: "from-rose-500/20 to-rose-600/5",
    available: true,
  },
  {
    id: "overall-recommendations",
    title: "Overall Recommendations",
    description: "Our comprehensive analysis of call center operations has identified critical performance gaps affecting customer experience and operational efficiency.",
    icon: FileBarChart,
    color: "text-indigo-500",
    bgGradient: "from-indigo-500/20 to-indigo-600/5",
    available: true,
  },
  {
    id: "geographic-distribution",
    title: "Geographic Distribution Map",
    description: "Visualize customer care issues across different locations with interactive pie charts",
    icon: Map,
    color: "text-green-500",
    bgGradient: "from-green-500/20 to-green-600/5",
    available: true,
  },
  {
    id: "silence-reason",
    title: "Silence Reason Report",
    description: "Analyze and view reasons for silence detected in calls",
    icon: MicOff,
    color: "text-slate-500",
    bgGradient: "from-slate-500/20 to-slate-600/5",
    available: true,
  },
  {
    id: "agent-comparison",
    title: "Agent wise comparison Report",
    description: "Compare performance metrics across different agents",
    icon: Users,
    color: "text-cyan-500",
    bgGradient: "from-cyan-500/20 to-cyan-600/5",
    available: true,
  },
];

export default function Reports() {
  const navigate = useNavigate();
  const { setShowModuleTabs } = useModule();
  const [isHovering, setIsHovering] = useState<string | null>(null);

  useEffect(() => {
    setShowModuleTabs(true);
    return () => setShowModuleTabs(true);
  }, [setShowModuleTabs]);

  const handleReportClick = (reportId: string) => {
    navigate(`/post-call-analyzer/reports/${reportId}`);
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold tracking-tight">
                  Reports
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Generate and view detailed analytics reports
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportCards.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onMouseEnter={() => setIsHovering(report.id)}
                  onMouseLeave={() => setIsHovering(null)}
                  onClick={() => report.available && handleReportClick(report.id)}
                  className={`
                    relative group cursor-pointer rounded-xl border border-border/50 
                    bg-gradient-to-br ${report.bgGradient} backdrop-blur-sm
                    p-5 transition-all duration-300
                    ${report.available 
                      ? "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1" 
                      : "opacity-50 cursor-not-allowed"
                    }
                  `}
                >
                  {/* Icon */}
                  <div className={`
                    h-12 w-12 rounded-xl bg-background/80 border border-border/50
                    flex items-center justify-center mb-4 transition-all duration-300
                    group-hover:scale-110 group-hover:border-primary/30
                  `}>
                    <report.icon className={`h-6 w-6 ${report.color}`} />
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {report.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {report.description}
                  </p>

                  {/* Arrow indicator */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: isHovering === report.id ? 1 : 0, 
                      x: isHovering === report.id ? 0 : -10 
                    }}
                    className="absolute bottom-5 right-5"
                  >
                    <ArrowRight className={`h-5 w-5 ${report.color}`} />
                  </motion.div>

                  {/* Not available badge */}
                  {!report.available && (
                    <div className="absolute top-3 right-3">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <AIHelper />
    </>
  );
}
