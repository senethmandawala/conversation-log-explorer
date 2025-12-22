import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  TrendingUp,
  AlertTriangle,
  GraduationCap,
  PhoneOff,
  BarChart3,
  PieChart,
  UserX,
  ArrowRight,
  Sparkles,
  Shield,
  Volume2
} from "lucide-react";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { motion } from "framer-motion";
import { CaseClassificationReport } from "@/components/post-call/CaseClassificationReport";

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
    id: "case-classification",
    title: "Case Classification",
    description: "View case distribution across categories and subcategories with drill-down",
    icon: PieChart,
    color: "text-blue-500",
    bgGradient: "from-blue-500/20 to-blue-600/5",
    available: true,
  },
  {
    id: "bad-practice",
    title: "Bad Practice Analysis",
    description: "Identify and analyze agent behaviors that deviate from best practices",
    icon: AlertTriangle,
    color: "text-red-500",
    bgGradient: "from-red-500/20 to-red-600/5",
    available: true,
  },
  {
    id: "cross-up-sell",
    title: "Cross/Up-Sell Analysis",
    description: "Track opportunities and conversion rates for cross-selling and up-selling",
    icon: TrendingUp,
    color: "text-green-500",
    bgGradient: "from-green-500/20 to-green-600/5",
    available: true,
  },
  {
    id: "training-needs",
    title: "Training Needs Analysis",
    description: "Identify skill gaps and training requirements for agents",
    icon: GraduationCap,
    color: "text-purple-500",
    bgGradient: "from-purple-500/20 to-purple-600/5",
    available: true,
  },
  {
    id: "unresolved-calls",
    title: "Unresolved Calls Analysis",
    description: "Analyze calls that were not resolved to identify patterns",
    icon: PhoneOff,
    color: "text-amber-500",
    bgGradient: "from-amber-500/20 to-amber-600/5",
    available: true,
  },
  {
    id: "sentiment-analysis",
    title: "Sentiment Analysis",
    description: "Analyze user and agent sentiment patterns across calls",
    icon: BarChart3,
    color: "text-teal-500",
    bgGradient: "from-teal-500/20 to-teal-600/5",
    available: true,
  },
  {
    id: "call-resolution",
    title: "Call Resolution",
    description: "Track resolution rates and average handling times",
    icon: Shield,
    color: "text-emerald-500",
    bgGradient: "from-emerald-500/20 to-emerald-600/5",
    available: true,
  },
  {
    id: "frequent-callers",
    title: "Frequent Callers",
    description: "Identify top callers and repeat call patterns",
    icon: UserX,
    color: "text-orange-500",
    bgGradient: "from-orange-500/20 to-orange-600/5",
    available: true,
  },
  {
    id: "call-duration",
    title: "Call Duration Analysis",
    description: "Analyze call duration patterns and identify long calls",
    icon: Volume2,
    color: "text-cyan-500",
    bgGradient: "from-cyan-500/20 to-cyan-600/5",
    available: true,
  },
  {
    id: "traffic-trends",
    title: "Traffic Trends & Patterns",
    description: "Visualize traffic trends across categories and time periods",
    icon: TrendingUp,
    color: "text-violet-500",
    bgGradient: "from-violet-500/20 to-violet-600/5",
    available: true,
  },
  {
    id: "churn-analysis",
    title: "Churn Analysis",
    description: "Identify customers at risk of churning based on call patterns",
    icon: UserX,
    color: "text-rose-500",
    bgGradient: "from-rose-500/20 to-rose-600/5",
    available: true,
  },
  {
    id: "silence-reason",
    title: "Silence Reason Report",
    description: "Analyze silence periods during calls and identify causes",
    icon: Volume2,
    color: "text-slate-500",
    bgGradient: "from-slate-500/20 to-slate-600/5",
    available: true,
  },
  {
    id: "recommendations",
    title: "Overall Recommendations",
    description: "AI-generated recommendations to improve call center performance",
    icon: Sparkles,
    color: "text-indigo-500",
    bgGradient: "from-indigo-500/20 to-indigo-600/5",
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
    // Navigate to specific report pages
    switch (reportId) {
      case "case-classification":
        navigate("/post-call-analyzer/reports/case-classification");
        break;
      case "cross-up-sell":
        navigate("/post-call-analyzer/reports/cross-upsell");
        break;
      case "bad-practice":
        navigate("/post-call-analyzer/reports/bad-practice");
        break;
      default:
        // For other reports, we could add more routes later
        break;
    }
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
