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
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit2,
  Languages,
  Bell,
  Shield
} from "lucide-react";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { motion, AnimatePresence, Reorder } from "framer-motion";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

interface NameTag {
  id: string;
  name: string;
  mandatory: boolean;
}

interface Category {
  id: string;
  name: string;
  children?: Category[];
  expanded?: boolean;
}

const defaultNameTags: NameTag[] = [
  { id: "1", name: "MSISDN", mandatory: true },
  { id: "2", name: "Agent ID", mandatory: true },
  { id: "3", name: "Call Date", mandatory: true },
  { id: "4", name: "Call Time", mandatory: false },
  { id: "5", name: "Call Duration", mandatory: false },
];

const defaultCategories: Category[] = [
  { 
    id: "1", 
    name: "Billing", 
    expanded: true,
    children: [
      { id: "1-1", name: "Payment Issues" },
      { id: "1-2", name: "Invoice Queries" },
      { id: "1-3", name: "Refunds" },
    ]
  },
  { 
    id: "2", 
    name: "Technical Support",
    children: [
      { id: "2-1", name: "Network Issues" },
      { id: "2-2", name: "Device Problems" },
    ]
  },
  { 
    id: "3", 
    name: "Sales",
    children: [
      { id: "3-1", name: "New Plans" },
      { id: "3-2", name: "Upgrades" },
    ]
  },
  { id: "4", name: "Complaints" },
  { id: "5", name: "General Inquiry" },
];

export default function Configuration() {
  const { setShowModuleTabs } = useModule();
  const [isLoading, setIsLoading] = useState(true);
  const [nameTags, setNameTags] = useState<NameTag[]>(defaultNameTags);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [newTagName, setNewTagName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoAnalysis, setAutoAnalysis] = useState(true);

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

  const toggleCategory = (id: string) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, expanded: !cat.expanded } : cat
    ));
  };

  const handleSave = () => {
    toast.success("Configuration saved successfully");
  };

  const CategoryItem = ({ category, depth = 0 }: { category: Category; depth?: number }) => (
    <div className="space-y-1">
      <div 
        className={`
          flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer
          transition-colors group
        `}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={() => category.children && toggleCategory(category.id)}
      >
        {category.children ? (
          category.expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )
        ) : (
          <div className="w-4" />
        )}
        <FolderTree className="h-4 w-4 text-primary" />
        <span className="flex-1">{category.name}</span>
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {category.expanded && category.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {category.children.map(child => (
              <CategoryItem key={child.id} category={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

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
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {categories.map(category => (
                    <CategoryItem key={category.id} category={category} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* General Settings */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm lg:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-medium">General Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Language */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4 text-muted-foreground" />
                      <Label>Language</Label>
                    </div>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Notifications */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <Label>Email Notifications</Label>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                      <span className="text-sm">Receive analysis notifications</span>
                      <Switch
                        checked={notificationsEnabled}
                        onCheckedChange={setNotificationsEnabled}
                      />
                    </div>
                  </div>

                  {/* Auto Analysis */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <Label>Auto Analysis</Label>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                      <span className="text-sm">Automatically analyze uploads</span>
                      <Switch
                        checked={autoAnalysis}
                        onCheckedChange={setAutoAnalysis}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <AIHelper />
    </>
  );
}
