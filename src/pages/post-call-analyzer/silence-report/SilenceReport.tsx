import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";

// Mock data for silence reasons
const mockSilenceReasons = [
  "Customer put the call on hold to check information",
  "Agent searching for customer account details in the system",
  "Technical issue causing audio delay or interruption",
  "Customer consulting with another person before responding",
  "Agent reviewing policy or procedure documentation",
  "Network latency causing communication gaps",
  "Customer reading terms and conditions or documentation",
  "Agent waiting for system response or loading",
  "Customer calculating or verifying payment information",
  "Transfer or call routing process in progress",
  "Agent consulting with supervisor or colleague",
  "Customer experiencing emotional distress requiring pause",
  "System authentication or verification process",
  "Customer multitasking during the call",
  "Agent documenting call notes or updating records"
];

export default function SilenceReport() {
  const navigate = useNavigate();
  const { setShowModuleTabs } = useModule();
  const [loading, setLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState(false);
  const [silenceReasons, setSilenceReasons] = useState<string[]>([]);

  useEffect(() => {
    setShowModuleTabs(true);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setSilenceReasons(mockSilenceReasons);
      setLoading(false);
    }, 800);

    return () => {
      setShowModuleTabs(true);
      clearTimeout(timer);
    };
  }, [setShowModuleTabs]);

  return (
    <>
      <div className="p-6 space-y-6">
        <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate("/post-call-analyzer/reports")}
                  className="h-9 w-9 shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-xl font-semibold">
                    Silence Reasons Report
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Analyze and visualize the reasons for silence detected in calls
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-sm text-muted-foreground">Loading silence reasons...</p>
              </div>
            ) : errorLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                <VolumeX className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Error loading data</p>
                <p className="text-sm">There was an error loading the silence reasons. Please try again later.</p>
              </div>
            ) : silenceReasons.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <VolumeX className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No data available</p>
                <p className="text-sm">There are no silence reasons available for the selected period.</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="border border-border/50 rounded-lg p-6 bg-card">
                  <ul className="space-y-3">
                    {silenceReasons.map((reason, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm text-foreground leading-relaxed pt-1">
                          {reason}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
      <AIHelper />
    </>
  );
}
