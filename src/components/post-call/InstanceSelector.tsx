import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  Typography, 
} from "antd";
import { 
  IconPhoto, 
  IconPhone,
  IconArrowRight,
} from "@tabler/icons-react";
import type { Instance } from "@/pages/PostCallAnalyzer";

const { Title, Text } = Typography;

interface InstanceSelectorProps {
  instances: Instance[];
  onSelectInstance: (instance: Instance) => void;
}

export const InstanceSelector = ({ instances, onSelectInstance }: InstanceSelectorProps) => {
  return (
    <div className="space-y-6">
      {/* Module Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <IconPhone className="h-5 w-5 text-primary" />
        </div>
        <Title level={3} className="!m-0 !text-xl !font-semibold !text-primary">
          Post Call Analyzer
        </Title>
      </motion.div>

      {/* Instances Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Title level={4} className="!m-0 !text-lg !font-semibold !text-foreground">
          Instances
        </Title>
        <Text type="secondary" className="text-sm">
          All the instances available with their features.
        </Text>
      </motion.div>

      {/* Instance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {instances.map((instance, index) => (
            <motion.div
              key={instance.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              whileHover={{ y: -4 }}
            >
              <Card
                className="rounded-xl border-border cursor-pointer relative overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/15 group"
                onClick={() => onSelectInstance(instance)}
                styles={{ body: { padding: 20 } }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors duration-300">
                          <IconPhoto className="h-5 w-5 text-primary" />
                        </div>
                        {/* Status indicator */}
                        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                      </div>
                      <div>
                        <Text strong className="text-base text-foreground group-hover:text-primary transition-colors duration-300 block">
                          {instance.name}
                        </Text>
                      </div>
                    </div>
                    
                    <IconArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {instances.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <IconPhoto className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <Text type="secondary">No instances available</Text>
        </motion.div>
      )}
    </div>
  );
};
