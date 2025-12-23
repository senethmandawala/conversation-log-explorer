import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, RefreshCw, Calendar, List } from "lucide-react";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CaseStatusOverall } from "./CaseStatusOverall";
import { CaseStatusTopCategories } from "./CaseStatusTopCategories";
import { CaseStatusTopAgents } from "./CaseStatusTopAgents";
import { AverageTimeTopCategories } from "./AverageTimeTopCategories";
import { AverageTimeTopAgents } from "./AverageTimeTopAgents";
import { motion, AnimatePresence } from "framer-motion";

interface SelectedCategory {
  name: string;
  color: string;
}

export default function CallResolutionReport() {
  const navigate = useNavigate();
  const { setShowModuleTabs } = useModule();
  const [activeTab, setActiveTab] = useState("resolution-status");
  
  const [selectedCaseType, setSelectedCaseType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory | null>(null);
  
  const [col1Visible, setCol1Visible] = useState(true);
  const [col2Visible, setCol2Visible] = useState(false);
  const [col3Visible, setCol3Visible] = useState(false);
  
  const [col1Class, setCol1Class] = useState("col-span-12");
  const [col2Class, setCol2Class] = useState("col-span-6");
  const [col3Class, setCol3Class] = useState("col-span-6");

  const [averageTime, setAverageTime] = useState("8.5 min");
  const [callCount, setCallCount] = useState("1,234");

  useEffect(() => {
    setShowModuleTabs(true);
    return () => setShowModuleTabs(true);
  }, [setShowModuleTabs]);

  const handleCaseSelect = (caseType: string) => {
    setSelectedCaseType(caseType);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Class("col-span-6");
    setCol2Class("col-span-6");
    setCol3Class("col-span-6");
  };

  const handleCaseStatusCategorySelect = (category: SelectedCategory) => {
    setSelectedCategory(category);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(true);
    setCol1Class("col-span-3");
    setCol2Class("col-span-4");
    setCol3Class("col-span-5");
  };

  const handleAverageTimeCategorySelect = (category: SelectedCategory) => {
    setSelectedCategory(category);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol1Class("col-span-6");
    setCol2Class("col-span-6");
  };

  const handleCloseCategoryChart = () => {
    setSelectedCaseType("");
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol3Visible(false);
    setCol1Class("col-span-12");
    setCol2Class("col-span-6");
    setCol3Class("col-span-6");
  };

  const handleCloseAgentChart = () => {
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Class("col-span-6");
    setCol2Class("col-span-6");
    setCol3Class("col-span-6");
  };

  const handleCloseAverageTimeAgentChart = () => {
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol1Class("col-span-12");
    setCol2Class("col-span-6");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol3Visible(false);
    setSelectedCaseType("");
    setSelectedCategory(null);
    setCol1Class("col-span-12");
    setCol2Class("col-span-6");
    setCol3Class("col-span-6");
  };

  const handleReload = () => {
    handleCloseCategoryChart();
  };

  return (
    <Card className="border-border/50">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate("/post-call-analyzer/reports")}
                  className="h-10 w-10 rounded-lg"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl font-semibold tracking-tight">
                      Call Resolution
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Track resolution rates and handling times</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Resolution status and average handling time analysis
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Today
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleReload}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="resolution-status">Resolution Status</TabsTrigger>
                <TabsTrigger value="average-time">Average Resolution Time</TabsTrigger>
              </TabsList>

              <TabsContent value="resolution-status" className="mt-6">
                <div className="grid grid-cols-12 gap-4">
                  <AnimatePresence mode="sync">
                    {col1Visible && (
                      <motion.div
                        key="col1-status"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className={col1Class}
                      >
                        <CaseStatusOverall onCaseSelect={handleCaseSelect} />
                      </motion.div>
                    )}

                    {col2Visible && selectedCaseType && (
                      <motion.div
                        key="col2-status"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className={col2Class}
                      >
                        <CaseStatusTopCategories
                          selectedCaseType={selectedCaseType}
                          onCategorySelect={handleCaseStatusCategorySelect}
                          onClose={handleCloseCategoryChart}
                        />
                      </motion.div>
                    )}

                    {col3Visible && selectedCategory && (
                      <motion.div
                        key="col3-status"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className={col3Class}
                      >
                        <CaseStatusTopAgents
                          selectedCaseType={selectedCaseType}
                          selectedCategory={selectedCategory}
                          onClose={handleCloseAgentChart}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </TabsContent>

              <TabsContent value="average-time" className="mt-6">
                <div className="mb-4">
                  <Card className="border-border/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Average Resolution Time</p>
                          <div className="flex items-baseline gap-2">
                            <h2 className="text-3xl font-bold">{averageTime}</h2>
                            <span className="text-sm text-muted-foreground">from {callCount} calls</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <AnimatePresence mode="sync">
                    {col1Visible && (
                      <motion.div
                        key="col1-avgtime"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className={col1Class}
                      >
                        <AverageTimeTopCategories onCategorySelect={handleAverageTimeCategorySelect} />
                      </motion.div>
                    )}

                    {col2Visible && selectedCategory && (
                      <motion.div
                        key="col2-avgtime"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className={col2Class}
                      >
                        <AverageTimeTopAgents
                          selectedCategory={selectedCategory}
                          onClose={handleCloseAverageTimeAgentChart}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
    </Card>
  );
}
