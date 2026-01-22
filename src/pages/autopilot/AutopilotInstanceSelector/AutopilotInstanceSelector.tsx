import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  Typography, 
} from "antd";
import { 
  IconRobot,
  IconBolt,
} from "@tabler/icons-react";

const { Title, Text } = Typography;

interface AutopilotInstance {
  id: string;
  name: string;
  description: string;
  channels: string;
}

interface AutopilotInstanceSelectorProps {
  onSelectInstance: (instance: AutopilotInstance) => void;
}

export default function AutopilotInstanceSelector({ onSelectInstance }: AutopilotInstanceSelectorProps) {
  // Load instances from localStorage
  const loadInstances = (): AutopilotInstance[] => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      const autopilotProjects = user.autopilotProjectList || [];
      return autopilotProjects.map((project: any) => ({
        id: project.project_id || project.id,
        name: project.project_name || project.name,
        description: project.description || '',
        channels: project.channels || ''
      }));
    }
    return [];
  };

  const instances = loadInstances();

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
          <img src="/src/assets/images/autopilot.svg" alt="Autopilot" className="h-7 w-7" />
        </div>
        <Title level={3} className="!m-0 !text-xl !font-semibold !text-heading">
          Autopilot
        </Title>
      </motion.div>

      {/* Instances Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Title level={4} className="!m-0 !text-lg !font-semibold !text-heading">
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Card
                className="rounded-xl border-border cursor-pointer h-full relative overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 group !bg-card"
                onClick={() => onSelectInstance(instance)}
                styles={{ body: { padding: 20 } }}
              >
                {/* Gradient Background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon */}
                <div className="relative w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center mb-4 transition-colors duration-300">
                  <IconRobot className="h-6 w-6 text-primary" />
                </div>

                {/* Title */}
                <Title 
                  level={4} 
                  className="relative !m-0 !mb-2 !text-foreground group-hover:!text-primary transition-colors duration-300"
                >
                  {instance.name}
                </Title>

                {/* Description */}
                <Text 
                  type="secondary" 
                  className="relative text-sm mb-4 block overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {instance.description}
                </Text>

                {/* Channels */}
                <div className="relative flex items-center gap-2">
                  <IconBolt className="h-4 w-4 text-muted-foreground" />
                  <Text type="secondary" className="text-sm">{instance.channels}</Text>
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
          <IconRobot className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <Text type="secondary">No instances available</Text>
        </motion.div>
      )}
    </div>
  );
}
