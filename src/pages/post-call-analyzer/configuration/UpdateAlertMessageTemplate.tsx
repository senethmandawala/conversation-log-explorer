import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface UpdateAlertMessageTemplateProps {
  messageTemplateHeader?: string;
  messageTemplate?: string;
}

export default function UpdateAlertMessageTemplate({
  messageTemplateHeader: initialHeader = "",
  messageTemplate: initialTemplate = "",
}: UpdateAlertMessageTemplateProps) {
  const [contentLoading, setContentLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [messageTemplateHeader, setMessageTemplateHeader] = useState(initialHeader);
  const [messageTemplate, setMessageTemplate] = useState(initialTemplate);
  const messageTemplateHint = "Available Placeholders: {agent_name}, {current_value}, {threshold}";

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleUpdate = () => {
    setIsEditMode(false);
    toast.success("Message template updated successfully");
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setMessageTemplateHeader(initialHeader);
    setMessageTemplate(initialTemplate);
  };

  if (contentLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="space-y-4">
      {isEditMode ? (
        <>
          <p className="text-sm text-muted-foreground">
            Customize the message template for this alert. Use placeholders to insert dynamic values.
          </p>

          <div className="space-y-2">
            <Label htmlFor="message-header">Message Header</Label>
            <Input
              id="message-header"
              placeholder="Enter Message Header"
              value={messageTemplateHeader}
              onChange={(e) => setMessageTemplateHeader(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message-template">Message Template</Label>
            <Textarea
              id="message-template"
              placeholder="Enter Message Template"
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              rows={10}
            />
            <p className="text-xs text-muted-foreground">{messageTemplateHint}</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save</Button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Message Header</Label>
            <h6 className="text-base font-semibold">{messageTemplateHeader}</h6>
          </div>

          <Card className="border">
            <CardContent className="p-3">
              <Label className="text-sm text-muted-foreground mb-2 block">Message Template</Label>
              <p className="text-sm whitespace-pre-wrap">{messageTemplate}</p>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleEdit}>Edit</Button>
          </div>
        </>
      )}
    </div>
  );
}
