import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Recipient {
  name: string;
}

export default function UpdateRecipients() {
  const [contentLoading, setContentLoading] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [inputValue, setInputValue] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddRecipient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = inputValue.trim();

      if (value) {
        if (!validateEmail(value)) {
          toast.error("Please enter a valid email address");
          return;
        }

        if (recipients.some((r) => r.name === value)) {
          toast.error("This email is already added");
          return;
        }

        setRecipients([...recipients, { name: value }]);
        setInputValue("");
        toast.success("Recipient added");
      }
    }
  };

  const handleRemoveRecipient = (recipient: Recipient) => {
    setRecipients(recipients.filter((r) => r.name !== recipient.name));
    toast.success("Recipient removed");
  };

  const handleUpdate = () => {
    toast.success("Recipients updated successfully");
  };

  if (contentLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recipients">Recipients Email Address</Label>
        <div className="space-y-2">
          {recipients.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg border min-h-[60px]">
              {recipients.map((recipient, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {recipient.name}
                  <button
                    onClick={() => handleRemoveRecipient(recipient)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <Input
            id="recipients"
            placeholder="Enter recipient email address (press Enter or comma to add)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleAddRecipient}
          />
          <p className="text-xs text-muted-foreground">
            Press Enter or comma to add multiple email addresses
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleUpdate}>Update</Button>
      </div>
    </div>
  );
}
