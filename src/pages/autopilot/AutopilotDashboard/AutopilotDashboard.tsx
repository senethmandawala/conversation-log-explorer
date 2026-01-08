import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  Row, 
  Col, 
  Typography,
  ConfigProvider,
  Statistic,
  Space,
  Tag
} from "antd";
import { 
  PhoneIncoming,
  PhoneOutgoing,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import WideStatCard from "@/components/ui/wide-stat-card";
import { HandledCallsAnalysis } from "./Handled Calls Analysis/HandledCallsAnalysis";
import { CallsHandledByDTMF } from "./autopilot-calls-handled-by-DTMF/CallsHandledByDTMF";
import { CallDurationDistribution } from "./Call Duration Distribution/CallDurationDistribution";
import { CategoryDistribution } from "./Category Distribution/CategoryDistribution";
import { FrequentCallers } from "./Frequent Callers/FrequentCallers";
import { IntentTransitionAnalysis } from "./Intent Transition Analysis/IntentTransitionAnalysis";
import { AutopilotSankeyChart } from "./Sankey Chart/AutopilotSankeyChart";
import { CategoryWiseFailureReason } from "./Category Wise Failure Reason/CategoryWiseFailureReason";
import { CategoryWiseFailureReasonAttempt } from "./Category Wise Failure Reason Attempt/CategoryWiseFailureReasonAttempt";
import { CategoryWiseVDN } from "./Category Wise VDN/CategoryWiseVDN";
import { WeeklyTrendsAndPatterns } from "./Weekly Trends/WeeklyTrendsAndPatterns";

export default function AutopilotDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
          icon={<PhoneIncoming style={{ color: 'white', fontSize: 20 }} />}
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
          icon={<PhoneOutgoing style={{ color: 'white', fontSize: 20 }} />}
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

      {/* Category-wise Failure Reason Attempt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <CategoryWiseFailureReasonAttempt />
      </motion.div>

      {/* Frequent Callers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        <FrequentCallers />
      </motion.div>

      {/* Call Duration Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <CallDurationDistribution />
      </motion.div>

      {/* Intent Transition Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65 }}
      >
        <IntentTransitionAnalysis />
      </motion.div>

      {/* Category-wise VDN Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <CategoryWiseVDN />
      </motion.div>

      {/* Weekly Trends and Patterns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.75 }}
      >
        <WeeklyTrendsAndPatterns />
      </motion.div>
    </div>
  );
}
