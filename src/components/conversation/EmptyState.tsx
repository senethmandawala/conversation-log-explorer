import { FileX, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type: 'no-data' | 'error';
  message: string;
  onRetry?: () => void;
}

export function EmptyState({ type, message, onRetry }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        {type === 'no-data' ? (
          <FileX className="h-8 w-8 text-muted-foreground" />
        ) : (
          <AlertCircle className="h-8 w-8 text-destructive" />
        )}
      </div>
      <h3 className="text-lg font-medium mb-2">
        {type === 'no-data' ? 'No Data Found' : 'Something went wrong'}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{message}</p>
      {type === 'error' && onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}
