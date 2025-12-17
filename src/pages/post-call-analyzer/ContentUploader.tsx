import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";

export default function ContentUploader() {
  const { setShowModuleTabs } = useModule();

  useEffect(() => {
    setShowModuleTabs(true);
    return () => setShowModuleTabs(true);
  }, [setShowModuleTabs]);

  return (
    <>
    <div className="p-6">
      <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold tracking-tight">
                Content Uploader
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Upload and manage content
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Content Uploader content coming soon...
          </div>
        </CardContent>
      </Card>
    </div>
      <AIHelper />
    </>
  );
}
