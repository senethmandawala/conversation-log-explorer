import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "antd";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  IconPlus,
  IconDotsVertical,
  IconFileText,
  IconEdit,
  IconTrash,
  IconRefresh,
  IconEye,
  IconChartBar,
  IconChartPie,
  IconChartLine,
  IconChartArea,
  IconTable,
  IconLayoutGrid,
} from "@tabler/icons-react";

interface TrainingDoc {
  id: string;
  name: string;
  fileName: string;
  validity: string;
  enabled: boolean;
}

interface CustomReport {
  id: string;
  name: string;
  description: string;
  type: string;
  frequency: string;
  enabled: boolean;
  icon: React.ReactNode;
}

const mockTrainingDocs: TrainingDoc[] = [
  { id: "1", name: "Product FAQ", fileName: "product-faq.pdf", validity: "2025-12-31", enabled: true },
  { id: "2", name: "Billing Guide", fileName: "billing-guide.docx", validity: "2025-06-30", enabled: true },
  { id: "3", name: "Troubleshooting Manual", fileName: "troubleshoot.pdf", validity: "2025-09-15", enabled: false },
  { id: "4", name: "Service Terms", fileName: "terms.pdf", validity: "2026-01-01", enabled: true },
];

const mockPrompts = [
  { id: "1", name: "Welcome Message", content: "Hello! I'm your AI assistant. How can I help you today?" },
  { id: "2", name: "Transfer Prompt", content: "I'll transfer you to a human agent who can better assist you." },
  { id: "3", name: "Closing Message", content: "Thank you for contacting us. Have a great day!" },
];

const reportIcons: Record<string, React.ReactNode> = {
  Bar: <IconChartBar className="h-4 w-4" />,
  Pie: <IconChartPie className="h-4 w-4" />,
  Line: <IconChartLine className="h-4 w-4" />,
  Area: <IconChartArea className="h-4 w-4" />,
  Donut: <IconChartPie className="h-4 w-4" />,
  Treemap: <IconLayoutGrid className="h-4 w-4" />,
  Table: <IconTable className="h-4 w-4" />,
};

const reportColorClasses: Record<string, string> = {
  Bar: "bg-purple-500/10 text-purple-500",
  Donut: "bg-purple-500/10 text-purple-500",
  Pie: "bg-emerald-500/10 text-emerald-500",
  Line: "bg-amber-500/10 text-amber-500",
  Area: "bg-amber-500/10 text-amber-500",
  Treemap: "bg-pink-500/10 text-pink-500",
  Table: "bg-slate-500/10 text-slate-500",
};

const mockCustomReports: CustomReport[] = [
  { id: "1", name: "Report 0001", description: "This is a sample report", type: "Bar", frequency: "Daily", enabled: true, icon: reportIcons.Bar },
  { id: "2", name: "Report 0002", description: "Weekly performance analysis", type: "Pie", frequency: "Weekly", enabled: true, icon: reportIcons.Pie },
  { id: "3", name: "Report 0003", description: "Monthly trends overview", type: "Line", frequency: "Yearly", enabled: true, icon: reportIcons.Line },
  { id: "4", name: "Report 0004", description: "Area chart for metrics", type: "Area", frequency: "Weekly", enabled: true, icon: reportIcons.Area },
  { id: "5", name: "Report 0005", description: "Donut chart visualization", type: "Donut", frequency: "Yearly", enabled: true, icon: reportIcons.Donut },
  { id: "6", name: "Report 0006", description: "Treemap distribution", type: "Treemap", frequency: "Weekly", enabled: true, icon: reportIcons.Treemap },
  { id: "7", name: "Report 0007", description: "Tabular data report", type: "Table", frequency: "Weekly", enabled: true, icon: reportIcons.Table },
];

export default function AutopilotConfiguration() {
  const [trainingDocs, setTrainingDocs] = useState(mockTrainingDocs);
  const [customReports, setCustomReports] = useState(mockCustomReports);
  const [isSyncing, setIsSyncing] = useState(false);
  const [addDocDialogOpen, setAddDocDialogOpen] = useState(false);
  const [addReportDialogOpen, setAddReportDialogOpen] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const handleToggleDoc = (id: string) => {
    setTrainingDocs(docs =>
      docs.map(doc => (doc.id === id ? { ...doc, enabled: !doc.enabled } : doc))
    );
  };

  const handleToggleReport = (id: string) => {
    setCustomReports(reports =>
      reports.map(report => (report.id === id ? { ...report, enabled: !report.enabled } : report))
    );
  };

  return (
    <div className="space-y-6">
      {/* Training Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-foreground">Training</h2>
            <p className="text-sm text-muted-foreground">
              Manage training documents and prompts for your AI assistant
            </p>
          </div>

          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-md font-medium text-foreground">Training Documents</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload and manage documents for AI training
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="default"
                    size="small"
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="gap-2"
                  >
                    <IconRefresh className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                    Sync
                  </Button>
                  <Dialog open={addDocDialogOpen} onOpenChange={setAddDocDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="small" className="gap-2">
                        <IconPlus className="h-4 w-4" />
                        Add Document
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Training Document</DialogTitle>
                        <DialogDescription>
                          Upload a new document for AI training
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Document Name</label>
                          <Input placeholder="Enter document name" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">File</label>
                          <Input type="file" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Validity Date</label>
                          <Input type="date" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="default" onClick={() => setAddDocDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setAddDocDialogOpen(false)}>Upload</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead>Validity</TableHead>
                      <TableHead className="text-center">Enable</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainingDocs.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell className="text-muted-foreground">{doc.fileName}</TableCell>
                        <TableCell>{doc.validity}</TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={doc.enabled}
                            onCheckedChange={() => handleToggleDoc(doc.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button type="text"  className="h-8 w-8">
                                <IconDotsVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <IconEdit className="h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive">
                                <IconTrash className="h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="prompts" className="mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-md font-medium text-foreground">System Prompts</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure prompts used by the AI assistant
                  </p>
                </div>
                <Button size="small" className="gap-2">
                  <IconPlus className="h-4 w-4" />
                  Add Prompt
                </Button>
              </div>

              <div className="space-y-3">
                {mockPrompts.map((prompt) => (
                  <Card key={prompt.id} className="p-4 border-border/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{prompt.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{prompt.content}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button type="text"  className="h-8 w-8">
                            <IconDotsVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <IconEdit className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <IconTrash className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>

      {/* Custom Reports Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Custom Reports</h2>
              <p className="text-sm text-muted-foreground">
                Create and manage custom reports for your analytics needs
              </p>
            </div>
            <Dialog open={addReportDialogOpen} onOpenChange={setAddReportDialogOpen}>
              <DialogTrigger asChild>
                <Button size="small" className="gap-2">
                  <IconPlus className="h-4 w-4" />
                  Add Custom Report
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Custom Report</DialogTitle>
                  <DialogDescription>
                    Configure a new custom report
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Report Name</label>
                    <Input placeholder="Enter report name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea placeholder="Describe the report" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chart Type</label>
                    <Input placeholder="Bar, Pie, Line, etc." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Frequency</label>
                    <Input placeholder="Daily, Weekly, Monthly" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="default" onClick={() => setAddReportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setAddReportDialogOpen(false)}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {customReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center ${reportColorClasses[report.type]}`}
                  >
                    {reportIcons[report.type]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">{report.name}</h4>
                      <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-500 border-purple-500/20">
                        {report.frequency}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={report.enabled}
                    onCheckedChange={() => handleToggleReport(report.id)}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="text"  className="h-8 w-8">
                        <IconDotsVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <IconEye className="h-4 w-4" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <IconEdit className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive">
                        <IconTrash className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
