import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneOff,
  Bot,
  AlertTriangle,
  TrendingUp,
  Users,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts";

// Wide stat card component
interface WideStatCardProps {
  color: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  tooltip?: string;
  rightItems?: { label: string; value: string; tooltip?: string }[];
}

const WideStatCard = ({ color, icon, label, value, rightItems }: WideStatCardProps) => {
  const colorClasses: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    green: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30",
    red: "from-red-500/20 to-red-600/20 border-red-500/30",
    amber: "from-amber-500/20 to-amber-600/20 border-amber-500/30",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
  };

  const iconColorClasses: Record<string, string> = {
    blue: "bg-blue-500/20 text-blue-500",
    green: "bg-emerald-500/20 text-emerald-500",
    red: "bg-red-500/20 text-red-500",
    amber: "bg-amber-500/20 text-amber-500",
    purple: "bg-purple-500/20 text-purple-500",
  };

  return (
    <Card className={`p-4 bg-gradient-to-r ${colorClasses[color]} border backdrop-blur-sm`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${iconColorClasses[color]}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
        </div>
        {rightItems && (
          <div className="flex flex-wrap gap-6">
            {rightItems.map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-lg font-semibold text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

// Category distribution data
const categoryData = [
  { name: "Billing Inquiries", value: 35, color: "#8b5cf6" },
  { name: "Technical Support", value: 25, color: "#3b82f6" },
  { name: "General Questions", value: 20, color: "#10b981" },
  { name: "Sales", value: 12, color: "#f59e0b" },
  { name: "Others", value: 8, color: "#6b7280" },
];

// Handled calls data
const handledCallsData = [
  { date: "Mon", aiResolved: 120, partiallyResolved: 45, transferred: 30 },
  { date: "Tue", aiResolved: 150, partiallyResolved: 55, transferred: 35 },
  { date: "Wed", aiResolved: 140, partiallyResolved: 50, transferred: 40 },
  { date: "Thu", aiResolved: 180, partiallyResolved: 60, transferred: 25 },
  { date: "Fri", aiResolved: 160, partiallyResolved: 70, transferred: 45 },
  { date: "Sat", aiResolved: 90, partiallyResolved: 30, transferred: 20 },
  { date: "Sun", aiResolved: 70, partiallyResolved: 25, transferred: 15 },
];

// Call duration data
const callDurationData = [
  { range: "0-30s", count: 245 },
  { range: "30s-1m", count: 380 },
  { range: "1-2m", count: 290 },
  { range: "2-5m", count: 180 },
  { range: "5m+", count: 85 },
];

// Intent transition data
const intentTransitionData = [
  { hour: "00:00", billing: 10, support: 15, sales: 5 },
  { hour: "04:00", billing: 8, support: 12, sales: 3 },
  { hour: "08:00", billing: 45, support: 60, sales: 25 },
  { hour: "12:00", billing: 80, support: 95, sales: 40 },
  { hour: "16:00", billing: 65, support: 80, sales: 35 },
  { hour: "20:00", billing: 30, support: 40, sales: 15 },
];

// Frequent callers data
const frequentCallersData = [
  { msisdn: "****5678", calls: 12, category: "Billing", sentiment: "Negative" },
  { msisdn: "****1234", calls: 8, category: "Support", sentiment: "Neutral" },
  { msisdn: "****9012", calls: 6, category: "Sales", sentiment: "Positive" },
  { msisdn: "****3456", calls: 5, category: "Billing", sentiment: "Negative" },
  { msisdn: "****7890", calls: 4, category: "Support", sentiment: "Neutral" },
];

export default function AutopilotDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Wide Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <WideStatCard
          color="blue"
          icon={<PhoneIncoming className="h-6 w-6" />}
          label="Total Incoming Calls"
          value="12,450"
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
          icon={<PhoneOutgoing className="h-6 w-6" />}
          label="Transferred to Agent"
          value="2,340"
          rightItems={[
            { label: "API Fail Transfer", value: "120" },
            { label: "Failed Transfer", value: "85" },
            { label: "Direct Transfer", value: "450" },
            { label: "Successfully Routed", value: "1,685" },
          ]}
        />
      </motion.div>

      {/* Handled Calls Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Handled Calls Analysis</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={handledCallsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="aiResolved" name="AI Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="partiallyResolved" name="Partially Resolved" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="transferred" name="Transferred" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Category Distribution & Subcategory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm h-full">
            <h3 className="text-lg font-semibold text-foreground mb-4">Category Distribution</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    onClick={(data) => setSelectedCategory(data.name)}
                    style={{ cursor: "pointer" }}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {categoryData.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                  onClick={() => setSelectedCategory(entry.name)}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {selectedCategory} - Subcategories
                </h3>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                {["Payment Issues", "Invoice Queries", "Refund Requests", "Plan Changes", "Others"].map((sub, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-foreground">{sub}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{Math.floor(Math.random() * 200 + 50)}</span>
                      <Badge variant="outline" className="text-xs">
                        {Math.floor(Math.random() * 30 + 5)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {!selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm h-full">
              <h3 className="text-lg font-semibold text-foreground mb-4">Call Duration Distribution</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={callDurationData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis dataKey="range" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={60} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Frequent Callers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Frequent Callers</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">MSISDN</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Calls</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {frequentCallersData.map((caller, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 text-sm font-mono text-foreground">{caller.msisdn}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{caller.calls}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-xs">{caller.category}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          caller.sentiment === "Positive"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : caller.sentiment === "Negative"
                            ? "bg-red-500/10 text-red-600 border-red-500/20"
                            : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                        }`}
                      >
                        {caller.sentiment}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Intent Transition Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Intent Transition Analysis</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={intentTransitionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="billing" name="Billing" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="support" name="Support" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="sales" name="Sales" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
