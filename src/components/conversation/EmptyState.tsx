import { motion } from "framer-motion";
import { IconFileOff, IconAlertCircle, IconRefresh, IconInbox } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  type: 'no-data' | 'error';
  message: string;
  onRetry?: () => void;
}

export function EmptyState({ type, message, onRetry }: EmptyStateProps) {
  const isError = type === 'error';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
        className={cn(
          "rounded-2xl p-5 mb-6 relative",
          isError 
            ? "bg-destructive/10 text-destructive" 
            : "bg-muted text-muted-foreground"
        )}
      >
        {/* Decorative rings */}
        <div className={cn(
          "absolute inset-0 rounded-2xl animate-pulse",
          isError ? "bg-destructive/5" : "bg-primary/5"
        )} />
        
        {isError ? (
          <IconAlertCircle className="h-10 w-10 relative z-10" />
        ) : (
          <IconInbox className="h-10 w-10 relative z-10" />
        )}
      </motion.div>
      
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-semibold mb-2 text-foreground"
      >
        {isError ? 'Something went wrong' : 'No Data Found'}
      </motion.h3>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed"
      >
        {message}
      </motion.p>
      
      {isError && onRetry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            onClick={onRetry} 
            variant="outline" 
            size="sm"
            className="rounded-full px-6 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
          >
            <IconRefresh className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
