import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Circle,
  Info,
  FileText,
  Calendar,
  Clock,
  Phone,
  User,
  Timer,
  Tag,
  Volume2
} from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Mock word data for Keywords section
const mockWordData = [
  { text: "billing", value: 95 },
  { text: "conversation", value: 85 },
  { text: "support", value: 75 },
  { text: "account", value: 70 },
  { text: "payment", value: 65 },
  { text: "service", value: 60 },
  { text: "customer", value: 55 },
  { text: "issue", value: 50 },
  { text: "resolved", value: 45 },
  { text: "charge", value: 40 },
];

interface CallLogDetailsProps {
  callLog: {
    id: string;
    date: string;
    time: string;
    msisdn: string;
    agent: string;
    callDuration: string;
    category: string;
    subCategory: string;
    userSentiment: "positive" | "negative" | "neutral";
    agentSentiment: "positive" | "negative" | "neutral";
    summary: string;
    audioUrl?: string;
    transcription?: { speaker: string; text: string; timestamp: string }[];
  } | null;
  open: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

function DetailItem({ icon, label, value, delay = 0 }: { icon: React.ReactNode; label: string; value: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }} className="flex items-start gap-4 py-3">
      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
        <div className="text-sm font-medium text-foreground">{value || <span className="text-muted-foreground">N/A</span>}</div>
      </div>
    </motion.div>
  );
}

const mockScoreSections = [
  {
    title: "Communication Skills",
    scoreValue: 8,
    total: 10,
    subSections: [
      { context: "Clear and professional greeting", completed: 100 },
      { context: "Active listening demonstrated", completed: 100 },
      { context: "Proper call closing", completed: 75 },
      { context: "Empathy shown throughout call", completed: 50 },
    ],
  },
  {
    title: "Problem Resolution",
    scoreValue: 7,
    total: 10,
    subSections: [
      { context: "Issue identified correctly", completed: 100 },
      { context: "Appropriate solution provided", completed: 100 },
      { context: "Follow-up actions explained", completed: 0 },
      { context: "Customer confirmation obtained", completed: 75 },
    ],
  },
  {
    title: "Compliance",
    scoreValue: 9,
    total: 10,
    subSections: [
      { context: "Identity verification completed", completed: 100 },
      { context: "Disclosure statements provided", completed: 100 },
      { context: "Data protection guidelines followed", completed: 100 },
    ],
  },
];

const mockMetaData = [
  { dataField: "Customer ID", metaData: "CUST-12345", conValue: "CUST-12345" },
  { dataField: "Account Type", metaData: "Premium", conValue: "Premium" },
  { dataField: "Region", metaData: "North", conValue: "East" },
  { dataField: "Language", metaData: "English", conValue: "English" },
];

const mockRecommendations = [
  { description: "Consider offering a loyalty discount to retain the customer" },
  { description: "Follow up within 48 hours to ensure issue resolution" },
  { description: "Update customer preferences in CRM system" },
];

const mockRetentionStrategies = [
  { title: "Offered promotional rate for next 6 months" },
  { title: "Provided dedicated support contact" },
  { title: "Scheduled follow-up call for service review" },
];

const scoreChartData = [
  { name: "Communication", score: 80 },
  { name: "Resolution", score: 70 },
  { name: "Compliance", score: 90 },
  { name: "Empathy", score: 65 },
];

const SentimentIcon = ({ sentiment }: { sentiment: "positive" | "negative" | "neutral" }) => {
  switch (sentiment) {
    case "positive":
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "negative":
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    default:
      return <Minus className="h-4 w-4 text-yellow-500" />;
  }
};

const getCompletionIcon = (completed: number) => {
  if (completed === 100) {
    return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  } else if (completed === 0) {
    return <Circle className="h-4 w-4 text-muted-foreground" />;
  } else if (completed <= 25) {
    return <CheckCircle2 className="h-4 w-4 text-red-500" />;
  } else if (completed <= 75) {
    return <CheckCircle2 className="h-4 w-4 text-amber-500" />;
  } else {
    return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  }
};

export function CallLogDetails({ callLog, open, onClose, isLoading = false }: CallLogDetailsProps) {
  const [activeTab, setActiveTab] = useState("call-info");
  const [keywordView, setKeywordView] = useState<string>("cloud");

  if (!callLog) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-background/95 backdrop-blur-lg border-l border-border/50">
        <SheetHeader className="pb-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <SheetTitle className="text-xl font-semibold flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              Call Details
            </SheetTitle>
          </motion.div>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="call-info">Call Info</TabsTrigger>
              <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
              <TabsTrigger value="analysis">Analysis Summary</TabsTrigger>
            </TabsList>

            {/* Call Info Tab */}
            <TabsContent value="call-info" className="space-y-1 mt-0">
              {/* Header Layout - Date/Time and MSISDN/Agent */}
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-4 mb-3 mt-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</p>
                    <p className="text-sm font-medium text-foreground">{callLog.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</p>
                    <p className="text-sm font-medium text-foreground">{callLog.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">MSISDN</p>
                    <p className="text-sm font-medium text-foreground">
                      <code className="text-xs bg-muted px-2 py-1 rounded-md font-mono">{callLog.msisdn}</code>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Agent</p>
                    <p className="text-sm font-medium text-foreground">{callLog.agent}</p>
                  </div>
                </div>
              </motion.div>

              {/* Additional Details in 2x2 Grid */}
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Timer className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Call Duration</p>
                    <p className="text-sm font-medium text-foreground">{callLog.callDuration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</p>
                    <p className="text-sm font-medium text-foreground">{callLog.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sub Category</p>
                    <p className="text-sm font-medium text-foreground">{callLog.subCategory}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                    <p className="text-sm font-medium text-foreground">Completed</p>
                  </div>
                </div>
              </motion.div>
              <Separator className="my-4" />

              {/* Sentiment Analysis */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-xl bg-muted/30 p-4">
                <h5 className="font-semibold mb-3 text-sm">Sentiment Analysis</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">User Sentiment</span>
                    <div className="flex items-center gap-2">
                      <SentimentIcon sentiment={callLog.userSentiment} />
                      <span className="font-medium capitalize text-sm">{callLog.userSentiment}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Agent Sentiment</span>
                    <div className="flex items-center gap-2">
                      <SentimentIcon sentiment={callLog.agentSentiment} />
                      <span className="font-medium capitalize text-sm">{callLog.agentSentiment}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Audio Player */}
              {callLog.audioUrl && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-4">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Audio Recording</label>
                  <audio controls className="w-full">
                    <source src={callLog.audioUrl} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                </motion.div>
              )}

              {/* Word Analysis Card with Inline Toggle */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <Card className="border-border/50">
                  <CardContent className="p-0">
                    <div className="d-flex align-items-center justify-content-between mb-2 p-4 pb-0">
                      <h5 className="mb-0 font-bold">Keywords</h5>
                      <div>
                        <ToggleGroup type="single" value={keywordView} onValueChange={setKeywordView}>
                          <ToggleGroupItem value="cloud" className="text-xs px-3 py-1">
                            Word Cloud
                          </ToggleGroupItem>
                          <ToggleGroupItem value="graph" className="text-xs px-3 py-1">
                            Word Graph
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      {keywordView === "cloud" ? (
                        <div className="flex flex-wrap gap-2 min-h-[200px] items-center justify-center">
                          {mockWordData.map((word, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 rounded-md transition-all hover:scale-110 cursor-pointer"
                              style={{
                                fontSize: `${10 + (word.value / 100) * 16}px`,
                                fontWeight: word.value > 70 ? 600 : 400,
                                color: `hsl(${200 + index * 15}, 70%, ${35 + (word.value / 100) * 25}%)`,
                                transform: `rotate(${index % 3 === 0 ? -5 : index % 3 === 1 ? 0 : 5}deg)`,
                              }}
                            >
                              {word.text}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={mockWordData.slice(0, 6)} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                              <XAxis 
                                type="number" 
                                domain={[0, 100]} 
                                stroke="hsl(var(--muted-foreground))" 
                                fontSize={10}
                                tickFormatter={(value) => value.toFixed(1)}
                              />
                              <YAxis 
                                dataKey="text" 
                                type="category" 
                                stroke="hsl(var(--muted-foreground))" 
                                fontSize={10} 
                                width={70}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "hsl(var(--card))",
                                  border: "1px solid hsl(var(--border))",
                                  borderRadius: "8px",
                                  fontSize: "12px",
                                }}
                                formatter={(value: number) => [value, "Count"]}
                              />
                              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                          <p className="text-xs text-muted-foreground text-center mt-1">Words Count</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Call Summary Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Call Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {callLog.summary}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Conversation Transcript Card */}
              {callLog.transcription && callLog.transcription.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <Card className="border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Conversation Transcript</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {callLog.transcription.map((item, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg ${
                              item.speaker === "Agent"
                                ? "bg-primary/10 ml-4"
                                : "bg-muted mr-4"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold">{item.speaker}</span>
                              <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                            </div>
                            <p className="text-sm">{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>

        {/* Evaluation Tab */}
        <TabsContent value="evaluation" className="px-6 py-4 space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockScoreSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <h6 className="font-medium">{section.title}</h6>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                      {section.scoreValue} out of {section.total}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {section.subSections.map((subItem, subIndex) => (
                      <div key={subIndex} className="flex items-start gap-2">
                        {getCompletionIcon(subItem.completed)}
                        <span className="text-sm">{subItem.context}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Score Board Chart */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Score Board</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={scoreChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Summary Tab */}
        <TabsContent value="analysis" className="px-6 py-4 space-y-6">
          {/* Meta Data Section */}
          <section>
            <div className="mb-3">
              <h6 className="font-semibold">Meta Data</h6>
              <p className="text-xs text-muted-foreground">Compare metadata with conversation values</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-semibold">Data Field</TableHead>
                  <TableHead className="font-semibold">Meta Data</TableHead>
                  <TableHead className="font-semibold">Conversation Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMetaData.map((row, index) => (
                  <TableRow key={index} className={row.metaData !== row.conValue ? "bg-amber-500/10" : ""}>
                    <TableCell>{row.dataField}</TableCell>
                    <TableCell className={row.metaData !== row.conValue ? "text-red-500 font-semibold" : ""}>
                      {row.metaData}
                    </TableCell>
                    <TableCell className={row.metaData !== row.conValue ? "text-red-500 font-semibold" : ""}>
                      {row.conValue}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>

          {/* Recommendations Section */}
          <section>
            <div className="mb-3">
              <h6 className="font-semibold">Recommendations</h6>
              <p className="text-xs text-muted-foreground">AI-generated recommendations based on call analysis</p>
            </div>
            <Card className="border-border/50">
              <CardContent className="p-3 space-y-2">
                {mockRecommendations.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">{item.description}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          {/* Retention Strategies Section */}
          <section>
            <div className="mb-3">
              <h6 className="font-semibold">Retention Strategies</h6>
              <p className="text-xs text-muted-foreground">Strategies applied during the call</p>
            </div>
            <Card className="border-border/50">
              <CardContent className="p-3 space-y-2">
                {mockRetentionStrategies.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                ))}
              </CardContent>
              <div className="px-3 py-2 border-t border-border/50 bg-muted/20">
                <span className="text-sm font-semibold">Outcome - </span>
                <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                  Successfully Retained
                </Badge>
              </div>
            </Card>
          </section>
        </TabsContent>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  );
}
