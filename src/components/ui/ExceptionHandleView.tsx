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

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const iconPulseVariants = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.05, 1],
    transition: { 
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const floatVariants = {
  initial: { y: 0 },
  animate: { 
    y: [-4, 4, -4],
    transition: { 
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

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
  const getIconConfig = () => {
    const baseIconClass = "h-12 w-12";
    
    switch (type) {
      case 'loading':
        return {
          icon: <Loader2 className={cn(baseIconClass, "text-primary")} />,
          containerClass: "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20",
          animate: true,
          spin: true
        };
      case '200':
        return {
          icon: <SearchX className={cn(baseIconClass, "text-slate-500")} />,
          containerClass: "bg-gradient-to-br from-slate-100 via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-700",
          animate: true,
          spin: false
        };
      case '204':
      case '203':
        return {
          icon: <Inbox className={cn(baseIconClass, "text-slate-400")} />,
          containerClass: "bg-gradient-to-br from-slate-100 via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-700",
          animate: true,
          spin: false
        };
      case '404':
        return {
          icon: <FileQuestion className={cn(baseIconClass, "text-blue-500")} />,
          containerClass: "bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-blue-950 dark:via-blue-900/50 dark:to-slate-950 border border-blue-200 dark:border-blue-800",
          animate: true,
          spin: false
        };
      case '500':
        return {
          icon: <AlertTriangle className={cn(baseIconClass, "text-red-500")} />,
          containerClass: "bg-gradient-to-br from-red-100 via-red-50 to-white dark:from-red-950 dark:via-red-900/50 dark:to-slate-950 border border-red-200 dark:border-red-800 shadow-red-500/10",
          animate: true,
          spin: false
        };
      case '503':
        return {
          icon: <WifiOff className={cn(baseIconClass, "text-amber-500")} />,
          containerClass: "bg-gradient-to-br from-amber-100 via-amber-50 to-white dark:from-amber-950 dark:via-amber-900/50 dark:to-slate-950 border border-amber-200 dark:border-amber-800",
          animate: true,
          spin: false
        };
      case 'no-records':
        return {
          icon: <FolderPlus className={cn(baseIconClass, "text-emerald-500")} />,
          containerClass: "bg-gradient-to-br from-emerald-100 via-emerald-50 to-white dark:from-emerald-950 dark:via-emerald-900/50 dark:to-slate-950 border border-emerald-200 dark:border-emerald-800",
          animate: true,
          spin: false
        };
      default:
        return {
          icon: null,
          containerClass: "",
          animate: false,
          spin: false
        };
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'loading':
        return justLoading ? 'Loading...' : 'Fetching data...';
      case '200':
        return `No matches found for "${content}"`;
      case '204':
      case '203':
        return 'No content available';
      case '404':
        return 'Page not found';
      case '500':
        return 'Something went wrong';
      case '503':
        return 'Connection lost';
      case 'no-records':
        return 'Start fresh';
      default:
        return 'Missing exception type';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'loading':
        return justLoading ? '' : 'Please wait while we prepare your content...';
      case '200':
        return 'Try adjusting your search terms or filters to find what you\'re looking for';
      case '204':
        return 'There\'s nothing here yet. Check back later for updates';
      case '203':
        return 'No results match your current criteria';
      case '404':
        return 'The page you\'re looking for doesn\'t exist or has been moved to a new location';
      case '500':
        return 'We encountered an unexpected error. Our team has been notified';
      case '503':
        return 'Unable to reach the server. Please check your internet connection and try again';
      case 'no-records':
        return 'No records exist yet. Create your first item to get started';
      default:
        return 'An unknown error has occurred';
    }
  };

  const iconConfig = getIconConfig();

  const renderActionButton = () => {
    const buttonClass = "rounded-full px-8 py-2.5 font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5";
    
    switch (type) {
      case '404':
        return (
          <motion.div variants={itemVariants}>
            <Button 
              onClick={() => onLinkClick?.(linkUrl)}
              variant="default"
              className={cn(buttonClass, "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600")}
            >
              Back to Home
            </Button>
          </motion.div>
        );
      case '500':
        return (
          <motion.div variants={itemVariants}>
            <Button 
              onClick={onTryAgain}
              variant="default"
              className={cn(buttonClass, "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600")}
            >
              Try Again
            </Button>
          </motion.div>
        );
      case '503':
        return (
          <motion.div variants={itemVariants}>
            <Button 
              onClick={() => onLinkClick?.(linkUrl)}
              variant="default"
              className={cn(buttonClass, "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600")}
            >
              Retry Connection
            </Button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className={cn(
          "flex items-center justify-center min-h-[350px] w-full p-8",
          className
        )}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="flex flex-col items-center text-center max-w-lg space-y-8">
          {/* Animated Icon Container */}
          {iconConfig.icon && (
            <motion.div 
              variants={itemVariants}
              className="relative"
            >
              {/* Glow effect */}
              <div className={cn(
                "absolute inset-0 rounded-3xl blur-xl opacity-40",
                type === '500' && "bg-red-400",
                type === '404' && "bg-blue-400",
                type === '503' && "bg-amber-400",
                type === 'loading' && "bg-primary",
                type === 'no-records' && "bg-emerald-400",
                (type === '200' || type === '204' || type === '203') && "bg-slate-400"
              )} />
              
              <motion.div 
                className={cn(
                  "relative p-8 rounded-3xl backdrop-blur-sm shadow-2xl",
                  iconConfig.containerClass
                )}
                variants={iconConfig.spin ? undefined : floatVariants}
                initial="initial"
                animate={iconConfig.animate ? "animate" : "initial"}
              >
                {iconConfig.spin ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  >
                    {iconConfig.icon}
                  </motion.div>
                ) : (
                  <motion.div
                    variants={iconPulseVariants}
                    initial="initial"
                    animate="animate"
                  >
                    {iconConfig.icon}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* Title */}
          <motion.h5 
            variants={itemVariants}
            className="text-2xl font-bold text-foreground tracking-tight leading-tight"
          >
            {title || getTitle()}
          </motion.h5>

          {/* Description */}
          {getDescription() && (
            <motion.p 
              variants={itemVariants}
              className="text-base text-muted-foreground leading-relaxed max-w-md"
            >
              {getDescription()}
            </motion.p>
          )}

          {/* Action Button */}
          {renderActionButton()}

          {/* Loading indicator dots */}
          {type === 'loading' && (
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-1.5"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary/60"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExceptionHandleView;
