import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Upload, Trash2, Info, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ImportCategories() {
  const [contentLoading, setContentLoading] = useState(false);
  const [fileAccepted, setFileAccepted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const MaximumFileSize = "20";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileAccepted(true);
    }
  };

  const removeFile = () => {
    setFileAccepted(false);
  };

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      setFileAccepted(false);
    }, 2000);
  };

  if (contentLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Import categories from a CSV file. You can download a sample file to see the required format.
      </p>

      <Card className="border">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Download sample file</span>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {!fileAccepted ? (
          <div>
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-10 w-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground text-center">
                  <span className="font-semibold">Drag & drop files here</span>
                  <br />
                  or
                  <br />
                  <span className="font-bold border-b">Choose files</span>
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileChange}
              />
            </label>
            <div className="flex justify-between flex-wrap mt-2 text-xs text-muted-foreground">
              <span>Supported file types: *.csv</span>
              <span>File size max: {MaximumFileSize} MB</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Upload File</Label>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <span className="text-sm break-all">File_name_goes_here.csv</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={removeFile}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="replace-existing"
                checked={replaceExisting}
                onCheckedChange={setReplaceExisting}
              />
              <Label htmlFor="replace-existing" className="text-sm cursor-pointer">
                Replace existing category list
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>If enabled, existing categories will be replaced. Otherwise, they will be merged.</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>File size maximum: {MaximumFileSize} MB</span>
              </div>
              <Button onClick={handleUpload} disabled={isUploading} className="gap-2">
                {isUploading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
