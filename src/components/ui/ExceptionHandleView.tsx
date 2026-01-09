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
import { motion, AnimatePresence } from 'framer-motion';

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button 
              onClick={() => onLinkClick?.(linkUrl)}
              variant="default"
              className="rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Back to Home
            </Button>
          </motion.div>
        );
      case '500':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button 
              onClick={onTryAgain}
              variant="default"
              className="rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Try Again
            </Button>
          </motion.div>
        );
      case '503':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button 
              onClick={() => onLinkClick?.(linkUrl)}
              variant="default"
              className="rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Retry
            </Button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Animation variants for different types
  const getContainerVariants = () => {
    switch (type) {
      case 'loading':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 }
        };
      case '500':
        return {
          initial: { opacity: 0, y: 50, rotateX: 15 },
          animate: { opacity: 1, y: 0, rotateX: 0 },
          exit: { opacity: 0, y: -50, rotateX: -15 }
        };
      case '404':
        return {
          initial: { opacity: 0, x: -50, rotateY: 15 },
          animate: { opacity: 1, x: 0, rotateY: 0 },
          exit: { opacity: 0, x: 50, rotateY: -15 }
        };
      case '503':
        return {
          initial: { opacity: 0, scale: 0.5, rotate: 180 },
          animate: { opacity: 1, scale: 1, rotate: 0 },
          exit: { opacity: 0, scale: 0.5, rotate: -180 }
        };
      default:
        return {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -30 }
        };
    }
  };

  const getIconVariants = () => {
    switch (type) {
      case 'loading':
        return {
          initial: { rotate: 0 },
          animate: { rotate: 360 },
          transition: { duration: 2, repeat: Infinity, ease: "linear" }
        };
      case '500':
        return {
          initial: { scale: 0, rotate: -180 },
          animate: { scale: 1, rotate: 0 },
          transition: { type: "spring", damping: 10, stiffness: 100 }
        };
      case '404':
        return {
          initial: { scale: 0, rotate: 180 },
          animate: { scale: 1, rotate: 0 },
          transition: { type: "spring", damping: 15, stiffness: 100 }
        };
      case '503':
        return {
          initial: { scale: 0 },
          animate: { scale: [1, 1.2, 1] },
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        };
      default:
        return {
          initial: { scale: 0 },
          animate: { scale: 1 },
          transition: { type: "spring", damping: 20, stiffness: 100 }
        };
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className={cn(
          "flex items-center justify-center min-h-[300px] w-full p-8",
          className
        )}
        variants={getContainerVariants()}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center text-center max-w-md space-y-6">
          {/* Animated Icon Container */}
          <motion.div 
            className={cn(
              "p-6 rounded-full bg-muted/50 backdrop-blur-sm",
              type === '500' && "bg-destructive/10 border border-destructive/20",
              type === '404' && "bg-blue-50 border border-blue-200",
              type === '503' && "bg-orange-50 border border-orange-200"
            )}
            variants={getIconVariants()}
            initial="initial"
            animate="animate"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            {getIcon()}
          </motion.div>

          {/* Animated Title */}
          <motion.h5 
            className="text-xl font-semibold text-foreground tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {title || getTitle()}
          </motion.h5>

          {/* Animated Description */}
          {getDescription() && (
            <motion.p 
              className="text-sm text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {getDescription()}
            </motion.p>
          )}

          {/* Animated Action Button */}
          {renderActionButton()}

          {/* Floating Particles for Error States */}
          {(type === '500' || type === '404' || type === '503') && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-muted-foreground/20"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExceptionHandleView;
