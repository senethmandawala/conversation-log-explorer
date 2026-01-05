import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, MessageSquare, Phone, Zap, Search } from "lucide-react";

interface AutopilotInstance {
  id: string;
  name: string;
  description: string;
  channels: string;
}

const mockInstances: AutopilotInstance[] = [
  {
    id: "1",
    name: "Customer Support Bot",
    description: "Handles general customer inquiries and FAQs",
    channels: "Voice, Chat",
  },
  {
    id: "2",
    name: "Sales Assistant",
    description: "Guides customers through product selection",
    channels: "Chat, WhatsApp",
  },
  {
    id: "3",
    name: "Technical Support",
    description: "Provides technical troubleshooting assistance",
    channels: "Voice",
  },
  {
    id: "4",
    name: "Billing Inquiries",
    description: "Handles billing questions and payment issues",
    channels: "Voice, Chat",
  },
  {
    id: "5",
    name: "Onboarding Assistant",
    description: "Helps new users get started with the platform",
    channels: "Chat",
  },
  {
    id: "6",
    name: "Appointment Scheduler",
    description: "Manages appointment bookings and reminders",
    channels: "Voice, SMS",
  },
];

interface AutopilotInstanceSelectorProps {
  onSelectInstance: (instance: AutopilotInstance) => void;
}

export default function AutopilotInstanceSelector({ onSelectInstance }: AutopilotInstanceSelectorProps) {
  const [search, setSearch] = useState("");
  
  const filteredInstances = mockInstances.filter(instance =>
    instance.name.toLowerCase().includes(search.toLowerCase()) ||
    instance.description.toLowerCase().includes(search.toLowerCase()) ||
    instance.channels.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Instances</h1>
                <p className="text-sm text-muted-foreground">Select an instance to view its analytics and configuration</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-purple-500" />
              <span>{mockInstances.length} active</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search instances..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 h-11 bg-card border-border/50 focus:border-purple-500 focus:outline-none transition-colors"
          />
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
                onClick={() => onSelectInstance(instance)}
                className="p-5 border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer group hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all duration-300 h-full"
              >
                {/* Icon */}
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-4 group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-colors">
                  <Bot className="h-6 w-6 text-purple-500" />
                </div>

                {/* Title */}
                <h3 className="font-semibold text-foreground group-hover:text-purple-600 transition-colors mb-2">
                  {instance.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {instance.description}
                </p>

                {/* Channels */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  <span>{instance.channels}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredInstances.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-muted-foreground"
        >
          <Bot className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No instances found matching "{search}"</p>
        </motion.div>
      )}
    </div>
  );
}
