import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, RefreshCw, Calendar, List } from "lucide-react";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersSentiment } from "./UsersSentiment";
import { SentimentTopCategories } from "./SentimentTopCategories";
import { SentimentTopAgents } from "./SentimentTopAgents";
import { AgentsSentiment } from "./AgentsSentiment";
import { AgentsSentimentTopCategory } from "./AgentsSentimentTopCategory";
import { AgentsSentimentTopAgents } from "./AgentsSentimentTopAgents";
import { motion, AnimatePresence } from "framer-motion";

interface SelectedCategory {
  name: string;
  color: string;
}

export default function SentimentAnalysisReport() {
  const navigate = useNavigate();
  const { setShowModuleTabs } = useModule();
  const [activeTab, setActiveTab] = useState("callers");
  
  const [selectedSentiment, setSelectedSentiment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory | null>(null);
  
  const [col1Visible, setCol1Visible] = useState(true);
  const [col2Visible, setCol2Visible] = useState(false);
  const [col3Visible, setCol3Visible] = useState(false);
  
  const [col1Class, setCol1Class] = useState("col-span-12");
  const [col2Class, setCol2Class] = useState("col-span-6");
  const [col3Class, setCol3Class] = useState("col-span-5");

  useEffect(() => {
    setShowModuleTabs(true);
    return () => setShowModuleTabs(true);
  }, [setShowModuleTabs]);

  const handleUserSentimentSelect = (sentiment: string) => {
    setSelectedSentiment(sentiment);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Class("col-span-6");
    setCol2Class("col-span-6");
    setCol3Class("col-span-5");
  };

  const handleAgentSentimentSelect = (sentiment: string) => {
    setSelectedSentiment(sentiment);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Class("col-span-6");
    setCol2Class("col-span-6");
    setCol3Class("col-span-5");
  };

  const handleCategorySelect = (category: SelectedCategory) => {
    setSelectedCategory(category);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(true);
    setCol1Class("col-span-3");
    setCol2Class("col-span-4");
    setCol3Class("col-span-5");
  };

  const handleCloseCategoryChart = () => {
    setSelectedSentiment("");
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol3Visible(false);
    setCol1Class("col-span-12");
    setCol2Class("col-span-6");
    setCol3Class("col-span-5");
  };

  const handleCloseAgentChart = () => {
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Class("col-span-6");
    setCol2Class("col-span-6");
    setCol3Class("col-span-5");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol3Visible(false);
    setSelectedSentiment("");
    setSelectedCategory(null);
    setCol1Class("col-span-12");
    setCol2Class("col-span-6");
    setCol3Class("col-span-5");
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
                      Sentiment Analysis
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Analyze user and agent sentiment patterns</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    User and agent sentiment distribution across calls
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
                <TabsTrigger value="callers">Callers</TabsTrigger>
                <TabsTrigger value="agents">Agents</TabsTrigger>
              </TabsList>

              <TabsContent value="callers" className="mt-6">
                <div className="grid grid-cols-12 gap-4">
                  <AnimatePresence mode="sync">
                    {col1Visible && (
                      <motion.div
                        key="col1-callers"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className={col1Class}
                      >
                        <UsersSentiment onSentimentSelect={handleUserSentimentSelect} />
                      </motion.div>
                    )}

                    {col2Visible && selectedSentiment && (
                      <motion.div
                        key="col2-callers"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className={col2Class}
                      >
                        <SentimentTopCategories
                          selectedSentiment={selectedSentiment}
                          onCategorySelect={handleCategorySelect}
                          onClose={handleCloseCategoryChart}
                        />
                      </motion.div>
                    )}

                    {col3Visible && selectedCategory && (
                      <motion.div
                        key="col3-callers"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className={col3Class}
                      >
                        <SentimentTopAgents
                          selectedSentiment={selectedSentiment}
                          selectedCategory={selectedCategory}
                          onClose={handleCloseAgentChart}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </TabsContent>

              <TabsContent value="agents" className="mt-6">
                <div className="grid grid-cols-12 gap-4">
                  <AnimatePresence mode="sync">
                    {col1Visible && (
                      <motion.div
                        key="col1-agents"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className={col1Class}
                      >
                        <AgentsSentiment onSentimentSelect={handleAgentSentimentSelect} />
                      </motion.div>
                    )}

                    {col2Visible && selectedSentiment && (
                      <motion.div
                        key="col2-agents"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className={col2Class}
                      >
                        <AgentsSentimentTopCategory
                          selectedSentiment={selectedSentiment}
                          onCategorySelect={handleCategorySelect}
                          onClose={handleCloseCategoryChart}
                        />
                      </motion.div>
                    )}

                    {col3Visible && selectedCategory && (
                      <motion.div
                        key="col3-agents"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className={col3Class}
                      >
                        <AgentsSentimentTopAgents
                          selectedSentiment={selectedSentiment}
                          selectedCategory={selectedCategory}
                          onClose={handleCloseAgentChart}
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
