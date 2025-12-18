import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Bot, Users, MessageSquare, Clock, ArrowRight, Sparkles } from "lucide-react";

interface AutopilotInstance {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "maintenance";
  conversations: number;
  avgResponseTime: string;
  lastActive: string;
}

const mockInstances: AutopilotInstance[] = [
  {
    id: "1",
    name: "Customer Support Bot",
    description: "Handles general customer inquiries and FAQs",
    status: "active",
    conversations: 15420,
    avgResponseTime: "1.2s",
    lastActive: "2 minutes ago",
  },
  {
    id: "2",
    name: "Sales Assistant",
    description: "Guides customers through product selection",
    status: "active",
    conversations: 8930,
    avgResponseTime: "0.8s",
    lastActive: "5 minutes ago",
  },
  {
    id: "3",
    name: "Technical Support",
    description: "Provides technical troubleshooting assistance",
    status: "maintenance",
    conversations: 12100,
    avgResponseTime: "2.1s",
    lastActive: "1 hour ago",
  },
  {
    id: "4",
    name: "Billing Inquiries",
    description: "Handles billing questions and payment issues",
    status: "active",
    conversations: 6540,
    avgResponseTime: "1.5s",
    lastActive: "10 minutes ago",
  },
  {
    id: "5",
    name: "Onboarding Assistant",
    description: "Helps new users get started with the platform",
    status: "inactive",
    conversations: 3200,
    avgResponseTime: "1.0s",
    lastActive: "2 days ago",
  },
];

const statusColors = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  inactive: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  maintenance: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

export default function Autopilot() {
  const [search, setSearch] = useState("");
  const [selectedInstance, setSelectedInstance] = useState<AutopilotInstance | null>(null);

  const filteredInstances = mockInstances.filter(
    (instance) =>
      instance.name.toLowerCase().includes(search.toLowerCase()) ||
      instance.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectInstance = (instance: AutopilotInstance) => {
    setSelectedInstance(instance);
    // TODO: Navigate to autopilot dashboard when implemented
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Autopilot Instances</h1>
            <p className="text-sm text-muted-foreground">Select an instance to manage</p>
          </div>
        </div>
      </motion.div>

      {/* Search and Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search instances..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl border-border/60 bg-card/50"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="rounded-lg px-3 py-1">
            {filteredInstances.length} instances
          </Badge>
          <Badge variant="outline" className="rounded-lg px-3 py-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            {filteredInstances.filter((i) => i.status === "active").length} active
          </Badge>
        </div>
      </motion.div>

      {/* Instance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredInstances.map((instance, index) => (
            <motion.div
              key={instance.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Card
                onClick={() => handleSelectInstance(instance)}
                className="relative p-5 border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer group hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-colors">
                        <Bot className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-purple-600 transition-colors">
                          {instance.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${statusColors[instance.status]}`}
                        >
                          {instance.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {instance.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                        <MessageSquare className="h-3 w-3" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {instance.conversations.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Conversations</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                        <Clock className="h-3 w-3" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {instance.avgResponseTime}
                      </p>
                      <p className="text-xs text-muted-foreground">Avg Response</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                        <Sparkles className="h-3 w-3" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">98%</p>
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Last active: {instance.lastActive}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                      <ArrowRight className="h-4 w-4 text-purple-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredInstances.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Bot className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No instances found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search criteria
          </p>
        </motion.div>
      )}
    </div>
  );
}
