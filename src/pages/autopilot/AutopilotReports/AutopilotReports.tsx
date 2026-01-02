import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  TrendingUp,
  BarChart3,
  Clock,
  FileBarChart,
  Coins,
  ArrowRight,
  Shield,
  Mic,
  Activity,
  Zap,
  PieChart,
  Users,
  Target,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import { AIHelper } from "@/components/post-call/AIHelper";

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
    id: "transaction",
    title: "Transaction Summary Report",
    description: "View detailed transaction summaries and patterns across autopilot interactions",
    icon: FileText,
    color: "text-purple-500",
    bgGradient: "from-purple-500/20 to-purple-600/5",
    available: true,
  },
  {
    id: "channel",
    title: "Channel Distribution Report",
    description: "Analyze channel distribution and usage patterns across different communication channels",
    icon: PieChart,
    color: "text-blue-500",
    bgGradient: "from-blue-500/20 to-blue-600/5",
    available: true,
  },
  {
    id: "document",
    title: "Document Access Frequency",
    description: "Track document access patterns and frequency in autopilot conversations",
    icon: FileBarChart,
    color: "text-green-500",
    bgGradient: "from-green-500/20 to-green-600/5",
    available: true,
  },
  {
    id: "weekly-trends",
    title: "Weekly Traffic Trends",
    description: "Analyze weekly traffic patterns and trends in autopilot usage",
    icon: TrendingUp,
    color: "text-amber-500",
    bgGradient: "from-amber-500/20 to-amber-600/5",
    available: true,
  },
  {
    id: "success-failure",
    title: "Success/Failure Rate Analysis",
    description: "Monitor success and failure rates over time for autopilot interactions",
    icon: BarChart3,
    color: "text-pink-500",
    bgGradient: "from-pink-500/20 to-pink-600/5",
    available: true,
  },
  {
    id: "token-usage",
    title: "Token Usage Report",
    description: "Track AI token consumption and costs across autopilot services",
    icon: Coins,
    color: "text-cyan-500",
    bgGradient: "from-cyan-500/20 to-cyan-600/5",
    available: true,
  },
  {
    id: "average-call-duration",
    title: "Average Call Duration",
    description: "Analyze call duration statistics and trends for autopilot conversations",
    icon: Clock,
    color: "text-indigo-500",
    bgGradient: "from-indigo-500/20 to-indigo-600/5",
    available: true,
  },
];

export default function AutopilotReports() {
  const [isHovering, setIsHovering] = useState<string | null>(null);

  const handleReportClick = (reportId: string) => {
    // TODO: Handle report click - could open a modal or expand inline
    console.log(`Opening report: ${reportId}`);
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
                  Autopilot Reports
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Generate and view detailed autopilot analytics reports
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
