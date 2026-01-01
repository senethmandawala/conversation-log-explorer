import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAutopilot } from "@/contexts/AutopilotContext";
import { HandledCallsAnalysis } from "./Handled Calls Analysis/HandledCallsAnalysis";
import { CallsHandledByDTMF } from "./autopilot-calls-handled-by-DTMF/CallsHandledByDTMF";
import { CallDurationDistribution } from "./Call Duration Distribution/CallDurationDistribution";
import { CategoryDistribution } from "./Category Distribution/CategoryDistribution";
import { FrequentCallers } from "./Frequent Callers/FrequentCallers";
import { IntentTransitionAnalysis } from "./Intent Transition Analysis/IntentTransitionAnalysis";
import { AutopilotSankeyChart } from "./Sankey Chart/AutopilotSankeyChart";
import { CategoryWiseFailureReason } from "./Category Wise Failure Reason/CategoryWiseFailureReason";
import { CategoryWiseVDN } from "./Category Wise VDN/CategoryWiseVDN";
import { WeeklyTrendsAndPatterns } from "./Weekly Trends/WeeklyTrendsAndPatterns";
import {
  PhoneIncoming,
  PhoneOutgoing,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Enhanced stat card component with modern design
interface WideStatCardProps {
  color: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  tooltip?: string;
  trend?: { value: string; positive: boolean };
  rightItems?: { label: string; value: string; tooltip?: string }[];
}

const WideStatCard = ({ color, icon, label, value, trend, rightItems }: WideStatCardProps) => {
  const colorConfig: Record<string, { gradient: string; iconBg: string; border: string; glow: string }> = {
    blue: {
      gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30",
      border: "border-blue-500/20",
      glow: "shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]",
    },
    green: {
      gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30",
      border: "border-emerald-500/20",
      glow: "shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]",
    },
    red: {
      gradient: "from-red-500/10 via-red-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30",
      border: "border-red-500/20",
      glow: "shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]",
    },
    amber: {
      gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/30",
      border: "border-amber-500/20",
      glow: "shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]",
    },
    purple: {
      gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/30",
      border: "border-purple-500/20",
      glow: "shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]",
    },
  };

  const config = colorConfig[color] || colorConfig.blue;

  return (
    <Card className={`relative overflow-hidden bg-card/80 backdrop-blur-xl border ${config.border} ${config.glow} hover:scale-[1.01] transition-all duration-300`}>
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient}`} />
      
      <div className="relative p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${config.iconBg} shadow-lg`}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold text-foreground tracking-tight">{value}</p>
                {trend && (
                  <span className={`flex items-center gap-1 text-sm font-medium ${trend.positive ? "text-emerald-500" : "text-red-500"}`}>
                    {trend.positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {trend.value}
                  </span>
                )}
              </div>
            </div>
          </div>
          {rightItems && (
            <div className="flex flex-wrap gap-8">
              {rightItems.map((item, index) => (
                <div key={index} className="text-center px-4 py-2 rounded-xl bg-background/50 backdrop-blur-sm border border-border/30">
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="text-xs font-medium text-muted-foreground mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default function AutopilotDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const { selectedInstance } = useAutopilot();

  useEffect(() => {
    if (!selectedInstance) {
      navigate("/autopilot");
    }
  }, [selectedInstance, navigate]);

  if (!selectedInstance) {
    return null;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Wide Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <WideStatCard
          color="blue"
          icon={<PhoneIncoming className="h-6 w-6 text-white" />}
          label="Total Incoming Calls"
          value="12,450"
          trend={{ value: "+12.5%", positive: true }}
          rightItems={[
            { label: "Handled Calls", value: "10,890" },
            { label: "Unhandled Calls", value: "1,560" },
          ]}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <WideStatCard
          color="green"
          icon={<PhoneOutgoing className="h-6 w-6 text-white" />}
          label="Transferred to Agent"
          value="2,340"
          trend={{ value: "-5.2%", positive: false }}
          rightItems={[
            { label: "API Fail Transfer", value: "120" },
            { label: "Failed Transfer", value: "85" },
            { label: "Direct Transfer", value: "450" },
            { label: "Successfully Routed", value: "1,685" },
          ]}
        />
      </motion.div>

      {/* Handled Calls Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <HandledCallsAnalysis />
      </motion.div>

      {/* Calls Handled by DTMF */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <CallsHandledByDTMF />
      </motion.div>

      {/* Sankey Chart - Call Flow Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <AutopilotSankeyChart />
      </motion.div>

      {/* Category Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <CategoryDistribution />
      </motion.div>

      {/* Category-wise Failure Reason */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <CategoryWiseFailureReason />
      </motion.div>

      {/* Frequent Callers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <FrequentCallers />
      </motion.div>

      {/* Call Duration Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        <CallDurationDistribution />
      </motion.div>

      {/* Intent Transition Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <IntentTransitionAnalysis />
      </motion.div>

      {/* Category-wise VDN Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65 }}
      >
        <CategoryWiseVDN />
      </motion.div>

      {/* Weekly Trends and Patterns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <WeeklyTrendsAndPatterns />
      </motion.div>
    </div>
  );
}
