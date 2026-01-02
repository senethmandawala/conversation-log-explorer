import { motion } from "framer-motion";
import { PostCallDashboard } from "@/components/post-call/PostCallDashboard";

// Default instance for dashboard view
const defaultInstance = {
  id: "default",
  name: "Default Instance",
  description: "Post Call Analyzer Dashboard",
  status: "active" as const,
  lastUpdated: new Date().toISOString(),
};

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-full"
    >
      <PostCallDashboard
        instance={defaultInstance}
        onBack={() => {}}
      />
    </motion.div>
  );
}
