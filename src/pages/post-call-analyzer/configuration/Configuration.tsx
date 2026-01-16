import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  Typography, 
  ConfigProvider,
  Button, 
  Input, 
  Space, 
  Badge, 
  Tooltip,
  Switch,
  Select,
  Table,
  Skeleton,
  Drawer,
  Row,
  Col,
  Divider,
  message
} from "antd";
import { 
  IconSettings, 
  IconDeviceFloppy,
  IconQuestionMark,
  IconMicrophone,
  IconFolder,
  IconTag,
  IconPlus,
  IconX,
  IconGripVertical,
  IconWorld,
  IconBell,
  IconShield,
  IconUpload,
  IconEye,
  IconEdit,
  IconRefresh,
  IconMoodSad,
  IconThumbDown,
  IconDashboard,
  IconTrendingDown,
  IconGripHorizontal
} from "@tabler/icons-react";
import { AIHelper } from "@/components/post-call/AIHelper";
import { toast } from "sonner";
import CategoryStructure, { CategoryNode } from "./CategoryStructure";
import UpdateCategoryDialog from "./UpdateCategoryDialog";
import ImportCategories from "./ImportCategories";
import UpdateRecipients from "./UpdateRecipients";
import UpdateAlertMessageTemplate from "./UpdateAlertMessageTemplate";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const { Title, Text } = Typography;
const { Option } = Select;

// Sortable Tag Component for dnd-kit
interface SortableTagProps {
  tag: NameTag;
  onRemove: (id: string) => void;
}

function SortableTag({ tag, onRemove }: SortableTagProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tag.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        px-3 py-2 rounded-lg cursor-grab select-none shadow-sm 
        transition-all duration-200 flex items-center gap-2
        hover:shadow-md hover:-translate-y-0.5
        ${tag.mandatory 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-400' 
          : 'bg-white border border-gray-200 hover:border-blue-300'
        }
        ${isDragging ? 'shadow-xl scale-105' : ''}
      `}
      {...attributes}
      {...listeners}
    >
      <IconGripHorizontal 
        className={`text-xs ${tag.mandatory ? 'text-white/70' : 'text-gray-400'}`}
      />
      <Text 
        className={`${tag.mandatory ? 'text-white' : 'text-gray-700'} text-sm font-medium font-sans`}
      >
        {tag.name}
      </Text>
      {tag.mandatory && (
        <span className="text-white/90 text-xs font-bold">*</span>
      )}
      {!tag.mandatory && (
        <IconX
          className="text-xs text-gray-400 cursor-pointer p-1 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(tag.id);
          }}
        />
      )}
    </div>
  );
}

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
    icon: IconRefresh,
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
    icon: IconMoodSad,
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
    icon: IconThumbDown,
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
    icon: IconDashboard,
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
    icon: IconTrendingDown,
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

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setNameTags((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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
    <ConfigProvider
      theme={{
        components: {
          Card: {
            headerBg: 'transparent',
          },
        },
      }}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            style={{ 
              borderRadius: 12, 
              border: '1px solid #e2e8f0'
            }}
            styles={{ 
              header: { borderBottom: 'none', padding: '12px 24px' },
              body: { padding: '5px 24px' }
            }}
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
                    <IconSettings className="text-white text-xl" />
                  </div>
                  <div>
                    <Title level={5} className="!m-0 !font-semibold">Configuration</Title>
                    <Text type="secondary" className="text-[13px]">
                      Configure application settings and preferences
                    </Text>
                  </div>
                </div>
                <Button 
                  type="primary" 
                  icon={<IconDeviceFloppy />}
                  onClick={handleSave}
                  className="font-sans"
                >
                  Save Changes
                </Button>
              </div>
            }
          />
        </motion.div>

        <Row gutter={[16, 16]}>
          {/* File Upload Format */}
          <Col xs={24} lg={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card
                className="rounded-xl border-slate-200"
                title={
                  <div className="flex items-center gap-2">
                    <IconMicrophone className="text-blue-500 text-base" />
                    <Text strong className="text-base font-semibold font-sans">File Upload Format</Text>
                    <Tooltip title="Define the naming convention for uploaded files">
                      <IconQuestionMark className="text-slate-400 text-sm" />
                    </Tooltip>
                  </div>
                }
              >
                {isLoading ? (
                  <Skeleton.Input active block style={{ height: 128 }} />
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Text type="secondary" className="text-sm mb-2 block text-gray-600 font-sans">Name Format Tags</Text>
                      <div 
                        className="p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-dashed border-gray-200 rounded-xl min-h-[100px] relative"
                      >
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext
                            items={nameTags.map(t => t.id)}
                            strategy={horizontalListSortingStrategy}
                          >
                            <div className="flex flex-wrap gap-2 sm:gap-3 min-h-14">
                              {nameTags.map(tag => (
                                <SortableTag key={tag.id} tag={tag} onRemove={removeNameTag} />
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                        {nameTags.length === 0 && (
                          <div 
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 text-sm font-sans"
                          >
                            Drag tags here or add custom tags below
                          </div>
                        )}
                      </div>
                    </div>

                    <Space.Compact className="w-full">
                      <Input
                        placeholder="Add custom tag..."
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        onPressEnter={addNameTag}
                        className="font-sans text-sm"
                      />
                      <Button 
                        type="default" 
                        icon={<IconPlus />}
                        onClick={addNameTag}
                      />
                    </Space.Compact>

                    <div className="space-y-2">
                      <Text strong className="text-sm font-semibold text-gray-900 font-sans">Separator</Text>
                      <Select 
                        value={separator} 
                        onChange={setSeparator}
                        className="w-full font-sans text-sm"
                      >
                        <Option value="_">Underscore (_)</Option>
                        <Option value="-">Hyphen (-)</Option>
                      </Select>
                    </div>

                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Example:</span> date{separator}time{separator}msisdn{separator}agentid{separator}agentname{separator}dynamicfield1.wav
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </Col>

          {/* Category Structure */}
          <Col xs={24} lg={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card
                className="rounded-xl border-slate-200"
                title={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconFolder className="text-blue-500 text-base" />
                      <Text strong className="text-base">Category Structure</Text>
                    </div>
                    <Space>
                      <Button 
                        type="default" 
                        size="small" 
                        icon={<IconUpload />}
                        onClick={() => setImportCategoriesOpen(true)}
                      >
                        Import
                      </Button>
                      <Button 
                        type="default" 
                        size="small" 
                        icon={<IconPlus />}
                        onClick={handleAddMainCategory}
                      >
                        Add Category
                      </Button>
                    </Space>
                  </div>
                }
              >
                {isLoading ? (
                  <Skeleton.Input active block style={{ height: 192 }} />
                ) : (
                  <CategoryStructure
                    categoryData={categories}
                    onCategoryDataUpdated={setCategories}
                    onAddChild={handleAddChildCategory}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                  />
                )}
              </Card>
            </motion.div>
          </Col>

          {/* Settings */}
          <Col xs={24}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card
                className="rounded-xl border-slate-200"
                title={
                  <div className="flex items-center gap-2">
                    <IconSettings className="text-blue-500 text-base" />
                    <Text strong className="text-base">Settings</Text>
                    <Tooltip title="Configure file size limits and call thresholds">
                      <IconQuestionMark className="text-slate-400 text-sm" />
                    </Tooltip>
                  </div>
                }
              >
                {isLoading ? (
                  <Skeleton.Input active block style={{ height: 192 }} />
                ) : (
                  <div className="space-y-6">
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <div className="space-y-2">
                          <Text strong>Maximum File Size (MB)</Text>
                          <Input
                            type="number"
                            placeholder="0"
                            value={maxFileSize}
                            onChange={(e) => setMaxFileSize(e.target.value)}
                            suffix={
                              <Tooltip title="Maximum file size allowed for upload in MB">
                                <IconQuestionMark className="text-slate-400" />
                              </Tooltip>
                            }
                            className="font-sans"
                          />
                        </div>
                      </Col>

                      <Col xs={24} md={12}>
                        <div className="space-y-2">
                          <Text strong>Long call threshold (min)</Text>
                          <Input
                            type="number"
                            placeholder="0"
                            value={longCallThreshold}
                            onChange={(e) => setLongCallThreshold(e.target.value)}
                            suffix={
                              <Tooltip title="Threshold in minutes to classify a call as long">
                                <IconQuestionMark className="text-slate-400" />
                              </Tooltip>
                            }
                            className="font-sans"
                          />
                        </div>
                      </Col>
                    </Row>

                    <div>
                      <Text strong className="mb-4 block">Select the Language</Text>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                          <div className="space-y-2">
                            <Text strong>Call Recording Language</Text>
                            <Select 
                              value={callRecordingLanguage} 
                              onChange={setCallRecordingLanguage}
                              className="w-full font-sans"
                              suffix={
                                <Tooltip title="Language used in call recordings">
                                  <IconQuestionMark className="text-slate-400" />
                                </Tooltip>
                              }
                            >
                              <Option value="en">English</Option>
                              <Option value="es">Spanish</Option>
                              <Option value="fr">French</Option>
                              <Option value="de">German</Option>
                              <Option value="ar">Arabic</Option>
                              <Option value="hi">Hindi</Option>
                              <Option value="zh">Chinese</Option>
                            </Select>
                          </div>
                        </Col>

                        <Col xs={24} md={12}>
                          <div className="space-y-2">
                            <Text strong>Call Summary Language</Text>
                            <Select 
                              value={callSummaryLanguage} 
                              onChange={setCallSummaryLanguage}
                              className="w-full font-sans"
                              suffix={
                                <Tooltip title="Language for generated call summaries">
                                  <IconQuestionMark className="text-slate-400" />
                                </Tooltip>
                              }
                            >
                              <Option value="en">English</Option>
                              <Option value="es">Spanish</Option>
                              <Option value="fr">French</Option>
                              <Option value="de">German</Option>
                              <Option value="ar">Arabic</Option>
                              <Option value="hi">Hindi</Option>
                              <Option value="zh">Chinese</Option>
                            </Select>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </Col>

          {/* Dashboard Visibility Toggles */}
          <Col xs={24}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card
                className="rounded-xl border-slate-200"
                title={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconSettings className="text-blue-500 text-base" />
                      <Text strong className="text-base">Dashboard</Text>
                      <Tooltip title="Configure which widgets are visible on the dashboard">
                        <IconQuestionMark className="text-slate-400 text-sm" />
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={Object.values(dashboardToggles).every(v => v)}
                        onChange={toggleAllDashboard}
                      />
                      <Text 
                        className="cursor-pointer font-sans" 
                        onClick={() => toggleAllDashboard(!Object.values(dashboardToggles).every(v => v))}
                      >
                        Select All
                      </Text>
                    </div>
                  </div>
                }
              >
                {isLoading ? (
                  <Skeleton.Input active block style={{ height: 256 }} />
                ) : (
                  <Row gutter={[16, 16]}>
                    {Object.entries(dashboardToggles).map(([key, value]) => (
                      <Col xs={24} sm={12} lg={8} xl={6} key={key}>
                        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <Switch
                            checked={value}
                            onChange={(checked) => 
                              setDashboardToggles({ ...dashboardToggles, [key]: checked })
                            }
                          />
                          <Text className="cursor-pointer font-sans">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Text>
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card>
            </motion.div>
          </Col>

          {/* Reports Visibility Toggles */}
          <Col xs={24}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card
                className="rounded-xl border-slate-200"
                title={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconMicrophone className="text-blue-500 text-base" />
                      <Text strong className="text-base">Reports</Text>
                      <Tooltip title="Configure which reports are available in the reports section">
                        <IconQuestionMark className="text-slate-400 text-sm" />
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={Object.values(reportsToggles).every(v => v)}
                        onChange={toggleAllReports}
                      />
                      <Text 
                        className="cursor-pointer font-sans" 
                        onClick={() => toggleAllReports(!Object.values(reportsToggles).every(v => v))}
                      >
                        Select All
                      </Text>
                    </div>
                  </div>
                }
              >
                {isLoading ? (
                  <Skeleton.Input active block style={{ height: 128 }} />
                ) : (
                  <Row gutter={[16, 16]}>
                    {Object.entries(reportsToggles).map(([key, value]) => (
                      <Col xs={24} sm={12} lg={8} xl={6} key={key}>
                        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <Switch
                            checked={value}
                            onChange={(checked) => 
                              setReportsToggles({ ...reportsToggles, [key]: checked })
                            }
                          />
                          <Text className="cursor-pointer font-sans">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace('Report', '')}
                          </Text>
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card>
            </motion.div>
          </Col>

          {/* Alert Configurations */}
          <Col xs={24}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card
                className="rounded-xl border-slate-200"
                title={
                  <div className="flex items-center gap-2">
                    <IconBell className="text-blue-400 text-base" />
                    <Text strong className="text-base">Alert Configurations</Text>
                    <Tooltip title="Configure alert thresholds and recipient email addresses">
                      <IconQuestionMark className="text-slate-400 text-sm" />
                    </Tooltip>
                  </div>
                }
              >
                {isLoading ? (
                  <Skeleton.Input active block style={{ height: 384 }} />
                ) : (
                  <Table
                    dataSource={alertConfigs.map((config, index) => ({
                      key: index,
                      ...config,
                      icon: config.icon
                    }))}
                    columns={[
                      {
                        title: 'Alert Name',
                        dataIndex: 'name',
                        key: 'name',
                        render: (text: string, record: any) => {
                          const IconComponent = record.icon;
                          return (
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                <IconComponent className="text-blue-500 text-xl" />
                              </div>
                              <div>
                                <div className="font-medium font-sans">{text}</div>
                                <div className="text-sm text-gray-500 font-sans">{record.description}</div>
                              </div>
                            </div>
                          );
                        }
                      },
                      {
                        title: 'Threshold',
                        dataIndex: 'threshold',
                        key: 'threshold',
                        align: 'right',
                        width: 120,
                        render: (threshold: number, record: any) => (
                          record.editThreshold ? (
                            <div className="flex items-center justify-end gap-1">
                              <Input
                                type="number"
                                value={threshold}
                                className="w-15 h-8 text-right"
                              />
                              <span className="text-sm">{record.thresholdType}</span>
                              <Button
                                type="text"
                                size="small"
                                className="text-emerald-500 h-6 w-6"
                                onClick={() => handleSaveThreshold(record)}
                              >
                                <IconEdit className="text-xs" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1">
                              <span>{threshold} {record.thresholdType}</span>
                              <Button
                                type="text"
                                size="small"
                                className="h-6 w-6"
                                onClick={() => handleEditThreshold(record)}
                              >
                                <IconEdit className="text-xs" />
                              </Button>
                            </div>
                          )
                        )
                      },
                      {
                        title: 'Recipients',
                        dataIndex: 'recipients',
                        key: 'recipients',
                        align: 'right',
                        width: 120,
                        render: (recipients: string, record: any) => (
                          <div className="flex items-center justify-end gap-1">
                            <span>{recipients}</span>
                            <Button
                              type="text"
                              size="small"
                              className="h-6 w-6"
                              onClick={() => handleEditRecipients(record)}
                            >
                              <IconEdit className="text-xs" />
                            </Button>
                          </div>
                        )
                      },
                      {
                        title: 'Message Template',
                        key: 'messageTemplate',
                        align: 'center',
                        width: 140,
                        render: (_, record: any) => (
                          <Button
                            type="default"
                            size="small"
                            icon={<IconEye className="text-xs" />}
                            onClick={() => handleViewMessageTemplate(record)}
                          >
                            View
                          </Button>
                        )
                      }
                    ]}
                    pagination={false}
                    className="font-sans"
                  />
                )}
              </Card>
            </motion.div>
          </Col>
        </Row>
      </div>

      {/* Dialogs and Drawers */}
      <UpdateCategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        isUpdatingChild={isUpdatingChild}
        updatingCurrent={updatingCurrent}
        selectedNode={selectedCategoryNode}
        categories={categories}
        onSubmit={handleCategorySubmit}
      />

      <Drawer
        title="Import Categories"
        open={importCategoriesOpen}
        onClose={() => setImportCategoriesOpen(false)}
        width={512}
      >
        <ImportCategories />
      </Drawer>

      <Drawer
        title="Update Recipients"
        open={updateRecipientsOpen}
        onClose={() => setUpdateRecipientsOpen(false)}
        width={512}
      >
        <UpdateRecipients />
      </Drawer>

      <Drawer
        title="Alert Message Template"
        open={updateMessageTemplateOpen}
        onClose={() => setUpdateMessageTemplateOpen(false)}
        width={512}
      >
        <UpdateAlertMessageTemplate
          messageTemplateHeader={selectedAlertConfig?.messageTemplateHeader}
          messageTemplate={selectedAlertConfig?.messageTemplate}
        />
      </Drawer>

      <AIHelper />
    </ConfigProvider>
  );
}
