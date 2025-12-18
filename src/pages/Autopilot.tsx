import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, LayoutDashboard, FileText, Settings, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AutopilotInstanceSelector from "./autopilot/AutopilotInstanceSelector";
import AutopilotDashboard from "./autopilot/AutopilotDashboard";
import AutopilotReports from "./autopilot/AutopilotReports";
import AutopilotConfiguration from "./autopilot/AutopilotConfiguration";

interface AutopilotInstance {
  id: string;
  name: string;
  description: string;
  channels: string;
}

export default function Autopilot() {
  const [selectedInstance, setSelectedInstance] = useState<AutopilotInstance | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleSelectInstance = (instance: AutopilotInstance) => {
    setSelectedInstance(instance);
    setActiveTab("dashboard");
  };

  const handleBackToInstances = () => {
    setSelectedInstance(null);
  };

  if (!selectedInstance) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <AutopilotInstanceSelector onSelectInstance={handleSelectInstance} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header with Back Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToInstances}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Instances
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{selectedInstance.name}</h1>
            <p className="text-sm text-muted-foreground">{selectedInstance.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="dashboard" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="configuration" className="gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AutopilotDashboard />
        </TabsContent>

        <TabsContent value="reports">
          <AutopilotReports />
        </TabsContent>

        <TabsContent value="configuration">
          <AutopilotConfiguration />
        </TabsContent>
      </Tabs>
    </div>
  );
}
