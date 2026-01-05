import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Server, ArrowRight, Activity, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { Instance } from "@/pages/PostCallAnalyzer";

interface InstanceSelectorProps {
  instances: Instance[];
  onSelectInstance: (instance: Instance) => void;
}

export const InstanceSelector = ({ instances, onSelectInstance }: InstanceSelectorProps) => {
  const [search, setSearch] = useState("");
  
  const filteredInstances = instances.filter(instance =>
    instance.name.toLowerCase().includes(search.toLowerCase())
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
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Server className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Instances</h1>
                <p className="text-sm text-muted-foreground">Select an instance to view its analytics and configuration</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4 text-blue-500" />
              <span>{instances.length} active</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="relative max-w-md">
          <Input
            placeholder="Search instances..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-4 pr-4 h-11 bg-card border-border/50 focus:border-border focus:outline-none transition-colors"
          />
        </div>
      </motion.div>

      {/* Instance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredInstances.map((instance, index) => (
            <motion.div
              key={instance.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              whileHover={{ y: -4 }}
            >
              <Card
                className="group relative overflow-hidden cursor-pointer border border-border/50 bg-card hover:border-blue-500/30 hover:shadow-lg transition-all duration-300"
                onClick={() => onSelectInstance(instance)}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/15 transition-colors">
                          <Server className="h-5 w-5 text-blue-500" />
                        </div>
                        {/* Status indicator */}
                        <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-success rounded-full border-2 border-card" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-blue-500 transition-colors">
                          {instance.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Post Call Analyzer
                        </p>
                      </div>
                    </div>
                    
                    <ArrowRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
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
          <Server className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No instances found matching "{search}"</p>
        </motion.div>
      )}
    </div>
  );
};
