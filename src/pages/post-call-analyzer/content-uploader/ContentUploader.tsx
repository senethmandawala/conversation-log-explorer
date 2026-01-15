import { useEffect, useState, useCallback } from "react";
import { 
  Card, 
  Button, 
  Tag, 
  Space, 
  Row, 
  Col, 
  Typography,
  Skeleton,
  ConfigProvider,
  Upload,
  Progress,
  message
} from "antd";
import { 
  IconUpload,
  IconCloudUpload,
  IconMicrophone,
  IconX,
  IconCircleCheck,
  IconAlertCircle,
  IconLoader2,
  IconPlayerPlay,
  IconTrash,
  IconRefresh
} from "@tabler/icons-react";
import { AIHelper } from "@/components/post-call/AIHelper";
import { motion, AnimatePresence } from "framer-motion";
import { StatCard } from "@/components/ui/stat-card";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: "pending" | "uploading" | "analyzing" | "completed" | "failed";
  progress: number;
}

const { Title, Text } = Typography;

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

export default function ContentUploader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const wavFiles = droppedFiles.filter(file => file.name.endsWith(".wav"));
    
    if (wavFiles.length !== droppedFiles.length) {
      message.error("Only .wav files are supported");
    }

    const newFiles: UploadedFile[] = wavFiles.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: formatFileSize(file.size),
      status: "pending",
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const selectedFiles = Array.from(e.target.files);
    const wavFiles = selectedFiles.filter(file => file.name.endsWith(".wav"));

    const newFiles: UploadedFile[] = wavFiles.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: formatFileSize(file.size),
      status: "pending",
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const simulateUpload = () => {
    if (files.length === 0) {
      message.error("Please add files to upload");
      return;
    }

    setIsAnalyzing(true);

    // Simulate upload progress
    files.forEach((file, index) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          setFiles(prev => prev.map(f => 
            f.id === file.id 
              ? { ...f, status: "analyzing", progress: 100 }
              : f
          ));

          // Simulate analysis completion
          setTimeout(() => {
            setFiles(prev => prev.map(f => 
              f.id === file.id 
                ? { ...f, status: "completed" }
                : f
            ));

            // Check if all files are done
            setTimeout(() => {
              setIsAnalyzing(false);
              message.success("Analysis completed successfully!");
            }, 500);
          }, 2000 + index * 500);
        } else {
          setFiles(prev => prev.map(f => 
            f.id === file.id 
              ? { ...f, status: "uploading", progress: Math.min(progress, 100) }
              : f
          ));
        }
      }, 200);
    });
  };

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return <IconLoader2 className="text-primary animate-spin" />;
      case "analyzing":
        return <IconRefresh className="text-amber-500 animate-spin" />;
      case "completed":
        return <IconCircleCheck className="text-green-500" />;
      case "failed":
        return <IconAlertCircle className="text-red-500" />;
      default:
        return <IconMicrophone className="text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return <Tag color="blue">Uploading</Tag>;
      case "analyzing":
        return <Tag color="orange">Analyzing</Tag>;
      case "completed":
        return <Tag color="green">Completed</Tag>;
      case "failed":
        return <Tag color="red">Failed</Tag>;
      default:
        return <Tag>Pending</Tag>;
    }
  };

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Card: {
              headerBg: 'transparent',
            },
            Button: {
              borderRadius: 8,
            },
            Upload: {
              borderRadius: 8,
            },
          },
        }}
      >
        <div className="p-6 space-y-6">
          <Card
            className="rounded-xl border-slate-200"
            styles={{
              header: { borderBottom: '1px solid #e2e8f0', padding: '16px 24px' },
              body: { padding: 24 }
            }}
            title={
              <div className="flex items-center gap-3">
                <div className="w-[42px] h-[42px] rounded-xl bg-blue-50 flex items-center justify-center">
                  <IconUpload className="text-blue-500 text-xl" />
                </div>
                <div>
                  <Title level={5} className="!m-0 !font-semibold">Content Uploader</Title>
                  <Text type="secondary" className="text-[13px]">
                    Upload audio files for analysis and processing
                  </Text>
                </div>
              </div>
            }
          >
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="space-y-6">
                {/* Drop Zone */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
                    ${isDragging 
                      ? "border-primary bg-primary/5 scale-[1.02]" 
                      : "border-border/50 hover:border-primary/50 hover:bg-muted/30"
                    }
                  `}
                >
                  <input
                    type="file"
                    accept=".wav"
                    multiple
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div className="flex flex-col items-center gap-4">
                    <motion.div
                      animate={{ y: isDragging ? -10 : 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`
                        p-6 rounded-full transition-colors
                        ${isDragging ? "bg-primary/20" : "bg-muted"}
                      `}
                    >
                      <IconCloudUpload className={`text-6xl ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                    </motion.div>
                    
                    <div>
                      <p className="text-lg font-medium">
                        {isDragging ? "Drop files here" : "Drag & drop files here"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        or <span className="text-primary font-medium cursor-pointer hover:underline">browse</span> to choose files
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                      <p>Supported file types: <span className="font-medium">.wav</span></p>
                      <p>Maximum file size: <span className="font-medium">100 MB</span></p>
                    </div>
                  </div>
                </motion.div>

                {/* File List */}
                <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Files ({files.length})</h3>
                        <Button
                          type="text"
                          onClick={() => setFiles([])}
                          disabled={isAnalyzing}
                        >
                          Clear All
                        </Button>
                      </div>

                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {files.map((file, index) => (
                          <motion.div
                            key={file.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border/50"
                          >
                            <div className="p-2 bg-primary/10 rounded-lg">
                              {getStatusIcon(file.status)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium truncate">{file.name}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-xs text-muted-foreground">{file.size}</span>
                                {(file.status === "uploading" || file.status === "analyzing") && (
                                  <div className="flex-1 max-w-48">
                                    <Progress percent={file.progress} size="small" />
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {getStatusBadge(file.status)}
                              
                              {file.status === "pending" && (
                                <Button
                                  type="text"
                                  icon={<IconX />}
                                  onClick={() => removeFile(file.id)}
                                  className="h-8 w-8"
                                />
                              )}

                              {file.status === "completed" && (
                                <Button 
                                  type="text" 
                                  icon={<IconPlayerPlay />}
                                  className="h-8 w-8"
                                />
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Upload Button */}
                      <div className="flex justify-end pt-4">
                        <Button
                          type="primary"
                          size="large"
                          onClick={simulateUpload}
                          disabled={isAnalyzing || files.every(f => f.status === "completed")}
                        >
                          {isAnalyzing ? (
                            <>
                              <IconLoader2 className="animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <IconUpload />
                              Upload & Analyze
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </Card>
        </div>
      </ConfigProvider>
      <AIHelper />
    </>
  );
}
