import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { 
  ChevronDown, 
  Image as ImageIcon,
  Globe,
  User,
  Bot,
  PhoneCall
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopHeader() {
  const location = useLocation();
  const isPostCallAnalyzer = location.pathname === "/post-call-analyzer";
  
  const moduleTitle = isPostCallAnalyzer ? "Post Call Analyzer" : "Autopilot";
  const ModuleIcon = isPostCallAnalyzer ? PhoneCall : Bot;

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 bg-card border-b border-border/50 px-6 flex items-center justify-between"
    >
      {/* Left side - Module title and Agent selector */}
      <div className="flex items-center gap-4">
        {/* Module Title */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <ModuleIcon className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-lg font-semibold text-primary">{moduleTitle}</h1>
        </div>

        <div className="h-6 w-px bg-border/60" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 px-4 rounded-xl border-border/60 hover:bg-muted"
            >
              <ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Billing Agent</span>
              <ChevronDown className="h-4 w-4 ml-2 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem>Billing Agent</DropdownMenuItem>
            <DropdownMenuItem>Support Agent</DropdownMenuItem>
            <DropdownMenuItem>Sales Agent</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right side - Language and User */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="h-10 w-10 rounded-full border-border/60 hover:bg-muted"
        >
          <span className="text-sm font-medium">EN</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 px-3 rounded-xl hover:bg-muted flex items-center gap-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  SA
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm hidden sm:inline">super_admin</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
