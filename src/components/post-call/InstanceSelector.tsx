import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Server } from "lucide-react";
import type { Instance } from "@/pages/PostCallAnalyzer";

interface InstanceSelectorProps {
  instances: Instance[];
  onSelectInstance: (instance: Instance) => void;
}

export const InstanceSelector = ({ instances, onSelectInstance }: InstanceSelectorProps) => {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Instances</h2>
        <p className="text-sm text-muted-foreground">
          All the instances available with their features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {instances.map((instance, index) => (
          <motion.div
            key={instance.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card
              className="p-4 cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200 group bg-card hover:bg-accent/5"
              onClick={() => onSelectInstance(instance)}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                  <Server className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {instance.name}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};
