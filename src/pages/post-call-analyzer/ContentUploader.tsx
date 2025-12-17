import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  CloudUpload,
  FileAudio,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Play,
  Trash2,
  RefreshCw
} from "lucide-react";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: "pending" | "uploading" | "analyzing" | "completed" | "failed";
  progress: number;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

export default function ContentUploader() {
  const { setShowModuleTabs } = useModule();
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setShowModuleTabs(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => {
      setShowModuleTabs(true);
      clearTimeout(timer);
    };
  }, [setShowModuleTabs]);

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
      toast.error("Only .wav files are supported");
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
      toast.error("Please add files to upload");
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
              toast.success("Analysis completed successfully!");
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
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case "analyzing":
        return <RefreshCw className="h-4 w-4 animate-spin text-amber-500" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileAudio className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">Uploading</Badge>;
      case "analyzing":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30">Analyzing</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">Completed</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold tracking-tight">
                  Content Uploader
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Upload audio files for analysis and processing
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
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
                      <CloudUpload className={`h-12 w-12 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
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
                          variant="ghost"
                          size="sm"
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
                                    <Progress value={file.progress} className="h-1.5" />
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {getStatusBadge(file.status)}
                              
                              {file.status === "pending" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => removeFile(file.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}

                              {file.status === "completed" && (
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Play className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Upload Button */}
                      <div className="flex justify-end pt-4">
                        <Button
                          size="lg"
                          className="gap-2"
                          onClick={simulateUpload}
                          disabled={isAnalyzing || files.every(f => f.status === "completed")}
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />
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
          </CardContent>
        </Card>
      </div>
      <AIHelper />
    </>
  );
}
