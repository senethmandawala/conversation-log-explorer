import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Save,
  HelpCircle,
  FileAudio,
  FolderTree,
  Tag,
  Plus,
  X,
  GripVertical,
  Languages,
  Bell,
  Shield,
  Upload,
  Eye,
  Edit2 as EditIcon,
  Repeat,
  Frown,
  ThumbsDown,
  Gauge,
  TrendingDown
} from "lucide-react";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { Reorder } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import CategoryStructure, { CategoryNode } from "./CategoryStructure";
import UpdateCategoryDialog from "./UpdateCategoryDialog";
import ImportCategories from "./ImportCategories";
import UpdateRecipients from "./UpdateRecipients";
import UpdateAlertMessageTemplate from "./UpdateAlertMessageTemplate";

interface NameTag {
  id: string;
  name: string;
  mandatory: boolean;
}

interface AlertConfig {
  icon: any;
  name: string;
  description: string;
  threshold: number;
  thresholdType: string;
  recipients: string;
  messageTemplateHeader: string;
  messageTemplate: string;
  editThreshold: boolean;
}

const defaultNameTags: NameTag[] = [
  { id: "1", name: "MSISDN", mandatory: true },
  { id: "2", name: "Agent ID", mandatory: true },
  { id: "3", name: "Call Date", mandatory: true },
  { id: "4", name: "Call Time", mandatory: false },
  { id: "5", name: "Call Duration", mandatory: false },
];

const defaultCategories: CategoryNode[] = [
  { 
    index: "1", 
    name: "Billing", 
    description: "Billing related inquiries",
    value: [
      { index: "1.1", name: "Payment Issues", description: "Payment related issues", value: [] },
      { index: "1.2", name: "Invoice Queries", description: "Invoice related queries", value: [] },
      { index: "1.3", name: "Refunds", description: "Refund requests", value: [] },
    ]
  },
  { 
    index: "2", 
    name: "Technical Support",
    description: "Technical support requests",
    value: [
      { index: "2.1", name: "Network Issues", description: "Network connectivity problems", value: [] },
      { index: "2.2", name: "Device Problems", description: "Device malfunction issues", value: [] },
    ]
  },
  { 
    index: "3", 
    name: "Sales",
    description: "Sales inquiries",
    value: [
      { index: "3.1", name: "New Plans", description: "New plan inquiries", value: [] },
      { index: "3.2", name: "Upgrades", description: "Plan upgrade requests", value: [] },
    ]
  },
  { index: "4", name: "Complaints", description: "Customer complaints", value: [] },
  { index: "5", name: "General Inquiry", description: "General questions", value: [] },
];

const ALERT_CONFIG: AlertConfig[] = [
  {
    icon: Repeat,
    name: "Agent Repeat Call Alert",
    description: "Notify when an agent's repeat calls rate exceeds threshold",
    threshold: 15,
    thresholdType: "%",
    recipients: "10",
    messageTemplateHeader: "Agent Repeat Call Alert",
    messageTemplate: "Hello Agent Name, Your repeat calls rate has increased to 15% over last 7 days, which is above the target threshold of 10%.",
    editThreshold: false,
  },
  {
    icon: Frown,
    name: "Negative Sentiment Alert",
    description: "Alert when agent receives consistently negative sentiment count",
    threshold: 10,
    thresholdType: "",
    recipients: "5",
    messageTemplateHeader: "Negative Sentiment Alert",
    messageTemplate: "Negative Sentiment Alert template",
    editThreshold: false,
  },
  {
    icon: ThumbsDown,
    name: "Bad Practices Alert",
    description: "Notify when agent's bad practice score exceeds the threshold",
    threshold: 5,
    thresholdType: "%",
    recipients: "7",
    messageTemplateHeader: "Bad Practices Alert",
    messageTemplate: "Bad practice message template",
    editThreshold: false,
  },
  {
    icon: Gauge,
    name: "Performance Metrics Alert",
    description: "Notify when overall agent performance score is below target",
    threshold: 5,
    thresholdType: "%",
    recipients: "7",
    messageTemplateHeader: "Performance Metrics Alert",
    messageTemplate: "Performance message template",
    editThreshold: false,
  },
  {
    icon: TrendingDown,
    name: "FCR Alert",
    description: "Notifies when an agent's first call resolution rate falls below the defined threshold",
    threshold: 5,
    thresholdType: "%",
    recipients: "7",
    messageTemplateHeader: "FCR Alert",
    messageTemplate: "FCR message template",
    editThreshold: false,
  },
];

export default function Configuration() {
  const { setShowModuleTabs } = useModule();
  const [isLoading, setIsLoading] = useState(true);
  const [nameTags, setNameTags] = useState<NameTag[]>(defaultNameTags);
  const [categories, setCategories] = useState<CategoryNode[]>(defaultCategories);
  const [newTagName, setNewTagName] = useState("");
  const [separator, setSeparator] = useState("_");
  const [maxFileSize, setMaxFileSize] = useState("0");
  const [longCallThreshold, setLongCallThreshold] = useState("0");
  const [callRecordingLanguage, setCallRecordingLanguage] = useState("en");
  const [callSummaryLanguage, setCallSummaryLanguage] = useState("en");
  const [alertConfigs, setAlertConfigs] = useState<AlertConfig[]>(ALERT_CONFIG);
  
  // Dialog states
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [importCategoriesOpen, setImportCategoriesOpen] = useState(false);
  const [updateRecipientsOpen, setUpdateRecipientsOpen] = useState(false);
  const [updateMessageTemplateOpen, setUpdateMessageTemplateOpen] = useState(false);
  const [selectedCategoryNode, setSelectedCategoryNode] = useState<CategoryNode | undefined>();
  const [isUpdatingChild, setIsUpdatingChild] = useState(false);
  const [updatingCurrent, setUpdatingCurrent] = useState(false);
  const [selectedAlertConfig, setSelectedAlertConfig] = useState<AlertConfig | undefined>();
  
  // Dashboard toggles
  const [dashboardToggles, setDashboardToggles] = useState({
    callStatistics: false,
    caseClassification: false,
    userSentiment: false,
    agentSentiment: false,
    callResolution: false,
    topCallers: false,
    wordFrequency: false,
    callDuration: false,
    trafficTrends: false,
    callInsights: false,
    agentEvaluation: false,
    dayRepeatCallTimeline: false,
    categoryWiseRepeatCalls: false,
    retentionAnalysis: false,
    netPromoterScore: false,
    channelWiseCategoryDistribution: false,
  });
  
  // Reports toggles
  const [reportsToggles, setReportsToggles] = useState({
    badPracticeAnalysisReport: false,
    upSellAnalysisReport: false,
    trainingNeedAnalysisReport: false,
    unresolvedCasesAnalysisReport: false,
  });

  useEffect(() => {
    setShowModuleTabs(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => {
      setShowModuleTabs(true);
      clearTimeout(timer);
    };
  }, [setShowModuleTabs]);

  const addNameTag = () => {
    if (!newTagName.trim()) {
      toast.error("Please enter a tag name");
      return;
    }
    const newTag: NameTag = {
      id: `tag-${Date.now()}`,
      name: newTagName.trim(),
      mandatory: false,
    };
    setNameTags([...nameTags, newTag]);
    setNewTagName("");
    toast.success("Tag added successfully");
  };

  const removeNameTag = (id: string) => {
    const tag = nameTags.find(t => t.id === id);
    if (tag?.mandatory) {
      toast.error("Cannot remove mandatory tags");
      return;
    }
    setNameTags(nameTags.filter(t => t.id !== id));
    toast.success("Tag removed");
  };

  const handleAddMainCategory = () => {
    setSelectedCategoryNode(undefined);
    setIsUpdatingChild(false);
    setUpdatingCurrent(false);
    setCategoryDialogOpen(true);
  };

  const handleAddChildCategory = (node: CategoryNode) => {
    setSelectedCategoryNode(node);
    setIsUpdatingChild(true);
    setUpdatingCurrent(false);
    setCategoryDialogOpen(true);
  };

  const handleEditCategory = (node: CategoryNode) => {
    setSelectedCategoryNode(node);
    setIsUpdatingChild(false);
    setUpdatingCurrent(true);
    setCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (node: CategoryNode) => {
    // Implement delete logic
    toast.success("Category deleted");
  };

  const handleCategorySubmit = (data: { name: string; description: string }) => {
    // Implement category add/update logic
    toast.success(isUpdatingChild ? "Subcategory added" : updatingCurrent ? "Category updated" : "Main category added");
  };

  const handleEditThreshold = (config: AlertConfig) => {
    setAlertConfigs(alertConfigs.map(c => 
      c.name === config.name ? { ...c, editThreshold: true } : c
    ));
  };

  const handleSaveThreshold = (config: AlertConfig) => {
    setAlertConfigs(alertConfigs.map(c => 
      c.name === config.name ? { ...c, editThreshold: false } : c
    ));
    toast.success("Threshold updated");
  };

  const handleEditRecipients = (config: AlertConfig) => {
    setSelectedAlertConfig(config);
    setUpdateRecipientsOpen(true);
  };

  const handleViewMessageTemplate = (config: AlertConfig) => {
    setSelectedAlertConfig(config);
    setUpdateMessageTemplateOpen(true);
  };

  const toggleAllDashboard = (checked: boolean) => {
    const newToggles = Object.keys(dashboardToggles).reduce((acc, key) => {
      acc[key as keyof typeof dashboardToggles] = checked;
      return acc;
    }, {} as typeof dashboardToggles);
    setDashboardToggles(newToggles);
  };

  const toggleAllReports = (checked: boolean) => {
    const newToggles = Object.keys(reportsToggles).reduce((acc, key) => {
      acc[key as keyof typeof reportsToggles] = checked;
      return acc;
    }, {} as typeof reportsToggles);
    setReportsToggles(newToggles);
  };

  const handleSave = () => {
    toast.success("Configuration saved successfully");
  };


  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold tracking-tight">
                    Configuration
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Configure application settings and preferences
                  </p>
                </div>
              </div>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File Upload Format */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <FileAudio className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-medium">File Upload Format</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Define the naming convention for uploaded files</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Name Format Tags</Label>
                    <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg border border-border/50 min-h-[60px]">
                      <Reorder.Group 
                        axis="x" 
                        values={nameTags} 
                        onReorder={setNameTags}
                        className="flex flex-wrap gap-2"
                      >
                        {nameTags.map(tag => (
                          <Reorder.Item key={tag.id} value={tag}>
                            <Badge
                              variant="secondary"
                              className={`
                                flex items-center gap-1 cursor-grab active:cursor-grabbing
                                ${tag.mandatory ? "bg-primary/20 border-primary/30" : ""}
                              `}
                            >
                              <GripVertical className="h-3 w-3" />
                              {tag.name}
                              {tag.mandatory && (
                                <span className="text-xs text-primary">*</span>
                              )}
                              {!tag.mandatory && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNameTag(tag.id);
                                  }}
                                  className="ml-1 hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                            </Badge>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom tag..."
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addNameTag()}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon" onClick={addNameTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Separator</Label>
                    <Select value={separator} onValueChange={setSeparator}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_">Underscore (_)</SelectItem>
                        <SelectItem value="-">Hyphen (-)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Example:</span> date{separator}time{separator}msisdn{separator}agentid{separator}agentname{separator}dynamicfield1.wav
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Structure */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderTree className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-medium">Category Structure</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => setImportCategoriesOpen(true)}>
                    <Upload className="h-4 w-4" />
                    Import
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1" onClick={handleAddMainCategory}>
                    <Plus className="h-4 w-4" />
                    Add Category
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <CategoryStructure
                  categoryData={categories}
                  onCategoryDataUpdated={setCategories}
                  onAddChild={handleAddChildCategory}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                />
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm lg:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-medium">Settings</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Configure file size limits and call thresholds</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
                      <div className="relative">
                        <Input
                          id="maxFileSize"
                          type="number"
                          placeholder="0"
                          value={maxFileSize}
                          onChange={(e) => setMaxFileSize(e.target.value)}
                        />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="absolute right-3 top-1/2 -translate-y-1/2">
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Maximum file size allowed for upload in MB</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="longCallThreshold">Long call threshold (min)</Label>
                      <div className="relative">
                        <Input
                          id="longCallThreshold"
                          type="number"
                          placeholder="0"
                          value={longCallThreshold}
                          onChange={(e) => setLongCallThreshold(e.target.value)}
                        />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="absolute right-3 top-1/2 -translate-y-1/2">
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Threshold in minutes to classify a call as long</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h6 className="text-sm font-medium mb-4">Select the Language</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="callRecordingLanguage">Call Recording Language</Label>
                        <div className="relative">
                          <Select value={callRecordingLanguage} onValueChange={setCallRecordingLanguage}>
                            <SelectTrigger id="callRecordingLanguage">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                              <SelectItem value="ar">Arabic</SelectItem>
                              <SelectItem value="hi">Hindi</SelectItem>
                              <SelectItem value="zh">Chinese</SelectItem>
                            </SelectContent>
                          </Select>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="absolute right-10 top-1/2 -translate-y-1/2">
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Language used in call recordings</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="callSummaryLanguage">Call Summary Language</Label>
                        <div className="relative">
                          <Select value={callSummaryLanguage} onValueChange={setCallSummaryLanguage}>
                            <SelectTrigger id="callSummaryLanguage">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                              <SelectItem value="ar">Arabic</SelectItem>
                              <SelectItem value="hi">Hindi</SelectItem>
                              <SelectItem value="zh">Chinese</SelectItem>
                            </SelectContent>
                          </Select>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="absolute right-10 top-1/2 -translate-y-1/2">
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Language for generated call summaries</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dashboard Visibility Toggles */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm lg:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-medium">Dashboard</CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Configure which widgets are visible on the dashboard</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={Object.values(dashboardToggles).every(v => v)}
                    onCheckedChange={toggleAllDashboard}
                  />
                  <Label className="cursor-pointer" onClick={() => toggleAllDashboard(!Object.values(dashboardToggles).every(v => v))}>
                    Select All
                  </Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Object.entries(dashboardToggles).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => 
                          setDashboardToggles({ ...dashboardToggles, [key]: checked })
                        }
                      />
                      <Label htmlFor={key} className="cursor-pointer text-sm">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reports Visibility Toggles */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm lg:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileAudio className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-medium">Reports</CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Configure which reports are available in the reports section</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={Object.values(reportsToggles).every(v => v)}
                    onCheckedChange={toggleAllReports}
                  />
                  <Label className="cursor-pointer" onClick={() => toggleAllReports(!Object.values(reportsToggles).every(v => v))}>
                    Select All
                  </Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Object.entries(reportsToggles).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => 
                          setReportsToggles({ ...reportsToggles, [key]: checked })
                        }
                      />
                      <Label htmlFor={key} className="cursor-pointer text-sm">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace('Report', '')}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alert Configurations */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm lg:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-medium">Alert Configurations</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Configure alert thresholds and recipient email addresses</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-96 w-full" />
              ) : (
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Alert Name</TableHead>
                        <TableHead className="text-right w-32">Threshold</TableHead>
                        <TableHead className="text-right w-32">Recipients</TableHead>
                        <TableHead className="text-center w-40">Message Template</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alertConfigs.map((config, index) => {
                        const IconComponent = config.icon;
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                  <IconComponent className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <div className="font-medium">{config.name}</div>
                                  <div className="text-sm text-muted-foreground">{config.description}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {config.editThreshold ? (
                                <div className="flex items-center justify-end gap-1">
                                  <Input
                                    type="number"
                                    value={config.threshold}
                                    className="w-16 h-8 text-right"
                                  />
                                  <span className="text-sm">{config.thresholdType}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-green-500"
                                    onClick={() => handleSaveThreshold(config)}
                                  >
                                    <EditIcon className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end gap-1">
                                  <span>{config.threshold} {config.thresholdType}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleEditThreshold(config)}
                                  >
                                    <EditIcon className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <span>{config.recipients}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleEditRecipients(config)}
                                >
                                  <EditIcon className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                onClick={() => handleViewMessageTemplate(config)}
                              >
                                <Eye className="h-3 w-3" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs and Sheets */}
      <UpdateCategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        isUpdatingChild={isUpdatingChild}
        updatingCurrent={updatingCurrent}
        selectedNode={selectedCategoryNode}
        categories={categories}
        onSubmit={handleCategorySubmit}
      />

      <Sheet open={importCategoriesOpen} onOpenChange={setImportCategoriesOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Import Categories</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <ImportCategories />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={updateRecipientsOpen} onOpenChange={setUpdateRecipientsOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Update Recipients</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <UpdateRecipients />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={updateMessageTemplateOpen} onOpenChange={setUpdateMessageTemplateOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Alert Message Template</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <UpdateAlertMessageTemplate
              messageTemplateHeader={selectedAlertConfig?.messageTemplateHeader}
              messageTemplate={selectedAlertConfig?.messageTemplate}
            />
          </div>
        </SheetContent>
      </Sheet>

      <AIHelper />
    </>
  );
}
