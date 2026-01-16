import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  Typography, 
  Input,
} from "antd";
import { 
  IconDatabase, 
  IconArrowRight, 
  IconApi, 
} from "@tabler/icons-react";
import { useState } from "react";
import type { Instance } from "@/pages/PostCallAnalyzer";

const { Title, Text } = Typography;

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
        <Card className="rounded-xl border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <IconDatabase className="text-white text-xl" />
              </div>
              <div>
                <Title level={3} className="!m-0 !text-xl !font-semibold">Instances</Title>
                <Text type="secondary" className="text-sm">Select an instance to view its analytics and configuration</Text>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IconApi className="text-blue-500 text-base" />
              <Text type="secondary" className="text-sm">{instances.length} active</Text>
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
        <div className="max-w-md">
          <Input
            placeholder="Search instances..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<IconDatabase className="text-slate-400" />}
            className="h-11 rounded-lg bg-slate-50 border-slate-200"
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
                className="rounded-xl border-slate-200 cursor-pointer relative overflow-hidden transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/15 group"
                onClick={() => onSelectInstance(instance)}
                styles={{ body: { padding: 20 } }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="p-3 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/15 transition-colors duration-300">
                          <IconDatabase className="text-blue-500 text-xl" />
                        </div>
                        {/* Status indicator */}
                        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                      </div>
                      <div>
                        <Text strong className="text-lg text-gray-800 group-hover:text-blue-500 transition-colors duration-300 block">
                          {instance.name}
                        </Text>
                      </div>
                    </div>
                    
                    <IconArrowRight className="text-slate-400 text-xl group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
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
          className="text-center py-12"
        >
          <IconDatabase className="text-5xl text-slate-400 mb-3" />
          <Text type="secondary">No instances found matching "{search}"</Text>
        </motion.div>
      )}
    </div>
  );
};
