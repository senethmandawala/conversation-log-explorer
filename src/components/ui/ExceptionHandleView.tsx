import React from 'react';
import { 
  Loader2, 
  SearchX, 
  Inbox, 
  FileQuestion, 
  AlertTriangle, 
  WifiOff, 
  FolderPlus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ExceptionType = 
  | 'loading'
  | '200' 
  | '204'
  | '203'
  | '404'
  | '500'
  | '503'
  | 'no-records'
  | '';

interface ExceptionHandleViewProps {
  type?: ExceptionType;
  justLoading?: boolean;
  title?: string;
  content?: string;
  linkUrl?: string;
  onTryAgain?: () => void;
  onLinkClick?: (url: string) => void;
  className?: string;
}

export const ExceptionHandleView: React.FC<ExceptionHandleViewProps> = ({
  type = '',
  justLoading = false,
  title = '',
  content = 'Data',
  linkUrl = '/',
  onTryAgain,
  onLinkClick,
  className = ''
}) => {
  const getIcon = () => {
    const iconClassName = "h-16 w-16 text-muted-foreground";
    
    switch (type) {
      case 'loading':
        return <Loader2 className={cn(iconClassName, "animate-spin text-primary")} />;
      case '200':
        return <SearchX className={iconClassName} />;
      case '204':
      case '203':
        return <Inbox className={iconClassName} />;
      case '404':
        return <FileQuestion className={iconClassName} />;
      case '500':
        return <AlertTriangle className={cn(iconClassName, "text-destructive")} />;
      case '503':
        return <WifiOff className={iconClassName} />;
      case 'no-records':
        return <FolderPlus className={iconClassName} />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'loading':
        return justLoading ? 'Loading...' : 'Fetching data...';
      case '200':
        return `No matches found for ${content}`;
      case '204':
      case '203':
        return 'No content available';
      case '404':
        return 'Page not found';
      case '500':
        return 'Something went wrong';
      case '503':
        return 'No internet connection';
      case 'no-records':
        return 'Add new items';
      default:
        return 'Missing exception type';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'loading':
        return justLoading ? '' : 'Please wait while we load your data...';
      case '200':
        return 'We couldn\'t find any results matching your search criteria';
      case '204':
        return 'There is no content available at the moment';
      case '203':
        return 'No results found for the given criteria';
      case '404':
        return 'The page you\'re looking for doesn\'t exist or has been moved';
      case '500':
        return 'An unexpected error occurred on our servers. Please try again';
      case '503':
        return 'Unable to connect to the server. Please check your internet connection';
      case 'no-records':
        return 'No records have been created yet. Start by adding your first item';
      default:
        return 'An unknown error occurred';
    }
  };

  const renderActionButton = () => {
    switch (type) {
      case '404':
        return (
          <Button 
            onClick={() => onLinkClick?.(linkUrl)}
            variant="default"
          >
            Back to Home
          </Button>
        );
      case '500':
        return (
          <Button 
            onClick={onTryAgain}
            variant="default"
          >
            Try Again
          </Button>
        );
      case '503':
        return (
          <Button 
            onClick={() => onLinkClick?.(linkUrl)}
            variant="default"
          >
            Retry
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "flex items-center justify-center min-h-[300px] w-full p-8",
      className
    )}>
      <div className="flex flex-col items-center text-center max-w-md space-y-4">
        <div className="p-4 rounded-full bg-muted/50">
          {getIcon()}
        </div>
        <h5 className="text-xl font-semibold text-foreground tracking-tight">
          {title || getTitle()}
        </h5>
        {getDescription() && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {getDescription()}
          </p>
        )}
        {renderActionButton()}
      </div>
    </div>
  );
};

export default ExceptionHandleView;
